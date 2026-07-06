import { create } from 'zustand';
import { api } from '../lib/api';

interface NotificationState {
  unreadCount: number;
  fetchUnreadCount: () => Promise<void>;
  decrementCount: () => void;
  resetCount: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  unreadCount: 0,

  fetchUnreadCount: async () => {
    try {
      const data = await api.get<{ count: number }>('/notifications/unread-count');
      set({ unreadCount: data.count });
    } catch {
      // silently fail
    }
  },

  decrementCount: () =>
    set((state) => ({ unreadCount: Math.max(0, state.unreadCount - 1) })),

  resetCount: () => set({ unreadCount: 0 }),
}));
