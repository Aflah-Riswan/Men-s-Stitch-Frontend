import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { signupSchema } from '../../utils/signupSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import axiosInstance from '../../utils/axiosInstance';

const ForgotPasswordSchema = signupSchema.pick({email:true})
export default function ForgotPassword() {
  const navigate = useNavigate();
  const {register,handleSubmit ,formState:{errors}} = useForm({resolver:zodResolver(ForgotPasswordSchema)})
  
  const onSubmit = async (data) =>{
    console.log(data)
    console.log(data.email)
    const response = await axiosInstance.post('/auth/forgot-password',{email:data.email})
  }
  return (
    // 1. Full Page Container (Centered Content)
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      
      {/* 2. The Card (Centered Box) */}
      <div className="w-full max-w-[450px] bg-white rounded-3xl shadow-xl p-8 md:p-10">
        
        {/* Header Content */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Don't worry! It happens. Please enter the email address associated with your account.
          </p>
        </div>

        {/* The Form */}
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          
          {/* Email Input */}
          <div className="space-y-2 text-left">
            <label htmlFor="email" className="text-[11px] font-bold text-gray-500 uppercase tracking-wide ml-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-800 focus:ring-1 focus:ring-gray-800 transition placeholder:text-gray-400"
              {...register('email')}
            />
            {errors.email && <p style={{color: 'red'}}>{errors.email.message}</p>}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full bg-[#1a1a1a] text-white rounded-xl py-3.5 text-sm font-semibold hover:bg-black transition-transform active:scale-95 shadow-lg shadow-gray-200"
          >
            Send OTP
          </button>

          {/* Back to Login Link */}
          <div className="flex justify-center mt-6">
            <button 
              type="button"
              onClick={() => navigate('/login')} // Adjust route as needed
              className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft size={16} />
              <span>Back to Login</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}