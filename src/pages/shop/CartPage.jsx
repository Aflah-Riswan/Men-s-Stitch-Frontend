
import React, { useEffect, useState } from 'react';
import { Trash2, Minus, Plus, Tag, ArrowRight, X } from 'lucide-react';
import * as cartService from '../../services/cartService'
const CartPage = () => {
  // Dummy data based on the image
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Men's full sleeve shirt-black",
      size: "Large",
      price: 559,
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80", // Placeholder
      quantity: 1,
    },
    {
      id: 2,
      name: "Men's full sleeve shirt-black",
      size: "Medium",
      price: 399,
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      quantity: 1,
    },
    {
      id: 3,
      name: "Men's full sleeve shirt-black",
      size: "Large",
      price: 499,
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      quantity: 1,
    },
  ]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const { data } = await cartService.getCartItems()
        console.log(data)
        
      } catch (error) {
        console.log(error)
      }
    }
    fetchCartItems()
  }, [])
  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Container matching standard max-widths */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <a href="#" className="hover:text-gray-900">Home</a>
              <span className="mx-2">&gt;</span>
            </li>
            <li className="flex items-center">
              <span className="text-gray-900 font-medium">Cart</span>
            </li>
          </ol>
        </nav>

        {/* Page Title & Clear Cart Button */}
        <div className="flex justify-between items-end mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your cart</h1>
          {/* Note: In the design, Clear Cart is visually here on desktop */}
        </div>

        {/* Main Grid Layout */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">

          {/* Left Column: Cart Items */}
          <div className="lg:col-span-8">
            {/* Mobile/Desktop Clear Cart Alignment wrapper */}
            <div className="flex justify-end mb-4">
              <button className="text-sm bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors">
                Clear Cart
              </button>
            </div>

            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-center bg-white border border-gray-100 rounded-xl p-4 shadow-sm relative"
                >
                  {/* Delete Icon (Top Right) */}
                  <button className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-1">
                    <Trash2 size={18} />
                  </button>

                  {/* Product Image */}
                  <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="mt-4 sm:mt-0 sm:ml-6 flex-1 w-full text-center sm:text-left">
                    <h3 className="text-base font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">Size: {item.size}</p>

                    <div className="mt-4 flex justify-between items-end sm:items-center">
                      <p className="text-lg font-bold text-gray-900">₹{item.price}</p>

                      {/* Quantity Selector */}
                      <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                        <button className="p-2 hover:bg-gray-100 text-gray-600">
                          <Minus size={14} />
                        </button>
                        <span className="px-4 py-1 text-sm font-medium">{item.quantity}</span>
                        <button className="p-2 hover:bg-gray-100 text-gray-600">
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping Button */}
            <div className="mt-8 flex justify-center sm:justify-start">
              <button className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition shadow-lg">
                continue Shopping
              </button>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4 mt-12 lg:mt-0">
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">₹1457</span>
                </div>
                <div className="flex justify-between text-red-500">
                  <span>Discount (-20%)</span>
                  <span className="font-semibold">-₹291</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Delivery Fee</span>
                  <span className="font-semibold">Free</span>
                </div>

                <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">₹1205</span>
                </div>
              </div>

              {/* Promo Code Input */}
              <div className="mt-6 flex space-x-2">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2.5 bg-gray-100 border-none rounded-full text-sm placeholder-gray-400 focus:ring-1 focus:ring-black"
                    placeholder="Add promo code"
                  />
                </div>
                <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800">
                  Apply
                </button>
              </div>

              {/* Active Coupon Banner */}
              <div className="mt-4 bg-green-600 text-white rounded-md p-3 flex justify-between items-center text-sm shadow-md">
                <span className="font-medium">Coupon CODE : IAMNEW applied!</span>
                <button className="text-white hover:text-green-100">
                  <div className="bg-red-500 rounded-full p-0.5">
                    <X size={12} />
                  </div>
                </button>
              </div>

              {/* Checkout Button */}
              <button className="w-full mt-6 bg-black text-white py-4 rounded-full flex items-center justify-center space-x-2 hover:bg-gray-800 transition shadow-lg group">
                <span className="font-medium">Checkout</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-xs text-gray-400 mt-4 leading-relaxed">
                By continuing, I confirm that I have read and accept the <a href="#" className="underline">Terms and Conditions</a> and the <a href="#" className="underline">Privacy Policy</a>.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default CartPage;