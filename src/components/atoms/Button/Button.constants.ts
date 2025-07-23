import { designTokens } from '../../../theme/tokens';

// Button size definitions using design tokens
export const buttonSizes = {
  xs: {
    height: '24px',
    padding: '0 8px',
    fontSize: designTokens.typography.fontSize.xs,
    iconSize: '12px',
    borderRadius: designTokens.borderRadius.sm,
  },
  sm: {
    height: '28px',
    padding: '0 12px',
    fontSize: designTokens.typography.fontSize.sm,
    iconSize: '14px',
    borderRadius: designTokens.borderRadius.sm,
  },
  md: {
    height: '32px',
    padding: '0 16px',
    fontSize: designTokens.typography.fontSize.base,
    iconSize: '16px',
    borderRadius: designTokens.borderRadius.base,
  },
  lg: {
    height: '40px',
    padding: '0 20px',
    fontSize: designTokens.typography.fontSize.lg,
    iconSize: '18px',
    borderRadius: designTokens.borderRadius.base,
  },
  xl: {
    height: '48px',
    padding: '0 24px',
    fontSize: designTokens.typography.fontSize.xl,
    iconSize: '20px',
    borderRadius: designTokens.borderRadius.md,
  },
} as const;

// Button variant definitions using design tokens
export const buttonVariantStyles = {
  primary: {
    backgroundColor: designTokens.colors.primary[500],
    borderColor: designTokens.colors.primary[500],
    color: designTokens.colors.neutral[50],
    hover: {
      backgroundColor: designTokens.colors.primary[600],
      borderColor: designTokens.colors.primary[600],
    },
    active: {
      backgroundColor: designTokens.colors.primary[700],
      borderColor: designTokens.colors.primary[700],
    },
    disabled: {
      backgroundColor: designTokens.colors.neutral[200],
      borderColor: designTokens.colors.neutral[200],
      color: designTokens.colors.neutral[400],
    },
  },
  secondary: {
    backgroundColor: 'transparent',
    borderColor: designTokens.colors.primary[500],
    color: designTokens.colors.primary[500],
    hover: {
      backgroundColor: designTokens.colors.primary[50],
      borderColor: designTokens.colors.primary[600],
      color: designTokens.colors.primary[600],
    },
    active: {
      backgroundColor: designTokens.colors.primary[100],
      borderColor: designTokens.colors.primary[700],
      color: designTokens.colors.primary[700],
    },
    disabled: {
      backgroundColor: 'transparent',
      borderColor: designTokens.colors.neutral[200],
      color: designTokens.colors.neutral[400],
    },
  },
  danger: {
    backgroundColor: designTokens.colors.error[500],
    borderColor: designTokens.colors.error[500],
    color: designTokens.colors.neutral[50],
    hover: {
      backgroundColor: designTokens.colors.error[600],
      borderColor: designTokens.colors.error[600],
    },
    active: {
      backgroundColor: designTokens.colors.error[700],
      borderColor: designTokens.colors.error[700],
    },
    disabled: {
      backgroundColor: designTokens.colors.neutral[200],
      borderColor: designTokens.colors.neutral[200],
      color: designTokens.colors.neutral[400],
    },
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    color: designTokens.colors.primary[500],
    hover: {
      backgroundColor: designTokens.colors.primary[50],
      borderColor: 'transparent',
      color: designTokens.colors.primary[600],
    },
    active: {
      backgroundColor: designTokens.colors.primary[100],
      borderColor: 'transparent',
      color: designTokens.colors.primary[700],
    },
    disabled: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      color: designTokens.colors.neutral[400],
    },
  },
} as const;

export type ButtonSize = keyof typeof buttonSizes;
export type ButtonVariant = keyof typeof buttonVariantStyles;