import React, { useState, useEffect } from 'react'; // Added useEffect
import { ChevronDown } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { couponSchema } from '../../../utils/couponSchema';
import { couponService } from '../../../services/couponService';
import Modal from '../../../Components/Modal';
import { useNavigate } from 'react-router-dom';

const AddCoupon = () => {

  const [isUnlimited, setIsUnlimited] = useState(false);
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      discountType: "",
      isUnlimited: false
    }
  });

  // 1. Watch both fields
  const discountType = watch('discountType');
  const discountValue = watch('discountValue');

  // 2. Auto-sync Effect
  useEffect(() => {
    if (discountType === 'flat' && discountValue) {
      // If Flat, Max Discount MUST equal the Discount Value
      setValue('maxDiscountAmount', discountValue);
    }
  }, [discountType, discountValue, setValue]);

  const handleToggle = () => {
    const newValue = !isUnlimited;
    setIsUnlimited(newValue);
    setValue('isUnlimited', newValue);
  };

  const onSubmit = async (data) => {
    console.log("Database Ready Data:", data);
    await couponService.addCoupon(data)
    setShowModal(true)
  };

  function handleModalClose() {
    setShowModal(false)
    navigate('/admin/coupons')
  }

  const onError = (errors) => {
    console.log("Validation Errors:", errors);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-700">
      <Modal
        isOpen={showModal}
        title="Success!"
        message="Coupon added successfully."
        onConfirm={handleModalClose}
        type="success"
      />

      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <h1 className="text-xl font-bold mb-8 text-gray-800">Coupon</h1>

        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-[40px] border border-gray-200 shadow-sm p-8 md:p-12 mb-10">
            <h2 className="text-2xl font-bold text-center mb-10 text-gray-900">Add coupons</h2>

            <div className="space-y-10">

              {/* --- SECTION 1: BASIC INFO & VALIDITY --- */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
                {/* Coupon Code */}
                <div className="flex items-center relative">
                  <label className="w-40 font-semibold shrink-0">Coupon Code</label>
                  <span className="mr-4">:</span>
                  <input
                    type="text"
                    {...register('couponCode')}
                    className="flex-1 border border-gray-300 rounded-lg p-2 outline-none focus:ring-1 focus:ring-gray-400"
                  />
                  {errors.couponCode && <span className="absolute left-48 -bottom-6 text-red-500 text-xs">{errors.couponCode.message}</span>}
                </div>

                {/* Expiry Date */}
                <div className="flex items-center relative">
                  <label className="w-40 font-semibold shrink-0">Expiry Date</label>
                  <span className="mr-4">:</span>
                  <input
                    type="date"
                    {...register('expiryDate')}
                    className="flex-1 border border-gray-300 rounded-lg p-2 outline-none focus:ring-1 focus:ring-gray-400"
                  />
                  {errors.expiryDate && <span className="absolute left-48 -bottom-6 text-red-500 text-xs">{errors.expiryDate.message}</span>}
                </div>
              </div>

              {/* --- SECTION 2: DISCOUNT CONFIGURATION --- */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
                {/* Discount Value & Type */}
                <div className="flex items-center gap-4 relative">
                  <div className="flex items-center flex-1">
                    <label className="w-40 font-semibold shrink-0">Discount</label>
                    <span className="mr-4">:</span>
                    <input
                      type="number" // changed to number for better UX
                      {...register('discountValue')}
                      className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-1 focus:ring-gray-400"
                    />
                  </div>

                  <div className="flex items-center">
                    <div className="relative">
                      <select
                        {...register('discountType')}
                        className="appearance-none border border-gray-300 rounded-lg py-2 pl-4 pr-10 outline-none bg-white min-w-[110px] focus:ring-1 focus:ring-gray-400 cursor-pointer"
                        defaultValue=""
                      >
                        <option value="" disabled>Type</option>
                        <option value="flat">Flat</option>
                        <option value="percentage">Percentage</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                  {errors.discountValue && <span className="absolute left-48 -bottom-6 text-red-500 text-xs">{errors.discountValue.message}</span>}
                </div>

                {/* Max Discount Amount (Auto-filled & ReadOnly if Flat) */}
                <div className="flex items-center relative">
                  <label className="w-40 font-semibold shrink-0">Max Discount</label>
                  <span className="mr-4">:</span>
                  <input
                    type="number"
                    // If flat, make it readOnly so user sees the value but can't change it manually
                    readOnly={discountType === 'flat'} 
                    {...register('maxDiscountAmount')}
                    className={`flex-1 border border-gray-300 rounded-lg p-2 outline-none focus:ring-1 focus:ring-gray-400 ${discountType === 'flat' ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
                  />
                  {errors.maxDiscountAmount && <span className="absolute left-48 -bottom-6 text-red-500 text-xs">{errors.maxDiscountAmount.message}</span>}
                </div>
              </div>

              {/* --- SECTION 3: LIMITS --- */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
                {/* Min Purchase */}
                <div className="flex items-center relative">
                  <label className="w-40 font-semibold shrink-0">Min Purchase</label>
                  <span className="mr-4">:</span>
                  <input
                    type="number"
                    {...register('minPurchaseAmount')}
                    className="flex-1 border border-gray-300 rounded-lg p-2 outline-none focus:ring-1 focus:ring-gray-400"
                  />
                  {errors.minPurchaseAmount && <span className="absolute left-48 -bottom-6 text-red-500 text-xs">{errors.minPurchaseAmount.message}</span>}
                </div>

                {/* Usage Limit with Toggle */}
                <div className="space-y-3">
                  <div className="flex items-center relative">
                    <label className="w-40 font-semibold shrink-0">Usage Limit</label>
                    <span className="mr-4">:</span>
                    <input
                      type="number"
                      disabled={isUnlimited}
                      placeholder={isUnlimited ? "Unlimited" : "Enter limit"}
                      {...register('usageLimit')}
                      className="flex-1 border border-gray-300 rounded-lg p-2 outline-none disabled:bg-gray-100 disabled:text-gray-500 focus:ring-1 focus:ring-gray-400"
                    />
                  </div>
                  {/* Toggle Logic */}
                  <div className="flex items-center pl-[11.5rem]">
                    <input type="checkbox" {...register('isUnlimited')} className="hidden" />
                    <div
                      onClick={handleToggle}
                      className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${isUnlimited ? 'bg-emerald-500' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-0.5 bg-white w-4 h-4 rounded-full transition-all shadow-sm ${isUnlimited ? 'right-0.5' : 'left-0.5'}`}></div>
                    </div>
                    <span className={`ml-3 text-xs font-semibold ${isUnlimited ? 'text-emerald-600' : 'text-gray-400'}`}>
                      Unlimited
                    </span>
                  </div>
                </div>
              </div>

              {/* --- SECTION 4: DESCRIPTION (Full Width) --- */}
              <div className="flex items-center relative pt-2">
                <label className="w-40 font-semibold shrink-0">Description</label>
                <span className="mr-4">:</span>
                <input
                  type="text"
                  {...register('description')}
                  className="flex-1 border border-gray-300 rounded-lg p-2 outline-none focus:ring-1 focus:ring-gray-400"
                />
                {errors.description && <span className="absolute left-48 -bottom-6 text-red-500 text-xs">{errors.description.message}</span>}
              </div>

            </div>
          </div>

          <div className="flex justify-center">
            <button type="submit" className="bg-black text-white px-16 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all transform hover:scale-105 shadow-md">
              Add Coupon
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddCoupon;