import AuthLayoutModern from './AuthLayoutModern';

import { ACTIVE_LAYOUT } from '../../constants/theme';

const AuthLayoutMap = {
  crystal: AuthLayoutModern,
  modern: AuthLayoutModern,
};

export const SelectedAuthLayout = AuthLayoutMap[ACTIVE_LAYOUT];

// Re-export types from the layout component
export type { AuthLayoutProps } from './AuthLayoutModern';