
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