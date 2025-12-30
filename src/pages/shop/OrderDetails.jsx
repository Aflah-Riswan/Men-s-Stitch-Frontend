import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Download, CreditCard, ArrowLeft, RotateCcw, CheckCircle, XCircle, Clock, Loader2, AlertCircle, MapPin, User, Mail, Phone, Calendar } from 'lucide-react';
import * as orderService from '../../services/orderService';
import { toast } from 'react-hot-toast';

import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoiceDocument from '../../Components/InvoiceDocument';

import UserSidebar from '../../Components/user-account-components/UserSidebar';
import Footer from '../../Components/Footer';
import NewsLetter from '../../Components/NewsLetter';

const OrderDetails = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const highlightedItemId = location.state?.highlightedItemId;

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await orderService.orderDetails(orderId);
        if (response.data.success) {
          setOrder(response.data.order);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);


  const getProgressStats = (status) => {
    const steps = ['Ordered', 'Processing', 'Shipped', 'Delivered'];
    
    if (status === 'Cancelled') {
        return { currentIndex: -1, isCancelled: true, color: 'bg-red-500' };
    }

    if (['Return Requested', 'Return Approved', 'Return Rejected', 'Returned'].includes(status)) {
        return { 
            currentIndex: 3, 
            isCancelled: false, 
            isReturn: true, 
            returnStatus: status,
            color: 'bg-green-500' 
        };
    }

    const index = steps.indexOf(status);
    return { 
        currentIndex: index === -1 ? 0 : index, 
        isCancelled: false, 
        isReturn: false,
        color: 'bg-green-500' 
    };
  };

  const stepsList = ['Ordered', 'Processing', 'Shipped', 'Delivered'];

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (!order) return <div className="min-h-screen flex items-center justify-center">Order not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">

      <div className="flex-1 flex flex-col md:flex-row w-full max-w-7xl mx-auto">
        <UserSidebar activeTab="My orders" />

        <div className="flex-1 min-w-0 p-4 sm:p-8">

          {/* Back Button */}
          <button onClick={() => navigate('/account/orders')} className="flex items-center text-gray-500 hover:text-black mb-4 transition">
            <ArrowLeft size={18} className="mr-1" /> Back to Orders
          </button>

          <h1 className="text-2xl font-bold text-gray-900 mb-8">Order Details</h1>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">

            {/* Main Order Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Order ID: {order.orderId}</h2>
                <div className="flex flex-wrap gap-4 text-sm mt-2 text-gray-500">
                  <span>Placed on: <span className="text-gray-900 font-medium">{new Date(order.createdAt).toDateString()}</span></span>
                </div>
              </div>

              {/* 2. REPLACED DUMMY BUTTON WITH PDF DOWNLOAD LINK */}
              {order && (
                <PDFDownloadLink 
                  document={<InvoiceDocument order={order} />} 
                  fileName={`Invoice_${order.orderId}.pdf`}
                  className="text-decoration-none"
                >
                  {({ loading }) => (
                    <button 
                      disabled={loading}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                    >
                      <Download size={16} /> 
                      {loading ? 'Generating...' : 'Invoice'}
                    </button>
                  )}
                </PDFDownloadLink>
              )}
            </div>

            <hr className="border-gray-100 mb-8" />

            {/* --- PRODUCTS LIST --- */}
            <div className="space-y-8">
              {order.items.map((item) => {
                const isHighlighted = item._id === highlightedItemId;
                const { currentIndex, isCancelled, isReturn, returnStatus } = getProgressStats(item.itemStatus);

                return (
                  <div 
                    key={item._id} 
                    className={`flex flex-col gap-6 p-6 rounded-xl border transition-all duration-500
                      ${isHighlighted ? 'border-blue-300 bg-blue-50/30 shadow-md ring-1 ring-blue-300' : 'border-gray-100 bg-white'}`}
                  >
                    {/* Top Row: Product Info */}
                    <div className="flex gap-4 sm:gap-6">
                      <div className="w-24 h-32 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start">
                                <h3 className="text-base font-bold text-gray-900 line-clamp-2 pr-4">{item.name}</h3>
                                <p className="text-lg font-bold text-gray-900 whitespace-nowrap">₹{item.price}</p>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">Size: {item.size} • Color: {item.color}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        
                        <div className="mt-2 sm:hidden">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold 
                                ${isCancelled ? 'bg-red-100 text-red-700' : 
                                  isReturn ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                                {item.itemStatus}
                            </span>
                        </div>
                      </div>
                    </div>

                    {/* Middle Row: Return/Cancel Status Banners */}
                    {isCancelled && (
                        <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-2">
                           <XCircle size={16}/> This item has been Cancelled.
                        </div>
                    )}

                    {isReturn && (
                        <div className={`px-4 py-3 rounded-lg text-sm font-bold flex items-start gap-3 border
                             ${returnStatus === 'Return Requested' ? 'bg-purple-50 border-purple-100 text-purple-700' : 
                               returnStatus === 'Return Approved' ? 'bg-blue-50 border-blue-100 text-blue-700' :
                               returnStatus === 'Return Rejected' ? 'bg-red-50 border-red-100 text-red-700' : 
                               'bg-gray-100 border-gray-200 text-gray-700'
                             }`}>
                             
                             {returnStatus === 'Return Requested' && <Clock size={18} className="mt-0.5"/>}
                             {returnStatus === 'Return Approved' && <CheckCircle size={18} className="mt-0.5"/>}
                             {returnStatus === 'Return Rejected' && <XCircle size={18} className="mt-0.5"/>}
                             {returnStatus === 'Returned' && <RotateCcw size={18} className="mt-0.5"/>}

                             <div>
                                <p className="uppercase text-xs font-extrabold opacity-70 mb-0.5">Return Status: {returnStatus}</p>
                                <p className="font-normal">
                                    {returnStatus === 'Return Requested' && "Your return request has been sent. Waiting for approval."}
                                    {returnStatus === 'Return Approved' && "Your return is approved. Our courier partner will contact you shortly for pickup."}
                                    {returnStatus === 'Return Rejected' && "Sorry, your return request was rejected by the admin."}
                                    {returnStatus === 'Returned' && "Item has been successfully returned and processed."}
                                </p>
                             </div>
                        </div>
                    )}

                    {/* Bottom Row: Stepper */}
                    {!isCancelled && (
                        <div className="relative w-full px-2 sm:px-4 mt-6">
                             <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 rounded-full -translate-y-1/2"></div>
                             
                             <div 
                                 className="absolute top-1/2 left-0 h-1 bg-green-500 rounded-full -translate-y-1/2 transition-all duration-700"
                                 style={{ width: `${(currentIndex / (stepsList.length - 1)) * 100}%` }}
                             ></div>

                             <div className="relative flex justify-between w-full z-10">
                                 {stepsList.map((step, index) => {
                                     const isCompleted = index <= currentIndex;
                                     const isCurrent = index === currentIndex;
                                     
                                     return (
                                         <div key={step} className="flex flex-col items-center group">
                                             <div 
                                                 className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center bg-white transition-colors duration-300 z-10
                                                 ${isCompleted ? 'border-green-500' : 'border-gray-300'}
                                                 ${isCurrent ? 'ring-4 ring-green-100' : ''}
                                                 `}
                                             >
                                                 {isCompleted && <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />}
                                             </div>

                                             <span 
                                                 className={`absolute top-8 text-[10px] sm:text-xs font-medium transition-colors duration-300 w-20 text-center
                                                 ${isCompleted ? 'text-green-600 font-bold' : 'text-gray-400'}`}
                                             >
                                                 {step}
                                             </span>
                                         </div>
                                     );
                                 })}
                             </div>
                             <div className="h-6"></div>
                        </div>
                    )}
                  </div>
                );
              })}
            </div>

            <hr className="border-gray-100 my-8" />

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Payment */}
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Payment</h4>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="capitalize">{order.payment.method}</span>
                  {order.payment.method === 'card' && <CreditCard size={16} className="text-blue-600" />}
                </div>
                <p className={`text-xs mt-1 font-medium ${order.payment.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                    Status: {order.payment.status.toUpperCase()}
                </p>
              </div>

              {/* Delivery */}
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Delivery</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                  <p>{order.shippingAddress.pincode}</p>
                  <p className="mt-2 text-gray-500">Phone: {order.shippingAddress.phone}</p>
                </div>
              </div>

              {/* Summary */}
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Order Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-gray-900">₹{order.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping Fee</span>
                    <span className="font-bold text-green-500">{order.shippingFee === 0 ? 'Free' : `₹${order.shippingFee}`}</span>
                  </div>
                  <hr className="border-gray-100 my-2" />
                  <div className="flex justify-between text-gray-900 text-base font-bold">
                    <span>Total</span>
                    <span>₹{order.totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
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

export default OrderDetails;