import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArrowLeft, Save, Trash2, Plus,
  Image as ImageIcon, Loader2, UploadCloud, X
} from 'lucide-react';


import axiosInstance from '../../../utils/axiosInstance';
import { fetchCategories } from '../../../redux/slice/categorySlice';
import categoryAttributes, { sizes } from '../../../data';

import ImageCropper from '../../../Components/ImageCropper';
import productService from '../../../services/productService';
const EditProduct = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items: categories } = useSelector((state) => state.category);
  const [productToEdit, setProductToEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);


  const [existingCoverImages, setExistingCoverImages] = useState([]);
  const [newCoverFiles, setNewCoverFiles] = useState([]);
  const [newCoverPreviews, setNewCoverPreviews] = useState([]);


  const [oldVariants, setOldVariants] = useState([]);
  const [showVariantDetail, setShowVariantDetail] = useState(false);


  const [newVariantParams, setNewVariantParams] = useState({
    colorName: '',
    colorCode: '#000000',
    stock: {}
  });
  const [newVariantFiles, setNewVariantFiles] = useState([]);
  const [newVariantPreviews, setNewVariantPreviews] = useState([]);
  const [variantErrors, setVariantErrors] = useState({});

  const [attributesOptions, setAttributesOptions] = useState([]);


  const [imageToCrop, setImageToCrop] = useState(null)
  const [croppingTarget, setCroppingTarget] = useState(null)
  const [cropQueue, setCropQueue] = useState([]);
  const [currentCropIndex, setCurrentCropIndex] = useState(0);
  const [processedVariantFiles, setProcessedVariantFiles] = useState([]);

  const {
    register, handleSubmit, setValue, getValues, watch, reset,
    formState: { errors }, setError, clearErrors
  } = useForm();


  useEffect(() => {
    dispatch(fetchCategories());
    const fetchData = async () => {
      try {
        const product = await productService.getProductById(id);

        setProductToEdit(product);

        if (product) {
          const defaultData = {
            productName: product.productName,
            productDescription: product.productDescription,
            originalPrice: product.originalPrice,
            salePrice: product.salePrice,
            mainCategory: product.mainCategory?._id || product.mainCategory,
            isListed: product.isListed,
            tags: product.tags ? product.tags.join(', ') : '',
          };

          if (product.attributes) {
            Object.entries(product.attributes).forEach(([key, value]) => {
              setValue(`attributes.${key}`, value);
            });
          }

          setExistingCoverImages(product.coverImages ? [product.coverImages] : []);

          setOldVariants(product.variants || []);
          setLoading(false);

          reset(defaultData);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    };
    fetchData();
  }, [id, dispatch, reset]);



  const selectedCategory = watch('mainCategory');
  useEffect(() => {
    if (categories.length > 0 && selectedCategory) {
      const catObj = categories.find((c) => c._id === selectedCategory);
      if (catObj) setAttributesOptions(categoryAttributes[catObj.categoryName] || []);
    }
  }, [selectedCategory, categories]);



  const handleCoverImagesChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCroppingTarget('cover');
      setImageToCrop(reader.result);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };


  const handleVariantImagesAdd = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (newVariantFiles.length + files.length > 3) {
      setVariantErrors(prev => ({ ...prev, images: 'Max 3 images allowed' }));
      return;
    }
    setVariantErrors(prev => ({ ...prev, images: null }));


    const fileReaders = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    const imagesToCrop = await Promise.all(fileReaders);


    setCropQueue(imagesToCrop);
    setProcessedVariantFiles([]);
    setCurrentCropIndex(0);
    setCroppingTarget('variant');


    setImageToCrop(imagesToCrop[0]);
    e.target.value = '';
  };

  const onCropDone = (croppedFile) => {

    if (croppingTarget === 'cover') {
      setExistingCoverImages([]);

      setNewCoverFiles([croppedFile]);

      const previewUrl = URL.createObjectURL(croppedFile);
      setNewCoverPreviews([previewUrl]);

      clearErrors('coverImages');
      setImageToCrop(null);
      setCroppingTarget(null);
    }
    else if (croppingTarget === 'variant') {

      const updatedProcessed = [...processedVariantFiles, croppedFile];
      setProcessedVariantFiles(updatedProcessed);

      const nextIndex = currentCropIndex + 1;

      if (nextIndex < cropQueue.length) {
        setCurrentCropIndex(nextIndex);
        setImageToCrop(cropQueue[nextIndex]);
      } else {

        const finalFiles = [...newVariantFiles, ...updatedProcessed];
        setNewVariantFiles(finalFiles);

        const newPreviews = updatedProcessed.map(file => URL.createObjectURL(file));
        setNewVariantPreviews([...newVariantPreviews, ...newPreviews]);

        setImageToCrop(null);
        setCroppingTarget(null);
        setCropQueue([]);
        setProcessedVariantFiles([]);
      }
    }
  };

  const onCropCancel = () => {
    setImageToCrop(null);
    setCroppingTarget(null);
    setCropQueue([]);
    setProcessedVariantFiles([]);
  };

  const removeImage = (type, index) => {
    if (type === 'existingCover') {
      setExistingCoverImages(prev => prev.filter((_, i) => i !== index));
    } else if (type === 'newCover') {
      setNewCoverFiles(prev => prev.filter((_, i) => i !== index));
      setNewCoverPreviews(prev => prev.filter((_, i) => i !== index));
    } else if (type === 'newVariant') {
      setNewVariantFiles(prev => prev.filter((_, i) => i !== index));
      setNewVariantPreviews(prev => prev.filter((_, i) => i !== index));
    }
  };


  const handleNewStockChange = (size, value) => {
    setNewVariantParams(prev => ({
      ...prev,
      stock: {
        ...prev.stock,
        [size]: parseInt(value) || 0
      }
    }));
  };

  const handleSaveNewVariant = async () => {
    const errors = {};
    if (!newVariantParams.colorName.trim()) errors.name = "Color Name is required";
    if (newVariantFiles.length !== 3) errors.images = "Exactly 3 images required";

    const hasStock = Object.values(newVariantParams.stock).some(val => val > 0);
    if (!hasStock) errors.stock = "Add stock for at least one size";

    if (Object.keys(errors).length > 0) {
      setVariantErrors(errors);
      return;
    }

    setVariantErrors({});

    const newVariant = {
      productColor: newVariantParams.colorName,
      colorCode: newVariantParams.colorCode,
      variantImages: newVariantPreviews,
      filesToUpload: newVariantFiles,
      stock: newVariantParams.stock,
      isNew: true
    };

    setOldVariants([...oldVariants, newVariant]);
    setNewVariantParams({ colorName: '', colorCode: '#000000', stock: {} });
    setNewVariantFiles([]);
    setNewVariantPreviews([]);
    toast.success("Variant added to list!", {
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  const removeVariant = (index) => {
    setOldVariants(prev => prev.filter((_, i) => i !== index));
  };



  const onSubmit = async (data) => {
    setSubmitting(true);
    try {

      const totalCoverImages = existingCoverImages.length + newCoverFiles.length;
      if (totalCoverImages !== 1) {
        setSubmitting(false);

        setError('coverImages', {
          type: 'manual',
          message: 'You must have exactly 1 cover image.'
        });
      }
      let finalCoverImageString = "";
      if (existingCoverImages.length > 0) {
        finalCoverImageString = existingCoverImages[0];
      }

      else if (newCoverFiles.length > 0) {
        const formData = new FormData();
        formData.append('images', newCoverFiles[0]);
        const res = await productService.uploadMultipleImages(newCoverFiles)
        finalCoverImageString = res.data.urlCollection[0];
      }



      const processedVariants = await Promise.all(oldVariants.map(async (variant, index) => {
        if (variant.isNew && variant.filesToUpload && variant.filesToUpload.length > 0) {
          const vRes = await productService.uploadMultipleImages(variant.filesToUpload)
          return {
            productColor: variant.productColor,
            colorCode: variant.colorCode,
            variantImages: vRes.data.urlCollection,
            stock: variant.stock
          };
        }

        const updatedStock = {};
        let hasChange = false;

        sizes.forEach((size) => {
          const fieldName = `variants.${index}.stock.${size}`;
          const formValue = getValues(fieldName);
          if (formValue !== undefined) {
            updatedStock[size] = Number(formValue);
            hasChange = true;
          } else {
            updatedStock[size] = Number(variant.stock[size] || 0);
          }
        });

        return {
          productColor: variant.productColor,
          colorCode: variant.colorCode,
          variantImages: variant.variantImages,
          stock: hasChange ? updatedStock : variant.stock
        };

      }));


      const payload = {
        ...data,
        tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        coverImages: finalCoverImageString,
        variants: processedVariants,
        attributes: data.attributes || {}
      };


      delete payload.newProductColor;
      delete payload.newColorCode;

      console.log("Submitting Payload:", payload);


      const response = await productService.updateProduct(id, payload);
      console.log(response)
      toast.success("Product updated successfully!", {
        duration: 3000,
        style: {
          background: '#333',
          color: '#fff',
          borderRadius: '10px',
        },
      });
      navigate('/admin/products');

    } catch (error) {
      console.log(error)
    } finally {
      setSubmitting(false);
    }
  };


  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={32} /></div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8 font-sans text-gray-800">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2.5 bg-white border rounded-lg hover:bg-gray-100 shadow-sm">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
      </div>

      <div className="max-w-7xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">

            {/* 1. Basic Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-5 border-b pb-2">General Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Product Name</label>
                  <input {...register('productName', { required: 'Required', minLength: { value: 3, message: 'Min 3 chars' } })} className="w-full p-3 border rounded-lg outline-none focus:border-blue-500" />
                  {errors.productName && <span className="text-xs text-red-500">{errors.productName.message}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea {...register('productDescription', { required: 'Required', minLength: 20 })} className="w-full p-3 border rounded-lg h-32 resize-none outline-none focus:border-blue-500" />
                  {errors.productDescription && <span className="text-xs text-red-500">{errors.productDescription.message}</span>}
                </div>
              </div>
            </div>

            {/* 2. Pricing */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-5 border-b pb-2">Pricing</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Original Price</label>
                  <input type="number" {...register('originalPrice', { required: 'Required', min: 10 })} className="w-full p-3 border rounded-lg" />
                  {errors.originalPrice && <span className="text-xs text-red-500">{errors.originalPrice.message}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sale Price</label>
                  <input type="number" {...register('salePrice', { required: 'Required', min: 1, validate: v => Number(v) < Number(getValues('originalPrice')) || "Must be less than Original" })} className="w-full p-3 border rounded-lg" />
                  {errors.salePrice && <span className="text-xs text-red-500">{errors.salePrice.message}</span>}
                </div>
              </div>
            </div>

            {/* 3. Variants */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-blue-600">
              <div className="flex justify-between mb-5 border-b pb-2">
                <h3 className="text-lg font-bold">Variants</h3>
                <button type="button" onClick={() => setShowVariantDetail(!showVariantDetail)} className="text-sm text-blue-600 font-medium">
                  {showVariantDetail ? 'Hide Details' : 'Show Details'}
                </button>
              </div>

              {/* List */}
              <div className="space-y-4 mb-6">
                {oldVariants.map((v, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full border shadow-sm" style={{ backgroundColor: v.colorCode }}></div>
                        <div>
                          <span className="font-bold text-sm">{v.productColor}</span>
                          {v.isNew && <span className="ml-2 text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded">NEW</span>}
                        </div>
                      </div>
                      <button type="button" onClick={() => removeVariant(i)} className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                    </div>


                    {showVariantDetail && !v.isNew && (
                      <div className="grid grid-cols-6 gap-2 mt-3 pt-3 border-t">
                        {sizes.map(size => (
                          <div key={size} className="text-center">
                            <span className="text-[10px] text-gray-500">{size}</span>
                            <input
                              type="number"
                              defaultValue={v.stock[size]}
                              className="w-full text-center text-sm border rounded p-1"
                              {...register(`variants.${i}.stock.${size}`, { min: 0 })}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    {showVariantDetail && v.isNew && (
                      <div className="grid grid-cols-6 gap-2 mt-3 pt-3 border-t">
                        {Object.entries(v.stock).map(([size, qty]) => (
                          <div key={size} className="text-center">
                            <span className="text-[10px] text-gray-500">{size}</span>
                            <span className="block text-sm font-bold">{qty}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Add New Variant Form  */}
              <div className="pt-6 border-t border-gray-100">
                <h4 className="text-sm font-bold uppercase mb-4 text-gray-700">Add New Variant</h4>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500">Name</label>
                    <input
                      value={newVariantParams.colorName}
                      onChange={(e) => setNewVariantParams({ ...newVariantParams, colorName: e.target.value })}
                      className={`w-full p-2 border rounded ${variantErrors.name ? 'border-red-500' : ''}`}
                      placeholder="Red"
                    />
                    {variantErrors.name && <span className="text-xs text-red-500">{variantErrors.name}</span>}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500">Color</label>
                    <div className="flex items-center gap-2 p-2 border rounded bg-white">
                      <input
                        type="color"
                        value={newVariantParams.colorCode}
                        onChange={(e) => setNewVariantParams({ ...newVariantParams, colorCode: e.target.value })}
                        className="w-6 h-6 border-none p-0"
                      />
                      <span className="text-xs text-gray-500">Pick Color</span>
                    </div>
                  </div>
                </div>

                {/* Image Upload */}
                <div className="mb-4">
                  <label className="text-xs font-bold text-gray-500 mb-2 block">Images (3 Required)</label>
                  <div className="grid grid-cols-4 gap-3">
                    <label className={`flex flex-col items-center justify-center h-20 border-2 border-dashed rounded cursor-pointer hover:bg-gray-50 ${variantErrors.images ? 'border-red-500' : ''}`}>
                      <Plus size={20} className="text-gray-400" />
                      <input type="file" multiple accept="image/*" className="hidden" onChange={handleVariantImagesAdd} />
                    </label>
                    {newVariantPreviews.map((src, i) => (
                      <div key={i} className="relative h-20 rounded border overflow-hidden group">
                        <img src={src} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeImage('newVariant', i)} className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 text-white"><Trash2 size={14} /></button>
                      </div>
                    ))}
                  </div>
                  {variantErrors.images && <span className="text-xs text-red-500 mt-1 block">{variantErrors.images}</span>}
                </div>

                {/* Stock Grid */}
                <div className={`bg-gray-50 p-4 rounded-xl mb-4 ${variantErrors.stock ? 'border border-red-300' : ''}`}>
                  <div className="grid grid-cols-6 gap-2">
                    {sizes.map(size => (
                      <div key={size} className="text-center">
                        <span className="text-[10px] font-bold text-gray-400">{size}</span>
                        <input
                          type="number"
                          placeholder="0"
                          value={newVariantParams.stock[size] || ''}
                          onChange={(e) => handleNewStockChange(size, e.target.value)}
                          className="w-full text-center p-1 border rounded"
                        />
                      </div>
                    ))}
                  </div>
                  {variantErrors.stock && <span className="text-xs text-red-500 mt-2 block">{variantErrors.stock}</span>}
                </div>

                <button type="button" onClick={handleSaveNewVariant} className="w-full bg-gray-900 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-black">
                  <Plus size={16} /> Add to List
                </button>
              </div>
            </div>

            {/* 4. Attributes */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-4">Attributes</h3>
              <div className="grid grid-cols-2 gap-4">
                {attributesOptions.map((attr, i) => (
                  <div key={i}>
                    <label className="text-sm font-medium mb-1 block">{attr.label}</label>
                    <select {...register(`attributes.${attr.label}`, { required: true })} className="w-full p-2 border rounded">
                      <option value="">Select...</option>
                      {attr.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">

            {/* 5. Cover Images - UPDATED UI */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-4">Product Cover Image</h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                {/* Existing */}
                {existingCoverImages.map((url, i) => (
                  <div key={i} className="relative aspect-square rounded border overflow-hidden group">
                    <img src={url} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage('existingCover', i)} className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 text-white"><Trash2 size={16} /></button>
                  </div>
                ))}
                {/* New */}
                {newCoverPreviews.map((url, i) => (
                  <div key={i} className="relative aspect-square rounded border border-green-300 overflow-hidden group">
                    <img src={url} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage('newCover', i)} className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 text-white"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>

              <label className={`flex items-center justify-center w-full h-20 border-2 border-dashed rounded cursor-pointer hover:bg-gray-50 ${errors.coverImages ? 'border-red-500' : ''}`}>
                <UploadCloud className="text-gray-400 mr-2" /> <span className="text-xs text-gray-500">Replace Image</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleCoverImagesChange} />
              </label>
              {errors.coverImages && <span className="text-xs text-red-500 mt-1 block">{errors.coverImages.message}</span>}
            </div>


            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-6">
              <h3 className="text-lg font-bold mb-4">Organization</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Category</label>
                  <select {...register('mainCategory', { required: true })} className="w-full p-2 border rounded">
                    <option value="">Select...</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.categoryName}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Tags</label>
                  <input {...register('tags')} className="w-full p-2 border rounded" placeholder="Cotton, Summer..." />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Status</label>
                  <select {...register('isListed')} className="w-full p-2 border rounded">
                    <option value={true}>Active</option>
                    <option value={false}>Draft</option>
                  </select>
                </div>
              </div>
              <button type="submit" disabled={submitting} className="w-full mt-6 bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 flex justify-center gap-2">
                {submitting ? <Loader2 className="animate-spin" /> : <Save size={18} />} Update Product
              </button>
            </div>
          </div>

        </form>


        {imageToCrop && (
          <ImageCropper
            imageSrc={imageToCrop}
            onCropDone={onCropDone}
            onCropCancel={onCropCancel}
          />
        )}
      </div>
    </div>
  );
};

export default EditProduct;