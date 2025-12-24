
import axiosInstance from "../utils/axiosInstance"

export const getAddress = async () => {
  try {
    const response = await axiosInstance.get('/address')
    return response
  } catch (error) {
    console.log(error)
  }
}

export const addNewAddress = async (addr) => {
  try {
    const response = await axiosInstance.post('/address', addr)
    return response
  } catch (error) {
    console.log(response)
  }
}

export const updateAddress = async (addressId , address) => {
  try {
    console.log(" reached inside updateADRES")
   const response = await axiosInstance.put(`/address/${addressId}`,address)
   return response
  } catch (error) {
    console.log(error)
  }
}