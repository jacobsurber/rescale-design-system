// =============================================================================
// Lazy Loading Utilities
// =============================================================================

import React, { Suspense } from 'react';
import { LoadingSpinner } from '../components/atoms/LoadingSpinner/LoadingSpinner';

// =============================================================================
// Lazy Loading HOC
// =============================================================================

export interface LazyComponentOptions {
  /** Custom loading component */
  fallback?: React.ComponentType;
  /** Loading message */
  loadingMessage?: string;
  /** Error boundary component */
  errorBoundary?: React.ComponentType<{ children: React.ReactNode }>;
  /** Retry function for failed loads */
  retry?: () => void;
}

/**
 * Create a lazy-loaded component with custom loading state
 */
export const createLazyComponent = <P extends {}>(
  importFn: () => Promise<{ default: React.ComponentType<P> }>,
  options: LazyComponentOptions = {}
) => {
  const {
    fallback: CustomFallback = LoadingSpinner,
    errorBoundary: ErrorBoundary,
  } = options;

  const LazyComponent = React.lazy(importFn);

  const LazyWrapper: React.FC<P> = (props) => {
    const fallbackElement = <CustomFallback />;

    const component = (
      <Suspense fallback={fallbackElement}>
        <LazyComponent {...props} />
      </Suspense>
    );

    if (ErrorBoundary) {
      return <ErrorBoundary>{component}</ErrorBoundary>;
    }

    return component;
  };

  LazyWrapper.displayName = 'LazyWrapper';

  return LazyWrapper;
};

// =============================================================================
// Route-based Code Splitting
// =============================================================================

/**
 * Create lazy routes with consistent loading states
 */
export const createLazyRoute = (
  importFn: () => Promise<{ default: React.ComponentType<any> }>,
  routeName: string
) => {
  return createLazyComponent(importFn, {
    fallback: () => (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px' 
      }}>
        <LoadingSpinner />
      </div>
    ),
    loadingMessage: `Loading ${routeName}...`,
  });
};

// =============================================================================
// Preloading Utilities
// =============================================================================

/**
 * Preload a lazy component
 */
export const preloadComponent = (
  importFn: () => Promise<{ default: React.ComponentType<any> }>
): Promise<{ default: React.ComponentType<any> }> => {
  return importFn();
};

/**
 * Preload multiple components
 */
export const preloadComponents = (
  importFns: Array<() => Promise<{ default: React.ComponentType<any> }>>
): Promise<Array<{ default: React.ComponentType<any> }>> => {
  return Promise.all(importFns.map(fn => fn()));
};

// =============================================================================
// Component-level Code Splitting
// =============================================================================

/**
 * Lazy load heavy components that are not immediately visible
 */
export const LazyPerformanceDashboard = createLazyComponent(
  () => import('../components/organisms/PerformanceDashboard/PerformanceDashboard'),
  {
    loadingMessage: 'Loading Performance Dashboard...',
  }
);

export const LazyVirtualTable = createLazyComponent(
  () => import('../components/molecules/VirtualTable/VirtualTable'),
  {
    loadingMessage: 'Loading Virtual Table...',
  }
);

export const LazyAssistantChat = createLazyComponent(
  () => import('../components/organisms/AssistantChat/AssistantChat'),
  {
    loadingMessage: 'Loading Assistant Chat...',
  }
);

// =============================================================================
// Dynamic Imports with Error Handling
// =============================================================================

/**
 * Dynamic import with retry logic
 */
export const dynamicImport = async <T,>(
  importFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await importFn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError!;
};

/**
 * Create a lazy component with retry logic
 */
export const createRetryableLazyComponent = <P extends {}>(
  importFn: () => Promise<{ default: React.ComponentType<P> }>,
  maxRetries: number = 3
) => {
  return createLazyComponent(
    () => dynamicImport(importFn, maxRetries),
    {
      fallback: LoadingSpinner,
    }
  );
};