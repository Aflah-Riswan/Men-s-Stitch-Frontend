import React, { useEffect, useState } from 'react';
import { Download, Truck, MessageSquare, RotateCcw, AlertCircle, XCircle, Package, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';
import * as orderService from '../../services/orderService';

import UserSidebar from '../../Components/user-account-components/UserSidebar';
import Footer from '../../Components/Footer';
import NewsLetter from '../../Components/NewsLetter';
import ReviewModal from '../../Components/ReviewModal';
import CancelModal from '../../Components/CancelModal';
import reviewService from '../../services/reviewService';
import { useNavigate } from 'react-router-dom';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [activeModal, setActiveModal] = useState('none');
  const [selectedData, setSelectedData] = useState(null);
  const [itemErrors, setItemErrors] = useState({});

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

  const handleCancelClick = (orderId, itemId = null) => {
    setSelectedData({ orderId, itemId });
    if (itemId) {
      setItemErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[itemId];
        return newErrors;
      });
    }
    setActiveModal('cancel');
  };

  const handleReturnClick = (orderId, itemId) => {
    setSelectedData({ orderId, itemId });
    setActiveModal('return');
  };

  const handleConfirmCancel = async (reason) => {
    const { orderId, itemId } = selectedData;
    try {
      if (itemId) {

        await orderService.cancelOrder(orderId, reason, itemId);
        toast.success("Item cancelled successfully");
      } else {

        await orderService.cancelEntireOrder(orderId, reason);
        toast.success("Order cancelled successfully");
      }

      fetchOrders();
      setActiveModal('none');
    } catch (error) {
      if (errorCode === 'COUPON_VIOLATION' && itemId) {
        setActiveModal('none');
        setItemErrors(prev => ({ ...prev, [itemId]: msg }));
        setTimeout(() => {
          setItemErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[itemId];
            return newErrors;
          });
        }, 5000);
      }
      else {

        toast.error(msg);
        setActiveModal('none');
      }

    } finally {
      if (activeModal !== 'none') setActiveModal('none');
      setSelectedData(null);
    }
  };

  const handleConfirmReturn = async (reason) => {
    const { orderId, itemId } = selectedData;
    try {
      await orderService.returnOrder(orderId, itemId, reason);
      toast.success("Return request submitted successfully");
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit return");
    } finally {
      setActiveModal('none');
      setSelectedData(null);
    }
  };

  const handleReviewClick = (item, orderId) => {
    setSelectedData({ ...item, orderId: orderId });
    setActiveModal('review');
  };

  const handleConfirmReview = async ({ rating, comment }) => {
    const { productId, orderId } = selectedData;
    await reviewService.postReview(orderId, productId, rating, comment);
    fetchOrders();
    toast.success("Review submitted successfully!");
    setActiveModal('none');
    setSelectedData(null);
  };


  const getStatusConfig = (status) => {
    switch (status) {
      case 'Delivered':
        return { color: 'text-green-600', bg: 'bg-green-50', actions: ['invoice', 'review', 'return'] };
      case 'Cancelled':
        return { color: 'text-red-600', bg: 'bg-red-50', actions: [] };
      case 'Shipped':
        return { color: 'text-blue-600', bg: 'bg-blue-50', actions: ['track'] };
      case 'Returned':
        return { color: 'text-orange-600', bg: 'bg-orange-50', actions: [] };
      case 'Return Approved':
        return { color: 'text-yellow-600', bg: 'bg-yellow-50', actions: [] };
      case 'Return Requested':
        return { color: 'text-yellow-600', bg: 'bg-yellow-50', actions: [] };
      case 'Return Rejected':
        return { color: 'text-yellow-600', bg: 'bg-yellow-50', actions: [] };
      default:
        return { color: 'text-lime-600', bg: 'bg-lime-50', actions: ['cancel'] };
    }
  };

  const isReturnModal = activeModal === 'return';

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">

      {/* Modals */}
      <ReviewModal
        isOpen={activeModal === 'review'}
        onClose={() => setActiveModal('none')}
        product={selectedData}
        onSubmit={handleConfirmReview}
      />
      <CancelModal
        isOpen={activeModal === 'cancel' || activeModal === 'return'}
        onClose={() => setActiveModal('none')}
        onSubmit={isReturnModal ? handleConfirmReturn : handleConfirmCancel}
        title={isReturnModal ? "Return Item" : "Cancel Item"}
        type={isReturnModal ? 'return' : 'cancel'}
      />

      <div className="flex-1 flex flex-col md:flex-row w-full max-w-7xl mx-auto">
        <UserSidebar activeTab="My orders" />

        <div className="flex-1 flex flex-col min-w-0 p-4 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Order History</h1>

          {loading ? (
            <div className="flex-1 flex items-center justify-center">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm border border-gray-100">
              <Package size={48} className="text-gray-300 mb-4" />
              <h2 className="text-xl font-bold text-gray-900">No orders found</h2>
              <p className="text-gray-500 mt-2">Looks like you haven't placed any orders yet.</p>
            </div>
          ) : (
            <div className="space-y-6">

              {orders.map((order) => {
                const isOrderCancellable = !['Cancelled', 'Delivered', 'Returned', 'Return Approved'].includes(order.status);

                return (
                  <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

                    {/* --- ORDER HEADER --- */}
                    <div className="bg-gray-50 p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex flex-col sm:flex-row sm:gap-8 gap-2">
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-bold">Order Placed</p>
                          <p className="text-sm font-medium text-gray-900">{new Date(order.createdAt).toDateString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-bold">Total</p>
                          <p className="text-sm font-medium text-gray-900">₹{order.totalAmount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-bold">Order #</p>
                          <p className="text-sm font-mono text-gray-600">{order.orderId}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        {/* MAIN CANCEL BUTTON */}
                        {isOrderCancellable && (
                          <button
                            onClick={() => handleCancelClick(order._id)}
                            className="flex-1 sm:flex-none border border-gray-300 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 px-3 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2"
                          >
                            <XCircle size={14} /> Cancel Order
                          </button>
                        )}

                        {/* VIEW DETAILS BUTTON */}
                        <button
                          onClick={() => navigate(`${order._id}`)}
                          className="flex-1 sm:flex-none bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2"
                        >
                          <Eye size={14} /> View Details
                        </button>
                      </div>
                    </div>

                    {/* --- ITEMS LIST --- */}
                    <div className="divide-y divide-gray-100">
                      {order.items.map((item) => {
                        const displayStatus = (item.itemStatus === 'Cancelled') ? 'Cancelled' : item.itemStatus;
                        const config = getStatusConfig(displayStatus);
                        const errorMessage = itemErrors[item._id];

                        return (
                          <div key={item._id} className="p-6 flex flex-col sm:flex-row gap-6 hover:bg-gray-50/50 transition">
                            {/* Image */}
                            <div className="w-20 h-24 sm:w-24 sm:h-28 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                              <img src={item.image || "https://placehold.co/150"} alt={item.name} className="w-full h-full object-cover" />
                            </div>

                            {/* Details */}
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-bold text-gray-900 text-base">{item.name}</h3>
                                  <p className="text-sm text-gray-500 mt-1">Size: {item.size} • Qty: {item.quantity}</p>
                                </div>
                                <p className="font-bold text-gray-900">₹{item.price}</p>
                              </div>

                              {/* Item Actions Row */}
                              <div className="mt-4 flex flex-wrap items-center gap-3">
                                {/* Status Badge */}
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${config.bg} ${config.color} border-transparent bg-opacity-50`}>
                                  {displayStatus}
                                </span>

                                {/* Item Cancel */}
                                {config.actions.includes('cancel') && (
                                  <button onClick={() => handleCancelClick(order._id, item._id)} className="text-xs font-medium text-red-600 hover:underline">
                                    Cancel Item
                                  </button>
                                )}

                                {/* Return */}
                                {config.actions.includes('return') && (
                                  <button onClick={() => handleReturnClick(order._id, item._id)} className="text-xs font-medium text-orange-600 hover:underline flex items-center gap-1">
                                    <RotateCcw size={12} /> Return Item
                                  </button>
                                )}

                                {/* Review */}
                                {config.actions.includes('review') && (
                                  <button onClick={() => handleReviewClick(item, order._id)} className="text-xs font-medium text-blue-600 hover:underline">
                                    Write Review
                                  </button>
                                )}
                              </div>

                              {/* Error Message */}
                              {errorMessage && (
                                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                                  <AlertCircle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="text-xs text-red-700 font-medium">{errorMessage}</p>
                                    <button onClick={() => handleCancelClick(order._id)} className="text-xs font-bold text-red-800 underline mt-1">
                                      Cancel entire order instead?
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="w-full mt-12 px-4 sm:px-10">
        <div className="max-w-7xl mx-auto mb-12">
          <NewsLetter />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default OrderHistory;