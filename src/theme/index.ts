/**
 * Rescale Design System - Theme Exports
 * Main entry point for all theme-related functionality
 */

// Core theme configuration
export { default as rescaleTheme } from './rescaleTheme';

// Theme provider and hook
export { RescaleThemeProvider, useRescaleTheme } from './ThemeProvider';
export type { RescaleThemeProviderProps } from './ThemeProvider';

// Design tokens
export {
  designTokens,
  primaryColors,
  neutralColors,
  statusColors,
  typography,
  spacing,
  borderRadius,
  dimensions,
  shadows,
  zIndex,
  animation,
} from './tokens';
export type { DesignTokens } from './tokens';

// CSS variables are automatically imported when ThemeProvider is used