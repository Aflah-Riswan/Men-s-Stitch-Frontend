import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";
import { City, State } from "country-state-city";

import Footer from "../../../Components/Footer";
import NewsLetter from "../../../Components/NewsLetter";
import UserSidebar from "../../../Components/user-account-components/UserSidebar";
import { addressSchema } from "../../../utils/addressSchema";
import * as addressService from "../../../services/addressService";
import toast from "react-hot-toast";

export const EditAddress = () => {
  const { addressId } = useParams(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const { 
    register, 
    handleSubmit, 
    watch, 
    reset,
    formState: { errors } 
  } = useForm({ 
    resolver: zodResolver(addressSchema),
    defaultValues: {
      country: 'IN', 
      isDefault: false
    }
  });

  const selectedStateCode = watch('state'); 
  
  const states = useMemo(() => State.getStatesOfCountry('IN'), []);
  const cities = useMemo(() => {
    return selectedStateCode ? City.getCitiesOfState('IN', selectedStateCode) : [];
  }, [selectedStateCode])

  useEffect(() => {
    const fetchAddressDetails = async () => {
      try {
        const { data } = await addressService.getAddress();
        
        const addresses = data.addresses || []; 
        
        const addressToEdit = addresses.find(addr => addr._id === addressId);

        if (addressToEdit) {
          const stateObj = State.getStatesOfCountry('IN').find(s => s.name === addressToEdit.state);
          const stateCode = stateObj ? stateObj.isoCode : '';

          reset({
            firstName: addressToEdit.firstName,
            lastName: addressToEdit.lastName,
            phoneNumber: addressToEdit.phoneNumber || addressToEdit.phoneNumber, 
            pincode: addressToEdit.pincode,
            addressLine1: addressToEdit.addressLine1,
            addressLine2: addressToEdit.addressLine2,
            country: 'India',
            state: stateCode,
            city: addressToEdit.city,
            label: addressToEdit.label,
            isDefault: addressToEdit.isDefault,
          });
        }
      } catch (error) {
        console.error("Error fetching address:", error);
      } finally {
        setLoading(false);
      }
    };

    if (addressId) fetchAddressDetails();
  }, [addressId, reset]);



  const onSubmit = async (data) => {
    try {
      console.log("clickedf")
      const stateName = State.getStateByCodeAndCountry(data.state, 'IN')?.name;

      const finalData = {
        ...data,
        state: stateName || data.state,
        country: 'India'
      };
      
      await addressService.updateAddress(addressId, finalData);
      toast.success("updated succesfully")
      navigate('/addresses')
    } catch (error) {
      console.error("Failed to update address", error);
    
    }
  };
  const onError = (err)=>{
    console.log(err)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 flex flex-col">

      {/* Main Layout */}
      <div className="flex-grow max-w-7xl mx-auto px-4 md:px-8 py-8 w-full">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">

          {/* Sidebar */}
          <UserSidebar activeTab="Addresses" />

          {/* Right Content Area */}
          <main className="flex-1 min-h-[400px]">
            <div className="w-full max-w-3xl">

              <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Address</h1>

              <form className="space-y-4" onSubmit={handleSubmit(onSubmit , onError)}>

                {/* 1. Names */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-xs font-bold text-gray-700 mb-1 uppercase">
                      FIRST NAME*
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      placeholder="First Name"
                      {...register('firstName')}
                      className={`w-full border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-black ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.firstName && <span className="text-red-500 text-xs mt-1 block">{errors.firstName.message}</span>}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-xs font-bold text-gray-700 mb-1 uppercase">
                      LAST NAME*
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      placeholder="Last Name"
                      {...register('lastName')}
                      className={`w-full border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-black ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.lastName && <span className="text-red-500 text-xs mt-1 block">{errors.lastName.message}</span>}
                  </div>
                </div>

                {/* 2. Contact Info & Pin Code */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-xs font-bold text-gray-700 mb-1 uppercase">
                      PHONE NUMBER*
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      placeholder="e.g. 7034109821"
                      {...register('phoneNumber')} 
                      className={`w-full border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-black ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.phone && <span className="text-red-500 text-xs mt-1 block">{errors.phone.message}</span>}
                  </div>
                  <div>
                    <label htmlFor="pincode" className="block text-xs font-bold text-gray-700 mb-1 uppercase">
                      PIN CODE *
                    </label>
                    <input
                      type="text"
                      id="pincode"
                      placeholder="e.g. 682304"
                      {...register('pincode')} 
                      className={`w-full border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-black ${errors.pincode ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.pincode && <span className="text-red-500 text-xs mt-1 block">{errors.pincode.message}</span>}
                  </div>
                </div>

                {/* 3. Address Lines */}
                <div>
                  <label htmlFor="addressLine1" className="block text-xs font-bold text-gray-700 mb-1 uppercase">
                    ADDRESS LINE 1*
                  </label>
                  <textarea
                    id="addressLine1"
                    rows="3"
                    placeholder="House No, Building Name, Street"
                    {...register('addressLine1')}
                    className={`w-full border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-black resize-none ${errors.addressLine1 ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.addressLine1 && <span className="text-red-500 text-xs mt-1 block">{errors.addressLine1.message}</span>}
                </div>

                <div>
                  <label htmlFor="addressLine2" className="block text-xs font-bold text-gray-700 mb-1 uppercase">
                    ADDRESS LINE 2
                  </label>
                  <textarea
                    id="addressLine2"
                    rows="2"
                    placeholder="Area, Landmark (Optional)"
                    {...register('addressLine2')}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-black resize-none"
                  />
                </div>

                {/* 4. Location Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Country */}
                  <div>
                    <label htmlFor="country" className="block text-xs font-bold text-gray-700 mb-1 uppercase">
                      COUNTRY
                    </label>
                    <input
                      type="text"
                      id="country"
                      readOnly
                      value="India"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-gray-50 cursor-not-allowed focus:outline-none"
                    />
                    <input type="hidden" {...register('country')} />
                  </div>

                  {/* State */}
                  <div>
                    <label htmlFor="state" className="block text-xs font-bold text-gray-700 mb-1 uppercase">
                      STATE*
                    </label>
                    <div className="relative">
                      <select
                        id="state"
                        {...register('state')}
                        className={`w-full border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-black appearance-none bg-white ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                      >
                        <option value="">Select State</option>
                        {states.map((state) => (
                          <option key={state.isoCode} value={state.isoCode}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                    {errors.state && <span className="text-red-500 text-xs mt-1 block">{errors.state.message}</span>}
                  </div>

                  {/* City */}
                  <div>
                    <label htmlFor="city" className="block text-xs font-bold text-gray-700 mb-1 uppercase">
                      CITY*
                    </label>
                    <div className="relative">
                      <select
                        id="city"
                        {...register('city')}
                        disabled={!selectedStateCode}
                        className={`w-full border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-black appearance-none bg-white 
                          ${errors.city ? 'border-red-500' : 'border-gray-300'}
                          ${!selectedStateCode ? 'bg-gray-100 cursor-not-allowed' : ''}
                        `}
                      >
                        <option value="">Select City</option>
                        {cities.map((city) => (
                          <option key={city.name} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                    {errors.city && <span className="text-red-500 text-xs mt-1 block">{errors.city.message}</span>}
                  </div>
                </div>

                {/* 5. Settings & Save */}
                <div className="pt-6 mt-6 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="addressName" className="block text-xs font-bold text-gray-700 mb-1 uppercase">
                        ADDRESS NAME
                      </label>
                      <input
                        type="text"
                        id="addressName"
                        placeholder="e.g. Home, Work"
                        {...register('label')}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>
                  </div>

                  <div className="flex items-center mb-6">
                    <input
                      type="checkbox"
                      id="setAsDefault"
                      className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                      {...register('isDefault')}
                    />
                    <label htmlFor="setAsDefault" className="ml-2 block text-xs font-bold text-gray-700 cursor-pointer">
                      Set as default address
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-black text-white font-bold py-3 rounded-md text-sm hover:bg-gray-800 transition-colors shadow-lg"
                  >
                    Update Address
                  </button>
                </div>

              </form>
            </div>
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
};