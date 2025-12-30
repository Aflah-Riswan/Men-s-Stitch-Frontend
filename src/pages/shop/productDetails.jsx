import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Star, ShoppingCart, Minus, Plus, RotateCcw, Heart } from 'lucide-react';
import axiosInstance from "../../utils/axiosInstance";
import ProductDetailsTab from "../../Components/products/productDetailsTab";
import ProductReviews from "../../Components/products/ProductReviews";
import ProductFAQs from "../../Components/products/productFaq";
import ProductCard from "../../Components/products/ProductCard";
import Footer from "../../Components/Footer";
import * as cartService from '../../services/cartService';
import * as wishlistService  from '../../services/wishlistService';
import toast from "react-hot-toast";

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);


  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedColorCode, setSelectedColorCode] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [activeTab, setActiveTab] = useState('details');
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
        setRelatedProducts(response.data.relatedProducts || []);

        if (response.data.product.variants && response.data.product.variants.length > 0) {
          const firstVar = response.data.product.variants[0];
          setSelectedVariant(firstVar._id);
          setSelectedColorCode(firstVar.colorCode);
        }
      }
    } catch (error) {
      console.log("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWishlistButton = async () => {
    if (!product?._id) return;
    try {
      await wishlistService.addToWishlist(product._id);
      toast.success("Added to your wishlist!");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to add to wishlist";
      if (message.includes("already")) {
        toast('This item is already in your wishlist', { icon: 'ℹ️' });
      } else {
        toast.error(message);
      }
    }
  }

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



  const handleCount = (action) => {
    if (action === 'add') {

      if (activeVariant && selectedSize) {
        const currentStock = activeVariant.stock[selectedSize];
        if (quantity >= currentStock) {
          return toast.error(`Only ${currentStock} items available`);
        }
      }

      if (quantity >= 5) return toast.error("Max limit 5 per item");

      setQuantity((prev) => prev + 1);
    } else if (action === 'minus') {
      if (quantity > 1) {
        setQuantity((prev) => prev - 1);
      }
    }
  };

  const handleCartButton = async () => {

    if (!selectedVariant) {
      return toast.error("Please select a color");
    }
    if (!selectedSize) {
      return toast.error("Please select a size");
    }
    if (quantity < 1) {
      return toast.error("Quantity must be at least 1");
    }


    if (activeVariant) {
      const stockAvailable = activeVariant.stock[selectedSize];
      if (stockAvailable < quantity) {
        return toast.error(`Out of stock! Only ${stockAvailable} left.`);
      }
    }


    const data = {
      productId: product._id,
      variantId: selectedVariant,
      size: selectedSize,
      colorCode: selectedColorCode,
      quantity: quantity
    };

    try {
      await cartService.addToCart(data);
      toast.success('Added item to cart successfully!');
      setQuantity(1);
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  };

  return (
    <div className="font-sans text-gray-800 bg-white">
      {/* Breadcrumb */}
      <nav className="py-3 px-6 text-xs text-gray-500 container mx-auto">
        <a href="/" className="hover:text-black">Home</a> &gt;
        <span className="mx-1">Shop</span> &gt;
        <span className="text-black ml-1 font-medium">{product?.productName}</span>
      </nav>

      {/* Main Grid Section */}
      <section className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10">

        {/* --- LEFT COLUMN: IMAGES --- */}
        <div className="lg:col-span-5 flex flex-col-reverse md:flex-row gap-3">
          {/* Thumbnails */}
          <div className="flex md:flex-col space-x-3 md:space-x-0 md:space-y-3 w-full md:w-16 overflow-x-auto md:overflow-visible no-scrollbar">
            {currentImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index}`}
                className={`w-16 h-20 object-contain cursor-pointer border-2 rounded transition-all ${selectedImage === index ? 'border-black' : 'border-transparent hover:border-gray-300'}`}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-1">
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
          <h1 className="text-xl md:text-2xl font-bold text-black mb-3 leading-tight">
            {product?.productName}
          </h1>

          <div className="flex items-center mb-4 space-x-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < Math.floor(product?.rating?.average || 0) ? "currentColor" : "none"}
                  stroke="currentColor"
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">
              {product?.rating?.average || 0}/5 ({product?.rating?.count || 0} reviews)
            </span>
          </div>

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

          <p className="text-gray-600 text-sm mb-6 leading-relaxed">
            {product?.productDescription}
          </p>

          {/* --- SIZE SELECTION --- */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xs font-bold text-black uppercase tracking-wider">Choose Size</h3>

            </div>
            <div className="flex flex-wrap gap-2">
              {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => {

                const stock = activeVariant ? activeVariant.stock[size] : 0;
                const isOutOfStock = stock <= 0;
                const isSelected = selectedSize === size;

                return (
                  <button
                    key={size}
                    disabled={isOutOfStock || !activeVariant}
                    className={`
                      relative px-4 py-2 text-xs font-medium border rounded-full transition-all
                      ${(isOutOfStock || !activeVariant)
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed overflow-hidden bg-gray-50'
                        : 'border-gray-200 text-black hover:border-black hover:bg-black hover:text-white'
                      }
                      ${isSelected ? 'bg-black text-white border-black' : ''}
                    `}
                    onClick={() => setSelectedSize(size)}
                    title={!activeVariant ? "Select a color first" : ""}
                  >
                    {size}
                    {isOutOfStock && activeVariant && (
                      <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="w-full border-t border-gray-300 -rotate-45"></span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {!activeVariant && <p className="text-xs text-red-400 mt-1">Please select a color first to see available sizes.</p>}
          </div>

          {/* --- VARIANT (COLOR) SELECTION --- */}
          {product?.variants && product.variants.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-bold text-black uppercase tracking-wider">
                  Select Color: <span className="text-gray-500 font-normal ml-2">{activeVariant ? activeVariant.productColor : "None"}</span>
                </h3>
                {selectedVariant && (
                  <button
                    className="text-xs text-gray-500 flex items-center gap-1 hover:text-black"
                    onClick={() => {
                      setSelectedVariant(null);
                      setSelectedColorCode(null);
                      setSelectedSize(null);
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
                    className={`w-8 h-8 rounded-full border-2 transition-all relative ${selectedVariant === variant._id ? 'border-black ring-1 ring-offset-1 ring-gray-300' : 'border-gray-200 hover:scale-110'}`}
                    style={{ backgroundColor: variant.colorCode || '#ccc' }}
                    title={variant.productColor}
                    onClick={() => {
                      setSelectedVariant(variant._id);
                      setSelectedColorCode(variant.colorCode);
                      setSelectedSize(null);
                      setSelectedImage(0);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* --- ACTION BUTTONS --- */}
          <div className="flex items-center gap-3 mb-6">
            {/* Quantity Selector */}
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button className="px-3 py-4 text-gray-600 hover:text-black" onClick={() => handleCount('minus')}>
                <Minus size={14} />
              </button>
              <span className="px-3 font-medium w-8 text-sm text-center">{quantity}</span>
              <button className="px-3 py-4 text-gray-600 hover:text-black" onClick={() => handleCount('add')}>
                <Plus size={14} />
              </button>
            </div>

            {/* Add To Cart */}
            <button
              onClick={handleCartButton}
              className="flex-1 bg-black text-white py-4 rounded-full text-sm font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>

            {/* Wishlist Button */}
            <button className="p-4 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors" onClick={handleWishlistButton}>
              <Heart size={20} className="text-gray-400 hover:text-red-500" />
            </button>
          </div>

        </div>
      </section>

      {/* --- TABS SECTION --- */}
      <section className="border-t border-gray-100 mt-10">
        <div className="w-full bg-white font-sans">
          {/* Navigation */}
          <div className="mb-10">
            <nav className="flex justify-center space-x-6 md:space-x-16 container mx-auto px-4 md:px-6">
              {[
                { id: 'details', label: 'Product Details' },
                { id: 'reviews', label: 'Rating & Reviews' },
                { id: 'faqs', label: 'FAQs' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    py-6 px-2 transition-all duration-200 relative text-base md:text-lg tracking-tight
                    ${activeTab === tab.id ? 'text-black font-bold' : 'text-gray-400 font-medium hover:text-black'}
                  `}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black rounded-full" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex justify-center container mx-auto px-4 md:px-6 mb-16">
            <div className="w-full max-w-5xl">
              {activeTab === 'details' && <ProductDetailsTab product={product} />}
              {activeTab === 'reviews' && <ProductReviews reviews={product.reviews} />}
              {activeTab === 'faqs' && <ProductFAQs faqs={product.faqs} />}
            </div>
          </div>
        </div>
      </section>

      {/* --- RELATED PRODUCTS --- */}
      <section className="w-full bg-white py-10">
        <div className="container mx-auto px-6">
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

      <Footer />
    </div>
  );
}