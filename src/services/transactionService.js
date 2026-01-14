import axiosInstance from '../utils/axiosInstance'

export const getTransactions = async (params) =>{
  try {
    const response = await axiosInstance.get(`/admin/transactions`,{params})
    return response.data
  } catch (error) {
    
  }
}