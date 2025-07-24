#!/usr/bin/env node

/**
 * Figma MCP-Based Design Token Extractor
 * 
 * This script replaces the original figma-extractor.js with MCP-based extraction.
 * It maintains the same output formats and CLI interface.
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

class FigmaMCPExtractorCLI {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.extractor = new FigmaMCPExtractor();
    this.outputDir = path.resolve(__dirname, '../src/theme/tokens');
  }

  /**
   * Main CLI interface
   */
  async run() {
    try {
      console.log(`${colors.cyan}${colors.bright}🎨 Figma MCP Design Token Extractor${colors.reset}`);
      console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
      
      console.log(`${colors.yellow}📋 MCP Extraction Requirements:${colors.reset}`);
      console.log('• Figma desktop app must be running');
      console.log('• Select the frame/component you want to extract');
      console.log('• MCP server must be available\n');

      const shouldContinue = await this.askQuestion(`${colors.cyan}Ready to extract from selected Figma frame? (y/n): ${colors.reset}`);
      
      if (shouldContinue.toLowerCase() !== 'y') {
        console.log(`${colors.yellow}Extraction cancelled.${colors.reset}`);
        this.rl.close();
        return;
      }

      await this.extractDesignTokens();
      
    } catch (error) {
      console.error(`${colors.red}❌ Extraction failed:${colors.reset}`, error.message);
      process.exit(1);
    } finally {
      this.rl.close();
    }
  }

  /**
   * Extract design tokens using MCP
   */
  async extractDesignTokens() {
    console.log(`${colors.blue}🔗 Connecting to Figma MCP...${colors.reset}`);
    
    try {
      // Initialize MCP connection
      await this.extractor.initialize();
      console.log(`${colors.green}✅ MCP connection established${colors.reset}\n`);

      // Show extraction options
      await this.showExtractionMenu();
      
    } catch (error) {
      console.error(`${colors.red}❌ MCP connection failed:${colors.reset}`, error.message);
      throw error;
    }
  }

  /**
   * Show extraction menu with options
   */
  async showExtractionMenu() {
    console.log(`${colors.cyan}${colors.bright}🛠️  Extraction Options:${colors.reset}`);
    console.log('1. Extract All Tokens (colors, typography, spacing)');
    console.log('2. Extract Colors Only');
    console.log('3. Extract Typography Only');
    console.log('4. Extract Spacing Only');
    console.log('5. Generate Component Code');
    console.log('6. Full Export (tokens + components + stories)');
    console.log('7. Custom Extraction\n');

    const choice = await this.askQuestion(`${colors.cyan}Select extraction type (1-7): ${colors.reset}`);
    
    switch (choice) {
      case '1':
        await this.extractAllTokens();
        break;
      case '2':
        await this.extractColors();
        break;
      case '3':
        await this.extractTypography();
        break;
      case '4':
        await this.extractSpacing();
        break;
      case '5':
        await this.generateComponentCode();
        break;
      case '6':
        await this.fullExport();
        break;
      case '7':
        await this.customExtraction();
        break;
      default:
        console.log(`${colors.red}Invalid choice. Please select 1-7.${colors.reset}`);
        await this.showExtractionMenu();
    }
  }

  /**
   * Extract all design tokens
   */
  async extractAllTokens() {
    console.log(`${colors.blue}🎨 Extracting all design tokens...${colors.reset}`);
    
    const tokens = await this.extractor.generateTokens(this.outputDir);
    
    console.log(`${colors.green}✅ Generated design tokens:${colors.reset}`);
    console.log(`• Colors: ${Object.keys(tokens.colors).length} tokens`);
    console.log(`• Typography: ${Object.keys(tokens.typography).length} styles`);
    console.log(`• Spacing: ${Object.keys(tokens.spacing).length} values`);
    console.log(`📁 Output directory: ${colors.cyan}${this.outputDir}${colors.reset}\n`);

    await this.askForMoreActions();
  }

  /**
   * Extract colors only
   */
  async extractColors() {
    console.log(`${colors.blue}🎨 Extracting colors...${colors.reset}`);
    
    const colors = await this.extractor.extractColors();
    
    // Generate color files
    await this.generateColorFiles(colors);
    
    console.log(`${colors.green}✅ Generated ${Object.keys(colors).length} color tokens${colors.reset}`);
    console.log(`📁 Output: ${colors.cyan}${this.outputDir}/colors.*${colors.reset}\n`);

    await this.askForMoreActions();
  }

  /**
   * Extract typography only
   */
  async extractTypography() {
    console.log(`${colors.blue}📝 Extracting typography...${colors.reset}`);
    
    const typography = await this.extractor.extractTypography();
    
    // Generate typography files
    await this.generateTypographyFiles(typography);
    
    console.log(`${colors.green}✅ Generated ${Object.keys(typography).length} typography tokens${colors.reset}`);
    console.log(`📁 Output: ${colors.cyan}${this.outputDir}/typography.*${colors.reset}\n`);

    await this.askForMoreActions();
  }

  /**
   * Extract spacing only
   */
  async extractSpacing() {
    console.log(`${colors.blue}📏 Extracting spacing...${colors.reset}`);
    
    const spacing = await this.extractor.extractSpacing();
    
    // Generate spacing files
    await this.generateSpacingFiles(spacing);
    
    console.log(`${colors.green}✅ Generated ${Object.keys(spacing).length} spacing tokens${colors.reset}`);
    console.log(`📁 Output: ${colors.cyan}${this.outputDir}/spacing.*${colors.reset}\n`);

    await this.askForMoreActions();
  }

  /**
   * Generate component code from selection
   */
  async generateComponentCode() {
    console.log(`${colors.blue}⚛️  Generating component code...${colors.reset}`);
    
    try {
      // This would integrate with the MCP code generation
      const componentCode = await this.generateReactComponent();
      
      const outputPath = path.join(__dirname, '../src/components/generated');
      await fs.promises.mkdir(outputPath, { recursive: true });
      
      await fs.promises.writeFile(
        path.join(outputPath, 'MCPComponent.tsx'),
        componentCode
      );
      
      console.log(`${colors.green}✅ Generated React component${colors.reset}`);
      console.log(`📁 Output: ${colors.cyan}${outputPath}/MCPComponent.tsx${colors.reset}\n`);
      
    } catch (error) {
      console.error(`${colors.red}❌ Component generation failed:${colors.reset}`, error.message);
    }

    await this.askForMoreActions();
  }

  /**
   * Full export with everything
   */
  async fullExport() {
    console.log(`${colors.blue}🚀 Full export starting...${colors.reset}\n`);
    
    // Extract all tokens
    await this.extractAllTokens();
    
    // Generate component
    await this.generateComponentCode();
    
    // Generate Storybook stories
    await this.generateStorybookStories();
    
    console.log(`${colors.green}${colors.bright}🎉 Full export complete!${colors.reset}\n`);
    
    await this.askForMoreActions();
  }

  /**
   * Custom extraction with user choices
   */
  async customExtraction() {
    console.log(`${colors.cyan}🛠️  Custom Extraction${colors.reset}\n`);
    
    const extractColors = await this.askYesNo('Extract colors?');
    const extractTypography = await this.askYesNo('Extract typography?');
    const extractSpacing = await this.askYesNo('Extract spacing?');
    const generateComponent = await this.askYesNo('Generate component code?');
    const generateStories = await this.askYesNo('Generate Storybook stories?');
    
    console.log(`${colors.blue}🔄 Custom extraction starting...${colors.reset}`);
    
    let results = {};
    
    if (extractColors) {
      results.colors = await this.extractor.extractColors();
      await this.generateColorFiles(results.colors);
    }
    
    if (extractTypography) {
      results.typography = await this.extractor.extractTypography();
      await this.generateTypographyFiles(results.typography);
    }
    
    if (extractSpacing) {
      results.spacing = await this.extractor.extractSpacing();
      await this.generateSpacingFiles(results.spacing);
    }
    
    if (generateComponent) {
      await this.generateComponentCode();
    }
    
    if (generateStories) {
      await this.generateStorybookStories();
    }
    
    console.log(`${colors.green}✅ Custom extraction complete!${colors.reset}\n`);
    
    await this.askForMoreActions();
  }

  /**
   * Generate color files in multiple formats
   */
  async generateColorFiles(colors) {
    const outputDir = this.outputDir;
    await fs.promises.mkdir(outputDir, { recursive: true });

    // CSS custom properties
    let css = ':root {\n';
    Object.entries(colors).forEach(([name, color]) => {
      const varName = `--color-${name.toLowerCase().replace(/[\/\s]/g, '-')}`;
      css += `  ${varName}: ${color.hex};\n`;
    });
    css += '}\n';
    await fs.promises.writeFile(path.join(outputDir, 'colors.css'), css);

    // JavaScript
    const js = `export const colors = ${JSON.stringify(colors, null, 2)};\n\nexport default colors;\n`;
    await fs.promises.writeFile(path.join(outputDir, 'colors.js'), js);

    // JSON
    await fs.promises.writeFile(path.join(outputDir, 'colors.json'), JSON.stringify(colors, null, 2));

    // SCSS variables
    let scss = '';
    Object.entries(colors).forEach(([name, color]) => {
      const varName = `$color-${name.toLowerCase().replace(/[\/\s]/g, '-')}`;
      scss += `${varName}: ${color.hex};\n`;
    });
    await fs.promises.writeFile(path.join(outputDir, 'colors.scss'), scss);
  }

  /**
   * Generate typography files
   */
  async generateTypographyFiles(typography) {
    const outputDir = this.outputDir;
    await fs.promises.mkdir(outputDir, { recursive: true });

    // CSS
    let css = '';
    Object.entries(typography).forEach(([name, type]) => {
      const className = `.typography-${name.toLowerCase().replace(/[\/\s]/g, '-')}`;
      css += `${className} {\n`;
      css += `  font-family: ${type.fontFamily};\n`;
      css += `  font-size: ${type.fontSize}px;\n`;
      css += `  font-weight: ${type.fontWeight};\n`;
      css += `  line-height: ${type.lineHeight}px;\n`;
      css += '}\n\n';
    });
    await fs.promises.writeFile(path.join(outputDir, 'typography.css'), css);

    // JavaScript
    const js = `export const typography = ${JSON.stringify(typography, null, 2)};\n\nexport default typography;\n`;
    await fs.promises.writeFile(path.join(outputDir, 'typography.js'), js);

    // JSON
    await fs.promises.writeFile(path.join(outputDir, 'typography.json'), JSON.stringify(typography, null, 2));
  }

  /**
   * Generate spacing files
   */
  async generateSpacingFiles(spacing) {
    const outputDir = this.outputDir;
    await fs.promises.mkdir(outputDir, { recursive: true });

    // CSS custom properties
    let css = ':root {\n';
    Object.entries(spacing).forEach(([name, value]) => {
      css += `  --spacing-${name}: ${value};\n`;
    });
    css += '}\n';
    await fs.promises.writeFile(path.join(outputDir, 'spacing.css'), css);

    // JavaScript
    const js = `export const spacing = ${JSON.stringify(spacing, null, 2)};\n\nexport default spacing;\n`;
    await fs.promises.writeFile(path.join(outputDir, 'spacing.js'), js);

    // JSON
    await fs.promises.writeFile(path.join(outputDir, 'spacing.json'), JSON.stringify(spacing, null, 2));
  }

  /**
   * Generate React component from MCP data
   */
  async generateReactComponent() {
    // This would use the actual MCP code generation
    // For now, return a template based on the MCP structure
    return `import React from 'react';
import styled from 'styled-components';

// Component generated from Figma MCP
export interface MCPComponentProps {
  className?: string;
  children?: React.ReactNode;
}

const StyledComponent = styled.div\`
  /* Styles extracted from Figma MCP */
  background: #FFFFFF;
  border-radius: 6px;
  padding: 12px;
  box-shadow: 0px 2px 11px 9px rgba(65, 84, 140, 0.4);
\`;

export const MCPComponent: React.FC<MCPComponentProps> = ({ 
  className, 
  children 
}) => {
  return (
    <StyledComponent className={className}>
      {children}
    </StyledComponent>
  );
};

export default MCPComponent;
`;
  }

  /**
   * Generate Storybook stories
   */
  async generateStorybookStories() {
    console.log(`${colors.blue}📚 Generating Storybook stories...${colors.reset}`);
    
    const storyContent = `import type { Meta, StoryObj } from '@storybook/react';
import { MCPComponent } from '../components/generated/MCPComponent';

const meta: Meta<typeof MCPComponent> = {
  title: 'Generated/MCP Component',
  component: MCPComponent,
  parameters: {
    docs: {
      description: {
        component: 'Component generated from Figma MCP extraction'
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof MCPComponent>;

export const Default: Story = {
  args: {
    children: 'MCP Generated Component'
  }
};
`;
    
    const storiesDir = path.join(__dirname, '../src/stories/generated');
    await fs.promises.mkdir(storiesDir, { recursive: true });
    await fs.promises.writeFile(path.join(storiesDir, 'MCPComponent.stories.tsx'), storyContent);
    
    console.log(`${colors.green}✅ Generated Storybook stories${colors.reset}`);
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
    const more = await this.askYesNo(`${colors.cyan}Would you like to perform another extraction?${colors.reset}`);
    if (more) {
      console.log('');
      await this.showExtractionMenu();
    } else {
      console.log(`${colors.green}✨ Extraction complete! Happy designing!${colors.reset}`);
    }
  }
}

// Run the CLI if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const cli = new FigmaMCPExtractorCLI();
  cli.run().catch(console.error);
}

export default FigmaMCPExtractorCLI;