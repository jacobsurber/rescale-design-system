# Getting Started with Rescale Design System

The Rescale Design System is a comprehensive component library built on top of Ant Design, specifically tailored for Rescale applications. It provides consistent UI components, design tokens, and patterns to accelerate development and ensure design consistency across all Rescale products.

## Installation

Install the design system package using npm or yarn:

```bash
npm install rescale-design-system
# or
yarn add rescale-design-system
```

### Peer Dependencies

The design system requires the following peer dependencies:

```bash
npm install react react-dom antd @ant-design/icons styled-components dayjs
```

## Setup

### 1. Theme Provider

Wrap your application with the `ThemeProvider` to enable the Rescale theme:

```jsx
import React from 'react';
import { ThemeProvider } from 'rescale-design-system';
import { App } from './App';

function Root() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}

export default Root;
```

### 2. CSS Variables

Import the CSS variables at the root of your application:

```jsx
// In your main index.js or App.js
import 'rescale-design-system/dist/index.css';
```

### 3. Using Components

Import and use components from the design system:

```jsx
import React from 'react';
import { Button, JobStatusIndicator, ResourceMetrics } from 'rescale-design-system';

function Dashboard() {
  return (
    <div>
      <Button type="primary">Create New Job</Button>
      
      <JobStatusIndicator 
        status="running" 
        progress={65} 
        duration="1h 23m" 
      />
      
      <ResourceMetrics 
        metrics={[
          { type: 'cpu', usage: 45, current: '1.8 GHz', total: '4.0 GHz' },
          { type: 'memory', usage: 67, current: '10.7 GB', total: '16 GB' }
        ]} 
      />
    </div>
  );
}
```

## Component Categories

The design system is organized into several categories:

### Atoms
Basic building blocks like buttons, inputs, and typography components.

```jsx
import { Button, Input } from 'rescale-design-system';
```

### Molecules
Combinations of atoms that form more complex UI patterns.

### Organisms
Complex components that combine multiple molecules and atoms.

### Layout
Components for page structure, grids, and spacing.

```jsx
import { MainLayout, Grid, Spacing } from 'rescale-design-system';
```

### Navigation
Components for navigation patterns.

```jsx
import { Sidebar, TopBar } from 'rescale-design-system';
```

### Forms
Enhanced form components with Rescale styling.

```jsx
import { DateRangePicker, EnhancedSelect } from 'rescale-design-system';
```

### Display
Components for displaying data and content.

```jsx
import { StatusTag } from 'rescale-design-system';
```

### Cards
Specialized card components for different content types.

```jsx
import { WorkflowCard } from 'rescale-design-system';
```

### Rescale Components
Rescale-specific components for specialized use cases.

```jsx
import { 
  JobStatusIndicator,
  SoftwareLogoGrid,
  ResourceMetrics,
  WorkspaceSelector,
  QuickActions,
  AssistantChat 
} from 'rescale-design-system';
```

## Design Tokens

Access design tokens through CSS variables:

```css
.custom-component {
  color: var(--rescale-color-brand-blue);
  padding: var(--rescale-space-4);
  border-radius: var(--rescale-radius-base);
  font-size: var(--rescale-font-size-base);
}
```

Or use them in styled-components:

```jsx
import styled from 'styled-components';

const CustomButton = styled.button`
  background: var(--rescale-color-brand-blue);
  color: var(--rescale-color-white);
  padding: var(--rescale-space-3) var(--rescale-space-4);
  border-radius: var(--rescale-radius-base);
  border: none;
  
  &:hover {
    background: var(--rescale-color-brand-blue-dark);
  }
`;
```

## TypeScript Support

The design system is built with TypeScript and exports all component types:

```typescript
import { 
  ButtonProps, 
  JobStatusIndicatorProps,
  ResourceMetric 
} from 'rescale-design-system';

interface MyComponentProps {
  status: JobStatusIndicatorProps['status'];
  metrics: ResourceMetric[];
}
```

## Next Steps

- Explore the [Component Documentation](./components.md) for detailed component APIs
- Learn about [Theme Customization](./theme-customization.md)
- Check out [Usage Examples](./examples.md)
- Review [Best Practices](./best-practices.md)
- See the [Migration Guide](./migration-guide.md) if upgrading from vanilla Ant Design

## Support

For questions, issues, or contributions:

- [GitHub Issues](https://github.com/rescale/design-system/issues)
- [Internal Slack Channel](#rescale-design-system)
- [Design System Team](mailto:design-system@rescale.com)