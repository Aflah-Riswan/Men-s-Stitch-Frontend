import React, { useEffect, useState } from 'react';
import Navbar from "./Components/layout/navbar";
// 1. ADDED MISSING IMPORTS HERE
import {
  ArrowRight,
  Star,
} from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../redux/slice/categorySlice';
import axiosInstance from './utils/axiosInstance';
import ProductCard from './Components/products/ProductCard';
import heroImage from './assets/photo-1552374196-1ab2a1c593e8.avif'
import Footer from './Components/Footer';
import { useNavigate } from 'react-router-dom';
export default function Home() {

  const dispatch = useDispatch()
  const categories = useSelector((state) => state.category.items)
  const [featured, setFeatured] = useState([])
  const [products, setProducts] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const navigate = useNavigate()
  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  useEffect(() => {
    fetchProducts()
    featuredReviews()
  }, [dispatch])

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/products/products-home')
      if (response.data.success) {
        setFeatured([...response.data.featured])
        setNewArrivals([...response.data.newArrivals])
        setProducts([...response.data.products])
      } else {
        console.log(response.data)
        alert('something went wrong')
      }
    } catch (error) {
      console.log(error)
    }
  }
  const featuredReviews = async () => {
    try {
      const response = await axiosInstance.get('/reviews/featured')
      console.log(response)
      if (response.data.success) {
        setTestimonials([...response.data.reviews])
        console.log(response.data)
      }
    } catch (error) {
      console.log("error in  : ", error)
    }
  }



  console.log("State Check:", { featured, newArrivals, products });
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
              src={heroImage}
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

                <div className="w-16 h-16 rounded-full border border-gray-300 flex items-center justify-center mb-2 group-hover:border-black transition-all overflow-hidden relative" onClick={()=>navigate(`/category/${cat.slug}`)}>

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
            {products.map((product) => {
              return <ProductCard key={product._id} product={product} />
            })}
          </div>
        </section>
        {/* 3. Top Selling Section */}

        <section className="container mx-auto px-4 py-8 font-sans">
          <h2 className="text-3xl font-bold text-center mb-10 text-black">FEATURED</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featured.map((product) => (
             
              <ProductCard key={product._id} product={product} />
             
            ))}
          </div>
        </section>

        {/* 4. Testimonials Section */}
        <section className="bg-gray-50 py-16 font-sans">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-black mb-4">WHAT OUR CUSTOMERS SAY</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t) => (
                <div key={t._id} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">

                  {/* Stars */}
                  <div className="flex text-yellow-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < t.rating ? "currentColor" : "none"}
                        stroke="currentColor"
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-gray-700 italic mb-6 min-h-[60px]">"{t.comment}"</p>

                  {/* User Info */}
                  <div className="flex items-center gap-4">
                    {/* Random placeholder avatar based on name */}
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                      {(t.user?.firstName || "U").charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-black">
                        {t.user?.firstName || "Verified Customer"}
                      </h4>
                      <span className="text-xs text-green-600 font-medium">Verified Buyer</span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Footer Section */}

        <Footer />

      </div>
    </>
  )
}

// Product Card Component
