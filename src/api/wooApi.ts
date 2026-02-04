import axios from 'axios';
import { Product } from '../types/product';

const API_BASE_URL = 'https://woo-store-backend.vercel.app/api';

export const ProductService = {

  getProducts: async (page = 1): Promise<Product[]> => {
    const response = await axios.get(`${API_BASE_URL}/products`, {
      params: {
        page,
        per_page: 10
      }
    });
    return response.data;
  },


  getProductById: async (id: number): Promise<Product> => {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`);
    return response.data;
  },

  getVariations: async (productId: number) => {
    const response = await axios.get(
      `${API_BASE_URL}/products/${productId}/variations`,
      {
        params: {
          per_page: 100   // 🔥 VERY IMPORTANT
        }
      }
    );
    return response.data;
  },
};
