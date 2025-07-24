# 🚀 Figma MCP Advanced Features

With the new Figma MCP (Model Context Protocol) integration, we've unlocked powerful capabilities that weren't possible with the traditional REST API. This guide covers the advanced features now available.

## 📋 Table of Contents

- [Real-time Sync](#real-time-sync)
- [Smart Asset Extraction](#smart-asset-extraction) 
- [Design Validation](#design-validation)
- [MCP vs REST API Comparison](#mcp-vs-rest-api-comparison)
- [Best Practices](#best-practices)

## 🔄 Real-time Sync

The real-time sync feature enables live synchronization between Figma and your codebase as designers work.

### Usage

```bash
npm run figma:realtime
```

### Features

1. **Token Sync Mode** - Watches for design token changes and updates them immediately
2. **Component Sync Mode** - Generates/updates React components from Figma selections
3. **Asset Sync Mode** - Extracts and optimizes assets in real-time
4. **Validation Mode** - Continuously validates implementations against specs
5. **Full Sync Mode** - All modes active simultaneously

### Example Workflow

```bash
# Start real-time token sync
npm run figma:realtime
# Select option 1 (Token Sync)
# Select any frame in Figma - tokens update automatically!
```

### Hot Reload Integration

The real-time sync integrates with your dev server for instant updates:

```javascript
// Tokens are saved to src/theme/tokens/realtime/
// Your app hot-reloads automatically when tokens change
```

## 🎯 Smart Asset Extraction

The MCP asset extractor provides direct access to Figma's rendering engine for perfect asset extraction.

### Usage

```bash
npm run figma:assets
```

### Key Features

1. **SVG Code Extraction** - Get actual SVG code, not rendered images
2. **Batch Extraction** - Extract multiple assets by pattern matching
3. **Automatic Optimization** - Built-in SVGO optimization (40-60% size reduction)
4. **React Component Generation** - Auto-generate typed React components
5. **Icon System Setup** - Complete icon system scaffolding

### Example: Extract All Icons

```bash
npm run figma:assets
# Select option 3 (Extract All Icons from Frame)
# Select a frame with icons in Figma
# All icons are extracted, optimized, and organized!
```

### Generated Icon Component Example

```typescript
// Auto-generated from Figma
export const ArrowIcon: React.FC<ArrowIconProps> = ({
  size = 24,
  color = 'currentColor',
  className,
  ...props
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      className={className}
      {...props}
    >
      {/* Optimized SVG paths from Figma */}
    </svg>
  );
};
```

## ✅ Design Validation

Validate your React implementations against Figma designs automatically.

### Usage

```bash
npm run figma:validate
```

### Validation Types

1. **Visual Accuracy** - Pixel-perfect comparison
2. **Token Compliance** - Ensures proper token usage
3. **Spacing & Layout** - Verifies measurements match
4. **Accessibility** - WCAG 2.1 AA compliance
5. **Design Consistency** - Cross-component validation

### CI/CD Integration

```yaml
# Auto-generated GitHub Actions workflow
- name: Run design validation
  run: npm run figma:validate --ci
  
- name: Comment PR with results
  # Automatically comments validation results on PRs
```

### Validation Report

The validator generates comprehensive HTML reports showing:
- Component-by-component validation results
- Visual diff images
- Token usage audit
- Accessibility issues
- Actionable recommendations

## 📊 MCP vs REST API Comparison

| Feature | REST API | MCP |
|---------|----------|-----|
| **Authentication** | API tokens required | No tokens needed |
| **Real-time Updates** | Polling required | Live selection tracking |
| **Asset Access** | Image URLs only | Direct SVG/vector access |
| **Component Info** | Basic properties | Full rendering data |
| **Performance** | Network latency | Local/instant |
| **Accuracy** | Approximated | Pixel-perfect |
| **Workflow** | File ID management | Direct desktop integration |

## 🎨 Advanced MCP Capabilities

### 1. Node-Specific Extraction

```javascript
// Extract specific component by ID
mcp__figma-dev-mode-mcp-server__get_code({ 
  nodeId: "705-19295" // Target specific icon
})
```

### 2. Variable Definitions

```javascript
// Get all design tokens from Figma variables
mcp__figma-dev-mode-mcp-server__get_variable_defs()
// Returns: { 'primary/500': '#3B82F6', ... }
```

### 3. Code Connect Mapping

```javascript
// Map Figma components to codebase locations
mcp__figma-dev-mode-mcp-server__get_code_connect_map()
// Returns: { '1:2': { src: 'components/Button.tsx' } }
```

### 4. Design System Rules

```javascript
// Generate design system documentation
mcp__figma-dev-mode-mcp-server__create_design_system_rules()
```

## 💡 Best Practices

### 1. Selection-Based Workflow

- Work with designers to select frames before extraction
- Use current selection for faster, more accurate extraction
- Batch similar components together

### 2. Continuous Validation

```bash
# Run validation in watch mode during development
npm run figma:validate -- --watch
```

### 3. Asset Organization

```
src/
├── assets/
│   ├── icons/
│   │   ├── svg/          # Raw SVGs
│   │   ├── components/   # React components
│   │   └── index.ts      # Exports
│   └── images/
│       └── optimized/    # Processed images
```

### 4. Token-First Development

Always use extracted tokens instead of hardcoded values:

```typescript
// ❌ Bad
color: '#3B82F6'

// ✅ Good  
color: tokens.colors.primary500
```

### 5. Automated Workflows

Set up CI/CD pipelines for automatic validation:

```json
{
  "pre-commit": "npm run figma:validate",
  "pre-push": "npm run figma:validate -- --strict"
}
```

## 🚀 Getting Started

1. **Ensure Figma Desktop is Running**
   ```bash
   # MCP requires Figma desktop app
   open -a Figma
   ```

2. **Start Real-time Sync**
   ```bash
   npm run figma:realtime
   ```

3. **Extract Assets**
   ```bash
   npm run figma:assets
   ```

4. **Validate Implementations**
   ```bash
   npm run figma:validate
   ```

## 🔧 Troubleshooting

### MCP Connection Issues

If MCP tools can't connect:
1. Ensure Figma desktop app is running
2. Check MCP server is available: `curl http://localhost:3845`
3. Restart Figma if needed

### Asset Extraction Issues

If assets aren't extracting correctly:
1. Select the specific frame/component in Figma
2. Ensure the selection contains the assets you want
3. Try extracting individual assets first

### Validation Failures

If validation consistently fails:
1. Check that Figma designs are up to date
2. Ensure design tokens are properly extracted
3. Run token audit to identify hardcoded values

## 📚 Additional Resources

- [Figma MCP Integration Guide](./figma-integration.md)
- [Design Token Best Practices](./design-tokens.md)
- [Component Development Guide](./component-guide.md)

---

With these MCP-powered tools, you can achieve true design-development parity and automate much of the design system maintenance work. The real-time nature of MCP transforms the traditional handoff process into a collaborative, continuous workflow.