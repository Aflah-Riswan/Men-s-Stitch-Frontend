import axiosInstance from "../utils/axiosInstance";

export const placeOrder = async (orderData) => {
  return await axiosInstance.post('/orders/place-order', orderData);
};

export const getMyOrders = async () => {
  return await axiosInstance.get('/orders/my-orders');
};

export const cancelOrder = async (orderId, reason, itemId) => {
  return await axiosInstance.put(`/orders/${orderId}/cancel`, { reason, itemId });
};

// --- NEW FUNCTION: Return Order ---
export const returnOrder = async (orderId, itemId, reason) => {
  // This matches the route structure we discussed: /api/orders/:orderId/items/:itemId/return
  return await axiosInstance.put(`/orders/${orderId}/items/${itemId}/return`, { reason });
};
// ----------------------------------

export const orderDetails = async (orderId) => {
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

export const getOrderStats = async () => {
  const response = await axiosInstance.get('/orders/stats');
  return response.data;
};

export const getOrderDetails = async (orderId) => {
  console.log("orderId : ", orderId)
  const response = await axiosInstance.get(`orders/admin/${orderId}`)
  return response.data
}

export const updateOrderStatus = async (orderId, status) => {
  const response = await axiosInstance.put(`/orders/update-status/${orderId}`, { status });
  return response.data;
};

export const updateOrderItemStatus = async (orderId, itemId, status) => {
  const response = await axiosInstance.put(`/orders/update-item-status/${orderId}`, { itemId, status });
  return response.data;
};