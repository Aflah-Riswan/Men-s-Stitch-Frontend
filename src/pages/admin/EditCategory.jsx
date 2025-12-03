

import React, { useEffect, useRef, useState } from 'react';
import { Image as ImageIcon } from 'lucide-react'; // Using Lucide icons as placeholders, you can swap them out.
import { useNavigate, useParams } from 'react-router-dom';
import { Form, useForm } from 'react-hook-form';
import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance';
import Modal from '../../Components/Modal';


const EditCategory = () => {
  const [isLoading, setLoading] = useState(true)
  const { id } = useParams()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const [preview, setPreview] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()
  const inputBoxRef = useRef(null)
  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/categories/${id}/edit`)
        const item = response.data.categoryItem
        if (item) {
          reset({
            categoryName: item.categoryName,
            image: item.image,
            categoryOffer: item.categoryOffer,
            maxRedeemable: item.maxRedeemable,
            discountType: item.discountType,
            parentCategory: item.parent === null && 'none',
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

  }, [reset])


  function handleImageClick() {
    inputBoxRef.current.click()
  }
  function handleImageChange(e) {
    e.stopPropogation
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  async function onSubmit(data) {
    const { categoryName, categoryOffer, maxRedeemable, isListed, isFeatured, parentCategory, discountType } = data
    let finalImage = preview;
    console.log(data)
    try {

      if (selectedFile) {
        const formData = new FormData()
        formData.append('image', selectedFile)
        const uploadResponse = await axiosInstance.post('/upload', formData)
        finalImage = uploadResponse.data.imageUrl
      }

      const updatedCategory = {
        categoryName,
        image: finalImage,
        categoryOffer,
        maxRedeemable,
        discountType,
        parentCategory: parentCategory.toUpperCase() === 'NONE' ? null : parentCategory,
        isListed: isListed === 'listed' ? true : false,
        isFeatured,
      }
      console.log('HII')
      const result = await axiosInstance.put(`categories/${id}/edit`, updatedCategory)
      if (result.data.success) setShowModal(true)
    } catch (error) {
      console.log("error in onSubmit : ", error)
    }

  }

  const handleModalClose = () => {
    setShowModal(false);
    navigate('/admin/categories'); // Navigate ONLY when clicked
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

            {/* Form Fields */}
            <form action="" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-8">
                {/* Header Image Section */}
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
                    <div className="rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={preview}
                        alt="Category Header"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-gray-50/50" onClick={handleImageClick}>
                      <div className="p-3 bg-indigo-50 rounded-full mb-3">
                        <ImageIcon className="text-indigo-500" size={24} />
                      </div>
                      <p className="text-sm text-gray-500 mb-4">
                        Drag and drop image here, or click add image
                      </p>
                      <button type='button' className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-md text-sm font-medium hover:bg-indigo-200 transition-colors" >
                        Add Image
                      </button>
                    </div>
                  </div>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="categoryOffer"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      category Offer:
                    </label>
                    <input
                      type="number"
                      id="categoryOffer"
                      placeholder="5%"
                      {...register('categoryOffer', {
                        required: "Offer percentage is Required",
                        min: { value: 0, message: 'cannt be negative' },
                        max: { value: 100, message: 'cannt become greater than 100' }
                      })}
                      className=" no-spinner w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
                    />
                    {errors.categoryOffer && <span className="text-red-500 text-sm mt-1 block">{errors.categoryOffer.message}</span>}
                  </div>
                  <div>
                    <label
                      htmlFor="maxRedeemable"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
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
                      className=" no-spinner w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
                    />
                    {errors.maxRedeemable && <span className="text-red-500 text-sm mt-1 block">{errors.maxRedeemable.message}</span>}
                  </div>

                  <div>
                    <label
                      htmlFor="discountType"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Discount-Type
                    </label>
                    <select
                      id="discountType"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm text-gray-500"
                      {...register('discountType', { required: 'Please select a discount type', validate: (value) => value !== '' || "select a valid discount type" })}
                      defaultValue=''
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
                  <label
                    htmlFor="categoryName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
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
                  <label
                    htmlFor="parentCategory"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Parent Category
                  </label>
                  <select
                    id="parentCategory"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm text-gray-500"
                    {...register('parentCategory', { required: ' parent category is required', validate: (value) => value !== '' || 'select a valid parent category option' })}
                    defaultValue=''
                  >
                    <option value='' disabled >Select your parent-categories</option>
                    <option value='none'>None</option>
                    <option value='shirts'>Shirts</option>
                    <option value='pants'>Pants</option>
                  </select>
                  {errors.parentCategory && <span className="text-red-500 text-sm mt-1 block">{errors.parentCategory.message}</span>}
                </div>

                {/* Visibility & Featured */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-6">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio text-black focus:ring-black h-5 w-5"
                        name="visibility"
                        value="listed"
                        {...register('isListed')}


                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        Listed
                      </span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio text-gray-400 focus:ring-gray-400 h-5 w-5"
                        name="visibility"
                        value="unlisted"
                        {...register('isListed')}
                      />
                      <span className="ml-2 text-sm font-medium text-gray-500">
                        Unlisted
                      </span>
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="featured"
                      type="checkbox"
                      className="form-checkbox text-black focus:ring-black h-5 w-5 rounded border-gray-300"
                      {...register("isFeatured")}
                    />
                    <label
                      htmlFor="featured"
                      className="ml-2 text-sm font-medium text-gray-700"
                    >
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
    </div>
  );
};

export default EditCategory;