import axiosInstance from "../utils/axiosInstance";

export const getSalesReport = async (query) =>{
  const response = await axiosInstance.get(`/sales/report${query}`)
  return response
}