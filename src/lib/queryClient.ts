// =============================================================================
// TanStack Query Configuration - Query client setup and default options
// =============================================================================

import { QueryClient, DefaultOptions } from '@tanstack/react-query';

// Default query options
const defaultQueryOptions: DefaultOptions = {
  queries: {
    // Stale time - how long data is considered fresh
    staleTime: 5 * 60 * 1000, // 5 minutes
    
    // Cache time - how long inactive data stays in cache
    gcTime: 10 * 60 * 1000, // 10 minutes
    
    // Retry configuration
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors except 408 (timeout)
      if (error?.code === 'UNAUTHORIZED' || error?.code === 'FORBIDDEN') {
        return false;
      }
      
      if (error?.details?.status && error.details.status >= 400 && error.details.status < 500 && error.details.status !== 408) {
        return false;
      }
      
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    
    // Retry delay with exponential backoff
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    
    // Refetch on window focus for real-time data
    refetchOnWindowFocus: true,
    
    // Refetch when network reconnects
    refetchOnReconnect: true,
    
    // Don't refetch on mount if data is fresh
    refetchOnMount: true,
  },
  
  mutations: {
    // Retry failed mutations once
    retry: 1,
    
    // Retry delay for mutations
    retryDelay: 1000,
  },
};

// Create query client instance
export const queryClient = new QueryClient({
  defaultOptions: defaultQueryOptions,
  
  // Global error handler
  mutationCache: undefined, // We'll handle errors in individual mutations
  
  // Logger for development
  logger: process.env.NODE_ENV === 'development' ? {
    log: (...args) => console.log('[Query]', ...args),
    warn: (...args) => console.warn('[Query]', ...args),
    error: (...args) => console.error('[Query]', ...args),
  } : undefined,
});

// Query key factory for consistent cache keys
export const createQueryKey = (entity: string, ...params: (string | number | object)[]) => {
  return [entity, ...params.filter(p => p !== undefined && p !== null)];
};

// Utility functions for cache management
export const queryUtils = {
  // Invalidate specific queries
  invalidateQueries: (queryKey: unknown[]) => {
    return queryClient.invalidateQueries({ queryKey });
  },
  
  // Remove specific queries from cache
  removeQueries: (queryKey: unknown[]) => {
    return queryClient.removeQueries({ queryKey });
  },
  
  // Set query data manually
  setQueryData: <T>(queryKey: unknown[], data: T) => {
    return queryClient.setQueryData(queryKey, data);
  },
  
  // Get query data from cache
  getQueryData: <T>(queryKey: unknown[]): T | undefined => {
    return queryClient.getQueryData(queryKey);
  },
  
  // Prefetch queries
  prefetchQuery: async <T>(
    queryKey: unknown[],
    queryFn: () => Promise<T>,
    options?: { staleTime?: number }
  ) => {
    return queryClient.prefetchQuery({
      queryKey,
      queryFn,
      ...options,
    });
  },
  
  // Cancel ongoing queries
  cancelQueries: (queryKey: unknown[]) => {
    return queryClient.cancelQueries({ queryKey });
  },
  
  // Clear all cache
  clear: () => {
    return queryClient.clear();
  },
  
  // Get cache stats
  getStats: () => {
    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();
    
    return {
      totalQueries: queries.length,
      activeQueries: queries.filter(q => q.getObserversCount() > 0).length,
      staleQueries: queries.filter(q => q.isStale()).length,
      fetchingQueries: queries.filter(q => q.isFetching()).length,
    };
  },
};

// Development helpers
if (process.env.NODE_ENV === 'development') {
  // Expose query client on window for debugging
  (window as any).__queryClient = queryClient;
  (window as any).__queryUtils = queryUtils;
}