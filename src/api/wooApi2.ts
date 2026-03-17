import axios from 'axios';
import { Product, Variation } from '../types/product';
import {
  WOO_BASE_URL,
  WOO_CONSUMER_KEY,
  WOO_CONSUMER_SECRET
} from '@env';

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

  getVariations: async (productId: number): Promise<Variation[]> => {
    const res = await api.get(`/products/${productId}/variations`, {
      params: {
        per_page: 100,
      },
    });
    return res.data;
  },
};

export const CustomerService = {
  register: async (customerData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }) => {
    const res = await api.post('/customers', customerData);
    return res.data;
  },

  getCustomer: async (id: number) => {
    const res = await api.get(`/customers/${id}`);
    return res.data;
  },

  updateCustomer: async (id: number, customerData: any) => {
    const res = await api.put(`/customers/${id}`, customerData);
    return res.data;
  },

  deleteCustomer: async (id: number) => {
    const res = await api.delete(`/customers/${id}`);
    return res.data;
  },
};
