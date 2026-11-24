export type FontScale = 'sm' | 'md' | 'lg' | 'xl';

const FONT_SCALE_KEY = 'fb_font_scale_v1';

export const FONT_SCALE_LABELS: Record<FontScale, string> = {
  sm: 'A-',
  md: 'A',
  lg: 'A+',
  xl: 'A++',
};

export function loadStoredFontScale(): FontScale {
  if (typeof window === 'undefined') return 'md';
  const raw = window.localStorage.getItem(FONT_SCALE_KEY);
  return raw === 'sm' || raw === 'lg' || raw === 'xl' ? raw : 'md';
}

export function saveFontScale(scale: FontScale): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(FONT_SCALE_KEY, scale);
}

export function applyFontScale(scale: FontScale): void {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-font-scale', scale);
}
