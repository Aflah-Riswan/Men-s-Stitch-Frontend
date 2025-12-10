import React, { useEffect, useRef, useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axiosInstance from '../../utils/axiosInstance';
import Modal from '../../Components/Modal';
import ImageCropper from '../../Components/ImageCropper'; // 1. Import Cropper

const EditCategory = () => {
  const [isLoading, setLoading] = useState(true)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const [preview, setPreview] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [showModal, setShowModal] = useState(false)
  
 
  const [imageToCrop, setImageToCrop] = useState(null)

  const navigate = useNavigate()
  const inputBoxRef = useRef(null)
  const { slug } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/categories/${slug}/edit`)
        const item = response.data.categoryItem
        if (item) {
          reset({
            categoryName: item.categoryName,
            image: item.image,
            categoryOffer: item.categoryOffer,
            maxRedeemable: item.maxRedeemable,
            discountType: item.discountType,
            parentCategory: item.parent === null ? 'none' : item.parent, // Handle null parent safely
            isListed: item.isListed ? 'listed' : 'unlisted',
            isFeatured: item.isFeatured
          })
          setPreview(item.image)
        }
      } catch (error) {
        console.log(error, " in fetchDATA EDITcATEGORY")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [reset, slug])


  function handleImageClick() {
    inputBoxRef.current.click()
  }

  
  function handleImageChange(e) {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result);
      };
      reader.readAsDataURL(file);
      e.target.value = ''; 
    }
  }

  
  const onCropDone = (croppedFile) => {
    setSelectedFile(croppedFile);
    setPreview(URL.createObjectURL(croppedFile));
    setImageToCrop(null);
  };

  const onCropCancel = () => {
    setImageToCrop(null);
  };

  async function onSubmit(data) {
    const { categoryName, categoryOffer, maxRedeemable, isListed, isFeatured, parentCategory, discountType } = data
    let finalImage = preview; 
    
    try {
      
      if (selectedFile) {
        const formData = new FormData()
        formData.append('image', selectedFile)
        const uploadResponse = await axiosInstance.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        finalImage = uploadResponse.data.imageUrl
      }

      const updatedCategory = {
        categoryName,
        image: finalImage,
        categoryOffer: Number(categoryOffer),
        maxRedeemable,
        discountType,
        parentCategory: parentCategory && parentCategory.toString().toLowerCase() === 'none' ? null : parentCategory,
        isListed: isListed === 'listed' ? true : false,
        isFeatured,
      }
      
      const result = await axiosInstance.put(`categories/${slug}/edit`, updatedCategory)
      if (result.data.success) setShowModal(true)
      else alert(result.data.message)
    } catch (error) {
      console.log("error in onSubmit : ", error)
    }
  }

  const handleModalClose = () => {
    setShowModal(false);
    navigate('/admin/categories');
  };

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="flex h-screen font-sans bg-gray-50">

      <Modal
        isOpen={showModal}
        title="Success!"
        message="Category has been updated successfully."
        onConfirm={handleModalClose}
        type="success"
      />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <h1 className="text-2xl font-semibold mb-8 text-gray-800">Categories</h1>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Edit Category</h2>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-8">
                
                {/* Header Image Section*/}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Header image
                  </label>
                  <input
                    type='file'
                    className='hidden'
                    ref={inputBoxRef}
                    onChange={handleImageChange}
                    accept='image/*'
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-50 h-64 flex items-center justify-center">
                      {preview ? (
                          <img
                            src={preview}
                            alt="Category Header"
                            className="w-full h-full object-contain"
                          />
                      ) : (
                          <span className="text-gray-400 text-sm">No image</span>
                      )}
                    </div>

                    {/* Upload Button Area */}
                    <div 
                        className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-gray-50/50 hover:bg-gray-100 cursor-pointer transition-colors h-64" 
                        onClick={handleImageClick}
                    >
                      <div className="p-3 bg-indigo-50 rounded-full mb-3">
                        <ImageIcon className="text-indigo-500" size={24} />
                      </div>
                      <p className="text-sm text-gray-500 mb-4">
                        Change Image
                      </p>
                      <button type='button' className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-md text-xs font-bold uppercase tracking-wide hover:bg-indigo-200 transition-colors" >
                        Select File
                      </button>
                    </div>
                  </div>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="categoryOffer" className="block text-sm font-medium text-gray-700 mb-2">
                      Category Offer:
                    </label>
                    <input
                      type="number"
                      id="categoryOffer"
                      placeholder="5%"
                      {...register('categoryOffer', {
                        required: "Offer percentage is Required",
                        min: { value: 0, message: 'cannot be negative' },
                        max: { value: 100, message: 'cannot become greater than 100' }
                      })}
                      className="no-spinner w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
                    />
                    {errors.categoryOffer && <span className="text-red-500 text-sm mt-1 block">{errors.categoryOffer.message}</span>}
                  </div>
                  <div>
                    <label htmlFor="maxRedeemable" className="block text-sm font-medium text-gray-700 mb-2">
                      Max Redeemable:
                    </label>
                    <input
                      type="number"
                      id="maxRedeemable"
                      placeholder="₹100"
                      {...register('maxRedeemable', {
                        required: 'maxRedeemable is Required',
                        min: { value: 1, message: 'must be greater than 1' }
                      })}
                      className="no-spinner w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
                    />
                    {errors.maxRedeemable && <span className="text-red-500 text-sm mt-1 block">{errors.maxRedeemable.message}</span>}
                  </div>

                  <div>
                    <label htmlFor="discountType" className="block text-sm font-medium text-gray-700 mb-2">
                      Discount-Type
                    </label>
                    <select
                      id="discountType"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm text-gray-500"
                      {...register('discountType', { required: 'Please select a discount type' })}
                    >
                      <option value='' disabled>Select Discount Type</option>
                      <option value='Flat'>Flat</option>
                      <option value='Percentage'>Percentage</option>
                    </select>
                    {errors.discountType && <span className="text-red-500 text-sm mt-1 block">{errors.discountType.message}</span>}
                  </div>
                </div>

                {/* Category Name */}
                <div>
                  <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name
                  </label>
                  <input
                    type="text"
                    id="categoryName"
                    placeholder="Club Jerseys"
                    {...register('categoryName', { required: 'category name is required', minLength: { value: 3, message: 'name should be with minimum characters of 3' }, pattern: { value: /^[a-zA-Z\s]+$/, message: 'name can contain only letters' } })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm bg-gray-50"
                  />
                  {errors.categoryName && <span className="text-red-500 text-sm mt-1 block">{errors.categoryName.message}</span>}
                </div>

                {/* Parent Category */}
                <div>
                  <label htmlFor="parentCategory" className="block text-sm font-medium text-gray-700 mb-2">
                    Parent Category
                  </label>
                  <select
                    id="parentCategory"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm text-gray-500"
                    {...register('parentCategory')}
                  >
                    <option value='none'>None</option>
                    <option value='Shirts'>Shirts</option>
                    <option value='Pants'>Pants</option> 
                  </select>
                </div>

                {/* Visibility & Featured */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-6">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio text-black focus:ring-black h-5 w-5"
                        value="listed"
                        {...register('isListed')}
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">Listed</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio text-gray-400 focus:ring-gray-400 h-5 w-5"
                        value="unlisted"
                        {...register('isListed')}
                      />
                      <span className="ml-2 text-sm font-medium text-gray-500">Unlisted</span>
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="featured"
                      type="checkbox"
                      className="form-checkbox text-black focus:ring-black h-5 w-5 rounded border-gray-300"
                      {...register("isFeatured")}
                    />
                    <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-700">
                      Highlight this Category in a featured section.
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-start">
                  <button className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-sm" type='submit'>
                    Edit Category
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* 5. Render Cropper Conditional */}
      {imageToCrop && (
        <ImageCropper
          imageSrc={imageToCrop}
          onCropDone={onCropDone}
          onCropCancel={onCropCancel}
        />
      )}
    </div>
  );
};

export default EditCategory;