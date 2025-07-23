#!/usr/bin/env node

import readline from 'readline';
import fs from 'fs';
import path from 'path';

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to prompt user for input
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

// Helper function to make Figma API requests
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

// Extract design tokens from Figma
async function extractDesignTokens(apiKey, fileId) {
  console.log('🎨 Extracting design tokens...');
  
  try {
    // Get file data
    const fileData = await figmaRequest(apiKey, `files/${fileId}`);
    
    // Get styles (colors, text styles, etc.)
    const stylesData = await figmaRequest(apiKey, `files/${fileId}/styles`);
    
    const tokens = {
      colors: {},
      typography: {},
      spacing: {},
      effects: {}
    };
    
    // Process styles
    if (stylesData.meta && stylesData.meta.styles) {
      for (const style of stylesData.meta.styles) {
        // Get individual style details
        try {
          const styleDetails = await figmaRequest(apiKey, `styles/${style.key}`);
          
          if (style.style_type === 'FILL') {
            // Color tokens
            const colorName = style.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
            tokens.colors[colorName] = styleDetails.style;
          } else if (style.style_type === 'TEXT') {
            // Typography tokens
            const typeName = style.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
            tokens.typography[typeName] = styleDetails.style;
          } else if (style.style_type === 'EFFECT') {
            // Effect tokens (shadows, etc.)
            const effectName = style.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
            tokens.effects[effectName] = styleDetails.style;
          }
        } catch (styleError) {
          console.warn(`⚠️ Could not fetch style ${style.name}: ${styleError.message}`);
        }
      }
    }
    
    // Process document for spacing/sizing patterns
    function traverseNode(node, depth = 0) {
      if (node.type === 'FRAME' || node.type === 'COMPONENT') {
        // Extract spacing patterns
        if (node.paddingLeft || node.paddingTop || node.paddingRight || node.paddingBottom) {
          const spacingKey = `spacing-${Math.max(node.paddingLeft || 0, node.paddingTop || 0)}`;
          tokens.spacing[spacingKey] = Math.max(
            node.paddingLeft || 0,
            node.paddingTop || 0,
            node.paddingRight || 0,
            node.paddingBottom || 0
          );
        }
        
        // Extract gap/spacing from auto-layout
        if (node.itemSpacing) {
          const gapKey = `gap-${node.itemSpacing}`;
          tokens.spacing[gapKey] = node.itemSpacing;
        }
      }
      
      // Recursively process children
      if (node.children) {
        node.children.forEach(child => traverseNode(child, depth + 1));
      }
    }
    
    if (fileData.document) {
      traverseNode(fileData.document);
    }
    
    return tokens;
  } catch (error) {
    throw new Error(`Failed to extract design tokens: ${error.message}`);
  }
}

// Extract components from Figma
async function extractComponents(apiKey, fileId) {
  console.log('🧩 Extracting components...');
  
  try {
    const fileData = await figmaRequest(apiKey, `files/${fileId}`);
    const components = {};
    
    function findComponents(node) {
      if (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') {
        const componentName = node.name.replace(/[^a-zA-Z0-9]/g, '');
        components[componentName] = {
          id: node.id,
          name: node.name,
          type: node.type,
          description: node.description || '',
          properties: {}
        };
        
        // Extract component properties for component sets
        if (node.type === 'COMPONENT_SET' && node.componentPropertyDefinitions) {
          components[componentName].properties = node.componentPropertyDefinitions;
        }
        
        // Extract basic styling info
        if (node.fills) {
          components[componentName].fills = node.fills;
        }
        if (node.strokes) {
          components[componentName].strokes = node.strokes;
        }
        if (node.effects) {
          components[componentName].effects = node.effects;
        }
      }
      
      if (node.children) {
        node.children.forEach(findComponents);
      }
    }
    
    if (fileData.document) {
      findComponents(fileData.document);
    }
    
    return components;
  } catch (error) {
    throw new Error(`Failed to extract components: ${error.message}`);
  }
}

// Convert colors to various formats
function convertColors(colors) {
  const converted = {
    css: {},
    js: {},
    scss: {},
    json: {}
  };
  
  Object.entries(colors).forEach(([name, colorData]) => {
    if (colorData.fills && colorData.fills[0] && colorData.fills[0].color) {
      const color = colorData.fills[0].color;
      const r = Math.round(color.r * 255);
      const g = Math.round(color.g * 255);
      const b = Math.round(color.b * 255);
      const a = color.a || 1;
      
      const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      const rgba = a < 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : hex;
      
      // CSS custom properties
      converted.css[`--color-${name}`] = rgba;
      
      // JavaScript object
      converted.js[name] = rgba;
      
      // SCSS variables
      converted.scss[`$color-${name}`] = rgba;
      
      // JSON
      converted.json[name] = rgba;
    }
  });
  
  return converted;
}

// Save extracted data to files
function saveToFiles(tokens, components, outputDir = 'figma-data') {
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Save design tokens
  fs.writeFileSync(
    path.join(outputDir, 'design-tokens.json'),
    JSON.stringify(tokens, null, 2)
  );
  
  // Save components
  fs.writeFileSync(
    path.join(outputDir, 'components.json'),
    JSON.stringify(components, null, 2)
  );
  
  // Convert and save colors in different formats
  if (tokens.colors && Object.keys(tokens.colors).length > 0) {
    const convertedColors = convertColors(tokens.colors);
    
    // CSS file
    const cssContent = Object.entries(convertedColors.css)
      .map(([prop, value]) => `  ${prop}: ${value};`)
      .join('\n');
    fs.writeFileSync(
      path.join(outputDir, 'colors.css'),
      `:root {\n${cssContent}\n}`
    );
    
    // JavaScript file
    const jsContent = `export const colors = ${JSON.stringify(convertedColors.js, null, 2)};`;
    fs.writeFileSync(path.join(outputDir, 'colors.js'), jsContent);
    
    // SCSS file
    const scssContent = Object.entries(convertedColors.scss)
      .map(([variable, value]) => `${variable}: ${value};`)
      .join('\n');
    fs.writeFileSync(path.join(outputDir, 'colors.scss'), scssContent);
    
    // JSON file
    fs.writeFileSync(
      path.join(outputDir, 'colors.json'),
      JSON.stringify(convertedColors.json, null, 2)
    );
  }
  
  console.log(`✅ Files saved to ${outputDir}/`);
  console.log('   - design-tokens.json');
  console.log('   - components.json');
  console.log('   - colors.css');
  console.log('   - colors.js');
  console.log('   - colors.scss');
  console.log('   - colors.json');
}

// Main extraction function
async function main() {
  console.log('🎨 Figma Design Token & Component Extractor');
  console.log('============================================\n');
  
  try {
    // Get Figma API token
    const apiKey = await prompt('Enter your Figma API token: ');
    if (!apiKey) {
      console.error('❌ API token is required!');
      process.exit(1);
    }
    
    // Get Figma file ID
    const fileId = await prompt('Enter your Figma file ID (from the URL): ');
    if (!fileId) {
      console.error('❌ File ID is required!');
      process.exit(1);
    }
    
    // Ask for output directory
    const outputDir = await prompt('Output directory (default: figma-data): ') || 'figma-data';
    
    console.log('\n🚀 Starting extraction...\n');
    
    // Extract design tokens
    const tokens = await extractDesignTokens(apiKey, fileId);
    console.log(`✅ Extracted ${Object.keys(tokens.colors).length} colors`);
    console.log(`✅ Extracted ${Object.keys(tokens.typography).length} typography styles`);
    console.log(`✅ Extracted ${Object.keys(tokens.spacing).length} spacing tokens`);
    console.log(`✅ Extracted ${Object.keys(tokens.effects).length} effects`);
    
    // Extract components
    const components = await extractComponents(apiKey, fileId);
    console.log(`✅ Extracted ${Object.keys(components).length} components`);
    
    // Save to files
    console.log('\n💾 Saving files...');
    saveToFiles(tokens, components, outputDir);
    
    console.log('\n🎉 Extraction complete!');
    console.log('\nNext steps:');
    console.log('1. Review the extracted tokens in the output files');
    console.log('2. Import colors.js or colors.css into your project');
    console.log('3. Use design-tokens.json to update your theme configuration');
    console.log('4. Check components.json for component specifications');
    
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Handle errors gracefully
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

// Run the extractor
main();