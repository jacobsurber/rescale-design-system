# Figma Integration Guide

This guide explains how to use the Figma MCP (Model Context Protocol) integration tools included with the Rescale Design System to sync design tokens, extract components, and maintain consistency between design and code.

> **🚀 New MCP Integration**: We've migrated from REST API to MCP for better performance, real-time updates, and no authentication requirements. See [Advanced MCP Features](./figma-mcp-advanced-features.md) for cutting-edge capabilities.

## Table of Contents

- [MCP Setup](#mcp-setup)
- [Available Scripts](#available-scripts)
- [MCP Tools Overview](#mcp-tools-overview)
- [Design Token Extraction](#design-token-extraction)
- [Real-time Features](#real-time-features)
- [Asset Extraction](#asset-extraction)
- [Design Validation](#design-validation)
- [File Organization](#file-organization)
- [Best Practices](#best-practices)
- [Legacy API Support](#legacy-api-support)

## MCP Setup

**No authentication required!** The MCP integration works directly with your Figma desktop app.

### Prerequisites

1. **Figma Desktop App** - Install and run the Figma desktop application
2. **MCP Server** - Ensure the MCP server is available (usually auto-configured)
3. **Node.js 18+** - Required for running the extraction scripts

### Quick Setup

```bash
# 1. Ensure Figma desktop is running
open -a Figma

# 2. Open your design file in Figma
# 3. Select the frame or component you want to extract

# 4. Run any MCP tool
npm run figma:extract
```

### Verification

Test your MCP connection:

```bash
# This should show available MCP tools
curl http://localhost:3845/tools 2>/dev/null || echo "MCP server not available"
```

## Available Scripts

### Core MCP Tools

#### Extract Design Tokens
Interactive CLI for comprehensive token extraction:

```bash
npm run figma:extract

# Features:
# - All tokens (colors, typography, spacing)
# - Colors only extraction
# - Typography only extraction
# - Component code generation
# - Full export with stories
```

#### Color-Focused Extraction

```bash
npm run figma:colors

# Advanced color extraction:
# - Organized by color type/brightness
# - Multiple export formats (CSS, JS, SCSS, JSON)
# - TypeScript definitions
# - Color palette stories
```

#### Storybook Sync

```bash
npm run figma:sync-storybook

# Generates:
# - Token documentation stories
# - Color palette displays
# - Typography showcases
# - Component stories with specs
```

#### Automated Sync

```bash
npm run figma:auto-sync

# CI/CD ready automation:
# - Watch mode for continuous sync
# - Auto-commit to git
# - Build Storybook after sync
# - Change detection and metadata
```

### Advanced MCP Tools

#### Real-time Sync

```bash
npm run figma:realtime

# Live synchronization modes:
# - Token sync (updates as you work)
# - Component sync (generates code from selections)
# - Asset sync (extracts assets in real-time)
# - Validation mode (continuous compliance checking)
```

#### Smart Asset Extraction

```bash
npm run figma:assets

# Professional asset workflow:
# - SVG code extraction (not images)
# - Batch icon extraction
# - React component generation
# - Icon system setup
# - Automatic optimization (40-60% size reduction)
```

#### Design Validation

```bash
npm run figma:validate

# Comprehensive validation suite:
# - Visual accuracy testing
# - Token compliance audit
# - Accessibility validation (WCAG 2.1 AA)
# - CI/CD integration
# - HTML reports with diff images
```

## MCP Tools Overview

### Direct Desktop Integration

The MCP tools work directly with your Figma desktop app, providing instant access to design data:

```javascript
// Example: Extract from currently selected node
import { mcp__figma-dev-mode-mcp-server__get_code } from './mcp-tools';

// Get code for selected component
const componentCode = await mcp__figma-dev-mode-mcp-server__get_code({
  nodeId: "", // Current selection
  clientName: "claude code",
  clientLanguages: "typescript",
  clientFrameworks: "react"
});
```

### Real-time Selection Tracking

```javascript
// Get variable definitions from current selection
const variables = await mcp__figma-dev-mode-mcp-server__get_variable_defs({
  nodeId: "705-19295" // Specific component
});
// Returns: { 'primary/500': '#3B82F6', 'spacing/md': '16px' }
```

### Asset Server Access

```javascript
// Direct access to Figma's asset server
const imageData = await mcp__figma-dev-mode-mcp-server__get_image({
  nodeId: "123:456"
});
// Returns actual asset data, not URLs
```

### Code Connect Mapping

```javascript
// Map Figma components to codebase locations
const codeMap = await mcp__figma-dev-mode-mcp-server__get_code_connect_map();
// Returns: { '1:2': { codeConnectSrc: 'components/Button.tsx' } }
```

## Design Token Extraction

### MCP-Powered Token Extraction

The MCP extraction provides real-time access to Figma's variable system:

```javascript
// Real-time token extraction from current selection
const extractedTokens = await extractor.generateTokens(outputDir);

// Output structure:
{
  "colors": {
    "primary/500": { 
      hex: "#3B82F6", 
      rgb: { r: 0.23, g: 0.51, b: 0.96 },
      name: "Primary 500" 
    }
  },
  "typography": {
    "heading/h1": {
      fontFamily: "Inter",
      fontSize: 32,
      fontWeight: 700,
      lineHeight: 40
    }
  },
  "spacing": {
    "spacing-md": "16px",
    "spacing-lg": "24px"
  }
}
```

### Hot Reload Integration

```typescript
// Tokens are automatically updated when Figma changes
import { designTokens } from './src/theme/tokens/realtime';

// Your components stay in sync
const Button = styled.button`
  background-color: ${designTokens.colors['primary/500'].hex};
  font-size: ${designTokens.typography['button/medium'].fontSize}px;
  padding: ${designTokens.spacing['spacing-md']};
`;
```

## Real-time Features

### Live Token Sync

```bash
# Start real-time token synchronization
npm run figma:realtime

# Select mode 1 (Token Sync)
# Now any frame you select in Figma automatically extracts its tokens!
```

### Component Generation

```bash
# Real-time component generation
npm run figma:realtime

# Select mode 2 (Component Sync)
# Select a component in Figma -> React code is generated instantly
```

### Validation Monitoring

```bash
# Continuous design validation
npm run figma:realtime

# Select mode 4 (Validation Mode)
# Validates your implementations against Figma specs in real-time
```

## Asset Extraction

### SVG Code Extraction

Unlike traditional image exports, MCP provides direct SVG code:

```bash
# Extract individual icon
npm run figma:assets
# Select option 1, choose an icon in Figma
# Get optimized SVG code, not a rendered image!
```

### Batch Icon Extraction

```bash
# Extract all icons from a frame
npm run figma:assets
# Select option 3
# All icons in the selected frame are extracted and optimized
```

### React Component Generation

```bash
# Generate React components from icons
npm run figma:assets
# Select option 4
# Icons become fully-typed React components with props
```

Example generated component:

```typescript
export const ArrowIcon: React.FC<ArrowIconProps> = ({
  size = 24,
  color = 'currentColor',
  className,
  ...props
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...props}>
      <path d="M12 2L22 7V17L12 22L2 17V7L12 2Z" stroke={color} strokeWidth="2"/>
    </svg>
  );
};
```

## Design Validation

### Automated Validation

```bash
# Validate component implementations
npm run figma:validate

# Options:
# 1. Single component validation
# 2. Directory validation (atoms/molecules/organisms)
# 3. Design token audit
# 4. Visual regression testing
# 5. Accessibility validation
```

### CI/CD Integration

The validator creates GitHub Actions workflows:

```yaml
# Auto-generated workflow
name: Design Validation
on: [pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm run figma:validate --ci
      - name: Comment PR with results
        # Adds validation results to PR comments
```

### Validation Reports

HTML reports with detailed results:

- Visual diff images showing discrepancies
- Token compliance audit
- Accessibility score (WCAG 2.1 AA)
- Component-by-component breakdown
- Actionable recommendations

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

### 1. Selection-Based Workflow

Work with designers to establish selection-based workflows:

```bash
# Workflow example:
# 1. Designer selects component/frame in Figma
# 2. Developer runs extraction tool
# 3. Tokens/assets are extracted from selection
# 4. Code is automatically updated
```

### 2. Real-time Development

Use real-time sync during active development:

```bash
# Start real-time sync during design reviews
npm run figma:realtime

# Tokens update as designers make changes
# Components validate automatically
# Assets extract on selection
```

### 3. Automated Validation

Set up continuous validation:

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run figma:validate",
      "pre-push": "npm run figma:validate --strict"
    }
  }
}
```

### 4. Asset Organization

Organize extracted assets systematically:

```
src/
├── assets/
│   ├── icons/
│   │   ├── svg/              # Raw SVGs from Figma
│   │   ├── components/       # React components
│   │   └── index.ts          # Barrel exports
│   └── images/
│       └── optimized/        # Processed images
└── theme/
    └── tokens/
        ├── colors.json       # Color tokens
        ├── typography.json   # Typography tokens
        └── realtime/         # Hot-reload tokens
```

### 5. Design System Rules

Use MCP to generate design system documentation:

```javascript
// Generate comprehensive design system rules
const rules = await mcp__figma-dev-mode-mcp-server__create_design_system_rules({
  clientName: "design-system",
  clientFrameworks: "react",
  clientLanguages: "typescript"
});
```

### 6. Component Mapping

Maintain mapping between Figma and code:

```javascript
// Use code connect mapping for consistency
const mapping = await mcp__figma-dev-mode-mcp-server__get_code_connect_map();

// Ensure Figma components map to actual code locations
// mapping['1:2'] = { codeConnectSrc: 'src/components/Button.tsx' }
```

## Legacy API Support

For backward compatibility, the original REST API tools are still available:

### Legacy Scripts

```bash
# Legacy API-based tools (require FIGMA_API_TOKEN)
npm run figma:extract-legacy
npm run figma:colors-legacy
npm run figma:sync-storybook-legacy
npm run figma:auto-sync-legacy
```

### Migration from API to MCP

| API Script | MCP Equivalent | Key Improvements |
|------------|----------------|------------------|
| `figma:extract-tokens` | `figma:extract` | Real-time selection, no tokens needed |
| `figma:sync-colors` | `figma:colors` | Live color extraction, better organization |
| `figma:generate-specs` | `figma:assets` | SVG code, React components |
| `figma:prepare` | `figma:realtime` | Live sync, validation, hot reload |

### When to Use Legacy API

- **CI/CD pipelines** that can't access Figma desktop
- **Automated scripts** running without human interaction
- **File-based extraction** from specific Figma file IDs
- **Batch processing** of multiple Figma files

### Legacy Setup

If you need the legacy API tools:

```bash
# Set up API token
export FIGMA_API_TOKEN="figd_your_token_here"
export FIGMA_FILE_ID="your_file_id"

# Use legacy tools
npm run figma:extract-legacy
```

## Troubleshooting

### MCP Issues

1. **"MCP server not available"**
   - Ensure Figma desktop app is running
   - Check `curl http://localhost:3845/tools`
   - Restart Figma if needed

2. **"No selection found"**
   - Select a frame or component in Figma
   - Ensure the selection contains extractable content
   - Try extracting from individual nodes

3. **"Asset optimization failed"**
   - Check SVG content is valid
   - Ensure sufficient disk space
   - Try extracting individual assets

### Performance Issues

If extraction is slow:

```bash
# Use specific node targeting
npm run figma:assets
# Select individual assets instead of bulk extraction

# Check MCP server health
curl http://localhost:3845/health
```

### Debug Mode

Enable verbose logging for MCP tools:

```bash
DEBUG=figma-mcp:* npm run figma:extract
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