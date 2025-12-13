
import React from 'react';
import { Star } from 'lucide-react';

export default function ProductCard({ product }) {
  return (
    <div className="group cursor-pointer">

      {/* Image Container - Using aspect-[3/4] for taller images */}
      <div className="relative overflow-hidden rounded-xl bg-gray-100 mb-4 aspect-[3/4]">
        <img
          // detailed check to support both your data structures (mock vs real)
          src={product.coverImages ? product.coverImages[0] : product.image}
          alt={product.productName || product.name}
          className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Product Name */}
      <h3 className="font-bold text-sm mb-1 truncate text-gray-900">
        {product.productName || product.name}
      </h3>

      {/* Star Rating */}
      <div className="flex items-center gap-1 mb-2">
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={12}
              fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
              stroke="currentColor"
            />
          ))}
        </div>
        <span className="text-xs text-gray-500">
          ({product.reviews || 'reviews'})
        </span>
      </div>

      {/* Price Section */}
      <div className="flex items-center gap-2">
        <span className="font-bold text-black text-lg">
          ₹{product.Saleprice || product.price}
        </span>

        {product.originalPrice && (
          <>
            <span className="text-sm text-gray-400 line-through">
              ₹{product.originalPrice}
            </span>
            <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full font-medium">
              {/* Calculate discount dynamically */}
              -{Math.round(((product.originalPrice - (product.Saleprice || product.Saleprice)) / product.originalPrice) * 100)}%
            </span>
          </>
        )}
      </div>
    </div>
  );
}