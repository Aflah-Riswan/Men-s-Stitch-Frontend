
import axiosInstance from "../utils/axiosInstance";

export const placeOrder = async (orderData) => {
  // orderData = { addressId, paymentMethod }
  return await axiosInstance.post('/orders/place-order', orderData);
};

export const getMyOrders = async () => {
  return await axiosInstance.get('/orders/my-orders');
};

// 3. Cancel an order
export const cancelOrder = async (orderId , reason , itemId) => {
  return await axiosInstance.put(`/orders/${orderId}/cancel`,{reason , itemId});
};
export const orderDetails = async (orderId) =>{
  return await axiosInstance.get(`/orders/${orderId}`)
}
export const getAllOrders = async (page = 1, limit = 10, status = '', search = '') => {
  const response = await axiosInstance.get('/orders', {
    params: {
      page,
      limit,
      status: status === 'All' ? '' : status,
      search
    }
  });
  return response.data;
};

// 2. Get Stats
export const getOrderStats = async () => {
  const response = await axiosInstance.get('/orders/stats');
  return response.data;
};