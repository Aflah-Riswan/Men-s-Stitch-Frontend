import React, { useState } from 'react';
import { X, Star } from 'lucide-react';

const ReviewModal = ({ isOpen, onClose, onSubmit, product }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = () => {
    // 1. Validation
    if (rating === 0) {
      // You can add a toast here if you passed toast as a prop, or just ignore
      return;
    }

    // 2. Pass data back to OrderHistory
    onSubmit({ rating, comment });
    
    // 3. Reset
    setRating(0);
    setComment('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Write a Review</h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-1">
              {product?.name || "Product Name"}
            </p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Star Rating */}
        <div className="mb-6 flex flex-col items-center">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110 focus:outline-none"
              >
                <Star
                  size={32}
                  fill={star <= (hoveredRating || rating) ? "currentColor" : "none"}
                  className={`${
                    star <= (hoveredRating || rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  } transition-colors duration-200`}
                />
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2 font-medium">
            {rating === 0 ? 'Select a rating' : ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating - 1]}
          </p>
        </div>

        {/* Comment Textarea */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Experience
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What did you like or dislike?"
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none resize-none min-h-[120px] text-sm"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={rating === 0}
            className="flex-1 px-4 py-3 bg-black text-white rounded-full text-sm font-bold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;