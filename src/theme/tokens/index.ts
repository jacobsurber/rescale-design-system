/**
 * Design Tokens - Main Export
 * Generated from Figma design system
 * 
 * @fileoverview Main export file for all design tokens
 */

export { colors, type ColorToken, type BrandColor, type GrayColor, type SemanticColor, type SurfaceColor } from './colors';
export { typography, type TypographyToken, type FontFamily, type FontSize, type FontWeight, type LineHeight, type LetterSpacing } from './typography';
export { spacing, type SpacingToken } from './spacing';
export { radius, borders, type RadiusToken, type BorderWidth, type BorderStyle } from './borders';

import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { radius, borders } from './borders';

// Combined tokens object
export const tokens = {
  colors,
  typography,
  spacing,
  radius,
  borders,
};

export type DesignTokens = typeof tokens;
