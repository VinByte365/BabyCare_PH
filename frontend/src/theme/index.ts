/**
 * BabyGuide PH — Theme Provider & Hook
 *
 * Provides light/dark mode theming via React context.
 * Supports automatic system theme detection + manual override.
 */

import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { lightColors, darkColors, type ThemeColors } from './colors';
import { typography } from './typography';
import { spacing, radii, shadows, durations, hitSlop, MIN_TAP_SIZE } from './spacing';

// ── Types ──────────────────────────────────────────────
export type ThemeMode = 'light' | 'dark' | 'system';

export interface Theme {
  mode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  typography: typeof typography;
  spacing: typeof spacing;
  radii: typeof radii;
  shadows: typeof shadows;
  durations: typeof durations;
  hitSlop: typeof hitSlop;
  MIN_TAP_SIZE: number;
}

interface ThemeContextValue {
  theme: Theme;
  setThemeMode: (mode: ThemeMode) => void;
}

const THEME_STORAGE_KEY = '@babyguide_theme_mode';

// ── Context ────────────────────────────────────────────
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// ── Provider ───────────────────────────────────────────
interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemScheme = useSystemColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

  // Load persisted preference on mount
  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (isMounted && (stored === 'light' || stored === 'dark' || stored === 'system')) {
          setThemeModeState(stored);
        }
      } catch {
        // Ignore — default to system
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      // Silently fail — non-critical
    }
  };

  const resolvedDark =
    themeMode === 'system'
      ? systemScheme === 'dark'
      : themeMode === 'dark';

  const theme = useMemo<Theme>(
    () => ({
      mode: themeMode,
      isDark: resolvedDark,
      colors: resolvedDark ? darkColors : lightColors,
      typography,
      spacing,
      radii,
      shadows,
      durations,
      hitSlop,
      MIN_TAP_SIZE,
    }),
    [themeMode, resolvedDark],
  );

  const value = useMemo(() => ({ theme, setThemeMode }), [theme]);

  return React.createElement(ThemeContext.Provider, { value }, children);
}

// ── Hook ───────────────────────────────────────────────
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a <ThemeProvider>');
  }
  return ctx;
}

// Re-exports for convenience
export { lightColors, darkColors, palette } from './colors';
export { typography, fontFamilies } from './typography';
export { spacing, radii, shadows, durations, hitSlop, MIN_TAP_SIZE } from './spacing';
export type { ThemeColors } from './colors';
export type { TypographyVariant, FontFamily } from './typography';
