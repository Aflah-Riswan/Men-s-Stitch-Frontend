import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';
import * as orderService from '../../services/orderService';
import { toast } from 'react-hot-toast';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addressId } = location.state || {}; // Get passed addressId

  const [selectedMethod, setSelectedMethod] = useState('cod');
  const [loading, setLoading] = useState(false);

  // Redirect if no address selected
  if (!addressId) {
    React.useEffect(() => { navigate('/checkout'); }, []);
    return null;
  }

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
    <div className="bg-white min-h-screen font-sans text-gray-900 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Select Payment</h1>
        
        <div className="border border-gray-200 rounded-2xl p-6 mb-8">
           <h2 className="text-lg font-bold mb-4">Payment Methods</h2>
           
           <div className="space-y-4">
              {/* COD Option */}
              <div onClick={() => setSelectedMethod('cod')} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                 <div className="mr-4">{selectedMethod === 'cod' ? <CheckCircle className="text-black" /> : <Circle className="text-gray-300" />}</div>
                 <span className="font-medium">Cash on Delivery</span>
              </div>

              {/* Online (Dummy for now) */}
              <div onClick={() => setSelectedMethod('card')} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                 <div className="mr-4">{selectedMethod === 'card' ? <CheckCircle className="text-black" /> : <Circle className="text-gray-300" />}</div>
                 <span className="font-medium">Credit/Debit Card (Razorpay)</span>
              </div>
           </div>
        </div>

        <button 
          onClick={handlePlaceOrder} 
          disabled={loading}
          className="w-full bg-black text-white py-4 rounded-full font-bold hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Confirm Order"}
        </button>
      </div>
    </div>
  );
};

export default Payment;