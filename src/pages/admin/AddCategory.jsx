

import React, { useRef, useState } from 'react';
import { Image as ImageIcon, ChevronDown } from 'lucide-react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance';

const AddCategoryPage = () => {

  const inputBoxRef = useRef(null)
  const [fileName, setFileName] = useState('No file choosen')
  const [preview, setPreview] = useState(null)
  const [listed, setListed] = useState('listed')
  const { register, handleSubmit, formState: { errors } } = useForm()

  function handleClick(e) {
    e.preventDefault()
    e.stopPropagation();
    console.log("1. Button Clicked!");

    if (inputBoxRef.current) {
      console.log("2. Opening File Dialog...");
      inputBoxRef.current.click();
    } else {
      console.error("Error: Reference to input is null");
    }
  }
  function handleChangeFileName(e) {
    console.log("hgello")
    if (!e.target.files[0]) return
    const url = URL.createObjectURL(e.target.files[0])
    setPreview(url)
    setFileName(e.target.files[0].name)

  }

  const {
    ref: fileRef,
    onChange: fileOnChange,
    ...fileRest
  } = register('headerImage', { required: true });

  const onSubmit = async (data) => {
     console.log(data)
    const {categoryOffer,categoryName,discountType,isFeatured,maxRedeemable,parentCategory,visibility} = data
    console.log("discount type = ",discountType)
    try {
      const formData = new FormData()
      formData.append('image', data.headerImage[0])
      const uploadresponse = await axiosInstance.post('/upload', formData,
      { headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      console.log(uploadresponse.data)
     
      const categoryData = {
        categoryName,
        image:uploadresponse.data.imageUrl,
        parentCategory:parentCategory === 'None' && null,
        categoryOffer:Number(categoryOffer),
        discountType,
        maxRedeemable,
        isListed:visibility === 'listed' ? true :false,
        isFeatured,
      }
      console.log(categoryData)
     const responseCategory = await axiosInstance.post('/categories',categoryData)
     console.log(responseCategory.data)
    } catch (error) {
      console.log("error in onSubmit : ",error)
    }

  }

  return (
   
    <div className="p-8 bg-gray-50 w-full h-full font-sans text-gray-800">

      <div className="w-full"> {/* Container takes full width */}

        {/* --- Header --- */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800">Categories</h2>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Add New Category</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* FIX 2: Added 'w-full' to the form card so it stretches */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-8 w-full">

            {/* --- Header Image Upload --- */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Header image</label>
              <input
                type="file"
                className="hidden"
                {...fileRest}
                ref={(e) => {
                  fileRef(e);
                  inputBoxRef.current = e;
                }}
                onChange={(e) => {
                  fileOnChange(e);
                  handleChangeFileName(e);
                }}
                accept='image/*'
              />

              <div
                className="border-2 border-dashed border-blue-100 bg-blue-50/50 rounded-xl p-8 flex flex-col items-center justify-center text-center h-64 cursor-pointer hover:bg-blue-50 transition-colors"
                onClick={(e) => handleClick(e)}
              >
                {preview ? (
                  <>
                    <img src={preview} className="w-full h-full object-contain rounded-lg" alt="Preview" />
                    <p className="text-red-500 text-sm mt-2">{fileName}</p>
                    <p className="text-sm text-gray-500 mb-4">Change the photo</p>
                  </>
                ) : (
                  <>
                    <p className="text-red-500 text-sm">{fileName}</p>
                    <p className="text-sm text-gray-500 mb-4">Drag and drop image here, or click add image</p>
                    {errors.headerImage && <span className="text-red-500 text-sm block mb-2">This field is required</span>}
                    <button
                      type="button" // Important: Prevents form submission
                      className="px-6 py-2 bg-blue-100 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                      onClick={(e) => handleClick(e)}
                    >
                      Add Image
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* --- Offer Details --- */}
            <div className="flex flex-col md:flex-row gap-6 items-end w-full">

              <div className='flex-1 w-full'>
                <label className="block text-md font-medium text-gray-700 mb-2">Category Offer:</label>
                <input
                  type="number"
                  placeholder="Category Offer"
                  {...register('categoryOffer',{required:"Offer percentage is Required",
                    min:{value:0,message:'cannt be negative'},
                    max:{value:100,message:'cannt become greater than 100'}
                  })}
                  className=" no-spinner w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-gray-400 focus:bg-white transition-colors placeholder:text-gray-400"
                />
                {errors.categoryOffer && <span className="text-red-500 text-sm mt-1 block">{errors.categoryOffer.message}</span>}
              </div>

              <div className="flex-1 w-full">
                <label className="block text-md font-medium text-gray-700 mb-2">Max Redeemable:</label>
                <input
                  type="text"
                  placeholder="Max Redeemable"
                  {...register('maxRedeemable', { required:'maxRedeemable is Required',
                    min:{value:1,message:'must be greater than 1'}
                  })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-gray-400 focus:bg-white transition-colors placeholder:text-gray-400"
                />
                {errors.maxRedeemable && <span className="text-red-500 text-sm mt-1 block">{errors.maxRedeemable.message}</span>}
              </div>

              <div className="flex-1 w-full">
                <label className="block text-md font-medium text-gray-700 mb-2">Discount Type :</label>
                <div className="relative">
                  <select
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none appearance-none pr-10 text-gray-600"
                    defaultValue=''
                    {...register('discountType', { required:'Please select a discount type',validate:(value)=>value !== '' || "select a valid discount type" })}
                  >
                    <option value="" disabled>Select Discount Type</option>
                    <option value='Flat'>Flat</option>
                    <option value='Percentage'>Percentage</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  {errors.discountType && <span className="text-red-500 text-sm mt-1 block">{errors.discountType.message}</span>}
                </div>
              </div>
            </div>

            {/* --- Category Name --- */}
            <div>
              <label className="block text-md font-medium text-gray-700 mb-2">Category Name</label>
              <input
                type="text"
                placeholder="Type category name here..."
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-gray-400 focus:bg-white transition-colors placeholder:text-gray-400"
                {...register('categoryName', { required:'category name is required',minLength:{value:3,message:'name should be with minimum characters of 3'},pattern:{value:/^[a-zA-Z\s]+$/,message:'name can contain only letters'} })}
              />
              {errors.categoryName && <span className="text-red-500 text-sm mt-1 block">{errors.categoryName.message}</span>}
            </div>

            {/* --- Parent Category --- */}
            <div>
              <label className="block text-md font-medium text-gray-700 mb-2">Parent Category</label>
              <div className="relative">
                <select
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none appearance-none pr-10 text-gray-600"
                  defaultValue=''
                  {...register('parentCategory', { required:' parent category is required',validate:(value)=>value !== ''||'select a valid parent category option' })}
                >
                  <option value="" disabled>Select your parent-categories</option>
                  <option value='none'>None</option>
                  <option value='shirts'>Shirts</option>
                  <option value='pants'>Pants</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                {errors.parentCategory && <span className="text-red-500 text-sm mt-1 block">{errors.parentCategory.message}</span>}
              </div>
            </div>

            {/* --- Visibility & Checkbox --- */}
            <div className="space-y-6 pt-4">

              {/* Custom Radio Buttons for Visibility */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div className={`w-5 h-5 rounded-full border-4 flex items-center justify-center ${listed === 'listed' ? 'border-black bg-white' : 'border-gray-300'}`}></div>
                  <span className="text-md font-medium text-gray-700">Listed</span>
                  <input type="radio" name="visibility" className="hidden" value='listed' onClick={(e) => setListed(e.target.value)} {...register('visibility')} />
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div className={`w-5 h-5 rounded-full border-4 flex items-center justify-center ${listed === 'unlisted' ? 'border-black bg-white' : 'border-gray-300'}`}></div>
                  <span className="text-md font-medium text-gray-700">Unlisted</span>
                  <input type="radio" name="visibility" className="hidden" value='unlisted' onClick={(e) => setListed(e.target.value)} {...register('visibility')} />
                </label>
              </div>

              {/* Checkbox */}
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black accent-black"
                  {...register('isFeatured')}
                />
                <span className="text-md text-gray-600">Highlight this Category in a featured section.</span>
              </label>

            </div>

            {/* --- Submit Button --- */}
            <div>
              <button className="px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-900 transition-colors" type='submit'>
                Add Category
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  )

};



export default AddCategoryPage;