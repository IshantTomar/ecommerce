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

export const deleteProduct = async (productId) => {
  try {
    const response = await api.delete(`/product/delete-product/${productId}`);
    return response.data; // optional, in case backend returns success message
  } catch (error) {
    console.error('Failed to delete product:', error);
    throw error;
  }
};
