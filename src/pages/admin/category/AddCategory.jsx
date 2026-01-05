import React, { useEffect, useRef, useState } from 'react';
import { Image as ImageIcon, ChevronDown } from 'lucide-react';
import { useForm } from 'react-hook-form';
import axiosInstance from '../../../utils/axiosInstance';
import Modal from '../../../Components/Modal';
import { useNavigate } from 'react-router-dom';
import ImageCropper from '../../../Components/ImageCropper'; 
import categoryService from '../../../services/categoryService';

const AddCategoryPage = () => {

  const inputBoxRef = useRef(null)
  const [fileName, setFileName] = useState('No file choosen')
  const [preview, setPreview] = useState(null)
  const [listed, setListed] = useState('listed')
  
  // 1. Added 'watch' to useForm destructuring
  const { register, handleSubmit, formState: { errors }, setValue, clearErrors, watch } = useForm() 
  
  const [showModal, setShowModal] = useState(false);
  const [parentCategories, setParentCategories] = useState([])
  const [imageToCrop, setImageToCrop] = useState(null) 
  
  const navigate = useNavigate()

  // 2. Watch the discount type in real-time
  const discountType = watch('discountType');
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getCategories()
        const categories = response.categories
        const validParents = categories.filter((cat) => cat.parentCategory === null)
        setParentCategories(validParents)
        
      } catch (error) {
        console.log("found error : ",error)
      }
    }
    fetchCategories()
  },[])

  function handleClick(e) {
    e.preventDefault()
    e.stopPropagation()

    if (inputBoxRef.current) {
      inputBoxRef.current.click();
    }
  }

  function handleFileChange(e) {
    if (!e.target.files[0]) return
    
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = () => {
        setImageToCrop(reader.result); 
    };
    reader.readAsDataURL(file);
    e.target.value = ''; 
  }

  // --- CROP HANDLERS ---
  const onCropDone = (croppedFile) => {
    const url = URL.createObjectURL(croppedFile)
    setPreview(url)
    setFileName(croppedFile.name)
    setValue('headerImage', [croppedFile], { shouldValidate: true }) 
    clearErrors('headerImage')
    setImageToCrop(null)
  }

  const onCropCancel = () => {
    setImageToCrop(null)
  }

  useEffect(() => {
      register('headerImage', { required: true });
  }, [register]);


  const onSubmit = async (data) => {
    const { categoryOffer, categoryName, discountType, isFeatured, maxRedeemable, parentCategory, visibility } = data
    
    try {
      // Logic adjustment: If Flat discount, send null for maxRedeemable or handle in backend
      const finalMaxRedeemable = discountType === 'Flat' ? null : maxRedeemable;

      const uploadresponse = await categoryService.uploadImage(data.headerImage[0])
      
      const categoryData = {
        categoryName,
        image: uploadresponse.imageUrl,
        parentCategory: parentCategory === 'None' ? null : parentCategory,
        categoryOffer: Number(categoryOffer),
        discountType,
        maxRedeemable: finalMaxRedeemable,
        isListed: visibility === 'listed' ? true : false,
        isFeatured,
      }
      
      const responseCategory = await categoryService.createCategory(categoryData)
      
      if (responseCategory.success) {
        setShowModal(true);
      }
    } catch (error) {
      console.log("error in onSubmit : ", error)
    }
  }

  const handleModalClose = () => {
    setShowModal(false);
    navigate('/admin/categories'); 
  };

  return (

    <div className="p-8 bg-gray-50 w-full h-full font-sans text-gray-800">

      <Modal
        isOpen={showModal}
        title="Success!"
        message="Category has been updated successfully."
        onConfirm={handleModalClose}
        type="success"
      />

      <div className="w-full"> 

        {/* --- Header --- */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800">Categories</h2>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Add New Category</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-8 w-full">

            {/* --- Header Image Upload --- */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Header image</label>
              
              <input
                type="file"
                className="hidden"
                accept='image/*'
                ref={inputBoxRef}
                onChange={handleFileChange}
              />

              <div
                className="border-2 border-dashed border-blue-100 bg-blue-50/50 rounded-xl p-4 flex flex-col items-center justify-center text-center h-80 cursor-pointer hover:bg-blue-50 transition-colors"
                onClick={(e) => handleClick(e)}
              >
                {preview ? (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <div className="h-64 w-full mb-2">
                        <img src={preview} className="w-full h-full object-contain rounded-lg shadow-sm" alt="Preview" />
                    </div>
                    <p className="text-gray-500 text-xs mt-2">{fileName}</p>
                    <p className="text-xs text-blue-500 font-medium">Click to change</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 p-3 bg-white rounded-full shadow-sm">
                        <ImageIcon className="text-blue-500" size={32} />
                    </div>
                    <p className="text-sm text-gray-500 mb-2">Drag and drop image here</p>
                    {errors.headerImage && <span className="text-red-500 text-xs block mb-2">Image is required</span>}
                    <button
                      type="button" 
                      className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-200 transition-colors uppercase tracking-wide"
                      onClick={(e) => handleClick(e)}
                    >
                      Add Image
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* --- SMART OFFER SECTION (Reordered) --- */}
            <div className="flex flex-col md:flex-row gap-6 items-start w-full">

              {/* 1. Discount Type (Moved First) */}
              <div className="flex-1 w-full">
                <label className="block text-md font-medium text-gray-700 mb-2">Discount Type :</label>
                <div className="relative">
                  <select
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none appearance-none pr-10 text-gray-600"
                    defaultValue=''
                    {...register('discountType', { required: 'Please select a discount type' })}
                  >
                    <option value="" disabled>Select Discount Type</option>
                    <option value='Flat'>Flat Amount (₹)</option>
                    <option value='Percentage'>Percentage (%)</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  {errors.discountType && <span className="text-red-500 text-sm mt-1 block">{errors.discountType.message}</span>}
                </div>
              </div>

              {/* 2. Category Offer (Dynamic Validation) */}
              <div className='flex-1 w-full'>
                <label className="block text-md font-medium text-gray-700 mb-2">
                  {discountType === 'Flat' ? 'Offer Amount (₹)' : 'Offer Percentage (%)'}
                </label>
                <input
                  type="number"
                  placeholder={discountType === 'Flat' ? "e.g. 500" : "e.g. 20"}
                  {...register('categoryOffer', {
                    required: "Offer value is Required",
                    min: { value: 0, message: 'Cannot be negative' },
                    // Conditional Validation: Only limit to 100 if it's percentage
                    validate: (value) => {
                      if (discountType === 'Percentage' && Number(value) > 100) {
                        return "Percentage cannot be greater than 100%";
                      }
                      return true;
                    }
                  })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-gray-400 focus:bg-white transition-colors placeholder:text-gray-400"
                />
                {errors.categoryOffer && <span className="text-red-500 text-sm mt-1 block">{errors.categoryOffer.message}</span>}
              </div>

              {/* 3. Max Redeemable (Conditional Disable) */}
              <div className={`flex-1 w-full transition-opacity ${discountType === 'Flat' ? 'opacity-50' : 'opacity-100'}`}>
                <label className="block text-md font-medium text-gray-700 mb-2">
                   Max Redeemable 
                   {discountType === 'Flat' && <span className='text-xs font-normal ml-1 text-gray-400'>(Not applicable)</span>}
                </label>
                <input
                  type="number"
                  placeholder="Max Cap (e.g. 1000)"
                  // Logic: Disable if Flat
                  disabled={discountType === 'Flat'} 
                  {...register('maxRedeemable', {
                    // Logic: Require only if Percentage
                    required: discountType === 'Percentage' ? 'Max redeemable limit is required for % offers' : false,
                    min: { value: 1, message: 'Must be greater than 1' }
                  })}
                  className={`w-full p-3 border border-gray-200 rounded-lg outline-none transition-colors placeholder:text-gray-400 ${discountType === 'Flat' ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50 focus:border-gray-400 focus:bg-white'}`}
                />
                {errors.maxRedeemable && <span className="text-red-500 text-sm mt-1 block">{errors.maxRedeemable.message}</span>}
              </div>

            </div>

            {/* --- Category Name --- */}
            <div>
              <label className="block text-md font-medium text-gray-700 mb-2">Category Name</label>
              <input
                type="text"
                placeholder="Type category name here..."
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-gray-400 focus:bg-white transition-colors placeholder:text-gray-400"
                {...register('categoryName', { required: 'category name is required', minLength: { value: 3, message: 'name should be with minimum characters of 3' }, pattern: { value: /^[a-zA-Z -\s]+$/, message: 'name can contain only letters' } })}
              />
              {errors.categoryName && <span className="text-red-500 text-sm mt-1 block">{errors.categoryName.message}</span>}
            </div>

            {/* --- Parent Category --- */}
            <div>
              <label className="block text-md font-medium text-gray-700 mb-2">Parent Category</label>
              <div className="relative">
                <select
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none appearance-none pr-10 text-gray-600"
                  defaultValue='None'
                  {...register('parentCategory', { required: ' parent category is required', validate: (value) => value !== '' || 'select a valid parent category option' })}
                >
                  <option value="None">Select your parent-categories</option>
                  {parentCategories.map((parent) =>( 
                    <option value={parent._id} key={parent._id}>{parent.categoryName}</option>
                  ))}

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

        {/* --- CROPPER MODAL --- */}
        {imageToCrop && (
          <ImageCropper
            imageSrc={imageToCrop}
            onCropDone={onCropDone}
            onCropCancel={onCropCancel}
          />
        )}

      </div>
    </div>
  )

};

export default AddCategoryPage;