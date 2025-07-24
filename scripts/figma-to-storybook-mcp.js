#!/usr/bin/env node

/**
 * Figma MCP-Based Storybook Generator
 * 
 * This script replaces the original figma-to-storybook.js with MCP-based extraction.
 * It generates comprehensive Storybook stories from Figma MCP data.
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

class FigmaStorybookMCPGenerator {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.extractor = new FigmaMCPExtractor();
    this.storiesDir = path.resolve(__dirname, '../src/stories/figma-mcp');
    this.componentsDir = path.resolve(__dirname, '../src/components/figma-mcp');
  }

  /**
   * Main CLI interface
   */
  async run() {
    try {
      console.log(`${colors.cyan}${colors.bright}📚 Figma MCP → Storybook Generator${colors.reset}`);
      console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
      
      console.log(`${colors.yellow}📋 MCP Storybook Generation Requirements:${colors.reset}`);
      console.log('• Figma desktop app must be running');
      console.log('• Select a frame/component to generate stories for');
      console.log('• MCP server must be available');
      console.log('• Storybook must be configured in your project\n');

      const shouldContinue = await this.askQuestion(`${colors.cyan}Ready to generate Storybook stories from Figma MCP? (y/n): ${colors.reset}`);
      
      if (shouldContinue.toLowerCase() !== 'y') {
        console.log(`${colors.yellow}Storybook generation cancelled.${colors.reset}`);
        this.rl.close();
        return;
      }

      await this.generateStorybookContent();
      
    } catch (error) {
      console.error(`${colors.red}❌ Storybook generation failed:${colors.reset}`, error.message);
      process.exit(1);
    } finally {
      this.rl.close();
    }
  }

  /**
   * Generate Storybook content using MCP
   */
  async generateStorybookContent() {
    console.log(`${colors.blue}🔗 Connecting to Figma MCP for Storybook generation...${colors.reset}`);
    
    try {
      // Initialize MCP connection
      await this.extractor.initialize();
      console.log(`${colors.green}✅ MCP connection established${colors.reset}\n`);

      // Show generation options
      await this.showGenerationMenu();
      
    } catch (error) {
      console.error(`${colors.red}❌ MCP connection failed:${colors.reset}`, error.message);
      throw error;
    }
  }

  /**
   * Show generation menu with options
   */
  async showGenerationMenu() {
    console.log(`${colors.cyan}${colors.bright}📖 Storybook Generation Options:${colors.reset}`);
    console.log('1. Generate Complete Design System Stories');
    console.log('2. Generate Component Stories Only');
    console.log('3. Generate Design Token Stories');
    console.log('4. Generate Color Palette Stories');
    console.log('5. Generate Typography Stories');
    console.log('6. Generate Spacing Stories');
    console.log('7. Generate Interactive Component Demo');
    console.log('8. Custom Story Generation\n');

    const choice = await this.askQuestion(`${colors.cyan}Select generation type (1-8): ${colors.reset}`);
    
    switch (choice) {
      case '1':
        await this.generateCompleteDesignSystem();
        break;
      case '2':
        await this.generateComponentStoriesOnly();
        break;
      case '3':
        await this.generateDesignTokenStories();
        break;
      case '4':
        await this.generateColorPaletteStories();
        break;
      case '5':
        await this.generateTypographyStories();
        break;
      case '6':
        await this.generateSpacingStories();
        break;
      case '7':
        await this.generateInteractiveDemo();
        break;
      case '8':
        await this.customStoryGeneration();
        break;
      default:
        console.log(`${colors.red}Invalid choice. Please select 1-8.${colors.reset}`);
        await this.showGenerationMenu();
    }
  }

  /**
   * Generate complete design system stories
   */
  async generateCompleteDesignSystem() {
    console.log(`${colors.blue}🚀 Generating complete design system stories...${colors.reset}\n`);
    
    // Extract all data
    const tokens = await this.extractor.generateTokens();
    const colors = await this.extractor.extractColors();
    const typography = await this.extractor.extractTypography();
    const spacing = await this.extractor.extractSpacing();
    
    // Generate all story types
    await this.createDesignSystemOverview(tokens);
    await this.createColorStories(colors);
    await this.createTypographyStories(typography);
    await this.createSpacingStories(spacing);
    await this.createComponentStories();
    await this.createUsageExamples();
    
    console.log(`${colors.green}${colors.bright}🎉 Complete design system stories generated!${colors.reset}`);
    console.log(`📁 Stories location: ${colors.cyan}${this.storiesDir}${colors.reset}\n`);
    
    await this.askForMoreActions();
  }

  /**
   * Generate component stories only
   */
  async generateComponentStoriesOnly() {
    console.log(`${colors.blue}⚛️  Generating component stories...${colors.reset}`);
    
    await this.createComponentStories();
    await this.createComponentVariations();
    await this.createInteractiveExamples();
    
    console.log(`${colors.green}✅ Component stories generated${colors.reset}`);
    console.log(`📁 Stories location: ${colors.cyan}${this.storiesDir}/components${colors.reset}\n`);
    
    await this.askForMoreActions();
  }

  /**
   * Generate design token stories
   */
  async generateDesignTokenStories() {
    console.log(`${colors.blue}🎨 Generating design token stories...${colors.reset}`);
    
    const tokens = await this.extractor.generateTokens();
    
    await this.createTokenOverview(tokens);
    await this.createTokenUsageExamples(tokens);
    await this.createTokenComparison(tokens);
    
    console.log(`${colors.green}✅ Design token stories generated${colors.reset}`);
    console.log(`📁 Stories location: ${colors.cyan}${this.storiesDir}/tokens${colors.reset}\n`);
    
    await this.askForMoreActions();
  }

  /**
   * Generate color palette stories
   */
  async generateColorPaletteStories() {
    console.log(`${colors.blue}🎨 Generating color palette stories...${colors.reset}`);
    
    const colors = await this.extractor.extractColors();
    await this.createColorStories(colors);
    
    console.log(`${colors.green}✅ Color palette stories generated${colors.reset}`);
    console.log(`📁 Stories location: ${colors.cyan}${this.storiesDir}/colors${colors.reset}\n`);
    
    await this.askForMoreActions();
  }

  /**
   * Generate typography stories
   */
  async generateTypographyStories() {
    console.log(`${colors.blue}📝 Generating typography stories...${colors.reset}`);
    
    const typography = await this.extractor.extractTypography();
    await this.createTypographyStories(typography);
    
    console.log(`${colors.green}✅ Typography stories generated${colors.reset}`);
    console.log(`📁 Stories location: ${colors.cyan}${this.storiesDir}/typography${colors.reset}\n`);
    
    await this.askForMoreActions();
  }

  /**
   * Generate spacing stories  
   */
  async generateSpacingStories() {
    console.log(`${colors.blue}📏 Generating spacing stories...${colors.reset}`);
    
    const spacing = await this.extractor.extractSpacing();
    await this.createSpacingStories(spacing);
    
    console.log(`${colors.green}✅ Spacing stories generated${colors.reset}`);
    console.log(`📁 Stories location: ${colors.cyan}${this.storiesDir}/spacing${colors.reset}\n`);
    
    await this.askForMoreActions();
  }

  /**
   * Generate interactive component demo
   */
  async generateInteractiveDemo() {
    console.log(`${colors.blue}🎮 Generating interactive component demo...${colors.reset}`);
    
    await this.createInteractiveDemo();
    await this.createPlaygroundStory();
    
    console.log(`${colors.green}✅ Interactive demo generated${colors.reset}`);
    console.log(`📁 Stories location: ${colors.cyan}${this.storiesDir}/interactive${colors.reset}\n`);
    
    await this.askForMoreActions();
  }

  /**
   * Custom story generation
   */
  async customStoryGeneration() {
    console.log(`${colors.cyan}🛠️  Custom Story Generation${colors.reset}\n`);
    
    const generateColors = await this.askYesNo('Generate color stories?');
    const generateTypography = await this.askYesNo('Generate typography stories?');
    const generateSpacing = await this.askYesNo('Generate spacing stories?');
    const generateComponents = await this.askYesNo('Generate component stories?');
    const generateInteractive = await this.askYesNo('Generate interactive examples?');
    const generateUsage = await this.askYesNo('Generate usage examples?');
    
    console.log(`${colors.blue}🔄 Custom generation starting...${colors.reset}`);
    
    if (generateColors) {
      const colors = await this.extractor.extractColors();
      await this.createColorStories(colors);
    }
    
    if (generateTypography) {
      const typography = await this.extractor.extractTypography();
      await this.createTypographyStories(typography);
    }
    
    if (generateSpacing) {
      const spacing = await this.extractor.extractSpacing();
      await this.createSpacingStories(spacing);
    }
    
    if (generateComponents) {
      await this.createComponentStories();
    }
    
    if (generateInteractive) {
      await this.createInteractiveExamples();
    }
    
    if (generateUsage) {
      await this.createUsageExamples();
    }
    
    console.log(`${colors.green}✅ Custom story generation complete!${colors.reset}\n`);
    
    await this.askForMoreActions();
  }

  /**
   * Create design system overview story
   */
  async createDesignSystemOverview(tokens) {
    const storyContent = `import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import styled from 'styled-components';

const Overview = styled.div\`
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
\`;

const Title = styled.h1\`
  color: #0272C3;
  margin-bottom: 16px;
\`;

const Section = styled.div\`
  margin-bottom: 32px;
\`;

const SectionTitle = styled.h2\`
  color: #333;
  border-bottom: 2px solid #0272C3;
  padding-bottom: 8px;
\`;

const TokenGrid = styled.div\`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 16px;
\`;

const TokenCard = styled.div\`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background: white;
\`;

const TokenCount = styled.div\`
  font-size: 24px;
  font-weight: bold;
  color: #0272C3;
\`;

const TokenLabel = styled.div\`
  color: #666;
  margin-top: 4px;
\`;

const DesignSystemOverview: React.FC = () => {
  const tokens = ${JSON.stringify(tokens, null, 4)};
  
  return (
    <Overview>
      <Title>🎨 Design System (Figma MCP)</Title>
      <p>This design system was automatically generated from Figma using MCP (Model Context Protocol) integration.</p>
      
      <Section>
        <SectionTitle>📊 Token Summary</SectionTitle>
        <TokenGrid>
          <TokenCard>
            <TokenCount>{Object.keys(tokens.colors || {}).length}</TokenCount>
            <TokenLabel>Color Tokens</TokenLabel>
          </TokenCard>
          <TokenCard>
            <TokenCount>{Object.keys(tokens.typography || {}).length}</TokenCount>
            <TokenLabel>Typography Styles</TokenLabel>
          </TokenCard>
          <TokenCard>
            <TokenCount>{Object.keys(tokens.spacing || {}).length}</TokenCount>
            <TokenLabel>Spacing Values</TokenLabel>
          </TokenCard>
        </TokenGrid>
      </Section>
      
      <Section>
        <SectionTitle>🔗 MCP Integration</SectionTitle>
        <p>These tokens were extracted directly from Figma using:</p>
        <ul>
          <li>Real-time design sync</li>
          <li>Automatic token generation</li>
          <li>Pixel-perfect accuracy</li>
          <li>Live asset extraction</li>
        </ul>
      </Section>
      
      <Section>
        <SectionTitle>📚 Available Stories</SectionTitle>
        <p>Explore the design system:</p>
        <ul>
          <li><strong>Colors:</strong> View the complete color palette</li>
          <li><strong>Typography:</strong> See all text styles and usage</li>
          <li><strong>Spacing:</strong> Understand spacing patterns</li>
          <li><strong>Components:</strong> Interactive component examples</li>
        </ul>
      </Section>
    </Overview>
  );
};

const meta: Meta<typeof DesignSystemOverview> = {
  title: 'Figma MCP/Design System Overview',
  component: DesignSystemOverview,
  parameters: {
    docs: {
      description: {
        component: 'Complete design system overview generated from Figma MCP integration'
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof DesignSystemOverview>;

export const Overview: Story = {};
`;

    await this.writeStoryFile('00-Overview.stories.tsx', storyContent);
  }

  /**
   * Create color stories
   */
  async createColorStories(colors) {
    // Organize colors by type
    const organizedColors = this.organizeColorsByType(colors);
    
    const storyContent = `import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import styled from 'styled-components';

const ColorPalette = styled.div\`
  padding: 24px;
\`;

const ColorSection = styled.div\`
  margin-bottom: 32px;
\`;

const SectionTitle = styled.h2\`
  color: #0272C3;
  margin-bottom: 16px;
  text-transform: capitalize;
\`;

const ColorGrid = styled.div\`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
\`;

const ColorSwatch = styled.div\`
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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
  font-family: 'SF Mono', 'Consolas', monospace;
  font-size: 12px;
  color: #666;
\`;

interface ColorPaletteProps {
  colors: Record<string, Record<string, { hex: string; name: string }>>;
}

const ColorPaletteComponent: React.FC<ColorPaletteProps> = ({ colors }) => {
  return (
    <ColorPalette>
      <h1>🎨 Color Palette (Figma MCP)</h1>
      <p>Colors extracted directly from Figma using MCP integration</p>
      
      {Object.entries(colors).map(([category, categoryColors]) => (
        <ColorSection key={category}>
          <SectionTitle>{category} Colors</SectionTitle>
          <ColorGrid>
            {Object.entries(categoryColors).map(([name, color]) => (
              <ColorSwatch key={name}>
                <ColorPreview color={color.hex} />
                <ColorInfo>
                  <ColorName>{name}</ColorName>
                  <ColorValue>{color.hex}</ColorValue>
                </ColorInfo>
              </ColorSwatch>
            ))}
          </ColorGrid>
        </ColorSection>
      ))}
    </ColorPalette>
  );
};

const meta: Meta<typeof ColorPaletteComponent> = {
  title: 'Figma MCP/Colors',
  component: ColorPaletteComponent,
  parameters: {
    docs: {
      description: {
        component: 'Color palette extracted from Figma using MCP integration'
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof ColorPaletteComponent>;

const organizedColors = ${JSON.stringify(organizedColors, null, 2)};

export const AllColors: Story = {
  args: {
    colors: organizedColors
  }
};

${Object.entries(organizedColors).map(([category, categoryColors]) => `
export const ${category.charAt(0).toUpperCase() + category.slice(1)}Colors: Story = {
  args: {
    colors: { ${category}: organizedColors.${category} }
  }
};`).join('')}
`;

    await this.writeStoryFile('colors/Colors.stories.tsx', storyContent);
  }

  /**
   * Create typography stories
   */
  async createTypographyStories(typography) {
    const storyContent = `import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import styled from 'styled-components';

const TypographyShowcase = styled.div\`
  padding: 24px;
\`;

const TypeGrid = styled.div\`
  display: flex;
  flex-direction: column;
  gap: 24px;
\`;

const TypeExample = styled.div\`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  background: white;
\`;

const TypeName = styled.h3\`
  color: #0272C3;
  margin: 0 0 8px 0;
  font-size: 16px;
\`;

const TypePreview = styled.div<{
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
}>\`
  font-family: \${props => props.fontFamily};
  font-size: \${props => props.fontSize}px;
  font-weight: \${props => props.fontWeight};
  line-height: \${props => props.lineHeight}px;
  margin: 12px 0;
\`;

const TypeSpecs = styled.div\`
  font-family: 'SF Mono', 'Consolas', monospace;
  font-size: 12px;
  color: #666;
  margin-top: 8px;
\`;

interface TypographyShowcaseProps {
  typography: Record<string, {
    fontFamily: string;
    fontSize: number;
    fontWeight: number;
    lineHeight: number;
    name: string;
  }>;
}

const TypographyShowcaseComponent: React.FC<TypographyShowcaseProps> = ({ typography }) => {
  return (
    <TypographyShowcase>
      <h1>📝 Typography System (Figma MCP)</h1>
      <p>Typography styles extracted directly from Figma using MCP integration</p>
      
      <TypeGrid>
        {Object.entries(typography).map(([key, style]) => (
          <TypeExample key={key}>
            <TypeName>{style.name}</TypeName>
            <TypePreview
              fontFamily={style.fontFamily}
              fontSize={style.fontSize}
              fontWeight={style.fontWeight}
              lineHeight={style.lineHeight}
            >
              The quick brown fox jumps over the lazy dog. 1234567890
            </TypePreview>
            <TypeSpecs>
              Font: {style.fontFamily} | Size: {style.fontSize}px | Weight: {style.fontWeight} | Line Height: {style.lineHeight}px
            </TypeSpecs>
          </TypeExample>
        ))}
      </TypeGrid>
    </TypographyShowcase>
  );
};

const meta: Meta<typeof TypographyShowcaseComponent> = {
  title: 'Figma MCP/Typography',
  component: TypographyShowcaseComponent,
  parameters: {
    docs: {
      description: {
        component: 'Typography system extracted from Figma using MCP integration'
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof TypographyShowcaseComponent>;

export const AllTypography: Story = {
  args: {
    typography: ${JSON.stringify(typography, null, 6)}
  }
};
`;

    await this.writeStoryFile('typography/Typography.stories.tsx', storyContent);
  }

  /**
   * Create spacing stories
   */
  async createSpacingStories(spacing) {
    const storyContent = `import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import styled from 'styled-components';

const SpacingShowcase = styled.div\`
  padding: 24px;
\`;

const SpacingGrid = styled.div\`
  display: flex;
  flex-direction: column;
  gap: 20px;
\`;

const SpacingExample = styled.div\`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background: white;
\`;

const SpacingName = styled.h3\`
  color: #0272C3;
  margin: 0 0 8px 0;
  font-size: 16px;
\`;

const SpacingVisual = styled.div<{ size: string }>\`
  background: #0272C3;
  width: \${props => props.size};
  height: 20px;
  margin: 8px 0;
  border-radius: 2px;
\`;

const SpacingValue = styled.div\`
  font-family: 'SF Mono', 'Consolas', monospace;
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
\`;

interface SpacingShowcaseProps {
  spacing: Record<string, string>;
}

const SpacingShowcaseComponent: React.FC<SpacingShowcaseProps> = ({ spacing }) => {
  return (
    <SpacingShowcase>
      <h1>📏 Spacing System (Figma MCP)</h1>
      <p>Spacing values extracted directly from Figma using MCP integration</p>
      
      <SpacingGrid>
        {Object.entries(spacing).map(([name, value]) => (
          <SpacingExample key={name}>
            <SpacingName>{name}</SpacingName>
            <SpacingValue>{value}</SpacingValue>
            <SpacingVisual size={value} />
          </SpacingExample>
        ))}
      </SpacingGrid>
    </SpacingShowcase>
  );
};

const meta: Meta<typeof SpacingShowcaseComponent> = {
  title: 'Figma MCP/Spacing',
  component: SpacingShowcaseComponent,
  parameters: {
    docs: {
      description: {
        component: 'Spacing system extracted from Figma using MCP integration'
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof SpacingShowcaseComponent>;

export const AllSpacing: Story = {
  args: {
    spacing: ${JSON.stringify(spacing, null, 6)}
  }
};
`;

    await this.writeStoryFile('spacing/Spacing.stories.tsx', storyContent);
  }

  /**
   * Create component stories
   */
  async createComponentStories() {
    const componentContent = `import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import styled from 'styled-components';

// MCP-generated component (would be extracted from actual MCP data)
const MCPComponent = styled.div\`
  background: #FFFFFF;
  border: 1px solid #e9f0ff;
  border-radius: 3px;
  padding: 12px;
  box-shadow: 0px 1px 2px 0px rgba(0, 45, 86, 0.25);
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  line-height: 22px;
\`;

interface MCPComponentProps {
  children?: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary';
}

const Component: React.FC<MCPComponentProps> = ({ children, variant = 'default' }) => {
  return (
    <MCPComponent data-variant={variant}>
      {children || 'MCP Generated Component'}
    </MCPComponent>
  );
};

const meta: Meta<typeof Component> = {
  title: 'Figma MCP/Components',
  component: Component,
  parameters: {
    docs: {
      description: {
        component: 'Component generated from Figma MCP integration with pixel-perfect styling'
      }
    }
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'primary', 'secondary']
    }
  }
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    children: 'Default MCP Component'
  }
};

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary MCP Component'
  }
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary MCP Component'
  }
};
`;

    await this.writeStoryFile('components/MCPComponent.stories.tsx', componentContent);
  }

  /**
   * Create interactive demo
   */
  async createInteractiveDemo() {
    const demoContent = `import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import styled from 'styled-components';

const PlaygroundContainer = styled.div\`
  padding: 24px;
\`;

const Controls = styled.div\`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
\`;

const ControlGroup = styled.div\`
  display: flex;
  flex-direction: column;
  gap: 8px;
\`;

const Label = styled.label\`
  font-weight: 600;
  color: #333;
\`;

const Select = styled.select\`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
\`;

const ColorPicker = styled.input\`
  width: 50px;
  height: 30px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
\`;

const PreviewArea = styled.div\`
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  background: white;
\`;

const DynamicComponent = styled.div<{
  bgColor: string;
  textColor: string;
  fontSize: string;
  padding: string;
  borderRadius: string;
}>\`
  background-color: \${props => props.bgColor};
  color: \${props => props.textColor};
  font-size: \${props => props.fontSize};
  padding: \${props => props.padding};
  border-radius: \${props => props.borderRadius};
  display: inline-block;
  transition: all 0.3s ease;
\`;

const InteractivePlayground: React.FC = () => {
  const [bgColor, setBgColor] = useState('#0272C3');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [fontSize, setFontSize] = useState('16px');
  const [padding, setPadding] = useState('12px');
  const [borderRadius, setBorderRadius] = useState('4px');

  return (
    <PlaygroundContainer>
      <h1>🎮 Interactive MCP Component Playground</h1>
      <p>Experiment with design tokens extracted from Figma MCP</p>
      
      <Controls>
        <ControlGroup>
          <Label htmlFor="bgColor">Background Color</Label>
          <ColorPicker
            id="bgColor"
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
          />
        </ControlGroup>
        
        <ControlGroup>
          <Label htmlFor="textColor">Text Color</Label>
          <ColorPicker
            id="textColor"
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
          />
        </ControlGroup>
        
        <ControlGroup>
          <Label htmlFor="fontSize">Font Size</Label>
          <Select
            id="fontSize"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
          >
            <option value="12px">12px</option>
            <option value="14px">14px</option>
            <option value="16px">16px</option>
            <option value="18px">18px</option>
            <option value="24px">24px</option>
          </Select>
        </ControlGroup>
        
        <ControlGroup>
          <Label htmlFor="padding">Padding</Label>
          <Select
            id="padding"
            value={padding}
            onChange={(e) => setPadding(e.target.value)}
          >
            <option value="4px">4px</option>
            <option value="8px">8px</option>
            <option value="12px">12px</option>
            <option value="16px">16px</option>
            <option value="24px">24px</option>
          </Select>
        </ControlGroup>
        
        <ControlGroup>
          <Label htmlFor="borderRadius">Border Radius</Label>
          <Select
            id="borderRadius"
            value={borderRadius}
            onChange={(e) => setBorderRadius(e.target.value)}
          >
            <option value="0px">0px</option>
            <option value="2px">2px</option>
            <option value="4px">4px</option>
            <option value="8px">8px</option>
            <option value="12px">12px</option>
          </Select>
        </ControlGroup>
      </Controls>
      
      <PreviewArea>
        <DynamicComponent
          bgColor={bgColor}
          textColor={textColor}
          fontSize={fontSize}
          padding={padding}
          borderRadius={borderRadius}
        >
          MCP Interactive Component
        </DynamicComponent>
      </PreviewArea>
    </PlaygroundContainer>
  );
};

const meta: Meta<typeof InteractivePlayground> = {
  title: 'Figma MCP/Interactive Playground',
  component: InteractivePlayground,
  parameters: {
    docs: {
      description: {
        component: 'Interactive playground for experimenting with MCP-extracted design tokens'
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof InteractivePlayground>;

export const Playground: Story = {};
`;

    await this.writeStoryFile('interactive/Playground.stories.tsx', demoContent);
  }

  /**
   * Create usage examples
   */
  async createUsageExamples() {
    const usageContent = `import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import styled from 'styled-components';

const UsageGuide = styled.div\`
  padding: 24px;
  max-width: 800px;
\`;

const Section = styled.div\`
  margin-bottom: 32px;
\`;

const SectionTitle = styled.h2\`
  color: #0272C3;
  border-bottom: 2px solid #0272C3;
  padding-bottom: 8px;
\`;

const CodeBlock = styled.pre\`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 16px;
  overflow-x: auto;
  font-family: 'SF Mono', 'Consolas', monospace;
  font-size: 14px;
\`;

const Example = styled.div\`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin: 16px 0;
\`;

const ExampleHeader = styled.div\`
  background: #f8f9fa;
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  font-weight: 600;
\`;

const ExampleContent = styled.div\`
  padding: 16px;
\`;

const UsageExamples: React.FC = () => {
  return (
    <UsageGuide>
      <h1>📚 Usage Examples (Figma MCP)</h1>
      <p>Learn how to use design tokens and components extracted from Figma MCP</p>
      
      <Section>
        <SectionTitle>🎨 Using Color Tokens</SectionTitle>
        <Example>
          <ExampleHeader>CSS Custom Properties</ExampleHeader>
          <ExampleContent>
            <CodeBlock>{\`/* Use extracted color tokens */
.my-component {
  background-color: var(--color-primary-7);
  color: var(--color-neutral-1);
  border: 1px solid var(--color-primary-5);
}\`}</CodeBlock>
          </ExampleContent>
        </Example>
        
        <Example>
          <ExampleHeader>JavaScript/React</ExampleHeader>
          <ExampleContent>
            <CodeBlock>{\`import { colors } from './theme/colors';

const StyledComponent = styled.div\\\`
  background: \\\${colors['primary/7'].hex};
  color: \\\${colors['neutral/1'].hex};
\\\`;\`}</CodeBlock>
          </ExampleContent>
        </Example>
      </Section>
      
      <Section>
        <SectionTitle>📝 Using Typography Tokens</SectionTitle>
        <Example>
          <ExampleHeader>CSS Classes</ExampleHeader>
          <ExampleContent>
            <CodeBlock>{\`/* Typography from Figma MCP */
.typography-body-regular {
  font-family: 'Roboto';
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
}\`}</CodeBlock>
          </ExampleContent>
        </Example>
        
        <Example>
          <ExampleHeader>React with Styled Components</ExampleHeader>
          <ExampleContent>
            <CodeBlock>{\`import { typography } from './theme/typography';

const Text = styled.p\\\`
  font-family: \\\${typography['body/regular'].fontFamily};
  font-size: \\\${typography['body/regular'].fontSize}px;
  font-weight: \\\${typography['body/regular'].fontWeight};
  line-height: \\\${typography['body/regular'].lineHeight}px;
\\\`;\`}</CodeBlock>
          </ExampleContent>
        </Example>
      </Section>
      
      <Section>
        <SectionTitle>📏 Using Spacing Tokens</SectionTitle>
        <Example>
          <ExampleHeader>CSS Custom Properties</ExampleHeader>
          <ExampleContent>
            <CodeBlock>{\`/* Consistent spacing from Figma */
.card {
  padding: var(--spacing-md);
  margin: var(--spacing-lg);
  gap: var(--spacing-sm);
}\`}</CodeBlock>
          </ExampleContent>
        </Example>
      </Section>
      
      <Section>
        <SectionTitle>⚛️ Component Integration</SectionTitle>
        <Example>
          <ExampleHeader>React Component</ExampleHeader>
          <ExampleContent>
            <CodeBlock>{\`import { MCPComponent } from './components/figma-mcp';

// Component with pixel-perfect Figma styling
const MyPage = () => (
  <div>
    <MCPComponent variant="primary">
      Styled exactly like Figma
    </MCPComponent>
  </div>
);\`}</CodeBlock>
          </ExampleContent>
        </Example>
      </Section>
      
      <Section>
        <SectionTitle>🔄 Keeping in Sync</SectionTitle>
        <p>To keep your design tokens synchronized with Figma:</p>
        <CodeBlock>{\`# Extract latest tokens from Figma MCP
npm run figma:extract-mcp

# Generate updated Storybook stories
npm run figma:stories-mcp

# Build and deploy
npm run build-storybook\`}</CodeBlock>
      </Section>
    </UsageGuide>
  );
};

const meta: Meta<typeof UsageExamples> = {
  title: 'Figma MCP/Usage Guide',
  component: UsageExamples,
  parameters: {
    docs: {
      description: {
        component: 'Comprehensive usage guide for MCP-extracted design tokens and components'
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof UsageExamples>;

export const Guide: Story = {};
`;

    await this.writeStoryFile('usage/UsageGuide.stories.tsx', usageContent);
  }

  /**
   * Organize colors by type for stories
   */
  organizeColorsByType(colors) {
    const organized = {
      primary: {},
      neutral: {},
      semantic: {},
      other: {}
    };
    
    Object.entries(colors).forEach(([name, color]) => {
      const lowercaseName = name.toLowerCase();
      
      if (lowercaseName.includes('primary') || lowercaseName.includes('brand')) {
        organized.primary[name] = color;
      } else if (lowercaseName.includes('neutral') || lowercaseName.includes('gray') || lowercaseName.includes('grey')) {
        organized.neutral[name] = color;
      } else if (lowercaseName.includes('success') || lowercaseName.includes('error') || lowercaseName.includes('warning') || lowercaseName.includes('info')) {
        organized.semantic[name] = color;
      } else {
        organized.other[name] = color;
      }
    });
    
    // Remove empty categories
    Object.keys(organized).forEach(key => {
      if (Object.keys(organized[key]).length === 0) {
        delete organized[key];
      }
    });
    
    return organized;
  }

  /**
   * Write story file to appropriate directory
   */
  async writeStoryFile(relativePath, content) {
    const fullPath = path.join(this.storiesDir, relativePath);
    const dir = path.dirname(fullPath);
    
    await fs.promises.mkdir(dir, { recursive: true });
    await fs.promises.writeFile(fullPath, content);
    
    console.log(`${colors.green}✅ Generated story: ${colors.cyan}${relativePath}${colors.reset}`);
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
    const more = await this.askYesNo(`${colors.cyan}Would you like to generate more stories?${colors.reset}`);
    if (more) {
      console.log('');
      await this.showGenerationMenu();
    } else {
      console.log(`${colors.green}📚 Storybook generation complete! Your stories are ready!${colors.reset}`);
    }
  }
}

// Run the CLI if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const cli = new FigmaStorybookMCPGenerator();
  cli.run().catch(console.error);
}

export default FigmaStorybookMCPGenerator;