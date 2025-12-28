
import React from 'react';
import { Download, Check, CreditCard } from 'lucide-react';

// Import your existing components
import UserSidebar from './UserSidebar'; 
import Footer from './Footer';
import NewsLetter from './NewsLetter';

const OrderDetails = () => {
  // Dummy data based on the screenshot
  const orderData = {
    orderId: "3354654654526",
    orderDate: "Feb 16, 2022",
    estimatedDelivery: "May 16, 2022",
    statusSteps: [
      { label: "Order Confirmed", date: "Wed, 11th Jan", completed: true },
      { label: "Shipped", date: "Wed, 11th Jan", completed: true },
      { label: "Out For Delivery", date: "Wed, 11th Jan", completed: true },
      { label: "Delivered", date: "Expected by, Mon 16th", completed: false }, // Current/Next step
    ],
    product: {
      name: "Men's formal trousers -relaxed fit",
      itemId: "565333-33211",
      price: 399,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80", // Placeholder
    },
    payment: {
      method: "Visa **56",
      icon: <CreditCard size={16} className="text-blue-600" />,
    },
    deliveryAddress: {
      line1: "847 Jewess Bridge Apt.",
      line2: "174 London, UK",
      line3: "474-769-3919",
    },
    summary: {
      subtotal: 399,
      discount: 60,
      deliveryFee: "Free",
      total: 319,
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      
      {/* Main Layout: Sidebar (Left) + Content (Right) */}
      <div className="flex-1 flex flex-col md:flex-row w-full max-w-7xl mx-auto">
        
        {/* Sidebar Component */}
        <UserSidebar activeTab="My orders" />

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 p-4 sm:p-8">
          
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Order Details</h1>

          {/* Details Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
            
            {/* Header: ID & Invoice */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Order ID: {orderData.orderId}</h2>
                <div className="flex flex-wrap gap-4 text-sm mt-2 text-gray-500">
                  <span>Order date: <span className="text-gray-900 font-medium">{orderData.orderDate}</span></span>
                  <span className="flex items-center text-green-600 font-medium">
                    <span className="mr-1">🚚</span> Estimated delivery: {orderData.estimatedDelivery}
                  </span>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                <Download size={16} />
                Invoice
              </button>
            </div>

            <hr className="border-gray-100 mb-8" />

            {/* Progress Tracker (Stepper) */}
            <div className="relative mb-12 px-4">
              {/* Progress Bar Background */}
              <div className="absolute top-3 left-4 right-4 h-1 bg-gray-200 -z-10 rounded-full"></div>
              
              {/* Active Progress Bar (Calculated width roughly based on completed steps) */}
              <div 
                className="absolute top-3 left-4 h-1 bg-green-500 -z-10 rounded-full transition-all duration-500" 
                style={{ width: '66%' }} // Adjust based on logic (3/4 steps = ~75%, visualized as 66% between dots)
              ></div>

              <div className="flex justify-between w-full">
                {orderData.statusSteps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center">
                    {/* Circle */}
                    <div 
                      className={`w-7 h-7 rounded-full flex items-center justify-center border-2 bg-white z-10 
                        ${step.completed ? 'border-green-500 text-green-500' : 'border-gray-300 text-gray-300'}`}
                    >
                      {step.completed ? (
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                      ) : (
                        <div className="w-3 h-3 bg-gray-300 rounded-full" />
                      )}
                    </div>
                    
                    {/* Text Labels */}
                    <div className="text-center mt-3">
                      <p className={`text-sm font-bold ${step.completed ? 'text-green-500' : 'text-gray-400'}`}>
                        {step.label}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-gray-100 mb-8" />

            {/* Product Item */}
            <div className="flex flex-col sm:flex-row gap-6 mb-8">
              <div className="w-24 h-28 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={orderData.product.image} 
                  alt={orderData.product.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-gray-900">{orderData.product.name}</h3>
                <p className="text-sm text-gray-500 mt-1">Order Id : {orderData.product.itemId}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-lg font-bold text-gray-900">₹{orderData.product.price}</p>
                <p className="text-sm text-gray-500">Qty: {orderData.product.quantity}</p>
              </div>
            </div>

            <hr className="border-gray-100 mb-8" />

            {/* Info Grid: Payment, Delivery, Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Payment */}
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Payment</h4>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">Visa **56</span>
                  {orderData.payment.icon}
                </div>
              </div>

              {/* Delivery */}
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Delivery</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-medium text-gray-400">Address</p>
                  <p>{orderData.deliveryAddress.line1}</p>
                  <p>{orderData.deliveryAddress.line2}</p>
                  <p>{orderData.deliveryAddress.line3}</p>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Order Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-gray-900">₹{orderData.summary.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Discount (-20%)</span>
                    <span className="font-bold text-red-500">-₹{orderData.summary.discount}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="font-bold text-green-500">{orderData.summary.deliveryFee}</span>
                  </div>
                  <hr className="border-gray-100 my-2" />
                  <div className="flex justify-between text-gray-900 text-base font-bold">
                    <span>Total</span>
                    <span>₹{orderData.summary.total}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Footer Section */}
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