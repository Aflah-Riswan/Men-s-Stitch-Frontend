

import React from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react'; // Icons

const Modal = ({ isOpen, title, message, onConfirm, type = 'success' }) => {
  if (!isOpen) return null;

  return (
    // 1. The Overlay (Dark Background)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
      
      {/* 2. The Modal Box (Large & Centered) */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all scale-100 border border-gray-100 text-center">
        
        {/* Icon */}
        <div className={`mx-auto flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
            type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
        }`}>
          {type === 'success' ? <CheckCircle size={48} /> : <AlertTriangle size={48} />}
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="text-gray-500 mb-8 text-lg">
          {message}
        </p>

        {/* OK Button */}
        <button
          onClick={onConfirm}
          className={`w-full py-3.5 rounded-xl text-white font-semibold text-lg shadow-lg transition-transform active:scale-95 ${
             type === 'success' 
               ? 'bg-black hover:bg-gray-900 shadow-gray-200' 
               : 'bg-red-600 hover:bg-red-700 shadow-red-200'
          }`}
        >
          OK, Continue
        </button>

      </div>
    </div>
  );
};

export default Modal;