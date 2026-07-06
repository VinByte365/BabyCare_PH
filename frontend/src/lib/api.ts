/**
 * BabyGuide PH — API Client
 *
 * Centralized HTTP client for all backend requests.
 * Automatically attaches auth token from the store.
 * Handles 401 responses by attempting a token refresh.
 */

import { useAuthStore } from '../stores/authStore';

export const BASE_URL = __DEV__
  ? 'http://192.168.100.114:8000/api/v1'
  : 'https://api.babyguide.ph/api/v1';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
  /** Skip adding the Authorization header */
  skipAuth?: boolean;
}

class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// ── Token refresh state ──────────────────────────────────

let refreshPromise: Promise<string | null> | null = null;

async function attemptTokenRefresh(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const store = useAuthStore.getState();
      const token = store.refreshToken;
      if (!token) return null;

      const response = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: token }),
      });

      if (!response.ok) return null;

      const data = await response.json();
      await store.setTokens(data.access_token, data.refresh_token);
      return data.access_token;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// ── Core request function ────────────────────────────────

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body, headers = {}, skipAuth = false } = options;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...headers,
  };

  if (!skipAuth) {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const url = `${BASE_URL}${endpoint}`;

  let response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  // ── 401 → attempt token refresh, then retry once ──────
  if (response.status === 401 && !skipAuth) {
    const newToken = await attemptTokenRefresh();

    if (newToken) {
      requestHeaders['Authorization'] = `Bearer ${newToken}`;
      response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
      });
    } else {
      // Refresh failed — clear session
      await useAuthStore.getState().logout();
      throw new ApiError(
        401,
        'Session expired. Please log in again.',
      );
    }
  }

  if (!response.ok) {
    let errorData: unknown;
    try {
      errorData = await response.json();
    } catch {
      errorData = null;
    }
    throw new ApiError(
      response.status,
      `API request failed: ${response.status} ${response.statusText}`,
      errorData,
    );
  }

  if (response.status === 204) {
    return undefined as unknown as T;
  }

  return response.json() as Promise<T>;
}

// ── Convenience helpers ────────────────────────────────

export const api = {
  get: <T>(endpoint: string, opts?: Omit<RequestOptions, 'method'>) =>
    apiRequest<T>(endpoint, { ...opts, method: 'GET' }),

  post: <T>(endpoint: string, body?: Record<string, unknown>, opts?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { ...opts, method: 'POST', body }),

  put: <T>(endpoint: string, body?: Record<string, unknown>, opts?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { ...opts, method: 'PUT', body }),

  patch: <T>(endpoint: string, body?: Record<string, unknown>, opts?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { ...opts, method: 'PATCH', body }),

  delete: <T>(endpoint: string, opts?: Omit<RequestOptions, 'method'>) =>
    apiRequest<T>(endpoint, { ...opts, method: 'DELETE' }),
};

export { ApiError };
