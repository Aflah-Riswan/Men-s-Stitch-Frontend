
import axiosInstance from "../utils/axiosInstance";

const forgotPassword = async (email) => {
  console.log("email : ",email)
  try {
    const response = await axiosInstance.post('/auth/forgot-password', { email });
     console.log("response : ",response)
    return response;
    
  } catch (error) {
    console.log("Error setting up request:", error.message);
    throw error.response?.data?.message || "Something went wrong sending the email";
  }
};

const verifyOtp = async (data) => {
  try {
    const response = await axiosInstance.post('/auth/verify-otp', data);
    return response;
  } catch (error) {
    throw error.response?.data?.message || "Invalid OTP";
  }
};

const resetPassword = async (data) => {
  try {
    const response = await axiosInstance.patch('/auth/reset-password', data);
    return response;
  } catch (error) {
    throw error.response?.data?.message || "Failed to reset password";
  }
};

const signup = async (userData) => {
  try {
    const response = await axiosInstance.post('/auth/signup', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Signup failed. Please try again.";
  }
};



const authService = {
  forgotPassword,
  verifyOtp,
  resetPassword,
  signup,
 
};
export default authService
