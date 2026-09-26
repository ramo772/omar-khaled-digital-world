'use client';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import {
  THEME_STORAGE_KEY,
  applyTheme,
  isPreference,
  type ResolvedTheme,
  type ThemePreference,
} from './theme';

// The <html> data attributes (set by themeInitScript before paint) are the
// single source of truth; React subscribes to them instead of keeping a copy.
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());
let observer: MutationObserver | null = null;

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!observer) {
    observer = new MutationObserver(notify);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-theme-pref'],
    });
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size) {
      observer?.disconnect();
      observer = null;
    }
  };
}

const readPreference = (): ThemePreference => {
  const p = document.documentElement.dataset.themePref;
  return isPreference(p) ? p : 'system';
};
const readResolved = (): ResolvedTheme =>
  document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';

interface ThemeContextValue {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  setPreference: (p: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  preference: 'system',
  resolved: 'light',
  setPreference: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Server snapshot is a fixed default; the client snapshot re-renders right
  // after hydration, so there is never a hydration mismatch.
  const preference = useSyncExternalStore(subscribe, readPreference, () => 'system' as const);
  const resolved = useSyncExternalStore(subscribe, readResolved, () => 'light' as const);

  const setPreference = useCallback((p: ThemePreference) => {
    try {
      if (p === 'system') localStorage.removeItem(THEME_STORAGE_KEY);
      else localStorage.setItem(THEME_STORAGE_KEY, p);
    } catch {
      // Storage can be unavailable (private mode); the choice still applies for this visit.
    }
    const root = document.documentElement;
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!calm) {
      root.classList.add('theme-switching');
      window.setTimeout(() => root.classList.remove('theme-switching'), 450);
    }
    applyTheme(p);
  }, []);

  useEffect(() => {
    // Follow the OS while in "system" mode, and keep other tabs in sync.
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystem = () => {
      if (readPreference() === 'system') applyTheme('system');
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY) applyTheme(isPreference(e.newValue) ? e.newValue : 'system');
    };
    media.addEventListener('change', onSystem);
    window.addEventListener('storage', onStorage);
    return () => {
      media.removeEventListener('change', onSystem);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const value = useMemo(
    () => ({ preference, resolved, setPreference }),
    [preference, resolved, setPreference],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
