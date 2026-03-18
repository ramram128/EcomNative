import AuthLayoutModern from './AuthLayoutModern';
import AuthLayoutGlass from './AuthLayoutGlass';
import AuthLayoutCrystal from './AuthLayoutCrystal';

const ACTIVE_LAYOUT = 'modern';

const AuthLayoutMap = {
  crystal: AuthLayoutCrystal,
  modern: AuthLayoutGlass,
  glass: AuthLayoutGlass,
};

export const SelectedAuthLayout = AuthLayoutMap[ACTIVE_LAYOUT];

// Re-export types from the layout component
export type { AuthLayoutProps } from './AuthLayoutModern';