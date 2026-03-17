import { ACTIVE_LAYOUT } from '../constants/theme';
import HomeCrystal from './home/HomeCrystal';
import HomeModern from './home/HomeModern';
// ✅ Keep these imports as they are
import ProductDetailsLayoutCrystal from './productDetails/ProductDetailsLayoutCrystal';
import ProductDetailsLayoutModern from './productDetails/ProductDetailsLayoutModern';
import ProfileScreenModern from './profilescreen/ProfileScreenModern';
import { EditProfileLayoutModern } from './EditProfileScreen/EditProfileLayout';

// Mapping for Home Screen
const HomeMap = {
  crystal: HomeCrystal,
  modern: HomeModern,
};

// Mapping for Details Screen
const DetailsMap = {
  
  crystal: ProductDetailsLayoutCrystal, 
  modern: ProductDetailsLayoutModern,
};

const ProfileScreenLayoutMap = {
  crystal: ProfileScreenModern, 
  modern: ProfileScreenModern,
}

const EditProfileLayoutMap = {
  crystal: EditProfileLayoutModern, 
  modern: EditProfileLayoutModern,
}

export const SelectedHomeLayout = HomeMap[ACTIVE_LAYOUT];
export const SelectedDetails = DetailsMap[ACTIVE_LAYOUT];
export const SelectedProfileScreenLayout = ProfileScreenLayoutMap[ACTIVE_LAYOUT];
export const SelectedEditProfileLayout = EditProfileLayoutMap[ACTIVE_LAYOUT]