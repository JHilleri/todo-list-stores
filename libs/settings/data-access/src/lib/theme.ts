export type Theme = 'light' | 'dark' | 'auto';

export const THEMES = {
    light: 'light',
    dark: 'dark',
    auto: undefined,
} as const;
export type ThemeClass = (typeof THEMES)[Theme];

export const THEMES_CLASSES = Object.values(THEMES).filter(
    (themeClass): themeClass is Exclude<ThemeClass, undefined> => themeClass !== undefined
);
