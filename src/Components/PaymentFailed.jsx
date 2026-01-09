import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RefreshCw, ArrowLeft, Home } from 'lucide-react';

const PaymentFailed = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Retrieve the data passed from the Payment page so we can "Try Again"
  const { retryData } = location.state || {};

  const handleTryAgain = () => {
    if (retryData) {
      // Navigate back to Payment page with the preserved state
      navigate('/payment', { 
        state: { 
          addressId: retryData.addressId, 
          paymentSummary: retryData.paymentSummary 
        },
        replace: true 
      });
    } else {
      // Fallback if data is lost (e.g. page refresh)
      navigate('/checkout');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 text-center border border-gray-100 relative overflow-hidden">
        
        {/* Background Decorative Circles */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-red-50 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        
        {/* --- Custom Failed Illustration --- */}
        <div className="relative z-10 flex justify-center mb-8">
          <div className="relative w-32 h-32 bg-red-50 rounded-full flex items-center justify-center">
            {/* Outer Ring Animation */}
            <div className="absolute inset-0 rounded-full border-4 border-red-100 animate-ping opacity-25"></div>
            
            {/* Main Icon */}
            <svg 
              viewBox="0 0 24 24" 
              className="w-16 h-16 text-red-500"
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" className="opacity-25" />
              <path d="m15 9-6 6" />
              <path d="m9 9 6 6" />
            </svg>

            {/* Floating Elements for effect */}
            <div className="absolute top-2 right-4 w-3 h-3 bg-red-400 rounded-full opacity-50 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="absolute bottom-4 left-2 w-2 h-2 bg-orange-400 rounded-full opacity-50 animate-bounce" style={{ animationDelay: '0.3s' }}></div>
          </div>
        </div>

        {/* Text Content */}
        <div className="relative z-10 space-y-3 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Payment Failed</h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
            Oops! It seems the transaction was declined or interrupted. Don't worry, no money was deducted.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 space-y-3">
          <button 
            onClick={handleTryAgain}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all transform hover:-translate-y-0.5 shadow-lg shadow-red-200 flex items-center justify-center gap-2 group"
          >
            <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
            Try Payment Again
          </button>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button 
              onClick={() => navigate('/checkout')}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={16} /> Checkout
            </button>
            <button 
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Home size={16} /> Home
            </button>
          </div>
        </div>

        {/* Error Code Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100">
           <p className="text-[10px] text-gray-400 uppercase tracking-wider">
             Error Code: PAY_ERR_502
           </p>
        </div>

      </div>
    </div>
  );
};

export default PaymentFailed;