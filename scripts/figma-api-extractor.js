#!/usr/bin/env node

/**
 * Figma API Design Token and Component Extractor
 * 
 * This script uses the Figma API to extract design tokens and component information
 * from your Figma file and compare it with your existing Storybook components.
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Figma file details
const FIGMA_FILE_KEY = 'B0H99zI9iTyU7vusGYP3rk';
const FIGMA_NODE_ID = '17724-173694';

async function makeRequest(url, token) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'X-Figma-Token': token
      }
    };

    https.get(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error('Invalid JSON response'));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    }).on('error', reject);
  });
}

async function extractFigmaData(token) {
  console.log('🎨 Extracting data from Figma API...\n');

  try {
    // 1. Get file information
    console.log('📁 Fetching file information...');
    const fileUrl = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}`;
    const fileData = await makeRequest(fileUrl, token);
    
    console.log(`✅ File: ${fileData.name}`);
    console.log(`📅 Last modified: ${fileData.lastModified}`);
    console.log(`👥 Version: ${fileData.version}\n`);

    // 2. Get styles (design tokens)
    console.log('🎨 Fetching design tokens (styles)...');
    const stylesUrl = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/styles`;
    const stylesData = await makeRequest(stylesUrl, token);
    
    console.log(`✅ Found ${Object.keys(stylesData.meta.styles).length} styles\n`);

    // 3. Get components
    console.log('🧩 Fetching components...');
    const componentsUrl = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/components`;
    const componentsData = await makeRequest(componentsUrl, token);
    
    console.log(`✅ Found ${Object.keys(componentsData.meta.components).length} components\n`);

    // 4. Get specific node details
    console.log('📊 Fetching specific node details...');
    const nodeUrl = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/nodes?ids=${FIGMA_NODE_ID}`;
    const nodeData = await makeRequest(nodeUrl, token);
    
    // Process and save the data
    const extractedData = {
      file: {
        name: fileData.name,
        lastModified: fileData.lastModified,
        version: fileData.version
      },
      styles: stylesData.meta.styles,
      components: componentsData.meta.components,
      document: fileData.document,
      specificNode: nodeData.nodes[FIGMA_NODE_ID]
    };

    // Save raw data
    const outputPath = path.join(__dirname, '../figma-extracted-data.json');
    fs.writeFileSync(outputPath, JSON.stringify(extractedData, null, 2));
    console.log(`💾 Raw data saved to: ${outputPath}\n`);

    // Analyze and extract design tokens
    analyzeDesignTokens(extractedData);
    
    // Analyze components
    analyzeComponents(extractedData);

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('HTTP 403')) {
      console.log('\n🔑 Authentication failed. Please check:');
      console.log('1. Your Figma token is valid');
      console.log('2. You have access to this file');
      console.log('3. The file ID is correct');
    }
  }
}

function analyzeDesignTokens(data) {
  console.log('🎨 DESIGN TOKENS ANALYSIS');
  console.log('=========================\n');

  const styles = data.styles;
  
  // Group styles by type
  const stylesByType = {
    FILL: [],
    TEXT: [],
    EFFECT: [],
    GRID: []
  };

  Object.values(styles).forEach(style => {
    if (stylesByType[style.styleType]) {
      stylesByType[style.styleType].push(style);
    }
  });

  // Analyze colors
  if (stylesByType.FILL.length > 0) {
    console.log('🎨 Colors found:');
    stylesByType.FILL.forEach(style => {
      console.log(`  • ${style.name} (${style.description || 'No description'})`);
    });
    console.log('');
  }

  // Analyze typography
  if (stylesByType.TEXT.length > 0) {
    console.log('📝 Typography styles found:');
    stylesByType.TEXT.forEach(style => {
      console.log(`  • ${style.name} (${style.description || 'No description'})`);
    });
    console.log('');
  }

  // Analyze effects (shadows, etc.)
  if (stylesByType.EFFECT.length > 0) {
    console.log('✨ Effects found:');
    stylesByType.EFFECT.forEach(style => {
      console.log(`  • ${style.name} (${style.description || 'No description'})`);
    });
    console.log('');
  }
}

function analyzeComponents(data) {
  console.log('🧩 COMPONENTS ANALYSIS');
  console.log('======================\n');

  const components = data.components;
  
  if (Object.keys(components).length === 0) {
    console.log('No components found in this file.\n');
    return;
  }

  console.log(`Found ${Object.keys(components).length} components:\n`);

  Object.values(components).forEach(component => {
    console.log(`📦 ${component.name}`);
    console.log(`   Description: ${component.description || 'No description'}`);
    console.log(`   Created: ${component.created_at}`);
    console.log(`   Updated: ${component.updated_at}`);
    console.log('');
  });
}

// Main execution
async function main() {
  console.log('🚀 Figma API Design System Extractor');
  console.log('====================================\n');

  // Check for token
  const token = process.env.FIGMA_TOKEN || process.argv[2];
  
  if (!token) {
    console.log('❌ Figma token required!\n');
    console.log('Usage:');
    console.log('  node scripts/figma-api-extractor.js YOUR_FIGMA_TOKEN');
    console.log('  OR');
    console.log('  FIGMA_TOKEN=your_token node scripts/figma-api-extractor.js\n');
    console.log('Get your token at: https://www.figma.com/developers/api#access-tokens');
    process.exit(1);
  }

  await extractFigmaData(token);
}

// Run the main function
main();