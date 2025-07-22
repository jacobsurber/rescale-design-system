#!/usr/bin/env node

/**
 * Figma Styles Extractor
 * Fetches design styles from Figma file
 */

import fs from 'fs';
import path from 'path';

const FIGMA_FILE_ID = 'B0H99zI9iTyU7vusGYP3rk';
const FIGMA_API_BASE = 'https://api.figma.com/v1';

const accessToken = process.argv[2];

if (!accessToken) {
  console.error('❌ Please provide your Figma access token');
  process.exit(1);
}

console.log('🎨 Fetching Figma styles...');

try {
  // Fetch styles from the file
  const response = await fetch(`${FIGMA_API_BASE}/files/${FIGMA_FILE_ID}/styles`, {
    headers: {
      'X-Figma-Token': accessToken
    }
  });

  console.log(`📡 Styles response status: ${response.status}`);

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ API Error: ${response.status} - ${errorText}`);
    process.exit(1);
  }

  const stylesData = await response.json();
  console.log(`✅ Successfully fetched styles data`);
  
  if (stylesData.meta && stylesData.meta.styles) {
    const styles = stylesData.meta.styles;
    console.log(`🎨 Found ${styles.length} styles`);
    
    // Group styles by type
    const colorStyles = styles.filter(style => style.style_type === 'FILL');
    const textStyles = styles.filter(style => style.style_type === 'TEXT');
    const effectStyles = styles.filter(style => style.style_type === 'EFFECT');
    
    console.log(`🌈 Color styles: ${colorStyles.length}`);
    console.log(`📝 Text styles: ${textStyles.length}`);
    console.log(`✨ Effect styles: ${effectStyles.length}`);
    
    // Log some examples
    if (colorStyles.length > 0) {
      console.log('\n🌈 Color Styles:');
      colorStyles.slice(0, 10).forEach(style => {
        console.log(`  - ${style.name} (${style.key})`);
      });
      if (colorStyles.length > 10) {
        console.log(`  ... and ${colorStyles.length - 10} more`);
      }
    }
    
    if (textStyles.length > 0) {
      console.log('\n📝 Text Styles:');
      textStyles.slice(0, 10).forEach(style => {
        console.log(`  - ${style.name} (${style.key})`);
      });
      if (textStyles.length > 10) {
        console.log(`  ... and ${textStyles.length - 10} more`);
      }
    }
  }

  // Save styles data
  const outputDir = path.join(process.cwd(), 'scripts', 'figma-data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const outputFile = path.join(outputDir, 'figma-styles.json');
  fs.writeFileSync(outputFile, JSON.stringify(stylesData, null, 2));
  console.log(`💾 Styles data saved to: ${outputFile}`);
  
  console.log('🎉 Styles extraction complete!');
  
} catch (error) {
  console.error('❌ Failed to fetch Figma styles:', error.message);
  process.exit(1);
}