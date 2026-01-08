import axiosInstance from "../utils/axiosInstance"

export const getMyWallet = async () =>{
  const { data } = await axiosInstance.get('/wallet/details')
  return data
}
export const addMoneyToWallet = async (paymentDetails) =>{
  console.log(" payments : ",paymentDetails)
  const { data } = await axiosInstance.post('wallet/add-money',paymentDetails)
  return data
}