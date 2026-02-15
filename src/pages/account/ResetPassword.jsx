import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';
import authService from '../../services/authService';

// 1. Define the Zod Schema outside the component to prevent recreation on renders
const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-zA-Z]/, "Must contain alphabets")
    .regex(/[0-9]/, "Must contain numbers")
    .regex(/[^a-zA-Z0-9]/, "Must contain special characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"], // This ensures the error shows on the confirmPassword field
});

export default function ResetPassword() {
  const navigate = useNavigate();
  
  // 2. Get the email securely from the URL parameters
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email"); 

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(resetPasswordSchema)
  });

  const onSubmit = async (formData) => {
    // 3. Safety Check: Ensure we actually have the email
    if (!email) {
      alert("Error: Email is missing. Please restart the 'Forgot Password' process.");
      navigate('/forgot-password'); 
      return;
    }

    const data = {
      email: email, 
      password: formData.password
    };

    try {
      console.log("Submitting Password Reset for:", email);
      const response = await authService.resetPassword(data);
      
      if (response.data.success) {
        alert("Password updated successfully!");
        navigate('/login');
      } else {
        alert(response.data.message || "Failed to update password.");
      }
    } catch (error) {
      console.error("Reset Password Error:", error);
      alert(error?.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl">

        {/* Header */}
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            Reset Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please create a strong password for your account associated with 
            <br/>
            <span className="font-semibold text-gray-800">{email || "your email"}</span>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">

            {/* New Password Field */}
            <div className="relative">
              <label htmlFor="password" class="sr-only">New Password</label>
              <input
                id="password"
                type={showPass ? "text" : "password"}
                placeholder="Enter new Password"
                className="appearance-none relative block w-full px-4 py-4 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm transition"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && <p className="text-red-500 text-sm mt-1 ml-1">{errors.password.message}</p>}
            </div>

            <p className="text-xs text-gray-500 px-1 leading-relaxed">
              Password must contain at least 8 characters, including alphabets, numbers, and special characters.
            </p>

            {/* Confirm Password Field */}
            <div className="relative">
              <label htmlFor="confirmPassword" class="sr-only">Confirm Password</label>
              <input
                id="confirmPassword"
                type={showConfirmPass ? "text" : "password"}
                placeholder="Confirm new password"
                className="appearance-none relative block w-full px-4 py-4 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm transition"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1 ml-1">{errors.confirmPassword.message}</p>}
            </div>

          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-full text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Updating..." : "Confirm Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}