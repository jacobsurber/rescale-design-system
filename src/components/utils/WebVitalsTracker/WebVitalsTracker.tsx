import React, { useEffect, useCallback } from 'react';
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';
import type { CLSMetric, FCPMetric, INPMetric, LCPMetric, TTFBMetric } from 'web-vitals';

export interface WebVitalsData {
  CLS?: CLSMetric;
  INP?: INPMetric;
  FCP?: FCPMetric;
  LCP?: LCPMetric;
  TTFB?: TTFBMetric;
}

export interface WebVitalsTrackerProps {
  /** Callback when Web Vitals are collected */
  onMetric?: (metric: CLSMetric | INPMetric | FCPMetric | LCPMetric | TTFBMetric) => void;
  /** Whether to log metrics to console */
  debug?: boolean;
  /** Whether to send metrics to analytics */
  sendToAnalytics?: boolean;
  /** Custom analytics endpoint */
  analyticsEndpoint?: string;
}

// Global Web Vitals store
const webVitalsData: WebVitalsData = {};

/**
 * Get current Web Vitals data
 */
export const getWebVitalsData = (): WebVitalsData => {
  return { ...webVitalsData };
};

/**
 * Format Web Vitals score with rating
 */
export const formatWebVitalScore = (
  name: string,
  value: number,
  rating: 'good' | 'needs-improvement' | 'poor'
): string => {
  const emoji = rating === 'good' ? '🟢' : rating === 'needs-improvement' ? '🟡' : '🔴';
  return `${emoji} ${name}: ${value.toFixed(2)} (${rating})`;
};

/**
 * Get rating for Core Web Vitals
 */
export const getWebVitalRating = (name: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
  switch (name) {
    case 'CLS':
      return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
    case 'INP':
      return value <= 200 ? 'good' : value <= 500 ? 'needs-improvement' : 'poor';
    case 'LCP':
      return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
    case 'FCP':
      return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor';
    case 'TTFB':
      return value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor';
    default:
      return 'needs-improvement';
  }
};

/**
 * Send metric to analytics service
 */
const sendToAnalytics = async (
  metric: CLSMetric | INPMetric | FCPMetric | LCPMetric | TTFBMetric,
  endpoint?: string
) => {
  if (!endpoint) return;

  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      }),
    });
  } catch (error) {
    console.warn('Failed to send Web Vitals to analytics:', error);
  }
};

/**
 * Send metric to Google Analytics
 */
const sendToGoogleAnalytics = (metric: CLSMetric | INPMetric | FCPMetric | LCPMetric | TTFBMetric) => {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    // Send to Google Analytics 4
    (window as any).gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      custom_parameter_1: metric.rating,
      non_interaction: true,
    });
  }
};

/**
 * WebVitalsTracker - Component for tracking Core Web Vitals
 * 
 * @example
 * ```tsx
 * <WebVitalsTracker 
 *   debug={true}
 *   onMetric={(metric) => console.log(metric)}
 *   sendToAnalytics={true}
 * />
 * ```
 */
export const WebVitalsTracker: React.FC<WebVitalsTrackerProps> = ({
  onMetric,
  debug = false,
  sendToAnalytics: enableAnalytics = false,
  analyticsEndpoint,
}) => {
  const handleMetric = useCallback(
    (metric: CLSMetric | INPMetric | FCPMetric | LCPMetric | TTFBMetric) => {
      // Store metric globally
      webVitalsData[metric.name as keyof WebVitalsData] = metric as any;

      // Log to console if debug mode
      if (debug) {
        const rating = getWebVitalRating(metric.name, metric.value);
        console.log(formatWebVitalScore(metric.name, metric.value, rating));
      }

      // Call custom callback
      if (onMetric) {
        onMetric(metric);
      }

      // Send to analytics if enabled
      if (enableAnalytics) {
        if (analyticsEndpoint) {
          sendToAnalytics(metric, analyticsEndpoint);
        } else {
          sendToGoogleAnalytics(metric);
        }
      }
    },
    [onMetric, debug, enableAnalytics, analyticsEndpoint]
  );

  useEffect(() => {
    // Set up Web Vitals listeners
    onCLS(handleMetric);
    onFCP(handleMetric);
    onINP(handleMetric);
    onLCP(handleMetric);
    onTTFB(handleMetric);
  }, [handleMetric]);

  // This component doesn't render anything
  return null;
};

/**
 * useWebVitals - Hook for accessing Web Vitals data
 */
export const useWebVitals = () => {
  const [vitals, setVitals] = React.useState<WebVitalsData>({});
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    let timeoutId: number;

    const updateVitals = () => {
      setVitals(getWebVitalsData());
      
      // Check if we have some key metrics
      const currentData = getWebVitalsData();
      if (currentData.FCP || currentData.LCP) {
        setIsLoading(false);
      } else {
        // Keep checking for a few seconds
        timeoutId = window.setTimeout(updateVitals, 500);
      }
    };

    updateVitals();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const getScore = useCallback((metricName: keyof WebVitalsData) => {
    const metric = vitals[metricName];
    if (!metric) return null;

    const rating = getWebVitalRating(metricName, metric.value);
    return {
      value: metric.value,
      rating,
      formatted: formatWebVitalScore(metricName, metric.value, rating),
    };
  }, [vitals]);

  const getOverallScore = useCallback(() => {
    const metrics = ['CLS', 'INP', 'LCP'] as const;
    const scores = metrics
      .map(name => getScore(name))
      .filter(Boolean);

    if (scores.length === 0) return null;

    const goodCount = scores.filter(s => s!.rating === 'good').length;
    const totalCount = scores.length;
    const percentage = (goodCount / totalCount) * 100;

    let overallRating: 'good' | 'needs-improvement' | 'poor';
    if (percentage >= 75) {
      overallRating = 'good';
    } else if (percentage >= 50) {
      overallRating = 'needs-improvement';
    } else {
      overallRating = 'poor';
    }

    return {
      percentage: Math.round(percentage),
      rating: overallRating,
      goodCount,
      totalCount,
    };
  }, [getScore]);

  return {
    vitals,
    isLoading,
    getScore,
    getOverallScore,
    refresh: () => setVitals(getWebVitalsData()),
  };
};

export default WebVitalsTracker;