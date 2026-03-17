import { ACTIVE_LAYOUT, LayoutType } from '../../constants/theme';
// import HomeCrystal from './EditProfileLayout';
import {CustomerCareLayout} from './CustomerCareLayout';

const CustomerCareMap: Record<LayoutType, typeof CustomerCareLayout> = {
  crystal: CustomerCareLayout,
  modern: CustomerCareLayout,
};

export const SelectedCustomerCareLayout = CustomerCareMap[ACTIVE_LAYOUT];