import axios from 'axios';
import base64 from 'base-64';
import { Product } from '../types/product';
import {
  WOO_BASE_URL,
  WOO_CONSUMER_KEY,
  WOO_CONSUMER_SECRET
} from '@env';

const authHeader = () => {
  const credentials = `${WOO_CONSUMER_KEY}:${WOO_CONSUMER_SECRET}`;
  return `Basic ${base64.encode(credentials)}`;
};

const api = axios.create({
  baseURL: `${WOO_BASE_URL}/wp-json/wc/v3`,
  timeout: 15000,
  params: {
    consumer_key: WOO_CONSUMER_KEY,
    consumer_secret: WOO_CONSUMER_SECRET,
  },
});

export const ProductService = {

  getProducts: async (page: number = 1): Promise<Product[]> => {
    const res = await api.get('/products', {
      params: {
        page,
        per_page: 10,
      },
    });
    return res.data;
  },

  getProductById: async (id: number): Promise<Product> => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },

  getVariations: async (productId: number) => {
    const res = await api.get(`/products/${productId}/variations`, {
      params: {
        per_page: 100,
      },
    });
    return res.data;
  },
};
