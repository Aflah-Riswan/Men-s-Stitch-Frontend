import axiosInstance from "../utils/axiosInstance"


export const addToCart = async (cartData)=>{
  try {
    const response = await axiosInstance.post('/cart',cartData)
    return response
  } catch (error) {
    console.log(error)
  }
}
export const getCartItems = async()=>{
  try {
    const response = await axiosInstance.get('/cart')
    return response
  } catch (error) {
    console.log(error)
  }
}