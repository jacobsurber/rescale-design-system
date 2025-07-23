import { designTokens } from '../../../theme/tokens';

// Icon size definitions using design tokens
export const iconSizes = {
  xs: {
    size: '12px',
    fontSize: 12,
  },
  sm: {
    size: '14px', 
    fontSize: 14,
  },
  md: {
    size: '16px',
    fontSize: 16,
  },
  lg: {
    size: '18px',
    fontSize: 18,
  },
  xl: {
    size: '20px',
    fontSize: 20,
  },
  '2xl': {
    size: '24px',
    fontSize: 24,
  },
} as const;

// Icon theme color definitions using design tokens
export const iconThemeColors = {
  primary: designTokens.colors.primary[500],
  secondary: designTokens.colors.neutral[600],
  success: designTokens.colors.success[500],
  warning: designTokens.colors.warning[500],
  error: designTokens.colors.error[500],
  info: designTokens.colors.info[500],
  neutral: designTokens.colors.neutral[500],
  disabled: designTokens.colors.neutral[400],
  white: designTokens.colors.neutral[50],
  black: designTokens.colors.neutral[900],
} as const;

export type IconSize = keyof typeof iconSizes;
export type IconThemeColor = keyof typeof iconThemeColors;