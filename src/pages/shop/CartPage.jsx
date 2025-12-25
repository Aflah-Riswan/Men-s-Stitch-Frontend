import React, { useEffect, useState } from 'react';
import { Trash2, Minus, Plus, Tag, ArrowRight, X } from 'lucide-react';
import * as cartService from '../../services/cartService' // Adjust path as needed

const CartPage = () => {
  // 1. Change state to hold the FULL cart object, not just items
  const [cart, setCart] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const { data } = await cartService.getCartItems();
        console.log("Cart Data:", data);
        setCart(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchCartItems();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading cart...</div>;

  // 2. Handle empty cart scenario gracefully
  if (!cart || !cart.items || cart.items.length === 0) {
     return (
        <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
             <h2 className="text-2xl font-bold">Your cart is empty</h2>
             <a href="/" className="bg-black text-white px-6 py-2 rounded-full">Start Shopping</a>
        </div>
     )
  }

  return (
    <div className="bg-white min-h-screen font-sans">
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

        {/* Page Title */}
        <div className="flex justify-between items-end mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your cart</h1>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12">

          {/* Left Column: Cart Items */}
          <div className="lg:col-span-8">
            <div className="flex justify-end mb-4">
              <button className="text-sm bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors">
                Clear Cart
              </button>
            </div>

            <div className="space-y-6">
              {/* 3. Map through cart.items */}
              {cart.items.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row items-center bg-white border border-gray-100 rounded-xl p-4 shadow-sm relative"
                >
                  <button className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-1">
                    <Trash2 size={18} />
                  </button>

                  {/* Product Image */}
                  <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                    <img
                      src={item.image} 
                      alt={item.productId?.productName || "Product"}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="mt-4 sm:mt-0 sm:ml-6 flex-1 w-full text-center sm:text-left">
                    <h3 className="text-base font-semibold text-gray-900">
                      {item.productId?.productName}
                    </h3>
                    <div className="text-sm text-gray-500 mt-1 space-y-1">
                        <p>Size: {item.size}</p>
                        {/* Optional: Show color code if needed */}
                        <div className="flex items-center justify-center sm:justify-start gap-2">
                           Color: 
                           <span 
                             className="w-4 h-4 rounded-full border border-gray-300" 
                             style={{backgroundColor: item.colorCode}}>
                           </span>
                        </div>
                    </div>

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

            <div className="mt-8 flex justify-center sm:justify-start">
              <button className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition shadow-lg">
                Continue Shopping
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
                  {/* 4. Dynamic Subtotal */}
                  <span className="font-semibold text-gray-900">₹{cart.subTotal}</span>
                </div>
                
                {/* 5. Conditional Rendering for Discount */}
                {cart.discount > 0 && (
                  <div className="flex justify-between text-red-500">
                    <span>Discount</span>
                    <span className="font-semibold">-₹{cart.discount}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-green-600">
                  <span>Delivery Fee</span>
                  {/* 6. Handle Free Shipping vs Paid */}
                  <span className="font-semibold">
                    {cart.shippingFee === 0 ? "Free" : `₹${cart.shippingFee}`}
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  {/* 7. Dynamic Grand Total */}
                  <span className="text-xl font-bold text-gray-900">₹{cart.grandTotal}</span>
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

              {/* 8. Active Coupon Banner - Show only if couponCode exists */}
              {cart.couponCode && (
                <div className="mt-4 bg-green-600 text-white rounded-md p-3 flex justify-between items-center text-sm shadow-md">
                  <span className="font-medium">Coupon CODE : {cart.couponCode} applied!</span>
                  <button className="text-white hover:text-green-100">
                    <div className="bg-red-500 rounded-full p-0.5">
                      <X size={12} />
                    </div>
                  </button>
                </div>
              )}

              <button className="w-full mt-6 bg-black text-white py-4 rounded-full flex items-center justify-center space-x-2 hover:bg-gray-800 transition shadow-lg group">
                <span className="font-medium">Checkout</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-xs text-gray-400 mt-4 leading-relaxed">
                By continuing, I confirm that I have read and accept the <a href="#" className="underline">Terms and Conditions</a>.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default CartPage;