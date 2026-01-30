import React, { useEffect, useState } from 'react';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 
import toast from 'react-hot-toast';

import NewsLetter from '../../../Components/NewsLetter';
import Footer from '../../../Components/Footer';
import UserSidebar from '../../../Components/user-account-components/UserSidebar';
import * as wishlistService from '../../../services/wishlistService';

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  
  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const data = await wishlistService.getWishlist();
      console.log(data)
      setWishlistItems(data.products || []);
    } catch (error) {
      console.error("Failed to fetch wishlist", error);
      toast.error("Could not load wishlist");
    } finally {
      setLoading(false);
    }
  };

  
  const handleRemove = async (itemId) => {
    try {
    
      setWishlistItems((prev) => prev.filter((item) => item._id !== itemId));
      
      await wishlistService.removeFromWishlist(itemId);
      toast.success("Item removed from wishlist");
    } catch (error) {
      toast.error("Failed to remove item");
      fetchWishlist(); 
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 flex flex-col">
      <div className="flex-grow max-w-7xl mx-auto px-4 md:px-8 py-12 w-full">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          
          <UserSidebar activeTab="Wishlist" />

          <main className="flex-1 min-h-[400px]">
             <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>

             <div className="space-y-4">
               {wishlistItems.map((item) => {
       
                 const product = item.productId;
                 if (!product) return null; 

                
                 const image = product.coverImages?.[0] || "https://via.placeholder.com/300";
                 
                 return (
                   <div key={item._id} className="flex flex-col sm:flex-row bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative gap-6 transition-all hover:shadow-md">
                     
                     {/* Product Image */}
                     <div 
                       className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
                       onClick={() => navigate(`/product/${product._id}`)}
                     >
                       <img 
                         src={image} 
                         alt={product.productName} 
                         className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                       />
                     </div>

                     {/* Product Details */}
                     <div className="flex-1 flex flex-col justify-between">
                       <div>
                         <div className="flex justify-between items-start">
                           <h3 
                             className="font-semibold text-gray-900 text-lg pr-8 cursor-pointer hover:underline"
                             onClick={() => navigate(`/product/${product._id}`)}
                           >
                             {product.productName}
                           </h3>
                           
                           {/* Delete Button  */}
                           <button 
                             onClick={() => handleRemove(item._id)}
                             className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors" 
                             title="Remove"
                           >
                             <Trash2 size={18} />
                           </button>
                         </div>
                        
                         <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.productDescription}</p>
                       </div>

                       <div className="flex justify-between items-end mt-4">
                         <span className="font-bold text-xl text-gray-900">₹{product.salePrice}</span>
                         
                      
                         <button 
                           onClick={() => navigate(`/product/${product._id}/details`)}
                           className="bg-black text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors uppercase tracking-wide flex items-center gap-2"
                         >
                           <ShoppingBag size={16} />
                           View Product
                         </button>
                       </div>
                     </div>
                   </div>
                 );
               })}

               {/* Empty State */}
               {wishlistItems.length === 0 && (
                   <div className="text-center py-12 bg-gray-50 rounded-xl">
                     <p className="text-gray-500">Your wishlist is currently empty.</p>
                     <button onClick={() => navigate('/shop')} className='mt-4 text-black underline font-medium'>Continue Shopping</button>
                   </div>
               )}
             </div>

          </main>
        </div>
      </div>

      <div className="relative mt-24">
        <div className="absolute top-0 left-0 right-0 transform -translate-y-1/2 px-4 z-10">
          <div className="max-w-7xl mx-auto">
             <NewsLetter />
          </div>
        </div>
        <div className="bg-gray-100 pt-32 pb-8 px-4 md:px-8">
             <div className="max-w-7xl mx-auto">
                <Footer />
             </div>
        </div>
      </div>
    </div>
  );
}