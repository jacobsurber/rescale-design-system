# Figma Extractor Usage Guide

You now have **3 different ways** to extract design tokens from your Figma files:

## 🚀 Quick Start

### Method 1: Command Line (Full Extraction)
```bash
npm run figma:extract
```
- Prompts for API token and file ID
- Extracts colors, typography, spacing, components, and effects
- Generates multiple file formats

### Method 2: Command Line (Colors Only)
```bash
npm run figma:colors
```
- Focused on color extraction
- Organizes colors by category
- Faster for color-only workflows

### Method 3: Browser Interface
```bash
open scripts/figma-extractor.html
```
- User-friendly web interface
- No command line needed
- Downloads files directly to your browser

## 📋 Prerequisites

### 1. Get Your Figma API Token
1. Go to [Figma Settings](https://www.figma.com/settings)
2. Click "Personal Access Tokens"
3. Create a new token with `file_content:read` scope
4. Copy the token (starts with `figd_`)

### 2. Get Your File ID
From your Figma URL: `https://www.figma.com/file/FILE_ID_HERE/Your-File-Name`

## 💻 Detailed Usage

### Command Line Extractor

```bash
npm run figma:extract
```

**Prompts:**
- Enter your Figma API token: `figd_your_token_here`
- Enter your Figma file ID: `abc123def456`
- Output directory: `figma-data` (default)

**Output Files:**
```
figma-data/
├── design-tokens.json    # All extracted tokens
├── components.json       # Component specifications
├── colors.css           # CSS custom properties
├── colors.js            # JavaScript object
├── colors.scss          # Sass variables
└── colors.json          # JSON color data
```

### Color-Only Extractor

```bash
npm run figma:colors
```

**Additional Output:**
```
figma-colors/
├── colors.css              # CSS custom properties
├── colors.js               # JavaScript exports
├── colors.scss             # Sass variables
├── colors.d.ts             # TypeScript definitions
├── colors-detailed.json    # With metadata
└── colors-organized.json   # Categorized colors
```

### Browser Interface

1. Open `scripts/figma-extractor.html` in your browser
2. Fill in your API token and file ID
3. Choose what to extract:
   - Everything (Colors, Typography, Components)
   - Colors Only
   - Design Tokens Only
   - Components Only
4. Click "Extract Design Tokens"
5. Files download automatically

## 📁 Using Extracted Files

### CSS Custom Properties
```css
/* Import colors.css */
@import './figma-data/colors.css';

.button {
  background-color: var(--color-primary-500);
  color: var(--color-neutral-white);
}
```

### JavaScript/React
```jsx
import { colors } from './figma-data/colors.js';

const Button = styled.button`
  background-color: ${colors['primary-500']};
  color: ${colors['neutral-white']};
`;
```

### SCSS
```scss
@import './figma-data/colors.scss';

.button {
  background-color: $color-primary-500;
  color: $color-neutral-white;
}
```

## 🎯 Tips & Best Practices

### 1. Organize Your Figma File
- Use consistent naming for colors (primary/500, neutral/gray-100)
- Create color styles for reusable colors
- Group components logically
- Use descriptions for better extraction

### 2. Token Naming
The extractor converts Figma names to code-friendly formats:
- `Primary/500` → `primary-500`
- `Neutral Gray/100` → `neutral-gray-100`
- `Success Green` → `success-green`

### 3. Regular Sync
Set up a workflow to sync regularly:
```bash
# Add to your package.json scripts
"sync-design": "npm run figma:colors && npm run build:storybook"
```

### 4. Version Control
Consider committing extracted tokens:
```bash
# Add to your repo
git add figma-data/
git commit -m "sync: update design tokens from Figma"
```

## 🔧 Troubleshooting

### Common Issues

**"Invalid token" error:**
- Check your token has `file_content:read` scope
- Ensure token hasn't expired
- Verify you copied the full token

**"File not found" error:**
- Double-check the file ID from the URL
- Ensure you have access to the file
- Try with a different file you own

**No colors found:**
- Check if your file has color styles published
- Try with a file that has visible color elements
- Use the browser version to see the extraction log

**Rate limiting:**
- Wait a few minutes between extractions
- Figma API has rate limits for free accounts

### Getting Help

1. Check the extraction logs for specific errors
2. Try the browser version for better error messages
3. Verify your Figma file has the content you expect
4. Test with a simple file first

## 🚀 Next Steps

1. Extract your tokens: `npm run figma:extract`
2. Review the generated files
3. Import colors into your project
4. Update your theme configuration
5. Build and test your design system

Happy extracting! 🎨