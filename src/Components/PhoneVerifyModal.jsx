
import { useEffect, useState } from 'react';
import { X, Phone, ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { PhoneValidation } from '../utils/PhoneValidation';
import { useForm } from 'react-hook-form';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../../firebase';
import * as userService from '../services/userService'

console.log("auth:", auth);

const PhoneVerifyModal = ({ isOpen, onClose , onSuccess }) => {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch, trigger, setError , clearErrors } = useForm({ resolver: zodResolver(PhoneValidation) })
  const phoneValue = watch('phone')

useEffect(() => {
    if (isOpen) {
      // 1. Initialize Recaptcha
      if (!window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible',
            'callback': (response) => {
              console.log('Recaptcha verified');
            },
            'expired-callback': () => {
              console.log('Recaptcha expired');
            }
          });
        } catch (err) {
          console.error("Recaptcha Init Error", err);
        }
      }
    }

    // 2. Cleanup when modal closes (CRITICAL FIX)
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, [isOpen]);

if (!isOpen) return null;

  const handleSendOtp = async (data) => {
    try {
      const isValid = await trigger('phone')
      if (!isValid) {
        return setError('phone', { type: 'custom', message: 'enter a valid phone number' })
      }
      const fullNumber = '+91' + phoneValue
      const appVerifier = window.recaptchaVerifier
      setLoading(true)
      const confirmationResult = await signInWithPhoneNumber(auth, fullNumber, appVerifier)
      window.confirmationResult = confirmationResult
      setLoading(false)
      alert('otp sent to your phone number')
      setStep(2);
      console.log("phone number : ", phoneValue)

    } catch (error) {
      console.log(" error found in  send otp  : ", error)
    }
  }

  const handleVerifyOtp = async (data) => {
    try {
      const isValid = await trigger('otp')
      if (!isValid) return null
      const otp = data.otp
      if (!window.confirmationResult) {
        setError('otp', { type: 'custom', message: 'Session expired. Send OTP again.' })
        return
      }
      setLoading(true)
      const result = await window.confirmationResult.confirm(otp)
      
      clearErrors('otp')
      clearErrors('phone')
      const response = await userService.updatePhoneVerification(phoneValue)
      onSuccess(response)
      onClose()
    } catch (error) {
      console.log(" error found in verify otp : ",error)
    }
  }
  const onErrors = async (err) => {
    console.log(err)
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div id="recaptcha-container"></div>
      {/* 1. Backdrop with Blur */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* 2. Modal Content */}
      <div className="relative bg-white w-full max-w-[400px] rounded-[32px] p-8 shadow-2xl scale-100 animate-in fade-in zoom-in-95 duration-200">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
        >
          <X size={20} />
        </button>

        {/* --- HEADER SECTION --- */}
        <div className="text-center mb-8 mt-2">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-colors duration-300 ${step === 1 ? 'bg-black/5' : 'bg-green-50'}`}>
            {step === 1 ? (
              <Phone className="w-7 h-7 text-gray-900" strokeWidth={1.5} />
            ) : (
              <ShieldCheck className="w-7 h-7 text-green-600" strokeWidth={1.5} />
            )}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            {step === 1 ? "Add Phone Number" : "Verify OTP"}
          </h2>
          <p className="text-[13px] text-gray-500 font-medium mt-2 leading-relaxed px-4">
            {step === 1
              ? "We need your phone number to secure your account and update you on orders."
              : `Enter the 6-digit code sent to +91 ${phoneValue}`
            }
          </p>
        </div>

        {/* --- STEP 1: PHONE INPUT --- */}
        {step === 1 && (
          <form className="space-y-5">
            <div className="space-y-1.5 text-left">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Mobile Number</label>
              <div className="relative group">
                {/* Country Code Prefix */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-gray-200 pr-3">
                  <span className="text-sm font-semibold text-gray-900">🇮🇳 +91</span>
                </div>

                {/* Input Field */}
                <input
                  type="tel"
                  placeholder="00000 00000"
                  {...register('phone')}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-base font-medium rounded-xl pl-[5.5rem] pr-4 py-3.5 focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-all placeholder:text-gray-300"
                  required
                />
              </div>
            </div>
            {errors.phone && <span className="text-sm text-red-500 ml-1">{errors.phone.message}</span>}
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-black text-white rounded-xl py-4 font-semibold text-sm hover:bg-gray-900 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-black/10 flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Verification Code"}
            </button>
          </form>
        )}

        {/* --- STEP 2: OTP INPUT --- */}
        {step === 2 && (
          <form onSubmit={handleSubmit(handleVerifyOtp)} className="space-y-6">
            <div className="space-y-1.5 text-left">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">One Time Password</label>
              <input
                type="text"
                placeholder="• • • • • •"
                maxLength={6}
                {...register('otp')}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-2xl font-bold tracking-[0.5em] text-center rounded-xl py-3.5 focus:outline-none focus:bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all placeholder:text-gray-300 placeholder:tracking-widest"
                autoFocus
                required
              />
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white rounded-xl py-4 font-semibold text-sm hover:bg-green-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-600/20 flex justify-center items-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Continue"}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full py-3 text-xs font-semibold text-gray-500 hover:text-black transition-colors flex items-center justify-center gap-1.5"
              >
                <ArrowLeft size={14} /> Change phone number
              </button>
            </div>

            {/* Resend Timer Text */}
            <p className="text-center text-xs text-gray-400">
              Didn't receive code? <button type="button" className="text-black font-semibold hover:underline">Resend</button>
            </p>
          </form>
        )}

      </div>
    </div>
  );
};

export default PhoneVerifyModal;