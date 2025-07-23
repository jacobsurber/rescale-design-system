# Figma to Storybook Sync System

This system automatically extracts design tokens from Figma and updates your Storybook documentation. It creates organized, categorized displays of your design system elements.

## 🚀 Quick Start

### Manual Sync (Interactive)
```bash
npm run figma:sync-storybook
```
- Prompts for API token and file ID
- Extracts complete design system
- Generates Storybook stories and design tokens

### Automated Sync (CI/CD Ready)
```bash
# Set environment variables
export FIGMA_API_TOKEN="figd_your_token_here"
export FIGMA_FILE_ID="your_file_id_here"

# Run automated sync
npm run figma:auto-sync
```

## 📋 What Gets Extracted

### Colors
- **Published color styles** from your Figma file
- Organized by category (primary, secondary, success, error, etc.)
- Exported in multiple formats (CSS, JS, JSON)

### Typography
- **Text styles** with font families, sizes, weights
- Line heights and letter spacing
- Categorized by usage (headings, body, captions, labels)

### Spacing
- **Padding and margin values** from frames
- Auto-generated spacing tokens
- Pixel and rem values

### Components
- **Component definitions** and variants
- Component properties and descriptions
- Component specifications for developers

## 📁 Generated Files

### Storybook Stories
```
src/stories/design-system/
├── Colors.stories.tsx        # Interactive color palette
├── Typography.stories.tsx    # Font style showcase
├── Spacing.stories.tsx       # Spacing token display
└── Components.stories.tsx    # Component specifications
```

### Design Tokens
```
src/tokens/
├── colors.ts        # Color tokens as TypeScript
├── colors.css       # CSS custom properties
├── typography.ts    # Typography tokens
├── spacing.ts       # Spacing tokens
└── index.ts         # Complete design system export
```

### Data Files
```
figma-data/
├── design-system.json    # Complete extracted data
└── sync-metadata.json    # Sync tracking metadata
```

## 🎯 Usage Examples

### Using Color Tokens
```tsx
// Import tokens
import { colors } from '../tokens/colors';

// Use in styled-components
const Button = styled.button`
  background-color: ${colors['primary-500']};
  color: ${colors['neutral-white']};
`;

// Use CSS custom properties
.button {
  background-color: var(--color-primary-500);
  color: var(--color-neutral-white);
}
```

### Using Typography Tokens
```tsx
import { typography } from '../tokens/typography';

const Heading = styled.h1`
  font-family: ${typography['heading-large'].fontFamily};
  font-size: ${typography['heading-large'].fontSize}px;
  font-weight: ${typography['heading-large'].fontWeight};
`;
```

### Using Spacing Tokens
```tsx
import { spacing } from '../tokens/spacing';

const Card = styled.div`
  padding: ${spacing['spacing-16']};
  margin-bottom: ${spacing['spacing-24']};
`;
```

## 🔧 Configuration

### Environment Variables

For automated sync, set these environment variables:

```bash
# Required
FIGMA_API_TOKEN="figd_your_personal_access_token"
FIGMA_FILE_ID="your_figma_file_id"

# Optional
AUTO_COMMIT="true"              # Auto-commit changes to git
BUILD_STORYBOOK="true"          # Build Storybook after sync
```

### Manual Configuration

Edit the scripts directly for custom directories:

```javascript
// In scripts/figma-to-storybook.js
const storybookDir = 'src/stories';    // Storybook stories location
const tokensDir = 'src/tokens';        // Design tokens location

// In scripts/auto-sync-figma.js
const config = {
  storybookDir: 'src/stories',
  tokensDir: 'src/tokens',
  outputDir: 'figma-data',
  autoCommit: process.env.AUTO_COMMIT === 'true',
  buildStorybook: process.env.BUILD_STORYBOOK !== 'false'
};
```

## 🔄 Automated Workflows

### CI/CD Integration

Add to your GitHub Actions workflow:

```yaml
name: Sync Design Tokens
on:
  schedule:
    - cron: '0 9 * * 1'  # Every Monday at 9 AM
  workflow_dispatch:

jobs:
  sync-figma:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm ci
      
      - name: Sync Figma Design Tokens
        env:
          FIGMA_API_TOKEN: ${{ secrets.FIGMA_API_TOKEN }}
          FIGMA_FILE_ID: ${{ secrets.FIGMA_FILE_ID }}
          AUTO_COMMIT: true
          BUILD_STORYBOOK: true
        run: npm run figma:auto-sync
      
      - name: Push changes
        run: |
          git push origin main
```

### Local Development

Add to your development workflow:

```bash
# Add to package.json scripts
"dev:sync": "npm run figma:sync-storybook && npm run storybook",
"prebuild": "npm run figma:auto-sync || true"
```

## 📊 Storybook Integration

The generated stories provide:

### Color Stories
- **Visual color swatches** with hex values
- **Organized categories** (primary, secondary, etc.)
- **Color descriptions** from Figma
- **Usage examples** and accessibility info

### Typography Stories
- **Live text samples** showing actual fonts
- **Font specifications** (family, size, weight, line-height)
- **Usage guidelines** for each text style
- **Responsive behavior** examples

### Spacing Stories
- **Visual spacing bars** showing actual pixel values
- **Rem equivalents** for responsive design
- **Usage examples** showing where each spacing is used
- **Consistent spacing scale** documentation

### Component Stories
- **Component specifications** extracted from Figma
- **Available variants** and properties
- **Usage guidelines** and descriptions
- **Implementation examples**

## 🛠️ Advanced Features

### Incremental Sync

The auto-sync system tracks changes:

```bash
# Only syncs if Figma file has been modified
npm run figma:auto-sync

# Force sync regardless of changes
FORCE_SYNC=true npm run figma:auto-sync
```

### Custom Categorization

Colors and typography are automatically categorized:

```javascript
// Colors: primary, secondary, success, warning, error, info, neutral, other
// Typography: heading, body, caption, label, other

// Customize in the scripts:
function categorizeColor(name) {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('brand')) return 'primary';
  // Add your custom logic...
}
```

### Multi-File Support

Extract from multiple Figma files:

```bash
# Set multiple files
export FIGMA_FILE_IDS="file1,file2,file3"
npm run figma:auto-sync
```

## 🔍 Troubleshooting

### Common Issues

**No colors extracted:**
- Ensure your Figma file has published color styles
- Check that your API token has the correct permissions
- Verify the file ID is correct

**Storybook not updating:**
- Clear Storybook cache: `rm -rf .storybook-cache`
- Restart Storybook: `npm run storybook`
- Check for TypeScript errors in generated files

**Sync failing:**
- Check network connectivity to Figma API
- Verify your API token hasn't expired
- Ensure sufficient API rate limits

### Debug Mode

Enable detailed logging:

```bash
DEBUG=true npm run figma:sync-storybook
```

## 📈 Best Practices

### Figma Organization
- Use consistent naming conventions for colors and text styles
- Publish styles you want to extract as design tokens
- Add descriptions to styles for better documentation
- Organize components in logical groups

### Development Workflow
- Run sync before major releases
- Review generated tokens before committing
- Use automated sync in CI/CD for consistency
- Keep Figma file IDs in environment variables

### Token Usage
- Import tokens from centralized location
- Use TypeScript for better type safety
- Avoid hardcoded values in components
- Document token usage in component stories

## 🎉 Results

After running the sync, you'll have:

1. **Automated Storybook documentation** that stays in sync with your Figma designs
2. **Consistent design tokens** available as TypeScript, CSS, and JSON
3. **Visual design system reference** that developers can use
4. **Change tracking** to know when your design system updates
5. **CI/CD integration** for automated design system maintenance

The sync creates a bridge between design and development, ensuring your code stays consistent with your designs automatically.