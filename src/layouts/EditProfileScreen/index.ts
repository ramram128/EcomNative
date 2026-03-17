import { ACTIVE_LAYOUT, LayoutType } from '../../constants/theme';
// import HomeCrystal from './EditProfileLayout';
import {EditProfileLayoutModern} from './EditProfileLayout';

const EditProfileMap: Record<LayoutType, typeof EditProfileLayoutModern> = {
  crystal: EditProfileLayoutModern,
  modern: EditProfileLayoutModern,
};

export const SelectedEditProfileLayout = EditProfileMap[ACTIVE_LAYOUT];