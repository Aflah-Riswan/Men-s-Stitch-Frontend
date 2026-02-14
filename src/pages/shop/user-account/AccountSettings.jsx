import React, { useEffect, useState } from 'react';
import { Pencil, User as UserIcon } from 'lucide-react';
import UserSidebar from '../../../Components/user-account-components/UserSidebar';
import NewsLetter from '../../../Components/NewsLetter';
import Footer from '../../../Components/Footer';
import PersonalDetailsModal from './PersonalModal';
import * as userService from '../../../services/userService'
import PasswordModal from './PasswordModal';


const AccountSettings = () => {

  const [showPersonalModal, setShowPersonalModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  const [user, setUser] = useState({ firstName: '', lastName: '', profilePic: '', email: '', password: '', phone: '' })
  
  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const { data } = await userService.getUserDetails()
      if (data) {
        setUser({
          firstName: data.firstName,
          lastName: data.lastName,
          profilePic: data.profilePic,
          email: data.email,
          phone: data.phone
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900 flex flex-col">

      {showPersonalModal && <PersonalDetailsModal
        isOpen={showPersonalModal}
        onClose={() => setShowPersonalModal(false)}
        currentUser={user} 
      />}

      {showPasswordModal && <PasswordModal 
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        email={user.email}
      />}


      {/* Main Page Layout (Sidebar + Content) */}
      <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">

          {/* Left Column: Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <UserSidebar />
          </div>

          {/* Right Column: Account Settings Content */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-8 text-black">Account Settings</h1>

            {/* Card 1: Personal Details */}
            <div className="border border-gray-300 rounded-lg p-8 mb-8 relative">
              
              {/* Header with Title and Edit Button */}
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold text-gray-900">Personal Details</h2>
                <button 
                  className="text-gray-500 hover:text-black transition-colors p-1" 
                  onClick={() => setShowPersonalModal(true)}
                >
                  <Pencil size={20} />
                </button>
              </div>

              {/* NEW: Profile Picture Section */}
              <div className="flex items-center mb-6">
                <div className="w-20 h-20 rounded-full border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
                  {user.profilePic ? (
                    <img 
                      src={user.profilePic} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon size={40} className="text-gray-400" />
                  )}
                </div>
              </div>

              {/* User Details Grid */}
              <div className="space-y-3 text-base">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="font-bold text-gray-700 min-w-[100px]">First Name:</span>
                  <span className="text-gray-900 font-medium">{user.lastName}</span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="font-bold text-gray-700 min-w-[100px]">Last Name:</span>
                  <span className="text-gray-900 font-medium">{user.firstName}</span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="font-bold text-gray-700 min-w-[100px]">Phone:</span>
                  <span className="text-gray-900 font-medium">
                    {user.phone ? `+91 ${user.phone}` : 'Not added'}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Email & Password */}
            <div className="border border-gray-300 rounded-lg p-8 mb-8 relative">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold text-gray-900">Email & Password</h2>
                <button 
                  className="text-gray-500 hover:text-black transition-colors p-1" 
                  onClick={() => setShowPasswordModal(true)}
                >
                  <Pencil size={20} />
                </button>
              </div>

              <div className="space-y-3 text-base">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="font-bold text-gray-700 min-w-[100px]">Email:</span>
                  <span className="text-gray-900 font-medium">{user.email}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="font-bold text-gray-700 min-w-[100px]">Password:</span>
                  <span className="text-gray-900 font-black tracking-widest text-xl leading-none pt-1">••••••</span>
                </div>
              </div>
            </div>

            {/* Delete Account Link */}
            <div>
              <button className="text-sm font-medium text-gray-800 underline hover:text-red-600 transition-colors">
                Delete my account
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="w-full bg-[#F0F0F0] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          <NewsLetter />
          <Footer />
        </div>
      </div>

    </div>
  );
};

export default AccountSettings;