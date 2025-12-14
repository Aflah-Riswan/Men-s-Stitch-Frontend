import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Star, ShoppingCart, Minus, Plus, RotateCcw } from 'lucide-react';
import axiosInstance from "../../utils/axiosInstance";
import ProductDetailsTab from "../../Components/products/productDetailsTab";
import ProductReviews from "../../Components/products/ProductReviews";
import ProductFAQs from "../../Components/products/productFaq";
import ProductCard from "../../Components/products/ProductCard";
import Footer from "../../Components/Footer";

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('details')
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (id) {
      handleProductFetch(id);
    }
  }, [id, dispatch]);

  const handleProductFetch = async (productId) => {
    try {
      const response = await axiosInstance.get(`/products/${productId}/details`);
      if (response.data.success) {
        setProduct(response.data.product);
        setRelatedProducts(response.data.relatedProducts || [])
      }
    } catch (error) {
      console.log("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

  const price = product?.salePrice || 0;
  const originalPrice = product?.originalPrice || 0;
  const hasDiscount = price < originalPrice;
  const discountPercentage = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const activeVariant = product?.variants?.find((variant) => variant._id === selectedVariant);

  const rawImages = activeVariant?.variantImages?.length > 0
    ? activeVariant.variantImages
    : product?.coverImages;

  const currentImages = Array.isArray(rawImages) ? rawImages : ["https://via.placeholder.com/400?text=No+Image"];

  return (
    <div className="font-sans text-gray-800 bg-white">

      {/* Breadcrumb */}
      <nav className="py-3 px-6 text-xs text-gray-500 container mx-auto">
        <a href="/" className="hover:text-black">Home</a> &gt;
        <span className="mx-1">Shop</span> &gt;
        <span className="text-black ml-1 font-medium">{product?.productName}</span>
      </nav>

      {/* Main Grid Section - Reduced gap and padding */}
      <section className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10">

        {/* --- LEFT COLUMN: IMAGES --- */}
        <div className="lg:col-span-5 flex flex-col-reverse md:flex-row gap-3">

          {/* Thumbnails - Reduced Size */}
          <div className="flex md:flex-col space-x-3 md:space-x-0 md:space-y-3 w-full md:w-16 overflow-x-auto md:overflow-visible no-scrollbar">
            {currentImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index}`}
                // Changed w-20 h-24 -> w-16 h-20
                className={`w-16 h-20 object-contain cursor-pointer border-2 rounded transition-all ${selectedImage === index ? 'border-black' : 'border-transparent hover:border-gray-300'
                  }`}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>

          {/* Main Large Image */}
          <div className="flex-1">
            {/* Reduced max-height from 600px to 500px */}
            <div className="aspect-[3/4] max-h-[500px] w-full bg-gray-100 rounded-lg overflow-hidden relative flex items-center justify-center">
              <img
                src={currentImages[selectedImage] || currentImages[0]}
                alt={product?.productName}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: DETAILS --- */}
        <div className="lg:col-span-7">
          {/* Smaller Title Font */}
          <h1 className="text-xl md:text-2xl font-bold text-black mb-3 leading-tight">
            {product?.productName}
          </h1>

          {/* Ratings */}
          <div className="flex items-center mb-4 space-x-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16} // Reduced Star Size
                  fill={i < Math.floor(product?.rating?.average || 0) ? "currentColor" : "none"}
                  stroke="currentColor"
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">
              {product?.rating?.average || 0}/5 ({product?.rating?.count || 0} reviews)
            </span>
          </div>

          {/* Price - Reduced Size */}
          <div className="flex items-end space-x-3 mb-4">
            <span className="text-2xl font-bold text-black">₹{price}</span>
            {hasDiscount && (
              <>
                <span className="text-lg text-gray-500 line-through mb-1">₹{originalPrice}</span>
                <span className="text-xs font-bold text-red-500 bg-red-100 px-2 py-0.5 rounded mb-1">
                  -{discountPercentage}%
                </span>
              </>
            )}
          </div>

          {/* Description - Smaller Text */}
          <p className="text-gray-600 text-sm mb-6 leading-relaxed">
            {product?.productDescription}
          </p>

          {/* --- VARIANTS (COLOR PALETTE) --- */}
          {product?.variants && product.variants.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-bold text-black uppercase tracking-wider">
                  Select Color: <span className="text-gray-500 font-normal ml-2">{activeVariant ? activeVariant.productColor : "Default"}</span>
                </h3>
                {selectedVariant && (
                  <button
                    className="text-xs text-gray-500 flex items-center gap-1 hover:text-black"
                    onClick={() => {
                      setSelectedVariant(null);
                      setSelectedImage(0);
                    }}
                  >
                    <RotateCcw size={10} /> Reset
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant._id}
                    // Smaller Color Buttons (w-8 h-8)
                    className={`w-8 h-8 rounded-full border-2 transition-all relative ${selectedVariant === variant._id
                      ? 'border-black ring-1 ring-offset-1 ring-gray-300'
                      : 'border-gray-200 hover:scale-110'
                      }`}
                    style={{ backgroundColor: variant.colorCode || '#ccc' }}
                    title={variant.productColor}
                    onClick={() => {
                      setSelectedVariant(variant._id);
                      setSelectedImage(0);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons - Compact */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button className="px-3 py-2 text-gray-600 hover:text-black">
                <Minus size={14} />
              </button>
              <span className="px-2 font-medium w-6 text-sm text-center">1</span>
              <button className="px-3 py-2 text-gray-600 hover:text-black">
                <Plus size={14} />
              </button>
            </div>

            <button className="flex-1 bg-black text-white py-2.5 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
              <ShoppingCart size={18} />
              Add to Cart
            </button>
          </div>

        </div>
      </section>

      {/* --- TABS SECTION --- */}
      <section>
        <div className="w-full bg-white font-sans">
          <div className="border-b border-gray-200 mb-8"> {/* Reduced mb-10 to mb-8 */}
            <nav className="flex justify-center space-x-8 md:space-x-12 container mx-auto px-4 md:px-6" aria-label="Tabs">

              {/* Smaller Tab Buttons (px-16 -> px-10, py-4 -> py-3) */}
              <button
                onClick={() => setActiveTab('details')}
                className={`py-3 px-8 md:px-10 border-b-2 font-medium text-xs md:text-sm transition-all ${activeTab === 'details'
                  ? 'border-black text-black font-bold'
                  : 'border-transparent text-gray-500 hover:text-black hover:border-gray-300'
                  }`}
              >
                Product Details
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-3 px-8 md:px-10 border-b-2 font-medium text-xs md:text-sm transition-all ${activeTab === 'reviews'
                  ? 'border-black text-black font-bold'
                  : 'border-transparent text-gray-500 hover:text-black hover:border-gray-300'
                  }`}
              >
                Rating & Reviews
              </button>

              <button
                onClick={() => setActiveTab('faqs')}
                className={`py-3 px-8 md:px-10 border-b-2 font-medium text-xs md:text-sm transition-all ${activeTab === 'faqs'
                  ? 'border-black text-black font-bold'
                  : 'border-transparent text-gray-500 hover:text-black hover:border-gray-300'
                  }`}
              >
                FAQs
              </button>

            </nav>
          </div>

          {/* TAB CONTENT CONTAINER - Reduced Bottom Margin */}
          <div className="flex justify-center container mx-auto px-4 md:px-6 mb-8">
            <div className="w-full max-w-4xl"> {/* Changed max-w-5xl to 4xl for compactness */}
              {activeTab === 'details' && <ProductDetailsTab product={product} />}
              {activeTab === 'reviews' && <ProductReviews reviews={product.reviews} />}
              {activeTab === 'faqs' && <ProductFAQs faqs={product.faqs} />}
            </div>
          </div>

        </div>
      </section>

      {/* --- RELATED PRODUCTS --- */}
      {/* Reduced padding (py-16 -> py-10) */}
      <section className="w-full bg-white py-10">
        <div className="container mx-auto px-6">

          {/* Section Title - Smaller */}
          <h2 className="text-2xl md:text-3xl font-bold text-center text-black mb-8">
            You might also like
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

        </div>
      </section>
      
      <section>
        <Footer />
      </section>
    </div>
  );
}