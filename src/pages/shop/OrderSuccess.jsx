import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = location.state || { orderId: "Unknown" };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center p-4">
      <CheckCircle size={80} className="text-green-500 mb-6" />
      <h1 className="text-3xl font-bold mb-2">Order Successful!</h1>
      <p className="text-gray-500 mb-8">Thank you for your purchase. Your order ID is <span className="font-mono text-black font-bold">{orderId}</span></p>
      
      <div className="space-x-4">
        <button onClick={() => navigate('/shop')} className="px-6 py-3 border border-black rounded-full hover:bg-gray-50">Continue Shopping</button>
        <button onClick={() => navigate('/profile/orders')} className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800">View Order</button>
      </div>
    </div>
  );
};

export default OrderSuccess;