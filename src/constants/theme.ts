import { PALETTES } from './color';

export type LayoutType = 'crystal' | 'modern';
export type ThemeType = keyof typeof PALETTES;

// 🔥 CHANGE THESE TWO LINES TO TRANSFORM THE APP
export const ACTIVE_LAYOUT: LayoutType = 'modern'; 
export const ACTIVE_THEME: ThemeType = 'ocean';

export const COLORS = PALETTES[ACTIVE_THEME];