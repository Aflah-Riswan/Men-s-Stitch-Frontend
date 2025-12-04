import React, { useEffect, useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import categoryAttributes from '../../../data';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, setParentCategories, setSubCategories } from '../../../../redux/slice/categorySlice';
import { useForm } from 'react-hook-form';

const AddProducts = () => {
  const [selectedCategory, setCategory] = useState('')
  const [attributes, setAttributes] = useState([])
  const [categoryName, setCategoryName] = useState(null)
  const { parentCategories, subCategories, items, isLoading } = useSelector((state) => state.category)
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [variantImages, setVariantImages] = useState([])
  const [coverImages,setCoverImages] = useState([])
  const dispatch = useDispatch()


  useEffect(() => {
    dispatch(fetchCategories())
  }, [])

  useEffect(() => {
    if (items.length > 0) {
      console.log("hello")
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

  if (isLoading) {
    return (
      <>
        <h1>Loading...</h1>
      </>
    )
  }
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
          <div className="text-sm text-gray-500">Dashboard / Products / Add New Product</div>
        </header>

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
                    {...register('productName', { required: 'Product Name  is Reqquired ', minLength: { value: 3, message: 'Name should be with minimum 3 letters ' }, pattern: { value: /^[A-Za-z ]+$/, message: 'only letters are allowed as name ' } })}
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
                    {...register('productDescription', { required: 'Product Description Required ', minLength: { value: 10, message: 'Product Details Should be Contain atleast in 10 words ' }, pattern: { value: /^[A-Za-z0-9 ]+$/, message: 'Specila characters are not allowed ' } })}
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
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Color Name Input */}
                  <div className="space-y-2 w-full">
                    <label className="text-sm font-medium text-gray-700">Color Name</label>
                    <input
                      type="text"
                      placeholder="Color Name"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                      {...register("colorName", {
                        required: "Color name is required",
                        pattern: {
                          value: /^[A-Za-z ]+$/,
                          message: "Only alphabets and spaces allowed"
                        }
                      })}
                    />
                    {errors.colorName && <span className="text-red-500 text-sm mt-1 block">{errors.colorName.message}</span>}
                  </div>
                  {/* Color Picker */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Pick your color</label>
                    <input type="color" {...register('productColour', { required: 'Pick your product color' })} className="h-11 w-full p-1 rounded-lg border border-gray-300 cursor-pointer" />
                  </div>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                  <span className="text-sm text-gray-700 mb-2">Images of Product in Specific Colour <span className='text-amber-900'>{`(Only 3 images are allowed)`}</span></span>
                  
                  <input type='file' accept='image/*' className='hidden' id="colorImagesInput" {...register('variantImages', {
                    required: "Please upload at least one image",
                    validate: {
                      maxFiles: (files) => files.length <= 3 || "You can only upload a maximum of 3 images.",
                      minFiles: (files) => files.length > 0 || "Please upload at least one image."
                    },
                    onChange:(e) => {const files = Array.from(e.target.files)
                      setVariantImages(prev => [...prev, ...files])}
                  })} />
                  <div className="flex gap-4 mt-4 flex-wrap max-w-full overflow-x-auto p-4 border border-gray-200 rounded-lg bg-gray-50">
                    {variantImages.length > 0 ? variantImages.map((file, ind) => (
                      <img
                        key={file}
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        className="w-32 h-32 object-cover rounded-md border"
                      />
                    ))
                      : (
                        <span className="text-gray-400">No images selected</span>
                      )}
                    <label htmlFor='colorImagesInput'>{variantImages.length > 0 ? 'Change Image' : 'Select Image'}</label>
                  </div>

                </div>
                <button className="px-7  py-3 bg-black text-white rounded-md text-sm hover:bg-gray-700" >Upload</button>
              </div>
            </div>

            {/* Stock Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-lg mb-4 text-gray-800">Stock</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                  <div key={size} className="flex items-center gap-2">
                    <span className="w-8 font-semibold text-gray-600">{size}</span>
                    <input type="number" placeholder="0" className="w-full p-2 border border-gray-300 rounded-lg" {
                      ...register("stock", { required: "Stock is required", 
                        min: { value: 1, message: "Stock must be at least 1" },
                         max: { value: 100000, message: "Stock cannot exceed 100000" }, 
                         pattern: { value: /^[0-9]+$/, message: "Only digits allowed" } 
                      })} />
                  </div>
                ))}
                {errors.stock && <span className="text-red-500 text-sm mt-1 block">{errors.stock.message}</span>}
              </div>
              <div className="mt-4 flex gap-2">
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700">Cancel</button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save</button>
              </div>
            </div>

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
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-lg mb-4">Upload Product Image</h3>

              <div className="border-2 border-dashed border-blue-200 bg-blue-50 rounded-lg p-6 flex flex-col items-center justify-center text-center mb-4 min-h-[200px]">
                <ImageIcon className="text-blue-400 mb-2" size={32} />
                <input type='file' multiple className='hidden' id='coverImage' {...register('coverImages', {
                    required: "Please upload at least one image",
                    onChange: (e)=>handleImageUpload(e)
                  })} />
                <p className="text-xs text-gray-500 mb-2">Drag and drop image here, or click add image</p>
                <label htmlFor='coverImage' className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg text-sm font-medium">Add Image</label>
              </div>
              {errors.coverImages && <span>{errors.coverImages.message}</span>}

              <div className="grid grid-cols-3 gap-2">
                { coverImages .length > 0 && coverImages.map((file,ind) => (
                  <div key={ind} className="aspect-square bg-gray-50 rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center">
                    <img  
                        key={file}
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        className="w-32 h-32 object-cover rounded-md border"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
              <h3 className="font-semibold text-lg">Categories</h3>


              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Product Category</label>

                <select className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 outline-none" 
                  {
                    ...register("mainCategory", { required: "Category is required", 
                    onChange : (e) => handleSelectCategory(e.target.value)
                    })}>
                  <option key='1' value='' disabled >select your main category</option>
                  {parentCategories && parentCategories.map((cat) => (
                    <option key={cat._id} value={cat._id} >{cat.categoryName}</option>
                  ))}
                </select>

                {errors.mainCategory && <span className="text-red-500 text-sm mt-1 block">{errors.mainCategory.message}</span>}

                <select className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 outline-none" {...register('subCategory')}>
                  <option value='' disabled >select your sub category</option>
                  {subCategories && subCategories.map((cat) => (
                    <option id={cat._id} value={cat.categoryName}>{cat.categoryName}</option>
                  ))}
                </select>

                {errors.subCategory && <span className="text-red-500 text-sm mt-1 block">{errors.subCategory.message}</span>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Product Tags</label>
                <input type="text" placeholder="Product tags" className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none" />
              </div>

              <div className="pt-4 flex items-center justify-between">

                <button className="px-3 py-2  bg-black text-white rounded-lg font-light hover:bg-gray-800 transition">
                  Publish Product
                </button>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default AddProducts;