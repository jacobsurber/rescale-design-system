/**
 * Design Tokens - Colors
 * Generated from Figma design system
 * 
 * @fileoverview Color tokens for the Rescale design system
 */

export const colors = {
  "brand": {
    "blue": "#0066CC",
    "blue-light": "#E6F4FF",
    "blue-dark": "#003D7A"
  },
  "gray": {
    "50": "#FAFAFA",
    "100": "#F5F5F5",
    "200": "#E8E8E8",
    "300": "#D9D9D9",
    "400": "#BFBFBF",
    "500": "#8C8C8C",
    "600": "#595959",
    "700": "#434343",
    "800": "#262626",
    "900": "#1F1F1F"
  },
  "semantic": {
    "success": "#52C41A",
    "success-light": "#F6FFED",
    "warning": "#FAAD14",
    "warning-light": "#FFFBE6",
    "error": "#FF4D4F",
    "error-light": "#FFF2F0",
    "info": "#1890FF",
    "info-light": "#E6F7FF"
  },
  "surface": {
    "white": "#FFFFFF",
    "background": "#FAFAFA",
    "background-light": "#CCCCCC",
    "background-dark": "#555E69",
    "border": "#D9D9D9",
    "border-light": "#F0F0F0"
  }
} as const;

export type ColorToken = keyof typeof colors;
export type BrandColor = keyof typeof colors.brand;
export type GrayColor = keyof typeof colors.gray;
export type SemanticColor = keyof typeof colors.semantic;
export type SurfaceColor = keyof typeof colors.surface;

export default colors;
