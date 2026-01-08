
import axiosInstance from "../utils/axiosInstance";

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
const getCouponById = async (couponId) =>{
  try {
    const { data } = await axiosInstance.get(`coupons/${couponId}/edit`)
    return data
  } catch (error) {
    console.log(error)
  }
}

const updateCoupon = async (couponId , payload) => {
  console.log(" payload : ",payload)
  try {
    await axiosInstance.put(`coupons/${couponId}/edit` , payload)
  } catch (error) {
    console.log(error)
  }
}

const deleteCoupon = async (couponId) =>{
  try {
    await axiosInstance.patch(`coupons/${couponId}/delete`)
  } catch (error) {
    console.log(error)
  }
}

 const getMyCoupons = async () => {
  const response = await axiosInstance.get('/coupons/user-coupons');
  return response.data;
};
export const couponService = {
  addCoupon,
  getCoupons,
  updateisActive ,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  getMyCoupons
}