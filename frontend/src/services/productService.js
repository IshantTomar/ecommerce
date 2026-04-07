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
