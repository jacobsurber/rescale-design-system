#!/usr/bin/env node

/**
 * Automated Figma to Storybook Sync
 * 
 * This script can be run automatically (via CI/CD or cron) to sync design tokens
 * from Figma and update Storybook documentation without manual input.
 * 
 * Usage:
 * - Set environment variables: FIGMA_API_TOKEN and FIGMA_FILE_ID
 * - Run: npm run figma:auto-sync
 * - Or use in CI/CD pipelines
 */

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

// Configuration
const config = {
  apiToken: process.env.FIGMA_API_TOKEN,
  fileId: process.env.FIGMA_FILE_ID,
  storybookDir: 'src/stories',
  tokensDir: 'src/tokens',
  outputDir: 'figma-data',
  autoCommit: process.env.AUTO_COMMIT === 'true',
  buildStorybook: process.env.BUILD_STORYBOOK !== 'false'
};

async function figmaRequest(apiKey, endpoint) {
  const response = await fetch(`https://api.figma.com/v1/${endpoint}`, {
    headers: {
      'X-Figma-Token': apiKey
    }
  });
  
  if (!response.ok) {
    throw new Error(`Figma API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

function rgbToHex(r, g, b) {
  return `#${Math.round(r * 255).toString(16).padStart(2, '0')}${Math.round(g * 255).toString(16).padStart(2, '0')}${Math.round(b * 255).toString(16).padStart(2, '0')}`;
}

async function getFileMetadata(apiKey, fileId) {
  const fileData = await figmaRequest(apiKey, `files/${fileId}`);
  return {
    name: fileData.name,
    lastModified: fileData.lastModified,
    version: fileData.version
  };
}

function hasFileChanged(currentMetadata, previousMetadata) {
  if (!previousMetadata) return true;
  return currentMetadata.lastModified !== previousMetadata.lastModified ||
         currentMetadata.version !== previousMetadata.version;
}

function loadPreviousMetadata() {
  const metadataPath = path.join(config.outputDir, 'sync-metadata.json');
  if (fs.existsSync(metadataPath)) {
    try {
      return JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    } catch (error) {
      console.warn('⚠️ Could not read previous metadata, treating as first sync');
    }
  }
  return null;
}

function saveSyncMetadata(metadata) {
  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
  }
  
  const metadataPath = path.join(config.outputDir, 'sync-metadata.json');
  const syncData = {
    ...metadata,
    lastSync: new Date().toISOString(),
    syncCount: (loadPreviousMetadata()?.syncCount || 0) + 1
  };
  
  fs.writeFileSync(metadataPath, JSON.stringify(syncData, null, 2));
  return syncData;
}

async function runCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { 
      stdio: 'inherit',
      shell: true 
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
    
    child.on('error', reject);
  });
}

async function extractAndSync() {
  console.log('🎨 Starting automated Figma to Storybook sync...');
  
  // Validate environment
  if (!config.apiToken) {
    throw new Error('FIGMA_API_TOKEN environment variable is required');
  }
  
  if (!config.fileId) {
    throw new Error('FIGMA_FILE_ID environment variable is required');
  }
  
  // Check if file has changed
  console.log('📝 Checking if Figma file has been updated...');
  const currentMetadata = await getFileMetadata(config.apiToken, config.fileId);
  const previousMetadata = loadPreviousMetadata();
  
  if (!hasFileChanged(currentMetadata, previousMetadata)) {
    console.log('✅ No changes detected in Figma file, skipping sync');
    console.log(`   Last modified: ${currentMetadata.lastModified}`);
    console.log(`   Version: ${currentMetadata.version}`);
    return { skipped: true, reason: 'No changes' };
  }
  
  console.log('📦 Changes detected, starting extraction...');
  console.log(`   File: ${currentMetadata.name}`);
  console.log(`   Last modified: ${currentMetadata.lastModified}`);
  console.log(`   Version: ${currentMetadata.version}`);
  
  // Extract design system (reusing logic from figma-to-storybook.js)
  const fileData = await figmaRequest(config.apiToken, `files/${config.fileId}`);
  
  const designSystem = {
    colors: {},
    typography: {},
    spacing: {},
    components: {},
    metadata: {
      ...currentMetadata,
      extractedAt: new Date().toISOString()
    }
  };
  
  // Extract colors
  try {
    const stylesData = await figmaRequest(config.apiToken, `files/${config.fileId}/styles`);
    
    if (stylesData.meta && stylesData.meta.styles) {
      for (const style of stylesData.meta.styles) {
        if (style.style_type === 'FILL') {
          try {
            const styleDetails = await figmaRequest(config.apiToken, `styles/${style.key}`);
            if (styleDetails.style && styleDetails.style.fills && styleDetails.style.fills[0]) {
              const fill = styleDetails.style.fills[0];
              if (fill.color) {
                const hex = rgbToHex(fill.color.r, fill.color.g, fill.color.b);
                const name = style.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
                designSystem.colors[name] = {
                  name: style.name,
                  hex,
                  rgb: fill.color,
                  opacity: fill.opacity || 1,
                  description: style.description || ''
                };
              }
            }
          } catch (error) {
            console.warn(`⚠️ Could not fetch color style ${style.name}`);
          }
        }
      }
    }
  } catch (error) {
    console.warn('⚠️ Could not fetch published styles');
  }
  
  console.log(`✅ Extracted ${Object.keys(designSystem.colors).length} colors`);
  
  // Save design system data
  const designSystemPath = path.join(config.outputDir, 'design-system.json');
  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
  }
  fs.writeFileSync(designSystemPath, JSON.stringify(designSystem, null, 2));
  
  // Generate updated stories (simplified version)
  const designSystemStoriesDir = path.join(config.storybookDir, 'design-system');
  if (!fs.existsSync(designSystemStoriesDir)) {
    fs.mkdirSync(designSystemStoriesDir, { recursive: true });
  }
  
  if (Object.keys(designSystem.colors).length > 0) {
    const colorStory = generateSimpleColorStory(designSystem.colors, currentMetadata);
    fs.writeFileSync(
      path.join(designSystemStoriesDir, 'FigmaColors.stories.tsx'),
      colorStory
    );
  }
  
  // Update tokens
  if (!fs.existsSync(config.tokensDir)) {
    fs.mkdirSync(config.tokensDir, { recursive: true });
  }
  
  if (Object.keys(designSystem.colors).length > 0) {
    const colorsJs = `// Auto-generated from Figma - ${new Date().toISOString()}
export const figmaColors = {
${Object.entries(designSystem.colors).map(([key, color]) => 
  `  '${key}': '${color.hex}', // ${color.name}`
).join('\n')}
};
`;
    fs.writeFileSync(path.join(config.tokensDir, 'figma-colors.ts'), colorsJs);
  }
  
  // Save sync metadata
  const syncData = saveSyncMetadata(currentMetadata);
  console.log(`✅ Sync completed (${syncData.syncCount} total syncs)`);
  
  return {
    success: true,
    colorsExtracted: Object.keys(designSystem.colors).length,
    syncCount: syncData.syncCount,
    lastSync: syncData.lastSync
  };
}

function generateSimpleColorStory(colors, metadata) {
  return `import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const ColorSwatch = ({ color, name, description }) => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    margin: '8px 0',
    padding: '12px',
    border: '1px solid #e1e5e9',
    borderRadius: '6px'
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      backgroundColor: color,
      borderRadius: '4px',
      marginRight: '12px',
      border: '1px solid #ddd'
    }} />
    <div>
      <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{name}</div>
      <div style={{ fontSize: '12px', color: '#666', fontFamily: 'monospace' }}>{color}</div>
      {description && <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>{description}</div>}
    </div>
  </div>
);

const meta: Meta = {
  title: 'Design System/Figma Colors',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: \`Colors automatically synced from Figma file "${metadata.name}". Last synced: \${new Date().toLocaleDateString()}\`
      }
    }
  }
};

export default meta;

export const AllFigmaColors: StoryObj = {
  render: () => (
    <div>
      <h1>Figma Colors</h1>
      <p style={{ marginBottom: '24px', color: '#666' }}>
        Colors automatically extracted from Figma. Total: ${Object.keys(colors).length} colors
      </p>
      <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
        <strong>File:</strong> ${metadata.name}<br/>
        <strong>Last Modified:</strong> ${new Date(metadata.lastModified).toLocaleString()}<br/>
        <strong>Version:</strong> ${metadata.version}
      </div>
      ${Object.entries(colors).map(([key, color]) => 
        `<ColorSwatch key="${key}" color="${color.hex}" name="${color.name}" description="${color.description}" />`
      ).join('\n      ')}
    </div>
  )
};
`;
}

async function main() {
  try {
    console.log('🚀 Automated Figma Sync Starting...');
    console.log('=====================================\n');
    
    const result = await extractAndSync();
    
    if (result.skipped) {
      console.log(`\n✅ Sync completed - ${result.reason}`);
      return;
    }
    
    if (config.buildStorybook) {
      console.log('\n📚 Building Storybook with updated design tokens...');
      try {
        await runCommand('npm', ['run', 'build:storybook']);
        console.log('✅ Storybook built successfully');
      } catch (error) {
        console.warn('⚠️ Storybook build failed but sync completed');
      }
    }
    
    if (config.autoCommit) {
      console.log('\n📝 Auto-committing changes...');
      try {
        await runCommand('git', ['add', '.']);
        await runCommand('git', ['commit', '-m', `sync: update design tokens from Figma

- Synced ${result.colorsExtracted} colors from Figma
- Updated Storybook stories with latest design tokens
- Sync #${result.syncCount} completed at ${result.lastSync}

🤖 Automated sync from Figma`]);
        console.log('✅ Changes committed automatically');
      } catch (error) {
        console.warn('⚠️ Auto-commit failed, but sync completed');
      }
    }
    
    console.log(`\n🎉 Sync completed successfully!`);
    console.log(`   Colors extracted: ${result.colorsExtracted}`);
    console.log(`   Total syncs: ${result.syncCount}`);
    console.log(`   Last sync: ${result.lastSync}`);
    
  } catch (error) {
    console.error(`\n❌ Sync failed: ${error.message}`);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Sync cancelled by user');
  process.exit(0);
});

process.on('unhandledRejection', (error) => {
  console.error('\n❌ Unexpected error:', error.message);
  process.exit(1);
});

main();