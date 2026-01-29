// Product Image
export interface WooImage {
  id: number;
  src: string;
  name: string;
}

// Product Attribute (used by variable products)
export interface ProductAttribute {
  id?: number;
  name: string;
  options: string[];
  variation: boolean;
}

// Product
export interface Product {
  id: number;
  name: string;
  type: 'simple' | 'variable';
  price: string;
  regular_price: string;
  sale_price?: string;
  categories?: { name: string }[]; // Fixes the first red line
  images: WooImage[];
  description: string;
  short_description: string;

  attributes?: ProductAttribute[];
  variations?: Variation[];
}

// Variation
export interface Variation {
  id: number;
  price: string;
  regular_price: string;
  sale_price?: string;
  stock_status: 'instock' | 'outofstock';
  image?: WooImage;
  images?: WooImage[];
  attributes: { name: string; option: string }[];
}
