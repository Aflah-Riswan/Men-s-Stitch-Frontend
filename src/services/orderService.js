import axiosInstance from "../utils/axiosInstance";

// --- USER ACTIONS ---

export const placeOrder = async (orderData) => {
  return await axiosInstance.post('/orders/place-order', orderData);
};

export const getMyOrders = async () => {
  return await axiosInstance.get('/orders/my-orders');
};


export const cancelOrder = async (orderId, reason, itemId) => {
  console.log("itemid : ", itemId);
  return await axiosInstance.put(`/orders/${orderId}/cancel`, { reason, itemId });
};


export const cancelEntireOrder = async (orderId, reason) => {
  
  return await axiosInstance.put(`/orders/${orderId}/cancel`, { reason });
};

export const returnOrder = async (orderId, itemId, reason) => {
  return await axiosInstance.put(`/orders/${orderId}/items/${itemId}/return`, { reason });
};

export const orderDetails = async (orderId) => {
  return await axiosInstance.get(`/orders/${orderId}`);
}


// --- ADMIN ACTIONS ---

export const getAllOrders = async (page = 1, limit = 10, status = '', search = '') => {
  const response = await axiosInstance.get('/admin/orders', {
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
  const response = await axiosInstance.get('/admin/orders/stats');
  return response.data;
};

export const getOrderDetailsAdmin = async (orderId) => {
  const response = await axiosInstance.get(`/admin/orders/${orderId}`);
  return response.data;
}

export const updateOrderStatus = async (orderId, status) => {
  const response = await axiosInstance.put(`/admin/orders/status/${orderId}`, { status });
  return response.data;
};

export const updateOrderItemStatus = async (orderId, itemId, status) => {
  const response = await axiosInstance.put(`/admin/orders/item-status/${orderId}`, { itemId, status });
  console.log(" response : ", response)
  return response.data;
};

export const deleteOrder = async (orderId) => {
  return await axiosInstance.delete(`/orders/${orderId}`);
};