import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { signupSchema } from '../../utils/signupSchema'; // Import your schema
import axiosInstance from '../../utils/axiosInstance'; // Import your axios

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const { email, otp } = location.state?.data || {}
  const resetPasswordSchema = signupSchema
    .pick({ password: true, confirmPassword: true })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(resetPasswordSchema)
  });


  const onSubmit = async (formData) => {

    const data = {
      email,
      password: formData.password
    }
    console.log(data)
    const response = await axiosInstance.patch('/auth/reset-password',data)
    console.log(response)
    if(response.data.success){
      alert("updated succesfully")
      navigate('/login')
    }
    else{ 
      alert("something went wrong")
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl">

        {/* Header */}
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            Enter new Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please create a strong password for your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">

            {/* New Password Field */}
            <div className="relative">
              <label htmlFor="new-password" className="sr-only">New Password</label>
              <input
                type={showPass ? "text" : "password"}
                placeholder="Enter new Password"
                className="appearance-none relative block w-full px-4 py-4 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm transition"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && <p className="text-red-500 text-sm mt-1 ml-1">{errors.password.message}</p>}
            </div>

            <p className="text-sm text-gray-800 px-1 leading-relaxed">
              Password must contain at least 8 characters, including alphabets, numbers, and special characters.
            </p>

            {/* Confirm Password Field */}
            <div className="relative">
              <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
              <input
                type={showConfirmPass ? "text" : "password"}
                placeholder="Confirm new password"
                className="appearance-none relative block w-full px-4 py-4 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm transition"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1 ml-1">{errors.confirmPassword.message}</p>}
            </div>

          </div>

          <div>
            <button
              type="submit"

              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-full text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition disabled:opacity-70"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}