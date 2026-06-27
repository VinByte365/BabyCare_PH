/**
 * BabyGuide PH — API Client
 *
 * Centralized HTTP client for all backend requests.
 * Automatically attaches auth token from the store.
 */

import { useAuthStore } from '../stores/authStore';

const BASE_URL = __DEV__
  ? 'http://10.0.2.2:8000/api/v1'  // Android emulator → localhost
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

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

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

  // Handle 204 No Content
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
