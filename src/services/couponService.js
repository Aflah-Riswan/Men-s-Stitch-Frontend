
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

const getCoupons = async (filters) =>{
  try {
    const { data } = await axiosInstance.get('/coupons', { params : filters } )
    console.log("response : ",data)
    return data.coupons
  } catch (error) {
    console.log(error)
  }
}

const updateisActive = async (couponId) => {
  try {
    await axiosInstance.patch(`coupons/${couponId}/edit`)
  } catch (error) {
    console.log(error)
  }
}

export const couponService = {
  addCoupon,
  getCoupons,
  updateisActive
}