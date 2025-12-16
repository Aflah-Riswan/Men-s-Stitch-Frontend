
import axiosInstance from '../utils/axiosInstance';

const getCategories = async () => {
  try {
    const response = await axiosInstance.get('/categories');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to load categories";
  }
};

const getCategoryBySlug = async (slug) => {
  try {
    const response = await axiosInstance.get(`/categories/${slug}/edit`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch category";
  }
};

const updateCategory = async (slug, categoryData) => {
  try {
    const response = await axiosInstance.put(`categories/${slug}/edit`, categoryData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update category";
  }
};

const uploadImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await axiosInstance.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Image upload failed";
  }
};

const createCategory = async (categoryData) => {
  try {
    const response = await axiosInstance.post('/categories', categoryData);
    return response.data; 
  } catch (error) {
    throw error.response?.data?.message || "Failed to create category";
  }
};

const categoryService = {
  updateCategory,
  getCategoryBySlug,
  uploadImage,
  getCategories,
  createCategory
}

export default categoryService;