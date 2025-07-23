# Migration Guide: From Ant Design to Rescale Design System

This guide helps you migrate from vanilla Ant Design to the Rescale Design System, highlighting breaking changes, new features, and recommended approaches.

## Overview

The Rescale Design System is built on top of Ant Design 5.x, providing:
- Pre-configured Rescale theming
- Extended component library
- Specialized Rescale components
- Enhanced TypeScript support
- Consistent design tokens

## Migration Steps

### 1. Update Dependencies

Replace Ant Design with the Rescale Design System:

```bash
# Remove old dependencies
npm uninstall antd @ant-design/icons

# Install Rescale Design System
npm install rescale-design-system @ant-design/icons styled-components
```

### 2. Update Imports

#### Component Imports

```jsx
// Before: Ant Design
import { Button, Table } from 'antd';
import { UserOutlined } from '@ant-design/icons';

// After: Rescale Design System  
import { Button, Table } from 'rescale-design-system';
import { UserOutlined } from '@ant-design/icons'; // Icons stay the same
```

#### Theme Imports

```jsx
// Before: Ant Design theme
import { ConfigProvider, theme } from 'antd';

const App = () => (
  <ConfigProvider theme={{ token: { colorPrimary: '#0066cc' } }}>
    <YourApp />
  </ConfigProvider>
);

// After: Rescale Design System
import { ThemeProvider } from 'rescale-design-system';

const App = () => (
  <ThemeProvider>
    <YourApp />
  </ThemeProvider>
);
```

### 3. Replace CSS Imports

```jsx
// Before: Ant Design CSS
import 'antd/dist/reset.css';

// After: Rescale Design System CSS
import 'rescale-design-system/dist/index.css';
```

### 4. Update Theme Configuration

#### Basic Theme Migration

```jsx
// Before: Ant Design ConfigProvider
import { ConfigProvider } from 'antd';

const antdTheme = {
  token: {
    colorPrimary: '#0066cc',
    borderRadius: 6,
  },
  components: {
    Button: {
      borderRadius: 4,
    },
  },
};

<ConfigProvider theme={antdTheme}>
  <App />
</ConfigProvider>

// After: Rescale ThemeProvider
import { ThemeProvider, rescaleTheme } from 'rescale-design-system';

const customTheme = {
  ...rescaleTheme,
  token: {
    ...rescaleTheme.token,
    borderRadius: 6, // Override specific tokens
  },
  components: {
    ...rescaleTheme.components,
    Button: {
      ...rescaleTheme.components?.Button,
      borderRadius: 4,
    },
  },
};

<ThemeProvider theme={customTheme}>
  <App />
</ThemeProvider>
```

## Breaking Changes

### 1. Theme Structure Changes

The Rescale Design System includes pre-configured theme tokens. Some Ant Design customizations may need adjustment:

```jsx
// Before: Direct token override
const theme = {
  token: {
    colorPrimary: '#your-color',
  },
};

// After: Extend Rescale theme  
import { rescaleTheme } from 'rescale-design-system';

const theme = {
  ...rescaleTheme,
  token: {
    ...rescaleTheme.token,
    colorPrimary: '#your-color', // Override specific tokens
  },
};
```

### 2. CSS Variable Usage

The design system encourages CSS variables for consistency:

```css
/* Before: Hardcoded values */
.custom-component {
  color: #0066cc;
  padding: 16px;
  border-radius: 6px;
}

/* After: CSS variables */
.custom-component {
  color: var(--rescale-color-brand-blue);
  padding: var(--rescale-space-4);
  border-radius: var(--rescale-radius-base);
}
```

### 3. Component API Changes

Most component APIs remain the same, but some have additional props or enhanced features:

```jsx
// Enhanced components maintain backward compatibility
<Button type="primary">Same API</Button>

// New Rescale-specific components
<JobStatusIndicator status="running" progress={65} />
<ResourceMetrics metrics={resourceData} />
```

## Component Mapping

### Core Components (Unchanged APIs)

These components work exactly the same:

| Ant Design | Rescale Design System | Notes |
|------------|----------------------|-------|
| `Button` | `Button` | Same API, Rescale styling |
| `Input` | `Input` | Same API, enhanced styling |
| `Table` | `Table` | Same API, Rescale theming |
| `Card` | `Card` | Same API, consistent spacing |
| `Form` | `Form` | Same API, improved validation |

### Enhanced Components

These components have additional features:

| Component | New Features |
|-----------|--------------|
| `Select` | Enhanced styling, better mobile support |
| `DatePicker` | Rescale theme integration |
| `Upload` | Improved progress indicators |

### New Rescale Components

Components specific to Rescale use cases:

| Component | Purpose |
|-----------|---------|
| `JobStatusIndicator` | Display job status with progress |
| `SoftwareLogoGrid` | Show available software packages |
| `ResourceMetrics` | Display system resource usage |
| `WorkspaceSelector` | Workspace selection dropdown |
| `QuickActions` | Action button groups |
| `AssistantChat` | AI assistant chat interface |

## CSS Migration

### 1. Replace Ant Design CSS Classes

```css
/* Before: Ant Design classes */
.ant-btn-custom {
  background: #0066cc;
}

.ant-card-custom {
  border-radius: 8px;
}

/* After: Rescale variables */
.rescale-btn-custom {
  background: var(--rescale-color-brand-blue);
}

.rescale-card-custom {
  border-radius: var(--rescale-radius-md);
}
```

### 2. Update Custom Component Styling

```jsx
// Before: Custom styled components
import styled from 'styled-components';

const CustomButton = styled.button`
  background: #0066cc;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
`;

// After: Using Rescale tokens
const CustomButton = styled.button`
  background: var(--rescale-color-brand-blue);
  color: var(--rescale-color-white);
  padding: var(--rescale-space-2) var(--rescale-space-4);
  border-radius: var(--rescale-radius-base);
  border: none;
  
  &:hover {
    background: var(--rescale-color-brand-blue-dark);
  }
`;
```

## TypeScript Migration

### 1. Update Type Imports

```typescript
// Before: Ant Design types
import type { ButtonProps, TableProps } from 'antd';

// After: Rescale Design System types  
import type { ButtonProps, TableProps } from 'rescale-design-system';

// New Rescale component types
import type { 
  JobStatusIndicatorProps,
  ResourceMetric,
  SoftwareItem 
} from 'rescale-design-system';
```

### 2. Enhanced Type Safety

The design system provides enhanced TypeScript support:

```typescript
// Better prop type checking
interface MyComponentProps {
  status: JobStatusIndicatorProps['status']; // 'running' | 'completed' | 'failed' | etc.
  metrics: ResourceMetric[]; // Fully typed resource metrics
}

// Theme type safety
import type { RescaleTheme } from 'rescale-design-system';

const customTheme: RescaleTheme = {
  // Fully typed theme configuration
};
```

## Common Migration Issues

### 1. Missing CSS Variables

**Issue**: Styles not applying correctly

**Solution**: Ensure CSS variables are imported:

```jsx
// Add this import at the root of your app
import 'rescale-design-system/dist/index.css';
```

### 2. Theme Override Conflicts

**Issue**: Custom theme not applying

**Solution**: Extend the base Rescale theme:

```jsx
// Instead of replacing the entire theme
const theme = {
  token: { colorPrimary: '#custom' }, // May lose Rescale defaults
};

// Extend the Rescale theme
import { rescaleTheme } from 'rescale-design-system';

const theme = {
  ...rescaleTheme,
  token: {
    ...rescaleTheme.token,
    colorPrimary: '#custom', // Preserves Rescale defaults
  },
};
```

### 3. Component Styling Differences

**Issue**: Components look different after migration

**Solution**: Review and update custom CSS:

```css
/* Before: Overriding Ant Design styles */
.ant-btn {
  height: 40px;
}

/* After: Using Rescale theme or CSS variables */
.rescale-btn {
  height: var(--rescale-control-height);
}

/* Or configure through theme */
```

```jsx
const theme = {
  ...rescaleTheme,
  token: {
    ...rescaleTheme.token,
    controlHeight: 40,
  },
};
```

## Testing Migration

### 1. Visual Regression Testing

Compare before/after screenshots of key components:

```jsx
// Test key pages/components
const testComponents = [
  'LoginPage',
  'Dashboard',  
  'JobsList',
  'UserProfile',
];

testComponents.forEach(component => {
  test(`${component} visual regression`, () => {
    // Screenshot comparison test
  });
});
```

### 2. Component Functionality Testing

Ensure all interactive components work correctly:

```jsx
test('Button onClick still works', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  
  fireEvent.click(screen.getByText('Click me'));
  expect(handleClick).toHaveBeenCalled();
});
```

### 3. Theme Application Testing

Verify custom themes are applied:

```jsx
test('Custom theme applies correctly', () => {
  const customTheme = {
    ...rescaleTheme,
    token: { ...rescaleTheme.token, colorPrimary: '#ff0000' },
  };
  
  render(
    <ThemeProvider theme={customTheme}>
      <Button type="primary">Test</Button>
    </ThemeProvider>
  );
  
  // Verify theme application
});
```

## Gradual Migration Strategy

### Phase 1: Setup (Week 1)
1. Install Rescale Design System
2. Update main App component with ThemeProvider
3. Import CSS variables
4. Test basic functionality

### Phase 2: Core Components (Week 2-3)
1. Migrate common components (Button, Input, Card)
2. Update theme configuration  
3. Test critical user flows

### Phase 3: Advanced Components (Week 4)
1. Migrate complex components (Table, Form, Select)
2. Add Rescale-specific components where applicable
3. Update custom styling to use CSS variables

### Phase 4: Polish (Week 5)
1. Review and optimize theme customizations
2. Update documentation
3. Comprehensive testing
4. Performance optimization

## Migration Checklist

- [ ] Dependencies updated
- [ ] CSS imports updated  
- [ ] ThemeProvider implemented
- [ ] Component imports updated
- [ ] Custom themes migrated
- [ ] CSS variables implemented
- [ ] TypeScript types updated
- [ ] Tests updated and passing
- [ ] Visual regression testing completed
- [ ] Documentation updated
- [ ] Performance benchmarking completed

## Getting Help

If you encounter issues during migration:

1. Check the [Component Documentation](./components.md)
2. Review [Theme Customization Guide](./theme-customization.md)
3. Search [GitHub Issues](https://github.com/rescale/design-system/issues)
4. Ask in the internal Slack channel: #rescale-design-system
5. Contact the Design System team: design-system@rescale.com

## Post-Migration Benefits

After successful migration, you'll have:

- **Consistent Design**: Automatic Rescale branding and theming
- **Enhanced Components**: New Rescale-specific components  
- **Better Maintenance**: Centralized design system updates
- **Improved Development**: Better TypeScript support and documentation
- **Future-Proof**: Easy updates and new feature adoption