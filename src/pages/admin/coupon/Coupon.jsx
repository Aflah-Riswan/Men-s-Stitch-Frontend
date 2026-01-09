import React, { useEffect, useState } from 'react';
import { Search, Filter, Edit, Trash2, ChevronDown, ArrowUpDown } from 'lucide-react';
import { couponService } from '../../../services/couponService';
import { useNavigate } from 'react-router-dom';
import useDebounce from '../../../hooks/useDebounce';
import toast from 'react-hot-toast';

const Coupon = () => {
  const [coupons, setCoupons] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filter States
  const [status,setStatus] = useState('');
  const [discount, setDiscount] = useState('');
  const [offerLimit, setofferLimit] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState(''); 
  const [currentPage, setCurrentPage] = useState(1); 

  const debouncedSearch = useDebounce(search, 500);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const filters = {
          page: currentPage,
          search: debouncedSearch,
          offerLimit ,
          expiryDate,
          discount,
          status,
          sort 
        };
        const response = await couponService.getCoupons(filters);
        
        setCoupons(response);
      } catch (error) {
        console.error("Failed to fetch coupons", error);
      }
    };
    fetchCoupons();
  }, [debouncedSearch, offerLimit, status, discount, expiryDate, currentPage, sort]); 

  async function toggleisActive(couponId) {
    try {
      await couponService.updateisActive(couponId);
      setCoupons((prev) =>
        prev.map((coupon) =>
          coupon._id === couponId ? { ...coupon, isActive: !coupon.isActive } : coupon
        )
      );
    } catch (error) {
      console.error("Error updating status");
    }
  }

  function handleReset() {
    setofferLimit('');
    setDiscount('');
    setExpiryDate('');
    setStatus('');
    setSort('');
    setSearch('');
    
  }

 async function handleDelete (couponId) {
  await couponService.deleteCoupon(couponId)
  toast.success('Delete Successfully...')
 }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Coupon</h1>

        {/* Filter, Sort, and Search Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          
          {/* Left Side: Filter & Toggle Buttons */}
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-all ${isFilterOpen ? 'bg-gray-100 ring-2 ring-gray-200' : ''}`}
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <button 
                className={`px-4 py-2 font-medium ${status === '' ? 'bg-gray-800 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setStatus('')}
              >
                ALL
              </button>
              <button 
                className={`px-4 py-2 font-medium border-l border-r border-gray-300 ${status === 'active' ? 'bg-gray-800 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setStatus('active')}
              >
                ACTIVE
              </button>
              <button 
                className={`px-4 py-2 font-medium ${status === 'inactive' ? 'bg-gray-800 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setStatus('inactive')}
              >
                INACTIVE
              </button>
            </div>
          </div>

          {/* Right Side: Search & Sort */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            
            {/* Sort By Dropdown */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ArrowUpDown className="h-4 w-4 text-gray-400" />
              </div>
              <select 
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer text-sm font-medium"
              >
                <option value="">Sort By</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="discount-high">Highest Discount</option>
                <option value="discount-low">Lowest Discount</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={search}
                placeholder="Search coupons"
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500" 
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* --- Filter Accordion Panel --- */}
        <div
          className={`
            w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all duration-300 ease-in-out
            ${isFilterOpen ? 'max-h-96 opacity-100 mb-8' : 'max-h-0 opacity-0 mb-0'}
          `}
        >
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Filter Group 1 */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Usage offerLimit</label>
              <select 
                value={offerLimit}
                onChange={(e) => setofferLimit(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-black focus:border-black block p-2.5 outline-none"
              >
                <option value="">All Limits</option>
                <option value="unlimited">Unlimited</option>
                <option value="limited">Limited</option>
              </select>
            </div>
            
            {/* Filter Group 2 */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Discount Type</label>
              <select 
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-black focus:border-black block p-2.5 outline-none"
              >
                <option value="">All Types</option>
                <option value="percentage">Percentage</option>
                <option value="flat">Flat Amount</option>
              </select>
            </div>

            {/* Filter Group 3 */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Expiry Date</label>
              <input 
                type="date" 
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-black focus:border-black block p-2.5 outline-none" 
              />
            </div>
          </div>
          
          {/* Footer Actions */}
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-end gap-3">
            <button 
              className="text-sm text-gray-500 hover:text-black font-medium" 
              onClick={handleReset}
            >
              Reset
            </button>

          </div>
        </div>
        {/* --- END Accordion --- */}

        {/* Main Card with Table */}
        <div className="bg-white rounded-[40px] shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Available coupons</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#1E5E3F] text-white rounded-lg">
                  <th className="px-6 py-3 font-medium first:rounded-l-lg">Code</th>
                  <th className="px-6 py-3 font-medium">Min purchase</th>
                  <th className="px-6 py-3 font-medium">Limit</th>
                  <th className="px-6 py-3 font-medium">Discount</th>
                  <th className="px-6 py-3 font-medium">Max redeemable</th>
                  <th className="px-6 py-3 font-medium text-center">Active</th>
                  <th className="px-6 py-3 font-medium">Expiry Date</th>
                  <th className="px-6 py-3 font-medium last:rounded-r-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {coupons && coupons.length > 0 ? (
                  coupons.map((coupon) => (
                    <tr className="hover:bg-gray-50" key={coupon._id}>
                      <td className="px-6 py-4 font-medium text-gray-900">{coupon.couponCode}</td>
                      <td className="px-6 py-4 text-gray-700">Above {coupon.minPurchaseAmount}</td>
                      <td className="px-6 py-4 text-gray-700">{coupon.isUnlimited ? 'Unlimited' : coupon.usageLimit}</td>
                      <td className="px-6 py-4 text-gray-700">{`${coupon.discountValue} ${coupon.discountType === 'flat' ? 'flat' : '% off'}`}</td>
                      <td className="px-6 py-4 text-gray-700">{coupon.maxDiscountAmount}</td>
                      <td className="px-6 py-4 text-center">
                        <div
                          className={`relative inline-flex items-center rounded-full p-1 cursor-pointer w-20 transition-colors duration-300 ${coupon.isActive ? 'bg-green-500' : 'bg-red-500'}`}
                          onClick={() => toggleisActive(coupon._id)}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${coupon.isActive ? 'translate-x-12' : 'translate-x-0'}`}
                          ></div>
                          <span
                            className={`absolute text-xs font-bold text-white pointer-events-none transition-all duration-300 ${coupon.isActive ? 'ml-2' : 'ml-6'}`}
                          >
                            {coupon.isActive ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <button className="p-1 text-red-500 hover:bg-red-100 rounded" onClick={()=>navigate(`${coupon._id}/edit`)}>
                            <Edit className="w-5 h-5" />
                          </button>
                          <button className="p-1 text-red-500 hover:bg-red-100 rounded" onClick={()=>handleDelete(coupon._id)}>
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                      No coupons found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Coupon Button */}
        <div className="mt-8">
          <button 
            className="px-6 py-3 bg-black text-white font-bold rounded-md hover:bg-gray-800 transition-colors" 
            onClick={() => navigate('add')}
          >
            Add Coupon
          </button>
        </div>
      </div>
    </div>
  );
};

export default Coupon;