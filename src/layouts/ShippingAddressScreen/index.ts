import ShippingAddressLayoutModern from './ShippingAddressLayoutModern';

import { ACTIVE_LAYOUT } from '../../constants/theme';

const ShippingAddressLayoutMap = {
  crystal: ShippingAddressLayoutModern,
  modern: ShippingAddressLayoutModern,
};

export const SelectedShippingAddressLayout = ShippingAddressLayoutMap[ACTIVE_LAYOUT];

// Re-export types from the layout component
export type { ShippingAddressData, ShippingAddressLayoutProps } from './ShippingAddressLayoutModern';


