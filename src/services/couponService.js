import axiosInstance from "../utils/axiosInstance";

const addCoupon = async (data) => {
  try {
    const response = await axiosInstance.post('/admin/coupons', data)
    console.log(response)
    return response.data;
  } catch (error) {
    console.log("error found : ", error)
    throw error;
  }
}

const getCoupons = async (filters) => {
  try {
    
    const { data } = await axiosInstance.get('/admin/coupons', { params: filters })
    console.log("response : ", data)
    return data.coupons
  } catch (error) {
    console.log(error)
    throw error;
  }
}


const updateisActive = async (couponId) => {
  try {
 
    await axiosInstance.patch(`/admin/coupons/${couponId}/status`)
  } catch (error) {
    console.log(error)
    throw error;
  }
}


const getCouponById = async (couponId) => {
  try {
   
    const { data } = await axiosInstance.get(`/admin/coupons/${couponId}`)
    return data
  } catch (error) {
    console.log(error)
    throw error;
  }
}


const updateCoupon = async (couponId, payload) => {
  console.log(" payload : ", payload)
  try {
 
    await axiosInstance.put(`/admin/coupons/${couponId}`, payload)
  } catch (error) {
    console.log(error)
    throw error;
  }
}

const deleteCoupon = async (couponId) => {
  try {

    await axiosInstance.patch(`/admin/coupons/${couponId}/delete`)
  } catch (error) {
    console.log(error)
    throw error;
  }
}

const getMyCoupons = async () => {
  const response = await axiosInstance.get('/coupons/user-coupons');
  return response.data;
};

export const couponService = {
  addCoupon,
  getCoupons,
  updateisActive,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  getMyCoupons
}