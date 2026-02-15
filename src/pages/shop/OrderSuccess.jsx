import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';


import NewsLetter from '../../Components/NewsLetter'; 
import Footer from '../../Components/Footer';        

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId , data } = location.state || { orderId: "Unknown" };
  console.log(data , "; data")

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-gray-900">
      <div className="flex-grow flex flex-col items-center justify-center text-center p-4 min-h-[60vh]">
        
        <CheckCircle size={80} className="text-green-500 mb-6" />
        
        <h1 className="text-3xl font-bold mb-2">Order Successful!</h1>
        
        <p className="text-gray-500 mb-8">
          Thank you for your purchase. Your order ID is <span className="font-mono text-black font-bold">{orderId}</span>
        </p>
        
        <div className="space-x-4">
          <button 
            onClick={() => navigate('/')} 
            className="px-6 py-3 border border-black rounded-full hover:bg-gray-50 transition-colors font-medium"
          >
            Continue Shopping
          </button>
          <button 
            onClick={() => navigate('/orders')} 
            className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-medium"
          >
            View Order
          </button>
        </div>
      </div>

      {/* 2. Footer & Newsletter Section */}
      <div className="w-full bg-[#F0F0F0] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          <NewsLetter />
          <Footer />
        </div>
      </div>

    </div>
  );
};

export default OrderSuccess;