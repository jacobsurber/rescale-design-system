# Theme Customization Guide

The Rescale Design System provides flexible theming capabilities through CSS variables and theme configuration. This guide covers how to customize the theme for your specific needs.

## Theme Structure

The theme system is built on three layers:

1. **CSS Variables** - Core design tokens
2. **Ant Design Theme** - Ant Design component styling
3. **Styled Components** - Custom component styling

## CSS Variables

### Using Existing Variables

The design system provides a comprehensive set of CSS variables for all design tokens:

```css
:root {
  /* Colors */
  --rescale-color-brand-blue: #0066cc;
  --rescale-color-light-blue: #e6f3ff;
  --rescale-color-success: #52c41a;
  --rescale-color-warning: #faad14;
  --rescale-color-error: #f5222d;
  
  /* Spacing */
  --rescale-space-1: 4px;
  --rescale-space-2: 8px;
  --rescale-space-3: 12px;
  --rescale-space-4: 16px;
  
  /* Typography */
  --rescale-font-size-xs: 12px;
  --rescale-font-size-sm: 14px;
  --rescale-font-size-base: 16px;
  
  /* And many more... */
}
```

### Overriding Variables

To customize the theme, override CSS variables in your application:

```css
/* styles/theme-overrides.css */
:root {
  /* Custom brand colors */
  --rescale-color-brand-blue: #1890ff;
  --rescale-color-light-blue: #e6f7ff;
  
  /* Custom spacing scale */
  --rescale-space-base: 6px; /* Changes base spacing from 4px to 6px */
  
  /* Custom typography */
  --rescale-font-family-base: "Inter", sans-serif;
  --rescale-font-size-base: 15px;
}
```

Import these overrides after importing the design system:

```jsx
// index.js
import 'rescale-design-system/dist/index.css';
import './styles/theme-overrides.css'; // Your customizations
```

## ThemeProvider Configuration

### Basic Configuration

Configure the theme through the `ThemeProvider`:

```jsx
import { ThemeProvider, rescaleTheme } from 'rescale-design-system';

const customTheme = {
  ...rescaleTheme,
  token: {
    ...rescaleTheme.token,
    colorPrimary: '#1890ff',
    borderRadius: 8,
    fontSize: 15,
  },
  components: {
    ...rescaleTheme.components,
    Button: {
      borderRadius: 6,
      fontWeight: 500,
    },
  },
};

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

### Advanced Configuration

Create a complete custom theme configuration:

```jsx
import { ThemeProvider } from 'rescale-design-system';

const advancedTheme = {
  token: {
    // Color tokens
    colorPrimary: '#722ed1', // Custom primary color
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#f5222d',
    colorInfo: '#1890ff',
    
    // Border tokens  
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 4,
    
    // Spacing tokens
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,
    
    // Typography tokens
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeSM: 12,
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    
    // Layout tokens
    controlHeight: 36,
    controlHeightLG: 44,
    controlHeightSM: 28,
  },
  components: {
    // Button customizations
    Button: {
      borderRadius: 6,
      fontWeight: 500,
      primaryShadow: 'none',
    },
    
    // Card customizations  
    Card: {
      borderRadius: 12,
      paddingLG: 24,
    },
    
    // Table customizations
    Table: {
      borderRadius: 8,
      headerBg: '#fafafa',
    },
    
    // Input customizations
    Input: {
      borderRadius: 6,
      paddingBlock: 8,
    },
  },
  algorithm: undefined, // Use default algorithm
};

function App() {
  return (
    <ThemeProvider theme={advancedTheme}>
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

## Dark Theme

### Enabling Dark Theme

The design system supports dark theme through Ant Design's dark algorithm:

```jsx
import { ThemeProvider, rescaleTheme } from 'rescale-design-system';
import { theme } from 'antd';

const darkTheme = {
  ...rescaleTheme,
  algorithm: theme.darkAlgorithm,
  token: {
    ...rescaleTheme.token,
    // Dark theme specific overrides
    colorBgContainer: '#1f1f1f',
    colorBgElevated: '#262626',
  },
};

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

### Dynamic Theme Switching

Implement dynamic theme switching:

```jsx
import React, { useState, createContext, useContext } from 'react';
import { ThemeProvider, rescaleTheme } from 'rescale-design-system';
import { theme } from 'antd';

const ThemeContext = createContext();

const lightTheme = rescaleTheme;
const darkTheme = {
  ...rescaleTheme,
  algorithm: theme.darkAlgorithm,
};

function CustomThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  
  const toggleTheme = () => setIsDark(!isDark);
  
  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

// Theme toggle component
function ThemeToggle() {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  
  return (
    <button onClick={toggleTheme}>
      {isDark ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}
```

## Component-Specific Customization

### Styled Components Override

Override design system components with styled-components:

```jsx
import styled from 'styled-components';
import { Button as DSButton } from 'rescale-design-system';

const CustomButton = styled(DSButton)`
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 4px 15px 0 rgba(116, 79, 168, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px 0 rgba(116, 79, 168, 0.4);
  }
`;
```

### CSS-in-JS Override

```jsx
import { Button } from 'rescale-design-system';

function CustomStyledButton() {
  return (
    <Button
      style={{
        background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
        border: 'none',
        boxShadow: '0 4px 15px 0 rgba(116, 79, 168, 0.3)',
      }}
    >
      Custom Button
    </Button>
  );
}
```

## Brand-Specific Themes

### Creating Brand Themes

Create themes for different brands or products:

```jsx
// themes/rescale-cloud.js
export const rescaleCloudTheme = {
  token: {
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    fontFamily: '"Inter", sans-serif',
    borderRadius: 8,
  },
  components: {
    Button: {
      borderRadius: 6,
      fontWeight: 500,
    },
  },
};

// themes/rescale-on-premise.js  
export const rescaleOnPremiseTheme = {
  token: {
    colorPrimary: '#722ed1',
    colorSuccess: '#389e0d',
    fontFamily: '"Source Sans Pro", sans-serif',
    borderRadius: 4,
  },
  components: {
    Button: {
      borderRadius: 4,
      fontWeight: 600,
    },
  },
};
```

### Using Brand Themes

```jsx
import { ThemeProvider } from 'rescale-design-system';
import { rescaleCloudTheme } from './themes/rescale-cloud';

function CloudApp() {
  return (
    <ThemeProvider theme={rescaleCloudTheme}>
      {/* Cloud-specific styling */}
    </ThemeProvider>
  );
}
```

## Best Practices

### 1. Use CSS Variables for Global Changes

For system-wide changes like brand colors or spacing, use CSS variables:

```css
:root {
  --rescale-color-brand-blue: #your-brand-color;
  --rescale-space-base: 6px; /* Instead of default 4px */
}
```

### 2. Use Theme Configuration for Component Behavior

For component-specific changes, use theme configuration:

```jsx
const theme = {
  components: {
    Button: {
      borderRadius: 8,
      primaryShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
  },
};
```

### 3. Maintain Consistency

When customizing, maintain consistency with:
- Spacing scales (multiples of base unit)
- Color relationships (tints and shades)
- Typography hierarchy
- Border radius progression

### 4. Test Across Components

When making theme changes, test across all components to ensure:
- Proper contrast ratios
- Consistent spacing
- Readable typography
- Accessible color combinations

### 5. Document Custom Themes

Document your theme customizations:

```jsx
/**
 * Rescale Cloud Theme
 * 
 * Customizations:
 * - Primary color: #1890ff (Ant Blue-6)
 * - Border radius: 8px (more rounded)
 * - Font weight: 500 for buttons
 * 
 * Usage: For cloud-based applications
 */
export const rescaleCloudTheme = {
  // theme configuration
};
```

## Migration from Custom CSS

If you're migrating from custom CSS implementations:

### 1. Identify Custom Styles

Audit existing custom styles:

```css
/* Before: Custom CSS */
.custom-button {
  background: #1890ff;
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 500;
}
```

### 2. Convert to Theme Configuration

```jsx
// After: Theme configuration
const theme = {
  components: {
    Button: {
      borderRadius: 8,
      fontWeight: 500,
    },
  },
  token: {
    colorPrimary: '#1890ff',
    paddingContentHorizontal: 16,
    paddingContentVertical: 8,
  },
};
```

### 3. Use Design System Components

```jsx
// Replace custom components with design system components
import { Button } from 'rescale-design-system';

function MyComponent() {
  return <Button type="primary">Click me</Button>;
}
```