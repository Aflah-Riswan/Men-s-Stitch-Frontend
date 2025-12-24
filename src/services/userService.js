import axiosInstance from "../utils/axiosInstance"

export const getUserDetails = async () =>{
  try {
    const response = await axiosInstance.get('/users/info')
    return response
  } catch (error) {
    console.log(error)
  }
}