/**
 * Rescale Design System - Design Tokens
 * Core design tokens that define the visual language of Rescale
 */

// Primary Colors (updated from Figma extraction)
export const primaryColors = {
  brandBlue: '#0066CC',
  darkBlue: '#003D7A', // From Figma tokens
  lightBlue: '#E6F4FF', // From Figma tokens
  skyBlue: '#40A9FF',
} as const;

// Neutral Colors (enhanced with Figma-extracted grays)
export const neutralColors = {
  gray900: '#1F1F1F', // From Figma tokens
  gray800: '#262626', // From Figma tokens
  gray700: '#434343', // From Figma tokens
  gray600: '#595959', // From Figma tokens
  gray500: '#8C8C8C', // From Figma tokens
  gray400: '#BFBFBF', // From Figma tokens
  gray300: '#D9D9D9', // From Figma tokens
  gray200: '#E8E8E8', // From Figma tokens
  gray100: '#F5F5F5', // From Figma tokens
  gray50: '#FAFAFA',  // From Figma tokens
  white: '#FFFFFF',
  black: '#000000',
  // Figma-specific backgrounds
  backgroundLight: '#CCCCCC', // From Figma pages
  backgroundDark: '#555E69',  // From Figma pages
} as const;

// Status Colors
export const statusColors = {
  success: '#52C41A',
  warning: '#FA8C16',
  error: '#FF4D4F',
  info: '#1890FF',
} as const;

// Typography
export const typography = {
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 38,
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.625,
  },
} as const;

// Spacing (based on 4px unit)
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
} as const;

// Border Radius
export const borderRadius = {
  none: 0,
  sm: 2,
  base: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  full: 9999,
} as const;

// Component Dimensions
export const dimensions = {
  buttonHeight: 32,
  inputHeight: 32,
  navHeight: 64,
  sidebarWidth: 240,
} as const;

// Shadows
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
} as const;

// Z-Index
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// Animation & Transition
export const animation = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  },
} as const;

// Export all tokens
export const designTokens = {
  colors: {
    primary: primaryColors,
    neutral: neutralColors,
    status: statusColors,
  },
  typography,
  spacing,
  borderRadius,
  dimensions,
  shadows,
  zIndex,
  animation,
} as const;

export type DesignTokens = typeof designTokens;