import React, { createContext, useContext, useMemo } from 'react';
import { MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';

interface MotionContextValue {
  shouldReduceMotion: boolean;
  isAnimationEnabled: boolean;
}

const MotionContext = createContext<MotionContextValue | undefined>(undefined);

export interface MotionProviderProps {
  children: ReactNode;
  /** Override for reduced motion preference */
  reduceMotion?: boolean;
  /** Global animation enable/disable */
  enableAnimations?: boolean;
}

/**
 * MotionProvider - Provides motion configuration and accessibility support
 * 
 * Automatically detects user's motion preferences and provides optimized
 * animation settings throughout the application.
 */
export const MotionProvider: React.FC<MotionProviderProps> = ({
  children,
  reduceMotion,
  enableAnimations = true,
}) => {
  const shouldReduceMotion = useMemo(() => {
    if (typeof reduceMotion === 'boolean') {
      return reduceMotion;
    }

    // Check for prefers-reduced-motion
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    return false;
  }, [reduceMotion]);

  const isAnimationEnabled = enableAnimations && !shouldReduceMotion;

  const contextValue: MotionContextValue = {
    shouldReduceMotion,
    isAnimationEnabled,
  };

  const motionConfig = useMemo(() => ({
    // Disable animations if user prefers reduced motion
    skipAnimations: shouldReduceMotion,
    // Use transform for better performance
    transformTemplate: ({ x, y, rotate, scale }: any) => 
      `translate3d(${x}, ${y}, 0) rotate(${rotate}) scale(${scale})`,
  }), [shouldReduceMotion]);

  return (
    <MotionContext.Provider value={contextValue}>
      <MotionConfig {...motionConfig}>
        {children}
      </MotionConfig>
    </MotionContext.Provider>
  );
};

/**
 * useMotion - Hook to access motion configuration
 * 
 * @returns Object containing motion preferences and helpers
 */
export const useMotion = () => {
  const context = useContext(MotionContext);
  
  if (context === undefined) {
    throw new Error('useMotion must be used within a MotionProvider');
  }
  
  return context;
};

/**
 * useAnimationVariants - Hook to get animation variants with reduced motion support
 * 
 * @param variants - Original animation variants
 * @returns Variants optimized for current motion preferences
 */
export const useAnimationVariants = (variants: any) => {
  const { shouldReduceMotion } = useMotion();
  
  return useMemo(() => {
    if (!shouldReduceMotion) {
      return variants;
    }

    // Create reduced motion variants
    const reducedVariants: any = {};
    
    Object.keys(variants).forEach((key) => {
      const variant = variants[key];
      if (typeof variant === 'object' && variant !== null) {
        reducedVariants[key] = {
          ...variant,
          transition: { duration: 0 },
        };
      } else {
        reducedVariants[key] = variant;
      }
    });
    
    return reducedVariants;
  }, [variants, shouldReduceMotion]);
};

export default MotionProvider;