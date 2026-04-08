import api from './api.js';

export const getAllProducts = async () => {
  try {
    const response = await api.get('/product/products');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return { success: false, products: [] };
  }
};

export const getMyProducts = async () => {
  try {
    const response = await api.get('/product/getMyProducts');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return { success: false, products: [] };
  }
};

export const uploadProduct = async (formData) => {
  try {
    const response = await api.post('/product/upload-product', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Failed to upload product:', error);
    throw error;
  }
};
