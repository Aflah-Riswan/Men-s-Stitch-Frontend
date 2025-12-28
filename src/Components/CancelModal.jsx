
import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

const CancelModal = ({ isOpen, onClose, onSubmit }) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(reason);
    setReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-in fade-in zoom-in duration-200">
        
        {/* Icon Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="text-red-600" size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 text-center">Cancel Order</h3>
          <p className="text-sm text-gray-500 text-center mt-1 px-4">
            Are you sure you want to cancel? This action cannot be undone.
          </p>
        </div>

        {/* Reason Textarea */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason for Cancellation <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Why are you cancelling this order?"
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none resize-none min-h-[100px] text-sm"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Keep Order
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-full text-sm font-bold hover:bg-red-700 transition shadow-lg shadow-red-200"
          >
            Yes, Cancel Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelModal;