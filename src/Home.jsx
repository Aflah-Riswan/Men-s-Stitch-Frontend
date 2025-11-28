

import Navbar from "./Components/layout/navbar"
import { ArrowRight } from "lucide-react"
export default function Home (){

  return(
    <>
    <Navbar/>
  
    <section className="relative w-full bg-[#FACC15] overflow-hidden font-sans">
      
      
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

      <div className="relative z-10 max-w-[1428px] mx-auto px-4 md:px-8 min-h-[644px] flex flex-col md:flex-row items-center justify-between">
        
        {/* --- LEFT SIDE: Content --- */}
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

     
        <div className="flex-1 h-full flex justify-center md:justify-end items-end relative mt-10 md:mt-0">
     
          <img 
            src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=800&h=1000" 
            alt="Fashion Model" 
           
            className="object-contain max-h-[500px] md:max-h-[600px] w-auto drop-shadow-2xl"
          />
        </div>

      </div>
    </section>
    </>
  )
}