import React from 'react';
import {
  User,
  Package,
  Heart,
  MapPin,
  Wallet,
  Percent,
  Settings,
  LogOut,
  Mail
} from 'lucide-react';
import Footer from '../../../Components/Footer';
import NewsLetter from '../../../Components/NewsLetter'; // Ensure path is correct
import UserSidebar from '../../../Components/user-account-components/UserSidebar';

export default function UserInfo() {

  return (
  <div className="min-h-screen bg-white font-sans text-gray-800 flex flex-col">
      <div className="flex-grow max-w-7xl mx-auto px-4 md:px-8 py-12 w-full">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
       
          <UserSidebar activeTab="Account Overview" />

          {/* Right Content Area */}
          <main className="flex-1 min-h-[400px]">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Hello, Aflah</h1>
              <p className="text-sm text-gray-500">Account Overview</p>
            </div>

            <div className="space-y-6">
               <p className="text-sm text-gray-800 font-medium">
                 Member Since: <span className="text-gray-600 font-normal">16 Oct 2023</span>
               </p>
              
            </div>
          </main>
        </div>
      </div>

      {/* 3. Floating Newsletter & Footer */}
      <div className="relative mt-24"> 
        
        {/* Floating Wrapper */}
        <div className="absolute top-0 left-0 right-0 transform -translate-y-1/2 px-4 z-10">
          <div className="max-w-7xl mx-auto">
             <NewsLetter />
          </div>
        </div>

        {/* Footer Container */}
        <div className="bg-gray-100 pt-32 pb-8 px-4 md:px-8">
             <div className="max-w-7xl mx-auto">
                <Footer />
             </div>
        </div>
      </div>

    </div>
  );
}