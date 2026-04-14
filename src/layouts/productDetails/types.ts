import { Product, Variation } from '../../types/product';

export interface ProductDetailsLayoutProps {
  product: Product;
  navigation: any;
  loading: boolean;
  displayImage: string | null;
  selectedOptions: Record<string, string>;
  selectedVariation: Variation | null;
  onSelectOption: (name: string, option: string) => void;
  groupedProducts: Product[];
  onExternalPress: () => Promise<void>;
  reviews?: any[];
  relatedProducts?: Product[];
  fullVariations?: Variation[];
  onAddReview?: (rating: number, review: string) => Promise<void>;
  currentUserEmail?: string;
  onUpdateReview?: (reviewId: number, rating: number, review: string) => Promise<void>;
  onDeleteReview?: (reviewId: number) => Promise<void>;
}
