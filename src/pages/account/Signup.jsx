import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema } from "../../utils/signupSchema"
import { EyeIcon, EyeOff, X } from "lucide-react"
import { useEffect, useState } from "react"
import { auth } from "../../../firebase"
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import authService from "../../services/authService"
import { GoogleLogin } from "@react-oauth/google"
import toast from "react-hot-toast"

export default function Signup() {
  const [visible, setVisible] = useState(false)
  const [showOtp, setShowOtp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isOtpVerified, setIsOtpVerified] = useState(false)
  const navigate = useNavigate()

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
    try {
      if (!isOtpVerified) {
        setError('otp', { type: 'custom', message: 'Please verify OTP first' })
        setError('phone', { type: 'custom', message: 'verify your phone number' })
        return
      }
      const { firstName, lastName, phone, email, password, confirmPassword, agreeTerms, referralCode } = data
      const userData = { firstName, lastName, phone, email, password, confirmPassword, agreeTerms, referralCode }

      const response = await authService.signup(userData)
      if (response.data.success) {
        const { data } = response
        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('role', data.role)
        navigate('/login', { replace: true })
      } else {
        alert(`${response.data.message}`)
      }
    } catch (error) {
       toast.error(" error found")
       console.log(error)
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
      console.error("SMS Error:", error);
      setError('phone', { type: 'custom', message: error.message });
      setLoading(false)
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
      setIsOtpVerified(true)
      clearErrors('otp')
      clearErrors('phone')
    } catch (error) {
      setLoading(false)
      setIsOtpVerified(false);
      setError('otp', { type: 'custom', message: 'Invalid OTP. Try again.' });
    }
  }

  async function handleSuccess(credentialResponse) {
    console.log("credentialsa :  ", credentialResponse)
    const token = credentialResponse.credential
    const response = await authService.googleLogin(token)
    if (response.success) {
      navigate('/login')
    }
  }

  const handleError = (err) => {
    console.log("Login Failed", err);
  };

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

        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">

          {/* First Name & Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wide">First Name</label>
              <input
                type="text"
                placeholder="First name"
                {...register('firstName')}
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

          {/* OTP Section */}
          {showOtp && (
            <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wide">OTP</label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Otp"
                  disabled={isOtpVerified}
                  {...register('otp')}
                  className={`flex-1 border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 placeholder:text-gray-400 
                    ${isOtpVerified ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-300 focus:ring-black'}
                  `}
                />
                <button
                  type="button"
                  disabled={isOtpVerified}
                  onClick={() => handleVerifyOtp()}
                  className={`px-8 py-3 rounded-lg text-sm font-medium transition shrink-0
                    ${isOtpVerified ? 'bg-green-600 text-white cursor-default' : 'bg-[#1a1a1a] text-white hover:bg-black'}
                  `}
                >
                  {isOtpVerified ? 'Verified' : loading ? 'Verifying..' : 'Verify'}
                </button>
              </div>
              {isOtpVerified && <p className="text-sm text-green-600 font-medium ml-1 mt-1">OTP verified successfully</p>}
              {errors.otp && !isOtpVerified && <span className="text-sm text-red-500 ml-1">{errors.otp.message}</span>}
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
              <button type="button" onClick={() => setVisible(!visible)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
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
            </div>
            {errors.confirmPassword && <span className="text-sm text-red-500 ml-1">{errors.confirmPassword.message}</span>}
          </div>

          <div className="space-y-1">
            <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wide">
              Referral Code <span className="text-gray-400 font-normal normal-case">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. MEN-8392"
              {...register('referralCode')}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black placeholder:text-gray-400"
            />
          </div>

          {/* Terms */}
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

          <button
            type="submit"
            className="w-full bg-[#0f0f0f] text-white rounded-xl py-4 text-lg font-medium hover:bg-black transition-colors mt-4 shadow-lg shadow-black/10"
          >
            Create an account
          </button>
        </form>

        {/* --- DIVIDER START --- */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-gray-500 font-medium">Or continue with</span>
          </div>
        </div>
        <div className="flex justify-center w-full">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            theme="outline"
            shape="pill"
            width="100%"
          />
        </div>
      </div>
    </div>
  )
}