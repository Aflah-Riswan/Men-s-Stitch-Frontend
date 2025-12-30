import axiosInstance from "../utils/axiosInstance"

export const getUserDetails = async () => {
  try {
    const response = await axiosInstance.get('/users/info')
    return response
  } catch (error) {
    console.log(error)
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
export const updateUserDetails = async (data) =>{
  const response = await axiosInstance.put('/users/update-details',data,{
    headers: {
        'Content-Type': 'multipart/form-data'
      }
  })
  return response.data
}

export const updateUserPassword = async (data) =>{
  try {
    const response = await axiosInstance.patch('/users/update/password',data)
    console.log(response)
    return response.data
  } catch (error) {
    
  }
}