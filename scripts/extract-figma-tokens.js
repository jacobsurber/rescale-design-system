#!/usr/bin/env node

/**
 * Figma Design Token Extraction Script
 * Extracts design tokens from Figma file and generates design system files
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Figma API configuration
const FIGMA_FILE_ID = 'B0H99zI9iTyU7vusGYP3rk';
const FIGMA_API_BASE = 'https://api.figma.com/v1';

/**
 * Fetch Figma file data
 * @param {string} accessToken - Figma Personal Access Token
 */
async function fetchFigmaFile(accessToken) {
  if (!accessToken) {
    console.error('❌ Figma access token is required');
    console.log('To get your token:');
    console.log('1. Go to https://www.figma.com/developers/api#access-tokens');
    console.log('2. Click "Generate new token"');
    console.log('3. Run: node scripts/extract-figma-tokens.js YOUR_TOKEN');
    process.exit(1);
  }

  try {
    console.log('🔍 Fetching Figma file data...');
    console.log(`📁 File ID: ${FIGMA_FILE_ID}`);
    
    const response = await fetch(`${FIGMA_API_BASE}/files/${FIGMA_FILE_ID}`, {
      headers: {
        'X-Figma-Token': accessToken
      }
    });

    console.log(`📡 Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error: ${response.status} - ${errorText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Successfully fetched file data`);
    console.log(`📊 Document name: ${data.name}`);
    console.log(`📋 Pages: ${data.document.children.length}`);
    
    return data;
  } catch (error) {
    console.error('❌ Failed to fetch Figma file:', error.message);
    process.exit(1);
  }
}

/**
 * Extract color tokens from Figma styles
 */
function extractColors(figmaData) {
  const colors = {
    primary: {},
    secondary: {},
    neutral: {},
    semantic: {}
  };

  // Extract from document styles
  if (figmaData.styles) {
    Object.values(figmaData.styles).forEach(style => {
      if (style.styleType === 'FILL') {
        const colorName = style.name.toLowerCase();
        const colorValue = extractColorValue(style);
        
        // Categorize colors
        if (colorName.includes('primary') || colorName.includes('brand')) {
          colors.primary[style.name] = colorValue;
        } else if (colorName.includes('secondary') || colorName.includes('accent')) {
          colors.secondary[style.name] = colorValue;
        } else if (colorName.includes('gray') || colorName.includes('neutral')) {
          colors.neutral[style.name] = colorValue;
        } else if (colorName.includes('success') || colorName.includes('error') || 
                   colorName.includes('warning') || colorName.includes('info')) {
          colors.semantic[style.name] = colorValue;
        }
      }
    });
  }

  return colors;
}

/**
 * Extract color value from style
 */
function extractColorValue(style) {
  // This would need to parse the actual color data from Figma
  // Placeholder implementation
  return '#000000';
}

/**
 * Extract typography tokens
 */
function extractTypography(figmaData) {
  const typography = {
    fontFamilies: [],
    fontSizes: {},
    fontWeights: {},
    lineHeights: {}
  };

  if (figmaData.styles) {
    Object.values(figmaData.styles).forEach(style => {
      if (style.styleType === 'TEXT') {
        typography.fontSizes[style.name] = extractFontSize(style);
        typography.fontWeights[style.name] = extractFontWeight(style);
        typography.lineHeights[style.name] = extractLineHeight(style);
      }
    });
  }

  return typography;
}

/**
 * Generate design token files
 */
function generateTokenFiles(tokens) {
  const tokensDir = path.join(process.cwd(), 'src/theme/tokens');
  
  // Ensure tokens directory exists
  if (!fs.existsSync(tokensDir)) {
    fs.mkdirSync(tokensDir, { recursive: true });
  }

  // Generate colors.ts
  const colorsContent = `// Generated from Figma design system
export const colors = ${JSON.stringify(tokens.colors, null, 2)};

export default colors;
`;

  fs.writeFileSync(path.join(tokensDir, 'colors.ts'), colorsContent);

  // Generate typography.ts
  const typographyContent = `// Generated from Figma design system  
export const typography = ${JSON.stringify(tokens.typography, null, 2)};

export default typography;
`;

  fs.writeFileSync(path.join(tokensDir, 'typography.ts'), typographyContent);

  console.log('✅ Design token files generated successfully!');
  console.log('📁 Files created:');
  console.log('  - src/theme/tokens/colors.ts');
  console.log('  - src/theme/tokens/typography.ts');
}

/**
 * Main extraction function
 */
async function main() {
  const accessToken = process.argv[2];
  
  try {
    const figmaData = await fetchFigmaFile(accessToken);
    
    console.log('📊 Extracting design tokens...');
    
    const tokens = {
      colors: extractColors(figmaData),
      typography: extractTypography(figmaData)
    };

    generateTokenFiles(tokens);
    
    console.log('🎉 Design token extraction complete!');
    console.log('💡 Next steps:');
    console.log('  1. Review the generated token files');
    console.log('  2. Run: npm run dev to see the updated design system');
    console.log('  3. Update components to use the new tokens');
    
  } catch (error) {
    console.error('❌ Extraction failed:', error.message);
    process.exit(1);
  }
}

// Helper functions (placeholders - would need full implementation)
function extractFontSize(style) { return '16px'; }
function extractFontWeight(style) { return 400; }
function extractLineHeight(style) { return 1.5; }

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main, fetchFigmaFile, extractColors, extractTypography };