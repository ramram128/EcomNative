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

  login: async (credentials: { email: string; password: string }) => {
    // WooCommerce doesn't have a direct login endpoint for customers
    // We'll need to use a custom endpoint or JWT authentication
    // For now, we'll search for the customer by email and verify password
    // This is not secure and should be replaced with proper authentication
    try {
      // This is a placeholder - in real implementation, you'd have a proper auth endpoint
      const customers = await api.get('/customers', {
        params: { email: credentials.email, per_page: 1 }
      });
      
      if (customers.data && customers.data.length > 0) {
        const customer = customers.data[0];
        // Note: Password verification should be done server-side
        // This is just for demo purposes
        return customer;
      }
      throw new Error('Invalid credentials');
    } catch {
      throw new Error('Login failed');
    }
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
    const res = await api.delete(`/customers/${id}`, {
      params: {
        force: true, // This is the crucial line
      },
    });
    return res.data;
  },
};

export const OrderService = {
  getUserOrders: async (customerId: number, status?: string) => {
    const params: any = {
      customer: customerId,
      per_page: 20,
    };
    
    // Only add status if it's not 'all' or 'wishlist'
    if (status && status !== 'wishlist' && status !== 'support') {
      params.status = status;
    }

    const res = await api.get('/orders', { params });
    return res.data;
  },
};
