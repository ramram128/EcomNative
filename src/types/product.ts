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
  variation: boolean; // If true, this attribute is used for variations
  visible: boolean;
}

// Product
export interface Product {
  id: number;
  name: string;
  slug: string;
  // Updated type to include all 4 core types
  type: 'simple' | 'variable' | 'grouped' | 'external';
  status: 'publish' | 'draft' | 'pending' | 'private';
  featured: boolean;
  catalog_visibility: 'visible' | 'catalog' | 'search' | 'hidden';
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  purchasable: boolean;

  // Stock Management
  manage_stock: boolean;
  stock_quantity: number | null;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';

  // External Product Fields
  external_url?: string;
  button_text?: string;

  // Grouped Product Fields
  grouped_products?: number[]; // Array of IDs for child products

  categories: { id: number; name: string; slug: string }[];
  tags: { id: number; name: string; slug: string }[];
  images: WooImage[];
  attributes: ProductAttribute[];
  variations?: Variation[];
  average_rating: string;
  rating_count: number;
  related_ids?: number[];
  upsell_ids?: number[];
  cross_sell_ids?: number[];
}

// Variation
export interface Variation {
  id: number;
  date_created: string;
  description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  status: 'publish' | 'private';
  purchasable: boolean;

  // Variation Stock
  manage_stock: boolean;
  stock_quantity: number | null;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';

  image: WooImage;
  // Attributes for this specific variation (e.g., Color: Red, Size: Large)
  attributes: { id: number; name: string; option: string }[];
}