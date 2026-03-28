import React from 'react';
import { ACTIVE_LAYOUT, LayoutType } from '../../constants/theme';
import ProductDetailsCrystal from './ProductDetailsLayoutCrystal';
import ProductDetailsModern from './ProductDetailsLayoutModern';
import ProductDetailsGlass from './ProductDetailsGlass';
import { ProductDetailsLayoutProps } from './types';

const ProductDetailsMap: Record<LayoutType, React.FC<ProductDetailsLayoutProps>> = {
  crystal: ProductDetailsCrystal,
  modern: ProductDetailsModern,
  glass: ProductDetailsGlass,
};

export const SelectedProductDetailsLayout = (props: ProductDetailsLayoutProps) => {
  const Component = ProductDetailsMap[ACTIVE_LAYOUT] || ProductDetailsCrystal;
  return <Component {...props} />;
};
