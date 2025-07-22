# Frame-Specific Component Styling from Figma

This guide shows you how to extract styling from specific Figma frames and apply them to your React components.

## Quick Start

### 1. Discover Available Frames

```bash
# List all frames in your Figma file
node scripts/figma-frame-finder.js "YOUR_FIGMA_TOKEN"

# Search for specific component types
node scripts/figma-frame-finder.js "YOUR_FIGMA_TOKEN" "button"
node scripts/figma-frame-finder.js "YOUR_FIGMA_TOKEN" "navigation"
node scripts/figma-frame-finder.js "YOUR_FIGMA_TOKEN" "card"
```

### 2. Extract Styles from Specific Frame

```bash
# Extract from a specific frame ID
node scripts/figma-frame-extractor.js "YOUR_FIGMA_TOKEN" "FRAME_ID_HERE"

# Extract from multiple pre-mapped component frames
node scripts/figma-frame-extractor.js "YOUR_FIGMA_TOKEN"
```

## Frame-to-Component Mapping

The system automatically maps Figma frame names to React components:

| Figma Frame Name | React Component | Generated File |
|------------------|-----------------|----------------|
| Navigation Bar | `NavigationBar` | `src/theme/figma-styles/navigationbar.ts` |
| Button Primary | `Button` | `src/theme/figma-styles/button.ts` |
| Data Card | `DataCard` | `src/theme/figma-styles/datacard.ts` |
| Assistant Chat | `AssistantChat` | `src/theme/figma-styles/assistantchat.ts` |
| Quick Actions | `QuickActions` | `src/theme/figma-styles/quickactions.ts` |

## Extracted Style Structure

Each frame extraction generates comprehensive styling data:

```typescript
export const buttonStyles = {
  "colors": {
    "background": "#0066CC",      // Primary fill color
    "border": "#003D7A",          // Stroke color
    "gradient": "linear-gradient" // If gradient fill
  },
  "typography": {
    "fontFamily": "Inter",
    "fontSize": "14px", 
    "fontWeight": 500,
    "lineHeight": "20px",
    "letterSpacing": "0px",
    "textAlign": "center"
  },
  "spacing": {
    "paddingLeft": "16px",
    "paddingRight": "16px",
    "paddingTop": "8px", 
    "paddingBottom": "8px"
  },
  "layout": {
    "width": "120px",
    "height": "32px",
    "borderRadius": "4px"
  },
  "effects": {
    "shadow": "0px 2px 4px rgba(0, 0, 0, 0.1)"
  }
} as const;
```

## Using Extracted Styles in Components

### Method 1: Direct Import

```typescript
// Import the generated styles
import { ButtonStyledProps } from '@/theme/figma-styles/button';

// Use in styled-components
const StyledButton = styled.button`
  background-color: ${ButtonStyledProps.background};
  color: ${ButtonStyledProps.color};
  font-family: ${ButtonStyledProps.fontFamily};
  font-size: ${ButtonStyledProps.fontSize};
  padding: ${ButtonStyledProps.paddingTop} ${ButtonStyledProps.paddingRight};
  border-radius: ${ButtonStyledProps.borderRadius};
  box-shadow: ${ButtonStyledProps.shadow};
`;
```

### Method 2: Theme Integration

```typescript
// Add to your theme configuration
import { buttonStyles } from '@/theme/figma-styles/button';

export const rescaleTheme = {
  components: {
    Button: {
      // Apply Figma-extracted styles
      ...buttonStyles.colors,
      ...buttonStyles.typography,
      ...buttonStyles.spacing,
      ...buttonStyles.layout,
    }
  }
};
```

### Method 3: CSS Custom Properties

```typescript
// Generate CSS variables from Figma styles  
const FigmaStyledButton = () => (
  <button 
    style={{
      '--button-bg': buttonStyles.colors.background,
      '--button-radius': buttonStyles.layout.borderRadius,
      '--button-padding': `${buttonStyles.spacing.paddingTop} ${buttonStyles.spacing.paddingRight}`,
    } as React.CSSProperties}
    className="figma-button"
  >
    Figma-styled Button
  </button>
);
```

## Advanced Frame Targeting

### Target Specific Component States

```bash
# Find button variants
node scripts/figma-frame-finder.js YOUR_TOKEN "button primary"
node scripts/figma-frame-finder.js YOUR_TOKEN "button secondary"
node scripts/figma-frame-finder.js YOUR_TOKEN "button disabled"

# Extract each state
node scripts/figma-frame-extractor.js YOUR_TOKEN "BUTTON_PRIMARY_FRAME_ID"
node scripts/figma-frame-extractor.js YOUR_TOKEN "BUTTON_SECONDARY_FRAME_ID"
```

### Responsive Variants

```bash
# Find responsive variants
node scripts/figma-frame-finder.js YOUR_TOKEN "mobile navigation"
node scripts/figma-frame-finder.js YOUR_TOKEN "desktop navigation"

# Extract responsive styles
node scripts/figma-frame-extractor.js YOUR_TOKEN "MOBILE_NAV_ID"
node scripts/figma-frame-extractor.js YOUR_TOKEN "DESKTOP_NAV_ID"
```

## Example: Complete Button Component

```typescript
// src/components/atoms/Button/Button.figma.tsx
import React from 'react';
import styled from 'styled-components';
import { ButtonStyledProps } from '@/theme/figma-styles/button';
import { ButtonSecondaryStyledProps } from '@/theme/figma-styles/buttonsecondary';

const FigmaButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  // Base styles from Figma primary button
  background-color: ${props => 
    props.variant === 'secondary' 
      ? ButtonSecondaryStyledProps.background 
      : ButtonStyledProps.background
  };
  
  color: ${props => 
    props.variant === 'secondary'
      ? ButtonSecondaryStyledProps.color
      : ButtonStyledProps.color
  };
  
  font-family: ${ButtonStyledProps.fontFamily};
  font-size: ${ButtonStyledProps.fontSize};
  font-weight: ${ButtonStyledProps.fontWeight};
  
  padding: ${ButtonStyledProps.paddingTop} ${ButtonStyledProps.paddingRight};
  border-radius: ${ButtonStyledProps.borderRadius};
  border: 1px solid ${ButtonStyledProps.border || 'transparent'};
  
  box-shadow: ${ButtonStyledProps.shadow};
  
  // Hover states (you can extract these from Figma hover frames too!)
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const FigmaStyledButton: React.FC<{
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ variant = 'primary', children, ...props }) => (
  <FigmaButton variant={variant} {...props}>
    {children}
  </FigmaButton>
);
```

## Workflow Integration

### 1. Design System Sync

```bash
#!/bin/bash
# sync-figma-styles.sh
echo "🔄 Syncing Figma styles..."

# Extract all mapped component frames
node scripts/figma-frame-extractor.js "$FIGMA_TOKEN"

# Generate updated theme
npm run generate-theme

# Update Storybook
npm run build-storybook

echo "✅ Figma sync complete!"
```

### 2. CI/CD Integration

```yaml
# .github/workflows/figma-sync.yml
name: Sync Figma Styles
on:
  schedule:
    - cron: '0 9 * * *' # Daily at 9 AM
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: node scripts/figma-frame-extractor.js ${{ secrets.FIGMA_TOKEN }}
      - run: npm run build-storybook
      - name: Create PR with updates
        # Auto-create PR if styles changed
```

## Benefits

✅ **Pixel-perfect accuracy** - Exact colors, spacing, typography from Figma  
✅ **Automated sync** - Keep React components in sync with design updates  
✅ **Component-specific** - Target individual components, not entire system  
✅ **State variants** - Extract different component states (hover, disabled, etc.)  
✅ **Type safety** - Generated TypeScript definitions  
✅ **Performance** - Only extract what you need  
✅ **Version control** - Track design changes over time  

## Tips

1. **Frame naming**: Use consistent naming in Figma for automatic mapping
2. **Component states**: Create separate frames for hover, disabled, loading states  
3. **Responsive design**: Create frames for different screen sizes
4. **Documentation**: Add frame descriptions in Figma for better auto-mapping
5. **Selective extraction**: Target specific frames rather than entire pages for better performance

This approach gives you precise control over which Figma designs map to which React components, ensuring perfect design-code consistency! 🎨→⚛️