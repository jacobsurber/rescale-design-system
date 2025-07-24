#!/usr/bin/env node

/**
 * Figma MCP-Based Color Extractor
 * 
 * This script replaces the original figma-colors.js with MCP-based extraction.
 * It maintains the same output formats and CLI interface for color extraction.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import { FigmaMCPExtractor } from './figma-mcp-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for CLI output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

class FigmaColorsMCPExtractor {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.extractor = new FigmaMCPExtractor();
    this.outputDir = path.resolve(__dirname, '../src/theme/colors');
  }

  /**
   * Main CLI interface
   */
  async run() {
    try {
      console.log(`${colors.magenta}${colors.bright}🎨 Figma MCP Color Extractor${colors.reset}`);
      console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
      
      console.log(`${colors.yellow}📋 MCP Color Extraction Requirements:${colors.reset}`);
      console.log('• Figma desktop app must be running');
      console.log('• Select a frame/component with colors to extract');
      console.log('• Colors can be from fills, strokes, or published styles');
      console.log('• MCP server must be available\n');

      const shouldContinue = await this.askQuestion(`${colors.cyan}Ready to extract colors from selected Figma frame? (y/n): ${colors.reset}`);
      
      if (shouldContinue.toLowerCase() !== 'y') {
        console.log(`${colors.yellow}Color extraction cancelled.${colors.reset}`);
        this.rl.close();
        return;
      }

      await this.extractColors();
      
    } catch (error) {
      console.error(`${colors.red}❌ Color extraction failed:${colors.reset}`, error.message);
      process.exit(1);
    } finally {
      this.rl.close();
    }
  }

  /**
   * Extract colors using MCP
   */
  async extractColors() {
    console.log(`${colors.blue}🔗 Connecting to Figma MCP for color extraction...${colors.reset}`);
    
    try {
      // Initialize MCP connection
      await this.extractor.initialize();
      console.log(`${colors.green}✅ MCP connection established${colors.reset}\n`);

      // Extract colors from MCP data
      const extractedColors = await this.extractor.extractColors();
      
      console.log(`${colors.cyan}🎨 Found ${Object.keys(extractedColors).length} colors:${colors.reset}`);
      
      // Display found colors
      this.displayColorPreview(extractedColors);
      
      // Show organization options
      await this.showColorOrganizationMenu(extractedColors);
      
    } catch (error) {
      console.error(`${colors.red}❌ MCP color extraction failed:${colors.reset}`, error.message);
      throw error;
    }
  }

  /**
   * Display color preview in CLI
   */
  displayColorPreview(colors) {
    console.log('');
    Object.entries(colors).forEach(([name, color]) => {
      // Create a simple text representation of the color
      const colorBar = this.createColorBar(color.hex);
      console.log(`  ${colorBar} ${colors.bright}${name}${colors.reset} ${color.hex}`);
    });
    console.log('');
  }

  /**
   * Create a simple color bar representation
   */
  createColorBar(hex) {
    // Convert hex to RGB to determine if color is light or dark
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // Use different symbols for light vs dark colors
    const symbol = brightness > 128 ? '●' : '●';
    return `${colors.bright}${symbol}${colors.reset}`;
  }

  /**
   * Show color organization and export menu
   */
  async showColorOrganizationMenu(extractedColors) {
    console.log(`${colors.cyan}${colors.bright}🛠️  Color Organization Options:${colors.reset}`);
    console.log('1. Export All Colors (no organization)');
    console.log('2. Organize by Color Type (primary, secondary, neutral, etc.)');
    console.log('3. Organize by Brightness (light, medium, dark)');
    console.log('4. Custom Organization');
    console.log('5. Generate Color Palette Stories');
    console.log('6. Full Color System Export\n');

    const choice = await this.askQuestion(`${colors.cyan}Select organization type (1-6): ${colors.reset}`);
    
    switch (choice) {
      case '1':
        await this.exportAllColors(extractedColors);
        break;
      case '2':
        await this.organizeByColorType(extractedColors);
        break;
      case '3':
        await this.organizeByBrightness(extractedColors);
        break;
      case '4':
        await this.customOrganization(extractedColors);
        break;
      case '5':
        await this.generateColorPaletteStories(extractedColors);
        break;
      case '6':
        await this.fullColorSystemExport(extractedColors);
        break;
      default:
        console.log(`${colors.red}Invalid choice. Please select 1-6.${colors.reset}`);
        await this.showColorOrganizationMenu(extractedColors);
    }
  }

  /**
   * Export all colors without organization
   */
  async exportAllColors(colors) {
    console.log(`${colors.blue}📦 Exporting all colors...${colors.reset}`);
    
    await this.generateColorFiles(colors, 'all-colors');
    await this.generateColorConstants(colors);
    
    console.log(`${colors.green}✅ Exported ${Object.keys(colors).length} colors${colors.reset}`);
    console.log(`📁 Output directory: ${colors.cyan}${this.outputDir}${colors.reset}\n`);
    
    await this.askForMoreActions();
  }

  /**
   * Organize colors by type (primary, secondary, neutral, etc.)
   */
  async organizeByColorType(colors) {
    console.log(`${colors.blue}🏷️  Organizing colors by type...${colors.reset}`);
    
    const organizedColors = this.categorizeColorsByType(colors);
    
    // Generate files for each category
    for (const [category, categoryColors] of Object.entries(organizedColors)) {
      await this.generateColorFiles(categoryColors, category);
      console.log(`${colors.green}✅ Generated ${category} colors (${Object.keys(categoryColors).length} colors)${colors.reset}`);
    }
    
    // Generate combined file
    await this.generateOrganizedColorFile(organizedColors);
    
    console.log(`📁 Output directory: ${colors.cyan}${this.outputDir}${colors.reset}\n`);
    
    await this.askForMoreActions();
  }

  /**
   * Organize colors by brightness
   */
  async organizeByBrightness(colors) {
    console.log(`${colors.blue}💡 Organizing colors by brightness...${colors.reset}`);
    
    const organizedColors = this.categorizeColorsByBrightness(colors);
    
    // Generate files for each brightness category
    for (const [category, categoryColors] of Object.entries(organizedColors)) {
      await this.generateColorFiles(categoryColors, `brightness-${category}`);
      console.log(`${colors.green}✅ Generated ${category} colors (${Object.keys(categoryColors).length} colors)${colors.reset}`);
    }
    
    await this.generateOrganizedColorFile(organizedColors);
    
    console.log(`📁 Output directory: ${colors.cyan}${this.outputDir}${colors.reset}\n`);
    
    await this.askForMoreActions();
  }

  /**
   * Custom color organization
   */
  async customOrganization(colors) {
    console.log(`${colors.cyan}🛠️  Custom Color Organization${colors.reset}\n`);
    
    const categories = [];
    let addingCategories = true;
    
    console.log('Create custom color categories:');
    
    while (addingCategories) {
      const categoryName = await this.askQuestion(`${colors.cyan}Enter category name (or 'done' to finish): ${colors.reset}`);
      
      if (categoryName.toLowerCase() === 'done') {
        addingCategories = false;
      } else {
        categories.push(categoryName);
        console.log(`${colors.green}✅ Added category: ${categoryName}${colors.reset}`);
      }
    }
    
    if (categories.length === 0) {
      console.log(`${colors.yellow}No categories created. Using default organization.${colors.reset}`);
      await this.organizeByColorType(colors);
      return;
    }
    
    // Let user assign colors to categories
    const organizedColors = {};
    categories.forEach(cat => organizedColors[cat] = {});
    organizedColors['uncategorized'] = {};
    
    console.log(`\n${colors.cyan}Assign colors to categories:${colors.reset}`);
    
    for (const [colorName, colorData] of Object.entries(colors)) {
      console.log(`\n${this.createColorBar(colorData.hex)} ${colors.bright}${colorName}${colors.reset} ${colorData.hex}`);
      console.log('Categories:');
      categories.forEach((cat, index) => {
        console.log(`  ${index + 1}. ${cat}`);
      });
      console.log(`  ${categories.length + 1}. uncategorized`);
      
      const choice = await this.askQuestion(`${colors.cyan}Select category (1-${categories.length + 1}): ${colors.reset}`);
      const choiceIndex = parseInt(choice) - 1;
      
      if (choiceIndex >= 0 && choiceIndex < categories.length) {
        organizedColors[categories[choiceIndex]][colorName] = colorData;
      } else {
        organizedColors['uncategorized'][colorName] = colorData;
      }
    }
    
    // Generate organized files
    for (const [category, categoryColors] of Object.entries(organizedColors)) {
      if (Object.keys(categoryColors).length > 0) {
        await this.generateColorFiles(categoryColors, category);
        console.log(`${colors.green}✅ Generated ${category} colors (${Object.keys(categoryColors).length} colors)${colors.reset}`);
      }
    }
    
    await this.generateOrganizedColorFile(organizedColors);
    
    console.log(`📁 Output directory: ${colors.cyan}${this.outputDir}${colors.reset}\n`);
    
    await this.askForMoreActions();
  }

  /**
   * Generate color palette Storybook stories
   */
  async generateColorPaletteStories(colors) {
    console.log(`${colors.blue}📚 Generating color palette Storybook stories...${colors.reset}`);
    
    const organizedColors = this.categorizeColorsByType(colors);
    
    // Generate Storybook story
    const storyContent = this.generateColorStoryContent(organizedColors);
    
    const storiesDir = path.join(__dirname, '../src/stories/colors');
    await fs.promises.mkdir(storiesDir, { recursive: true });
    await fs.promises.writeFile(path.join(storiesDir, 'MCPColors.stories.tsx'), storyContent);
    
    console.log(`${colors.green}✅ Generated color palette Storybook stories${colors.reset}`);
    console.log(`📁 Output: ${colors.cyan}${storiesDir}/MCPColors.stories.tsx${colors.reset}\n`);
    
    await this.askForMoreActions();
  }

  /**
   * Full color system export
   */
  async fullColorSystemExport(colors) {
    console.log(`${colors.blue}🚀 Full color system export...${colors.reset}\n`);
    
    // Export all formats
    await this.exportAllColors(colors);
    
    // Organize by type
    const organizedColors = this.categorizeColorsByType(colors);
    await this.generateOrganizedColorFile(organizedColors);
    
    // Generate Storybook stories
    await this.generateColorPaletteStories(colors);
    
    // Generate color constants
    await this.generateColorConstants(colors);
    
    // Generate CSS custom properties
    await this.generateCSSCustomProperties(colors);
    
    // Generate TypeScript definitions
    await this.generateTypeScriptDefinitions(colors);
    
    console.log(`${colors.green}${colors.bright}🎉 Full color system export complete!${colors.reset}\n`);
    
    await this.askForMoreActions();
  }

  /**
   * Categorize colors by type
   */
  categorizeColorsByType(colors) {
    const categories = {
      primary: {},
      secondary: {},
      neutral: {},
      success: {},
      warning: {},
      error: {},
      info: {},
      other: {}
    };
    
    Object.entries(colors).forEach(([name, color]) => {
      const lowercaseName = name.toLowerCase();
      
      if (lowercaseName.includes('primary') || lowercaseName.includes('brand')) {
        categories.primary[name] = color;
      } else if (lowercaseName.includes('secondary')) {
        categories.secondary[name] = color;
      } else if (lowercaseName.includes('neutral') || lowercaseName.includes('gray') || lowercaseName.includes('grey')) {
        categories.neutral[name] = color;
      } else if (lowercaseName.includes('success') || lowercaseName.includes('green')) {
        categories.success[name] = color;
      } else if (lowercaseName.includes('warning') || lowercaseName.includes('yellow') || lowercaseName.includes('orange')) {
        categories.warning[name] = color;
      } else if (lowercaseName.includes('error') || lowercaseName.includes('danger') || lowercaseName.includes('red')) {
        categories.error[name] = color;
      } else if (lowercaseName.includes('info') || lowercaseName.includes('blue')) {
        categories.info[name] = color;
      } else {
        categories.other[name] = color;
      }
    });
    
    // Remove empty categories
    Object.keys(categories).forEach(key => {
      if (Object.keys(categories[key]).length === 0) {
        delete categories[key];
      }
    });
    
    return categories;
  }

  /**
   * Categorize colors by brightness
   */
  categorizeColorsByBrightness(colors) {
    const categories = {
      light: {},
      medium: {},
      dark: {}
    };
    
    Object.entries(colors).forEach(([name, color]) => {
      const brightness = this.calculateBrightness(color.hex);
      
      if (brightness > 170) {
        categories.light[name] = color;
      } else if (brightness > 85) {
        categories.medium[name] = color;
      } else {
        categories.dark[name] = color;
      }
    });
    
    return categories;
  }

  /**
   * Calculate color brightness
   */
  calculateBrightness(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
  }

  /**
   * Generate color files in multiple formats
   */
  async generateColorFiles(colors, prefix = '') {
    const outputDir = this.outputDir;
    await fs.promises.mkdir(outputDir, { recursive: true });
    
    const filename = prefix ? `colors-${prefix}` : 'colors';

    // CSS custom properties
    let css = ':root {\n';
    Object.entries(colors).forEach(([name, color]) => {
      const varName = `--color-${name.toLowerCase().replace(/[\/\s]/g, '-')}`;
      css += `  ${varName}: ${color.hex};\n`;
    });
    css += '}\n';
    await fs.promises.writeFile(path.join(outputDir, `${filename}.css`), css);

    // JavaScript
    const js = `// Colors extracted from Figma MCP\nexport const colors = ${JSON.stringify(colors, null, 2)};\n\nexport default colors;\n`;
    await fs.promises.writeFile(path.join(outputDir, `${filename}.js`), js);

    // JSON
    await fs.promises.writeFile(path.join(outputDir, `${filename}.json`), JSON.stringify(colors, null, 2));

    // SCSS variables
    let scss = `// Colors extracted from Figma MCP\n`;
    Object.entries(colors).forEach(([name, color]) => {
      const varName = `$color-${name.toLowerCase().replace(/[\/\s]/g, '-')}`;
      scss += `${varName}: ${color.hex};\n`;
    });
    await fs.promises.writeFile(path.join(outputDir, `${filename}.scss`), scss);
  }

  /**
   * Generate organized color file
   */
  async generateOrganizedColorFile(organizedColors) {
    const outputDir = this.outputDir;
    const filename = 'colors-organized';
    
    // JavaScript with categories
    let js = `// Organized colors extracted from Figma MCP\n`;
    Object.entries(organizedColors).forEach(([category, colors]) => {
      js += `export const ${category}Colors = ${JSON.stringify(colors, null, 2)};\n\n`;
    });
    
    js += `export const allColors = {\n`;
    Object.keys(organizedColors).forEach(category => {
      js += `  ${category}: ${category}Colors,\n`;
    });
    js += `};\n\nexport default allColors;\n`;
    
    await fs.promises.writeFile(path.join(outputDir, `${filename}.js`), js);
    
    // JSON
    await fs.promises.writeFile(path.join(outputDir, `${filename}.json`), JSON.stringify(organizedColors, null, 2));
  }

  /**
   * Generate color constants
   */
  async generateColorConstants(colors) {
    const outputDir = this.outputDir;
    
    let constants = `// Color constants extracted from Figma MCP\n`;
    constants += `export const COLORS = {\n`;
    
    Object.entries(colors).forEach(([name, color]) => {
      const constantName = name.toUpperCase().replace(/[\/\s-]/g, '_');
      constants += `  ${constantName}: '${color.hex}',\n`;
    });
    
    constants += `} as const;\n\nexport default COLORS;\n`;
    
    await fs.promises.writeFile(path.join(outputDir, 'color-constants.ts'), constants);
  }

  /**
   * Generate CSS custom properties
   */
  async generateCSSCustomProperties(colors) {
    const outputDir = this.outputDir;
    
    let css = `/* CSS Custom Properties extracted from Figma MCP */\n:root {\n`;
    
    Object.entries(colors).forEach(([name, color]) => {
      const varName = `--color-${name.toLowerCase().replace(/[\/\s]/g, '-')}`;
      css += `  ${varName}: ${color.hex};\n`;
      
      // Add RGB version for alpha transparency
      const rgb = color.rgb;
      const rgbValues = `${Math.round(rgb.r * 255)}, ${Math.round(rgb.g * 255)}, ${Math.round(rgb.b * 255)}`;
      css += `  ${varName}-rgb: ${rgbValues};\n`;
    });
    
    css += `}\n`;
    
    await fs.promises.writeFile(path.join(outputDir, 'custom-properties.css'), css);
  }

  /**
   * Generate TypeScript definitions
   */
  async generateTypeScriptDefinitions(colors) {
    const outputDir = this.outputDir;
    
    let types = `// TypeScript definitions for colors extracted from Figma MCP\n`;
    types += `export interface ColorToken {\n`;
    types += `  hex: string;\n`;
    types += `  rgb: { r: number; g: number; b: number };\n`;
    types += `  opacity: number;\n`;
    types += `  key: string;\n`;
    types += `  name: string;\n`;
    types += `}\n\n`;
    
    types += `export type ColorName = \n`;
    const colorNames = Object.keys(colors).map(name => `  | '${name}'`);
    types += colorNames.join('\n') + ';\n\n';
    
    types += `export type Colors = Record<ColorName, ColorToken>;\n\n`;
    types += `declare const colors: Colors;\n`;
    types += `export default colors;\n`;
    
    await fs.promises.writeFile(path.join(outputDir, 'colors.d.ts'), types);
  }

  /**
   * Generate Storybook story content
   */
  generateColorStoryContent(organizedColors) {
    return `import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import styled from 'styled-components';

const ColorPalette = styled.div\`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px;
\`;

const ColorCategory = styled.div\`
  display: flex;
  flex-direction: column;
  gap: 12px;
\`;

const CategoryTitle = styled.h3\`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  text-transform: capitalize;
\`;

const ColorGrid = styled.div\`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
\`;

const ColorSwatch = styled.div<{ color: string }>\`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
\`;

const ColorPreview = styled.div<{ color: string }>\`
  background-color: \${props => props.color};
  height: 80px;
  width: 100%;
\`;

const ColorInfo = styled.div\`
  padding: 12px;
  background: white;
\`;

const ColorName = styled.div\`
  font-weight: 600;
  margin-bottom: 4px;
\`;

const ColorValue = styled.div\`
  font-family: monospace;
  font-size: 12px;
  color: #666;
\`;

interface ColorPaletteProps {
  colors: Record<string, Record<string, { hex: string; name: string }>>;
}

const ColorPaletteComponent: React.FC<ColorPaletteProps> = ({ colors }) => {
  return (
    <ColorPalette>
      {Object.entries(colors).map(([category, categoryColors]) => (
        <ColorCategory key={category}>
          <CategoryTitle>{category}</CategoryTitle>
          <ColorGrid>
            {Object.entries(categoryColors).map(([name, color]) => (
              <ColorSwatch key={name} color={color.hex}>
                <ColorPreview color={color.hex} />
                <ColorInfo>
                  <ColorName>{name}</ColorName>
                  <ColorValue>{color.hex}</ColorValue>
                </ColorInfo>
              </ColorSwatch>
            ))}
          </ColorGrid>
        </ColorCategory>
      ))}
    </ColorPalette>
  );
};

const meta: Meta<typeof ColorPaletteComponent> = {
  title: 'Design System/Colors (MCP Extracted)',
  component: ColorPaletteComponent,
  parameters: {
    docs: {
      description: {
        component: 'Color palette extracted from Figma using MCP integration. These colors are directly sourced from the selected Figma frame.'
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof ColorPaletteComponent>;

export const AllColors: Story = {
  args: {
    colors: ${JSON.stringify(organizedColors, null, 6)}
  }
};

export const ColorShowcase: Story = {
  render: () => (
    <div style={{ padding: '20px' }}>
      <h2>🎨 Figma MCP Color Extraction</h2>
      <p>These colors were extracted directly from Figma using MCP (Model Context Protocol) integration.</p>
      <ColorPaletteComponent colors={${JSON.stringify(organizedColors, null, 8)}} />
    </div>
  )
};
`;
  }

  // Utility methods
  async askQuestion(question) {
    return new Promise((resolve) => {
      this.rl.question(question, resolve);
    });
  }

  async askYesNo(question) {
    const answer = await this.askQuestion(`${question} (y/n): `);
    return answer.toLowerCase() === 'y';
  }

  async askForMoreActions() {
    const more = await this.askYesNo(`${colors.cyan}Would you like to perform another color extraction?${colors.reset}`);
    if (more) {
      console.log('');
      await this.showColorOrganizationMenu(await this.extractor.extractColors());
    } else {
      console.log(`${colors.green}🎨 Color extraction complete! Your palette is ready!${colors.reset}`);
    }
  }
}

// Run the CLI if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const cli = new FigmaColorsMCPExtractor();
  cli.run().catch(console.error);
}

export default FigmaColorsMCPExtractor;