import axiosInstance from "../utils/axiosInstance"; 


export const getCartItems = async () => {
  return await axiosInstance.get('/cart');
};


export const addToCart = async (data) => {
  return await axiosInstance.post('/cart/add', data);
};


export const updateQuantity = async (itemId, action) => {
  return await axiosInstance.put('/cart/update', { itemId, action });
};


export const removeFromCart = async (itemId) => {
  return await axiosInstance.delete(`/cart/remove/${itemId}`);
};

export const applyCoupon = async (couponCode) => {
  return await axiosInstance.post('/cart/apply-coupon', { couponCode });
};

export const removeCoupon = async () => {
  return await axiosInstance.delete('/cart/remove-coupon'); 
};


export const getCoupons = async () => {
  return await axiosInstance.get('/coupons'); 
};