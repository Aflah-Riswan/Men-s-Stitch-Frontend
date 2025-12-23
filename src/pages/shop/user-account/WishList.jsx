
import React from 'react';
import { Trash2 } from 'lucide-react';

// --- IMPORT YOUR COMPONENTS ---
// Update these paths based on your actual folder structure

import NewsLetter from '../../../Components/NewsLetter';
import Footer from '../../../Components/Footer';
import UserSidebar from '../../../Components/user-account-components/UserSidebar';

export default function Wishlist() {
  
  // Mock Data - Replace this with your actual Redux state or API data later
  const wishlistItems = [
    {
      id: 1,
      name: "Men's formal trousers - relaxed fit",
      size: 'Large',
      price: '₹559',
      image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=300&auto=format&fit=crop', 
    },
    {
      id: 2,
      name: "Men's full sleeve shirt-black",
      size: 'Medium',
      price: '₹399',
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=300&auto=format&fit=crop',
    },
    {
      id: 3,
      name: "Men's full sleeve shirt-black",
      size: 'Large',
      price: '₹499',
      image: 'https://images.unsplash.com/photo-1626447269096-f80851719523?q=80&w=300&auto=format&fit=crop', 
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 flex flex-col">
      <div className="flex-grow max-w-7xl mx-auto px-4 md:px-8 py-12 w-full">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
    
          <UserSidebar activeTab="Wishlist" />

         
          <main className="flex-1 min-h-[400px]">
             
          
             <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>

             
             <div className="space-y-4">
               {wishlistItems.map((item) => (
                 <div key={item.id} className="flex flex-col sm:flex-row bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative gap-6 transition-all hover:shadow-md">
                   
                   {/* Product Image */}
                   <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                     <img 
                       src={item.image} 
                       alt={item.name} 
                       className="w-full h-full object-cover" 
                     />
                   </div>

                   {/* Product Details */}
                   <div className="flex-1 flex flex-col justify-between">
                     <div>
                       <div className="flex justify-between items-start">
                         <h3 className="font-semibold text-gray-900 text-lg pr-8">{item.name}</h3>
                         
                         {/* Delete Button */}
                         <button className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors" title="Remove">
                           <Trash2 size={18} />
                         </button>
                       </div>
                       <p className="text-gray-500 text-sm mt-1">Size: {item.size}</p>
                     </div>

                     <div className="flex justify-between items-end mt-4">
                       <span className="font-bold text-xl text-gray-900">{item.price}</span>
                       
                       <button className="bg-black text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors uppercase tracking-wide">
                         add to cart
                       </button>
                     </div>
                   </div>
                 </div>
               ))}

               {/* Empty State Handling */}
               {wishlistItems.length === 0 && (
                   <div className="text-center py-12 bg-gray-50 rounded-xl">
                     <p className="text-gray-500">Your wishlist is currently empty.</p>
                   </div>
               )}
             </div>

          </main>
        </div>
      </div>

      {/* 3. FOOTER WITH FLOATING NEWSLETTER */}
      <div className="relative mt-24">
        
        {/* Floating Newsletter Wrapper */}
        <div className="absolute top-0 left-0 right-0 transform -translate-y-1/2 px-4 z-10">
          <div className="max-w-7xl mx-auto">
             <NewsLetter />
          </div>
        </div>

        {/* Gray Footer Container */}
        <div className="bg-gray-100 pt-32 pb-8 px-4 md:px-8">
             <div className="max-w-7xl mx-auto">
                <Footer />
             </div>
        </div>
      </div>

    </div>
  );
}