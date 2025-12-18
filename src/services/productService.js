import axiosInstance from '../utils/axiosInstance';


const getProductById = async (id) => {
  try {
    const { data } = await axiosInstance.get(`/products/${id}/edit`);
    return data.product;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch product";
  }
};


const updateProduct = async (id, payload) => {
  try {
    const response = await axiosInstance.put(`/products/${id}/edit`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update product";
  }
};

const getHomeProducts = async () => {
  try {
    const response = await axiosInstance.get('/products/products-home');
    return response
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch home products";
  }
};

const getProductsByCategory = async (slug, { page = 1, limit = 10, search, filters = {} }) => {
  try {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);

   
    if (search) params.append('search', search);

    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.sizes && filters.sizes.length > 0) {
      params.append('sizes', filters.sizes.join(','));
    }
    if (filters.attributes) {
      Object.keys(filters.attributes).forEach((key) => {
        const values = filters.attributes[key];
        if (values && values.length > 0) {
          params.append(`attr_${key}`, values.join(','));
        }
      });
    }

    const queryString = params.toString();
    const response = await axiosInstance.get(`/products/category/${slug}?${queryString}`);

    return response; 

  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch category products";
  }
};

const uploadVariantImages = async (imageFiles) => {
  try {
    const formData = new FormData();
    imageFiles.forEach((file) => {
      formData.append('images', file);
    });

    const response = await axiosInstance.post('/upload-multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response
  } catch (error) {
    throw error.response?.data?.message || "Failed to upload variant images";
  }
};

const uploadMultipleImages = async (imageFiles) => {
  const formData = new FormData();
  imageFiles.forEach((file) => {
    formData.append('images', file);
  });

  const response = await axiosInstance.post('/upload-multiple', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response
};

const createProduct = async (productData) => {
  const response = await axiosInstance.post('/products', productData);
  return response.data;
};

const productService = {
  getProductById,
  updateProduct,
  getHomeProducts,
  getProductsByCategory,
  uploadVariantImages,
  uploadMultipleImages,
  createProduct,
};

export default productService;