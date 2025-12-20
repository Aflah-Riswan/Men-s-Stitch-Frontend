

import React, { useEffect, useState } from 'react';
import { Search, Filter, Edit, Trash2 } from 'lucide-react';
import { couponService } from '../../../services/couponService';

const Coupon = () => {
  const [ coupons ,setCoupons] = useState([])
  const [sum ,setSum] = useState(0)
  useEffect(()=>{
    const fetchCoupons = async ()=>{
      const data = await couponService.getCoupons()
      console.log(data)
      setCoupons([...data])
    }
     fetchCoupons()
  },[sum])
 
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Coupon</h1>

        {/* Filter and Search Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </button>
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <button className="px-4 py-2 bg-gray-800 text-white font-medium">ALL</button>
              <button className="px-4 py-2 bg-white text-gray-700 font-medium hover:bg-gray-50 border-l border-r border-gray-300">ACTIVE</button>
              <button className="px-4 py-2 bg-white text-gray-700 font-medium hover:bg-gray-50">INACTIVE</button>
            </div>
          </div>
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="Search coupons"
              className="w-full md:w-80 pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Search className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>

        {/* Main Card with Table */}
        <div className="bg-white rounded-[40px] shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Available coupons</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#1E5E3F] text-white rounded-lg">
                  <th className="px-6 py-3 font-medium first:rounded-l-lg">Code</th>
                  <th className="px-6 py-3 font-medium">Min purchase</th>
                  <th className="px-6 py-3 font-medium">limit</th>
                  <th className="px-6 py-3 font-medium">Discount</th>
                  <th className="px-6 py-3 font-medium">max redeemable</th>
                  <th className="px-6 py-3 font-medium text-center">Active</th>
                  <th className="px-6 py-3 font-medium">Expiry Date</th>
                  <th className="px-6 py-3 font-medium last:rounded-r-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* Row 1 */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">FLAT20</td>
                  <td className="px-6 py-4 text-gray-700">Above 1000</td>
                  <td className="px-6 py-4 text-gray-700">1</td>
                  <td className="px-6 py-4 text-gray-700">20%Off</td>
                  <td className="px-6 py-4 text-gray-700">700</td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center bg-red-500 rounded-full p-1 cursor-pointer w-16">
                      <div className="bg-white w-4 h-4 rounded-full shadow-md transform translate-x-1"></div>
                      <span className="ml-2 text-xs font-bold text-white">INACTIVE</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">01/07/2024</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <button className="p-1 text-red-500 hover:bg-red-100 rounded">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button className="p-1 text-red-500 hover:bg-red-100 rounded">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
                {/* Row 2 */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">FLAT20</td>
                  <td className="px-6 py-4 text-gray-700">Above 1000</td>
                  <td className="px-6 py-4 text-gray-700">1</td>
                  <td className="px-6 py-4 text-gray-700">20%Off</td>
                  <td className="px-6 py-4 text-gray-700">700</td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center bg-white border-2 border-gray-300 rounded-full p-1 cursor-pointer w-16 relative">
                      <span className="mr-2 text-xs font-bold text-gray-700 ml-1">ACTIVE</span>
                      <div className="bg-green-500 w-4 h-4 rounded-full shadow-md absolute right-1 top-1"></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">01/07/2024</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <button className="p-1 text-red-500 hover:bg-red-100 rounded">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button className="p-1 text-red-500 hover:bg-red-100 rounded">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
                 {/* Row 3 */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">FLAT20</td>
                  <td className="px-6 py-4 text-gray-700">Above 1000</td>
                  <td className="px-6 py-4 text-gray-700">1</td>
                  <td className="px-6 py-4 text-gray-700">20%Off</td>
                  <td className="px-6 py-4 text-gray-700">700</td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center bg-red-500 rounded-full p-1 cursor-pointer w-16">
                      <div className="bg-white w-4 h-4 rounded-full shadow-md transform translate-x-1"></div>
                      <span className="ml-2 text-xs font-bold text-white">INACTIVE</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">01/07/2024</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <button className="p-1 text-red-500 hover:bg-red-100 rounded">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button className="p-1 text-red-500 hover:bg-red-100 rounded">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
                {/* Row 4 */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">FLAT20</td>
                  <td className="px-6 py-4 text-gray-700">Above 1000</td>
                  <td className="px-6 py-4 text-gray-700">1</td>
                  <td className="px-6 py-4 text-gray-700">100/- flat off</td>
                  <td className="px-6 py-4 text-gray-700">700</td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center bg-white border-2 border-gray-300 rounded-full p-1 cursor-pointer w-16 relative">
                      <span className="mr-2 text-xs font-bold text-gray-700 ml-1">ACTIVE</span>
                      <div className="bg-green-500 w-4 h-4 rounded-full shadow-md absolute right-1 top-1"></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">01/07/2024</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <button className="p-1 text-red-500 hover:bg-red-100 rounded">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button className="p-1 text-red-500 hover:bg-red-100 rounded">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
                 {/* Row 5 */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">FLAT20</td>
                  <td className="px-6 py-4 text-gray-700">Above 1000</td>
                  <td className="px-6 py-4 text-gray-700">1</td>
                  <td className="px-6 py-4 text-gray-700">20%Off</td>
                  <td className="px-6 py-4 text-gray-700">700</td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center bg-red-500 rounded-full p-1 cursor-pointer w-16">
                      <div className="bg-white w-4 h-4 rounded-full shadow-md transform translate-x-1"></div>
                      <span className="ml-2 text-xs font-bold text-white">INACTIVE</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">01/07/2024</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <button className="p-1 text-red-500 hover:bg-red-100 rounded">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button className="p-1 text-red-500 hover:bg-red-100 rounded">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Coupon Button */}
        <div className="mt-8">
          <button className="px-6 py-3 bg-black text-white font-bold rounded-md hover:bg-gray-800 transition-colors">
            Add Coupon
          </button>
        </div>
      </div>
    </div>
  );
};

export default Coupon;