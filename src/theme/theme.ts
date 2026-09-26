export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'omar-theme';
export const THEME_PREFERENCES: ThemePreference[] = ['light', 'dark', 'system'];

export function isPreference(value: unknown): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system';
}

/**
 * Runs synchronously in <head>, before first paint, so the correct theme is
 * applied without a flash — this also works on static hosting because it
 * needs no server. It mirrors `applyTheme()` below; keep them in sync.
 */
export const themeInitScript = `(function(){var d=document.documentElement,p='system';try{p=localStorage.getItem('${THEME_STORAGE_KEY}')||'system'}catch(e){}if(p!=='light'&&p!=='dark')p='system';var r=p==='system'?(window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):p;d.dataset.theme=r;d.dataset.themePref=p;d.style.colorScheme=r})();`;

export function systemTheme(): ResolvedTheme {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function resolve(preference: ThemePreference): ResolvedTheme {
  return preference === 'system' ? systemTheme() : preference;
}

export function applyTheme(preference: ThemePreference) {
  const root = document.documentElement;
  const resolved = resolve(preference);
  root.dataset.theme = resolved;
  root.dataset.themePref = preference;
  root.style.colorScheme = resolved;
  return resolved;
}
