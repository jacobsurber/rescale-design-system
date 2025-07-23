#!/usr/bin/env node

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FIGMA_FILE_KEY = 'B0H99zI9iTyU7vusGYP3rk';

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

async function findAndExtractNode(token) {
  console.log('🔍 Finding Correct Node ID');
  console.log('===========================\n');

  try {
    // First, let's get the file structure to confirm the node ID
    console.log('📁 Getting file structure...');
    const fileUrl = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}?depth=1`;
    const fileData = await makeRequest(fileUrl, token);
    
    // Find the target page
    const targetPage = fileData.document.children.find(page => page.id === '17724:173694');
    
    if (targetPage) {
      console.log(`✅ Found target page: ${targetPage.name}`);
      console.log(`   ID: ${targetPage.id}`);
      console.log(`   Type: ${targetPage.type}`);
      
      // Now get the content of this page with more depth
      console.log('\n📥 Extracting page content...');
      const nodeUrl = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/nodes?ids=${targetPage.id}&depth=3`;
      const nodeData = await makeRequest(nodeUrl, token);
      
      const pageContent = nodeData.nodes[targetPage.id];
      if (pageContent) {
        console.log(`✅ Successfully extracted page content`);
        console.log(`📦 Top-level frames: ${pageContent.document.children?.length || 0}`);
        
        // Show all top-level frames
        if (pageContent.document.children) {
          console.log('\n📱 FRAMES IN PAGE:');
          pageContent.document.children.forEach((frame, index) => {
            console.log(`   ${index + 1}. ${frame.name} (${frame.type})`);
            if (frame.absoluteBoundingBox) {
              console.log(`      Size: ${Math.round(frame.absoluteBoundingBox.width)}×${Math.round(frame.absoluteBoundingBox.height)}px`);
            }
            console.log(`      Children: ${frame.children?.length || 0}`);
            
            // Show first few children if they exist
            if (frame.children && frame.children.length > 0) {
              console.log(`      Top children:`);
              frame.children.slice(0, 3).forEach(child => {
                console.log(`         • ${child.name || 'Unnamed'} (${child.type})`);
              });
              if (frame.children.length > 3) {
                console.log(`         ... and ${frame.children.length - 3} more`);
              }
            }
            console.log('');
          });
        }

        // Extract colors and components from this page
        const extractedData = extractDesignData(pageContent.document);
        
        // Save the data
        const outputPath = path.join(__dirname, '../figma-page-extraction.json');
        fs.writeFileSync(outputPath, JSON.stringify({
          metadata: {
            pageId: targetPage.id,
            pageName: targetPage.name,
            extractedAt: new Date().toISOString()
          },
          ...extractedData,
          rawData: pageContent
        }, null, 2));
        
        console.log(`💾 Page data saved to: ${outputPath}`);
        
        // Generate summary
        generateSummary(extractedData);
        
      } else {
        console.log('❌ Could not extract page content');
      }
      
    } else {
      console.log('❌ Target page not found. Available pages:');
      fileData.document.children.forEach(page => {
        console.log(`   • ${page.name} (ID: ${page.id})`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

function extractDesignData(node) {
  const colors = new Set();
  const typography = new Set();
  const components = [];

  function traverse(node) {
    // Extract colors
    if (node.fills && Array.isArray(node.fills)) {
      node.fills.forEach(fill => {
        if (fill.type === 'SOLID' && fill.color) {
          const { r, g, b, a = 1 } = fill.color;
          const hex = `#${Math.round(r * 255).toString(16).padStart(2, '0')}${Math.round(g * 255).toString(16).padStart(2, '0')}${Math.round(b * 255).toString(16).padStart(2, '0')}`;
          colors.add(hex);
        }
      });
    }

    // Extract typography
    if (node.style && node.characters) {
      const fontSize = node.style.fontSize || 'unknown';
      const fontWeight = node.style.fontWeight || 'unknown';
      const fontFamily = node.style.fontFamily || 'unknown';
      typography.add(`${fontFamily} ${fontSize}px weight:${fontWeight}`);
    }

    // Extract component-like structures
    if (node.type && ['FRAME', 'COMPONENT', 'INSTANCE'].includes(node.type) && node.name) {
      components.push({
        name: node.name,
        type: node.type,
        width: node.absoluteBoundingBox?.width,
        height: node.absoluteBoundingBox?.height,
        childCount: node.children?.length || 0
      });
    }

    // Traverse children
    if (node.children) {
      node.children.forEach(child => traverse(child));
    }
  }

  traverse(node);

  return {
    colors: Array.from(colors),
    typography: Array.from(typography),
    components: components
  };
}

function generateSummary(data) {
  console.log('\n🎨 DESIGN EXTRACTION SUMMARY');
  console.log('============================');
  
  console.log(`\n🎨 Colors found: ${data.colors.length}`);
  data.colors.slice(0, 15).forEach(color => {
    console.log(`   • ${color}`);
  });
  if (data.colors.length > 15) {
    console.log(`   ... and ${data.colors.length - 15} more`);
  }

  console.log(`\n📝 Typography styles: ${data.typography.length}`);
  data.typography.slice(0, 10).forEach(typo => {
    console.log(`   • ${typo}`);
  });
  if (data.typography.length > 10) {
    console.log(`   ... and ${data.typography.length - 10} more`);
  }

  console.log(`\n🧩 Components found: ${data.components.length}`);
  data.components.slice(0, 20).forEach(comp => {
    console.log(`   • ${comp.name} (${comp.type}, ${comp.childCount} children)`);
  });
  if (data.components.length > 20) {
    console.log(`   ... and ${data.components.length - 20} more`);
  }

  console.log('\n🎯 Next: Compare these findings with your current Storybook components!');
}

const token = process.env.FIGMA_TOKEN || process.argv[2];
if (!token) {
  console.log('❌ Need Figma token!');
  process.exit(1);
}

findAndExtractNode(token);