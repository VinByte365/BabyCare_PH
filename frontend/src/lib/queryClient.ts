/**
 * BabyGuide PH — TanStack Query Client
 *
 * Configured with sensible defaults for a healthcare app:
 * - Stale time of 5 minutes (health data shouldn't be too stale)
 * - Retry 2 times with exponential backoff
 * - GC time of 30 minutes
 */

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,       // 5 minutes
      gcTime: 30 * 60 * 1000,          // 30 minutes (formerly cacheTime)
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
    },
    mutations: {
      retry: 1,
    },
  },
});
