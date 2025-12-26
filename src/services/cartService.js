import axiosInstance from "../utils/axiosInstance"; 

// Get Cart
export const getCartItems = async () => {
  return await axiosInstance.get('/cart');
};

// Add To Cart
export const addToCart = async (data) => {
  return await axiosInstance.post('/cart/add', data);
};

// Update Quantity
export const updateQuantity = async (itemId, action) => {
  return await axiosInstance.put('/cart/update', { itemId, action });
};

// Remove Item
export const removeFromCart = async (itemId) => {
  return await axiosInstance.delete(`/cart/remove/${itemId}`);
};

// Apply Coupon
export const applyCoupon = async (couponCode) => {
  return await axiosInstance.post('/cart/apply-coupon', { couponCode });
};

// Remove Coupon
export const removeCoupon = async () => {
  return await axiosInstance.delete('/cart/remove-coupon'); 
};

// Get Available Coupons
export const getCoupons = async () => {
  return await axiosInstance.get('/coupons'); 
};