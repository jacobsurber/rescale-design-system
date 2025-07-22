#!/usr/bin/env node

/**
 * Simple Figma Design Token Extractor
 */

import fs from 'fs';
import path from 'path';

const FIGMA_FILE_ID = 'B0H99zI9iTyU7vusGYP3rk';
const FIGMA_API_BASE = 'https://api.figma.com/v1';

console.log('🚀 Starting Figma design token extraction...');

const accessToken = process.argv[2];

if (!accessToken) {
  console.error('❌ Please provide your Figma access token');
  console.log('Usage: node scripts/figma-extract.js YOUR_FIGMA_TOKEN');
  process.exit(1);
}

console.log('🔍 Fetching Figma file data...');
console.log(`📁 File ID: ${FIGMA_FILE_ID}`);

try {
  // First get just the basic file info
  const response = await fetch(`${FIGMA_API_BASE}/files/${FIGMA_FILE_ID}?depth=1`, {
    headers: {
      'X-Figma-Token': accessToken
    }
  });

  console.log(`📡 Response status: ${response.status}`);

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ API Error: ${response.status} - ${errorText}`);
    process.exit(1);
  }

  const data = await response.json();
  console.log(`✅ Successfully fetched file data`);
  console.log(`📊 Document name: ${data.name || 'Unknown'}`);
  
  if (data.document && data.document.children) {
    console.log(`📋 Pages: ${data.document.children.length}`);
    
    // List all pages
    data.document.children.forEach((page, index) => {
      console.log(`  📄 Page ${index + 1}: ${page.name}`);
    });
  }

  // Extract styles if available
  if (data.styles) {
    console.log(`🎨 Styles found: ${Object.keys(data.styles).length}`);
    
    const colorStyles = [];
    const textStyles = [];
    
    Object.values(data.styles).forEach(style => {
      if (style.styleType === 'FILL') {
        colorStyles.push(style.name);
      } else if (style.styleType === 'TEXT') {
        textStyles.push(style.name);
      }
    });
    
    if (colorStyles.length > 0) {
      console.log('🌈 Color styles:');
      colorStyles.forEach(name => console.log(`  - ${name}`));
    }
    
    if (textStyles.length > 0) {
      console.log('📝 Text styles:');
      textStyles.forEach(name => console.log(`  - ${name}`));
    }
  } else {
    console.log('⚠️  No styles found in this file');
  }

  // Save raw data for analysis
  const outputDir = path.join(process.cwd(), 'scripts', 'figma-data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const outputFile = path.join(outputDir, 'raw-figma-data.json');
  fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
  console.log(`💾 Raw data saved to: ${outputFile}`);
  
  console.log('🎉 Extraction complete!');
  
} catch (error) {
  console.error('❌ Failed to fetch Figma file:', error.message);
  process.exit(1);
}