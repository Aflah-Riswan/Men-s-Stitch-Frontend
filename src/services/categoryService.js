import axiosInstance from '../utils/axiosInstance';

// Public: Get all categories (Used by Shop & Admin List)
const getCategories = async () => {
  try {
    const response = await axiosInstance.get('/categories');
    // console.log("response in service page : ", response.data)
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to load categories";
  }
};

// Admin: Get single category for editing
const getCategoryBySlug = async (slug) => {
  try {
    // 🔄 UPDATED: Points to Admin Router
    const response = await axiosInstance.get(`/admin/categories/${slug}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch category";
  }
};

// Admin: Update existing category
const updateCategory = async (slug, categoryData) => {
  try {
    // 🔄 UPDATED: Points to Admin Router
    const response = await axiosInstance.put(`/admin/categories/${slug}`, categoryData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update category";
  }
};

// Shared: Upload Image (This remains on the public utility route)
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

// Admin: Create new category
const createCategory = async (categoryData) => {
  try {
    // 🔄 UPDATED: Points to Admin Router
    const response = await axiosInstance.post('/admin/categories', categoryData);
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