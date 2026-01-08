import React, { useState, useEffect } from 'react';
import { Ticket, Loader2, Copy } from 'lucide-react';
import { toast } from 'react-hot-toast';
import UserSidebar from '../../Components/user-account-components/UserSidebar';
import NewsLetter from '../../Components/NewsLetter';
import Footer from '../../Components/Footer';
import { couponService } from '../../services/couponService';

const MyCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const data = await couponService.getMyCoupons();
      if (data.success) {
        setCoupons(data.coupons);
      }
    } catch (error) {
      console.error("Failed to fetch coupons", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Coupon code copied!");
  };


  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">

      <div className="flex-1 flex flex-col md:flex-row w-full max-w-7xl mx-auto">
        <UserSidebar activeTab="My Coupons" />

        <div className="flex-1 min-w-0 p-4 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">My Coupons</h1>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 min-h-[400px]">
            
            <h3 className="text-lg font-bold border-b border-gray-100 pb-4 mb-2 underline decoration-gray-300 underline-offset-4 decoration-1 flex items-center gap-2">
              <Ticket size={20} className="text-black" /> Available Coupons
            </h3>

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="animate-spin text-gray-400" size={32} />
              </div>
            ) : coupons.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No coupons available at the moment.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {coupons.map((coupon) => (
                  <div key={coupon._id} className="py-6 first:pt-4 last:pb-0 group transition-colors hover:bg-gray-50/50 -mx-4 px-4 rounded-lg">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      
                      {/* Left: Offer Details */}
                      <div className="space-y-2 flex-1">
                        {/* Offer Badge */}
                        <p className="text-green-600 font-bold text-sm tracking-wide uppercase bg-green-50 w-fit px-2 py-0.5 rounded border border-green-100">
                          {coupon.discountType === 'percentage' 
                            ? `EXTRA ${coupon.discountValue}% OFF` 
                            : `FLAT ₹${coupon.discountValue} OFF`
                          }
                        </p>
                        
                        {/* Description */}
                        <p className="text-xs text-gray-500 font-medium leading-relaxed">
                          {coupon.description}
                          {coupon.minPurchaseAmount > 0 && ` (Min purchase: ₹${coupon.minPurchaseAmount})`}
                        </p>
                        
                        {/* Code Display */}
                        <div className="flex items-center gap-2 mt-2 cursor-pointer w-fit" onClick={() => copyToClipboard(coupon.couponCode)}>
                          <span className="text-xs font-bold text-gray-800 border border-dashed border-gray-300 px-2 py-1 rounded bg-gray-50 font-mono hover:bg-gray-100 transition-colors flex items-center gap-2">
                            {coupon.couponCode}
                            <Copy size={10} className="text-gray-400" />
                          </span>
                        </div>
                      </div>

                      {/* Right: Validity Date */}
                      <div className="text-left sm:text-right flex-shrink-0 mt-1 sm:mt-0">
                        <p className="text-[10px] text-gray-400 font-medium">
                          Valid till {formatDate(coupon.expiryDate)}
                        </p>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>

      <div className="w-full mt-12 px-4 sm:px-10">
        <div className="max-w-7xl mx-auto mb-12">
          <NewsLetter />
        </div>
        <Footer />
      </div>

    </div>
  );
};

export default MyCoupons;