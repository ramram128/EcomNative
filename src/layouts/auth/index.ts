import AuthLayoutModern from './AuthLayoutModern';
import AuthLayoutGlass from './AuthLayoutGlass';
import AuthLayoutCrystal from './AuthLayoutCrystal';
import { ACTIVE_LAYOUT } from '../../constants/theme';


const AuthLayoutMap = {
  crystal: AuthLayoutCrystal,
  modern: AuthLayoutModern,
  glass: AuthLayoutGlass,
};

export const SelectedAuthLayout = AuthLayoutMap[ACTIVE_LAYOUT];

// Re-export types from the layout component
export type { AuthLayoutProps } from './AuthLayoutModern';