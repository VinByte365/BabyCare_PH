/**
 * BabyGuide PH — Theme Store (Zustand)
 *
 * Lightweight store for theme-related preferences beyond the ThemeProvider.
 * (ThemeProvider handles the actual mode switching; this store is for
 *  additional UI preferences like reduced motion, font scale, etc.)
 */

import { create } from 'zustand';
import { AccessibilityInfo } from 'react-native';

interface ThemeStoreState {
  /** True if the OS / user has requested reduced motion */
  reduceMotion: boolean;

  // Actions
  checkReduceMotion: () => Promise<void>;
}

export const useThemeStore = create<ThemeStoreState>((set) => ({
  reduceMotion: false,

  checkReduceMotion: async () => {
    try {
      const isEnabled = await AccessibilityInfo.isReduceMotionEnabled();
      set({ reduceMotion: isEnabled });
    } catch {
      set({ reduceMotion: false });
    }
  },
}));
