

import React, { useRef, useState } from 'react';
import { Image as ImageIcon, ChevronDown } from 'lucide-react';

const AddCategoryPage = () => {

  const inputBoxRef = useRef(null)
  const [fileName, setFileName] = useState('No file choosen')
  const [preview, setPreview] = useState(null)
  const [listed,setListed] = useState('listed')
 

  function handleClick(e) {
    e.preventDefault()
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
    console.log(url)
    console.log(fileName)
  }
  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans text-gray-800">

      {/* --- Header --- */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800">Categories</h2>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Add New Category</h1>
      </div>

      <form action="">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-8" >

          {/* --- Header Image Upload --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Header image</label>
            <input
              type="file"
              className="hidden"
              ref={inputBoxRef}
              onChange={(e) => handleChangeFileName(e)}
            />
            <div className="border-2 border-dashed border-blue-100 bg-blue-50/50 rounded-xl p-8 flex flex-col items-center justify-center text-center h-64" onClick={handleClick}>

              {preview ? (
                <>
                  <img src={preview} className="w-full h-full object-contain rounded-lg" />
                  <p className="text-red-500 text-sm">{fileName}</p>
                  <p className="text-sm text-gray-500 mb-4">Chnage the photo</p>
                </>

              ) : (
                <>
                  <p className="text-red-500 text-sm">{fileName}</p>
                  <p className="text-sm text-gray-500 mb-4">Drag and drop image here, or click add image</p>
                  <button className="px-6 py-2 bg-blue-100 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors" onClick={handleClick}>
                    Add Image
                  </button>
                </>
              )}
            </div>
          </div>

          {/* --- Offer Details --- */}
          <div className="flex flex-col md:flex-row gap-6 items-end">

            <div className='flex-1'>
              <label className="block text-sm font-medium text-gray-700 mb-2">category Offer:</label>
              <input
                type="text"
                placeholder="category Offer"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-gray-400 focus:bg-white transition-colors placeholder:text-gray-400"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Redeemable:</label>
              <input
                type="text"
                placeholder="Max Redeemable"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-gray-400 focus:bg-white transition-colors placeholder:text-gray-400"
              />
            </div>


            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type :</label>
              <div className="relative">
                <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none appearance-none pr-10 text-gray-600">
                  <option>Flat</option>
                  <option>Percentage</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>
          </div>

          {/* --- Category Name --- */}

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
            <input
              type="text"
              placeholder="Type category name here..."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-gray-400 focus:bg-white transition-colors placeholder:text-gray-400"
            />
          </div>

          {/* --- Parent Category --- */}
          <div>
            <div className="relative">
              <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none appearance-none pr-10 text-gray-600">
                <option>Select your parent-categories</option>
                <option>None</option>
                <option>Men</option>
                <option>Women</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

         
          <div className="space-y-6 pt-4">

            {/* Custom Radio Buttons for Visibility */}
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <div className={`w-5 h-5 rounded-full border-4 flex items-center justify-center   ${listed  === 'listed' ? 'border-black-700 bg-white focus:ring-black':'border-gray-300'  }`}>
                 
                </div>
                <span className="text-sm font-medium text-gray-700">Listed</span>
                <input type="radio" name="visibility" className="hidden" value={listed} onClick={()=>setListed('listed')}/>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <div className={`w-5 h-5 rounded-full border-4 flex items-center justify-center   ${listed  === 'unlisted' ? 'border-black-700 bg-white focus:ring-black':'border-gray-300 ' }`}>

                </div>
                <span className="text-sm font-medium text-gray-700">Unlisted</span>
                <input type="radio" name="visibility" className="hidden" value={listed} onClick={()=>setListed('unlisted')} />
              </label>
            </div>

            {/* Checkbox */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black" />
              <span className="text-sm text-gray-600">Highlight this Category in a featured section.</span>
            </label>

          </div>

          {/* --- Submit Button --- */}
          <div>
            <button className="px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-900 transition-colors">
              Add Category
            </button>
          </div>

        </div>
      </form >
    </div >
  );
};



export default AddCategoryPage;