#!/usr/bin/env node

/**
 * Figma Color Audit Script
 * 
 * This script extracts and analyzes colors from Figma data files and compares
 * them with our current design tokens to identify inconsistencies.
 */

import fs from 'fs';
import path from 'path';

console.log('🎨 Figma Color Audit - Analyzing color consistency...\n');

// Extract colors from Figma data files
function extractColorsFromFigma() {
  const figmaColors = new Set();
  const rgbaColors = [];
  
  try {
    // Read figma-quick-data.json
    const quickData = JSON.parse(fs.readFileSync('figma-quick-data.json', 'utf8'));
    console.log(`📁 Loaded Figma quick data: ${quickData.file.name}`);
    
    // Extract background colors from pages
    if (quickData.file.pages) {
      quickData.file.pages.forEach(page => {
        if (page.backgroundColor) {
          const { r, g, b, a } = page.backgroundColor;
          const hex = rgbaToHex(r, g, b, a);
          if (hex) {
            figmaColors.add(hex);
            rgbaColors.push({
              hex,
              rgba: { r, g, b, a },
              source: `Page: ${page.name}`,
            });
          }
        }
      });
    }
    
    // Try to read more detailed extraction data (first part only due to size)
    try {
      const pageData = fs.readFileSync('figma-page-extraction.json', 'utf8');
      const preview = pageData.substring(0, 50000); // Read first 50KB
      
      // Extract hex colors from the preview
      const hexMatches = preview.match(/#[0-9a-fA-F]{6}/g);
      if (hexMatches) {
        hexMatches.forEach(hex => {
          figmaColors.add(hex.toLowerCase());
        });
      }
      
      // Extract short hex colors
      const shortHexMatches = preview.match(/#[0-9a-fA-F]{3}(?![0-9a-fA-F])/g);
      if (shortHexMatches) {
        shortHexMatches.forEach(shortHex => {
          const fullHex = expandShortHex(shortHex);
          figmaColors.add(fullHex);
        });
      }
      
      console.log(`📄 Analyzed first 50KB of page extraction data`);
    } catch (error) {
      console.log(`⚠️ Could not read page extraction data: ${error.message}`);
    }
    
  } catch (error) {
    console.error(`❌ Error reading Figma data: ${error.message}`);
    return { colors: [], rgbaColors: [] };
  }
  
  return {
    colors: Array.from(figmaColors).sort(),
    rgbaColors: rgbaColors.sort((a, b) => a.hex.localeCompare(b.hex))
  };
}

// Extract colors from our design tokens
function extractCurrentTokens() {
  try {
    const tokensPath = path.join('src', 'theme', 'tokens.ts');
    const tokensContent = fs.readFileSync(tokensPath, 'utf8');
    
    // Extract hex colors from the tokens file
    const hexMatches = tokensContent.match(/#[0-9a-fA-F]{6}/g);
    const shortHexMatches = tokensContent.match(/#[0-9a-fA-F]{3}(?![0-9a-fA-F])/g);
    
    const currentColors = new Set();
    
    if (hexMatches) {
      hexMatches.forEach(hex => currentColors.add(hex.toLowerCase()));
    }
    
    if (shortHexMatches) {
      shortHexMatches.forEach(shortHex => {
        const fullHex = expandShortHex(shortHex);
        currentColors.add(fullHex);
      });
    }
    
    return Array.from(currentColors).sort();
  } catch (error) {
    console.error(`❌ Error reading design tokens: ${error.message}`);
    return [];
  }
}

// Helper functions
function rgbaToHex(r, g, b, a = 1) {
  if (a === 0) return null; // Skip transparent colors
  
  const toHex = (n) => {
    const hex = Math.round(n * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function expandShortHex(shortHex) {
  const hex = shortHex.slice(1); // Remove #
  return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function getColorDescription(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return 'Unknown';
  
  const { r, g, b } = rgb;
  
  // Determine if it's grayscale
  if (Math.abs(r - g) < 10 && Math.abs(g - b) < 10 && Math.abs(r - b) < 10) {
    if (r < 50) return 'Very Dark Gray/Black';
    if (r < 100) return 'Dark Gray';
    if (r < 180) return 'Medium Gray';
    if (r < 220) return 'Light Gray';
    return 'Very Light Gray/White';
  }
  
  // Determine dominant color
  const max = Math.max(r, g, b);
  if (r === max && r > g + 30 && r > b + 30) return 'Red-ish';
  if (g === max && g > r + 30 && g > b + 30) return 'Green-ish';
  if (b === max && b > r + 30 && b > g + 30) return 'Blue-ish';
  
  // Mixed colors
  if (r > 150 && g > 150 && b < 100) return 'Yellow-ish';
  if (r > 150 && b > 150 && g < 100) return 'Magenta-ish';
  if (g > 150 && b > 150 && r < 100) return 'Cyan-ish';
  
  return 'Mixed Color';
}

// Main analysis
function runAudit() {
  console.log('🔍 Extracting colors from Figma data...');
  const figmaData = extractColorsFromFigma();
  
  console.log('🎯 Extracting colors from design tokens...');
  const currentTokens = extractCurrentTokens();
  
  console.log('\n📊 Analysis Results:');
  console.log('═'.repeat(60));
  
  console.log(`\n🎨 Colors found in Figma: ${figmaData.colors.length}`);
  figmaData.colors.forEach(color => {
    const desc = getColorDescription(color);
    console.log(`  ${color} - ${desc}`);
  });
  
  console.log(`\n🎯 Colors in current tokens: ${currentTokens.length}`);
  currentTokens.forEach(color => {
    const desc = getColorDescription(color);
    console.log(`  ${color} - ${desc}`);
  });
  
  // Find differences
  const figmaSet = new Set(figmaData.colors);
  const tokenSet = new Set(currentTokens);
  
  const onlyInFigma = figmaData.colors.filter(color => !tokenSet.has(color));
  const onlyInTokens = currentTokens.filter(color => !figmaSet.has(color));
  const common = figmaData.colors.filter(color => tokenSet.has(color));
  
  console.log(`\n✅ Colors matching between Figma and tokens: ${common.length}`);
  if (common.length > 0) {
    common.forEach(color => {
      console.log(`  ${color} ✓`);
    });
  }
  
  console.log(`\n🔍 Colors only in Figma (missing from tokens): ${onlyInFigma.length}`);
  if (onlyInFigma.length > 0) {
    onlyInFigma.forEach(color => {
      const desc = getColorDescription(color);
      console.log(`  ${color} - ${desc}`);
    });
  }
  
  console.log(`\n⚠️ Colors only in tokens (not in Figma): ${onlyInTokens.length}`);
  if (onlyInTokens.length > 0) {
    onlyInTokens.forEach(color => {
      const desc = getColorDescription(color);
      console.log(`  ${color} - ${desc}`);
    });
  }
  
  // RGBA colors from pages
  if (figmaData.rgbaColors.length > 0) {
    console.log(`\n🖼️ Background colors from Figma pages:`);
    figmaData.rgbaColors.forEach(colorData => {
      console.log(`  ${colorData.hex} - ${colorData.source}`);
    });
  }
  
  // Generate recommendations
  console.log('\n💡 Recommendations:');
  console.log('═'.repeat(40));
  
  if (onlyInFigma.length > 0) {
    console.log('🔧 Consider adding these Figma colors to design tokens:');
    onlyInFigma.forEach(color => {
      const desc = getColorDescription(color);
      console.log(`  - ${color} (${desc})`);
    });
  }
  
  if (onlyInTokens.length > 0) {
    console.log('🧹 Consider reviewing these token colors that may be unused:');
    onlyInTokens.forEach(color => {
      const desc = getColorDescription(color);
      console.log(`  - ${color} (${desc})`);
    });
  }
  
  const inconsistencyScore = ((onlyInFigma.length + onlyInTokens.length) / Math.max(figmaData.colors.length, currentTokens.length, 1)) * 100;
  
  console.log(`\n📈 Color Consistency Score: ${Math.round(100 - inconsistencyScore)}%`);
  
  if (inconsistencyScore < 20) {
    console.log('✅ Color consistency is good!');
  } else if (inconsistencyScore < 50) {
    console.log('⚠️ Some color inconsistencies detected - review recommended');
  } else {
    console.log('❌ Significant color inconsistencies - action needed');
  }
  
  // Write detailed report
  const report = {
    figmaColors: figmaData.colors,
    tokenColors: currentTokens,
    matching: common,
    onlyInFigma,
    onlyInTokens,
    rgbaColors: figmaData.rgbaColors,
    consistencyScore: Math.round(100 - inconsistencyScore),
    timestamp: new Date().toISOString(),
  };
  
  fs.writeFileSync('color-audit-report.json', JSON.stringify(report, null, 2));
  console.log('\n📄 Detailed report saved to: color-audit-report.json');
}

// Run the audit
runAudit();