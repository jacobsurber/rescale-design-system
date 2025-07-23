#!/usr/bin/env node

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FIGMA_FILE_KEY = 'B0H99zI9iTyU7vusGYP3rk';
const TARGET_NODE_ID = '17724-173694'; // Rescale 2.5 Flow [JS]

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

function extractColors(node, colors = new Set()) {
  if (node.fills && Array.isArray(node.fills)) {
    node.fills.forEach(fill => {
      if (fill.type === 'SOLID' && fill.color) {
        const { r, g, b, a = 1 } = fill.color;
        const hex = `#${Math.round(r * 255).toString(16).padStart(2, '0')}${Math.round(g * 255).toString(16).padStart(2, '0')}${Math.round(b * 255).toString(16).padStart(2, '0')}`;
        if (a < 1) {
          colors.add(`${hex} (opacity: ${Math.round(a * 100)}%)`);
        } else {
          colors.add(hex);
        }
      }
    });
  }
  
  if (node.strokes && Array.isArray(node.strokes)) {
    node.strokes.forEach(stroke => {
      if (stroke.type === 'SOLID' && stroke.color) {
        const { r, g, b, a = 1 } = stroke.color;
        const hex = `#${Math.round(r * 255).toString(16).padStart(2, '0')}${Math.round(g * 255).toString(16).padStart(2, '0')}${Math.round(b * 255).toString(16).padStart(2, '0')}`;
        if (a < 1) {
          colors.add(`${hex} (opacity: ${Math.round(a * 100)}%)`);
        } else {
          colors.add(hex);
        }
      }
    });
  }

  if (node.children) {
    node.children.forEach(child => extractColors(child, colors));
  }

  return colors;
}

function extractTypography(node, typography = new Set()) {
  if (node.style && node.characters) {
    const fontSize = node.style.fontSize || 'unknown';
    const fontWeight = node.style.fontWeight || 'unknown';
    const fontFamily = node.style.fontFamily || 'unknown';
    const lineHeight = node.style.lineHeightPx || 'unknown';
    
    typography.add(`${fontFamily} - ${fontSize}px / ${fontWeight} (line-height: ${lineHeight})`);
  }

  if (node.children) {
    node.children.forEach(child => extractTypography(child, typography));
  }

  return typography;
}

function extractComponents(node, components = []) {
  if (node.type && ['FRAME', 'COMPONENT', 'COMPONENT_SET', 'INSTANCE'].includes(node.type)) {
    components.push({
      id: node.id,
      name: node.name,
      type: node.type,
      width: node.absoluteBoundingBox?.width,
      height: node.absoluteBoundingBox?.height,
      childCount: node.children?.length || 0,
      description: node.description || null
    });
  }

  if (node.children) {
    node.children.forEach(child => extractComponents(child, components));
  }

  return components;
}

async function extractTargetNode(token) {
  console.log('🎯 Extracting from Target Figma Node');
  console.log('====================================');
  console.log(`Node ID: ${TARGET_NODE_ID} (Rescale 2.5 Flow [JS])\n`);

  try {
    // Get the target node with deep depth to capture all design details
    console.log('📥 Fetching node data...');
    const nodeUrl = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/nodes?ids=${TARGET_NODE_ID}&depth=5`;
    const nodeData = await makeRequest(nodeUrl, token);
    
    const targetNode = nodeData.nodes[TARGET_NODE_ID];
    if (!targetNode) {
      throw new Error('Target node not found');
    }

    console.log(`✅ Successfully fetched: ${targetNode.document.name}`);
    console.log(`📏 Page size: ${Math.round(targetNode.document.absoluteBoundingBox?.width || 0)}×${Math.round(targetNode.document.absoluteBoundingBox?.height || 0)}px`);
    console.log(`🎨 Background: rgba(${Math.round(targetNode.document.backgroundColor?.r * 255)}, ${Math.round(targetNode.document.backgroundColor?.g * 255)}, ${Math.round(targetNode.document.backgroundColor?.b * 255)}, ${targetNode.document.backgroundColor?.a})`);
    console.log(`📦 Top-level frames: ${targetNode.document.children?.length || 0}\n`);

    // Extract design tokens
    console.log('🎨 Extracting Colors...');
    const colors = extractColors(targetNode.document);
    console.log(`   Found ${colors.size} unique colors`);

    console.log('\n📝 Extracting Typography...');
    const typography = extractTypography(targetNode.document);
    console.log(`   Found ${typography.size} typography styles`);

    console.log('\n🧩 Extracting Components...');
    const components = extractComponents(targetNode.document);
    console.log(`   Found ${components.length} component-like elements`);

    // Analyze top-level frames
    console.log('\n📱 Top-Level Frames:');
    if (targetNode.document.children) {
      targetNode.document.children.forEach(frame => {
        console.log(`   📋 ${frame.name}`);
        console.log(`      Type: ${frame.type}`);
        if (frame.absoluteBoundingBox) {
          console.log(`      Size: ${Math.round(frame.absoluteBoundingBox.width)}×${Math.round(frame.absoluteBoundingBox.height)}px`);
        }
        console.log(`      Children: ${frame.children?.length || 0}`);
        console.log('');
      });
    }

    // Create comprehensive extraction
    const extractedData = {
      metadata: {
        nodeId: TARGET_NODE_ID,
        nodeName: targetNode.document.name,
        extractedAt: new Date().toISOString(),
        pageSize: {
          width: targetNode.document.absoluteBoundingBox?.width,
          height: targetNode.document.absoluteBoundingBox?.height
        },
        backgroundColor: targetNode.document.backgroundColor
      },
      designTokens: {
        colors: Array.from(colors),
        typography: Array.from(typography)
      },
      components: components,
      frames: targetNode.document.children?.map(frame => ({
        id: frame.id,
        name: frame.name,
        type: frame.type,
        size: frame.absoluteBoundingBox,
        childCount: frame.children?.length || 0
      })) || [],
      rawData: targetNode
    };

    // Save the data
    const outputPath = path.join(__dirname, '../figma-target-extraction.json');
    fs.writeFileSync(outputPath, JSON.stringify(extractedData, null, 2));
    console.log(`💾 Complete extraction saved to: ${outputPath}`);

    // Generate analysis report
    generateAnalysisReport(extractedData);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

function generateAnalysisReport(data) {
  console.log('\n📊 DESIGN ANALYSIS REPORT');
  console.log('=========================\n');

  // Color analysis
  console.log('🎨 COLOR PALETTE:');
  data.designTokens.colors.slice(0, 20).forEach(color => {
    console.log(`   • ${color}`);
  });
  if (data.designTokens.colors.length > 20) {
    console.log(`   ... and ${data.designTokens.colors.length - 20} more colors`);
  }

  // Typography analysis
  console.log('\n📝 TYPOGRAPHY STYLES:');
  data.designTokens.typography.slice(0, 15).forEach(typo => {
    console.log(`   • ${typo}`);
  });
  if (data.designTokens.typography.length > 15) {
    console.log(`   ... and ${data.designTokens.typography.length - 15} more styles`);
  }

  // Component analysis
  console.log('\n🧩 COMPONENT ANALYSIS:');
  const componentsByType = {};
  data.components.forEach(comp => {
    if (!componentsByType[comp.type]) {
      componentsByType[comp.type] = [];
    }
    componentsByType[comp.type].push(comp);
  });

  Object.entries(componentsByType).forEach(([type, comps]) => {
    console.log(`   ${type}: ${comps.length} items`);
    comps.slice(0, 5).forEach(comp => {
      console.log(`      • ${comp.name} (${comp.childCount} children)`);
    });
    if (comps.length > 5) {
      console.log(`      ... and ${comps.length - 5} more`);
    }
  });

  console.log('\n🎯 NEXT STEPS:');
  console.log('==============');
  console.log('1. Review extracted colors and compare with your current tokens.ts');
  console.log('2. Check typography styles against your current typography scale');
  console.log('3. Identify components that need to be built or updated');
  console.log('4. Use the complete data in figma-target-extraction.json for detailed analysis');
  console.log('5. Focus on the top-level frames for main component patterns\n');
}

const token = process.env.FIGMA_TOKEN || process.argv[2];
if (!token) {
  console.log('❌ Need Figma token!');
  process.exit(1);
}

extractTargetNode(token);