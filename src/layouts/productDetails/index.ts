import { ACTIVE_LAYOUT, LayoutType } from '../../constants/theme';
import ProductDetailsCrystal from './ProductDetailsLayoutCrystal';
import ProductDetailsModern from './ProductDetailsLayoutModern';
import { ProductDetailsLayoutProps } from './types';

const ProductDetailsMap: Record<LayoutType, React.FC<ProductDetailsLayoutProps>> = {
  crystal: ProductDetailsCrystal,
  modern: ProductDetailsModern,
};

export const SelectedProductDetailsLayout = ProductDetailsMap[ACTIVE_LAYOUT];
