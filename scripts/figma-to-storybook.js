#!/usr/bin/env node

import readline from 'readline';
import fs from 'fs';
import path from 'path';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

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

async function extractDesignSystem(apiKey, fileId) {
  console.log('🎨 Extracting complete design system from Figma...');
  
  const fileData = await figmaRequest(apiKey, `files/${fileId}`);
  
  const designSystem = {
    colors: {},
    typography: {},
    spacing: {},
    components: {},
    metadata: {
      fileName: fileData.name,
      lastModified: fileData.lastModified,
      extractedAt: new Date().toISOString()
    }
  };
  
  // Extract color styles
  try {
    console.log('📝 Extracting color styles...');
    const stylesData = await figmaRequest(apiKey, `files/${fileId}/styles`);
    
    if (stylesData.meta && stylesData.meta.styles) {
      for (const style of stylesData.meta.styles) {
        if (style.style_type === 'FILL') {
          try {
            const styleDetails = await figmaRequest(apiKey, `styles/${style.key}`);
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
                  description: style.description || '',
                  category: categorizeColor(style.name)
                };
              }
            }
          } catch (error) {
            console.warn(`⚠️ Could not fetch color style ${style.name}`);
          }
        } else if (style.style_type === 'TEXT') {
          try {
            const styleDetails = await figmaRequest(apiKey, `styles/${style.key}`);
            if (styleDetails.style) {
              const name = style.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
              designSystem.typography[name] = {
                name: style.name,
                fontFamily: styleDetails.style.fontFamily,
                fontSize: styleDetails.style.fontSize,
                fontWeight: styleDetails.style.fontWeight,
                lineHeight: styleDetails.style.lineHeightPx || styleDetails.style.lineHeightPercent,
                letterSpacing: styleDetails.style.letterSpacing,
                description: style.description || '',
                category: categorizeTypography(style.name)
              };
            }
          } catch (error) {
            console.warn(`⚠️ Could not fetch typography style ${style.name}`);
          }
        }
      }
    }
  } catch (error) {
    console.warn('⚠️ Could not fetch published styles');
  }
  
  // Extract components
  console.log('🧩 Extracting components...');
  function findComponents(node, depth = 0) {
    if (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') {
      const componentName = node.name.replace(/[^a-zA-Z0-9]/g, '');
      designSystem.components[componentName] = {
        id: node.id,
        name: node.name,
        type: node.type,
        description: node.description || '',
        properties: node.componentPropertyDefinitions || {},
        variants: [],
        examples: []
      };
      
      // Extract variants for component sets
      if (node.type === 'COMPONENT_SET' && node.children) {
        node.children.forEach(child => {
          if (child.type === 'COMPONENT') {
            designSystem.components[componentName].variants.push({
              name: child.name,
              properties: child.componentPropertyDefinitions || {}
            });
          }
        });
      }
    }
    
    // Extract spacing patterns
    if (node.type === 'FRAME' && (node.paddingLeft || node.paddingTop || node.itemSpacing)) {
      const spacing = Math.max(
        node.paddingLeft || 0,
        node.paddingTop || 0,
        node.paddingRight || 0,
        node.paddingBottom || 0,
        node.itemSpacing || 0
      );
      
      if (spacing > 0) {
        const spacingKey = `spacing-${spacing}`;
        if (!designSystem.spacing[spacingKey]) {
          designSystem.spacing[spacingKey] = {
            value: spacing,
            pixels: `${spacing}px`,
            rem: `${spacing / 16}rem`,
            usage: []
          };
        }
        designSystem.spacing[spacingKey].usage.push(node.name);
      }
    }
    
    if (node.children) {
      node.children.forEach(child => findComponents(child, depth + 1));
    }
  }
  
  if (fileData.document) {
    findComponents(fileData.document);
  }
  
  console.log(`✅ Extracted ${Object.keys(designSystem.colors).length} colors`);
  console.log(`✅ Extracted ${Object.keys(designSystem.typography).length} typography styles`);
  console.log(`✅ Extracted ${Object.keys(designSystem.spacing).length} spacing tokens`);
  console.log(`✅ Extracted ${Object.keys(designSystem.components).length} components`);
  
  return designSystem;
}

function categorizeColor(name) {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('primary') || lowerName.includes('brand')) return 'primary';
  if (lowerName.includes('secondary')) return 'secondary';
  if (lowerName.includes('success') || lowerName.includes('green')) return 'success';
  if (lowerName.includes('warning') || lowerName.includes('yellow')) return 'warning';
  if (lowerName.includes('error') || lowerName.includes('danger') || lowerName.includes('red')) return 'error';
  if (lowerName.includes('info') || lowerName.includes('blue')) return 'info';
  if (lowerName.includes('gray') || lowerName.includes('grey') || lowerName.includes('neutral')) return 'neutral';
  return 'other';
}

function categorizeTypography(name) {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('heading') || lowerName.includes('title') || lowerName.includes('h1') || lowerName.includes('h2')) return 'heading';
  if (lowerName.includes('body') || lowerName.includes('paragraph')) return 'body';
  if (lowerName.includes('caption') || lowerName.includes('small')) return 'caption';
  if (lowerName.includes('label')) return 'label';
  return 'other';
}

function generateColorStory(colors) {
  const colorsByCategory = {};
  Object.values(colors).forEach(color => {
    if (!colorsByCategory[color.category]) {
      colorsByCategory[color.category] = [];
    }
    colorsByCategory[color.category].push(color);
  });

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

const ColorCategory = ({ title, colors }) => (
  <div style={{ marginBottom: '32px' }}>
    <h3 style={{ marginBottom: '16px', color: '#333' }}>{title}</h3>
    {colors.map(color => (
      <ColorSwatch 
        key={color.name} 
        color={color.hex} 
        name={color.name} 
        description={color.description}
      />
    ))}
  </div>
);

const meta: Meta = {
  title: 'Design System/Colors',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Color palette extracted from Figma design system. Last updated: ${new Date().toLocaleDateString()}'
      }
    }
  }
};

export default meta;

export const AllColors: StoryObj = {
  render: () => (
    <div>
      <h1>Design System Colors</h1>
      <p style={{ marginBottom: '24px', color: '#666' }}>
        Colors automatically extracted from Figma. Total: ${Object.keys(colors).length} colors
      </p>
      ${Object.entries(colorsByCategory).map(([category, categoryColors]) => 
        `<ColorCategory title="${category.charAt(0).toUpperCase() + category.slice(1)} Colors" colors={${JSON.stringify(categoryColors, null, 2)}} />`
      ).join('\n      ')}
    </div>
  )
};

${Object.entries(colorsByCategory).map(([category, categoryColors]) => `
export const ${category.charAt(0).toUpperCase() + category.slice(1)}Colors: StoryObj = {
  render: () => (
    <ColorCategory title="${category.charAt(0).toUpperCase() + category.slice(1)} Colors" colors={${JSON.stringify(categoryColors, null, 2)}} />
  )
};`).join('')}
`;
}

function generateTypographyStory(typography) {
  const typographyByCategory = {};
  Object.values(typography).forEach(type => {
    if (!typographyByCategory[type.category]) {
      typographyByCategory[type.category] = [];
    }
    typographyByCategory[type.category].push(type);
  });

  return `import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const TypographySample = ({ style, name, description }) => (
  <div style={{ margin: '16px 0', padding: '16px', border: '1px solid #e1e5e9', borderRadius: '6px' }}>
    <div style={{
      fontFamily: style.fontFamily,
      fontSize: style.fontSize + 'px',
      fontWeight: style.fontWeight,
      lineHeight: style.lineHeight ? (typeof style.lineHeight === 'number' ? style.lineHeight + 'px' : style.lineHeight) : 'normal',
      letterSpacing: style.letterSpacing || 'normal'
    }}>
      {name} - The quick brown fox jumps over the lazy dog
    </div>
    <div style={{ fontSize: '12px', color: '#666', marginTop: '8px', fontFamily: 'monospace' }}>
      {style.fontFamily} • {style.fontSize}px • {style.fontWeight}
      {style.lineHeight && \` • Line height: \${style.lineHeight}\`}
    </div>
    {description && <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>{description}</div>}
  </div>
);

const TypographyCategory = ({ title, styles }) => (
  <div style={{ marginBottom: '32px' }}>
    <h3 style={{ marginBottom: '16px', color: '#333' }}>{title}</h3>
    {styles.map(style => (
      <TypographySample 
        key={style.name} 
        style={style} 
        name={style.name} 
        description={style.description}
      />
    ))}
  </div>
);

const meta: Meta = {
  title: 'Design System/Typography',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Typography styles extracted from Figma design system. Last updated: ${new Date().toLocaleDateString()}'
      }
    }
  }
};

export default meta;

export const AllTypography: StoryObj = {
  render: () => (
    <div>
      <h1>Design System Typography</h1>
      <p style={{ marginBottom: '24px', color: '#666' }}>
        Typography styles automatically extracted from Figma. Total: ${Object.keys(typography).length} styles
      </p>
      ${Object.entries(typographyByCategory).map(([category, categoryStyles]) => 
        `<TypographyCategory title="${category.charAt(0).toUpperCase() + category.slice(1)} Typography" styles={${JSON.stringify(categoryStyles, null, 2)}} />`
      ).join('\n      ')}
    </div>
  )
};

${Object.entries(typographyByCategory).map(([category, categoryStyles]) => `
export const ${category.charAt(0).toUpperCase() + category.slice(1)}Typography: StoryObj = {
  render: () => (
    <TypographyCategory title="${category.charAt(0).toUpperCase() + category.slice(1)} Typography" styles={${JSON.stringify(categoryStyles, null, 2)}} />
  )
};`).join('')}
`;
}

function generateSpacingStory(spacing) {
  return `import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const SpacingSample = ({ value, pixels, rem, usage }) => (
  <div style={{ margin: '12px 0', padding: '16px', border: '1px solid #e1e5e9', borderRadius: '6px' }}>
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
      <div style={{
        width: value + 'px',
        height: '20px',
        backgroundColor: '#3b82f6',
        marginRight: '12px'
      }} />
      <div>
        <strong>{pixels}</strong> ({rem})
      </div>
    </div>
    {usage.length > 0 && (
      <div style={{ fontSize: '12px', color: '#666' }}>
        Used in: {usage.slice(0, 3).join(', ')}{usage.length > 3 ? \` and \${usage.length - 3} more\` : ''}
      </div>
    )}
  </div>
);

const meta: Meta = {
  title: 'Design System/Spacing',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Spacing tokens extracted from Figma design system. Last updated: ${new Date().toLocaleDateString()}'
      }
    }
  }
};

export default meta;

export const AllSpacing: StoryObj = {
  render: () => (
    <div>
      <h1>Design System Spacing</h1>
      <p style={{ marginBottom: '24px', color: '#666' }}>
        Spacing tokens automatically extracted from Figma. Total: ${Object.keys(spacing).length} tokens
      </p>
      ${Object.entries(spacing).sort((a, b) => a[1].value - b[1].value).map(([key, space]) => 
        `<SpacingSample 
          key="${key}"
          value={${space.value}} 
          pixels="${space.pixels}" 
          rem="${space.rem}" 
          usage={${JSON.stringify(space.usage)}} 
        />`
      ).join('\n      ')}
    </div>
  )
};
`;
}

function generateComponentsStory(components) {
  return `import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const ComponentSpec = ({ component }) => (
  <div style={{ margin: '16px 0', padding: '16px', border: '1px solid #e1e5e9', borderRadius: '6px' }}>
    <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>{component.name}</h4>
    {component.description && (
      <p style={{ margin: '0 0 12px 0', color: '#666', fontSize: '14px' }}>{component.description}</p>
    )}
    
    {component.variants.length > 0 && (
      <div style={{ marginBottom: '12px' }}>
        <strong style={{ fontSize: '14px' }}>Variants:</strong>
        <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px' }}>
          {component.variants.map(variant => (
            <li key={variant.name} style={{ fontSize: '13px', color: '#666' }}>
              {variant.name}
            </li>
          ))}
        </ul>
      </div>
    )}
    
    {Object.keys(component.properties).length > 0 && (
      <div>
        <strong style={{ fontSize: '14px' }}>Properties:</strong>
        <div style={{ fontSize: '12px', fontFamily: 'monospace', color: '#666', marginTop: '4px' }}>
          {Object.keys(component.properties).join(', ')}
        </div>
      </div>
    )}
  </div>
);

const meta: Meta = {
  title: 'Design System/Components',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Component specifications extracted from Figma design system. Last updated: ${new Date().toLocaleDateString()}'
      }
    }
  }
};

export default meta;

export const AllComponents: StoryObj = {
  render: () => (
    <div>
      <h1>Design System Components</h1>
      <p style={{ marginBottom: '24px', color: '#666' }}>
        Component specifications automatically extracted from Figma. Total: ${Object.keys(components).length} components
      </p>
      ${Object.values(components).map(component => 
        `<ComponentSpec key="${component.name}" component={${JSON.stringify(component, null, 2)}} />`
      ).join('\n      ')}
    </div>
  )
};
`;
}

function updateStorybookStories(designSystem, storybookDir = 'src/stories') {
  // Ensure stories directory exists
  const designSystemStoriesDir = path.join(storybookDir, 'design-system');
  if (!fs.existsSync(designSystemStoriesDir)) {
    fs.mkdirSync(designSystemStoriesDir, { recursive: true });
  }

  const files = [];

  // Generate color story
  if (Object.keys(designSystem.colors).length > 0) {
    const colorStoryPath = path.join(designSystemStoriesDir, 'Colors.stories.tsx');
    fs.writeFileSync(colorStoryPath, generateColorStory(designSystem.colors));
    files.push(colorStoryPath);
  }

  // Generate typography story
  if (Object.keys(designSystem.typography).length > 0) {
    const typographyStoryPath = path.join(designSystemStoriesDir, 'Typography.stories.tsx');
    fs.writeFileSync(typographyStoryPath, generateTypographyStory(designSystem.typography));
    files.push(typographyStoryPath);
  }

  // Generate spacing story
  if (Object.keys(designSystem.spacing).length > 0) {
    const spacingStoryPath = path.join(designSystemStoriesDir, 'Spacing.stories.tsx');
    fs.writeFileSync(spacingStoryPath, generateSpacingStory(designSystem.spacing));
    files.push(spacingStoryPath);
  }

  // Generate components story
  if (Object.keys(designSystem.components).length > 0) {
    const componentsStoryPath = path.join(designSystemStoriesDir, 'Components.stories.tsx');
    fs.writeFileSync(componentsStoryPath, generateComponentsStory(designSystem.components));
    files.push(componentsStoryPath);
  }

  return files;
}

function updateDesignTokens(designSystem, outputDir = 'src/tokens') {
  // Ensure tokens directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const files = [];

  // Generate colors tokens
  if (Object.keys(designSystem.colors).length > 0) {
    const colorsJs = `export const colors = {
${Object.entries(designSystem.colors).map(([key, color]) => 
  `  '${key}': '${color.hex}',`
).join('\n')}
};

export const colorTokens = ${JSON.stringify(designSystem.colors, null, 2)};
`;
    
    const colorsPath = path.join(outputDir, 'colors.ts');
    fs.writeFileSync(colorsPath, colorsJs);
    files.push(colorsPath);

    // Generate CSS custom properties
    const cssColors = `:root {
${Object.entries(designSystem.colors).map(([key, color]) => 
  `  --color-${key}: ${color.hex};`
).join('\n')}
}
`;
    
    const cssPath = path.join(outputDir, 'colors.css');
    fs.writeFileSync(cssPath, cssColors);
    files.push(cssPath);
  }

  // Generate typography tokens
  if (Object.keys(designSystem.typography).length > 0) {
    const typographyJs = `export const typography = ${JSON.stringify(designSystem.typography, null, 2)};
`;
    
    const typographyPath = path.join(outputDir, 'typography.ts');
    fs.writeFileSync(typographyPath, typographyJs);
    files.push(typographyPath);
  }

  // Generate spacing tokens
  if (Object.keys(designSystem.spacing).length > 0) {
    const spacingJs = `export const spacing = {
${Object.entries(designSystem.spacing).map(([key, space]) => 
  `  '${key}': '${space.pixels}',`
).join('\n')}
};

export const spacingTokens = ${JSON.stringify(designSystem.spacing, null, 2)};
`;
    
    const spacingPath = path.join(outputDir, 'spacing.ts');
    fs.writeFileSync(spacingPath, spacingJs);
    files.push(spacingPath);
  }

  // Generate complete design system export
  const indexJs = `// Auto-generated design tokens from Figma
// Last updated: ${new Date().toISOString()}

${Object.keys(designSystem.colors).length > 0 ? "export * from './colors';" : ''}
${Object.keys(designSystem.typography).length > 0 ? "export * from './typography';" : ''}
${Object.keys(designSystem.spacing).length > 0 ? "export * from './spacing';" : ''}

export const designSystem = ${JSON.stringify(designSystem, null, 2)};
`;
  
  const indexPath = path.join(outputDir, 'index.ts');
  fs.writeFileSync(indexPath, indexJs);
  files.push(indexPath);

  return files;
}

async function main() {
  console.log('🚀 Figma to Storybook Sync Tool');
  console.log('=================================\n');
  
  try {
    const apiKey = await prompt('Enter your Figma API token: ');
    if (!apiKey) {
      console.error('❌ API token is required!');
      process.exit(1);
    }
    
    const fileId = await prompt('Enter your Figma file ID: ');
    if (!fileId) {
      console.error('❌ File ID is required!');
      process.exit(1);
    }
    
    console.log('\n🎨 Extracting design system from Figma...\n');
    
    // Extract design system
    const designSystem = await extractDesignSystem(apiKey, fileId);
    
    console.log('\n📚 Updating Storybook stories...');
    const storyFiles = updateStorybookStories(designSystem);
    console.log(`✅ Generated ${storyFiles.length} story files:`);
    storyFiles.forEach(file => console.log(`   - ${file}`));
    
    console.log('\n🎯 Updating design tokens...');
    const tokenFiles = updateDesignTokens(designSystem);
    console.log(`✅ Generated ${tokenFiles.length} token files:`);
    tokenFiles.forEach(file => console.log(`   - ${file}`));
    
    // Save complete design system data
    console.log('\n💾 Saving design system data...');
    fs.writeFileSync('figma-design-system.json', JSON.stringify(designSystem, null, 2));
    console.log('✅ Saved figma-design-system.json');
    
    console.log('\n🎉 Sync complete!');
    console.log('\nNext steps:');
    console.log('1. Run "npm run storybook" to see updated stories');
    console.log('2. Import tokens from src/tokens/ in your components');
    console.log('3. Review the generated stories in Design System section');
    console.log('4. Commit the changes to your repository');
    
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  } finally {
    rl.close();
  }
}

process.on('unhandledRejection', (error) => {
  console.error('\n❌ Unexpected error:', error.message);
  rl.close();
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('\n\n👋 Sync cancelled by user');
  rl.close();
  process.exit(0);
});

main();