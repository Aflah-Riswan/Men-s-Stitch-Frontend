import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, Tag, ArrowRight, X, ChevronDown, ChevronUp } from 'lucide-react';
import * as cartService from '../../services/cartService';
import { toast } from 'react-hot-toast';
import PhoneVerifyModal from '../../Components/PhoneVerifyModal';

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [showCoupons, setShowCoupons] = useState(false);
  const [userDetails, setUserDetails] = useState(null)
  const [showModal, setShowModal] = useState(false)


  const fetchCart = async () => {
    try {
      const response = await cartService.getCartItems();
      const cartData = response.data;
      const { user } = response.data
      setUserDetails(user)
      setCart(cartData);
    } catch (error) {
      console.error("Cart fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCoupons = async () => {
    try {

      const response = await cartService.getCoupons();
      const coupons = response.data.coupons|| [];
       console.log(" coupons : ",coupons)
      setAvailableCoupons(coupons);
    } catch (error) {
      console.log("Could not fetch coupons", error);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchCoupons();
  }, []);


  const handleQuantity = async (itemId, action, currentQty) => {
    if (action === 'decrement' && currentQty === 1) return;

    try {
      const { data } = await cartService.updateQuantity(itemId, action);
      if (data.success) setCart(data.cart);
    } catch (error) {
      toast.error(error.response?.data?.message || "Cannot update quantity");
    }
  };

  const handleRemove = async (itemId) => {
    try {
      const { data } = await cartService.removeFromCart(itemId);
      if (data.success) {
        setCart(data.cart);
        toast.success("Item removed");
      }
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const handleApplyCoupon = async (codeToApply) => {
    const code = codeToApply || couponInput;
    if (!code.trim()) return toast.error("Please enter a coupon code");

    setCouponLoading(true);
    try {
      const { data } = await cartService.applyCoupon(code);
      if (data.success) {
        setCart(data.cart);
        toast.success("Coupon Applied!");
        setCouponInput("");
        setShowCoupons(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid Coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = async () => {
    setCouponLoading(true);
    try {
      const { data } = await cartService.removeCoupon();
      if (data.success) {
        setCart(data.cart);
        toast.success("Coupon Removed");
      }
    } catch (error) {
      toast.error("Failed to remove coupon");
    } finally {
      setCouponLoading(false);
    }
  };
  const handleCheckout = () => {
    try {
      console.log(" user phone : ", userDetails.phone)
      if (!userDetails.phone) {
        setShowModal(true)
        return
      }


      navigate('/checkout')
    } catch (error) {
      console.log(error)
    }
  }
  const onPhoneVerified = (updatedUser) => {
    console.log("updatedUser : ",updatedUser)
    setUserDetails(prev => ({
      ...prev,
      phone: updatedUser.phone,
      isPhoneVerified: true
    }));
    setShowModal(false);
    toast.success("Verification successful! You can now checkout.");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading cart...</div>;

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <button onClick={() => navigate('/')} className="bg-black text-white px-6 py-2 rounded-full">Start Shopping</button>
      </div>
    )
  }

  const hasUnavailableItems = cart.items.some(item => item.isUnavailable);

  return (
    <div className="bg-white min-h-screen font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <button onClick={() => navigate('/')} className="hover:text-gray-900">Home</button>
              <span className="mx-2">&gt;</span>
            </li>
            <li className="flex items-center"><span className="text-gray-900 font-medium">Cart</span></li>
          </ol>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your cart</h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          <PhoneVerifyModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onSuccess={onPhoneVerified}
          />
          {/* LEFT: Items List */}
          <div className="lg:col-span-8 space-y-6">
            {cart.items.map((item) => (
              <div key={item._id} className={`flex flex-col sm:flex-row items-center bg-white border rounded-xl p-4 shadow-sm relative ${item.isUnavailable ? 'border-red-300 bg-red-50' : 'border-gray-100'}`}>

                <button onClick={() => handleRemove(item._id)} className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-1">
                  <Trash2 size={18} />
                </button>

                <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden relative">
                  <img
                    src={item.image}
                    alt="Product"
                    className={`w-full h-full object-cover ${item.isUnavailable ? 'opacity-50' : ''}`}

                  />
                  {item.isUnavailable && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                      <span className="text-xs font-bold bg-red-600 text-white px-2 py-1 rounded">{item.statusMessage || "Unavailable"}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 sm:mt-0 sm:ml-6 flex-1 w-full text-center sm:text-left">
                  <h3 className={`text-base font-semibold ${item.isUnavailable ? 'text-gray-500' : 'text-gray-900'}`}>
                    {item.productId?.productName || "Product No Longer Available"}
                  </h3>
                  <div className="text-sm text-gray-500 mt-1 flex flex-col gap-1">
                    <p>Size: {item.size}</p>
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      Color: <span className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: item.colorCode }}></span>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-end sm:items-center">
                    <p className="text-lg font-bold text-gray-900">₹{new Intl.NumberFormat('en-IN').format(item.price)}</p>
                    {!item.isUnavailable && (
                      <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                        <button onClick={() => handleQuantity(item._id, 'decrement', item.quantity)} className="p-2 hover:bg-gray-100 text-gray-600 disabled:opacity-30" disabled={item.quantity <= 1}><Minus size={14} /></button>
                        <span className="px-4 py-1 text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => handleQuantity(item._id, 'increment', item.quantity)} className="p-2 hover:bg-gray-100 text-gray-600"><Plus size={14} /></button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-4 mt-12 lg:mt-0">
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{cart.subTotal}</span>
                </div>

                {cart.discount > 0 && (
                  <div className="flex justify-between text-red-500">
                    <span>Discount</span>
                    <span className="font-semibold">-₹{cart.discount}</span>
                  </div>
                )}

                <div className="flex justify-between text-green-600">
                  <span>Delivery Fee</span>
                  <span className="font-semibold">{cart.shippingFee === 0 ? "Free" : `₹${cart.shippingFee}`}</span>
                </div>

                <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">₹{cart.grandTotal}</span>
                </div>
              </div>

              {/* COUPON SECTION */}
              <div className="mt-6">
                {!cart.couponCode ? (
                  <div className="space-y-3">
                    {/* Input */}
                    <div className="flex space-x-2">
                      <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Tag size={16} className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2.5 bg-gray-100 border-none rounded-full text-sm placeholder-gray-400 focus:ring-1 focus:ring-black outline-none"
                          placeholder="Add promo code"
                        />
                      </div>
                      <button
                        onClick={() => handleApplyCoupon()}
                        disabled={couponLoading}
                        className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
                      >
                        {couponLoading ? "..." : "Apply"}
                      </button>
                    </div>

                    {/* Available Coupons Accordion */}
                    {availableCoupons.length > 0 && (
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => setShowCoupons(!showCoupons)}
                          className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                        >
                          <span>Available Coupons ({availableCoupons.length})</span>
                          {showCoupons ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>

                        {showCoupons && (
                          <div className="bg-white max-h-48 overflow-y-auto divide-y divide-gray-100">
                            {availableCoupons.map((coupon) => (
                              <div key={coupon._id} className="p-3 hover:bg-gray-50 transition flex justify-between items-center">
                                <div>
                                  <p className="font-bold text-xs text-black border border-dashed border-gray-300 px-2 py-0.5 rounded inline-block mb-1">
                                    {coupon.couponCode}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {coupon.discountType === 'percentage'
                                      ? `${coupon.discountValue}% Off`
                                      : `₹${coupon.discountValue} Flat Off`
                                    }
                                  </p>
                                </div>
                                <button
                                  onClick={() => handleApplyCoupon(coupon.couponCode)}
                                  className="text-xs text-blue-600 font-semibold hover:underline"
                                >
                                  Apply
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Applied State */
                  <div className="bg-green-100 border border-green-200 text-green-800 rounded-md p-3 flex justify-between items-center text-sm">
                    <span className="font-medium flex items-center gap-2">
                      <Tag size={14} /> Coupon <strong>{cart.couponCode}</strong> applied!
                    </span>
                    <button
                      onClick={handleRemoveCoupon}
                      disabled={couponLoading}
                      className="text-red-500 hover:text-red-700 bg-white rounded-full p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => handleCheckout()}
                disabled={hasUnavailableItems}
                className={`w-full mt-6 text-white py-4 rounded-full flex items-center justify-center space-x-2 transition shadow-lg group
                    ${hasUnavailableItems ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'}
                `}
              >
                <span className="font-medium">{hasUnavailableItems ? "Review Cart Issues" : "Checkout"}</span>
                {!hasUnavailableItems && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
              </button>

              <p className="text-xs text-gray-400 mt-4 leading-relaxed">
                By continuing, I confirm that I have read and accept the Terms and Conditions.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CartPage;