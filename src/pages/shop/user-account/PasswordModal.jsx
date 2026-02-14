import React, { useState } from 'react';
import { X, Loader2, Eye, EyeOff } from 'lucide-react'; 
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as userService from '../../../services/userService';
import { passwordValidation } from '../../../utils/passwordValidation'; 
import toast from 'react-hot-toast';

const PasswordModal = ({currentUser, isOpen, onClose }) => {
  console.log(" hellooo")
 console.log(" emial : ",currentUser)
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  
  const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"), 
    newPassword: passwordValidation, 
    
    confirmPassword: z.string()
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    reset 
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    mode: "onTouched"
  });

  const onSubmit = async (data) => {
    try {
      console.log("Valid Data:", data);
      const response = await userService.updateUserPassword(data);
      console.log(response);
      
      if(response.success){
        toast.success("Password updated successfully");
        reset(); 
        onClose();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update password");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm font-sans">
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none p-1"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-center text-gray-900 mb-5">Login Details</h2>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          
          {/* Email Field */}
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={currentUser.email}
              readOnly
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none cursor-not-allowed"
            />
          </div>

          <hr className="border-gray-100" />

          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Change Password</h3>

            {/* Current Password */}
            <div className="mb-3">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  {...register('currentPassword')}
                  placeholder="Current password"
                  className={`w-full px-3 py-2 pr-10 border rounded-lg text-sm focus:outline-none focus:border-black placeholder-gray-400 ${errors.currentPassword ? 'border-red-500' : 'border-gray-300'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.currentPassword.message}</p>
              )}
            </div>

            {/* New Password */}
            <div className="mb-2">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  {...register('newPassword')}
                  placeholder="New password"
                  className={`w-full px-3 py-2 pr-10 border rounded-lg text-sm focus:outline-none focus:border-black placeholder-gray-400 ${errors.newPassword ? 'border-red-500' : 'border-gray-300'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
               {errors.newPassword && (
                <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.newPassword.message}</p>
              )}
            </div>
            
            <p className="text-[10px] text-gray-400 leading-tight mb-3">
              Must contain at least 8 chars, including uppercase, lowercase, numbers & special chars.
            </p>

            {/* Confirm New Password */}
            <div className="mb-2">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  {...register('confirmPassword')}
                  placeholder="Confirm new password"
                  className={`w-full px-3 py-2 pr-10 border rounded-lg text-sm focus:outline-none focus:border-black placeholder-gray-400 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 rounded-full text-sm transition duration-300 mt-2 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting && <Loader2 className="animate-spin" size={16} />}
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;