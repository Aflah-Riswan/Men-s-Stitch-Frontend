
import React from 'react';
import { Calendar, CreditCard, User, Mail, Phone, MapPin, Package, Truck, CheckCircle, ChevronLeft } from 'lucide-react'; 
// Note: If you don't have lucide-react, you can use any icon set.

const OrderDetails = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans text-gray-800">
      
      {/* Page Title */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-700">Order Management</h2>
        <h1 className="text-2xl font-bold mt-2 text-teal-800">Order Details</h1>
      </div>

      {/* Top Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        
        {/* Card 1: Order Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-gray-800">Order #302011</h3>
            <span className="px-3 py-1 text-xs font-medium text-orange-700 bg-orange-100 rounded-full">
              Processing
            </span>
          </div>
          <div className="space-y-4">
            <div className="flex items-center text-sm">
              <div className="p-2 bg-gray-100 rounded-full mr-3 text-gray-500">
                <Calendar size={16} />
              </div>
              <div>
                <p className="text-gray-500 text-xs">Added</p>
                <p className="font-medium">12 Dec 2022</p>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <div className="p-2 bg-gray-100 rounded-full mr-3 text-gray-500">
                <CreditCard size={16} />
              </div>
              <div>
                <p className="text-gray-500 text-xs">Payment Method</p>
                <p className="font-medium">Visa</p>
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
                <span className="text-gray-500 text-xs">Customer</span>
                <span className="font-medium">Josh Adam</span>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <div className="p-2 bg-gray-100 rounded-full mr-3 text-gray-500">
                <Mail size={16} />
              </div>
              <div className="flex-1 flex justify-between">
                <span className="text-gray-500 text-xs">Email</span>
                <span className="font-medium">josh_adam@mail.com</span>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <div className="p-2 bg-gray-100 rounded-full mr-3 text-gray-500">
                <Phone size={16} />
              </div>
              <div className="flex-1 flex justify-between">
                <span className="text-gray-500 text-xs">Phone</span>
                <span className="font-medium">909 427 2910</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Address */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Address</h3>
          <div className="flex items-start text-sm">
            <div className="p-2 bg-gray-100 rounded-full mr-3 text-gray-500 mt-1">
              <MapPin size={16} />
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">deliver to</p>
              <p className="font-medium leading-relaxed">
                1833 Bel Meadow Drive, Fontana,<br />
                California 92335, USA
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid (Products + Summary vs Status) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Product Item */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden border border-gray-200">
              {/* Placeholder for Argentina Jersey Image */}
              <img src="/api/placeholder/100/100" alt="Product" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 w-full">
              <h4 className="font-bold text-lg text-gray-900">Men's Full sleeve Shirt</h4>
              <p className="text-sm text-gray-500 mb-4">Size: <span className="text-gray-700 font-medium">Large</span></p>
              <h3 className="text-xl font-bold text-gray-900">₹559</h3>
            </div>
            <div className="mt-2 sm:mt-0">
               <span className="px-4 py-2 bg-gray-100 rounded-lg font-medium text-sm text-gray-700">Qty: 1</span>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg mb-6 text-gray-800">Order Summary</h3>
            <div className="space-y-4 border-b border-gray-100 pb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">₹559</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Discount (-20%)</span>
                <span className="font-bold text-red-500">-₹111</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span className="font-bold text-gray-900">₹0</span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-6 text-lg">
              <span className="text-gray-600">Total</span>
              <span className="font-bold text-xl text-gray-900">₹447</span>
            </div>
          </div>
        </div>

        {/* Right Column (Span 1) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Order Status Timeline */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
            <h3 className="font-bold text-lg mb-6 text-gray-800">Order Status</h3>
            <div className="relative pl-4 border-l-2 border-dashed border-gray-200 space-y-8">
              
              {/* Step 1: Placed */}
              <div className="relative pl-6">
                <div className="absolute -left-[21px] top-0 bg-blue-100 p-1 rounded-full text-blue-600 border-2 border-white">
                    <Package size={16} />
                </div>
                <h4 className="font-bold text-sm text-gray-900">Order Placed</h4>
                <p className="text-xs text-gray-500 mt-1">An order has been placed.</p>
                <p className="text-xs text-gray-400 mt-1">12/12/2022, 03:00</p>
              </div>

              {/* Step 2: Processing (Active) */}
              <div className="relative pl-6">
                <div className="absolute -left-[21px] top-0 bg-blue-100 p-1 rounded-full text-blue-600 border-2 border-white animate-pulse">
                    <div className="w-4 h-4 flex items-center justify-center">
                        <span className="block w-2 h-2 bg-blue-600 rounded-full"></span>
                    </div>
                </div>
                <h4 className="font-bold text-sm text-gray-900">Processing</h4>
                <p className="text-xs text-gray-500 mt-1">Seller has processed your order.</p>
              </div>

              {/* Step 3: Out for Delivery (Pending) */}
              <div className="relative pl-6 opacity-50">
                 <div className="absolute -left-[21px] top-0 bg-gray-100 p-1 rounded-full text-gray-500 border-2 border-white">
                    <Truck size={16} />
                </div>
                <h4 className="font-bold text-sm text-gray-900">Out for Delivery</h4>
              </div>

               {/* Step 4: Delivered (Pending) */}
               <div className="relative pl-6 opacity-50">
                 <div className="absolute -left-[21px] top-0 bg-gray-100 p-1 rounded-full text-gray-500 border-2 border-white">
                    <CheckCircle size={16} />
                </div>
                <h4 className="font-bold text-sm text-gray-900">Delivered</h4>
                <p className="text-xs text-gray-400 mt-1">DD/MM/YY, 00:00</p>
              </div>

            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
             <button className="flex-1 bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-medium transition-colors">
                Go Back
             </button>
             <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors">
                Cancel Order
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderDetails;