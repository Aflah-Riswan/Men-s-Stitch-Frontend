import React, { useEffect, useState } from 'react';
import { 
  Calendar, CreditCard, User, Mail, Phone, MapPin, 
  Package, Truck, CheckCircle, ChevronLeft, Loader2, AlertCircle 
} from 'lucide-react'; 
import { useParams, useNavigate } from 'react-router-dom';
import * as orderService from '../../../services/orderService';
import { toast } from 'react-hot-toast';

const OrderDetails = () => {
  const { orderId } = useParams(); // Destructure correctly
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrderDetails(orderId);
      if (data.success) {
        setOrder(data.order);
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  // --- Helpers for Status Colors ---
  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'text-green-700 bg-green-100';
      case 'Cancelled': return 'text-red-700 bg-red-100';
      case 'Shipped': return 'text-blue-700 bg-blue-100';
      case 'Processing': return 'text-orange-700 bg-orange-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  // --- Logic for Timeline Steps ---
  // Define the logical order of steps
  const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  const currentStepIndex = steps.indexOf(order?.status) === -1 ? 0 : steps.indexOf(order?.status);
  const isCancelled = order?.status === 'Cancelled';

  // --- Loading State ---
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 text-gray-500 gap-2">
        <Loader2 className="animate-spin" /> Loading Order Details...
      </div>
    );
  }

  // --- Error State ---
  if (!order) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-500 gap-4">
        <AlertCircle size={48} className="text-red-400" />
        <p>Order not found or deleted.</p>
        <button onClick={() => navigate(-1)} className="text-blue-600 underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans text-gray-800">
      
      {/* Page Title */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <div className="flex items-center gap-2 text-gray-500 text-sm mb-1 cursor-pointer hover:text-gray-700" onClick={() => navigate(-1)}>
              <ChevronLeft size={16} /> Back to Orders
           </div>
           <h1 className="text-2xl font-bold text-teal-800">Order Details</h1>
        </div>
        
        {/* Top Right Action (Optional) */}
        {order.status === 'Pending' && (
             <button className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition">
                Cancel Order
             </button>
        )}
      </div>

      {/* Top Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        
        {/* Card 1: Order Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-gray-800">Order #{order.orderId}</h3>
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
          <div className="space-y-4">
            <div className="flex items-center text-sm">
              <div className="p-2 bg-gray-100 rounded-full mr-3 text-gray-500">
                <Calendar size={16} />
              </div>
              <div>
                <p className="text-gray-500 text-xs">Placed On</p>
                <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <div className="p-2 bg-gray-100 rounded-full mr-3 text-gray-500">
                <CreditCard size={16} />
              </div>
              <div>
                <p className="text-gray-500 text-xs">Payment Method</p>
                <p className="font-medium capitalize">{order.payment?.method || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Customer Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Customer</h3>
          <div className="space-y-4">
            <div className="flex items-center text-sm">
              <div className="p-2 bg-gray-100 rounded-full mr-3 text-gray-500">
                <User size={16} />
              </div>
              <div className="flex-1 flex justify-between">
                <span className="text-gray-500 text-xs">Name</span>
                {/* Use optional chaining in case user was deleted */}
                <span className="font-medium">{order.user?.firstName || 'Guest'}</span>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <div className="p-2 bg-gray-100 rounded-full mr-3 text-gray-500">
                <Mail size={16} />
              </div>
              <div className="flex-1 flex justify-between">
                <span className="text-gray-500 text-xs">Email</span>
                <span className="font-medium truncate max-w-[120px]" title={order.user?.email}>{order.user?.email || 'N/A'}</span>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <div className="p-2 bg-gray-100 rounded-full mr-3 text-gray-500">
                <Phone size={16} />
              </div>
              <div className="flex-1 flex justify-between">
                <span className="text-gray-500 text-xs">Phone</span>
                <span className="font-medium">{order.shippingAddress?.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Address */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Shipping Address</h3>
          <div className="flex items-start text-sm">
            <div className="p-2 bg-gray-100 rounded-full mr-3 text-gray-500 mt-1">
              <MapPin size={16} />
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">Deliver to</p>
              <p className="font-medium leading-relaxed">
                {order.shippingAddress?.fullName}<br/>
                {order.shippingAddress?.street}, {order.shippingAddress?.city}<br />
                {order.shippingAddress?.state}, {order.shippingAddress?.country} - {order.shippingAddress?.pincode}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid (Products + Summary vs Status) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Span 2) - Products List */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Products Loop */}
          <div className="space-y-4">
             {order.items?.map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden border border-gray-200">
                        {/* Use item image or a fallback */}
                        <img 
                            src={item.image || "/api/placeholder/100/100"} 
                            alt={item.name} 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                    <div className="flex-1 w-full text-center sm:text-left">
                        <h4 className="font-bold text-lg text-gray-900">{item.name}</h4>
                        <div className="text-sm text-gray-500 mb-2 mt-1">
                             {item.size && <span className="mr-3">Size: <span className="text-gray-700 font-medium">{item.size}</span></span>}
                             {item.color && <span>Color: <span className="text-gray-700 font-medium">{item.color}</span></span>}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">₹{item.price}</h3>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <span className="px-4 py-2 bg-gray-100 rounded-lg font-medium text-sm text-gray-700">Qty: {item.quantity}</span>
                        <span className={`text-xs px-2 py-1 rounded border ${
                            item.itemStatus === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'
                        }`}>
                            {item.itemStatus || 'Ordered'}
                        </span>
                    </div>
                </div>
             ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg mb-6 text-gray-800">Order Summary</h3>
            <div className="space-y-4 border-b border-gray-100 pb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Discount</span>
                <span className="font-bold text-red-500">-₹{order.discount || 0}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping Fee</span>
                <span className="font-bold text-gray-900">₹{order.shippingFee || 0}</span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-6 text-lg">
              <span className="text-gray-600">Total Paid</span>
              <span className="font-bold text-xl text-gray-900">₹{order.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Right Column (Span 1) - Status Timeline */}
        <div className="lg:col-span-1 space-y-6">
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
            <h3 className="font-bold text-lg mb-6 text-gray-800">Order Status</h3>
            
            {isCancelled ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
                    <AlertCircle className="mx-auto mb-2" />
                    <p className="font-bold">This Order is Cancelled</p>
                    <p className="text-sm mt-1">Reason: {order.cancellationReason || 'User Request'}</p>
                </div>
            ) : (
                <div className="relative pl-4 border-l-2 border-dashed border-gray-200 space-y-8">
                {steps.map((step, index) => {
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;

                    return (
                        <div key={step} className={`relative pl-6 ${isCompleted ? 'opacity-100' : 'opacity-40'}`}>
                            {/* Icon Bubble */}
                            <div className={`absolute -left-[21px] top-0 p-1 rounded-full border-2 border-white 
                                ${isCompleted ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}
                                ${isCurrent ? 'animate-pulse ring-2 ring-blue-100' : ''}
                            `}>
                                {step === 'Pending' && <Package size={16} />}
                                {step === 'Processing' && <Loader2 size={16} className={isCurrent ? "animate-spin" : ""} />}
                                {step === 'Shipped' && <Truck size={16} />}
                                {step === 'Delivered' && <CheckCircle size={16} />}
                            </div>

                            <h4 className={`font-bold text-sm ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                                {step}
                            </h4>
                            
                            {/* Show timestamps if available (optional logic) */}
                            {isCurrent && (
                                <p className="text-xs text-blue-600 mt-1 font-medium">Current Status</p>
                            )}
                        </div>
                    );
                })}
                </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
             <button 
                onClick={() => navigate(-1)}
                className="flex-1 bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-medium transition-colors"
             >
                Go Back
             </button>
             {/* Only show 'Cancel' if the order is still editable (Pending/Processing) */}
             {!isCancelled && (order.status === 'Pending' || order.status === 'Processing') && (
                 <button className="flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 py-3 rounded-lg font-medium transition-colors">
                    Cancel Order
                 </button>
             )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderDetails;