import { Product, Variation } from '../../types/product';

export interface ProductDetailsLayoutProps {
  product: Product;
  navigation: any;
  loading: boolean;
  displayImage: string | null;
  selectedOptions: Record<string, string>;
  selectedVariation: Variation | null;
  onSelectOption: (name: string, option: string) => void;
}
