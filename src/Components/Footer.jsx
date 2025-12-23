import React from 'react';
import { Twitter, Facebook, Instagram, Github } from 'lucide-react';

export default function Footer() {
  return (
    // Note: No background color here. The parent handles the background.
    <footer className="font-sans w-full">
      
        {/* --- NEWSLETTER SECTION REMOVED FROM HERE --- */}

        {/* Footer Links Grid */}
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
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black hover:bg-black hover:text-white transition-all shadow-sm"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Spacer Column */}
          <div className="hidden lg:block lg:col-span-2"></div>

          {/* Navigation Links */}
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
        
    </footer>
  );
}