import React from 'react';
import { ACTIVE_LAYOUT, LayoutType } from '../../constants/theme';
import CartGlass from './CartGlass';
import CartCrystal from './CartCrystal';
import CartModern from './CartModern';
import { CartLayoutProps } from './types';

const CartMap: Record<LayoutType, React.FC<CartLayoutProps>> = {
  crystal: CartCrystal,
  modern: CartGlass,
  glass: CartGlass,
};

export const SelectedCartLayout = CartMap[ACTIVE_LAYOUT];
