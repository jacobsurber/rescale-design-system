#!/usr/bin/env node

import readline from 'readline';
import fs from 'fs';
import path from 'path';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function figmaRequest(apiKey, endpoint) {
  const response = await fetch(`https://api.figma.com/v1/${endpoint}`, {
    headers: {
      'X-Figma-Token': apiKey
    }
  });
  
  if (!response.ok) {
    throw new Error(`Figma API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

function rgbToHex(r, g, b) {
  return `#${Math.round(r * 255).toString(16).padStart(2, '0')}${Math.round(g * 255).toString(16).padStart(2, '0')}${Math.round(b * 255).toString(16).padStart(2, '0')}`;
}

function extractColorsFromNode(node, colors = {}) {
  // Extract colors from fills
  if (node.fills && Array.isArray(node.fills)) {
    node.fills.forEach((fill, index) => {
      if (fill.type === 'SOLID' && fill.color) {
        const hex = rgbToHex(fill.color.r, fill.color.g, fill.color.b);
        const name = node.name ? `${node.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-fill-${index}` : `color-${Math.random().toString(36).substr(2, 9)}`;
        colors[name] = {
          hex,
          rgb: fill.color,
          opacity: fill.opacity || 1,
          source: 'fill',
          nodeName: node.name
        };
      }
    });
  }
  
  // Extract colors from strokes
  if (node.strokes && Array.isArray(node.strokes)) {
    node.strokes.forEach((stroke, index) => {
      if (stroke.type === 'SOLID' && stroke.color) {
        const hex = rgbToHex(stroke.color.r, stroke.color.g, stroke.color.b);
        const name = node.name ? `${node.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-stroke-${index}` : `stroke-${Math.random().toString(36).substr(2, 9)}`;
        colors[name] = {
          hex,
          rgb: stroke.color,
          opacity: stroke.opacity || 1,
          source: 'stroke',
          nodeName: node.name
        };
      }
    });
  }
  
  // Recursively process children
  if (node.children) {
    node.children.forEach(child => extractColorsFromNode(child, colors));
  }
  
  return colors;
}

async function extractColors(apiKey, fileId) {
  console.log('🎨 Extracting colors from Figma file...');
  
  try {
    // Get file data
    const fileData = await figmaRequest(apiKey, `files/${fileId}`);
    
    // Extract colors from all nodes
    const allColors = extractColorsFromNode(fileData.document);
    
    // Also get published color styles
    try {
      const stylesData = await figmaRequest(apiKey, `files/${fileId}/styles`);
      
      if (stylesData.meta && stylesData.meta.styles) {
        for (const style of stylesData.meta.styles) {
          if (style.style_type === 'FILL') {
            try {
              const styleDetails = await figmaRequest(apiKey, `styles/${style.key}`);
              if (styleDetails.style && styleDetails.style.fills && styleDetails.style.fills[0]) {
                const fill = styleDetails.style.fills[0];
                if (fill.color) {
                  const hex = rgbToHex(fill.color.r, fill.color.g, fill.color.b);
                  const name = style.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
                  allColors[name] = {
                    hex,
                    rgb: fill.color,
                    opacity: fill.opacity || 1,
                    source: 'style',
                    styleName: style.name,
                    description: style.description || ''
                  };
                }
              }
            } catch (styleError) {
              console.warn(`⚠️ Could not fetch style ${style.name}: ${styleError.message}`);
            }
          }
        }
      }
    } catch (stylesError) {
      console.warn('⚠️ Could not fetch color styles, using colors from nodes only');
    }
    
    return allColors;
  } catch (error) {
    throw new Error(`Failed to extract colors: ${error.message}`);
  }
}

function organizeColors(colors) {
  const organized = {
    primary: {},
    secondary: {},
    neutral: {},
    semantic: {
      success: {},
      warning: {},
      error: {},
      info: {}
    },
    other: {}
  };
  
  Object.entries(colors).forEach(([name, colorData]) => {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('primary') || lowerName.includes('brand')) {
      organized.primary[name] = colorData;
    } else if (lowerName.includes('secondary')) {
      organized.secondary[name] = colorData;
    } else if (lowerName.includes('gray') || lowerName.includes('grey') || lowerName.includes('neutral')) {
      organized.neutral[name] = colorData;
    } else if (lowerName.includes('success') || lowerName.includes('green')) {
      organized.semantic.success[name] = colorData;
    } else if (lowerName.includes('warning') || lowerName.includes('yellow')) {
      organized.semantic.warning[name] = colorData;
    } else if (lowerName.includes('error') || lowerName.includes('danger') || lowerName.includes('red')) {
      organized.semantic.error[name] = colorData;
    } else if (lowerName.includes('info') || lowerName.includes('blue')) {
      organized.semantic.info[name] = colorData;
    } else {
      organized.other[name] = colorData;
    }
  });
  
  return organized;
}

function generateColorFiles(colors, outputDir) {
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Generate CSS custom properties
  const cssContent = Object.entries(colors)
    .map(([name, data]) => `  --color-${name}: ${data.hex};`)
    .join('\n');
  
  fs.writeFileSync(
    path.join(outputDir, 'colors.css'),
    `:root {\n${cssContent}\n}\n`
  );
  
  // Generate JavaScript object
  const jsColors = Object.fromEntries(
    Object.entries(colors).map(([name, data]) => [name, data.hex])
  );
  
  fs.writeFileSync(
    path.join(outputDir, 'colors.js'),
    `export const colors = ${JSON.stringify(jsColors, null, 2)};\n`
  );
  
  // Generate SCSS variables
  const scssContent = Object.entries(colors)
    .map(([name, data]) => `$color-${name}: ${data.hex};`)
    .join('\n');
  
  fs.writeFileSync(path.join(outputDir, 'colors.scss'), scssContent + '\n');
  
  // Generate detailed JSON with metadata
  fs.writeFileSync(
    path.join(outputDir, 'colors-detailed.json'),
    JSON.stringify(colors, null, 2)
  );
  
  // Generate organized colors
  const organized = organizeColors(colors);
  fs.writeFileSync(
    path.join(outputDir, 'colors-organized.json'),
    JSON.stringify(organized, null, 2)
  );
  
  // Generate TypeScript definitions
  const tsContent = `export interface ColorPalette {
${Object.keys(jsColors).map(name => `  '${name}': string;`).join('\n')}
}

export declare const colors: ColorPalette;
`;
  
  fs.writeFileSync(path.join(outputDir, 'colors.d.ts'), tsContent);
}

async function main() {
  console.log('🎨 Figma Color Extractor');
  console.log('========================\n');
  
  try {
    const apiKey = await prompt('Enter your Figma API token: ');
    if (!apiKey) {
      console.error('❌ API token is required!');
      process.exit(1);
    }
    
    const fileId = await prompt('Enter your Figma file ID: ');
    if (!fileId) {
      console.error('❌ File ID is required!');
      process.exit(1);
    }
    
    const outputDir = await prompt('Output directory (default: figma-colors): ') || 'figma-colors';
    
    console.log('\n🚀 Extracting colors...\n');
    
    const colors = await extractColors(apiKey, fileId);
    const colorCount = Object.keys(colors).length;
    
    console.log(`✅ Found ${colorCount} unique colors`);
    
    if (colorCount === 0) {
      console.log('⚠️ No colors found in the Figma file');
      return;
    }
    
    console.log('\n💾 Generating color files...');
    generateColorFiles(colors, outputDir);
    
    console.log(`✅ Files saved to ${outputDir}/:`);
    console.log('   - colors.css (CSS custom properties)');
    console.log('   - colors.js (JavaScript object)');
    console.log('   - colors.scss (Sass variables)');
    console.log('   - colors.d.ts (TypeScript definitions)');
    console.log('   - colors-detailed.json (with metadata)');
    console.log('   - colors-organized.json (organized by category)');
    
    console.log('\n🎉 Color extraction complete!');
    
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  } finally {
    rl.close();
  }
}

process.on('unhandledRejection', (error) => {
  console.error('\n❌ Unexpected error:', error.message);
  rl.close();
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('\n\n👋 Extraction cancelled by user');
  rl.close();
  process.exit(0);
});

main();