import React, { useEffect, useState } from 'react';
import Navbar from "./Components/layout/navbar";
// 1. ADDED MISSING IMPORTS HERE
import {
  ArrowRight,

  Star,

} from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../redux/slice/categorySlice';
import { fetchProducts } from '../redux/slice/productSlice';

export default function Home() {

  const dispatch = useDispatch()
  const categories = useSelector((state) => state.category.items)
  const products = useSelector((state) => state.product.items)
  const [featured, setFeatured] = useState([])
  useEffect(() => {
    dispatch(fetchCategories())
    dispatch(fetchProducts())
  }, [dispatch])

  useEffect(() => {
    if (products) {
      const featured = products.filter((prod) => prod.isListed === true)
      console.log(featured)
      setFeatured(featured)
    }
  })

  return (
    <>


      {/* --- HERO SECTION --- */}
      <section className="relative w-full bg-[#FACC15] overflow-hidden font-sans">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

        <div className="relative z-10 max-w-[1428px] mx-auto px-4 md:px-8 min-h-[644px] flex flex-col md:flex-row items-center justify-between">

          {/* Content */}
          <div className="flex-1 text-center md:text-left space-y-6 pt-12 md:pt-0">
            <span className="inline-block text-sm font-bold tracking-[0.2em] uppercase border-b-2 border-black pb-1">
              Urban Fashion
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-[84px] font-black leading-tight text-black">
              BE NEW <br /> EVERY DAY
            </h1>
            <p className="text-lg md:text-xl text-gray-900 max-w-lg mx-auto md:mx-0 font-medium leading-relaxed">
              Clean looks, smoothness, and modern trends from just clothes.
            </p>
            <div className="pt-6">
              <button className="bg-black text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition-all flex items-center gap-2 mx-auto md:mx-0 shadow-xl">
                Shop Now
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="flex-1 h-full flex justify-center md:justify-end items-end relative mt-10 md:mt-0">
            <img
              src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=800&h=1000"
              alt="Fashion Model"
              className="object-contain max-h-[500px] md:max-h-[600px] w-auto drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* --- REST OF THE PAGE --- */}
      <div className="font-sans text-gray-800">

        <section className="container mx-auto px-4 py-12">

          <div className="flex flex-wrap justify-center items-center gap-4 overflow-x-auto pb-4 no-scrollbar">
            {categories.map((cat, index) => (
              <div key={index} className="flex flex-col items-center min-w-[80px] cursor-pointer group">

                <div className="w-16 h-16 rounded-full border border-gray-300 flex items-center justify-center mb-2 group-hover:border-black transition-all overflow-hidden relative">

                  <img
                    src={cat.image}
                    alt={cat.categoryName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                </div>
                <span className="text-sm font-medium text-gray-700">{cat.categoryName}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 2. New Arrivals Section */}

        <section className="container mx-auto px-4 py-8 font-sans">
          <h2 className="text-3xl font-bold text-center mb-10 text-black">NEW ARRIVALS</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featured.map((product) => (
              <div key={product.id} className="group cursor-pointer">

                {/* UPDATED: Changed h-[350px] to aspect-[3/4] (approx h-[500px] on desktop) */}
                <div className="relative overflow-hidden rounded-xl bg-gray-100 mb-4 aspect-[3/4]">
                  <img
                    src={product.coverImages[0]}
                    alt={product.productName}
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Product Name */}
                <h3 className="font-bold text-sm mb-1 truncate text-gray-900">{product.productName}</h3>

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
                  <span className="text-xs text-gray-500">product review</span>
                </div>

                {/* Price Section */}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-black text-lg">₹{product.Saleprice}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                      <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full font-medium">
                        -{Math.round(((product.originalPrice - product.Saleprice) / product.originalPrice) * 100)}%
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* 3. Top Selling Section */}
       
               <section className="container mx-auto px-4 py-8 font-sans">
          <h2 className="text-3xl font-bold text-center mb-10 text-black">NEW ARRIVALS</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featured.map((product) => (
              <div key={product.id} className="group cursor-pointer">

                {/* UPDATED: Changed h-[350px] to aspect-[3/4] (approx h-[500px] on desktop) */}
                <div className="relative overflow-hidden rounded-xl bg-gray-100 mb-4 aspect-[3/4]">
                  <img
                    src={product.coverImages[0]}
                    alt={product.productName}
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Product Name */}
                <h3 className="font-bold text-sm mb-1 truncate text-gray-900">{product.productName}</h3>

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
                  <span className="text-xs text-gray-500">product review</span>
                </div>

                {/* Price Section */}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-black text-lg">₹{product.Saleprice}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                      <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full font-medium">
                        -{Math.round(((product.originalPrice - product.Saleprice) / product.originalPrice) * 100)}%
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Testimonials Section */}


        {/* 5. Footer Section */}


      </div>
    </>
  )
}

// Product Card Component
function ProductCard({ product }) {
  return (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-xl bg-gray-100 mb-4 h-[350px]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
        />
      </div>
      <h3 className="font-bold text-sm mb-1 truncate">{product.name}</h3>
      <div className="flex items-center gap-1 mb-2">
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} stroke="currentColor" />
          ))}
        </div>
        <span className="text-xs text-gray-500">({product.reviews})</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-bold text-black">₹{product.price}</span>
        {product.originalPrice && (
          <>
            <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
            <span className="text-xs text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full">
              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </span>
          </>
        )}
      </div>
    </div>
  );
}