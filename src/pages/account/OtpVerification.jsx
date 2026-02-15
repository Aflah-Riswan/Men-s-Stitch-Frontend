import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { z } from 'zod';

export default function OtpVerification() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [seconds, setSeconds] = useState(30);
  const inputRefs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Safe check in case state is missing
  const email = location.state?.email || '';

  const otpSchema = z.object({
    otp: z.string().length(6, "OTP must be exactly 6 digits")
  });

  const { handleSubmit, formState: { errors }, setValue, trigger } = useForm({
    resolver: zodResolver(otpSchema), 
    defaultValues: { otp: '' }
  });

  // Timer Logic
  useEffect(() => {
    if (seconds > 0) {
      const timer = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [seconds]);

  // Sync OTP Array with Form
  useEffect(() => {
    const combinedOtp = otp.join('');
    setValue('otp', combinedOtp);
    if (combinedOtp.length === 6) {
      trigger('otp');
    }
  }, [otp, setValue, trigger]);

  // Handle Form Submission
  async function onSubmit(formData) {
    // ... existing submit logic ...
    const data = { email, inputOtp: formData.otp };
    try {
      const response = await authService.verifyOtp(data);
      if (response.data.success) {
        alert("Completed verification");
        navigate(`/reset-password?email=${email}`);
      }
    } catch (error) {
      alert(error || "Invalid OTP");
    }
  }

  // Handle Input Change
  function handleChange(index, value) {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  }

  // --- NEW: Resend Logic ---
  const handleResend = async () => {
    if (seconds > 0) return; // Prevent clicking while timer is active

    try {
      // Call the service that sends the email
      const response = await authService.forgotPassword(email);
      
      if (response.data.success) {
        alert("OTP Resent Successfully!");
        setSeconds(30); // Reset timer
        setOtp(['', '', '', '', '', '']); // Clear inputs
      }
    } catch (error) {
      alert("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans text-gray-900 p-4">
      <div className="bg-white w-full max-w-[450px] rounded-3xl shadow-xl p-10 text-center">
        <form onSubmit={handleSubmit(onSubmit)}>
          
          <h2 className="text-2xl font-bold mb-4 tracking-tight">Enter the OTP</h2>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed">
            We’ve sent an email with an activation code to <br />
            <span className="font-semibold text-gray-900">{email}</span>
          </p>

          {/* OTP Inputs */}
          <div className="flex justify-center gap-3 mb-6">
            {otp.map((value, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={value}
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-12 h-14 border border-gray-300 rounded-xl text-center text-xl font-medium focus:border-black focus:ring-1 focus:ring-black outline-none transition caret-black"
                onChange={(e) => handleChange(index, e.target.value)}
              />
            ))}
          </div>
          {errors.otp && <p className="text-red-500 text-sm mb-4">{errors.otp.message}</p>}

          {/* Timer Display */}
          <p className="text-xs text-gray-500 mb-2">
            Time remaining: <span className={`font-medium ${seconds < 10 ? 'text-red-600' : 'text-gray-900'}`}>
              00:{seconds < 10 ? `0${seconds}` : seconds}
            </span>
          </p>

          {/* Resend Button Section */}
          <div className="text-xs text-gray-500 mb-8">
            I didn’t receive a code{' '}
            <button
              type="button" // Important: preventing form submission
              onClick={handleResend}
              disabled={seconds > 0} // Disable button if timer is running
              className={`font-bold transition ${
                seconds > 0 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-900 underline hover:no-underline'
              }`}
            >
              Resend
            </button>
          </div>

          <button type="submit" className="w-full bg-black text-white rounded-xl py-4 text-sm font-semibold hover:bg-gray-800 transition shadow-lg active:scale-[0.98]">
            Verify
          </button>
        </form>
      </div>
    </div>
  );
}