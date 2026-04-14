import { PALETTES } from './color';

export type LayoutType = 'crystal' | 'modern' | 'glass';
export type ThemeType = keyof typeof PALETTES;

// CHANGE THESE TWO LINES TO TRANSFORM THE APP
export const ACTIVE_LAYOUT: LayoutType = 'modern';
export const ACTIVE_THEME: ThemeType = 'purple';

export const COLORS = PALETTES[ACTIVE_THEME];

export const JOY_COLORS = {
    primary: '#ab3500',
    secondary: '#b81742',
    tertiary: '#ffe173',
    background: '#fff8f6',
    surface: '#ffe9e3',
    text: '#271813',
    outline: '#926f64',
};