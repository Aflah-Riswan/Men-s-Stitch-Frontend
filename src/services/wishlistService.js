import axiosInstance from "../utils/axiosInstance"

export const addToWishlist = async (data) => {
  try {
    const response = await axiosInstance.post('/wishlist/add', { data });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getWishlist = async () => {
  const response = await axiosInstance.get('/wishlist');
  return response.data;
};

export const removeFromWishlist = async (itemId) => {
  const response = await axiosInstance.delete(`/wishlist/remove/${itemId}`);
  return response.data;
};