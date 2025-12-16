
import axiosInstance from '../utils/axiosInstance';

const getFeaturedReviews = async () => {
  try {
    const response = await axiosInstance.get('/reviews/featured');
    return response
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch reviews";
  }
};

const reviewService = {
  getFeaturedReviews
};

export default reviewService;