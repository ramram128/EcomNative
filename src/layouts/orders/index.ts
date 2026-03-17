import OrdersLayoutModern from './OrdersLayoutModern';

import { ACTIVE_LAYOUT } from '../../constants/theme';

const OrdersLayoutMap = {
  crystal: OrdersLayoutModern,
  modern: OrdersLayoutModern,
};

export const SelectedOrdersLayout = OrdersLayoutMap[ACTIVE_LAYOUT];