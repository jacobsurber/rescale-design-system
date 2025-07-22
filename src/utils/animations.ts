// =============================================================================
// Rescale Design System - Animation Utilities
// =============================================================================

import type { Variants, Transition } from 'framer-motion';

// =============================================================================
// Animation Constants
// =============================================================================

export const DURATIONS = {
  fast: 0.15,
  normal: 0.2,
  slow: 0.3,
  slower: 0.4,
} as const;

export const EASINGS = {
  easeOut: [0.0, 0.0, 0.2, 1],
  easeIn: [0.4, 0.0, 1, 1],
  easeInOut: [0.4, 0.0, 0.2, 1],
  bouncy: [0.68, -0.55, 0.265, 1.55],
} as const;

// =============================================================================
// Base Transition Configs
// =============================================================================

export const transitions = {
  fast: { duration: DURATIONS.fast, ease: EASINGS.easeOut } as Transition,
  normal: { duration: DURATIONS.normal, ease: EASINGS.easeOut } as Transition,
  slow: { duration: DURATIONS.slow, ease: EASINGS.easeOut } as Transition,
  bouncy: { duration: DURATIONS.normal, ease: EASINGS.bouncy } as Transition,
  spring: { type: 'spring', stiffness: 300, damping: 20 } as Transition,
  stiff: { type: 'spring', stiffness: 500, damping: 25 } as Transition,
};

// =============================================================================
// Fade Animations
// =============================================================================

export const fadeVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: transitions.normal,
  },
  exit: {
    opacity: 0,
    transition: { ...transitions.fast, ease: EASINGS.easeIn },
  },
};

export const fadeUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.normal,
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { ...transitions.fast, ease: EASINGS.easeIn },
  },
};

export const fadeDownVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.normal,
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: { ...transitions.fast, ease: EASINGS.easeIn },
  },
};

// =============================================================================
// Slide Animations
// =============================================================================

export const slideInFromLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -100,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.normal,
  },
  exit: {
    opacity: 0,
    x: -100,
    transition: { ...transitions.fast, ease: EASINGS.easeIn },
  },
};

export const slideInFromRight: Variants = {
  hidden: {
    opacity: 0,
    x: 100,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.normal,
  },
  exit: {
    opacity: 0,
    x: 100,
    transition: { ...transitions.fast, ease: EASINGS.easeIn },
  },
};

export const slideInFromTop: Variants = {
  hidden: {
    opacity: 0,
    y: -100,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.normal,
  },
  exit: {
    opacity: 0,
    y: -100,
    transition: { ...transitions.fast, ease: EASINGS.easeIn },
  },
};

export const slideInFromBottom: Variants = {
  hidden: {
    opacity: 0,
    y: 100,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.normal,
  },
  exit: {
    opacity: 0,
    y: 100,
    transition: { ...transitions.fast, ease: EASINGS.easeIn },
  },
};

// =============================================================================
// Scale Animations
// =============================================================================

export const scaleVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.bouncy,
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { ...transitions.fast, ease: EASINGS.easeIn },
  },
};

export const scaleOnTap: Variants = {
  initial: { scale: 1 },
  tap: { scale: 0.95, transition: { duration: 0.1 } },
  hover: { scale: 1.02, transition: transitions.fast },
};

export const scaleOnHover: Variants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.05, 
    transition: transitions.fast,
  },
};

// =============================================================================
// Stagger Animations
// =============================================================================

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: transitions.normal,
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: { ...transitions.fast, ease: EASINGS.easeIn },
  },
};

// =============================================================================
// Height/Width Transitions
// =============================================================================

export const expandHeight: Variants = {
  collapsed: {
    height: 0,
    opacity: 0,
    overflow: 'hidden',
  },
  expanded: {
    height: 'auto',
    opacity: 1,
    overflow: 'visible',
    transition: {
      height: { duration: DURATIONS.normal, ease: EASINGS.easeOut },
      opacity: { duration: DURATIONS.fast, delay: DURATIONS.normal * 0.5 },
    },
  },
};

export const expandWidth: Variants = {
  collapsed: {
    width: 0,
    opacity: 0,
    overflow: 'hidden',
  },
  expanded: {
    width: 'auto',
    opacity: 1,
    overflow: 'visible',
    transition: {
      width: { duration: DURATIONS.normal, ease: EASINGS.easeOut },
      opacity: { duration: DURATIONS.fast, delay: DURATIONS.normal * 0.5 },
    },
  },
};

// =============================================================================
// Micro-interaction Animations
// =============================================================================

export const buttonVariants: Variants = {
  initial: {
    scale: 1,
    y: 0,
  },
  hover: {
    scale: 1.02,
    y: -1,
    transition: transitions.fast,
  },
  tap: {
    scale: 0.98,
    y: 0,
    transition: { duration: 0.1 },
  },
};

export const cardVariants: Variants = {
  initial: {
    scale: 1,
    y: 0,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
  },
  hover: {
    scale: 1.02,
    y: -4,
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
    transition: transitions.normal,
  },
};

export const pulseVariants: Variants = {
  pulse: {
    scale: [1, 1.1, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: EASINGS.easeInOut,
    },
  },
};

export const shakeVariants: Variants = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.4,
      ease: EASINGS.easeInOut,
    },
  },
};

export const rotateVariants: Variants = {
  initial: { rotate: 0 },
  rotated: { 
    rotate: 180,
    transition: transitions.normal,
  },
};

// =============================================================================
// Loading Animations
// =============================================================================

export const shimmerVariants: Variants = {
  initial: {
    x: '-100%',
  },
  animate: {
    x: '100%',
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

export const spinnerVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

export const dotsVariants: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: EASINGS.easeInOut,
    },
  },
};

// =============================================================================
// Page Transition Animations
// =============================================================================

export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    x: 20,
  },
  in: {
    opacity: 1,
    x: 0,
    transition: transitions.normal,
  },
  out: {
    opacity: 0,
    x: -20,
    transition: { ...transitions.fast, ease: EASINGS.easeIn },
  },
};

export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 50,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: transitions.bouncy,
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 50,
    transition: { ...transitions.fast, ease: EASINGS.easeIn },
  },
};

export const drawerVariants: Variants = {
  hidden: {
    x: '100%',
  },
  visible: {
    x: 0,
    transition: transitions.normal,
  },
  exit: {
    x: '100%',
    transition: { ...transitions.fast, ease: EASINGS.easeIn },
  },
};

// =============================================================================
// Notification Animations
// =============================================================================

export const notificationVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 100,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: transitions.bouncy,
  },
  exit: {
    opacity: 0,
    x: 100,
    scale: 0.95,
    transition: { ...transitions.fast, ease: EASINGS.easeIn },
  },
};

// =============================================================================
// Utility Functions
// =============================================================================

export const getReducedMotionVariants = (variants: Variants): Variants => {
  const reducedVariants: Variants = {};
  
  Object.keys(variants).forEach((key) => {
    const variant = variants[key];
    if (typeof variant === 'object' && variant !== null) {
      reducedVariants[key] = {
        ...variant,
        transition: { duration: 0 },
      };
    }
  });
  
  return reducedVariants;
};

export const createStaggerContainer = (staggerDelay = 0.1, delayChildren = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: staggerDelay * 0.5,
      staggerDirection: -1,
    },
  },
});

export const createFadeVariant = (
  direction: 'up' | 'down' | 'left' | 'right' | 'none' = 'none',
  distance = 20
): Variants => {
  const getOffset = () => {
    switch (direction) {
      case 'up': return { y: distance };
      case 'down': return { y: -distance };
      case 'left': return { x: distance };
      case 'right': return { x: -distance };
      default: return {};
    }
  };

  const getExitOffset = () => {
    switch (direction) {
      case 'up': return { y: -distance };
      case 'down': return { y: distance };
      case 'left': return { x: -distance };
      case 'right': return { x: distance };
      default: return {};
    }
  };

  return {
    hidden: {
      opacity: 0,
      ...getOffset(),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: transitions.normal,
    },
    exit: {
      opacity: 0,
      ...getExitOffset(),
      transition: { ...transitions.fast, ease: EASINGS.easeIn },
    },
  };
};