#!/usr/bin/env node

/**
 * Figma Components and Design Tokens Extractor
 * Fetches specific pages and extracts design tokens
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

console.log('🔍 Fetching Figma components page...');

try {
  // Get specific node by searching for the components page
  const response = await fetch(`${FIGMA_API_BASE}/files/${FIGMA_FILE_ID}/nodes?ids=13633:181938`, {
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
  console.log(`✅ Successfully fetched node data`);
  console.log('📊 Found nodes:', Object.keys(data.nodes));

  // Extract design tokens from the node
  if (data.nodes) {
    Object.entries(data.nodes).forEach(([nodeId, node]) => {
      console.log(`\n🔍 Analyzing node: ${nodeId}`);
      console.log(`📄 Name: ${node.document?.name || 'Unnamed'}`);
      console.log(`📐 Type: ${node.document?.type || 'Unknown'}`);
      
      if (node.document?.children) {
        console.log(`📦 Children: ${node.document.children.length}`);
        
        // Look for color and typography tokens
        extractTokensFromNode(node.document);
      }
    });
  }

  // Save detailed data
  const outputDir = path.join(process.cwd(), 'scripts', 'figma-data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const outputFile = path.join(outputDir, 'figma-components.json');
  fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
  console.log(`💾 Components data saved to: ${outputFile}`);
  
  console.log('🎉 Components extraction complete!');
  
} catch (error) {
  console.error('❌ Failed to fetch Figma components:', error.message);
  process.exit(1);
}

function extractTokensFromNode(node, depth = 0) {
  const indent = '  '.repeat(depth);
  
  if (node.name && depth < 3) {
    console.log(`${indent}📁 ${node.name} (${node.type})`);
  }
  
  // Look for fills (colors)
  if (node.fills && Array.isArray(node.fills)) {
    node.fills.forEach(fill => {
      if (fill.type === 'SOLID' && fill.color) {
        const { r, g, b, a = 1 } = fill.color;
        const color = `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
        console.log(`${indent}🎨 Fill: ${color}`);
      }
    });
  }
  
  // Look for text styles
  if (node.style && node.style.fontFamily) {
    console.log(`${indent}📝 Font: ${node.style.fontFamily} ${node.style.fontSize || ''}px`);
  }
  
  // Recursively check children
  if (node.children && depth < 4) {
    node.children.forEach(child => extractTokensFromNode(child, depth + 1));
  }
}