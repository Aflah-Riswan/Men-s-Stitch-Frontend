
import React from 'react';
import { Star, CheckCircle2, ChevronDown } from 'lucide-react';

export default function ProductReviews({ reviews }) {

  
  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="w-full bg-white font-sans py-8">
      <div className="container mx-auto px-4 md:px-6">

        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <h2 className="text-2xl font-bold text-black flex items-center">
            All Reviews
            <span className="text-gray-400 text-lg font-normal ml-2">(81)</span>
          </h2>

          <div className="flex gap-3">
            {/* Latest Dropdown Button */}
            <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-5 py-2.5 rounded-full text-sm font-medium transition-colors">
              Latest <ChevronDown size={16} />
            </button>

            {/* Write Review Button */}
            <button className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
              Write a Review
            </button>
          </div>
        </div>

        {/* --- Reviews Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border border-gray-200 rounded-2xl p-6 md:p-8 hover:shadow-md transition-shadow bg-white"
            >
              {/* Stars */}
              <div className="flex text-yellow-400 mb-3 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill={i < Math.floor(review.rating) ? "currentColor" : "none"}
                    stroke="currentColor"
                    className={i >= Math.floor(review.rating) && i < review.rating ? "fill-yellow-400" : ""} 
                  />
                ))}
              </div>

              {/* User Name & Verification */}
              <div className="flex items-center gap-2 mb-3">
                <h4 className="font-bold text-lg text-black">{review.user.firstName}</h4>
                <CheckCircle2 size={18} className="text-green-500 fill-green-500 text-white" />
              </div>

              {/* Review Text */}
              <p className="text-gray-600 leading-relaxed text-sm md:text-base mb-6">
                {review.comment}
              </p>

              {/* Date Footer */}
              <div className="text-gray-400 text-xs font-medium">
                Posted on {formatDate(review.createdAt)}
              </div>
            </div>
          ))}
        </div>

        {/* --- Load More Button --- */}
        <div className="flex justify-center mt-12">
          <button className="border border-gray-300 text-black px-8 py-3 rounded-full text-sm font-medium hover:border-black transition-colors">
            Load More Reviews
          </button>
        </div>

      </div>
    </div>
  );
}