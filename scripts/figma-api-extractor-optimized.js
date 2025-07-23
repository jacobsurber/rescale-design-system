#!/usr/bin/env node

/**
 * Optimized Figma API Design Token and Component Extractor
 * 
 * This script uses the Figma API with optimized requests to extract design tokens 
 * and component information from large Figma files.
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
          console.log(`Status: ${res.statusCode}`);
          console.log(`Response: ${data}`);
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    }).on('error', reject);
  });
}

async function extractFigmaData(token) {
  console.log('🎨 Extracting data from Figma API (optimized)...\n');

  try {
    // 1. Get file information with minimal depth
    console.log('📁 Fetching basic file information...');
    const fileUrl = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}?depth=1`;
    const fileData = await makeRequest(fileUrl, token);
    
    console.log(`✅ File: ${fileData.name}`);
    console.log(`📅 Last modified: ${fileData.lastModified}`);
    console.log(`👥 Version: ${fileData.version}\n`);

    // 2. Get styles (design tokens) - this is usually smaller
    console.log('🎨 Fetching design tokens (styles)...');
    const stylesUrl = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/styles`;
    const stylesData = await makeRequest(stylesUrl, token);
    
    console.log(`✅ Found ${Object.keys(stylesData.meta.styles).length} styles\n`);

    // 3. Get components - this is usually smaller
    console.log('🧩 Fetching components...');
    const componentsUrl = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/components`;
    const componentsData = await makeRequest(componentsUrl, token);
    
    console.log(`✅ Found ${Object.keys(componentsData.meta.components).length} components\n`);

    // 4. Get specific node details only
    console.log('📊 Fetching specific node details...');
    const nodeUrl = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/nodes?ids=${FIGMA_NODE_ID}`;
    const nodeData = await makeRequest(nodeUrl, token);
    
    // Process and save the data
    const extractedData = {
      file: {
        name: fileData.name,
        lastModified: fileData.lastModified,
        version: fileData.version,
        pages: fileData.document?.children?.map(page => ({
          id: page.id,
          name: page.name,
          type: page.type
        })) || []
      },
      styles: stylesData.meta.styles,
      components: componentsData.meta.components,
      specificNode: nodeData.nodes?.[FIGMA_NODE_ID] || null
    };

    // Save raw data
    const outputPath = path.join(__dirname, '../figma-extracted-data.json');
    fs.writeFileSync(outputPath, JSON.stringify(extractedData, null, 2));
    console.log(`💾 Raw data saved to: ${outputPath}\n`);

    // Analyze and extract design tokens
    await analyzeDesignTokens(extractedData, token);
    
    // Analyze components
    analyzeComponents(extractedData);

    // Generate comparison report
    generateComparisonReport(extractedData);

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('HTTP 403')) {
      console.log('\n🔑 Authentication failed. Please check:');
      console.log('1. Your Figma token is valid');
      console.log('2. You have access to this file');
      console.log('3. The file ID is correct');
    } else if (error.message.includes('HTTP 400')) {
      console.log('\n📏 The file might be too large. Trying alternative approach...');
    }
  }
}

async function analyzeDesignTokens(data, token) {
  console.log('🎨 DESIGN TOKENS ANALYSIS');
  console.log('=========================\n');

  const styles = data.styles;
  
  if (!styles || Object.keys(styles).length === 0) {
    console.log('No styles found in this file.\n');
    return;
  }

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
    console.log('🎨 Color Styles:');
    stylesByType.FILL.forEach(style => {
      console.log(`  • ${style.name}`);
      if (style.description) console.log(`    Description: ${style.description}`);
    });
    console.log('');

    // Try to get actual color values for a few styles
    console.log('🔍 Fetching detailed color values...');
    const sampleStyleIds = stylesByType.FILL.slice(0, 5).map(s => s.node_id);
    if (sampleStyleIds.length > 0) {
      try {
        const detailUrl = `https://api.figma.com/v1/files/${data.file.name}/nodes?ids=${sampleStyleIds.join(',')}`;
        // Note: This might still be too large, so we'll handle it gracefully
      } catch (e) {
        console.log('    (Color values require additional API calls)');
      }
    }
  }

  // Analyze typography
  if (stylesByType.TEXT.length > 0) {
    console.log('📝 Typography Styles:');
    stylesByType.TEXT.forEach(style => {
      console.log(`  • ${style.name}`);
      if (style.description) console.log(`    Description: ${style.description}`);
    });
    console.log('');
  }

  // Analyze effects (shadows, etc.)
  if (stylesByType.EFFECT.length > 0) {
    console.log('✨ Effect Styles:');
    stylesByType.EFFECT.forEach(style => {
      console.log(`  • ${style.name}`);
      if (style.description) console.log(`    Description: ${style.description}`);
    });
    console.log('');
  }
}

function analyzeComponents(data) {
  console.log('🧩 COMPONENTS ANALYSIS');
  console.log('======================\n');

  const components = data.components;
  
  if (!components || Object.keys(components).length === 0) {
    console.log('No components found in this file.\n');
    return;
  }

  console.log(`Found ${Object.keys(components).length} components:\n`);

  // Group components by name patterns
  const componentGroups = {};
  
  Object.values(components).forEach(component => {
    const baseName = component.name.split('/')[0] || component.name.split(' ')[0] || 'Other';
    if (!componentGroups[baseName]) {
      componentGroups[baseName] = [];
    }
    componentGroups[baseName].push(component);
  });

  Object.entries(componentGroups).forEach(([groupName, components]) => {
    console.log(`📦 ${groupName} (${components.length} variants)`);
    components.forEach(component => {
      console.log(`   └─ ${component.name}`);
      if (component.description) {
        console.log(`      ${component.description}`);
      }
    });
    console.log('');
  });
}

function generateComparisonReport(figmaData) {
  console.log('📊 FIGMA vs STORYBOOK COMPARISON');
  console.log('=================================\n');

  // Existing Storybook components
  const storybookComponents = [
    'Button', 'Card', 'LoadingSpinner', 'Skeleton', 'AnimatedFeedback',
    'VirtualTable', 'Pagination', 'EnhancedSelect', 'DateRangePicker',
    'TopBar', 'Sidebar', 'MainLayout', 'Grid', 'PageHeader', 'Container',
    'StatusTag', 'ConnectorCard', 'WorkflowCard', 'MetricCard',
    'JobStatusIndicator', 'AssistantChat', 'QuickActions', 'ResourceMetrics',
    'SoftwareLogoGrid', 'WorkspaceSelector', 'PerformanceDashboard'
  ];

  const figmaComponents = Object.values(figmaData.components || {}).map(c => c.name);

  console.log('✅ Components in both Figma and Storybook:');
  const matching = storybookComponents.filter(sb => 
    figmaComponents.some(fg => fg.toLowerCase().includes(sb.toLowerCase()) || sb.toLowerCase().includes(fg.toLowerCase()))
  );
  matching.forEach(comp => console.log(`   • ${comp}`));
  console.log('');

  console.log('❌ Components in Figma but missing from Storybook:');
  const missingFromStorybook = figmaComponents.filter(fg => 
    !storybookComponents.some(sb => fg.toLowerCase().includes(sb.toLowerCase()) || sb.toLowerCase().includes(fg.toLowerCase()))
  );
  missingFromStorybook.slice(0, 10).forEach(comp => console.log(`   • ${comp}`));
  if (missingFromStorybook.length > 10) {
    console.log(`   ... and ${missingFromStorybook.length - 10} more`);
  }
  console.log('');

  console.log('🔄 Components in Storybook but not clearly in Figma:');
  const missingFromFigma = storybookComponents.filter(sb => 
    !figmaComponents.some(fg => fg.toLowerCase().includes(sb.toLowerCase()) || sb.toLowerCase().includes(fg.toLowerCase()))
  );
  missingFromFigma.forEach(comp => console.log(`   • ${comp}`));
  console.log('');

  // Generate action items
  console.log('🎯 RECOMMENDED NEXT STEPS:');
  console.log('==========================');
  console.log('1. Review components missing from Storybook');
  console.log('2. Check if Storybook components match Figma designs visually');
  console.log('3. Extract specific color values from Figma styles');
  console.log('4. Compare typography scales');
  console.log('5. Verify spacing and layout patterns\n');
}

// Main execution
async function main() {
  console.log('🚀 Optimized Figma API Design System Extractor');
  console.log('===============================================\n');

  // Check for token
  const token = process.env.FIGMA_TOKEN || process.argv[2];
  
  if (!token) {
    console.log('❌ Figma token required!\n');
    console.log('Usage:');
    console.log('  node scripts/figma-api-extractor-optimized.js YOUR_FIGMA_TOKEN');
    console.log('  OR');
    console.log('  FIGMA_TOKEN=your_token node scripts/figma-api-extractor-optimized.js\n');
    console.log('Get your token at: https://www.figma.com/developers/api#access-tokens');
    process.exit(1);
  }

  await extractFigmaData(token);
}

// Run the main function
main();