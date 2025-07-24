/**
 * Rescale Design System - Design Tokens
 * Comprehensive design tokens based on Figma extraction and component audit
 * Updated: 2025-07-23
 */

// =============================================================================
// COLORS
// =============================================================================

// Primary Brand Colors (Figma Extracted Values - Updated from MCP)
export const primaryColors = {
  // Core Rescale Brand Colors (from Figma MCP extraction)
  rescaleBlue: '#3399BB',    // Main Rescale Blue brand color
  brandBlue: '#0091F8',      // Primary/6 - Main interactive blue
  darkBlue: '#005694',       // Primary/8 - Dark variant for text/emphasis
  lightBlue: '#E5F4FF',      // Primary/1 - Light background tint
  mediumBlue: '#0272C3',     // Primary/7 - Medium blue for secondary actions
  
  // Golden Purple palette (from Figma extraction)
  goldenPurple1: '#F3F7FF',  // Lightest tint
  goldenPurple2: '#E9F0FF',  // Light tint
  goldenPurple3: '#BDCBEB',  // Medium light
  goldenPurple4: '#A5B2D3',  // Medium
  goldenPurple5: '#8F99B8',  // Medium dark
  goldenPurple6: '#7B87AB',  // Dark
  goldenPurple7: '#606D95',  // Darkest
  
  // Legacy support
  skyBlue: '#40A9FF',        // Keep for backward compatibility
} as const;

// Neutral Colors (Updated from Figma MCP extraction)
export const neutralColors = {
  // Core neutrals from Figma variables
  neutral1: '#FFFFFF',      // Pure white backgrounds
  neutral13: '#000000',     // Pure black text/elements
  
  // Character colors for text
  characterPrimary: '#000000',    // Primary text color (85% opacity in some contexts)
  characterPrimaryInverse: '#FFFFFF', // Inverse text on dark backgrounds
  
  // Conditional colors
  conditionalSiderBackground: '#FFFFFF', // Sidebar background
  
  // Geek Blue palette
  geekBlue1: '#F0F5FF',     // Light blue background
  
  // Legacy grays (keeping for compatibility)
  gray900: '#1F1F1F',       // Darkest text
  gray800: '#262626',       // Dark text  
  gray700: '#434343',       // Secondary text
  gray600: '#595959',       // Muted text
  gray500: '#8C8C8C',       // Disabled text
  gray400: '#BFBFBF',       // Placeholder
  gray300: '#D9D9D9',       // Light borders
  gray200: '#E8E8E8',       // Subtle borders
  gray100: '#f5f6f7',       // Light backgrounds
  gray50: '#FAFAFA',        // Lightest backgrounds
  
  // Border-specific grays
  grayBorder: '#dfdfdf',    // Figma border color
  grayBorderLight: '#dcdcdc', // Light border color
  
  // Basic colors
  white: '#FFFFFF',
  black: '#000000',
  
  // Background colors
  backgroundLight: '#CCCCCC', // Page backgrounds
  backgroundDark: '#555E69',  // Dark backgrounds
  backgroundJob: '#dee4ec',   // Job pages
} as const;

// Status Colors (Updated from Figma MCP extraction)
export const statusColors = {
  success: '#50c878',       // Success green
  warning: '#FA8C16',       // Warning orange
  error: '#FF4D4F',         // Error red
  info: '#1890FF',          // Info blue
  
  // Tag colors from Figma
  tagBlue: '#3499BB',       // Blue tags (matches rescaleBlue)
  tagRed: '#D62B1F',        // Red tags for important/urgent items
} as const;

// Accent Colors (Figma Extracted)
export const accentColors = {
  purple: '#7d53b3',        // Figma 2.5 Flow [JS] - Purple accent
} as const;

// Focus & Interactive Colors (Based on component audit findings)
export const interactionColors = {
  focus: 'rgba(2, 114, 195, 0.1)',      // Consistent focus ring (based on brandBlue)
  focusOutline: '#0272c3',              // Focus outline color
  overlay: 'rgba(255, 255, 255, 0.8)',  // Overlay backgrounds
  overlayDark: 'rgba(0, 0, 0, 0.5)',    // Dark overlays
  shimmer: 'rgba(255, 255, 255, 0.8)',  // Shimmer effect
} as const;

// =============================================================================
// TYPOGRAPHY
// =============================================================================

export const typography = {
  fontFamily: {
    primary: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', // From Figma MCP extraction
    display: 'Figtree, "Roboto", sans-serif',   // Display font
    inter: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', // Fallback
    
    // Specific font definitions from Figma
    bodyRegular: 'Roboto', // Body/regular font from extraction
  },
  fontSize: {
    xs: 12,
    sm: 14,         // ✅ Figma Roboto 14px
    md: 17,         // ✅ Figma Roboto 17px 
    base: 16,
    lg: 18,         // ✅ Figma Roboto 18px
    xl: 20,
    '2xl': 24,
    '2.5xl': 28,    // ✅ Figma Roboto 28px
    '3xl': 30,
    '4xl': 38,
    'display': 100, // ✅ Figma Figtree 100px
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

// =============================================================================
// SPACING & DIMENSIONS
// =============================================================================

// Spacing Scale (4px unit system)
export const spacing = {
  0: 0,
  1: 4,     // xs
  2: 8,     // sm  
  3: 12,
  4: 16,    // md
  5: 20,
  6: 24,
  7: 28,
  8: 32,    // lg
  10: 40,
  12: 48,   // xl
  16: 64,
  20: 80,
  24: 96,
  32: 128,
} as const;

// Component Dimensions (From audit findings)
export const dimensions = {
  buttonHeight: 32,
  inputHeight: 32,
  navHeight: 56,          // Updated from TopBar audit (was 64)
  topBarHeight: 56,       // Specific TopBar height from audit
  sidebarWidth: 240,
  searchWidth: 300,       // From TopBar audit
  compactSearchWidth: 200, // From TopBar audit
  iconSize: 32,           // From TopBar audit
} as const;

// Breakpoints (From media query audit)
export const breakpoints = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
} as const;

// =============================================================================
// VISUAL EFFECTS
// =============================================================================

// Border Radius
export const borderRadius = {
  none: 0,
  sm: 2,
  base: 4,     // Most common in components
  md: 6,       // From AnimatedFeedback audit
  lg: 8,       // From ErrorBoundary audit
  xl: 12,
  '2xl': 16,
  full: 9999,
} as const;

// Shadows & Elevation
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  
  // Specific shadows from component audit
  elevation: '0 2px 8px rgba(0, 0, 0, 0.15)',  // From FigmaStyledButton
  focus: '0 0 0 2px rgba(2, 114, 195, 0.1)',   // Consistent focus shadow
} as const;

// Z-Index Scale (From component audit - organized)
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  loading: 100,         // From LoadingSpinner audit
  layout: 999,          // From MainLayout audit
  dropdown: 1000,       // From MainLayout audit
  sticky: 1001,         // From MainLayout audit (was 1100)
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// Animation & Transitions (From component audit)
export const animation = {
  duration: {
    fast: '150ms',
    normal: '200ms',      // Most common in components
    slow: '300ms',
    slower: '500ms',
    shimmer: '1.5s',      // From Skeleton audit
    feedback: '600ms',    // From AnimatedFeedback audit
  },
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    // Custom easing from AnimatedFeedback
    feedbackEase: 'easeOut',
  },
  // Common transition patterns
  transitions: {
    standard: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    background: 'background-color 200ms ease-in-out',
  },
} as const;

// =============================================================================
// SEMANTIC COLOR ALIASES
// =============================================================================

export const semanticColors = {
  primary: {
    main: primaryColors.brandBlue,
    dark: primaryColors.darkBlue,
    light: primaryColors.lightBlue,
    contrast: neutralColors.white,
  },
  text: {
    primary: neutralColors.gray900,
    secondary: neutralColors.gray700,
    muted: neutralColors.gray600,
    disabled: neutralColors.gray500,
    placeholder: neutralColors.gray400,
  },
  background: {
    primary: neutralColors.white,
    secondary: neutralColors.gray50,
    tertiary: neutralColors.gray100,
    disabled: neutralColors.gray200,
    paper: neutralColors.white,
    hover: neutralColors.gray50,
    overlay: interactionColors.overlay,
    overlayDark: interactionColors.overlayDark,
  },
  border: {
    primary: neutralColors.gray300,
    secondary: neutralColors.gray200,
    light: neutralColors.grayBorderLight,
    muted: neutralColors.grayBorder,
  },
  interactive: {
    focus: interactionColors.focus,
    focusOutline: interactionColors.focusOutline,
    hover: neutralColors.gray50,
  },
  status: {
    success: {
      main: statusColors.success,
      light: '#E8F5E8',
      dark: '#2E7D32',
    },
    warning: {
      main: statusColors.warning,
      light: '#FFF3E0',
      dark: '#F57C00',
    },
    error: {
      main: statusColors.error,
      light: '#FFEBEE',
      dark: '#C62828',
    },
    info: {
      main: statusColors.info,
      light: '#E3F2FD',
      dark: '#1565C0',
    },
  },
} as const;

// =============================================================================
// RESPONSIVE HELPERS
// =============================================================================

export const mediaQueries = {
  mobile: `@media (max-width: ${breakpoints.mobile}px)`,
  tablet: `@media (max-width: ${breakpoints.tablet}px)`,
  desktop: `@media (min-width: ${breakpoints.tablet + 1}px)`,
  wide: `@media (min-width: ${breakpoints.wide}px)`,
  
  // Specific breakpoints found in audit
  mobileAndBelow: `@media (max-width: ${breakpoints.mobile}px)`,
  tabletAndBelow: `@media (max-width: ${breakpoints.tablet}px)`,
  tabletAndAbove: `@media (min-width: ${breakpoints.mobile + 1}px)`,
} as const;

// =============================================================================
// SPACING ALIASES
// =============================================================================

export const spacingAliases = {
  xs: spacing[1],   // 4px
  sm: spacing[2],   // 8px  
  md: spacing[4],   // 16px
  lg: spacing[8],   // 32px
  xl: spacing[12],  // 48px
} as const;

// =============================================================================
// MAIN DESIGN TOKENS EXPORT
// =============================================================================

export const designTokens = {
  colors: {
    // Legacy color scales for backward compatibility
    primary: {
      50: primaryColors.lightBlue,    // #f3f7ff
      100: primaryColors.lightBlueAlt, // #f0f5ff
      500: primaryColors.brandBlue,    // #0272c3
      600: primaryColors.darkBlue,     // #455f87
      700: '#2c4666',                 // Darker variant
    },
    neutral: {
      50: neutralColors.gray50,       // #FAFAFA
      100: neutralColors.gray100,     // #f5f6f7
      200: neutralColors.gray200,     // #E8E8E8
      300: neutralColors.gray300,     // #D9D9D9
      400: neutralColors.gray400,     // #BFBFBF
      500: neutralColors.gray500,     // #8C8C8C
      600: neutralColors.gray600,     // #595959
      700: neutralColors.gray700,     // #434343
      800: neutralColors.gray800,     // #262626
      900: neutralColors.gray900,     // #1F1F1F
    },
    success: {
      50: '#E8F5E8',
      100: '#D4EDD4',
      500: statusColors.success,      // #50c878
      600: '#2E7D32',
      700: '#1B5E20',
    },
    warning: {
      50: '#FFF3E0',
      100: '#FFE0B2',
      500: statusColors.warning,      // #FA8C16
      600: '#F57C00',
      700: '#E65100',
    },
    error: {
      50: '#FFEBEE',
      100: '#FFCDD2',
      500: statusColors.error,        // #FF4D4F
      600: '#C62828',
      700: '#B71C1C',
    },
    info: {
      50: '#E3F2FD',
      100: '#BBDEFB',
      500: statusColors.info,         // #1890FF
      600: '#1565C0',
      700: '#0D47A1',
    },
    // Modern semantic colors
    brand: primaryColors,
    status: statusColors,
    accent: accentColors,
    interaction: interactionColors,
    semantic: semanticColors,
  },
  typography,
  spacing: {
    ...spacing,
    aliases: spacingAliases,
  },
  dimensions,
  breakpoints,
  mediaQueries,
  borderRadius,
  shadows,
  zIndex,
  animation,
} as const;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type DesignTokens = typeof designTokens;
export type ColorPalette = typeof primaryColors;
export type SpacingScale = typeof spacing;
export type TypographyScale = typeof typography;
export type ShadowScale = typeof shadows;
export type AnimationScale = typeof animation;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get a design token value with fallback
 */
export const getToken = <T>(value: T | undefined, fallback: T): T => {
  return value !== undefined ? value : fallback;
};

/**
 * Create a CSS custom property name
 */
export const toCSSVar = (tokenPath: string): string => {
  return `--rescale-${tokenPath.replace(/\./g, '-')}`;
};

/**
 * Get responsive font size based on screen size
 */
export const getResponsiveFontSize = (size: keyof typeof typography.fontSize) => {
  const baseSize = typography.fontSize[size];
  
  // Responsive scaling for larger fonts
  if (typeof baseSize === 'number' && baseSize >= 24) {
    return {
      fontSize: `${baseSize}px`,
      [`${mediaQueries.tablet}`]: {
        fontSize: `${Math.max(baseSize * 0.8, 16)}px`,
      },
    };
  }
  
  return { fontSize: `${baseSize}px` };
};

export default designTokens;