import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { couponSchema } from '../../../utils/couponSchema';
import { couponService } from '../../../services/couponService';
import Modal from '../../../Components/Modal';
import { useNavigate } from 'react-router-dom';



const AddCoupon = () => {

  const [isUnlimited, setIsUnlimited] = useState(false);
  const [showModal , setShowModal] = useState(false)
  const navigate = useNavigate()
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      discountType: "Flat",
      isUnlimited: false
    }
  });

  const handleToggle = () => {
    const newValue = !isUnlimited;
    setIsUnlimited(newValue);
    setValue('isUnlimited', newValue);
  };

  const onSubmit = async (data) => {
    console.log("clicked")
    console.log("Database Ready Data:", data);
    await couponService.addCoupon(data)
    setShowModal(true)

  };

  function handleModalClose (){
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
      <form onSubmit={handleSubmit(onSubmit , onError)}>
        <h1 className="text-xl font-bold mb-8 text-gray-800">Coupon</h1>

        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-[40px] border border-gray-200 shadow-sm p-8 md:p-12 mb-10">
            <h2 className="text-2xl font-bold text-center mb-12 text-gray-900">Add coupons</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-10">

              {/* Left Column */}
              <div className="space-y-10">
                <div className="flex items-center relative">
                  <label className="w-40 font-semibold shrink-0">Coupon Code</label>
                  <span className="mr-4">:</span>
                  <input type="text" {...register('couponCode')} className="flex-1 border border-gray-300 rounded-lg p-2 outline-none focus:ring-1 focus:ring-gray-400" />
                  {errors.couponCode && <span className="absolute left-48 -bottom-6 text-red-500 text-xs">{errors.couponCode.message}</span>}
                </div>

                <div className="flex items-center relative">
                  <label className="w-40 font-semibold shrink-0">Description</label>
                  <span className="mr-4">:</span>
                  <input type="text" {...register('description')} className="flex-1 border border-gray-300 rounded-lg p-2 outline-none focus:ring-1 focus:ring-gray-400" />
                  {errors.description && <span className="absolute left-48 -bottom-6 text-red-500 text-xs">{errors.description.message}</span>}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center relative">
                    <label className="w-40 font-semibold shrink-0">Usage Limit</label>
                    <span className="mr-4">:</span>
                    <input
                      type="number"
                      disabled={isUnlimited}
                      placeholder={isUnlimited ? "No limit" : "Enter limit"}
                      {...register('usageLimit')}
                      className="flex-1 border border-gray-300 rounded-lg p-2 outline-none disabled:bg-gray-100"
                    />
                  </div>
                  <div className="flex items-center ml-48">
                    <input type="checkbox" {...register('isUnlimited')} className="hidden" />
                    <div
                      onClick={handleToggle}
                      className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${isUnlimited ? 'bg-emerald-500' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-all ${isUnlimited ? 'right-1' : 'left-1'}`}></div>
                    </div>
                    <span className="ml-3 text-sm font-medium text-emerald-600">Unlimited</span>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-10">
                <div className="flex items-center gap-4 relative">
                  <div className="flex items-center flex-1">
                    <label className="w-40 font-semibold shrink-0">Discount</label>
                    <span className="mr-4">:</span>
                    <input type="text" {...register('discountValue')} className="w-24 border border-gray-300 rounded-lg p-2 outline-none" />
                  </div>
                  <div className="flex items-center">
                    <label className="mr-2 font-semibold">Type</label>
                    <span className="mr-2">:</span>
                    <div className="relative">
                      <select {...register('discountType')} className="appearance-none border border-gray-300 rounded-lg py-2 pl-4 pr-10 outline-none bg-white min-w-[100px]">
                        <option value="flat">Flat</option>
                        <option value="percentage">Percentage</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                  {errors.discountValue && <span className="absolute left-48 -bottom-6 text-red-500 text-xs">{errors.discountValue.message}</span>}
                </div>

                <div className="flex items-center relative">
                  <label className="w-40 font-semibold shrink-0">Expiry Date</label>
                  <span className="mr-4">:</span>
                  <input type="date" {...register('expiryDate')} className="flex-1 border border-gray-300 rounded-lg p-2 outline-none" />
                  {errors.expiryDate && <span className="absolute left-48 -bottom-6 text-red-500 text-xs">{errors.expiryDate.message}</span>}
                </div>

                <div className="flex items-center relative">
                  <label className="w-40 font-semibold shrink-0 leading-tight">Min Purchase</label>
                  <span className="mr-4">:</span>
                  <input type="text" {...register('minPurchaseAmount')} className="flex-1 border border-gray-300 rounded-lg p-2 outline-none" />
                  {errors.minPurchaseAmount && <span className="absolute left-48 -bottom-6 text-red-500 text-xs">{errors.minPurchaseAmount.message}</span>}
                </div>

                <div className="flex items-center relative">
                  <label className="w-40 font-semibold shrink-0 leading-tight">Max Discount</label>
                  <span className="mr-4">:</span>
                  <input type="text" {...register('maxDiscountAmount')} className="flex-1 border border-gray-300 rounded-lg p-2 outline-none" />
                  {errors.maxDiscountAmount && <span className="absolute left-48 -bottom-6 text-red-500 text-xs">{errors.maxDiscountAmount.message}</span>}
                </div>
              </div>

            </div>
          </div>

          <div className="flex justify-center">
            <button type="submit" className="bg-black text-white px-12 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">
              Add Coupon
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddCoupon;