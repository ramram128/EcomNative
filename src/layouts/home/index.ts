import { ACTIVE_LAYOUT, LayoutType } from '../../constants/theme';
import HomeCrystal from './HomeCrystal';
import HomeModern from './HomeModern';
import { HomeLayoutProps } from './types';

const HomeMap: Record<LayoutType, React.FC<HomeLayoutProps>> = {
  crystal: HomeCrystal,
  modern: HomeModern,
};

export const SelectedHomeLayout = HomeMap[ACTIVE_LAYOUT];