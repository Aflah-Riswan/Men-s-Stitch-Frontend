import React, { useState } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react'; 

const CancelModal = ({ isOpen, onClose, onSubmit, title, type = 'cancel' }) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(reason);
    setReason('');
    onClose();
  };

  // Logic to switch between Cancel (Red) and Return (Orange)
  const isReturn = type === 'return';
  const config = {
    headerColor: isReturn ? 'bg-orange-100' : 'bg-red-100',
    iconColor: isReturn ? 'text-orange-600' : 'text-red-600',
    icon: isReturn ? <RotateCcw size={24} /> : <AlertCircle size={24} />,
    description: isReturn 
      ? "Are you sure you want to return this item? This will initiate a return request."
      : "Are you sure you want to cancel? This action cannot be undone.",
    placeholder: isReturn 
      ? "Why are you returning this item? (e.g., Size issue, Damaged)"
      : "Why are you cancelling this order?",
    confirmBtnColor: isReturn 
      ? "bg-orange-600 hover:bg-orange-700 shadow-orange-200" 
      : "bg-red-600 hover:bg-red-700 shadow-red-200",
    confirmBtnText: isReturn ? "Confirm Return" : "Yes, Cancel Order",
    cancelBtnText: isReturn ? "Keep Item" : "Keep Order"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-in fade-in zoom-in duration-200">
        
        {/* Icon Header */}
        <div className="flex flex-col items-center mb-6">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${config.headerColor} ${config.iconColor}`}>
            {config.icon}
          </div>
          <h3 className="text-xl font-bold text-gray-900 text-center">{title}</h3>
          <p className="text-sm text-gray-500 text-center mt-1 px-4">
            {config.description}
          </p>
        </div>

        {/* Reason Textarea */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={config.placeholder}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:border-black/20 outline-none resize-none min-h-[100px] text-sm"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            {config.cancelBtnText}
          </button>
          <button
            onClick={handleSubmit}
            className={`flex-1 px-4 py-3 text-white rounded-full text-sm font-bold transition shadow-lg ${config.confirmBtnColor}`}
          >
            {config.confirmBtnText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelModal;