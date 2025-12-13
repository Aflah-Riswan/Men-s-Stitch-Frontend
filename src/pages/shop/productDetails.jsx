import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import { Star, ShoppingCart, Minus, Plus, Heart, Share2 } from 'lucide-react' // Using Lucide icons for cleaner code
import axiosInstance from "../../utils/axiosInstance";

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  // State
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("details"); // 'details', 'reviews', 'faq'

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
      }
    } catch (error) {
      console.log("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  }

  // Handle Loading & Error States
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

  // Calculations
  const price = product.salePrice || product.originalPrice;
  const originalPrice = product.originalPrice;
  const hasDiscount = originalPrice > price;
  const discountPercentage = hasDiscount 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0;

  return (
    <div className="font-sans text-gray-800 bg-white">
      
      {/* NOTE: If your UserLayout already has a Navbar, remove this <header> section */}
      
      {/* Breadcrumb */}
      <nav className="py-4 px-6 text-xs text-gray-500 container mx-auto">
        <a href="/" className="hover:text-black">Home</a> &gt; 
        <span className="mx-1">Shop</span> &gt; 
        <span className="text-black ml-1 font-medium">{product.productName}</span>
      </nav>

      {/* Product Section */}
      <section className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 pb-16">
        
        {/* Left Column: Images */}
        <div className="flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex md:flex-col space-x-4 md:space-x-0 md:space-y-4 w-full md:w-1/5 overflow-x-auto md:overflow-visible">
            {product.coverImages?.map((img, index) => (
              <img 
                key={index}
                src={img} 
                alt={`Thumbnail ${index}`} 
                onClick={() => setSelectedImage(index)}
                className={`w-20 h-24 md:w-full md:h-auto object-cover cursor-pointer border-2 rounded transition-all ${
                  selectedImage === index ? 'border-black' : 'border-transparent hover:border-gray-300'
                }`} 
              />
            ))}
          </div>
          
          {/* Main Image */}
          <div className="flex-1">
            <div className="aspect-[4/5] w-full bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={product.coverImages?.[selectedImage] || "https://via.placeholder.com/400x500"} 
                alt={product.productName} 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        </div>

        {/* Right Column: Product Details */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-black mb-4 leading-tight">
            {product.productName}
          </h1>

          {/* Ratings */}
          <div className="flex items-center mb-6 space-x-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={18} 
                  fill={i < Math.floor(product.rating?.average || 0) ? "currentColor" : "none"} 
                  stroke="currentColor" 
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              {product.rating?.average || 0}/5 ({product.rating?.count || 0} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-end space-x-4 mb-6">
            <span className="text-3xl font-bold text-black">₹{price}</span>
            {hasDiscount && (
              <>
                <span className="text-xl text-gray-500 line-through mb-1">₹{originalPrice}</span>
                <span className="text-sm font-bold text-red-500 bg-red-100 px-2 py-1 rounded mb-1">
                  -{discountPercentage}%
                </span>
              </>
            )}
          </div>

          <p className="text-gray-600 mb-8 leading-relaxed">
            {product.productDescription || "No description available for this product."}
          </p>

          {/* Size Selector (Static for now, can be made dynamic if data exists) */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-black mb-3 uppercase tracking-wider">Choose Size</h3>
            <div className="flex flex-wrap gap-3">
              {['S', 'M', 'L', 'XL'].map((size) => (
                <button 
                  key={size}
                  className="w-12 h-10 border border-gray-300 rounded hover:border-black focus:border-black focus:bg-black focus:text-white transition-all text-sm font-medium"
                >
                  {size}
                </button>
              ))}
            </div>
            <button className="text-xs text-gray-500 underline mt-2 hover:text-black">
              See size guide
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mb-8">
            {/* Quantity */}
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-3 text-gray-600 hover:text-black"
              >
                <Minus size={16} />
              </button>
              <span className="px-2 font-medium w-8 text-center">{quantity}</span>
              <button 
                 onClick={() => setQuantity(quantity + 1)}
                 className="px-4 py-3 text-gray-600 hover:text-black"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Add to Cart */}
            <button className="flex-1 bg-black text-white py-3.5 rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
              <ShoppingCart size={20} />
              Add to Cart
            </button>

            {/* Wishlist */}
            <button className="p-3.5 border border-gray-300 rounded-lg hover:border-black text-gray-600 hover:text-black transition-colors">
              <Heart size={20} />
            </button>
          </div>
          
          {/* Metadata */}
          <div className="border-t pt-6 space-y-2 text-sm text-gray-500">
             <p>Category: <span className="text-black font-medium">{product.category?.name || "Men"}</span></p>
             <p>Tags: <span className="text-black font-medium">Fashion, Trending, Cotton</span></p>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="container mx-auto px-6 mb-16">
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {['Details', 'Rating & Reviews', 'FAQs'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.toLowerCase() || (activeTab === 'details' && tab === 'Details')
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-black hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Tab Content Placeholder */}
        <div className="min-h-[200px] text-gray-600">
           {activeTab === 'details' && (
             <div>
                <h3 className="font-bold text-lg mb-2">Product Specifications</h3>
                <p>Material: 100% Cotton</p>
                <p>Fit: Regular Fit</p>
                <p>Wash Care: Machine Wash</p>
             </div>
           )}
           {/* You can drop your <ProductReviews /> component here later */}
           {activeTab === 'rating & reviews' && <p>Reviews component will load here...</p>}
           {activeTab === 'faqs' && <p>Frequently Asked Questions will load here...</p>}
        </div>
      </section>
    </div>
  )
}