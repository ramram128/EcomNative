// src/layouts/index.ts
import { ACTIVE_LAYOUT } from 'constants/theme';
import HomeCrystal from './HomeCrystal';
import HomeModern from './HomeModern';

const HomeMap = {
  crystal: HomeCrystal,
  modern: HomeModern,
};

export const SelectedHomeLayout = HomeMap[ACTIVE_LAYOUT];