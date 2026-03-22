import axios from 'axios';
import { Product, Variation } from '../types/product';
import {
  WOO_BASE_URL,
  WOO_CONSUMER_KEY,
  WOO_CONSUMER_SECRET
} from '@env';
import base64 from 'base-64';


const api = axios.create({
  baseURL: `${WOO_BASE_URL}/wp-json/wc/v3`,
  timeout: 15000,
  params: {
    consumer_key: WOO_CONSUMER_KEY,
    consumer_secret: WOO_CONSUMER_SECRET,
  },
});

const auth = `Basic ${base64.encode(`${WOO_CONSUMER_KEY}:${WOO_CONSUMER_SECRET}`)}`;


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
    const res = await fetch(`${WOO_BASE_URL}/wp-json/wc/v3/products/${productId}/variations?per_page=100`, {
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    return res.json();
  },

  // NEW: Fetch multiple products by ID (Required for Grouped Products)
  getMultipleProducts: async (ids: number[]): Promise<Product[]> => {
    const res = await api.get('/products', {
      params: {
        include: ids.join(','),
      },
    });
    return res.data;
  },

  // NEW: Get Reviews
  getProductReviews: async (productId: number) => {
    try {
      const res = await api.get('/products/reviews', {
        params: {
          product: productId,
          status: 'approved',
          per_page: 20,
        },
      });

      return res.data;
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  getProductsByCategory: async (categoryId: number) => {
    try {
      const res = await api.get('/products', {
        params: {
          category: categoryId,
          per_page: 10,
        },
      });

      return res.data;
    } catch (err) {
      console.error(err);
      return [];
    }
  },



  // NEW: Post a Review
  addReview: async (reviewData: {
    product_id: number;
    review: string;
    reviewer: string;
    reviewer_email: string;
    rating: number;
  }) => {
    const res = await api.post('/products/reviews', reviewData);
    return res.data;
  },

  // Update a Review
  updateReview: async (reviewId: number, reviewData: {
    review: string;
    rating: number;
  }) => {
    const res = await api.put(`/products/reviews/${reviewId}`, reviewData);
    return res.data;
  },

  // Delete a Review
  deleteReview: async (reviewId: number) => {
    const res = await api.delete(`/products/reviews/${reviewId}`, {
      params: { force: true },
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
    try {
      // 1. Get the ID and Token from custom API
      const authRes = await api.post('https://infinitroot.com/wp-json/mobile/v1/login', {
        username: credentials.email,
        password: credentials.password,
      }, { params: {} });

      if (authRes.data.status) {
        const userId = authRes.data.user_id;
        const token = authRes.data.token;

        // 2. Use the ID to get full profile from WooCommerce REST API
        // This uses your existing 'api' instance which has the consumer keys
        const profileRes = await api.get(`/customers/${userId}`);

        // 3. Merge them: Return WooCommerce data + the JWT Token
        return {
          ...profileRes.data,
          token: token // Attach the token so the store can save it
        };
      }
      throw new Error('Invalid credentials');
    } catch (error) {
      throw new Error('Login or Profile fetch failed');
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
