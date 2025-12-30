import React, { useEffect, useState } from 'react';
import {
  Calendar, CreditCard, User, Mail, Phone, MapPin,
  Package, Truck, CheckCircle, ChevronLeft, Loader2, AlertCircle, X, Edit2, RotateCcw, ThumbsUp, ThumbsDown
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import * as orderService from '../../../services/orderService';
import { toast } from 'react-hot-toast';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetType, setTargetType] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  // UPDATED: Added Return statuses
  const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  const ITEM_STATUSES = ['Ordered', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Return Requested', 'Return Approved', 'Return Rejected', 'Returned'];

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

  const openOrderModal = () => {
    setTargetType('order');
    setNewStatus(order.status);
    setIsModalOpen(true);
  };

  const openItemModal = (item) => {
    setTargetType('item');
    setSelectedItem(item);
    setNewStatus(item.itemStatus || 'Ordered');
    setIsModalOpen(true);
  };

  // --- NEW: Helper for Quick Return Actions ---
  const handleQuickStatusUpdate = async (itemId, status) => {
    if(!window.confirm(`Are you sure you want to set status to: ${status}?`)) return;
    
    try {
        setLoading(true); // Small local loading effect could be better, but this works
        const response = await orderService.updateOrderItemStatus(order._id, itemId, status);
        if (response.success) {
            toast.success(`Status updated to ${status}`);
            fetchOrder();
        }
    } catch (error) {
        console.error(error);
        toast.error("Failed to update status");
        setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      setUpdating(true);
      let response;

      if (targetType === 'order') {
        response = await orderService.updateOrderStatus(order._id, newStatus);
      } else {
        response = await orderService.updateOrderItemStatus(order._id, selectedItem._id, newStatus);
      }

      if (response.success) {
        toast.success("Status updated successfully");
        fetchOrder()
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'text-green-700 bg-green-100 border-green-200';
      case 'Cancelled': return 'text-red-700 bg-red-100 border-red-200';
      case 'Shipped': return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'Processing': return 'text-orange-700 bg-orange-100 border-orange-200';
      case 'Return Requested': return 'text-purple-700 bg-purple-100 border-purple-200';
      case 'Return Approved': return 'text-teal-700 bg-teal-100 border-teal-200';
      case 'Return Rejected': return 'text-gray-700 bg-gray-200 border-gray-300';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  const currentStepIndex = steps.indexOf(order?.status) === -1 ? 0 : steps.indexOf(order?.status);
  const isCancelled = order?.status === 'Cancelled';

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 text-gray-500 gap-2">
        <Loader2 className="animate-spin" /> Loading Order Details...
      </div>
    );
  }

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
    <div className="p-6 bg-gray-50 min-h-screen font-sans text-gray-800 relative">

      {/* Page Title */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1 cursor-pointer hover:text-gray-700" onClick={() => navigate(-1)}>
            <ChevronLeft size={16} /> Back to Orders
          </div>
          <h1 className="text-2xl font-bold text-teal-800">Order Details</h1>
        </div>
      </div>

      {/* Top Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Card 1: Order Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative group">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-gray-800">Order #{order.orderId}</h3>
            <button
              onClick={openOrderModal}
              className={`px-3 py-1 text-xs font-bold rounded-full border cursor-pointer hover:opacity-80 transition flex items-center gap-1 ${getStatusColor(order.status)}`}
            >
              {order.status}
              <Edit2 size={10} className="opacity-50" />
            </button>
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
                {order.shippingAddress?.fullName}<br />
                {order.shippingAddress?.street}, {order.shippingAddress?.city}<br />
                {order.shippingAddress?.state}, {order.shippingAddress?.country} - {order.shippingAddress?.pincode}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column (Span 2) - Products List */}
        <div className="lg:col-span-2 space-y-6">

          {/* Products Loop */}
          <div className="space-y-4">
            {order.items?.map((item, index) => (
              <div key={index} className={`bg-white p-6 rounded-xl shadow-sm border transition ${item.itemStatus === 'Return Requested' ? 'border-purple-200 bg-purple-50/30' : 'border-gray-100'} flex flex-col sm:flex-row items-center sm:items-start gap-6`}>
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden border border-gray-200">
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
                  
                  {/* --- RETURN REASON DISPLAY --- */}
                  {item.itemStatus === 'Return Requested' && (
                    <div className="mt-3 p-3 bg-white border border-purple-100 rounded-lg shadow-sm text-left">
                        <p className="text-xs text-purple-600 font-bold mb-1 flex items-center gap-1"><RotateCcw size={12}/> Customer Request: Return</p>
                        <p className="text-sm text-gray-700 italic">" {item.returnReason || 'No reason provided'} "</p>
                        
                        <div className="flex gap-2 mt-3">
                            <button 
                                onClick={() => handleQuickStatusUpdate(item._id, 'Return Approved')}
                                className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded hover:bg-green-700"
                            >
                                <ThumbsUp size={12} /> Approve
                            </button>
                            <button 
                                onClick={() => handleQuickStatusUpdate(item._id, 'Return Rejected')}
                                className="flex items-center gap-1 px-3 py-1.5 bg-gray-600 text-white text-xs font-bold rounded hover:bg-gray-700"
                            >
                                <ThumbsDown size={12} /> Reject
                            </button>
                        </div>
                    </div>
                  )}
                </div>

                {/* CLICKABLE ITEM STATUS */}
                <div className="flex flex-col items-end gap-2">
                  <span className="px-4 py-2 bg-gray-100 rounded-lg font-medium text-sm text-gray-700">Qty: {item.quantity}</span>

                  <button
                    onClick={() => openItemModal(item)}
                    className={`text-xs px-3 py-1.5 rounded border font-medium cursor-pointer hover:opacity-80 flex items-center gap-1 transition ${
                        item.itemStatus === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-100' : 
                        item.itemStatus === 'Return Requested' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                        'bg-green-50 text-green-600 border-green-100'
                      }`}
                  >
                    {item.itemStatus || 'Ordered'}
                    <Edit2 size={10} />
                  </button>
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
                <p className="text-sm mt-1">Reason: {order.cancellationReason || 'Admin Action'}</p>
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
                      {isCurrent && (
                        <p className="text-xs text-blue-600 mt-1 font-medium">Current Status</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button onClick={() => navigate(-1)} className="flex-1 bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-medium transition-colors">
              Go Back
            </button>
          </div>
        </div>
      </div>

      {/* --- STATUS UPDATE MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all scale-100">

            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-gray-800">
                Update {targetType === 'order' ? 'Order' : 'Item'} Status
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-4">
                Change status for <span className="font-bold text-gray-700">
                  {targetType === 'order' ? `Order #${order.orderId}` : selectedItem?.name}
                </span>
              </p>

              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Select New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all cursor-pointer"
                >
                  {(targetType === 'order' ? ORDER_STATUSES : ITEM_STATUSES).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 flex gap-3 justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={updating}
                className="px-6 py-2 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                {updating ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OrderDetails;