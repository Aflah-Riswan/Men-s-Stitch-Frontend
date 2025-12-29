import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import * as orderService from '../../services/orderService'; 
import { toast } from 'react-hot-toast';

import NewsLetter from '../../Components/NewsLetter';
import Footer from '../../Components/Footer';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addressId ,  paymentSummary } = location.state || {};

  const [selectedMethod, setSelectedMethod] = useState('cod');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!addressId) {
      navigate('/checkout');
    }
    console.log(paymentSummary)
  }, [addressId, navigate]);

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        addressId,
        paymentMethod: selectedMethod
      };

      const res = await orderService.placeOrder(orderData);
      
      if (res.data.success) {
        toast.success("Order Placed Successfully!");
        navigate('/order-success', { state: { orderId: res.data.orderId } });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900 flex flex-col">
      
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full text-xs text-gray-500 flex items-center gap-2">
        <span>Home</span> <ChevronRight size={12} />
        <span>cart</span> <ChevronRight size={12} />
        <span>checkout</span> <ChevronRight size={12} />
        <span className="font-medium text-gray-900">place order</span>
      </div>

      {/* Main Checkout Content */}
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-20">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-10">
          
          {/* LEFT COLUMN: Payment Methods */}
          <div className="lg:col-span-7">
            <div className="border border-gray-200 rounded-[20px] p-6 sm:p-8">
              <h2 className="text-lg font-bold mb-6">Payment Methods</h2>
              <hr className="border-gray-100 mb-6" />
              
              <div className="space-y-4">
                <p className="text-sm text-gray-500 mb-4">Select any payment methods</p>

                {/* Option 1: Card */}
                <div 
                  onClick={() => setSelectedMethod('card')}
                  className="flex items-center cursor-pointer group py-1"
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-4 flex-shrink-0 ${selectedMethod === 'card' ? 'border-black' : 'border-gray-300'}`}>
                    {selectedMethod === 'card' && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                  </div>
                  <span className="font-medium flex-1 text-sm sm:text-base">Debit Card / Credit Card</span>
                  {/* Visual Icons for Card */}
                  <div className="flex gap-2">
                    <div className="h-4 sm:h-5 w-7 sm:w-8 bg-[#00579F] rounded flex items-center justify-center text-[6px] sm:text-[8px] text-white font-bold italic tracking-tighter">VISA</div>
                    <div className="h-4 sm:h-5 w-7 sm:w-8 bg-[#EB001B] rounded flex items-center justify-center text-[6px] sm:text-[8px] text-white font-bold tracking-tighter">MC</div>
                  </div>
                </div>

                {/* Option 2: Bank (Visual Placeholder) */}
                <div className="flex items-center cursor-pointer opacity-50 py-1">
                  <div className="w-5 h-5 rounded-full border border-gray-300 mr-4 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base">Bank</span>
                </div>

                {/* Option 3: UPI (Visual Placeholder) */}
                <div className="flex items-center cursor-pointer opacity-50 py-1">
                   <div className="w-5 h-5 rounded-full border border-gray-300 mr-4 flex-shrink-0" />
                   <span className="font-medium text-sm sm:text-base">UPI Method</span>
                </div>

                {/* Option 4: COD */}
                <div 
                  onClick={() => setSelectedMethod('cod')}
                  className="flex items-center cursor-pointer group py-1"
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-4 flex-shrink-0 ${selectedMethod === 'cod' ? 'border-black' : 'border-gray-300'}`}>
                    {selectedMethod === 'cod' && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                  </div>
                  <span className="font-medium text-sm sm:text-base">Cash on delivery</span>
                </div>

                 {/* Option 5: Wallet (Visual Placeholder) */}
                 <div className="flex items-center cursor-pointer opacity-50 py-1">
                   <div className="w-5 h-5 rounded-full border border-gray-300 mr-4 flex-shrink-0" />
                   <span className="font-medium text-sm sm:text-base">Wallet</span>
                </div>

              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-gray-50/80 rounded-[20px] p-6 sm:p-8 border border-gray-100 sticky top-4">
              <h2 className="text-lg font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 text-sm font-medium">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="text-gray-900">₹{paymentSummary.subTotal}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Discount (-20%)</span>
                  <span className="text-red-500">-₹{paymentSummary.discount}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Delivery Fee</span>
                  <span className="text-green-500">
                    -₹{paymentSummary.shippingFee}
                  </span>
                </div>
              </div>

              <hr className="border-gray-200 mb-6" />
              <div className="flex justify-between items-center mb-8">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-xl text-gray-900">₹{paymentSummary.grandTotal}</span>
              </div>

              {/* PLACE ORDER BUTTON */}
              <button 
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-black text-white py-4 rounded-full font-bold text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Place Order"}
                {!loading && <ArrowRight size={16} />}
              </button>

              <p className="text-[10px] text-gray-400 mt-6 text-center leading-tight">
                By continuing, I confirm that I have read and accept the <a href="#" className="underline hover:text-gray-600">Terms and Conditions</a> and the <a href="#" className="underline hover:text-gray-600">Privacy Policy</a>.
              </p>
            </div>
          </div>

        </div>
      </div>

      
      <div className="w-full bg-[#F0F0F0] pt-12 pb-8 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto space-y-12">
       
          <NewsLetter />
          
       
          <Footer />
        </div>
      </div>

    </div>
  );
};

export default Payment;