import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './api';

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

      api.get<{ id: string; item_id: string; item_type: string; title: string | null; created_at: string }[]>('/bookmarks/')
        .then((serverBookmarks) => {
          const merged: Bookmark[] = serverBookmarks.map((b) => ({
            id: b.item_id,
            type: b.item_type as Bookmark['type'],
            title: b.title || '',
            savedAt: b.created_at,
          }));
          set({ bookmarks: merged });
          AsyncStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(merged)).catch(() => {});
        })
        .catch(() => {});
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
    } catch {}

    if (existingIndex >= 0) {
      api.delete(`/bookmarks/${item.id}?item_type=${item.type}`).catch(() => {});
    } else {
      api.post('/bookmarks/', {
        item_id: item.id,
        item_type: item.type,
        title: item.title,
      }).catch(() => {});
    }
  },

  isBookmarked: (id) => {
    return get().bookmarks.some((b) => b.id === id);
  },

  clearBookmarks: async () => {
    set({ bookmarks: [] });
    try {
      await AsyncStorage.removeItem(BOOKMARK_STORAGE_KEY);
    } catch {}
  },
}));
