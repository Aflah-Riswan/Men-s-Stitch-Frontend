
import axiosInstance from '../utils/axiosInstance';

const getFeaturedReviews = async () => {
  try {
    const response = await axiosInstance.get('/reviews/featured');
    return response
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch reviews";
  }
};

const postReview = async (orderId , productId , rating , comment) =>{
  try {
    const response = await axiosInstance.post('/reviews',{orderId ,productId , rating , comment})
  } catch (error) {
    console.log(error)
  }
}

const reviewService = {
  getFeaturedReviews,
  postReview
};

export default reviewService;