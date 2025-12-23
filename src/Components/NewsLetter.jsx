import { Mail } from "lucide-react";


export default function NewsLetter() {


  return (
    <>
      <div className="bg-black rounded-[20px] p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
        <div className="w-full lg:w-1/2">
          <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-2">
            Get exclusive access, new arrivals, and limited editions
          </h2>
          <p className="text-gray-400">Join our newsletter and get 10% off your first order.</p>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col gap-3 max-w-md ml-auto">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full pl-12 pr-4 py-3 rounded-full bg-white text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
          <button className="w-full bg-white text-black font-bold py-3 rounded-full hover:bg-gray-200 transition-colors">
            Join the Club
          </button>
        </div>
      </div>
    </>
  )
}