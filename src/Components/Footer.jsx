
import React from 'react';
import { Mail, Twitter, Facebook, Instagram, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#f2f2f2] pt-16 pb-8 font-sans">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Newsletter Section */}
        <div className="bg-black rounded-[30px] p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 mb-16">
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Get exclusive access, new arrivals, and limited editions
            </h2>
          </div>
          
          <div className="w-full lg:w-1/2 flex flex-col gap-4 max-w-md ml-auto">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <button className="w-full bg-white text-black font-bold py-3.5 rounded-full hover:bg-gray-200 transition-colors">
              Join the Club
            </button>
          </div>
        </div>

        {/* Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Brand Column (Takes up more space) */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-2xl font-bold text-black">Men's Stitch</h3>
            <p className="text-gray-500 text-sm">Wear Your Passion. Play Your Heart.</p>
            
            <div className="flex gap-4 pt-2">
              {[Twitter, Facebook, Instagram, Github].map((Icon, index) => (
                <a 
                  key={index} 
                  href="#" 
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black hover:bg-black hover:text-white transition-all shadow-sm"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Spacer Column for Desktop */}
          <div className="hidden lg:block lg:col-span-2"></div>

          {/* Links Columns */}
          <div className="lg:col-span-2">
            <h4 className="font-bold tracking-widest text-xs mb-6 uppercase text-gray-900">Company</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li><a href="#" className="hover:text-black transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Our Story</a></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-bold tracking-widest text-xs mb-6 uppercase text-gray-900">Help</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li><a href="#" className="hover:text-black transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-bold tracking-widest text-xs mb-6 uppercase text-gray-900">Links</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li><a href="#" className="hover:text-black transition-colors">Account</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Wallet</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Orders</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-300 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            mensstich.com © 2025 All Rights Reserved
          </p>
          
          <div className="flex items-center gap-2">
            {/* Payment Icons - Using simple colored badges to simulate the look */}
            {['Visa', 'Mastercard', 'PayPal', 'ApplePay', 'GPay'].map((payment, i) => (
              <div key={i} className="h-6 w-10 bg-white rounded border border-gray-200 flex items-center justify-center">
                 {/* You would replace these small texts with actual <img> tags for logos */}
                 <span className="text-[8px] font-bold text-gray-600">{payment}</span>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </footer>
  );
}