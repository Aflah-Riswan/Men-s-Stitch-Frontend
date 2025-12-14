import React from 'react';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({product}) {

  const navigate = useNavigate()
  if (!product) return null;

  
  const price = product ?.salePrice || 0;
  const originalPrice = product ?.originalPrice || 0;
  

  const hasDiscount = originalPrice > price;
  const discountPercentage = hasDiscount 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0;

  const ratingValue = product.rating?.average || 0;
  const reviewCount = product.rating?.count || 0;

  return (
    <div className="group cursor-pointer" onClick={()=>navigate(`/product/${product._id}/details`)}>
      
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-xl bg-gray-100 mb-4 aspect-[3/4]">
        <img
          // JSON uses 'coverImages' array
          src={product.coverImages?.[0] || "https://via.placeholder.com/300?text=No+Image"}
          alt={product.productName}
          className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Product Name (JSON uses 'productName') */}
      <h3 className="font-bold text-sm mb-1 truncate text-gray-900">
        {product.productName || "Untitled Product"}
      </h3>

      {/* Star Rating */}
      <div className="flex items-center gap-1 mb-2">
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={12}
              // Use the extracted ratingValue
              fill={i < Math.floor(ratingValue) ? "currentColor" : "none"}
              stroke="currentColor"
            />
          ))}
        </div>
        <span className="text-xs text-gray-500">
          ({reviewCount} reviews)
        </span>
      </div>

      {/* Price Section */}
      <div className="flex items-center gap-2">
        <span className="font-bold text-black text-lg">
          ₹{price}
        </span>

        {hasDiscount && (
          <>
            <span className="text-sm text-gray-400 line-through">
              ₹{originalPrice}
            </span>
            <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full font-medium">
              -{discountPercentage}%
            </span>
          </>
        )}
      </div>
    </div>
  );
}