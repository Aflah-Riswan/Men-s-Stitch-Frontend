
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { loginUser, setCredentials } from './redux/slice/authSlice';
import { useEffect, useState } from 'react';
import { EyeClosed, EyeIcon } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google'
import authService from './services/authService';


const Login = () => {

  const { register, handleSubmit, formState: { errors } } = useForm()
  const [reveal, setReveal] = useState(false)
  const { isError, accessToken, } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const onSubmit = async (data) => {
    try {
      const result = await dispatch(loginUser(data))
      console.log(result)
      if (result.payload.role === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/')
      }
    } catch (err) {
      console.log("error found: ", err)
    }

  }
  async function handleSuccess(credentialResponse) {
    console.log("credentialsa :  ", credentialResponse)
    const token = credentialResponse.credential
    const response = await authService.googleLogin(token)
    if (response.success) {
      dispatch(setCredentials({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken
      }))
      if (response.user.role === 'admin') navigate('/admin/dashboard')
      else navigate('/')
    }
  }
  const handleError = (err) => {
    console.log("Login Failed", err);
  };
  return (

   <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">

      <div className="bg-white w-full max-w-[450px] rounded-3xl p-8 relative shadow-xl">

        <button className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4 text-gray-600"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>


        <div className="flex justify-between items-baseline mt-2 mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Sign In</h1>
          <a href="/signup" className="text-sm font-semibold text-gray-800 underline hover:text-black">
            create an account
          </a>
        </div>
        
        {isError && <span className="text-xs text-red-500 block mb-2">{isError}</span>}

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-500 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <span className="text-red-500 text-xs mt-1">Email is required</span>}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-2">
              Password
            </label>

            <div className="relative">
              <input
                type={reveal ? "text" : 'password'}
                placeholder="Password"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-10 text-gray-700 placeholder-gray-500 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition"
                {...register("password", { required: "password is required" })}
              />

              <button
                type="button"
                onClick={() => setReveal(!reveal)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                {reveal ? <EyeIcon size={20} /> : <EyeClosed size={20} />}
              </button>
            </div>

            {errors.password && <span className="text-red-500 text-xs mt-1">Password is required</span>}
          </div>

          {/* Forgot Password Link */}
          <div className="pt-1">
            <a href="/forgot-password" className="text-sm font-bold text-gray-900 underline">
              Forgot Password?
            </a>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-3 mt-6">
            <div className="flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                {...register("agreeTerms", { required: true })}
                className="w-5 h-5 bg-gray-900 border-gray-900 rounded text-gray-900 focus:ring-gray-900 focus:ring-offset-0"
              />
            </div>
            <label htmlFor="terms" className="text-sm text-gray-500 leading-tight">
              By creating an account, I agree to our <a href="#" className="text-gray-900 underline font-semibold">Terms of use</a> and <a href="#" className="text-gray-900 underline font-semibold">Privacy Policy</a>
            </label>
          </div>
          {errors.agreeTerms && <span className="text-red-500 text-xs">You can't login without accepting terms</span>}
          
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#C6C6C6] hover:bg-gray-400 text-white font-semibold text-lg py-4 rounded-full mt-6 transition duration-200 shadow-sm"
          >
            Go To Store
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
        {/* --- DIVIDER END --- */}

        {/* --- GOOGLE BUTTON START --- */}
        <div className="flex justify-center w-full">
           <GoogleLogin 
             onSuccess={handleSuccess} 
             onError={handleError} 
             theme="outline"
             shape="pill"
             width="100%"
           />
        </div>
        {/* --- GOOGLE BUTTON END --- */}

      </div>
    </div>
  );
};

export default Login;