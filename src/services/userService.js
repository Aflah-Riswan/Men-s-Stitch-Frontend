import axiosInstance from "../utils/axiosInstance"



export const getUserDetails = async () => {
  try {
  
    const response = await axiosInstance.get('/users/info')
    return response
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const uploadUserImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await axiosInstance.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log(response)
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Image upload failed";
  }
};

export const updateUserDetails = async (data) => {
 
  const response = await axiosInstance.put('/users/update-details', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}

export const updateUserPassword = async (data) => {
  try {
   
    const response = await axiosInstance.patch('/users/update/password', data)
    console.log(response)
    return response.data
  } catch (error) {
    console.log(error)
    throw error;
  }
}

export const updatePhoneVerification = async (phone) => {
  try {
    
    const response = await axiosInstance.patch('/users/phone/update', { phone })
    return response.data
  } catch (error) {
    console.log(error)
    throw error;
  }
}



export const getAllUsers = async (page = 1, limit = 10, search = '') => {
  try {
    
    const response = await axiosInstance.get('/admin/users', {
      params: { page, limit, search }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch users";
  }
};

export const blockUser = async (userId, isBlocked) => {
  try {
 
    const response = await axiosInstance.patch(`/admin/users/${userId}/block`, { isBlocked });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update user status";
  }
};

export const getCustomerAnalytics = async () => {
  try {
    const response = await axiosInstance.get('/admin/users/analytics');
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};