import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { signupSchema } from '../../utils/signupSchema';
import axiosInstance from '../../utils/axiosInstance';
import authService from '../../services/authService';

export default function OtpVerification() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [seconds, setSeconds] = useState(30)
  const inputRefs = useRef([])
  const location = useLocation()
  const navigate = useNavigate()
  const { email } = location.state

  const otpSchema = signupSchema.pick({ otp: true })
  const { handleSubmit, formState: { errors }, setValue, trigger } = useForm({
    resolver: zodResolver(otpSchema), defaultValues: {
      otp: ''
    }
  })

  useEffect(() => {
    if (seconds > 0) {
      const timer = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [seconds])

  useEffect(() => {
    const combinedOtp = otp.join('')
    setValue('otp', combinedOtp)
    if (otp.length === 6) {
      trigger('otp')
    }
  }, [otp, setValue, trigger])

  async function onSubmit(formData) {
    const data = {
      email,
      inputOtp: formData.otp
    }
    const response = await authService.verifyOtp(data)
    console.log(response)
    if (response.data.success) {
      alert("completed verification")
      navigate('/reset-password', {
        state: {
          data: {
            email: email,       
            otp: formData.otp  
          }
        }
      })
    } else {
      alert("something went to wrong")
    }
  }

  function handleChange(index, value) {
    if (isNaN(value)) return;
    console.log(index)
    const newOtp = [...otp]
    console.log(newOtp)
    newOtp[index] = value
    if (value && index < 5) {
      inputRefs.current[index + 1].focus()
    }
    setOtp([...newOtp])
  }
  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans text-gray-900 p-4">


      <div className="bg-white w-full max-w-[450px] rounded-3xl shadow-xl p-10 text-center">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Header Content */}
          <h2 className="text-2xl font-bold mb-4 tracking-tight">Enter the OTP</h2>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed">
            We’ve sent an email with an activation <br />
            code to your email <br />
            <span className="font-semibold text-gray-900">aflah@gmail.com</span>
          </p>

          {/* OTP Input Boxes (Static Layout) */}
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
          {errors.otp && <p style={{ color: 'red' }}>{errors.otp.message}</p>}
          {/* Timer Text */}
          <p className="text-xs text-gray-500 mb-2">
            Send code again <span className="font-medium text-red-900">00:{seconds < 10 ? `0${seconds}` : seconds}</span>
          </p>

          {/* Resend Text */}
          <p className="text-xs text-gray-500 mb-8">
            I didn’t receive a code{' '}
            <button className="font-bold text-gray-900 underline hover:no-underline transition">
              Resend
            </button>
          </p>

          {/* Verify Button */}
          <button className="w-full bg-black text-white rounded-xl py-4 text-sm font-semibold hover:bg-gray-800 transition shadow-lg active:scale-[0.98]">
            Verify
          </button>
        </form>
      </div>
    </div>
  );
}