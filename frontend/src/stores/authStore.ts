/**
 * BabyGuide PH — Auth Store (Zustand)
 *
 * Manages authentication state: user, tokens, loading, auth actions.
 */

import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

// ── Types ──────────────────────────────────────────────
export type UserRole = 'parent' | 'professional';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Baby {
  id: string;
  name: string;
  dateOfBirth: string; // ISO 8601
  sex: 'male' | 'female';
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  babies: Baby[];
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setTokens: (access: string, refresh: string) => Promise<void>;
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  setBabies: (babies: Baby[]) => void;
  addBaby: (baby: Baby) => void;
  updateBaby: (babyId: string, updates: Partial<Baby>) => void;
  removeBaby: (babyId: string) => void;
  logout: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
}

const ACCESS_TOKEN_KEY = 'babyguide_access_token';
const REFRESH_TOKEN_KEY = 'babyguide_refresh_token';
const SECURE_STORE_TIMEOUT_MS = 2500;

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error('Secure storage timed out')), timeoutMs);
    }),
  ]);
}

function getSecureItem(key: string): Promise<string | null> {
  return withTimeout(SecureStore.getItemAsync(key), SECURE_STORE_TIMEOUT_MS);
}

export const useAuthStore = create<AuthState>((set, _get) => ({
  user: null,
  babies: [],
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,

  setTokens: async (access, refresh) => {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, access);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refresh);
    set({ accessToken: access, refreshToken: refresh, isAuthenticated: true });
  },

  setUser: (user) => set({ user }),

  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),

  setBabies: (babies) => set({ babies }),

  addBaby: (baby) =>
    set((state) => ({ babies: [...state.babies, baby] })),

  updateBaby: (babyId, updates) =>
    set((state) => ({
      babies: state.babies.map((b) =>
        b.id === babyId ? { ...b, ...updates } : b
      ),
    })),

  removeBaby: (babyId) =>
    set((state) => ({
      babies: state.babies.filter((b) => b.id !== babyId),
    })),

  logout: async () => {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    set({
      user: null,
      babies: [],
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },

  loadStoredAuth: async () => {
    try {
      set({ isLoading: true });
      const [access, refresh] = await Promise.all([
        getSecureItem(ACCESS_TOKEN_KEY),
        getSecureItem(REFRESH_TOKEN_KEY),
      ]);

      if (access && refresh) {
        set({
          accessToken: access,
          refreshToken: refresh,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch {
      set({
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
