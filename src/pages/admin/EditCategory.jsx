

import React, { useEffect, useState } from 'react';
import { Image as ImageIcon} from 'lucide-react'; // Using Lucide icons as placeholders, you can swap them out.
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../../utils/axiosInstance';
import config from '../../utils/config';

const EditCategory = () => {
  const [item,setItem]=useState({})
const { id } = useParams()
useEffect(()=>{
  fetchData()
})
const fetchData = async ()=>{
  const response = await axiosInstance.get(`/categories/${id}/edit`,config)
  setItem(response.data)
}

  return (
    <div className="flex h-screen font-sans bg-gray-50">

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <h1 className="text-2xl font-semibold mb-8 text-gray-800">Categories</h1>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Edit Category</h2>

            {/* Form Fields */}
            <div className="space-y-8">
              {/* Header Image Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Header image
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src='loasdhlkas' 
                      alt="Category Header"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-gray-50/50">
                    <div className="p-3 bg-indigo-50 rounded-full mb-3">
                      <ImageIcon className="text-indigo-500" size={24} />
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                      Drag and drop image here, or click add image
                    </p>
                    <button className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-md text-sm font-medium hover:bg-indigo-200 transition-colors">
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
                    type="text"
                    id="categoryOffer"
                    placeholder="5%"
                    value={item.categoryOffer}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="maxRedeemable"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Max Redeemable:
                  </label>
                  <input
                    type="text"
                    id="maxRedeemable"
                    placeholder="₹100"
                    value={item.maxRedeemable}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
                  />
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
                  value={item.name}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm bg-gray-50"
                />
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
                  value={item.parent}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm text-gray-500"
                >
                  <option>Select your parent-categories</option>
                  {/* Add other options here */}
                </select>
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
                     {item.isListed ?}
                     
                      
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
                <button className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-sm">
                  Edit Category
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditCategory;