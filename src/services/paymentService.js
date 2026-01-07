import axiosInstance from "../utils/axiosInstance"


export const createPayment = async (amount) =>{
  const { data } = await axiosInstance.post('/payment/create-payment',{amount})
  return data
}
export const createOnlinePayment = async(paymentDetails) =>{
  const  { data } = await axiosInstance.post('/payment/place-order-online', paymentDetails) 
  return data
}