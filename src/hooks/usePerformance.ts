// =============================================================================
// Performance Hooks
// =============================================================================

import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { createDebouncedSearch, createThrottledScroll, useIntersectionObserver } from '../utils/performance';

/**
 * useDebounce - Hook for debouncing values
 * 
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced value
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * useDebouncedCallback - Hook for debouncing callback functions
 * 
 * @param callback - Function to debounce
 * @param delay - Delay in milliseconds
 * @param deps - Dependencies array
 * @returns Debounced callback
 */
export const useDebouncedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): T => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useMemo(() => {
    const debouncedCallback = createDebouncedSearch(
      (...args: Parameters<T>) => callbackRef.current(...args),
      delay
    );
    return debouncedCallback as T;
  }, [delay, ...deps]);
};

/**
 * useThrottledCallback - Hook for throttling callback functions
 * 
 * @param callback - Function to throttle
 * @param delay - Delay in milliseconds
 * @param deps - Dependencies array
 * @returns Throttled callback
 */
export const useThrottledCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): T => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useMemo(() => {
    const throttledCallback = createThrottledScroll(
      (...args: Parameters<T>) => callbackRef.current(...args),
      delay
    );
    return throttledCallback as T;
  }, [delay, ...deps]);
};

/**
 * usePrevious - Hook for accessing previous value
 * 
 * @param value - Current value
 * @returns Previous value
 */
export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

/**
 * useStableCallback - Hook for creating stable callback references
 * 
 * @param callback - Callback function
 * @returns Stable callback reference
 */
export const useStableCallback = <T extends (...args: any[]) => any>(
  callback: T
): T => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useCallback(
    ((...args: Parameters<T>) => callbackRef.current(...args)) as T,
    []
  );
};

/**
 * useEffectOnce - Hook for running effect only once
 * 
 * @param effect - Effect function
 */
export const useEffectOnce = (effect: React.EffectCallback) => {
  useEffect(effect, []);
};

/**
 * useMountedRef - Hook for checking if component is mounted
 * 
 * @returns Ref indicating mount status
 */
export const useMountedRef = () => {
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return mountedRef;
};

/**
 * useAsyncCallback - Hook for handling async callbacks with loading state
 * 
 * @param callback - Async callback function
 * @param deps - Dependencies array
 * @returns Object with execute function and loading state
 */
export const useAsyncCallback = <T extends (...args: any[]) => Promise<any>>(
  callback: T,
  deps: React.DependencyList = []
) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const mountedRef = useMountedRef();

  const execute = useCallback(async (...args: Parameters<T>) => {
    setLoading(true);
    setError(null);

    try {
      const result = await callback(...args);
      if (mountedRef.current) {
        setLoading(false);
      }
      return result;
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      }
      throw err;
    }
  }, deps);

  return { execute, loading, error };
};

/**
 * useLocalStorage - Hook for managing localStorage with SSR safety
 * 
 * @param key - Storage key
 * @param initialValue - Initial value
 * @returns [value, setValue] tuple
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] => {
  // State to store our value
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        
        // Save to local storage
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
};

/**
 * useIntersectionObserverLazy - Hook for lazy loading with intersection observer
 * 
 * @param options - Intersection observer options
 * @returns [ref, isIntersecting, wasIntersecting]
 */
export const useIntersectionObserverLazy = (
  options?: IntersectionObserverInit
) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const [wasIntersecting, setWasIntersecting] = React.useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useIntersectionObserver(
    elementRef,
    (isVisible) => {
      setIsIntersecting(isVisible);
      if (isVisible && !wasIntersecting) {
        setWasIntersecting(true);
      }
    },
    options
  );

  return [elementRef, isIntersecting, wasIntersecting] as const;
};

/**
 * useWindowSize - Hook for tracking window size
 * 
 * @returns Object with width and height
 */
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = React.useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    const throttledHandleResize = createThrottledScroll(handleResize, 100);
    
    window.addEventListener('resize', throttledHandleResize);
    return () => window.removeEventListener('resize', throttledHandleResize);
  }, []);

  return windowSize;
};

/**
 * useMediaQuery - Hook for responsive design with media queries
 * 
 * @param query - Media query string
 * @returns Boolean indicating if query matches
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(query);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [query]);

  return matches;
};

/**
 * useRenderCount - Hook for tracking component render count (development)
 * 
 * @param componentName - Name of the component
 * @returns Current render count
 */
export const useRenderCount = (componentName?: string): number => {
  const renderCountRef = useRef(0);
  renderCountRef.current++;

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `🎨 ${componentName || 'Component'} rendered ${renderCountRef.current} times`
      );
    }
  });

  return renderCountRef.current;
};