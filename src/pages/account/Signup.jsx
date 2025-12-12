import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema } from "../../utils/signupSchema"
import { EyeIcon, EyeOff, X, CheckCircle2 } from "lucide-react" // Added CheckCircle2 for visual flair (optional)
import { useEffect, useState } from "react"
import axiosInstance from "../../utils/axiosInstance"
import { auth } from "../../../firebase"
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth"

export default function Signup() {
  const [visible, setVisible] = useState(false)
  const [showOtp, setShowOtp] = useState(false)
  const [loading ,setLoading] = useState(false)
  const [isOtpVerified, setIsOtpVerified] = useState(false)

  const { register, handleSubmit, formState: { errors },
    trigger, getValues, setError, clearErrors } = useForm({
      resolver: zodResolver(signupSchema),
    })

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container',
        {
          'size': 'invisible',
          'callback': (response) => {
            console.log('recaptcha verified')
          }
        }
      )
    }
  }, [])

  const onSubmit = async (data) => {
    if (!isOtpVerified) {
      setError('otp', { type: 'custom', message: 'Please verify OTP first' })
      setError('phone', { type: 'custom', message: 'verify your phone number' })
      return
    }
    const { firstName ,lastName , phone,email,password,confirmPassword,agreeTerms} = data
    const userData = {
      firstName,
      lastName,
      phone,
      email,
      password,
      confirmPassword,
      agreeTerms
    }

     console.log("data :", userData)
    const response = await axiosInstance.post('/auth/signup',userData)
    if(response.data.success){
      const { data } = response
      localStorage.setItem('accessToken',data.accessToken)
      localStorage.setItem('role',data.role)
       alert("created successfully")
    }else{
      console.log(response.data)
      alert(`${response.data.message}`)
    }
  
  }

  const onError = (error) => {
    if (!isOtpVerified) {
      setError('phone', { type: 'custom', message: 'verify your phone number' })
    }
    console.log(error)
  }

  const handleVerifyNumber = async () => {
    try {
      const isValid = await trigger('phone')
      const phone = getValues('phone')
      const fullNumber = '+91' + phone
      const appVerifier = window.recaptchaVerifier
      if (isValid) {
        setLoading(true)
        const confirmationResult = await signInWithPhoneNumber(auth, fullNumber, appVerifier)
        setLoading(false)
        window.confirmationResult = confirmationResult;
        setShowOtp(true);
        setIsOtpVerified(false);
        alert("OTP sent to your mobile!");
      }
    } catch (error) {
      console.log(error)
      console.error("SMS Error:", error);
      setError('phone', { type: 'custom', message: error.message });
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    }
  }

  const handleVerifyOtp = async () => {
    const otpInput = getValues('otp')
    try {
      if (!window.confirmationResult) {
        setError('otp', { type: 'custom', message: 'Session expired. Send OTP again.' })
        return
      }
      setLoading(true)
      const result = await window.confirmationResult.confirm(otpInput)
      setLoading(false)
      const user = result.user
      console.log(user)
      setIsOtpVerified(true)
      clearErrors('otp')
      clearErrors('phone')
    } catch (error) {
      console.error(error);
      setIsOtpVerified(false);
      setError('otp', { type: 'custom', message: 'Invalid OTP. Try again.' });
    }

  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-500/50 p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-[500px] p-8 relative">

        <div id="recaptcha-container"></div>

        <button className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition">
          <X size={20} className="text-gray-500" />
        </button>

        <div className="flex justify-between items-baseline mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <a href="#" className="text-sm font-medium underline decoration-1 underline-offset-2 hover:text-gray-600">
            log in instead
          </a>
        </div>

        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-5">

          {/* First Name & Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wide">First Name</label>
              <input
                type="text"
                placeholder="First name"
                {...register('firstName', { required: true, minLength: 3, pattern: /^[A-Za-z]+$/ })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black placeholder:text-gray-400"
              />
              {errors.firstName && <span className="text-sm text-red-500 ml-1">{errors.firstName.message}</span>}
            </div>
            <div className="space-y-1">
              <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wide">Last Name</label>
              <input
                type="text"
                placeholder="Last name"
                {...register('lastName')}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black placeholder:text-gray-400"
              />
              {errors.lastName && <span className="text-sm text-red-500 ml-1">{errors.lastName.message}</span>}
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-1">
            <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wide">Phone Number</label>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">+91</span>
                <input
                  type="tel"
                  placeholder="Phone number"
                  {...register('phone')}
                  className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black placeholder:text-gray-400"
                />
              </div>
              <button
                type="button"
                onClick={() => handleVerifyNumber()}
                className="bg-[#1a1a1a] text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-black transition shrink-0"
              >
                {loading ? 'Sending' : 'Send Otp'}
              </button>
            </div>
            {errors.phone && <span className="text-sm text-red-500 ml-1">{errors.phone.message}</span>}
          </div>

          {/* OTP Section with Success Message */}
          {showOtp && (
            <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wide">OTP</label>

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Otp"
                  disabled={isOtpVerified} // Disable input if verified
                  {...register('otp')}
                  className={`flex-1 border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 placeholder:text-gray-400 
                    ${isOtpVerified ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-300 focus:ring-black'}
                  `}
                />

                <button
                  type="button"
                  disabled={isOtpVerified} // Disable button if verified
                  onClick={() => handleVerifyOtp()}
                  className={`px-8 py-3 rounded-lg text-sm font-medium transition shrink-0
                    ${isOtpVerified ? 'bg-green-600 text-white cursor-default' : 'bg-[#1a1a1a] text-white hover:bg-black'}
                  `}
                >
                  {isOtpVerified ? 'Verified' : loading ? 'Verifying..' : 'Verify' }
                </button>
              </div>

              {/* SUCCESS MESSAGE */}
              {isOtpVerified && (
                <p className="text-sm text-green-600 font-medium ml-1 flex items-center gap-1 mt-1">
                  OTP verified successfully
                </p>
              )}

              {/* ERROR MESSAGE */}
              {errors.otp && !isOtpVerified && (
                <span className="text-sm text-red-500 ml-1">{errors.otp.message}</span>
              )}
            </div>
          )}

          {/* Email */}
          <div className="space-y-1">
            <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wide">Email</label>
            <input
              type="email"
              placeholder="Email"
              {...register('email')}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black placeholder:text-gray-400"
            />
            {errors.email && <span className="text-sm text-red-500 ml-1">{errors.email.message}</span>}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wide">Password</label>
            <div className="relative">
              <input
                type={visible ? "text" : "password"}
                placeholder="Password"
                {...register('password')}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setVisible(!visible)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {visible ? <EyeIcon size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            {errors.password && <span className="text-sm text-red-500 ml-1">{errors.password.message}</span>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wide">Confirm Password</label>
            <div className="relative">
              <input
                type={visible ? "text" : "password"}
                placeholder="Confirm password"
                {...register('confirmPassword')}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setVisible(!visible)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {visible ? <EyeIcon size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            {errors.confirmPassword && <span className="text-sm text-red-500 ml-1">{errors.confirmPassword.message}</span>}
          </div>

          {/* Helper Text */}
          <p className="text-[10px] text-gray-600 leading-tight">
            Password must contain at least 8 characters, including alphabets, numbers, and special characters.
          </p>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-3 mt-4">
            <div className="flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                className="w-5 h-5 border-2 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-black/10 text-black accent-black"
                {...register('agreeTerms')}
              />
            </div>
            <label htmlFor="terms" className="text-sm text-gray-600">
              By creating an account, I agree to our <a href="#" className="font-semibold text-gray-900 underline">Terms of use</a> and <a href="#" className="font-semibold text-gray-900 underline">Privacy Policy</a>
            </label>
            {errors.agreeTerms && <span className="text-sm text-red-500 ml-1">{errors.agreeTerms.message}</span>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#0f0f0f] text-white rounded-xl py-4 text-lg font-medium hover:bg-black transition-colors mt-4"
          >
            Create an account
          </button>
        </form>
      </div>
    </div>
  )
}