import { ACTIVE_LAYOUT } from '../constants/theme';
import HomeCrystal from './home/HomeCrystal';
import HomeModern from './home/HomeModern';
// ✅ Keep these imports as they are
import ProductDetailsLayoutCrystal from './productDetails/ProductDetailsLayoutCrystal';
import ProductDetailsLayoutModern from './productDetails/ProductDetailsLayoutModern';

// Mapping for Home Screen
const HomeMap = {
  crystal: HomeCrystal,
  modern: HomeModern,
};

// Mapping for Details Screen
const DetailsMap = {
  // ✅ FIX: Use the EXACT names from your imports above
  crystal: ProductDetailsLayoutCrystal, 
  modern: ProductDetailsLayoutModern,
};

export const SelectedHomeLayout = HomeMap[ACTIVE_LAYOUT];
export const SelectedDetails = DetailsMap[ACTIVE_LAYOUT];