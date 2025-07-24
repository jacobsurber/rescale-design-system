// =============================================================================
// Rescale Design System - Main Export File
// =============================================================================

// Theme and Configuration
export { RescaleThemeProvider, useRescaleTheme } from './theme/ThemeProvider';

// Motion and Animation Providers
export { MotionProvider, useMotion, useAnimationVariants } from './providers/MotionProvider';
export { rescaleTheme } from './theme/rescaleTheme';
export * from './theme/tokens';
export type { RescaleTheme } from './theme/rescaleTheme';

// Atomic Design System Components

// Atoms - Basic building blocks
export * from './components/atoms';

// Molecules - Composed components  
export * from './components/molecules';

// Organisms - Complex composed components
export * from './components/organisms';

// Layout Components
export * from './components/layout';

// Utility Components
export * from './components/utils';

// Dashboard Components
export * from './dashboard';

// Utilities
export * from './utils';

// Hooks  
export * from './hooks';

// Styles and Breakpoints (exported via theme/tokens to avoid conflicts)
// export * from './styles/breakpoints';

// Types
// export * from './types'; // TODO: Add types

// CSS Variables (to be imported in consuming applications)
import './theme/cssVariables.css';
import './index.css';