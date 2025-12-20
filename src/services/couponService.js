
import axiosInstance from "../utils/axiosInstance.js";

 const addCoupon = async (data) =>{
  try {
    console.log("inside service in frontend")
    const response = await axiosInstance.post('/coupons',data)
    console.log(response)
  } catch (error) {
    console.log("error found : ", error)
  }
}

const getCoupons = async () =>{
  try {
    const response = await axiosInstance.get('/coupons')
    return response . data
  } catch (error) {
    console.log(error)
  }
}

export const couponService = {
  addCoupon,
  getCoupons
}