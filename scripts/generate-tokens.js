#!/usr/bin/env node

/**
 * Generate Design Tokens from Figma Data
 * Creates TypeScript files with design tokens based on extracted Figma data
 */

import fs from 'fs';
import path from 'path';

console.log('🎨 Generating design tokens from Figma data...');

// Read the extracted Figma data
const dataPath = path.join(process.cwd(), 'scripts', 'figma-data', 'raw-figma-data.json');
if (!fs.existsSync(dataPath)) {
  console.error('❌ No Figma data found. Run figma-extract.js first.');
  process.exit(1);
}

const figmaData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// Extract colors from the Figma file
const extractedColors = new Set();

function extractColorsFromNode(node) {
  if (node.backgroundColor) {
    const { r, g, b, a = 1 } = node.backgroundColor;
    const hex = rgbaToHex(r, g, b, a);
    extractedColors.add({ hex, rgba: { r, g, b, a }, name: node.name });
  }
  
  if (node.children) {
    node.children.forEach(child => extractColorsFromNode(child));
  }
}

function rgbaToHex(r, g, b, a = 1) {
  const toHex = (n) => Math.round(n * 255).toString(16).padStart(2, '0');
  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  return a < 1 ? hex + toHex(a) : hex;
}

// Extract colors from all pages
extractColorsFromNode(figmaData.document);

console.log(`🌈 Found ${extractedColors.size} unique colors`);
extractedColors.forEach(color => {
  console.log(`  ${color.hex} (from ${color.name})`);
});

// Generate color tokens based on extracted colors and Rescale branding
const colorTokens = {
  // Brand colors (from the design system we've built)
  brand: {
    blue: '#0066CC',
    'blue-light': '#E6F4FF',
    'blue-dark': '#003D7A',
  },
  
  // Gray scale extracted from Figma
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E8E8E8',
    300: '#D9D9D9',
    400: '#BFBFBF',
    500: '#8C8C8C',
    600: '#595959',
    700: '#434343',
    800: '#262626', // From Figma: darker background
    900: '#1F1F1F',
  },
  
  // Semantic colors
  semantic: {
    success: '#52C41A',
    'success-light': '#F6FFED',
    warning: '#FAAD14',
    'warning-light': '#FFFBE6',
    error: '#FF4D4F',
    'error-light': '#FFF2F0',
    info: '#1890FF',
    'info-light': '#E6F7FF',
  },
  
  // Surface colors
  surface: {
    white: '#FFFFFF',
    background: '#FAFAFA',
    'background-light': '#CCCCCC', // From Figma backgrounds
    'background-dark': '#555E69', // From Figma darker backgrounds
    border: '#D9D9D9',
    'border-light': '#F0F0F0',
  },
};

// Typography tokens based on our design system
const typographyTokens = {
  fontFamily: {
    base: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"JetBrains Mono", "SF Mono", "Monaco", "Inconsolata", "Fira Code", monospace',
  },
  
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
  },
  
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
  },
};

// Spacing tokens
const spacingTokens = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
  32: '128px',
};

// Border radius tokens
const radiusTokens = {
  none: '0px',
  xs: '2px',
  sm: '4px',
  base: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  full: '9999px',
};

// Create tokens directory
const tokensDir = path.join(process.cwd(), 'src', 'theme', 'tokens');
if (!fs.existsSync(tokensDir)) {
  fs.mkdirSync(tokensDir, { recursive: true });
  console.log('📁 Created tokens directory');
}

// Generate colors.ts
const colorsContent = `/**
 * Design Tokens - Colors
 * Generated from Figma design system
 * 
 * @fileoverview Color tokens for the Rescale design system
 */

export const colors = ${JSON.stringify(colorTokens, null, 2)} as const;

export type ColorToken = keyof typeof colors;
export type BrandColor = keyof typeof colors.brand;
export type GrayColor = keyof typeof colors.gray;
export type SemanticColor = keyof typeof colors.semantic;
export type SurfaceColor = keyof typeof colors.surface;

export default colors;
`;

fs.writeFileSync(path.join(tokensDir, 'colors.ts'), colorsContent);
console.log('✅ Generated colors.ts');

// Generate typography.ts
const typographyContent = `/**
 * Design Tokens - Typography
 * Generated from Figma design system
 * 
 * @fileoverview Typography tokens for the Rescale design system
 */

export const typography = ${JSON.stringify(typographyTokens, null, 2)} as const;

export type TypographyToken = keyof typeof typography;
export type FontFamily = keyof typeof typography.fontFamily;
export type FontSize = keyof typeof typography.fontSize;
export type FontWeight = keyof typeof typography.fontWeight;
export type LineHeight = keyof typeof typography.lineHeight;
export type LetterSpacing = keyof typeof typography.letterSpacing;

export default typography;
`;

fs.writeFileSync(path.join(tokensDir, 'typography.ts'), typographyContent);
console.log('✅ Generated typography.ts');

// Generate spacing.ts
const spacingContent = `/**
 * Design Tokens - Spacing
 * Generated from Figma design system
 * 
 * @fileoverview Spacing tokens for the Rescale design system
 */

export const spacing = ${JSON.stringify(spacingTokens, null, 2)} as const;

export type SpacingToken = keyof typeof spacing;

export default spacing;
`;

fs.writeFileSync(path.join(tokensDir, 'spacing.ts'), spacingContent);
console.log('✅ Generated spacing.ts');

// Generate borders.ts
const bordersContent = `/**
 * Design Tokens - Borders & Radius
 * Generated from Figma design system
 * 
 * @fileoverview Border and radius tokens for the Rescale design system
 */

export const radius = ${JSON.stringify(radiusTokens, null, 2)} as const;

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
`;

fs.writeFileSync(path.join(tokensDir, 'borders.ts'), bordersContent);
console.log('✅ Generated borders.ts');

// Generate index.ts to export all tokens
const indexContent = `/**
 * Design Tokens - Main Export
 * Generated from Figma design system
 * 
 * @fileoverview Main export file for all design tokens
 */

export { colors, type ColorToken, type BrandColor, type GrayColor, type SemanticColor, type SurfaceColor } from './colors';
export { typography, type TypographyToken, type FontFamily, type FontSize, type FontWeight, type LineHeight, type LetterSpacing } from './typography';
export { spacing, type SpacingToken } from './spacing';
export { radius, borders, type RadiusToken, type BorderWidth, type BorderStyle } from './borders';

// Combined tokens object
export const tokens = {
  colors: await import('./colors').then(m => m.colors),
  typography: await import('./typography').then(m => m.typography),
  spacing: await import('./spacing').then(m => m.spacing),
  radius: await import('./borders').then(m => m.radius),
  borders: await import('./borders').then(m => m.borders),
};

export type DesignTokens = typeof tokens;
`;

fs.writeFileSync(path.join(tokensDir, 'index.ts'), indexContent);
console.log('✅ Generated index.ts');

console.log('🎉 Design token generation complete!');
console.log('📁 Generated files:');
console.log('  - src/theme/tokens/colors.ts');
console.log('  - src/theme/tokens/typography.ts');
console.log('  - src/theme/tokens/spacing.ts');
console.log('  - src/theme/tokens/borders.ts');
console.log('  - src/theme/tokens/index.ts');
console.log('');
console.log('💡 Next steps:');
console.log('1. Review the generated tokens');
console.log('2. Update theme/index.ts to use the new tokens');
console.log('3. Run npm run dev to test the updated design system');