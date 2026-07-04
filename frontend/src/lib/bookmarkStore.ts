/**
 * BabyGuide PH — Bookmark Store (Zustand + AsyncStorage)
 *
 * Persists user bookmarks for care guidance articles and disease entries.
 * Used by the Care Guidance detail view and referenced by Profile history.
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BOOKMARK_STORAGE_KEY = '@babyguide_bookmarks';

export interface Bookmark {
  id: string;
  type: 'care_guide' | 'disease';
  title: string;
  savedAt: string;
}

interface BookmarkState {
  bookmarks: Bookmark[];
  isLoading: boolean;
  toggleBookmark: (item: { id: string; type: Bookmark['type']; title: string }) => Promise<void>;
  isBookmarked: (id: string) => boolean;
  loadBookmarks: () => Promise<void>;
  clearBookmarks: () => Promise<void>;
}

export const useBookmarkStore = create<BookmarkState>((set, get) => ({
  bookmarks: [],
  isLoading: true,

  loadBookmarks: async () => {
    try {
      const stored = await AsyncStorage.getItem(BOOKMARK_STORAGE_KEY);
      if (stored) {
        set({ bookmarks: JSON.parse(stored), isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  toggleBookmark: async (item) => {
    const { bookmarks } = get();
    const existingIndex = bookmarks.findIndex((b) => b.id === item.id);

    let updated: Bookmark[];
    if (existingIndex >= 0) {
      updated = bookmarks.filter((b) => b.id !== item.id);
    } else {
      updated = [
        ...bookmarks,
        { id: item.id, type: item.type, title: item.title, savedAt: new Date().toISOString() },
      ];
    }

    set({ bookmarks: updated });
    try {
      await AsyncStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Silently fail — bookmark state is still correct in memory
    }
  },

  isBookmarked: (id) => {
    return get().bookmarks.some((b) => b.id === id);
  },

  clearBookmarks: async () => {
    set({ bookmarks: [] });
    try {
      await AsyncStorage.removeItem(BOOKMARK_STORAGE_KEY);
    } catch {
      // Silently fail
    }
  },
}));
