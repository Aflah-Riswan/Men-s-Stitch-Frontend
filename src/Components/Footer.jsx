import React from 'react';
import { Mail, Twitter, Facebook, Instagram, Github } from 'lucide-react';

export default function Footer() {
  return (
    // Reduced top/bottom padding (pt-16 -> pt-10, pb-8 -> pb-6)
    <footer className="bg-[#f2f2f2] pt-10 pb-6 font-sans">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Newsletter Section - Compact */}
        {/* Reduced padding (p-8 -> p-6), margin-bottom (mb-16 -> mb-10) */}
        <div className="bg-black rounded-[20px] p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 mb-10">
          <div className="w-full lg:w-1/2">
            {/* Reduced heading size */}
            <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">
              Get exclusive access, new arrivals, and limited editions
            </h2>
          </div>
          
          <div className="w-full lg:w-1/2 flex flex-col gap-3 max-w-sm ml-auto">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="email" 
                placeholder="Enter your email address" 
                // Smaller input padding
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white text-sm text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            {/* Smaller button */}
            <button className="w-full bg-white text-black text-sm font-bold py-2.5 rounded-full hover:bg-gray-200 transition-colors">
              Join the Club
            </button>
          </div>
        </div>

        {/* Footer Links Grid - Reduced gap and margin */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 mb-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xl font-bold text-black">Men's Stitch</h3>
            <p className="text-gray-500 text-xs">Wear Your Passion. Play Your Heart.</p>
            
            <div className="flex gap-3 pt-1">
              {[Twitter, Facebook, Instagram, Github].map((Icon, index) => (
                <a 
                  key={index} 
                  href="#" 
                  // Smaller social icons (w-10 -> w-8)
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black hover:bg-black hover:text-white transition-all shadow-sm"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Spacer Column */}
          <div className="hidden lg:block lg:col-span-2"></div>

          {/* Links Columns - Smaller text and spacing */}
          <div className="lg:col-span-2">
            <h4 className="font-bold tracking-widest text-[10px] mb-4 uppercase text-gray-900">Company</h4>
            <ul className="space-y-2 text-gray-500 text-xs">
              <li><a href="#" className="hover:text-black transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Our Story</a></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-bold tracking-widest text-[10px] mb-4 uppercase text-gray-900">Help</h4>
            <ul className="space-y-2 text-gray-500 text-xs">
              <li><a href="#" className="hover:text-black transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-bold tracking-widest text-[10px] mb-4 uppercase text-gray-900">Links</h4>
            <ul className="space-y-2 text-gray-500 text-xs">
              <li><a href="#" className="hover:text-black transition-colors">Account</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Wallet</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Orders</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-gray-300 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-[10px]">
            mensstich.com © 2025 All Rights Reserved
          </p>
          
          <div className="flex items-center gap-2">
            {['Visa', 'Mastercard', 'PayPal', 'ApplePay', 'GPay'].map((payment, i) => (
              <div key={i} className="h-5 w-8 bg-white rounded border border-gray-200 flex items-center justify-center">
                 <span className="text-[6px] font-bold text-gray-600">{payment}</span>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </footer>
  );
}