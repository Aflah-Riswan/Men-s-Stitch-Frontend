import React, { useEffect, useState } from 'react';
import { Download, Truck, MessageSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';
import * as orderService from '../../services/orderService'; 

// Import your components
import UserSidebar from '../../Components/user-account-components/UserSidebar';
import Footer from '../../Components/Footer';
import NewsLetter from '../../Components/NewsLetter'; 
import ReviewModal from '../../Components/ReviewModal'; 
import CancelModal from '../../Components/CancelModal'; 
import reviewService from '../../services/reviewService';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Modal State ---
  const [activeModal, setActiveModal] = useState('none'); 
  const [selectedData, setSelectedData] = useState(null); 

  // --- 1. Fetch Orders ---
  const fetchOrders = async () => {
    try {
      const response = await orderService.getMyOrders();
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load order history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // --- 2. Cancel Logic (UPDATED) ---
  const handleCancelClick = (orderId, itemId = null) => {
   
    setSelectedData({ orderId, itemId });
    setActiveModal('cancel');
  };

  const handleConfirmCancel = async (reason) => {
    const { orderId, itemId } = selectedData; // Extract IDs
    try {
      // Pass itemId to the backend. If null, backend cancels full order.
      await orderService.cancelOrder(orderId, reason, itemId); 
      
      toast.success(itemId ? "Item cancelled successfully" : "Order cancelled successfully");
      fetchOrders(); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel");
    } finally {
      setActiveModal('none');
      setSelectedData(null);
    }
  };

  // --- 3. Review Logic ---
  const handleReviewClick = (item, orderId) => {
   
    setSelectedData({ ...item, orderId: orderId });
    setActiveModal('review');
  };

  const handleConfirmReview = async ({rating , comment}) => {
   const { productId , orderId } =  selectedData
   console.log('productID : ', productId),
   console.log("orderId : ",orderId)
   console.log("rating :",rating)
   console.log("comment : ",comment)
   await reviewService.postReview(orderId ,productId , rating , comment )
    fetchOrders();
    toast.success("Review submitted successfully!");
    setActiveModal('none');
    setSelectedData(null);
  };

  // --- 4. Helper: Get Styles (UPDATED) ---
  const getStatusConfig = (status, deliveryDate) => {
    const safeStatus = status || 'Processing';
    const normalizedStatus = safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1).toLowerCase();

    switch (normalizedStatus) {
      case 'Delivered':
        return {
          color: 'text-green-600',
          bg: 'bg-green-50',
          dateLabel: `Delivered on ${new Date(deliveryDate).toLocaleDateString()}`,
          dateColor: 'text-green-600',
          showTruck: false,
          actions: ['invoice', 'review', 'view']
        };
      case 'Cancelled':
      case 'Canceled':
        return {
          color: 'text-red-600',
          bg: 'bg-red-50',
          dateLabel: 'Cancelled',
          dateColor: 'text-red-400',
          showTruck: false,
          actions: ['view'] 
        };
      case 'Shipped':
        return {
          color: 'text-blue-600',
          bg: 'bg-blue-50',
          dateLabel: 'In Transit',
          dateColor: 'text-blue-500',
          showTruck: true,
          actions: ['track', 'view']
        };
      default: // Pending, Processing, Ordered
        return {
          color: 'text-lime-600',
          bg: 'bg-lime-50',
          dateLabel: `Estimated Delivery: ${new Date(Date.now() + 5 * 86400000).toLocaleDateString()}`,
          dateColor: 'text-green-500',
          showTruck: true,
          actions: ['cancel', 'view']
        };
    }
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      
      <ReviewModal 
        isOpen={activeModal === 'review'}
        onClose={() => setActiveModal('none')}
        product={selectedData} 
        onSubmit={handleConfirmReview}
      />

      <CancelModal 
        isOpen={activeModal === 'cancel'}
        onClose={() => setActiveModal('none')}
        onSubmit={handleConfirmCancel}
      />

      <div className="flex-1 flex flex-col md:flex-row w-full max-w-7xl mx-auto">
        <UserSidebar activeTab="My orders" />
        <div className="flex-1 flex flex-col min-w-0">
          
          {loading ? (
             <div className="flex-1 flex items-center justify-center">Loading orders...</div>
          ) : orders.length === 0 ? (
             <div className="flex-1 flex flex-col items-center justify-center p-8">
                <h2 className="text-2xl font-bold text-gray-900">No orders found</h2>
                <p className="text-gray-500 mt-2">Looks like you haven't placed any orders yet.</p>
             </div>
          ) : (
             <div className="flex-1 p-4 sm:p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Order History</h1>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="divide-y divide-gray-100">
                    {orders.map((order) => {
                      return order.items.map((item, index) => {
      
                        const displayStatus = (item.itemStatus === 'Cancelled') 
                                              ? 'Cancelled' 
                                              : item.itemStatus;

                        const config = getStatusConfig(displayStatus, order.updatedAt);

                        return (
                          <div key={`${order._id}-${item._id || index}`} className="p-6 flex flex-col sm:flex-row gap-6 hover:bg-gray-50 transition">
                            <div className="w-full sm:w-32 h-36 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                              <img 
                                src={item.image || "https://placehold.co/150"} 
                                alt={item.name} 
                                className="w-full h-full object-cover object-top"
                              />
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between items-start">
                                    <h3 className="text-base font-bold text-gray-900">{item.name}</h3>
                                    <span className="text-xs text-gray-400 font-mono">ID: {order.orderId}</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">Size: <span className="text-gray-900 font-medium">{item.size}</span></p>
                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                <p className="text-lg font-bold text-gray-900 mt-2">₹{item.price}</p>
                              </div>
                            </div>
                            <div className="flex flex-col justify-between items-start sm:items-end w-full sm:w-auto mt-4 sm:mt-0">
                              
                              {/* STATUS BADGE */}
                              <div className={`text-sm font-bold mb-4 px-3 py-1 rounded-full ${config.bg} ${config.color} inline-flex items-center gap-2`}>
                                {displayStatus.toUpperCase()} 
                              </div>

                              <div className="flex flex-wrap justify-start sm:justify-end gap-2 mb-4">
                                {config.actions.includes('cancel') && (
                                    <button 
                                        // --- FIX: Pass item._id to cancel specific item ---
                                        onClick={() => handleCancelClick(order._id, item._id)}
                                        className="flex items-center justify-center border border-red-200 text-red-600 bg-white text-xs font-medium px-4 py-2 rounded-md hover:bg-red-50 transition"
                                    >
                                        Cancel Item
                                    </button>
                                )}
                                {config.actions.includes('review') && (
                                    <button 
                                        onClick={() => handleReviewClick(item, order._id)} 
                                        className="flex items-center justify-center bg-black text-white text-xs font-medium px-4 py-2 rounded-md hover:bg-gray-800 transition"
                                    >
                                        <MessageSquare size={14} className="mr-1" /> Review
                                    </button>
                                )}
                                {config.actions.includes('invoice') && (
                                    <button className="flex items-center justify-center border border-gray-300 text-gray-700 bg-white text-xs font-medium px-4 py-2 rounded-md hover:bg-gray-50 transition">
                                        <Download size={14} className="mr-1" /> Invoice
                                    </button>
                                )}
                                <button className="flex items-center justify-center border border-gray-300 text-gray-700 bg-white text-xs font-medium px-4 py-2 rounded-md hover:bg-gray-50 transition">
                                    View Details
                                </button>
                              </div>
                              {config.dateLabel && (
                                <div className={`flex items-center text-xs font-medium ${config.dateColor}`}>
                                  {config.showTruck && <Truck size={14} className="mr-1.5" />}
                                  {config.dateLabel}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      });
                    })}
                  </div>
                </div>
             </div>
          )}
        </div>
      </div>
      <div className="w-full mt-12 px-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-12">
            <NewsLetter />
          </div>
          <Footer />
      </div>
    </div>
  );
};

export default OrderHistory;