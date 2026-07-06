/**
 * BabyGuide PH — Auth Store (Zustand)
 *
 * Manages authentication state: user, tokens, loading, auth actions.
 */

import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { api } from '../lib/api';
import { API_BASE_URL } from '../lib/apiConfig';

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
  dateOfBirth: string;
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

  setTokens: (access: string, refresh: string) => Promise<void>;
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  setBabies: (babies: Baby[]) => void;
  addBaby: (baby: Baby) => void;
  updateBaby: (babyId: string, updates: Partial<Baby>) => void;
  removeBaby: (babyId: string) => void;
  logout: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
  loadUserProfile: () => Promise<void>;
  fetchBabies: () => Promise<void>;
  refreshAccessToken: () => Promise<string | null>;
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

const BASE_URL = API_BASE_URL;

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
    const state = _get();
    const token = state.refreshToken;

    // Best-effort backend logout
    if (token) {
      try {
        await fetch(`${BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: token }),
        });
      } catch {
        // Ignore network errors
      }
    }

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

        // Validate session — try profile, refresh on 401
        try {
          await _get().loadUserProfile();
        } catch {
          const newAccess = await _get().refreshAccessToken();
          if (newAccess) {
            try {
              await _get().loadUserProfile();
            } catch {
              await _get().logout();
            }
          } else {
            await _get().logout();
          }
        }
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

  loadUserProfile: async () => {
    const userData = await api.get<{
      id: string;
      email: string;
      first_name: string;
      last_name: string;
      role: string;
      is_active: boolean;
      created_at: string;
    }>('/auth/me');
    set({
      user: {
        id: userData.id,
        email: userData.email,
        firstName: userData.first_name,
        lastName: userData.last_name,
        role: userData.role as UserRole,
      },
    });
  },

  refreshAccessToken: async () => {
    const state = _get();
    const token = state.refreshToken;
    if (!token) return null;

    try {
      const response = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: token }),
      });

      if (!response.ok) return null;

      const data = await response.json();
      await _get().setTokens(data.access_token, data.refresh_token);
      return data.access_token;
    } catch {
      return null;
    }
  },

  fetchBabies: async () => {
    try {
      const babyData = await api.get<Array<{
        id: string;
        name: string;
        date_of_birth: string;
        sex: string;
        parent_id: string;
        created_at: string;
      }>>('/babies');
      set({
        babies: babyData.map((b) => ({
          id: b.id,
          name: b.name,
          dateOfBirth: b.date_of_birth,
          sex: b.sex as 'male' | 'female',
        })),
      });
    } catch {
      // Silently fail
    }
  },
}));

function _get(): AuthState {
  return useAuthStore.getState();
}
