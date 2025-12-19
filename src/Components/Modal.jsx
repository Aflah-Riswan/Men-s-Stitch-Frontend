

import React from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react'; // Icons

const Modal = ({ isOpen, title, message, onConfirm, onCancel = () => { }, type = 'success' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-100 text-center">

        {/* Icon (Matches Type) */}
        <div className={`mx-auto flex items-center justify-center w-20 h-20 rounded-full mb-6 ${type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
          }`}>
          {type === 'success' ? <CheckCircle size={48} /> : <AlertTriangle size={48} />}
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 mb-8 text-lg">{message}</p>

        {/* Buttons Group */}
        <div className="flex gap-3">
          {/* Only show Cancel button if it's a danger/confirm type */}
          {type === 'danger' && (
            <button
              onClick={onCancel}
              className="flex-1 py-3.5 rounded-xl text-gray-700 font-semibold text-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          )}

          <button
            onClick={onConfirm}
            className={`flex-1 py-3.5 rounded-xl text-white font-semibold text-lg shadow-lg transition-transform active:scale-95 ${type === 'success'
                ? 'bg-black hover:bg-gray-900'
                : 'bg-red-600 hover:bg-red-700'
              }`}
          >
            {type === 'success' ? 'OK, Continue' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;