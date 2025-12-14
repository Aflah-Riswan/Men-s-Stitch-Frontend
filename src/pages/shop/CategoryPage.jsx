import React from 'react';
import { 
  Search, 
  Heart, 
  ShoppingCart, 
  User, 
  ChevronDown, 
  Star, 
  ChevronRight, 
  SlidersHorizontal 
} from 'lucide-react';
import { useParams } from 'react-router-dom';

const slug = useParams()
console.log(slug)

const products = [
  {
    id: 1,
    title: "Real Madrid – 2024/25 Home Jersey",
    price: "₹499",
    rating: 4.4,
    reviews: 5,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=600",
    discount: null,
    oldPrice: null
  },
  {
    id: 2,
    title: "FC Barcelona – 2024/25 Home Jersey",
    price: "₹399",
    rating: 3.5,
    reviews: 5,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=600",
    discount: "-20%",
    oldPrice: "₹499"
  },
  {
    id: 3,
    title: "Manchester United – 2024/25 Home Jersey",
    price: "₹499",
    rating: 4.5,
    reviews: 5,
    image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&q=80&w=600",
    discount: null,
    oldPrice: null
  },
  {
    id: 4,
    title: "Real Madrid – 2024/25 Home Jersey",
    price: "₹499",
    rating: 4.5,
    reviews: 5,
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=600",
    discount: null,
    oldPrice: null
  },
  {
    id: 5,
    title: "FC Barcelona – 2024/25 Home Jersey",
    price: "₹399",
    rating: 3.5,
    reviews: 5,
    image: "https://images.unsplash.com/photo-1589711678174-8a4db95c659e?auto=format&fit=crop&q=80&w=600",
    discount: "-20%",
    oldPrice: "₹499"
  },
  {
    id: 6,
    title: "Manchester United – 2024/25 Home Jersey",
    price: "₹499",
    rating: 4.0,
    reviews: 5,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c47e356?auto=format&fit=crop&q=80&w=600",
    discount: null,
    oldPrice: null
  },
];

// --- COMPONENTS ---

const Sidebar = () => (
  <div className="w-64 flex-shrink-0 pr-8 hidden lg:block">
    <div className="flex justify-between items-center mb-6">
      <h3 className="font-bold text-lg">Filters</h3>
      <SlidersHorizontal className="w-4 h-4 text-gray-500" />
    </div>

    {/* Categories */}
    <div className="border-t py-4 text-sm text-gray-600 space-y-3">
      {['Casual Shirts', 'Formal Shirts', 'Partywear', 'Short Kurtis', 'Cuban'].map((item) => (
        <div key={item} className="flex justify-between items-center cursor-pointer hover:text-black">
          <span>{item}</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
      ))}
    </div>

    {/* Price Slider UI Mockup */}
    <div className="border-t py-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold text-sm">Price</h4>
        <ChevronDown className="w-4 h-4 rotate-180" />
      </div>
      <div className="relative h-1 bg-gray-200 mt-4 mb-4 rounded">
        <div className="absolute left-1/4 right-1/4 h-1 bg-black rounded"></div>
        <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-4 h-4 bg-black rounded-full border-2 border-white shadow"></div>
        <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-4 h-4 bg-black rounded-full border-2 border-white shadow"></div>
      </div>
      <div className="flex justify-between text-xs font-bold">
        <span>₹300</span>
        <span>₹1500</span>
      </div>
    </div>

    {/* Size */}
    <div className="border-t py-4">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-bold text-sm">Size</h4>
        <ChevronDown className="w-4 h-4 rotate-180" />
      </div>
      <div className="flex flex-wrap gap-2">
        {['X-Small', 'Small', 'Medium', 'Large', 'X-Large', 'XX-Large', '3X-Large', '4X-Large'].map((size) => (
          <button 
            key={size}
            className={`px-3 py-1.5 text-[10px] rounded-full border transition-colors
              ${size === 'Large' ? 'bg-black text-white border-black' : 'bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200'}
            `}
          >
            {size}
          </button>
        ))}
      </div>
    </div>

    {/* Collar Type */}
    <div className="border-t py-4">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-bold text-sm">Collar - Type</h4>
        <ChevronDown className="w-4 h-4 rotate-180" />
      </div>
      <div className="flex flex-wrap gap-2">
        {['Collar', 'Club', 'Cutaway', 'Mandarin', 'Button-Down', 'Wingtip', 'Field Collar'].map((type) => (
          <button 
            key={type}
            className={`px-3 py-1.5 text-[10px] rounded-full border transition-colors
              ${type === 'Field Collar' ? 'bg-black text-white border-black' : 'bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200'}
            `}
          >
            {type}
          </button>
        ))}
      </div>
    </div>

    {/* Material */}
    <div className="border-t py-4">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-bold text-sm">Material</h4>
        <ChevronDown className="w-4 h-4 rotate-180" />
      </div>
      <div className="flex flex-wrap gap-2">
        {['Cotton', 'Linen', 'Silk', 'Jute', 'Satin', 'Twill', 'Polyester'].map((mat) => (
          <button 
            key={mat}
            className={`px-3 py-1.5 text-[10px] rounded-full border transition-colors
              ${mat === 'Jute' ? 'bg-black text-white border-black' : 'bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200'}
            `}
          >
            {mat}
          </button>
        ))}
      </div>
    </div>

    <button className="w-full bg-black text-white py-3 rounded-full text-xs font-bold mt-4 uppercase tracking-wider">
      Apply Filter
    </button>
  </div>
);


export default function CatgeoryPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
  
      
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 mb-6 flex items-center gap-1">
          <span>Home</span>
          <ChevronRight className="w-3 h-3" />
          <span className="font-medium text-black">Shirts</span>
        </div>

        <div className="flex">
          {/* Left Sidebar */}
          <Sidebar />

          {/* Right Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-3xl font-bold">Shirts</h2>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-500">Showing 1-10 of 40 Products</span>
                <div className="flex items-center gap-1 font-medium cursor-pointer">
                  Sort by: <span className="font-bold">Most Popular</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
             
            </div>
            
            {/* Mock Pagination / Load More spacer */}
            <div className="mt-12 mb-8 text-center">
                {/* Space for pagination if needed later */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}