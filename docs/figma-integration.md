# Figma Integration Guide

This guide explains how to use the Figma integration tools included with the Rescale Design System to sync design tokens, extract components, and maintain consistency between design and code.

## Table of Contents

- [Setup](#setup)
- [Available Scripts](#available-scripts)
- [Figma API Client](#figma-api-client)
- [Design Token Extraction](#design-token-extraction)
- [Color System Sync](#color-system-sync)
- [Component Preparation](#component-preparation)
- [File Organization](#file-organization)
- [Best Practices](#best-practices)

## Setup

### 1. Get Figma API Token

1. Go to [Figma account settings](https://www.figma.com/settings)
2. Navigate to "Personal Access Tokens"
3. Create a new token with `file_content:read` scope
4. Copy the token

### 2. Configure Environment

Add to your `.env` file:

```bash
FIGMA_API_TOKEN=figd_YOUR_TOKEN_HERE
FIGMA_FILE_ID=YOUR_FILE_ID_HERE
```

Or export directly:

```bash
export FIGMA_API_TOKEN="figd_YOUR_TOKEN_HERE"
```

### 3. Find Your File ID

Your Figma file ID is in the URL:
```
https://www.figma.com/file/FILE_ID_HERE/File-Name
```

## Available Scripts

### Extract Design Tokens

Extract all design tokens from your Figma file:

```bash
npm run figma:extract-tokens

# Output:
# - figma-data/design-tokens.json
# - figma-data/design-tokens.css
# - figma-data/design-tokens.js
# - figma-data/design-tokens.d.ts
```

### Sync Color System

Synchronize colors between Figma and code:

```bash
npm run figma:sync-colors

# Output:
# - figma-data/colors.json
# - figma-data/colors.css
# - figma-data/colors.js
# - figma-data/colors.scss
# - figma-data/color-documentation.md
```

### Generate Component Specs

Create detailed component specifications:

```bash
npm run figma:generate-specs

# Output:
# - figma-data/component-specs/
# - figma-data/component-documentation.md
```

### Prepare Figma File

Comprehensive file preparation and analysis:

```bash
npm run figma:prepare

# This runs a 10-step process:
# 1. Connect to Figma API
# 2. Analyze file structure
# 3. Create design system pages
# 4. Extract and organize colors
# 5. Extract typography system
# 6. Process components
# 7. Generate specifications
# 8. Create design tokens
# 9. Generate documentation
# 10. Optimize file structure
```

## Figma API Client

### Basic Usage

```typescript
import { FigmaApiClient } from 'rescale-design-system/lib/figma-api-client';

const client = new FigmaApiClient(process.env.FIGMA_API_TOKEN);
const fileId = 'YOUR_FILE_ID';

// Get file data
const file = await client.getFile(fileId);

// Extract colors
const colors = await client.getAllColors();

// Extract text styles
const textStyles = await client.getAllTextStyles();

// Extract components
const components = await client.getAllComponents();
```

### Advanced Features

#### Search for Nodes

```typescript
// Search by name
const buttons = await client.searchNodesByName('button');

// Search by type
const frames = await client.searchNodesByType('FRAME');
```

#### Extract Specific Data

```typescript
// Get all colors with context
const colorsWithContext = await client.getAllColors();
// Returns: Array<{
//   name: string;
//   color: FigmaColor;
//   hex: string;
//   context: string;
// }>

// Get component specifications
const specs = await client.getComponentSpecs(componentId);
```

#### Export Images

```typescript
// Export node as image
const imageUrl = await client.exportNodeAsImage(
  nodeId,
  'PNG', // format: 'PNG' | 'JPG' | 'SVG' | 'PDF'
  2      // scale: 1-4
);
```

## Design Token Extraction

### Token Structure

The extraction process creates tokens in multiple formats:

```javascript
// design-tokens.json
{
  "colors": {
    "primary-500": "#3B82F6",
    "primary-600": "#2563EB",
    // ...
  },
  "typography": {
    "font-size-base": "16px",
    "font-weight-medium": 500,
    // ...
  },
  "spacing": {
    "spacing-4": "16px",
    "spacing-8": "32px",
    // ...
  }
}
```

### Using Extracted Tokens

```typescript
import tokens from './figma-data/design-tokens.json';

// In your components
const Button = styled.button`
  background-color: ${tokens.colors['primary-500']};
  font-size: ${tokens.typography['font-size-base']};
  padding: ${tokens.spacing['spacing-4']};
`;
```

## Color System Sync

### Color Organization

The sync process organizes colors into semantic groups:

```javascript
{
  "primary": [
    { "name": "primary-50", "hex": "#EFF6FF" },
    { "name": "primary-100", "hex": "#DBEAFE" },
    // ... full scale
  ],
  "neutral": [
    // ... grayscale
  ],
  "semantic": {
    "success": [...],
    "warning": [...],
    "error": [...],
    "info": [...]
  }
}
```

### Generated Files

1. **colors.css** - CSS custom properties
```css
:root {
  --color-primary-500: #3B82F6;
  --color-success-500: #10B981;
  /* ... */
}
```

2. **colors.js** - JavaScript constants
```javascript
export const colors = {
  primary500: '#3B82F6',
  success500: '#10B981',
  // ...
};
```

3. **colors.scss** - Sass variables
```scss
$color-primary-500: #3B82F6;
$color-success-500: #10B981;
// ...
```

## Component Preparation

### Automated Analysis

The component preparation script:

1. **Discovers all components** in your Figma file
2. **Analyzes structure** and properties
3. **Suggests naming improvements**
4. **Creates specifications**
5. **Generates implementation guides**

### Output Example

```javascript
// component-preparation-analysis.json
{
  "components": {
    "Button": {
      "id": "1:123",
      "variants": ["primary", "secondary", "danger"],
      "properties": {
        "size": ["small", "medium", "large"],
        "state": ["default", "hover", "active", "disabled"]
      },
      "specifications": {
        "minWidth": "80px",
        "height": {
          "small": "32px",
          "medium": "40px",
          "large": "48px"
        }
      }
    }
  }
}
```

## File Organization

### Recommended Figma Structure

```
📁 Design System File
├── 📄 Cover
├── 📄 Design Tokens
│   ├── Colors
│   ├── Typography
│   ├── Spacing
│   └── Effects
├── 📄 Components
│   ├── Atoms
│   ├── Molecules
│   ├── Organisms
│   └── Templates
├── 📄 Documentation
│   ├── Getting Started
│   ├── Guidelines
│   └── Examples
└── 📄 Archive
```

### Naming Conventions

#### Colors
```
primary/500
neutral/gray-100
semantic/success/500
```

#### Components
```
Component/Variant/State
Button/Primary/Default
Input/Text/Focused
```

#### Typography
```
heading/h1
body/base
caption/small
```

## Best Practices

### 1. Regular Syncing

Set up a CI/CD pipeline to sync tokens regularly:

```yaml
# .github/workflows/sync-figma.yml
name: Sync Figma Tokens
on:
  schedule:
    - cron: '0 0 * * *' # Daily
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm run figma:extract-tokens
        env:
          FIGMA_API_TOKEN: ${{ secrets.FIGMA_API_TOKEN }}
      - uses: peter-evans/create-pull-request@v5
        with:
          title: 'Update design tokens from Figma'
```

### 2. Version Control

Track changes to design tokens:

```bash
# .gitignore
figma-data/*.json
!figma-data/design-tokens.json
!figma-data/colors.json
```

### 3. Validation

Validate extracted tokens before use:

```typescript
import { validateTokens } from './utils/token-validator';

const tokens = require('./figma-data/design-tokens.json');

if (!validateTokens(tokens)) {
  throw new Error('Invalid token structure');
}
```

### 4. Documentation

Keep documentation in sync:

```bash
# After token extraction
npm run figma:generate-docs

# Generates:
# - Token reference
# - Component usage guide
# - Migration notes
```

### 5. Error Handling

Handle API limitations gracefully:

```typescript
try {
  const colors = await client.getAllColors();
} catch (error) {
  if (error.status === 429) {
    // Rate limited - wait and retry
    await delay(1000);
    return retry();
  }
  // Fall back to cached data
  return getCachedColors();
}
```

## Troubleshooting

### Common Issues

1. **"Invalid token" error**
   - Check token has `file_content:read` scope
   - Ensure token hasn't expired
   - Verify file access permissions

2. **"File too large" error**
   - Use pagination for large files
   - Extract specific pages/nodes
   - Increase timeout settings

3. **"Rate limit exceeded"**
   - Add delays between requests
   - Batch operations
   - Use caching

### Debug Mode

Enable verbose logging:

```bash
DEBUG=figma:* npm run figma:extract-tokens
```

## Migration Guide

### From Manual Tokens

1. Extract current tokens from Figma
2. Compare with existing tokens
3. Create migration map
4. Update components gradually
5. Deprecate old tokens

### Example Migration

```typescript
// migration-map.js
export const tokenMigration = {
  // Old -> New
  'brand-primary': 'primary-500',
  'text-default': 'neutral-900',
  'bg-light': 'neutral-50'
};

// In components
const oldColor = theme.colors['brand-primary'];
const newColor = tokens.colors[tokenMigration['brand-primary']];
```