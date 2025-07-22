// =============================================================================
// Performance Utilities
// =============================================================================

import React from 'react';
import { debounce, throttle } from 'lodash-es';
import type { DebouncedFunc } from 'lodash-es';

// =============================================================================
// Debouncing and Throttling
// =============================================================================

/**
 * Create a debounced version of a function
 * Useful for search inputs, resize handlers
 */
export const createDebounced = <T extends (...args: any[]) => any>(
  func: T,
  wait: number = 300,
  options?: Parameters<typeof debounce>[2]
): DebouncedFunc<T> => {
  return debounce(func, wait, options);
};

/**
 * Create a throttled version of a function
 * Useful for scroll handlers, mousemove events
 */
export const createThrottled = <T extends (...args: any[]) => any>(
  func: T,
  wait: number = 100,
  options?: Parameters<typeof throttle>[2]
) => {
  return throttle(func, wait, options);
};

// =============================================================================
// Common Performance Patterns
// =============================================================================

/**
 * Debounced search handler
 */
export const createDebouncedSearch = (
  callback: (query: string) => void,
  delay: number = 300
) => {
  return createDebounced(callback, delay, { leading: false, trailing: true });
};

/**
 * Throttled scroll handler
 */
export const createThrottledScroll = (
  callback: (event: Event) => void,
  delay: number = 16 // ~60fps
) => {
  return createThrottled(callback, delay, { leading: true, trailing: true });
};

/**
 * Throttled resize handler
 */
export const createThrottledResize = (
  callback: (event: Event) => void,
  delay: number = 100
) => {
  return createThrottled(callback, delay, { leading: false, trailing: true });
};

// =============================================================================
// Intersection Observer Utilities
// =============================================================================

export interface IntersectionObserverOptions {
  /** Root element for intersection (default: viewport) */
  root?: Element | null;
  /** Root margin (default: '0px') */
  rootMargin?: string;
  /** Threshold for intersection (default: 0.1) */
  threshold?: number | number[];
}

/**
 * Create an intersection observer for lazy loading
 */
export const createLazyLoader = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverOptions = {}
): IntersectionObserver => {
  const {
    root = null,
    rootMargin = '50px',
    threshold = 0.1,
  } = options;

  return new IntersectionObserver(callback, {
    root,
    rootMargin,
    threshold,
  });
};

/**
 * Hook for intersection observer
 */
export const useIntersectionObserver = (
  elementRef: React.RefObject<Element>,
  callback: (isIntersecting: boolean) => void,
  options: IntersectionObserverOptions = {}
) => {
  const [observer, setObserver] = React.useState<IntersectionObserver | null>(null);

  React.useEffect(() => {
    if (!elementRef.current) return;

    const obs = createLazyLoader(
      (entries) => {
        entries.forEach((entry) => {
          callback(entry.isIntersecting);
        });
      },
      options
    );

    obs.observe(elementRef.current);
    setObserver(obs);

    return () => {
      obs.disconnect();
    };
  }, [elementRef, callback, options]);

  return observer;
};

// =============================================================================
// Performance Monitoring
// =============================================================================

/**
 * Simple performance timer
 */
export class PerformanceTimer {
  private startTime: number = 0;
  private measurements: Record<string, number> = {};

  start(label?: string): void {
    this.startTime = performance.now();
    if (label) {
      this.measurements[`${label}_start`] = this.startTime;
    }
  }

  end(label?: string): number {
    const endTime = performance.now();
    const duration = endTime - this.startTime;
    
    if (label) {
      this.measurements[`${label}_end`] = endTime;
      this.measurements[`${label}_duration`] = duration;
    }

    return duration;
  }

  measure(label: string, fn: () => void): number {
    this.start(label);
    fn();
    return this.end(label);
  }

  async measureAsync<T>(label: string, fn: () => Promise<T>): Promise<{ result: T; duration: number }> {
    this.start(label);
    const result = await fn();
    const duration = this.end(label);
    return { result, duration };
  }

  getMeasurements(): Record<string, number> {
    return { ...this.measurements };
  }

  clearMeasurements(): void {
    this.measurements = {};
  }

  logMeasurement(label: string): void {
    const duration = this.measurements[`${label}_duration`];
    if (duration !== undefined) {
      console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
    }
  }
}

// Global performance timer instance
export const perfTimer = new PerformanceTimer();

/**
 * Performance HOC for measuring component render time
 * Note: Temporarily commented out due to Babel parsing issues
 * 
 * TODO: Re-implement in a separate file with proper TSX configuration
 */
// export function withPerformanceTracking<P extends {}>(
//   WrappedComponent: React.ComponentType<P>,
//   componentName?: string
// ) {
//   const PerformanceTrackedComponent = React.forwardRef<any, P>((props, ref) => {
//     const name = componentName || WrappedComponent.displayName || WrappedComponent.name || 'Component';
    
//     React.useLayoutEffect(() => {
//       perfTimer.start(`${name}_render`);
//     });

//     React.useEffect(() => {
//       const duration = perfTimer.end(`${name}_render`);
//       if (process.env.NODE_ENV === 'development') {
//         console.log(`🎨 ${name} rendered in ${duration.toFixed(2)}ms`);
//       }
//     });

//     return <WrappedComponent {...props} ref={ref} />;
//   });

//   PerformanceTrackedComponent.displayName = `withPerformanceTracking(${
//     componentName || WrappedComponent.displayName || WrappedComponent.name || 'Component'
//   })`;

//   return PerformanceTrackedComponent;
// }

// =============================================================================
// Memory Management
// =============================================================================

/**
 * Cleanup utility for removing event listeners and observers
 */
export class CleanupManager {
  private cleanupFunctions: (() => void)[] = [];

  add(cleanup: () => void): void {
    this.cleanupFunctions.push(cleanup);
  }

  addEventListener(
    target: EventTarget,
    type: string,
    listener: EventListener,
    options?: AddEventListenerOptions
  ): void {
    target.addEventListener(type, listener, options);
    this.add(() => target.removeEventListener(type, listener, options));
  }

  addIntersectionObserver(observer: IntersectionObserver): void {
    this.add(() => observer.disconnect());
  }

  addTimeout(id: number): void {
    this.add(() => clearTimeout(id));
  }

  addInterval(id: number): void {
    this.add(() => clearInterval(id));
  }

  cleanup(): void {
    this.cleanupFunctions.forEach(cleanup => cleanup());
    this.cleanupFunctions = [];
  }
}

/**
 * Hook for managing cleanup
 */
export const useCleanup = () => {
  const cleanupManager = React.useRef(new CleanupManager());

  React.useEffect(() => {
    return () => {
      cleanupManager.current.cleanup();
    };
  }, []);

  return cleanupManager.current;
};

// =============================================================================
// Image Optimization
// =============================================================================

/**
 * Check if WebP is supported
 */
export const supportsWebP = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

/**
 * Check if AVIF is supported
 */
export const supportsAVIF = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const avif = new Image();
    avif.onload = avif.onerror = () => {
      resolve(avif.height === 2);
    };
    avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  });
};

/**
 * Get optimal image format based on browser support
 */
export const getOptimalImageFormat = async (): Promise<'avif' | 'webp' | 'jpg'> => {
  if (await supportsAVIF()) return 'avif';
  if (await supportsWebP()) return 'webp';
  return 'jpg';
};

// =============================================================================
// Bundle Analysis
// =============================================================================

/**
 * Measure bundle size impact
 */
export const measureBundleSize = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    return {
      totalTransferSize: navigation.transferSize || 0,
      totalEncodedBodySize: navigation.encodedBodySize || 0,
      resources: resources.map(resource => ({
        name: resource.name,
        transferSize: resource.transferSize || 0,
        encodedBodySize: resource.encodedBodySize || 0,
        decodedBodySize: resource.decodedBodySize || 0,
      })),
    };
  }
  return null;
};

