#!/usr/bin/env node

/**
 * Enhanced Figma Style Extractor
 * Extracts detailed styling information from specific Figma frames
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const FIGMA_FILE_ID = 'B0H99zI9iTyU7vusGYP3rk';
const FRAME_ID = '17279:269520'; // Assistant Chat frame
const FIGMA_API_BASE = 'https://api.figma.com/v1';

// Get access token
const accessToken = process.env.FIGMA_ACCESS_TOKEN;
if (!accessToken) {
  console.error('❌ FIGMA_ACCESS_TOKEN environment variable is required');
  process.exit(1);
}

/**
 * Extract comprehensive styles from a Figma node
 */
function extractNodeStyles(node, parentStyles = {}) {
  const styles = {
    // Basic properties
    name: node.name,
    type: node.type,
    visible: node.visible,
    
    // Layout & positioning
    x: node.x,
    y: node.y,
    width: node.absoluteBoundingBox?.width,
    height: node.absoluteBoundingBox?.height,
    
    // Typography (if text node)
    ...(node.style && {
      fontFamily: node.style.fontFamily,
      fontSize: node.style.fontSize,
      fontWeight: node.style.fontWeight,
      lineHeight: node.style.lineHeightPx,
      letterSpacing: node.style.letterSpacing,
      textAlign: node.style.textAlignHorizontal?.toLowerCase(),
    }),
    
    // Fill/Background colors
    fills: node.fills?.map(fill => ({
      type: fill.type,
      color: fill.color ? rgbToHex(fill.color) : null,
      opacity: fill.opacity || 1,
      gradientHandlePositions: fill.gradientHandlePositions,
      gradientStops: fill.gradientStops?.map(stop => ({
        position: stop.position,
        color: rgbToHex(stop.color)
      }))
    })),
    
    // Stroke/Border properties
    strokes: node.strokes?.map(stroke => ({
      type: stroke.type,
      color: stroke.color ? rgbToHex(stroke.color) : null,
      opacity: stroke.opacity || 1,
    })),
    strokeWeight: node.strokeWeight,
    strokeAlign: node.strokeAlign,
    strokeCap: node.strokeCap,
    strokeJoin: node.strokeJoin,
    strokeDashes: node.strokeDashes,
    
    // Border radius
    cornerRadius: node.cornerRadius,
    rectangleCornerRadii: node.rectangleCornerRadii,
    
    // Effects (shadows, blurs, etc.)
    effects: node.effects?.map(effect => ({
      type: effect.type,
      visible: effect.visible,
      radius: effect.radius,
      color: effect.color ? rgbToHex(effect.color) : null,
      offset: effect.offset,
      spread: effect.spread,
      blendMode: effect.blendMode,
    })),
    
    // Layout properties
    layoutMode: node.layoutMode,
    layoutGrow: node.layoutGrow,
    layoutAlign: node.layoutAlign,
    layoutWrap: node.layoutWrap,
    itemSpacing: node.itemSpacing,
    paddingLeft: node.paddingLeft,
    paddingRight: node.paddingRight,
    paddingTop: node.paddingTop,
    paddingBottom: node.paddingBottom,
    
    // Auto layout
    primaryAxisAlignItems: node.primaryAxisAlignItems,
    counterAxisAlignItems: node.counterAxisAlignItems,
    primaryAxisSizingMode: node.primaryAxisSizingMode,
    counterAxisSizingMode: node.counterAxisSizingMode,
    
    // Constraints
    constraints: node.constraints,
    
    // Blend mode and opacity
    blendMode: node.blendMode,
    opacity: node.opacity,
    
    // Children (recursive)
    children: node.children?.map(child => extractNodeStyles(child, styles))
  };
  
  // Remove undefined values
  return Object.fromEntries(
    Object.entries(styles).filter(([_, value]) => value !== undefined)
  );
}

/**
 * Convert Figma RGB color to hex
 */
function rgbToHex(color) {
  const toHex = (value) => {
    const hex = Math.round(value * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
}

/**
 * Convert extracted styles to CSS properties
 */
function stylesToCSS(styles, componentName = 'component') {
  const css = {};
  
  // Background
  if (styles.fills?.length > 0) {
    const fill = styles.fills[0];
    if (fill.type === 'SOLID' && fill.color) {
      css.backgroundColor = fill.color;
      if (fill.opacity < 1) {
        css.backgroundColor = `${fill.color}${Math.round(fill.opacity * 255).toString(16).padStart(2, '0')}`;
      }
    }
  }
  
  // Border
  if (styles.strokes?.length > 0 && styles.strokeWeight > 0) {
    const stroke = styles.strokes[0];
    css.border = `${styles.strokeWeight}px solid ${stroke.color || '#000000'}`;
  }
  
  // Border radius
  if (styles.cornerRadius) {
    css.borderRadius = `${styles.cornerRadius}px`;
  }
  
  // Shadows
  if (styles.effects?.length > 0) {
    const shadows = styles.effects
      .filter(effect => effect.type === 'DROP_SHADOW' && effect.visible)
      .map(effect => {
        const { offset = {}, radius = 0, color = '#000000', spread = 0 } = effect;
        return `${offset.x || 0}px ${offset.y || 0}px ${radius}px ${spread}px ${color}`;
      });
    
    if (shadows.length > 0) {
      css.boxShadow = shadows.join(', ');
    }
  }
  
  // Typography
  if (styles.fontFamily) css.fontFamily = `"${styles.fontFamily}", sans-serif`;
  if (styles.fontSize) css.fontSize = `${styles.fontSize}px`;
  if (styles.fontWeight) css.fontWeight = styles.fontWeight;
  if (styles.lineHeight) css.lineHeight = `${styles.lineHeight}px`;
  if (styles.textAlign) css.textAlign = styles.textAlign;
  
  // Layout
  if (styles.width) css.width = `${styles.width}px`;
  if (styles.height) css.height = `${styles.height}px`;
  
  // Padding
  if (styles.paddingTop || styles.paddingRight || styles.paddingBottom || styles.paddingLeft) {
    const padding = [
      styles.paddingTop || 0,
      styles.paddingRight || 0, 
      styles.paddingBottom || 0,
      styles.paddingLeft || 0
    ];
    css.padding = `${padding.join('px ')}px`;
  }
  
  // Gap/spacing
  if (styles.itemSpacing) css.gap = `${styles.itemSpacing}px`;
  
  // Flexbox
  if (styles.layoutMode === 'HORIZONTAL') {
    css.display = 'flex';
    css.flexDirection = 'row';
  } else if (styles.layoutMode === 'VERTICAL') {
    css.display = 'flex';
    css.flexDirection = 'column';
  }
  
  if (styles.primaryAxisAlignItems) {
    const alignMap = {
      'MIN': 'flex-start',
      'CENTER': 'center', 
      'MAX': 'flex-end',
      'SPACE_BETWEEN': 'space-between'
    };
    css.justifyContent = alignMap[styles.primaryAxisAlignItems] || 'flex-start';
  }
  
  if (styles.counterAxisAlignItems) {
    const alignMap = {
      'MIN': 'flex-start',
      'CENTER': 'center',
      'MAX': 'flex-end'
    };
    css.alignItems = alignMap[styles.counterAxisAlignItems] || 'stretch';
  }
  
  return css;
}

/**
 * Generate component-specific styles
 */
function generateComponentStyles(frameData) {
  const styles = {};
  
  // Find specific UI elements by name patterns
  const findNodeByName = (node, pattern) => {
    if (node.name?.toLowerCase().includes(pattern)) return node;
    if (node.children) {
      for (const child of node.children) {
        const found = findNodeByName(child, pattern);
        if (found) return found;
      }
    }
    return null;
  };
  
  // Extract styles for different parts
  const containerNode = frameData;
  const headerNode = findNodeByName(frameData, 'header') || findNodeByName(frameData, 'title');
  const messageNode = findNodeByName(frameData, 'message') || findNodeByName(frameData, 'chat');
  const inputNode = findNodeByName(frameData, 'input') || findNodeByName(frameData, 'text');
  const buttonNode = findNodeByName(frameData, 'button') || findNodeByName(frameData, 'send');
  
  return {
    container: stylesToCSS(containerNode),
    header: headerNode ? stylesToCSS(headerNode) : {},
    messageArea: messageNode ? stylesToCSS(messageNode) : {},
    input: inputNode ? stylesToCSS(inputNode) : {},
    button: buttonNode ? stylesToCSS(buttonNode) : {},
  };
}

/**
 * Main extraction function
 */
async function extractEnhancedStyles() {
  console.log('🎨 Enhanced Figma Style Extraction');
  console.log('==================================');
  
  try {
    // Fetch the specific frame
    console.log(`📡 Fetching frame ${FRAME_ID} from Figma...`);
    const response = await fetch(
      `${FIGMA_API_BASE}/files/${FIGMA_FILE_ID}/nodes?ids=${FRAME_ID}`,
      {
        headers: {
          'X-Figma-Token': accessToken
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Figma API error: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    const frameData = data.nodes[FRAME_ID];
    
    if (!frameData) {
      throw new Error(`Frame ${FRAME_ID} not found`);
    }
    
    console.log('✅ Frame data retrieved successfully');
    
    // Extract detailed styles
    const extractedStyles = extractNodeStyles(frameData.document);
    const componentStyles = generateComponentStyles(frameData.document);
    
    // Save raw extraction data
    const rawDataPath = path.join(__dirname, '../src/theme/figma-styles/raw-extraction.json');
    fs.writeFileSync(rawDataPath, JSON.stringify(extractedStyles, null, 2));
    console.log(`💾 Raw extraction saved to: ${rawDataPath}`);
    
    // Generate enhanced TypeScript styles
    const enhancedStyles = `/**
 * Enhanced Figma-extracted styles for AssistantChat Component
 * Generated from frame: ${frameData.document.name} (${FRAME_ID})
 * URL: https://www.figma.com/design/${FIGMA_FILE_ID}?node-id=${FRAME_ID.replace(':', '-')}
 * 
 * Auto-generated on: ${new Date().toISOString()}
 */

// Raw Figma node styles
export const rawFigmaStyles = ${JSON.stringify(extractedStyles, null, 2)} as const;

// Component-specific CSS styles
export const enhancedAssistantChatStyles = {
  container: ${JSON.stringify(componentStyles.container, null, 4)},
  
  header: ${JSON.stringify(componentStyles.header, null, 4)},
  
  messageArea: ${JSON.stringify(componentStyles.messageArea, null, 4)},
  
  input: ${JSON.stringify(componentStyles.input, null, 4)},
  
  button: ${JSON.stringify(componentStyles.button, null, 4)},
} as const;

// CSS-in-JS compatible styles
export const cssStyles = {
  container: \`
${Object.entries(componentStyles.container).map(([prop, value]) => `    ${prop.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`).join('\n')}
  \`,
  
  header: \`
${Object.entries(componentStyles.header).map(([prop, value]) => `    ${prop.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`).join('\n')}
  \`,
  
  messageArea: \`
${Object.entries(componentStyles.messageArea).map(([prop, value]) => `    ${prop.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`).join('\n')}
  \`,
} as const;

export default enhancedAssistantChatStyles;
`;
    
    // Save enhanced styles
    const enhancedPath = path.join(__dirname, '../src/theme/figma-styles/enhanced-assistantchat.ts');
    fs.writeFileSync(enhancedPath, enhancedStyles);
    console.log(`✨ Enhanced styles saved to: ${enhancedPath}`);
    
    // Print summary
    console.log('\n📊 Extraction Summary:');
    console.log(`• Frame: ${frameData.document.name}`);
    console.log(`• Components found: ${Object.keys(componentStyles).length}`);
    console.log(`• Container styles: ${Object.keys(componentStyles.container).length} properties`);
    console.log(`• Header styles: ${Object.keys(componentStyles.header).length} properties`);
    
  } catch (error) {
    console.error('❌ Extraction failed:', error.message);
    process.exit(1);
  }
}

// Run extraction
extractEnhancedStyles();