/**
 * Design Tokens - Borders & Radius
 * Generated from Figma design system
 * 
 * @fileoverview Border and radius tokens for the Rescale design system
 */

export const radius = {
  "none": "0px",
  "xs": "2px",
  "sm": "4px",
  "base": "6px",
  "md": "8px",
  "lg": "12px",
  "xl": "16px",
  "2xl": "24px",
  "full": "9999px"
} as const;

export const borders = {
  width: {
    none: '0px',
    thin: '1px',
    thick: '2px',
    extra: '4px',
  },
  style: {
    solid: 'solid',
    dashed: 'dashed',
    dotted: 'dotted',
  },
} as const;

export type RadiusToken = keyof typeof radius;
export type BorderWidth = keyof typeof borders.width;
export type BorderStyle = keyof typeof borders.style;

export default { radius, borders };
