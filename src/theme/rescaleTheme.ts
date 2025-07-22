import type { ThemeConfig } from 'antd';
import { primaryColors, neutralColors, statusColors, typography, spacing, borderRadius, dimensions, shadows } from './tokens';

/**
 * Rescale Design System - Ant Design Theme Configuration
 * Custom theme that applies Rescale design tokens to Ant Design components
 */

export const rescaleTheme: ThemeConfig = {
  token: {
    // Color Palette
    colorPrimary: primaryColors.brandBlue,
    colorSuccess: statusColors.success,
    colorWarning: statusColors.warning,
    colorError: statusColors.error,
    colorInfo: statusColors.info,
    
    // Text Colors
    colorText: neutralColors.gray900,
    colorTextSecondary: neutralColors.gray700,
    colorTextTertiary: neutralColors.gray500,
    colorTextQuaternary: neutralColors.gray300,
    
    // Background Colors
    colorBgContainer: neutralColors.white,
    colorBgElevated: neutralColors.white,
    colorBgLayout: neutralColors.gray100,
    colorBgSpotlight: primaryColors.lightBlue,
    
    // Border Colors
    colorBorder: neutralColors.gray300,
    colorBorderSecondary: neutralColors.gray300,
    
    // Typography
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize.sm,
    fontSizeHeading1: typography.fontSize['4xl'],
    fontSizeHeading2: typography.fontSize['3xl'],
    fontSizeHeading3: typography.fontSize['2xl'],
    fontSizeHeading4: typography.fontSize.xl,
    fontSizeHeading5: typography.fontSize.lg,
    fontSizeLG: typography.fontSize.base,
    fontSizeSM: typography.fontSize.xs,
    
    // Spacing
    padding: spacing[4],
    paddingXS: spacing[2],
    paddingSM: spacing[3],
    paddingLG: spacing[6],
    paddingXL: spacing[8],
    
    margin: spacing[4],
    marginXS: spacing[2],
    marginSM: spacing[3],
    marginLG: spacing[6],
    marginXL: spacing[8],
    marginXXL: spacing[12],
    
    // Border Radius
    borderRadius: borderRadius.base,
    borderRadiusXS: borderRadius.sm,
    borderRadiusSM: borderRadius.base,
    borderRadiusLG: borderRadius.lg,
    borderRadiusOuter: borderRadius.md,
    
    // Control Heights
    controlHeight: dimensions.buttonHeight,
    controlHeightSM: 24,
    controlHeightLG: 40,
    
    // Box Shadows
    boxShadow: shadows.base,
    boxShadowSecondary: shadows.sm,
    boxShadowTertiary: shadows.lg,
    
    // Line Heights
    lineHeight: typography.lineHeight.normal,
    
    // Motion
    motionDurationFast: '0.1s',
    motionDurationMid: '0.2s',
    motionDurationSlow: '0.3s',
    motionEaseInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    motionEaseOut: 'cubic-bezier(0, 0, 0.2, 1)',
    
    // Z-Index
    zIndexBase: 0,
    zIndexPopupBase: 1000,
  },
  
  components: {
    // Button Component
    Button: {
      borderRadius: borderRadius.base,
      controlHeight: dimensions.buttonHeight,
      fontWeight: typography.fontWeight.medium,
      primaryShadow: shadows.sm,
    },
    
    // Input Component
    Input: {
      borderRadius: borderRadius.base,
      controlHeight: dimensions.inputHeight,
    },
    
    // Card Component
    Card: {
      borderRadiusLG: borderRadius.lg,
      boxShadowTertiary: shadows.base,
      paddingLG: spacing[6],
    },
    
    // Select Component
    Select: {
      borderRadius: borderRadius.base,
      controlHeight: dimensions.inputHeight,
    },
    
    // Checkbox Component
    Checkbox: {
      borderRadius: borderRadius.sm,
    },
    
    // Radio Component
    Radio: {
      dotSize: 8,
      radioSize: 16,
    },
    
    // Switch Component
    Switch: {
      trackHeight: 20,
      trackMinWidth: 44,
      handleSize: 16,
    },
    
    // Table Component
    Table: {
      borderRadius: borderRadius.base,
      cellPaddingBlock: spacing[3],
      cellPaddingInline: spacing[4],
    },
    
    // Modal Component
    Modal: {
      borderRadius: borderRadius.lg,
      paddingLG: spacing[6],
    },
    
    // Drawer Component
    Drawer: {
      paddingLG: spacing[6],
    },
    
    // Tabs Component
    Tabs: {},
    
    // Badge Component
    Badge: {
      borderRadius: borderRadius.full,
    },
    
    // Tag Component
    Tag: {
      borderRadius: borderRadius.base,
    },
    
    // Tooltip Component
    Tooltip: {
      borderRadius: borderRadius.base,
    },
    
    // Popover Component
    Popover: {
      borderRadius: borderRadius.lg,
    },
    
    // Menu Component
    Menu: {
      borderRadius: borderRadius.base,
      itemHeight: 40,
    },
    
    // Breadcrumb Component
    Breadcrumb: {
      itemColor: neutralColors.gray700,
      lastItemColor: neutralColors.gray900,
      linkColor: primaryColors.brandBlue,
      linkHoverColor: primaryColors.darkBlue,
    },
    
    // Steps Component
    Steps: {
      dotSize: 8,
      iconSize: 24,
    },
    
    // Progress Component
    Progress: {
      circleTextColor: neutralColors.gray900,
    },
    
    // Divider Component
    Divider: {
      colorSplit: neutralColors.gray300,
    },
    
    // Typography Component
    Typography: {
      titleMarginBottom: spacing[4],
      titleMarginTop: spacing[6],
    },
  },
  
  algorithm: undefined, // Use default algorithm
};

export default rescaleTheme;