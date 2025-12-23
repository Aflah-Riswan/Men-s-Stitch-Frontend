
import React from 'react';
import { Plus, Pencil } from 'lucide-react'; // Icons for Add and Edit
import UserSidebar from '../../../Components/user-account-components/UserSidebar';
import NewsLetter from '../../../Components/NewsLetter';
import Footer from '../../../Components/Footer';




const AddressContent = () => {
  // Mock Data
  const addresses = [
    {
      id: 1,
      name: "Aflah Riswan",
      company: "Brototype",
      street: "Edathuruthikaran Holdings, 10/450-2,",
      locality: "Kundanoor, Maradu,",
      city: "ERNAKULAM",
      pincode: "682304",
      state: "Kerala , India",
      type: "Home",
      isDefault: true,
    },
    {
      id: 2,
      name: "Aflah Riswan",
      company: "Brototype",
      street: "Edathuruthikaran Holdings, 10/450-2,",
      locality: "Kundanoor, Maradu,",
      city: "ERNAKULAM",
      pincode: "682304",
      state: "Kerala , India",
      type: "Work",
      isDefault: false,
    },
  ];

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Addresses</h1>

      {/* Add New Address Button */}
      <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 mb-8 transition-colors border-2 border-transparent hover:border-gray-300 border-dashed">
        <Plus size={20} strokeWidth={3} />
        ADD NEW ADDRESS
      </button>

      {/* Address Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div key={addr.id} className="border border-gray-300 rounded-xl p-6 relative bg-white hover:shadow-md transition-shadow">
            
            {/* Edit Icon */}
            <button className="absolute top-6 right-6 text-gray-500 hover:text-black transition-colors">
              <Pencil size={18} />
            </button>

            {/* Address Details */}
            <div className="space-y-1 mb-8">
              <h3 className="font-bold text-gray-900 text-lg mb-2">{addr.name}</h3>
              {addr.company && <p className="text-sm text-gray-600 font-medium">{addr.company}</p>}
              <p className="text-sm text-gray-600">{addr.street}</p>
              <p className="text-sm text-gray-600">{addr.locality}</p>
              <p className="text-sm text-gray-600 font-bold uppercase">{addr.city}</p>
              <p className="text-sm text-gray-600 font-bold">{addr.pincode}</p>
              <p className="text-sm text-gray-600 font-bold">{addr.state}</p>
            </div>

            {/* Badges (Bottom Right) */}
            <div className="flex justify-end items-center gap-3 mt-auto">
               <span className="bg-black text-white text-xs font-bold px-4 py-1.5 rounded-md uppercase">
                 {addr.type}
               </span>
               {addr.isDefault && (
                 <span className="bg-gray-800 text-white text-xs font-bold px-4 py-1.5 rounded-md uppercase">
                   default
                 </span>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 2. MAIN PAGE COMPONENT ---
export default function Address() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 flex flex-col">
      {/* Main Layout */}
      <div className="flex-grow max-w-7xl mx-auto px-4 md:px-8 py-12 w-full">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          
          {/* Sidebar - Highlight 'Addresses' */}
          <UserSidebar activeTab="Addresses" />

          
          <main className="flex-1 min-h-[400px]">
             <AddressContent />
          </main>
        </div>
      </div>

      {/* Footer & Newsletter */}
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