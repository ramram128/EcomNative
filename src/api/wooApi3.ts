import base64 from 'base-64';
import { Product } from '../types/product';
import {
  WOO_BASE_URL,
  WOO_CONSUMER_KEY,
  WOO_CONSUMER_SECRET
} from '@env';

const auth = `Basic ${base64.encode(`${WOO_CONSUMER_KEY}:${WOO_CONSUMER_SECRET}`)}`;

export const ProductService = {

  getProducts: async (page: number = 1): Promise<Product[]> => {
    console.log(`${WOO_BASE_URL}/wp-json/wc/v3/products?page=${page}&per_page=10`);
    const res = await fetch(WOO_BASE_URL,{
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Basic ${auth}`,
        }
      });
    console.log(res);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    return res.json();
  },


  getProductById: async (id: number): Promise<Product> => {
    const res = await fetch(`${WOO_BASE_URL}/wp-json/wc/v3/products/${id}`, {
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    return res.json();
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
};
