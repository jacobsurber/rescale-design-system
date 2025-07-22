#!/usr/bin/env node

/**
 * Figma Frame-Specific Component Extractor
 * Extracts design tokens from specific frames and maps them to React components
 */

import fs from 'fs';
import path from 'path';

const FIGMA_FILE_ID = 'B0H99zI9iTyU7vusGYP3rk';
const FIGMA_API_BASE = 'https://api.figma.com/v1';

const accessToken = process.argv[2];
const targetFrameId = process.argv[3];

if (!accessToken) {
  console.error('❌ Please provide your Figma access token');
  console.log('Usage: node scripts/figma-frame-extractor.js YOUR_TOKEN [FRAME_ID]');
  process.exit(1);
}

console.log('🎯 Extracting from specific Figma frames...');

/**
 * Frame-to-Component mapping configuration
 * Map Figma frame names/IDs to React component names
 */
const FRAME_COMPONENT_MAPPING = {
  // Navigation Components
  'Navigation Bar': 'NavigationBar',
  'Top Bar': 'TopBar', 
  'Sidebar': 'Sidebar',
  'Breadcrumb': 'Breadcrumb',
  
  // Form Components  
  'Input Field': 'Input',
  'Select Dropdown': 'EnhancedSelect',
  'Date Picker': 'DateRangePicker',
  'Form Layout': 'FormPageTemplate',
  
  // Data Display
  'Data Card': 'DataCard',
  'Metric Card': 'MetricCard', 
  'Status Badge': 'StatusTag',
  'Job Status': 'JobStatusIndicator',
  'Resource Metrics': 'ResourceMetrics',
  
  // Interactive Components
  'Button Primary': 'Button',
  'Button Secondary': 'Button',
  'Quick Actions': 'QuickActions',
  'Assistant Chat': 'AssistantChat',
  
  // Layout Components
  'Dashboard Grid': 'DashboardTemplate',
  'Page Header': 'PageHeader',
  'List Template': 'ListPageTemplate',
};

/**
 * Fetch specific frame data from Figma
 */
async function fetchFrameData(frameId) {
  try {
    console.log(`🔍 Fetching frame: ${frameId}`);
    
    const response = await fetch(`${FIGMA_API_BASE}/files/${FIGMA_FILE_ID}/nodes?ids=${frameId}`, {
      headers: {
        'X-Figma-Token': accessToken
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error: ${response.status} - ${errorText}`);
      return null;
    }

    const data = await response.json();
    return data.nodes[frameId];
    
  } catch (error) {
    console.error('❌ Failed to fetch frame:', error.message);
    return null;
  }
}

/**
 * Search for frames by name across all pages
 */
async function findFramesByName(frameName) {
  try {
    console.log(`🔍 Searching for frames named: "${frameName}"`);
    
    // Get file structure
    const response = await fetch(`${FIGMA_API_BASE}/files/${FIGMA_FILE_ID}?depth=2`, {
      headers: {
        'X-Figma-Token': accessToken
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const matchingFrames = [];

    // Recursively search for frames
    function searchNode(node, pageName = '') {
      if (node.name && node.name.toLowerCase().includes(frameName.toLowerCase())) {
        matchingFrames.push({
          id: node.id,
          name: node.name,
          type: node.type,
          page: pageName,
        });
      }
      
      if (node.children) {
        node.children.forEach(child => searchNode(child, pageName));
      }
    }

    // Search through all pages
    data.document.children.forEach(page => {
      searchNode(page, page.name);
    });

    return matchingFrames;
    
  } catch (error) {
    console.error('❌ Search failed:', error.message);
    return [];
  }
}

/**
 * Extract styling properties from a Figma node
 */
function extractNodeStyles(node) {
  const styles = {
    colors: {},
    typography: {},
    spacing: {},
    effects: {},
    layout: {}
  };

  // Extract fills (background colors, gradients)
  if (node.fills && Array.isArray(node.fills)) {
    node.fills.forEach((fill, index) => {
      if (fill.type === 'SOLID' && fill.color) {
        const { r, g, b, a = 1 } = fill.color;
        const hex = rgbaToHex(r, g, b, a);
        styles.colors[`background${index || ''}`] = hex;
      } else if (fill.type === 'GRADIENT_LINEAR') {
        styles.colors[`gradient${index || ''}`] = 'linear-gradient'; // Simplified
      }
    });
  }

  // Extract strokes (borders)
  if (node.strokes && Array.isArray(node.strokes)) {
    node.strokes.forEach((stroke, index) => {
      if (stroke.type === 'SOLID' && stroke.color) {
        const { r, g, b, a = 1 } = stroke.color;
        const hex = rgbaToHex(r, g, b, a);
        styles.colors[`border${index || ''}`] = hex;
      }
    });
  }

  // Extract text styles
  if (node.style) {
    if (node.style.fontFamily) styles.typography.fontFamily = node.style.fontFamily;
    if (node.style.fontSize) styles.typography.fontSize = `${node.style.fontSize}px`;
    if (node.style.fontWeight) styles.typography.fontWeight = node.style.fontWeight;
    if (node.style.lineHeightPx) styles.typography.lineHeight = `${node.style.lineHeightPx}px`;
    if (node.style.letterSpacing) styles.typography.letterSpacing = `${node.style.letterSpacing}px`;
    if (node.style.textAlignHorizontal) styles.typography.textAlign = node.style.textAlignHorizontal.toLowerCase();
  }

  // Extract layout properties
  if (node.absoluteBoundingBox) {
    styles.layout.width = `${node.absoluteBoundingBox.width}px`;
    styles.layout.height = `${node.absoluteBoundingBox.height}px`;
  }

  if (node.paddingLeft !== undefined) {
    styles.spacing.paddingLeft = `${node.paddingLeft}px`;
  }
  if (node.paddingRight !== undefined) {
    styles.spacing.paddingRight = `${node.paddingRight}px`;
  }
  if (node.paddingTop !== undefined) {
    styles.spacing.paddingTop = `${node.paddingTop}px`;
  }
  if (node.paddingBottom !== undefined) {
    styles.spacing.paddingBottom = `${node.paddingBottom}px`;
  }

  // Extract corner radius
  if (node.cornerRadius !== undefined) {
    styles.layout.borderRadius = `${node.cornerRadius}px`;
  }

  // Extract effects (shadows, blurs)
  if (node.effects && Array.isArray(node.effects)) {
    node.effects.forEach((effect, index) => {
      if (effect.type === 'DROP_SHADOW') {
        const { r, g, b, a } = effect.color;
        const color = `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
        styles.effects[`shadow${index || ''}`] = `${effect.offset.x}px ${effect.offset.y}px ${effect.radius}px ${color}`;
      }
    });
  }

  return styles;
}

/**
 * Convert RGBA to hex
 */
function rgbaToHex(r, g, b, a = 1) {
  const toHex = (n) => Math.round(n * 255).toString(16).padStart(2, '0');
  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  return a < 1 ? hex + toHex(a) : hex;
}

/**
 * Generate component-specific style files
 */
function generateComponentStyles(componentName, styles, frameInfo) {
  const outputDir = path.join(process.cwd(), 'src', 'theme', 'figma-styles');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const styleContent = `/**
 * Figma-extracted styles for ${componentName}
 * Generated from frame: ${frameInfo.name} (${frameInfo.id})
 * Page: ${frameInfo.page || 'Unknown'}
 * 
 * @fileoverview Component-specific styles extracted from Figma
 */

export const ${componentName.toLowerCase()}Styles = ${JSON.stringify(styles, null, 2)} as const;

// CSS-in-JS styles for styled-components
export const ${componentName}StyledProps = {
  ${Object.entries(styles.colors).map(([key, value]) => 
    `${key}: '${value}',`
  ).join('\n  ')}
  
  ${Object.entries(styles.typography).map(([key, value]) => 
    `${key}: '${value}',`
  ).join('\n  ')}
  
  ${Object.entries(styles.spacing).map(([key, value]) => 
    `${key}: '${value}',`
  ).join('\n  ')}
  
  ${Object.entries(styles.layout).map(([key, value]) => 
    `${key}: '${value}',`
  ).join('\n  ')}
  
  ${Object.entries(styles.effects).map(([key, value]) => 
    `${key}: '${value}',`
  ).join('\n  ')}
} as const;

export type ${componentName}StyleProps = typeof ${componentName}StyledProps;
export default ${componentName}StyledProps;
`;

  const fileName = `${componentName.toLowerCase()}.ts`;
  const filePath = path.join(outputDir, fileName);
  fs.writeFileSync(filePath, styleContent);
  
  return filePath;
}

/**
 * Main execution function
 */
async function main() {
  try {
    if (targetFrameId) {
      // Extract from specific frame ID
      console.log(`🎯 Extracting from frame ID: ${targetFrameId}`);
      
      const frameData = await fetchFrameData(targetFrameId);
      if (!frameData) {
        console.error('❌ Frame not found or inaccessible');
        process.exit(1);
      }

      const styles = extractNodeStyles(frameData.document);
      const componentName = FRAME_COMPONENT_MAPPING[frameData.document.name] || 'CustomComponent';
      
      console.log(`📊 Extracted styles for: ${frameData.document.name}`);
      console.log('🎨 Colors:', Object.keys(styles.colors).length);
      console.log('📝 Typography:', Object.keys(styles.typography).length);
      console.log('📐 Spacing:', Object.keys(styles.spacing).length);
      console.log('✨ Effects:', Object.keys(styles.effects).length);

      const filePath = generateComponentStyles(componentName, styles, {
        name: frameData.document.name,
        id: targetFrameId,
        page: 'Specified'
      });

      console.log(`✅ Generated component styles: ${filePath}`);
      
    } else {
      // Interactive mode - search and extract multiple frames
      console.log('🔍 Interactive mode - searching for component frames...');
      
      const componentFrames = [];
      
      // Search for each mapped component
      for (const [frameName, componentName] of Object.entries(FRAME_COMPONENT_MAPPING)) {
        const frames = await findFramesByName(frameName);
        if (frames.length > 0) {
          componentFrames.push(...frames.map(frame => ({
            ...frame,
            componentName
          })));
        }
      }

      if (componentFrames.length === 0) {
        console.log('⚠️  No matching component frames found');
        console.log('📝 Available frame names to search for:');
        Object.keys(FRAME_COMPONENT_MAPPING).forEach(name => {
          console.log(`  - "${name}"`);
        });
        return;
      }

      console.log(`\n🎯 Found ${componentFrames.length} component frames:`);
      componentFrames.forEach((frame, index) => {
        console.log(`  ${index + 1}. ${frame.name} (${frame.type}) → ${frame.componentName}`);
        console.log(`     Page: ${frame.page}, ID: ${frame.id}`);
      });

      // Extract styles from first few frames as examples
      console.log('\n🎨 Extracting styles from first 3 frames...');
      
      for (let i = 0; i < Math.min(3, componentFrames.length); i++) {
        const frame = componentFrames[i];
        console.log(`\n📊 Processing: ${frame.name}`);
        
        const frameData = await fetchFrameData(frame.id);
        if (frameData) {
          const styles = extractNodeStyles(frameData.document);
          const filePath = generateComponentStyles(frame.componentName, styles, frame);
          console.log(`✅ Generated: ${filePath}`);
        }
      }
    }

    console.log('\n🎉 Frame extraction complete!');
    console.log('\n💡 Usage examples:');
    console.log('  # Extract specific frame by ID:');
    console.log('  node scripts/figma-frame-extractor.js YOUR_TOKEN FRAME_ID');
    console.log('  ');
    console.log('  # Search and extract all component frames:');
    console.log('  node scripts/figma-frame-extractor.js YOUR_TOKEN');
    
  } catch (error) {
    console.error('❌ Extraction failed:', error.message);
    process.exit(1);
  }
}

// Run the script
main();