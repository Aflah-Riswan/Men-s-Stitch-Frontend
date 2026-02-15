import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight, CreditCard, Banknote, ShieldCheck, Lock, Zap, CheckCircle2, Smartphone, Wallet, AlertCircle } from 'lucide-react';
import * as orderService from '../../services/orderService';
import * as paymentService from '../../services/paymentService'
import { toast } from 'react-hot-toast';

import NewsLetter from '../../Components/NewsLetter';
import Footer from '../../Components/Footer';
import axiosInstance from '../../utils/axiosInstance';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addressId, paymentSummary, autoRetry, failedOrderId } = location.state || {};
  const hasRetried = useRef(false)
  const [selectedMethod, setSelectedMethod] = useState('razorpay');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!addressId) {
      navigate('/checkout');
    }
  }, [addressId, navigate]);

  useEffect(() => {
    if (autoRetry && addressId && paymentSummary && !hasRetried.current) {
      hasRetried.current = true;
      handleRazorPayment();
    }
  }, [autoRetry, addressId, paymentSummary]);

  const loadRazorPayScript = () => {
    console.log(" inside loaderRazorPay SCRIPTS")
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const saveFailedOrder = async (razorpayOrderId) => {
    try {
      const orderData = {
        addressId,
        paymentMethod: 'razorpay',
        razorpayOrderId,
        paymentStatus: 'failed',
        grandTotal: paymentSummary?.grandTotal
      }
      const response = await orderService.placeOrder(orderData)
      if (response.data?.success) {
        return response.data.orderId
      }
    } catch (error) {
      console.log("error found :", error)
    }
  }

  const handleRazorPayment = async () => {
    try {
      const isScripted = await loadRazorPayScript();
      if (!isScripted) return toast.error('failed to load razorpay SDK');

      const orderData = await paymentService.createPayment(paymentSummary?.grandTotal);

      const retryState = {
        addressId,
        paymentSummary
      };

      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Men's Stitch",
        description: 'Order Payment',
        order_id: orderData.id,

        // 1. SUCCESS HANDLER
        handler: async function (response) {
          try {
            const paymentData = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              shippingAddress: addressId,
              paymentMethod: selectedMethod
            };
            const verifyRes = await paymentService.createOnlinePayment(paymentData);

            if (verifyRes?.data?.success || verifyRes?.success) {
              const newOrderId = verifyRes?.order.orderId;
              if (failedOrderId) {
                try {
                  await orderService.deleteOrder(failedOrderId);
                  console.log("Old failed order removed:", failedOrderId);
                } catch (err) {
                  console.error("Failed to remove old order", err);
                }
              }
              toast.success("Payment Verified!");
              navigate('/order-success', { state: { orderId: newOrderId , data : verifyRes } });
            } else {
              toast.error("Payment verification failed on server");

              const failedOrderId = await saveFailedOrder(orderData.id, "Verification Failed");
              navigate('/payment-failed', {
                state: { retryData: retryState, orderId: failedOrderId }
              });
            }
          } catch (error) {
            console.log(error);
            navigate('/payment-failed', { state: { retryData: retryState } });
          }
        },

        modal: {
          ondismiss: async function () {
            toast.error("Payment Cancelled");
            const failedOrderId = await saveFailedOrder(orderData.id);
            navigate('/payment-failed', {
              state: { retryData: retryState }
            });
          }
        },
        theme: { color: "#000000" }
      };

      const paymentObject = new window.Razorpay(options);

      paymentObject.on('payment.failed', async function (response) {

        console.error("Payment Failed:", response.error);
        toast.error(response.error.description || "Payment Failed");
        const failedOrderId = await saveFailedOrder(orderData.id)
        navigate('/payment-failed', {
          state: { retryData: retryState }
        });
      });

      paymentObject.open();

    } catch (error) {
      console.log(error);
      toast.error("Something went wrong initializing payment");
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);

    try {
      if (selectedMethod === 'razorpay') {
        console.log(" insdide if condittion")
        await handleRazorPayment()

      } else if (selectedMethod === 'cod' || selectedMethod === 'wallet') {
        const orderData = {
          addressId, paymentMethod: selectedMethod
        }
        const response = await orderService.placeOrder(orderData)
        if (response.data.success) {
          navigate('/order-success', { state: { orderId: response.data.orderId } })
        }
      }

    } catch (error) {
      console.log(" error : ", error)
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };




  const LogoBadge = ({ text, colorClass }) => (
    <div className={`px-2 py-1 rounded-md text-[10px] font-extrabold tracking-wider border shadow-sm ${colorClass}`}>
      {text}
    </div>
  );

  const PaymentOption = ({ id, icon: Icon, title, description, themeColor, disabled = true, children }) => {
    if (disabled === false) {
      return (
        <div className="flex items-start gap-2 bg-red-50 border border-red-100 p-3 rounded-lg">
          <AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={16} />
          <p className="text-xs text-red-600 font-medium leading-snug">
            "Cash on Delivery is unavailable for orders above ₹1,000. Please use online payment."
          </p>
        </div>
      )
    }
    const isSelected = selectedMethod === id;
    const baseBorder = isSelected ? `border-${themeColor}-600` : 'border-gray-200';
    const bgEffect = isSelected ? `bg-${themeColor}-50` : 'bg-white hover:bg-gray-50';
    return (
      <div
        onClick={() => setSelectedMethod(id)}
        className={`relative flex items-start p-5 rounded-xl border-2 transition-all duration-300 cursor-pointer group ${baseBorder} ${bgEffect} ${isSelected ? 'shadow-md' : 'shadow-sm'}`}
        style={{ borderColor: isSelected ? 'var(--theme-color)' : '' }}
      >

        <div className="mt-1 mr-5 flex-shrink-0">
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-black' : 'border-gray-300'}`}>
            {isSelected && <div className="w-3 h-3 bg-black rounded-full" />}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className={`font-bold text-lg ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
              {title}
            </h3>

          </div>

          <p className="text-sm text-gray-500 font-medium leading-relaxed mb-4 max-w-md">
            {description}
          </p>

          {children}
        </div>


      </div>
    );
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen font-sans text-gray-900 flex flex-col">

      {/* --- Header / Breadcrumbs --- */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-gray-400">
            <span className="hover:text-black cursor-pointer transition-colors" onClick={() => navigate('/cart')}>CART</span>
            <div className="h-px w-4 bg-gray-300"></div>
            <span className="hover:text-black cursor-pointer transition-colors" onClick={() => navigate('/checkout')}>ADDRESS</span>
            <div className="h-px w-4 bg-gray-300"></div>
            <div className="flex items-center gap-2 text-black bg-gray-100 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              PAYMENT
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-3 py-1 rounded border border-green-100">
            <Lock size={12} />
            Secure Checkout
          </div>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* LEFT: Payment Methods */}
          <div className="lg:col-span-8 space-y-6">

            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Choose Payment Mode</h1>
              <p className="text-gray-500 text-sm mt-1">Transactions are encrypted and secured.</p>
            </div>

            <div className="space-y-5">

              {/* Option 1: Razorpay (Vibrant & Recommended) */}
              <PaymentOption
                id="razorpay"
                icon={ShieldCheck}
                themeColor="indigo"
                title="Pay Online"
                description="Accepts all major Cards, UPI Apps (GPay, PhonePe), and Net Banking."
                recommended={true}
              >
                <div className="flex flex-wrap gap-2">
                  <LogoBadge text="UPI" colorClass="bg-white border-gray-200 text-gray-700" />
                  <LogoBadge text="GPay" colorClass="bg-white border-blue-200 text-blue-600" />
                  <LogoBadge text="VISA" colorClass="bg-blue-900 border-blue-900 text-white italic" />
                  <LogoBadge text="RuPay" colorClass="bg-orange-500 border-orange-500 text-white" />
                  <LogoBadge text="HDFC" colorClass="bg-blue-100 border-blue-200 text-blue-800" />
                </div>
              </PaymentOption>

              {/* Option 2: COD (Green Theme) */}
              <PaymentOption
                id="cod"
                icon={Banknote}
                themeColor="emerald"
                title="Cash on Delivery"
                disabled={paymentSummary?.grandTotal <= 1000}
                description="Pay in cash or via QR code at your doorstep."
              >
                <div className="flex items-center gap-2 mt-2 text-xs text-emerald-700 font-medium bg-emerald-50 w-fit px-2 py-1 rounded">
                  <CheckCircle2 size={12} /> Pay upon delivery
                </div>
              </PaymentOption>

              {/* Option 3: Manual Card (Gray/Neutral Theme) */}
              <PaymentOption
                id="wallet"
                icon={Wallet}
                themeColor="orange"
                title="Wallet Payment"
                description="Pay using Paytm, Amazon Pay, or your Men's Stitch Wallet balance."
              >
                <div className="flex flex-wrap gap-2 mt-1">

                  <LogoBadge text="Paytm" colorClass="bg-blue-50 border-blue-100 text-blue-600" />
                  <LogoBadge text="Amazon Pay" colorClass="bg-yellow-50 border-yellow-200 text-yellow-700" />
                  <LogoBadge text="PhonePe" colorClass="bg-purple-50 border-purple-100 text-purple-600" />
                  <LogoBadge text="Store Wallet" colorClass="bg-gray-50 border-gray-200 text-gray-600" />
                </div>
              </PaymentOption>
            </div>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 sticky top-24">
              <h2 className="font-bold text-lg mb-6 flex items-center justify-between">
                <span>Order Summary</span>
              </h2>

              {/* Receipt Style Details */}
              <div className="space-y-4 text-sm font-medium text-gray-600 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-gray-900">₹{paymentSummary?.subTotal || 0}</span>
                </div>
                {paymentSummary?.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount Applied</span>
                    <span>- ₹{paymentSummary.discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery</span>
                  {Number(paymentSummary?.shippingFee) === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    <span className="text-gray-900">₹{paymentSummary?.shippingFee}</span>
                  )}
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-end mb-8 px-2">
                <div>
                  <span className="text-sm text-gray-500 block mb-1">Total Payable</span>
                  <span className="text-3xl font-extrabold text-gray-900">₹{paymentSummary?.grandTotal || 0}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-black text-white py-4 rounded-xl font-bold text-sm tracking-wide hover:bg-gray-800 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                {loading ? (
                  <span>Processing Payment...</span>
                ) : (
                  <>
                    <span>PAY SECURELY</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div className="mt-6 flex justify-center gap-4 opacity-40 grayscale">
                <CreditCard size={24} />
                <ShieldCheck size={24} />
                <Smartphone size={24} />
              </div>
              <p className="text-[10px] text-center text-gray-400 mt-2">Verified by Razorpay</p>

            </div>
          </div>

        </div>
      </div>

      {/* Footer Section */}
      <div className="mt-auto border-t border-gray-200 bg-white pt-10 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <NewsLetter />
          <Footer />
        </div>
      </div>

    </div>
  );
};

export default Payment;