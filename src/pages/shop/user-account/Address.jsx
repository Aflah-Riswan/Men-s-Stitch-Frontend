
import { useEffect, useState } from 'react';
import { Plus, Pencil, User, MapPin, Phone } from 'lucide-react';
import UserSidebar from '../../../Components/user-account-components/UserSidebar';
import NewsLetter from '../../../Components/NewsLetter';
import Footer from '../../../Components/Footer';
import * as addressService from '../../../services/addressService'
import { useNavigate } from 'react-router-dom';



const AddressContent = () => {
  const [address, setAddress] = useState([])
  const navigate = useNavigate()
  
  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    const { data } = await addressService.getAddress()
    console.log(data.addresses)
    setAddress([...data.addresses])
  }

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">Saved Addresses</h1>

      <button className="w-full group bg-gray-50 hover:bg-white text-gray-500 hover:text-black font-bold py-4 px-4 rounded-xl flex flex-row items-center justify-center gap-3 mb-6 transition-all border-2 border-dashed border-gray-300 hover:border-black" onClick={()=>navigate('add')}>

        <div className="bg-white group-hover:bg-black group-hover:text-white text-gray-400 p-2 rounded-full shadow-sm transition-colors">
          <Plus size={20} strokeWidth={3} />
        </div>
        <span className="tracking-wide text-sm">ADD NEW ADDRESS</span>
      </button>

      {/* Address Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {address.map((addr) => (
          <div
            key={addr._id}
            className={`
              relative flex flex-col justify-between
              /* --- UPDATED: Reduced padding from p-6 to p-4 --- */
              border rounded-xl p-4 transition-all duration-300 group
              bg-white hover:shadow-md
              ${addr.isDefault ? 'border-black ring-1 ring-black shadow-sm' : 'border-gray-200 hover:border-gray-400'}
            `}
          >

            <div className="flex justify-between items-start mb-3 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-2 bg-gray-100 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider text-gray-800">
                  {addr.label}
                </span>
                {addr.isDefault && (
                  <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                    DEFAULT
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors" onClick={() => navigate(`${addr._id}/edit`)}>
                  <Pencil size={14} />
                </button>
              </div>
            </div>

            <div className="space-y-3">

              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div>

                  <h3 className="font-extrabold text-gray-900 text-base leading-tight">
                    {addr.firstName} {addr.lastName}
                  </h3>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-600 leading-tight">
                  <p className="font-medium text-gray-900 line-clamp-1">{addr.addressLine1}</p>
                  {addr.addressLine2 && <p className="line-clamp-1">{addr.addressLine2}</p>}
                  <p className="mt-0.5">
                    {addr.city}, {addr.state} <span className="font-semibold text-gray-900">- {addr.pincode}</span>
                  </p>
                  <p>{addr.country}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <p className="text-sm font-bold text-gray-900 tracking-wide">
                  {addr.phoneNumber}
                </p>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default function Address() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 flex flex-col">

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