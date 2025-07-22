#!/usr/bin/env node

/**
 * Figma Frame Finder
 * Discovers and lists all frames with their IDs for targeted extraction
 */

import fs from 'fs';
import path from 'path';

const FIGMA_FILE_ID = 'B0H99zI9iTyU7vusGYP3rk';
const FIGMA_API_BASE = 'https://api.figma.com/v1';

const accessToken = process.argv[2];
const searchTerm = process.argv[3];

if (!accessToken) {
  console.error('❌ Please provide your Figma access token');
  console.log('Usage: node scripts/figma-frame-finder.js YOUR_TOKEN [SEARCH_TERM]');
  console.log('');
  console.log('Examples:');
  console.log('  node scripts/figma-frame-finder.js YOUR_TOKEN                    # List all frames');
  console.log('  node scripts/figma-frame-finder.js YOUR_TOKEN "button"          # Search for button frames');
  console.log('  node scripts/figma-frame-finder.js YOUR_TOKEN "navigation"      # Search for navigation frames');
  process.exit(1);
}

console.log('🔍 Discovering Figma frames and components...');

/**
 * Fetch file structure with more detail
 */
async function discoverFrames() {
  try {
    console.log(`📁 Analyzing file: ${FIGMA_FILE_ID}`);
    
    const response = await fetch(`${FIGMA_API_BASE}/files/${FIGMA_FILE_ID}?depth=3`, {
      headers: {
        'X-Figma-Token': accessToken
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error: ${response.status} - ${errorText}`);
      process.exit(1);
    }

    const data = await response.json();
    const discoveredFrames = [];

    // Recursively discover all frames and components
    function discoverNode(node, pageName = '', depth = 0) {
      const isFrame = node.type === 'FRAME';
      const isComponent = node.type === 'COMPONENT';
      const isInstance = node.type === 'INSTANCE';
      
      if (isFrame || isComponent || isInstance) {
        const item = {
          id: node.id,
          name: node.name,
          type: node.type,
          page: pageName,
          depth: depth,
          hasChildren: node.children && node.children.length > 0,
          childCount: node.children ? node.children.length : 0,
          dimensions: node.absoluteBoundingBox ? {
            width: Math.round(node.absoluteBoundingBox.width),
            height: Math.round(node.absoluteBoundingBox.height)
          } : null,
          // Check for common UI element indicators
          isButton: node.name.toLowerCase().includes('button'),
          isNavigation: node.name.toLowerCase().includes('nav') || node.name.toLowerCase().includes('menu'),
          isCard: node.name.toLowerCase().includes('card'),
          isForm: node.name.toLowerCase().includes('form') || node.name.toLowerCase().includes('input'),
          isModal: node.name.toLowerCase().includes('modal') || node.name.toLowerCase().includes('dialog'),
        };

        // Add search relevance if search term provided
        if (searchTerm) {
          const nameMatch = node.name.toLowerCase().includes(searchTerm.toLowerCase());
          const pageMatch = pageName.toLowerCase().includes(searchTerm.toLowerCase());
          if (nameMatch || pageMatch) {
            item.searchRelevance = nameMatch ? 'name' : 'page';
            discoveredFrames.push(item);
          }
        } else {
          discoveredFrames.push(item);
        }
      }

      // Recursively process children
      if (node.children && depth < 4) { // Limit depth to avoid too much data
        node.children.forEach(child => discoverNode(child, pageName, depth + 1));
      }
    }

    // Process all pages
    data.document.children.forEach(page => {
      console.log(`📄 Processing page: ${page.name}`);
      discoverNode(page, page.name, 0);
    });

    return { frames: discoveredFrames, fileInfo: data };
    
  } catch (error) {
    console.error('❌ Discovery failed:', error.message);
    process.exit(1);
  }
}

/**
 * Display frames in a organized way
 */
function displayFrames(frames, fileInfo) {
  console.log(`\n📊 File: ${fileInfo.name}`);
  console.log(`📅 Last modified: ${new Date(fileInfo.lastModified).toLocaleDateString()}`);
  console.log(`📋 Total items found: ${frames.length}\n`);

  if (searchTerm) {
    console.log(`🔍 Search results for "${searchTerm}":\n`);
  }

  // Group frames by page and type
  const framesByPage = frames.reduce((acc, frame) => {
    if (!acc[frame.page]) acc[frame.page] = [];
    acc[frame.page].push(frame);
    return acc;
  }, {});

  // Display organized results
  Object.entries(framesByPage).forEach(([pageName, pageFrames]) => {
    console.log(`📄 Page: ${pageName} (${pageFrames.length} items)`);
    
    // Sort by type and name
    const sortedFrames = pageFrames.sort((a, b) => {
      if (a.type !== b.type) return a.type.localeCompare(b.type);
      return a.name.localeCompare(b.name);
    });

    sortedFrames.forEach(frame => {
      const indent = '  ' + '  '.repeat(frame.depth);
      const typeIcon = frame.type === 'COMPONENT' ? '🧩' : frame.type === 'INSTANCE' ? '📦' : '🖼️';
      const dimensions = frame.dimensions ? ` (${frame.dimensions.width}x${frame.dimensions.height})` : '';
      const childInfo = frame.hasChildren ? ` [${frame.childCount} children]` : '';
      
      console.log(`${indent}${typeIcon} ${frame.name}${dimensions}${childInfo}`);
      console.log(`${indent}   ID: ${frame.id}`);
      
      // Show UI element type hints
      const uiTypes = [];
      if (frame.isButton) uiTypes.push('Button');
      if (frame.isNavigation) uiTypes.push('Navigation'); 
      if (frame.isCard) uiTypes.push('Card');
      if (frame.isForm) uiTypes.push('Form');
      if (frame.isModal) uiTypes.push('Modal');
      
      if (uiTypes.length > 0) {
        console.log(`${indent}   🏷️  Likely: ${uiTypes.join(', ')}`);
      }
      
      if (frame.searchRelevance) {
        console.log(`${indent}   ✨ Match: ${frame.searchRelevance}`);
      }
      
      console.log('');
    });
    
    console.log('');
  });

  // Summary statistics
  const componentCount = frames.filter(f => f.type === 'COMPONENT').length;
  const frameCount = frames.filter(f => f.type === 'FRAME').length;  
  const instanceCount = frames.filter(f => f.type === 'INSTANCE').length;

  console.log('📈 Summary:');
  console.log(`  🧩 Components: ${componentCount}`);
  console.log(`  🖼️  Frames: ${frameCount}`);
  console.log(`  📦 Instances: ${instanceCount}`);
  
  // UI element hints
  const buttonCount = frames.filter(f => f.isButton).length;
  const navCount = frames.filter(f => f.isNavigation).length;
  const cardCount = frames.filter(f => f.isCard).length;
  const formCount = frames.filter(f => f.isForm).length;

  if (buttonCount || navCount || cardCount || formCount) {
    console.log('\n🏷️  UI Element Detection:');
    if (buttonCount) console.log(`  🔘 Button-like: ${buttonCount}`);
    if (navCount) console.log(`  🧭 Navigation-like: ${navCount}`);
    if (cardCount) console.log(`  🃏 Card-like: ${cardCount}`);
    if (formCount) console.log(`  📝 Form-like: ${formCount}`);
  }
}

/**
 * Save frame catalog for reference
 */
function saveFrameCatalog(frames, fileInfo) {
  const outputDir = path.join(process.cwd(), 'scripts', 'figma-data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const catalog = {
    fileInfo: {
      id: FIGMA_FILE_ID,
      name: fileInfo.name,
      lastModified: fileInfo.lastModified,
      exportDate: new Date().toISOString()
    },
    searchTerm: searchTerm || null,
    totalFrames: frames.length,
    frames: frames
  };

  const fileName = searchTerm ? `frame-catalog-${searchTerm.replace(/[^a-z0-9]/gi, '-')}.json` : 'frame-catalog.json';
  const filePath = path.join(outputDir, fileName);
  
  fs.writeFileSync(filePath, JSON.stringify(catalog, null, 2));
  console.log(`\n💾 Frame catalog saved: ${filePath}`);
  
  return filePath;
}

/**
 * Main execution
 */
async function main() {
  try {
    const { frames, fileInfo } = await discoverFrames();
    
    if (frames.length === 0) {
      if (searchTerm) {
        console.log(`⚠️  No frames found matching "${searchTerm}"`);
        console.log('💡 Try a broader search term or run without search to see all frames');
      } else {
        console.log('⚠️  No frames found in this file');
      }
      return;
    }

    displayFrames(frames, fileInfo);
    saveFrameCatalog(frames, fileInfo);

    console.log('\n💡 Next steps:');
    console.log('1. Copy a frame ID from above');
    console.log('2. Extract styles: node scripts/figma-frame-extractor.js YOUR_TOKEN FRAME_ID');
    console.log('3. Use generated styles in your React component');
    
  } catch (error) {
    console.error('❌ Frame discovery failed:', error.message);
    process.exit(1);
  }
}

main();