import { Product } from '../../types/product';

export interface HomeLayoutProps {
  products: Product[];
  onPress: (product: Product) => void;
  refreshing: boolean;
  onRefresh: () => void;
  searchQuery: string;
  setSearchQuery: (text: string) => void;
}
