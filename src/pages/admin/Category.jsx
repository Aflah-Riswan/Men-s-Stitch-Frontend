import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Image as ImageIcon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, toggleListButton,deleteCategory } from '../../../redux/slice/categorySlice';
import { useNavigate } from 'react-router-dom';


const Category = () => {

  const categories = useSelector((state)=>state.category.items)
  console.log(categories)
  const dispatch = useDispatch()
  useEffect(()=>{
    dispatch(fetchCategories())  
  },[dispatch,categories])
  const navigate = useNavigate()


  return (

    <div className="flex min-h-screen bg-gray-50">


      <div className="flex-1 p-8 overflow-y-auto h-screen">

        {/* --- HEADER SECTION --- */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Categories</h2>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-700">Discover</h3>
            <button className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition" onClick={()=>navigate('/admin/categories/add')}>
              <Plus size={18} />
              Add Category
            </button>
          </div>

          {/* --- DISCOVER GRID CARDS --- */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
            {categories.map((card, index) => (
              <div key={card._id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg  flex items-center justify-center shrink-0`}>
                 <img src={card.image} alt="" sizes='16' />
                </div>
                <span className="text-sm font-medium text-gray-700 truncate">{card.categoryName}</span>
              </div>
            ))}
          </div>
        </div>

        {/* --- TABLE SECTION --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#1a4d2e] text-white">
                <tr>
                  <th className="px-6 py-4 font-medium">SNO</th>
                  <th className="px-6 py-4 font-medium">Category Name</th>
                  <th className="px-6 py-4 font-medium">Offer</th>
                  <th className="px-6 py-4 font-medium">Stock</th>
                  <th className="px-6 py-4 font-medium">Date Added</th>
                  <th className="px-6 py-4 font-medium">List / Unlist</th>
                  <th className="px-6 py-4 font-medium text-center">Action</th>
                  <th className="px-6 py-4 font-medium text-center">Discount-Type</th>
                  <th className="px-6 py-4 font-medium text-center">Max Redeemable ₹</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((item, index) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-500">{index+1}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{item.categoryName}</td>
                    <td className="px-6 py-4 text-gray-600">{item.categoryOffer}</td>
                    <td className="px-6 py-4 text-gray-600">{100}</td>
                    <td className="px-6 py-4 text-gray-500">{item.createdAt}</td>
                    <td className="px-6 py-4">
                      <button 
                        className={`
                          flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold text-white transition-all
                          ${item.isListed  ? 'bg-[#7fad39] flex-row' : 'bg-red-500 flex-row-reverse'}
                        `}
                        onClick={()=>dispatch(toggleListButton(item._id))}
                      >
                        <span>{item.isListed ? 'List'.toUpperCase() : 'unlist'.toUpperCase()}</span>
                        <div className="w-3 h-3 bg-white rounded-full shadow-sm" />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded border border-gray-200" onClick={()=>navigate(`edit/${item._id}`)}>
                          <Pencil size={14} />
                        </button>
                        <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded border border-gray-200" onClick={()=>dispatch(deleteCategory(item._id))}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-gray-700">{item.discountType}</td>
                    <td className="px-6 py-4 text-center font-medium text-gray-700">{item.maxRedeemable}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Category;