
import React, { useEffect, useState } from 'react';
import { Image as ImageIcon, Trash2 } from 'lucide-react';
import categoryAttributes, { sizes } from '../../../data';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories , setParentCategories ,setSubCategories } from '../../../redux/slice/categorySlice';
import { useForm } from 'react-hook-form';
import ImageUpload from '../../../Components/ImageUpload';
import axiosInstance from '../../../utils/axiosInstance';
import ImageCropper from '../../../Components/ImageCropper';
import Modal from '../../../Components/Modal';
import productService from '../../../services/productService';

const AddProducts = () => {
  const [selectedCategory, setCategory] = useState('')
  const [attributes, setAttributes] = useState([])
  const [categoryName, setCategoryName] = useState(null)
  const { parentCategories, subCategories, items, isLoading } = useSelector((state) => state.category)
  const { register, handleSubmit, formState: { errors },
    setError, setValue, clearErrors, trigger, getValues } = useForm()
  const [variantImages, setVariantImages] = useState([])
  const [coverImages, setCoverImages] = useState([])
  const [variantsCollection, setVariantCollection] = useState([])
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [submitting , setSubmitting] = useState(false)
  const dispatch = useDispatch()


  const [imageToCrop, setImageToCrop] = useState(null)
  const [croppingTarget, setCroppingTarget] = useState(null)


  const [cropQueue, setCropQueue] = useState([]);
  const [currentCropIndex, setCurrentCropIndex] = useState(0);
  const [processedVariantFiles, setProcessedVariantFiles] = useState([]);

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  useEffect(() => {
    if (items.length > 0) {
      dispatch(setParentCategories(items))
    }
  }, [items])

  useEffect(() => {
    if (selectedCategory) {
      setAttributes(categoryAttributes[categoryName])
    }
  }, [selectedCategory])

  function handleSelectCategory(id) {
    const selected = items.find((cat) => cat._id === id)
    setCategory(selected)
    setCategoryName(selected.categoryName)
    dispatch(setSubCategories(selected))
  }


  const handleVariantImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return;


    const totalFiles = variantImages.length + files.length
    if (totalFiles > 3) {
      setError('variantImages', { type: 'manual', message: '3 images are allowed' })
      return
    }
    clearErrors('variantImages')

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
  }

  function handleCoverImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCroppingTarget('cover');
      setImageToCrop(reader.result);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }


  const onCropDone = (croppedFile) => {

    if (croppingTarget === 'cover') {
      const fileArray = [croppedFile];
      setCoverImages(fileArray);
      setValue('coverImages', fileArray, { shouldValidate: true });
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
        const finalVariantList = [...variantImages, ...updatedProcessed];
        setVariantImages(finalVariantList);
        setValue('variantImages', finalVariantList, { shouldValidate: true });
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


  function handleRemoveImage(type, indexToRemove) {
    if (type === 'cover') {
      const updated = coverImages.filter((_, index) => index !== indexToRemove)
      setCoverImages(updated)
      setValue('coverImages', updated, { shouldValidate: true })
    } else {
      const updated = variantImages.filter((_, index) => index !== indexToRemove)
      setVariantImages(updated)
      setValue('variantImages', updated, { shouldValidate: true })
    }
  }

  function handleAddTag(e) {
    e.preventDefault();
    const cleanTag = tagInput.trim();
    if (!cleanTag || tags.includes(cleanTag)) return;
    const newTags = [...tags, cleanTag];
    setTags(newTags);

    setValue('tags', newTags);

    setTagInput("");
  }


  function handleRemoveTag(indexToRemove) {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(newTags);
    setValue('tags', newTags);
  }

  const handleSaveVariants = async () => {
    console.log('clicked')
    let isValid = true
    const currentValues = getValues()

    if (!currentValues.productColor) {
      setError('productColor', { type: 'manual', message: 'Color name is required' })
      isValid = false
    }
    if (!currentValues.colorCode) {
      setError('colorCode', { type: 'manual', message: ' color code is required' })
      isValid = false
    }

    if (!currentValues.variantImages || currentValues.variantImages.length !== 3) {
      setError("variantImages", { type: "manual", message: "You must upload exactly 3 images for this variant." });
      isValid = false;
    }

    const hasStock = sizes.some((size) => {
      const val = currentValues.stock?.[size]
      return val && parseInt(val) > 0
    })
    if (!hasStock) {
      setError('stock', { type: 'manual', message: 'stock is required' })
      isValid = false
    }
    if (!isValid) return
    try {
      const response = await productService.uploadVariantImages(currentValues.variantImages)
      console.log("response ", response.data)
      const urlCollections = response.data.urlCollection
      const stock = structuredClone(currentValues.stock)
      const newVariant = {
        productColor: currentValues.productColor,
        colorCode: currentValues.colorCode,
        variantImages: urlCollections,
        stock
      }
      console.log('new variant : ', newVariant)
      setVariantCollection((prev) => [...prev, newVariant])
      setValue('productColor', '');
      setValue('colorCode', '#000000');
      setValue('variantImages', []);
      setVariantImages([]);

      sizes.forEach((size) => {
        setValue(`stock.${size}`, '')
      })
      clearErrors('productColor');
      clearErrors('colorCode');
      clearErrors('variantImages');
      clearErrors('stock');
      alert('variant added successfully')
      console.log(newVariant)
    } catch (error) {
      console.log("error")
    }
  }
  function handleRemoveVariant(i) {
    const filtered = variantsCollection.filter((_, index) => i !== index)
    setVariantCollection(filtered)
  }
  function handleModalClose() {
    setShowModal(false);
    navigate('/admin/products');
  }

  const onSubmit = async (data) => {
    try {
      if (!data) return false
      const { productName, productDescription, salePrice, coverImages, mainCategory, subCategory = null, tags, originalPrice } = data
      if (coverImages.length > 0) {
        const response = await productService.uploadMultipleImages(data.coverImages);
        console.log('product image response : ', response.data)
        const urlCollections = response.data.urlCollection

        const formattedAttributes = {}
        if (data.attributes) {
          data.attributes.forEach((item) => {
            formattedAttributes[item.label] = item.value
          })
        }

        const finalData = {
          productName,
          productDescription,
          originalPrice,
          salePrice,
          variants: variantsCollection,
          attributes: formattedAttributes,
          coverImages: urlCollections,
          mainCategory,
          subCategory: subCategory === '' ? null : subCategory,
          tags
        }
        const result = await productService.createProduct(finalData)
          setShowModal(true)  
      }

    } catch (error) {
      console.log(error)
    }
  }

  if (isLoading) {
    return (
      <>
        <h1>Loading...</h1>
      </>
    )
  }
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-800">

      <Modal
        isOpen={showModal}
        title="Success!"
        message="Product Added Succefully."
        onConfirm={handleModalClose}
        type="success"
      />
      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
          <div className="text-sm text-gray-500">Dashboard / Products / Add New Product</div>
        </header>
        <form action="" onSubmit={handleSubmit(onSubmit)} >

          <input
            type="hidden"
            {...register("coverImages", {
              validate: (value) => (value && value.length === 1) || "Please upload exactly 1 COVER image."
            })}
          />
          <input
            type="hidden"
            {...register("variantImages")}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT COLUMN - Product Details */}
            <div className="lg:col-span-2 space-y-6">

              {/* Basic Details Section */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-semibold text-lg mb-4 text-gray-800">Basic Details</h3>
                <div className="space-y-4">
                  {/* Product Title Input */}
                  <div className="space-y-2 w-full">
                    <label className="text-sm font-medium text-gray-700">Product Title</label>
                    <input
                      type="text"
                      placeholder="Product title"
                      {...register('productName', { required: 'Product Name  is Reqquired ', minLength: { value: 3, message: 'Name should be with minimum 3 letters ' }, pattern: { value: /^[A-Za-z' -]+$/, message: 'only letters are allowed as name ' } })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                    {errors.productName && <span className="text-red-500 text-sm mt-1 block">{errors.productName.message}</span>}
                  </div>
                  {/* Description Textarea */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Product Description</label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none"
                      placeholder="Product description"
                      {...register('productDescription', { required: 'Product Description Required ', minLength: { value: 10, message: 'Product Details Should be Contain atleast in 10 words ' }, pattern: { value: /^[A-Za-z0-9,:;.\-'% \n]+$/, message: 'Specila characters are not allowed ' } })}
                    ></textarea>
                    {errors.productDetails && <span className="text-red-500 text-sm mt-1 block">{errors.productDetails.message}</span>}
                  </div>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-semibold text-lg mb-4 text-gray-800">Pricing</h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Regular Price */}
                  <div className="space-y-2 w-full">
                    <label className="text-sm font-medium text-gray-700">Product Regular price</label>
                    <input
                      type='number'
                      placeholder="$0.00"
                      {...register('originalPrice', { required: 'Product price is required', min: { value: 10, message: 'Minimum Price is 10' }, })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                    {errors.originalPrice && <span className="text-red-500 text-sm mt-1 block">{errors.originalPrice.message}</span>}
                  </div>
                  {/* Sale Price */}
                  <div className="space-y-2 w-full">
                    <label className="text-sm font-medium text-gray-700">Product Sale price</label>
                    <input
                      type="number"
                      placeholder="$0.00"
                      {...register('salePrice', { required: 'Sale Price is Required', min: { value: 10, message: 'Minimum Price is 10' } })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                    {errors.salePrice && <span className="text-red-500 text-sm mt-1 block">{errors.salePrice.message}</span>}
                  </div>
                </div>
              </div>

              {/* Variants Section */}

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-semibold text-lg mb-4 text-gray-800">Add Variants</h3>
                <div className="space-y-6">

                  {/* Color Inputs */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 w-full">
                      <label className="text-sm font-medium text-gray-700">Color Name</label>
                      <input type="text" placeholder="Color Name" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" {...register("productColor")} />

                      {errors.productColor && <span className="text-red-500 text-sm mt-1 block">{errors.productColor.message}</span>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Pick your color</label>
                      <input type="color" {...register('colorCode')} className="h-11 w-full p-1 rounded-lg border border-gray-300 cursor-pointer" />
                    </div>
                  </div>

                  {errors.colorCode && (
                    <span className="text-red-500 text-sm mt-1 block">
                      {errors.colorCode.message}
                    </span>
                  )}

                  <ImageUpload
                    label="Images of Product in Specific Color"
                    inputId="variant-input"
                    inputName="variantImages"
                    images={variantImages}
                    onUpload={handleVariantImageUpload}
                    onRemove={(index) => handleRemoveImage('variant', index)}
                  />
                  {errors.variantImages && (
                    <span className="text-red-500 text-sm mt-1 block">
                      {errors.variantImages.message}
                    </span>
                  )}


                </div>
              </div>

              {/* Stock Section */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-semibold text-lg mb-4 text-gray-800">Stock</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {sizes.map((size) => (
                    <div key={size} className="flex items-center gap-2">
                      <span className="w-8 font-semibold text-gray-600">{size}</span>
                      <input type="number" placeholder="0" className="w-full p-2 border border-gray-300 rounded-lg" {
                        ...register(`stock.${size}`)} />
                    </div>
                  ))}
                  {errors.stock && <span className="text-red-500 text-sm mt-1 block">{errors.stock.message}</span>}
                </div>
                <div className="mt-4 flex gap-2">
                  <button type='button' className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700">Cancel</button>
                  <button type='button' onClick={handleSaveVariants} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save</button>
                </div>
              </div>

              {variantsCollection.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="font-bold text-gray-800 mb-4">Saved Variants ({variantsCollection.length})</h4>
                  <div className="space-y-3">
                    {variantsCollection.map((variant, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">

                        {/* Left: Color Info & Image Preview */}
                        <div className="flex items-center gap-4">
                          {/* Color Circle */}
                          <div className="w-8 h-8 rounded-full border border-gray-300 shadow-sm" style={{ backgroundColor: variant.productColor }}></div>

                          <div>
                            <p className="font-bold text-gray-800">{variant.colorName}</p>
                            {/* Stock Summary */}
                            <p className="text-xs text-gray-500 mt-1">
                              Stock: {Object.entries(variant.stock)
                                .filter(([_, qty]) => qty > 0)
                                .map(([size, qty]) => `${size}:${qty}`)
                                .join(', ') || "No stock"}
                            </p>
                          </div>

                          {/* Image Thumbnail (First one) */}
                          {variant.variantImages && variant.variantImages.length > 0 && (
                            <div className="flex gap-1 ml-4">
                              {variant.variantImages.map((file, i) => (
                                <img key={crypto.randomUUID()} src={file} alt="var" className="w-10 h-10 object-cover rounded border border-gray-200" />
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Right: Delete Action */}
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Attributes Section */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-semibold text-lg mb-4 text-gray-800">Product Attributes</h3>
                <div className="space-y-4">
                  {/* Fabric Select */}

                  {attributes.map((atr, ind) => (
                    <div key={ind} className="space-y-2 w-full">
                      <label className="text-sm font-medium text-gray-700">{atr.label}</label>
                      <select
                        className="w-full p-3 border border-gray-300 rounded-lg bg-white outline-none"
                        defaultValue=""
                        {...register(`attributes.${ind}.value`, {
                          required: `${atr.label} is required`
                        })}
                      >
                        <option value="" disabled>Select your {atr.label}</option>
                        {atr.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>

                      {/* Save label also */}
                      <input type="hidden" {...register(`attributes.${ind}.label`)} value={atr.label} />
                    </div>
                  ))}
                  {errors.attributes && <span className="text-red-500 text-sm mt-1 block">{errors.attributes.message}</span>}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - Images & Meta */}
            <div className="space-y-6">

              {/* Image Upload */}

              <ImageUpload
                label="Product Cover Image"
                inputId="cover-input"
                inputName="coverImages"
                images={coverImages}
                onUpload={handleCoverImageUpload}
                onRemove={(index) => handleRemoveImage('cover', index)}
              />

              {errors.coverImages && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.coverImages.message}
                </span>
              )}

              {/* Categories */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                <h3 className="font-semibold text-lg">Categories</h3>


                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Product Category</label>

                  <select className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 outline-none"
                    {
                    ...register("mainCategory", {
                      required: "Category is required",
                      onChange: (e) => handleSelectCategory(e.target.value)
                    })} >
                    <option >select your main category</option>
                    {parentCategories && parentCategories.map((cat) => (
                      <option key={cat._id} value={cat._id} >{cat.categoryName}</option>
                    ))}
                  </select>

                  {errors.mainCategory && <span className="text-red-500 text-sm mt-1 block">{errors.mainCategory.message}</span>}

                  <select className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 outline-none" {...register('subCategory')}>
                    <option value='' disabled >select your sub category</option>
                    {subCategories && subCategories.map((cat) => (
                      <option key={cat._id} value={cat.categoryName}>{cat.categoryName}</option>
                    ))}
                  </select>

                  {errors.subCategory && <span className="text-red-500 text-sm mt-1 block">{errors.subCategory.message}</span>}
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Product Tags</label>

                  {/* Input Group */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Type tag (e.g. Cotton, Summer)"
                      className="flex-1 p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:border-blue-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                    >
                      Add
                    </button>
                  </div>


                  <input type="hidden" {...register('tags', { required: "At least one tag is required" })} />
                  {errors.tags && <span className="text-red-500 text-sm">{errors.tags.message}</span>}


                  {tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100 group"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(index)}
                            className="text-blue-400 hover:text-red-500 transition-colors"
                          >
                            {/* Simple X icon (or use Lucide X) */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">No tags added yet.</p>
                  )}
                </div>


                <div className="pt-4 flex items-center justify-between">

                  <button type='submit' className="px-3 py-2  bg-black text-white rounded-lg font-light hover:bg-gray-800 transition">
                    Publish Product
                  </button>
                </div>
              </div>

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
      </main>
    </div>
  );
};

export default AddProducts;