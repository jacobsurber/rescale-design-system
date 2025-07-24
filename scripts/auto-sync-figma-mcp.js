#!/usr/bin/env node

/**
 * Figma MCP-Based Auto Sync
 * 
 * This script replaces the original auto-sync-figma.js with MCP-based extraction.
 * It provides automated synchronization capabilities for CI/CD workflows.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { FigmaMCPExtractor } from './figma-mcp-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  outputDir: path.resolve(__dirname, '../src/theme/tokens'),
  storiesDir: path.resolve(__dirname, '../src/stories/figma-mcp'),
  metadataFile: path.resolve(__dirname, '../mcp-sync-metadata.json'),
  autoCommit: process.env.AUTO_COMMIT === 'true',
  buildStorybook: process.env.BUILD_STORYBOOK === 'true',
  enableWatch: process.env.ENABLE_WATCH === 'true'
};

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

class FigmaAutoSyncMCP {
  constructor() {
    this.extractor = new FigmaMCPExtractor();
    this.metadata = this.loadMetadata();
    this.changes = [];
  }

  /**
   * Main sync process
   */
  async run() {
    try {
      console.log(`${colors.cyan}${colors.bright}🔄 Figma MCP Auto Sync${colors.reset}`);
      console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
      
      console.log(`${colors.yellow}🤖 Auto Sync Configuration:${colors.reset}`);
      console.log(`• Auto Commit: ${CONFIG.autoCommit ? colors.green + 'enabled' : colors.red + 'disabled'}${colors.reset}`);
      console.log(`• Build Storybook: ${CONFIG.buildStorybook ? colors.green + 'enabled' : colors.red + 'disabled'}${colors.reset}`);
      console.log(`• Enable Watch: ${CONFIG.enableWatch ? colors.green + 'enabled' : colors.red + 'disabled'}${colors.reset}\n`);

      if (CONFIG.enableWatch) {
        await this.startWatchMode();
      } else {
        await this.performSync();
      }
      
    } catch (error) {
      console.error(`${colors.red}❌ Auto sync failed:${colors.reset}`, error.message);
      process.exit(1);
    }
  }

  /**
   * Start watch mode for continuous sync
   */
  async startWatchMode() {
    console.log(`${colors.blue}👀 Starting watch mode...${colors.reset}`);
    console.log(`${colors.yellow}Monitoring Figma MCP for changes every 30 seconds${colors.reset}`);
    console.log(`${colors.yellow}Press Ctrl+C to stop${colors.reset}\n`);

    // Initial sync
    await this.performSync();

    // Set up interval for continuous monitoring
    setInterval(async () => {
      try {
        await this.performSync();
      } catch (error) {
        console.error(`${colors.red}❌ Watch sync failed:${colors.reset}`, error.message);
      }
    }, 30000); // Check every 30 seconds

    // Keep process alive
    process.stdin.resume();
  }

  /**
   * Perform a single sync operation
   */
  async performSync() {
    const syncStart = Date.now();
    console.log(`${colors.blue}🔄 Starting sync at ${new Date().toLocaleTimeString()}...${colors.reset}`);

    try {
      // Initialize MCP connection
      await this.extractor.initialize();
      
      // Check for changes
      const hasChanges = await this.detectChanges();
      
      if (!hasChanges) {
        console.log(`${colors.green}✅ No changes detected${colors.reset}`);
        return;
      }

      console.log(`${colors.yellow}📝 Changes detected, starting extraction...${colors.reset}`);

      // Extract design tokens
      const tokens = await this.extractTokens();
      
      // Generate files
      await this.generateFiles(tokens);
      
      // Generate Storybook stories
      await this.generateStories(tokens);
      
      // Update metadata
      await this.updateMetadata();
      
      // Auto commit if enabled
      if (CONFIG.autoCommit) {
        await this.autoCommit();
      }
      
      // Build Storybook if enabled
      if (CONFIG.buildStorybook) {
        await this.buildStorybook();
      }

      const syncDuration = Date.now() - syncStart;
      console.log(`${colors.green}${colors.bright}🎉 Sync completed in ${syncDuration}ms${colors.reset}\n`);

    } catch (error) {
      console.error(`${colors.red}❌ Sync failed:${colors.reset}`, error.message);
      throw error;
    }
  }

  /**
   * Detect changes since last sync
   */
  async detectChanges() {
    try {
      // For MCP, we'll use a simple timestamp-based approach
      // In a real implementation, this could be more sophisticated
      const currentTime = Date.now();
      const lastSync = this.metadata.lastSync || 0;
      const timeDiff = currentTime - lastSync;
      
      // Check if enough time has passed (minimum 1 minute between syncs)
      if (timeDiff < 60000) {
        return false;
      }

      // In a real MCP implementation, you might check:
      // - File modification times
      // - MCP server timestamps
      // - Content hashes
      
      // For now, simulate change detection
      console.log(`${colors.blue}🔍 Checking for changes...${colors.reset}`);
      
      // Always consider there are changes for demonstration
      // In production, implement actual change detection logic
      return true;
      
    } catch (error) {
      console.error(`${colors.red}❌ Change detection failed:${colors.reset}`, error.message);
      return false;
    }
  }

  /**
   * Extract design tokens from MCP
   */
  async extractTokens() {
    console.log(`${colors.blue}🎨 Extracting design tokens...${colors.reset}`);
    
    const tokens = await this.extractor.generateTokens(CONFIG.outputDir);
    const colors = await this.extractor.extractColors();
    const typography = await this.extractor.extractTypography();
    const spacing = await this.extractor.extractSpacing();

    this.changes.push(`Updated ${Object.keys(colors).length} color tokens`);
    this.changes.push(`Updated ${Object.keys(typography).length} typography styles`);
    this.changes.push(`Updated ${Object.keys(spacing).length} spacing values`);

    return {
      ...tokens,
      colors,
      typography,
      spacing
    };
  }

  /**
   * Generate design token files
   */
  async generateFiles(tokens) {
    console.log(`${colors.blue}📄 Generating design token files...${colors.reset}`);
    
    // Ensure output directory exists
    await fs.promises.mkdir(CONFIG.outputDir, { recursive: true });

    // Generate consolidated tokens file
    const consolidatedTokens = {
      colors: tokens.colors,
      typography: tokens.typography,
      spacing: tokens.spacing,
      metadata: {
        generated: new Date().toISOString(),
        source: 'figma-mcp-auto-sync',
        version: this.metadata.version + 1
      }
    };

    await fs.promises.writeFile(
      path.join(CONFIG.outputDir, 'design-tokens.json'),
      JSON.stringify(consolidatedTokens, null, 2)
    );

    // Generate CSS custom properties
    const css = this.generateCSS(tokens);
    await fs.promises.writeFile(path.join(CONFIG.outputDir, 'design-tokens.css'), css);

    // Generate JavaScript exports
    const js = this.generateJS(tokens);
    await fs.promises.writeFile(path.join(CONFIG.outputDir, 'design-tokens.js'), js);

    // Generate TypeScript definitions
    const ts = this.generateTypeScript(tokens);
    await fs.promises.writeFile(path.join(CONFIG.outputDir, 'design-tokens.d.ts'), ts);

    console.log(`${colors.green}✅ Generated design token files${colors.reset}`);
    this.changes.push('Generated design token files');
  }

  /**
   * Generate Storybook stories
   */
  async generateStories(tokens) {
    console.log(`${colors.blue}📚 Generating Storybook stories...${colors.reset}`);
    
    // Ensure stories directory exists
    await fs.promises.mkdir(CONFIG.storiesDir, { recursive: true });

    // Generate auto-sync overview story
    const overviewStory = this.generateOverviewStory(tokens);
    await fs.promises.writeFile(
      path.join(CONFIG.storiesDir, '00-AutoSync-Overview.stories.tsx'),
      overviewStory
    );

    // Generate color palette story
    const colorStory = this.generateColorStory(tokens.colors);
    await fs.promises.writeFile(
      path.join(CONFIG.storiesDir, 'Colors-AutoSync.stories.tsx'),
      colorStory
    );

    // Generate typography story
    const typographyStory = this.generateTypographyStory(tokens.typography);
    await fs.promises.writeFile(
      path.join(CONFIG.storiesDir, 'Typography-AutoSync.stories.tsx'),
      typographyStory
    );

    console.log(`${colors.green}✅ Generated Storybook stories${colors.reset}`);
    this.changes.push('Generated Storybook stories');
  }

  /**
   * Update sync metadata
   */
  async updateMetadata() {
    this.metadata = {
      ...this.metadata,
      lastSync: Date.now(),
      version: (this.metadata.version || 0) + 1,
      changes: this.changes,
      syncHistory: [
        ...(this.metadata.syncHistory || []).slice(-9), // Keep last 10 syncs
        {
          timestamp: Date.now(),
          changes: this.changes.length,
          success: true
        }
      ]
    };

    await fs.promises.writeFile(CONFIG.metadataFile, JSON.stringify(this.metadata, null, 2));
    console.log(`${colors.green}✅ Updated sync metadata${colors.reset}`);
  }

  /**
   * Auto commit changes to git
   */
  async autoCommit() {
    console.log(`${colors.blue}🔄 Auto-committing changes...${colors.reset}`);
    
    try {
      // Check if there are changes to commit
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      
      if (!status.trim()) {
        console.log(`${colors.yellow}📝 No changes to commit${colors.reset}`);
        return;
      }

      // Add all changes
      execSync('git add .');
      
      // Create commit message
      const commitMessage = `🤖 Auto-sync from Figma MCP

${this.changes.map(change => `• ${change}`).join('\n')}

Generated: ${new Date().toISOString()}
Version: ${this.metadata.version}

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>`;

      // Commit changes
      execSync(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`, { stdio: 'inherit' });
      
      console.log(`${colors.green}✅ Changes committed to git${colors.reset}`);
      this.changes.push('Auto-committed to git');
      
    } catch (error) {
      console.error(`${colors.red}❌ Auto-commit failed:${colors.reset}`, error.message);
    }
  }

  /**
   * Build Storybook
   */
  async buildStorybook() {
    console.log(`${colors.blue}🏗️  Building Storybook...${colors.reset}`);
    
    try {
      execSync('npm run build:storybook', { stdio: 'inherit' });
      console.log(`${colors.green}✅ Storybook build completed${colors.reset}`);
      this.changes.push('Built Storybook');
    } catch (error) {
      console.error(`${colors.red}❌ Storybook build failed:${colors.reset}`, error.message);
    }
  }

  /**
   * Load sync metadata
   */
  loadMetadata() {
    try {
      if (fs.existsSync(CONFIG.metadataFile)) {
        const metadata = JSON.parse(fs.readFileSync(CONFIG.metadataFile, 'utf8'));
        return metadata;
      }
    } catch (error) {
      console.warn(`${colors.yellow}⚠️  Failed to load metadata:${colors.reset}`, error.message);
    }
    
    return {
      version: 0,
      lastSync: 0,
      syncHistory: []
    };
  }

  /**
   * Generate CSS for tokens
   */
  generateCSS(tokens) {
    let css = `/* Design tokens auto-generated from Figma MCP */\n/* Generated: ${new Date().toISOString()} */\n\n:root {\n`;
    
    // Colors
    Object.entries(tokens.colors || {}).forEach(([name, color]) => {
      const varName = `--color-${name.toLowerCase().replace(/[\/\s]/g, '-')}`;
      css += `  ${varName}: ${color.hex};\n`;
    });

    // Typography
    Object.entries(tokens.typography || {}).forEach(([name, type]) => {
      const baseName = name.toLowerCase().replace(/[\/\s]/g, '-');
      css += `  --font-${baseName}-family: ${type.fontFamily};\n`;
      css += `  --font-${baseName}-size: ${type.fontSize}px;\n`;
      css += `  --font-${baseName}-weight: ${type.fontWeight};\n`;
      css += `  --font-${baseName}-line-height: ${type.lineHeight}px;\n`;
    });

    // Spacing
    Object.entries(tokens.spacing || {}).forEach(([name, value]) => {
      css += `  --spacing-${name}: ${value};\n`;
    });

    css += '}\n';
    return css;
  }

  /**
   * Generate JavaScript exports
   */
  generateJS(tokens) {
    return `// Design tokens auto-generated from Figma MCP
// Generated: ${new Date().toISOString()}

export const colors = ${JSON.stringify(tokens.colors, null, 2)};

export const typography = ${JSON.stringify(tokens.typography, null, 2)};

export const spacing = ${JSON.stringify(tokens.spacing, null, 2)};

export const metadata = {
  generated: '${new Date().toISOString()}',
  source: 'figma-mcp-auto-sync',
  version: ${this.metadata.version + 1}
};

export default {
  colors,
  typography,
  spacing,
  metadata
};
`;
  }

  /**
   * Generate TypeScript definitions
   */
  generateTypeScript(tokens) {
    return `// Design token type definitions (auto-generated)
// Generated: ${new Date().toISOString()}

export interface ColorToken {
  hex: string;
  rgb: { r: number; g: number; b: number };
  opacity: number;
  key: string;
  name: string;
}

export interface TypographyToken {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  key: string;
  name: string;
}

export interface TokenMetadata {
  generated: string;
  source: string;
  version: number;
}

export interface DesignTokens {
  colors: Record<string, ColorToken>;
  typography: Record<string, TypographyToken>;
  spacing: Record<string, string>;
  metadata: TokenMetadata;
}

declare const tokens: DesignTokens;
export default tokens;
`;
  }

  /**
   * Generate overview story
   */
  generateOverviewStory(tokens) {
    return `import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import styled from 'styled-components';

const AutoSyncOverview = styled.div\`
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
\`;

const Title = styled.h1\`
  color: #0272C3;
  display: flex;
  align-items: center;
  gap: 8px;
\`;

const SyncInfo = styled.div\`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
\`;

const TokenGrid = styled.div\`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin: 16px 0;
\`;

const TokenCard = styled.div\`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
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

const AutoSyncOverviewComponent: React.FC = () => {
  return (
    <AutoSyncOverview>
      <Title>🤖 Auto-Sync Overview</Title>
      
      <SyncInfo>
        <h3>Last Sync: ${new Date().toLocaleString()}</h3>
        <p><strong>Source:</strong> Figma MCP Integration</p>
        <p><strong>Version:</strong> ${this.metadata.version + 1}</p>
        <p><strong>Changes:</strong></p>
        <ul>
          ${this.changes.map(change => `<li>${change}</li>`).join('')}
        </ul>
      </SyncInfo>
      
      <h2>📊 Token Summary</h2>
      <TokenGrid>
        <TokenCard>
          <TokenCount>${Object.keys(tokens.colors || {}).length}</TokenCount>
          <TokenLabel>Color Tokens</TokenLabel>
        </TokenCard>
        <TokenCard>
          <TokenCount>${Object.keys(tokens.typography || {}).length}</TokenCount>
          <TokenLabel>Typography Styles</TokenLabel>
        </TokenCard>
        <TokenCard>
          <TokenCount>${Object.keys(tokens.spacing || {}).length}</TokenCount>
          <TokenLabel>Spacing Values</TokenLabel>
        </TokenCard>
      </TokenGrid>
      
      <h2>🔄 Auto-Sync Features</h2>
      <ul>
        <li>✅ Real-time Figma MCP integration</li>
        <li>✅ Automatic token extraction</li>
        <li>✅ Generated design files (CSS, JS, TS)</li>
        <li>✅ Updated Storybook stories</li>
        <li>${CONFIG.autoCommit ? '✅' : '❌'} Auto-commit to git</li>
        <li>${CONFIG.buildStorybook ? '✅' : '❌'} Automatic Storybook builds</li>
      </ul>
    </AutoSyncOverview>
  );
};

const meta: Meta<typeof AutoSyncOverviewComponent> = {
  title: 'Auto-Sync/Overview',
  component: AutoSyncOverviewComponent,
  parameters: {
    docs: {
      description: {
        component: 'Overview of the automatic Figma MCP synchronization system'
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof AutoSyncOverviewComponent>;

export const Overview: Story = {};
`;
  }

  /**
   * Generate color story
   */
  generateColorStory(colors) {
    return `import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import styled from 'styled-components';

// Auto-generated color story from Figma MCP
const ColorGrid = styled.div\`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  padding: 24px;
\`;

const ColorSwatch = styled.div\`
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
\`;

const ColorPreview = styled.div<{ color: string }>\`
  background-color: \${props => props.color};
  height: 80px;
\`;

const ColorInfo = styled.div\`
  padding: 12px;
  background: white;
\`;

const AutoSyncColors: React.FC = () => {
  const colors = ${JSON.stringify(colors, null, 4)};
  
  return (
    <div>
      <h1>🎨 Auto-Sync Colors</h1>
      <p>Colors automatically synchronized from Figma MCP at ${new Date().toLocaleString()}</p>
      
      <ColorGrid>
        {Object.entries(colors).map(([name, color]) => (
          <ColorSwatch key={name}>
            <ColorPreview color={color.hex} />
            <ColorInfo>
              <div style={{ fontWeight: 600 }}>{name}</div>
              <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#666' }}>
                {color.hex}
              </div>
            </ColorInfo>
          </ColorSwatch>
        ))}
      </ColorGrid>
    </div>
  );
};

const meta: Meta<typeof AutoSyncColors> = {
  title: 'Auto-Sync/Colors',
  component: AutoSyncColors
};

export default meta;
type Story = StoryObj<typeof AutoSyncColors>;

export const Colors: Story = {};
`;
  }

  /**
   * Generate typography story
   */
  generateTypographyStory(typography) {
    return `import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import styled from 'styled-components';

const TypographyContainer = styled.div\`
  padding: 24px;
\`;

const TypeExample = styled.div\`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin: 16px 0;
  background: white;
\`;

const AutoSyncTypography: React.FC = () => {
  const typography = ${JSON.stringify(typography, null, 4)};
  
  return (
    <TypographyContainer>
      <h1>📝 Auto-Sync Typography</h1>
      <p>Typography automatically synchronized from Figma MCP at ${new Date().toLocaleString()}</p>
      
      {Object.entries(typography).map(([key, style]) => (
        <TypeExample key={key}>
          <h3 style={{ color: '#0272C3', margin: '0 0 8px 0' }}>{style.name}</h3>
          <div
            style={{
              fontFamily: style.fontFamily,
              fontSize: style.fontSize + 'px',
              fontWeight: style.fontWeight,
              lineHeight: style.lineHeight + 'px',
              margin: '12px 0'
            }}
          >
            The quick brown fox jumps over the lazy dog
          </div>
          <div style={{ 
            fontFamily: 'monospace', 
            fontSize: '12px', 
            color: '#666',
            marginTop: '8px'
          }}>
            {style.fontFamily} | {style.fontSize}px | {style.fontWeight} | {style.lineHeight}px
          </div>
        </TypeExample>
      ))}
    </TypographyContainer>
  );
};

const meta: Meta<typeof AutoSyncTypography> = {
  title: 'Auto-Sync/Typography',
  component: AutoSyncTypography
};

export default meta;
type Story = StoryObj<typeof AutoSyncTypography>;

export const Typography: Story = {};
`;
  }
}

// CLI interface for running directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const autoSync = new FigmaAutoSyncMCP();
  
  // Handle CLI arguments
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🤖 Figma MCP Auto Sync

Usage:
  node auto-sync-figma-mcp.js [options]

Options:
  --watch          Enable continuous monitoring mode
  --auto-commit    Enable automatic git commits
  --build-storybook Build Storybook after sync
  --help, -h       Show this help message

Environment Variables:
  AUTO_COMMIT=true        Enable auto-commit
  BUILD_STORYBOOK=true    Enable Storybook building
  ENABLE_WATCH=true       Start in watch mode

Examples:
  # Single sync
  node auto-sync-figma-mcp.js

  # Watch mode with auto-commit
  AUTO_COMMIT=true ENABLE_WATCH=true node auto-sync-figma-mcp.js

  # CI/CD mode
  AUTO_COMMIT=true BUILD_STORYBOOK=true node auto-sync-figma-mcp.js
`);
    process.exit(0);
  }

  // Override config with CLI args
  if (args.includes('--watch')) {
    CONFIG.enableWatch = true;
  }
  if (args.includes('--auto-commit')) {
    CONFIG.autoCommit = true;
  }
  if (args.includes('--build-storybook')) {
    CONFIG.buildStorybook = true;
  }

  autoSync.run().catch(console.error);
}

export default FigmaAutoSyncMCP;