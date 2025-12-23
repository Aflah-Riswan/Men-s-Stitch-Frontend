import React from 'react';
import {
  User,
  Package,
  Heart,
  MapPin,
  Wallet,
  Percent,
  Settings,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Optional: Use this if you need navigation

export default function UserSidebar({ activeTab = 'Account Overview' }) {
  const navigate = useNavigate(); // Optional

  const sidebarItems = [
    { icon: User, label: 'Account Overview', path: '/profile' }, // Added paths for logic
    { icon: Package, label: 'My orders', path: '/orders' },
    { icon: Heart, label: 'Wishlist', path: '/wishlist' },
    { icon: MapPin, label: 'Addresses', path: '/addresses' },
    { icon: Wallet, label: 'Wallet', path: '/wallet' },
    { icon: Percent, label: 'My Coupons', path: '/coupons' },
    { icon: Settings, label: 'Account Settings', path: '/settings' },
  ];

  return (

    <aside className="w-full md:w-72 flex-shrink-0 bg-gray-50 p-6 min-h-[calc(100vh-80px)]"> 
      <nav className="space-y-2">
        {sidebarItems.map((item, index) => {
          const isActive = item.label === activeTab;
          return (
            <button
              key={index}
              onClick={() => navigate(item.path)} // Add navigation logic here
              className={`w-full flex items-center gap-4 px-6 py-4 text-sm font-bold transition-all duration-200 ${
                isActive
                  ? 'bg-white text-black shadow-sm relative' // Active: White background, Black text, Shadow
                  : 'text-gray-500 hover:text-black hover:bg-white/50' // Inactive: Gray text
              }`}
            >
              {/* Active Indicator Line (Optional - shown in some designs) */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-black" />
              )}
              
              <item.icon size={20} strokeWidth={2} />
              {item.label}
            </button>
          );
        })}

        {/* Logout Button */}
        <button className="w-full flex items-center gap-4 px-6 py-4 mt-8 text-sm font-bold text-gray-400 hover:text-red-500 transition-colors tracking-wide uppercase">
          <LogOut size={20} />
          LOGOUT
        </button>
      </nav>
    </aside>
  );
}