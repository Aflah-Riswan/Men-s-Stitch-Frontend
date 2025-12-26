import React, { useEffect, useState } from 'react';
import { Download, Truck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import * as orderService from '../../services/orderService'; 

// Import your components
import UserSidebar from '../../Components/user-account-components/UserSidebar';    
import Footer from '../../Components/Footer';    // Ensure this path is correct

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. Fetch Orders from Backend (Logic Unchanged) ---
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

  // --- 2. Handle Cancel Order (Logic Unchanged) ---
  const handleCancel = async (orderId) => {
    if(!window.confirm("Are you sure you want to cancel this entire order?")) return;

    try {
      await orderService.cancelOrder(orderId);
      toast.success("Order cancelled successfully");
      fetchOrders(); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel order");
    }
  };

  // --- 3. Helper: Get Styles & Buttons (Logic Unchanged) ---
  const getStatusConfig = (status, deliveryDate) => {
    switch (status) {
      case 'Delivered':
        return {
          color: 'text-green-600',
          bg: 'bg-green-50',
          dateLabel: `Delivered on ${new Date(deliveryDate).toLocaleDateString()}`,
          dateColor: 'text-green-600',
          showTruck: false,
          actions: ['invoice', 'view']
        };
      case 'Cancelled':
        return {
          color: 'text-red-600',
          bg: 'bg-red-50',
          dateLabel: 'Order was cancelled',
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
      case 'Pending':
      case 'Processing':
      default:
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
    // Flex container to hold Sidebar (left) and Content (right)
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 font-sans">
      
      {/* SIDEBAR Added Here */}
      <UserSidebar activeTab="My orders" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Loading State */}
        {loading ? (
           <div className="flex-1 flex items-center justify-center">Loading orders...</div>
        ) : orders.length === 0 ? (
           // Empty State
           <div className="flex-1 flex flex-col items-center justify-center p-8">
              <h2 className="text-2xl font-bold text-gray-900">No orders found</h2>
              <p className="text-gray-500 mt-2">Looks like you haven't placed any orders yet.</p>
           </div>
        ) : (
           // Orders List Content
           <div className="flex-1 p-4 sm:p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Order History</h1>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {orders.map((order) => {
                    const config = getStatusConfig(order.status, order.updatedAt);

                    return order.items.map((item) => (
                      <div key={`${order._id}-${item._id}`} className="p-6 flex flex-col sm:flex-row gap-6 hover:bg-gray-50 transition">
                        
                        {/* Product Image */}
                        <div className="w-full sm:w-32 h-36 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                          <img 
                            src={item.image || "https://placehold.co/150"} 
                            alt={item.name} 
                            className="w-full h-full object-cover object-top"
                          />
                        </div>

                        {/* Product Info */}
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

                        {/* Status & Actions */}
                        <div className="flex flex-col justify-between items-start sm:items-end w-full sm:w-auto mt-4 sm:mt-0">
                          
                          <div className={`text-sm font-bold mb-4 px-3 py-1 rounded-full ${config.bg} ${config.color} inline-flex items-center gap-2`}>
                            {order.status.toUpperCase()}
                          </div>

                          <div className="flex flex-wrap justify-start sm:justify-end gap-2 mb-4">
                            {config.actions.includes('cancel') && (
                                <button 
                                    onClick={() => handleCancel(order._id)}
                                    className="flex items-center justify-center border border-red-200 text-red-600 bg-white text-xs font-medium px-4 py-2 rounded-md hover:bg-red-50 transition"
                                >
                                    Cancel Order
                                </button>
                            )}
                            {config.actions.includes('invoice') && (
                                <button className="flex items-center justify-center bg-black text-white text-xs font-medium px-4 py-2 rounded-md hover:bg-gray-800 transition">
                                    <Download size={14} className="mr-1" /> Invoice
                                </button>
                            )}
                            {config.actions.includes('track') && (
                                <button className="flex items-center justify-center bg-black text-white text-xs font-medium px-4 py-2 rounded-md hover:bg-gray-800 transition">
                                    <Truck size={14} className="mr-1" /> Track
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
                    ));
                  })}
                </div>
              </div>
           </div>
        )}

        {/* Footer Section */}
        <div className="p-4 sm:p-8 mt-auto border-t border-gray-200">
           <Footer />
        </div>

      </div>
    </div>
  );
};

export default OrderHistory;