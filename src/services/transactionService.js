import axiosInstance from '../utils/axiosInstance'

export const getTransactions = async (query) =>{
  try {
    const response = await axiosInstance.get(`/admin/transactions`,{query})
    return response.data
  } catch (error) {
    
  }
}