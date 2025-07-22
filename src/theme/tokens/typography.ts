/**
 * Design Tokens - Typography
 * Generated from Figma design system
 * 
 * @fileoverview Typography tokens for the Rescale design system
 */

export const typography = {
  "fontFamily": {
    "base": "\"Inter\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif",
    "mono": "\"JetBrains Mono\", \"SF Mono\", \"Monaco\", \"Inconsolata\", \"Fira Code\", monospace"
  },
  "fontSize": {
    "xs": "12px",
    "sm": "14px",
    "base": "16px",
    "lg": "18px",
    "xl": "20px",
    "2xl": "24px",
    "3xl": "30px",
    "4xl": "36px",
    "5xl": "48px"
  },
  "fontWeight": {
    "light": 300,
    "normal": 400,
    "medium": 500,
    "semibold": 600,
    "bold": 700
  },
  "lineHeight": {
    "tight": 1.2,
    "normal": 1.5,
    "relaxed": 1.75
  },
  "letterSpacing": {
    "tight": "-0.025em",
    "normal": "0",
    "wide": "0.025em"
  }
} as const;

export type TypographyToken = keyof typeof typography;
export type FontFamily = keyof typeof typography.fontFamily;
export type FontSize = keyof typeof typography.fontSize;
export type FontWeight = keyof typeof typography.fontWeight;
export type LineHeight = keyof typeof typography.lineHeight;
export type LetterSpacing = keyof typeof typography.letterSpacing;

export default typography;
