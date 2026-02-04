export const LAYOUTS = {
    crystal: 'crystal',
    modern: 'modern',
  } as const;
  
  export type LayoutType = keyof typeof LAYOUTS;
  
  export const ACTIVE_LAYOUT: LayoutType = 'crystal';
  