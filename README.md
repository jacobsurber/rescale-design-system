# 🎨 Rescale Design System

A comprehensive, production-ready design system built on top of Ant Design for Rescale applications. This library provides a cohesive set of React components, design tokens, and tools for building consistent user interfaces.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-blue)](https://reactjs.org/)
[![Ant Design](https://img.shields.io/badge/Ant%20Design-5.0-blue)](https://ant.design/)
[![Storybook](https://img.shields.io/badge/Storybook-8.6-ff4785)](https://storybook.js.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📋 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Architecture](#-architecture)
- [Components](#-components)
- [Design Tokens](#-design-tokens)
- [Figma Integration](#-figma-integration)
- [Development](#-development)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [API Documentation](#-api-documentation)

## ✨ Features

- **🎯 Atomic Design Architecture**: Components organized into atoms, molecules, organisms, and templates
- **🎨 Design Token System**: Comprehensive token system for colors, typography, spacing, and more
- **🔧 TypeScript First**: Full TypeScript support with detailed type definitions
- **📱 Responsive Design**: Mobile-first approach with responsive components
- **♿ Accessibility**: WCAG 2.1 AA compliant components with ARIA support
- **🎭 Animation System**: Smooth animations powered by Framer Motion
- **🎨 Figma Integration**: Tools for syncing with Figma design files
- **📚 Comprehensive Documentation**: Storybook with interactive examples
- **🧪 Testing Suite**: Unit tests, accessibility tests, and visual regression testing
- **🚀 Performance Optimized**: Code splitting, lazy loading, and optimized bundles

## 🚀 Quick Start

### Installation

```bash
npm install rescale-design-system

# or with yarn
yarn add rescale-design-system

# or with pnpm
pnpm add rescale-design-system
```

### Basic Usage

```tsx
import React from 'react';
import { RescaleThemeProvider, Button } from 'rescale-design-system';
import 'rescale-design-system/dist/index.css';

function App() {
  return (
    <RescaleThemeProvider>
      <Button variant="primary" size="md">
        Click me!
      </Button>
    </RescaleThemeProvider>
  );
}

export default App;
```

### Theme Setup

Wrap your application with the theme provider to enable design tokens:

```tsx
import { RescaleThemeProvider } from 'rescale-design-system';
import rescaleTheme from 'rescale-design-system/theme';

function App() {
  return (
    <RescaleThemeProvider theme={rescaleTheme}>
      {/* Your app content */}
    </RescaleThemeProvider>
  );
}
```

## 🏗️ Architecture

The design system follows Atomic Design principles:

```
src/
├── components/
│   ├── atoms/          # Basic building blocks (Button, Icon, etc.)
│   ├── molecules/      # Simple component groups (FormInput, DatePicker, etc.)
│   ├── organisms/      # Complex components (AssistantChat, JobsTable, etc.)
│   └── templates/      # Page-level compositions
├── theme/              # Design tokens and theme configuration
├── hooks/              # Custom React hooks
├── utils/              # Utility functions and helpers
└── types/              # TypeScript type definitions
```

## 🧩 Components

### Atoms

Basic building blocks of the design system:

- **Button**: Versatile button component with multiple variants
- **Icon**: Icon wrapper supporting all Ant Design icons
- **Logo**: Software logo display component
- **LoadingSpinner**: Loading state indicator
- **Skeleton**: Content placeholder for loading states
- **StatusTag**: Status display component
- **AnimatedFeedback**: Interactive feedback animations

### Molecules

Composite components built from atoms:

- **DateRangePicker**: Date range selection component
- **EnhancedSelect**: Advanced select component with search
- **FormInput**: Form input with validation support
- **FileBrowser**: File system browser component
- **JobStatusIndicator**: Job status display
- **QuickActions**: Quick action button group
- **ResourceMetrics**: Resource usage display
- **VirtualTable**: Virtualized table for large datasets
- **WorkspaceSelector**: Workspace selection dropdown

### Organisms

Complex components combining multiple molecules:

- **AssistantChat**: AI assistant chat interface
- **JobsTable**: Jobs listing table
- **PerformanceDashboard**: Performance metrics dashboard
- **Sidebar**: Navigation sidebar
- **SoftwareLogoGrid**: Grid display of software logos
- **TopBar**: Application top navigation bar

### Templates

Page-level compositions:

- **DashboardTemplate**: Dashboard page layout
- **ListPageTemplate**: List view page layout
- **DetailPageTemplate**: Detail view page layout
- **FormPageTemplate**: Form page layout

## 🎨 Design Tokens

The design system uses a comprehensive token system:

### Color Tokens

```tsx
import { designTokens } from 'rescale-design-system';

// Primary colors
designTokens.colors.primary[500]  // Brand blue
designTokens.colors.primary[600]  // Darker blue

// Semantic colors
designTokens.colors.success[500]  // Success green
designTokens.colors.error[500]    // Error red
designTokens.colors.warning[500]  // Warning yellow

// Neutral colors
designTokens.colors.neutral[100]  // Light gray
designTokens.colors.neutral[900]  // Dark gray
```

### Typography Tokens

```tsx
// Font sizes
designTokens.typography.fontSize.xs   // 12px
designTokens.typography.fontSize.sm   // 14px
designTokens.typography.fontSize.base // 16px
designTokens.typography.fontSize.lg   // 18px

// Font weights
designTokens.typography.fontWeight.regular  // 400
designTokens.typography.fontWeight.medium   // 500
designTokens.typography.fontWeight.semibold // 600
```

### Spacing Tokens

```tsx
// Spacing scale
designTokens.spacing[0]   // 0px
designTokens.spacing[1]   // 4px
designTokens.spacing[2]   // 8px
designTokens.spacing[4]   // 16px
designTokens.spacing[8]   // 32px
```

## 🎨 Figma Integration

The design system includes powerful Figma MCP (Model Context Protocol) integration tools that work directly with the Figma desktop app:

### Setup Figma MCP Access

1. Install and open the Figma desktop application
2. Select the frame or component you want to extract from in Figma
3. Ensure the MCP server is available on your system

**No API tokens required!** The MCP integration works directly with your Figma desktop app.

### Available Tools

#### 🎨 Design Token Extractor

```bash
npm run figma:extract

# Interactive MCP-based CLI tool that extracts:
# - Colors and color styles from selected frames
# - Typography and text styles
# - Spacing tokens from frames
# - Component specifications
# - Real-time extraction from Figma desktop
```

#### 🎯 Colors-Only Extractor

```bash
npm run figma:colors

# Focused MCP color extraction with:
# - Live extraction from selected Figma frames
# - Organized color categories
# - Multiple export formats (CSS, JS, SCSS, JSON)
# - TypeScript definitions
# - Faster extraction for color workflows
```

#### 🚀 Figma-to-Storybook Sync

```bash
npm run figma:sync-storybook

# Complete MCP design system sync:
# - Generates Storybook stories from Figma selections
# - Creates organized color, typography, and spacing displays
# - Updates design token files in real-time
# - Auto-categorizes design elements from Figma
```

#### 🤖 Automated Sync (CI/CD Ready)

```bash
npm run figma:auto-sync

# MCP-based automated sync with smart features:
# - Real-time monitoring of Figma changes
# - Tracks sync history and metadata
# - Optional auto-commit to git
# - CI/CD pipeline integration
# - Watch mode for continuous sync
```

#### 🚀 MCP Advantages

The new MCP integration provides several advantages over traditional API-based extraction:

- **No API tokens needed** - Works directly with Figma desktop app
- **Real-time extraction** - Immediate access to selected frames
- **Live updates** - Changes in Figma reflect immediately
- **Better accuracy** - Direct access to Figma's rendering engine
- **Simplified workflow** - No need to manage file IDs or tokens

### Integration Documentation

For detailed usage instructions and advanced configuration:

- **[Figma Extractor Usage Guide](docs/figma-extractor-usage.md)** - Complete guide for all extraction tools
- **[Figma-to-Storybook Sync](docs/figma-storybook-sync.md)** - Automated design system synchronization
- **[Component Documentation](docs/)** - Individual component guides and examples

### Example Output

The Figma tools generate structured design tokens that integrate seamlessly with your components:

```tsx
// Generated tokens are immediately usable
import { colors, typography, spacing } from './src/tokens';

const StyledButton = styled.button`
  background-color: ${colors['primary-500']};
  font-family: ${typography['button-medium'].fontFamily};
  padding: ${spacing['spacing-12']} ${spacing['spacing-24']};
`;
```

## 🛠️ Development

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Setup

```bash
# Clone the repository
git clone https://github.com/jacobsurber/rescale-design-system.git

# Install dependencies
npm install

# Start Storybook development server
npm run storybook

# Build the library
npm run build:lib
```

### Available Scripts

```bash
# Development
npm run storybook        # Start Storybook dev server
npm run dev              # Start Vite dev server

# Building
npm run build:lib        # Build library for production
npm run build:storybook  # Build static Storybook
npm run build:all        # Build both library and Storybook

# Testing
npm run test             # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix linting issues
npm run format           # Format code with Prettier

# Figma MCP Integration
npm run figma:extract        # Interactive MCP design token extraction
npm run figma:colors         # Extract colors from Figma MCP
npm run figma:sync-storybook # MCP-based Storybook sync
npm run figma:auto-sync      # Automated MCP sync with CI/CD
npm run typecheck        # Check TypeScript types
```

## 🧪 Testing

### Unit Testing

Components are tested using Jest and React Testing Library:

```tsx
import { render, screen } from '@testing-library/react';
import { Button } from 'rescale-design-system';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

### Accessibility Testing

All components include accessibility tests:

```tsx
import { axe } from 'jest-axe';
import { render } from '@testing-library/react';
import { Button } from 'rescale-design-system';

test('should not have accessibility violations', async () => {
  const { container } = render(<Button>Accessible Button</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## 📚 Component Documentation

### Button Component

The most versatile component in the system:

```tsx
import { Button } from 'rescale-design-system';

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Danger</Button>
<Button variant="ghost">Ghost</Button>

// Sizes
<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>

// With icons
<Button icon={<PlusOutlined />}>Add Item</Button>
<Button iconOnly icon={<DeleteOutlined />} />

// Loading state
<Button loading loadingText="Processing...">Submit</Button>

// Full width
<Button block>Full Width Button</Button>
```

### Icon Component

Wrapper for Ant Design icons with additional features:

```tsx
import { Icon } from 'rescale-design-system';

// Basic usage
<Icon name="HomeOutlined" />

// Sizes
<Icon name="SettingOutlined" size="xs" />
<Icon name="SettingOutlined" size="2xl" />

// Colors
<Icon name="CheckCircleOutlined" color="success" />
<Icon name="CloseCircleOutlined" color="error" />

// Interactive
<Icon 
  name="EditOutlined" 
  clickable 
  onClick={() => console.log('Edit clicked')}
/>

// Spinning
<Icon name="LoadingOutlined" spin />
```

### AssistantChat Component

AI-powered chat interface:

```tsx
import { AssistantChat } from 'rescale-design-system';

const messages = [
  { id: '1', content: 'Hello!', sender: 'user', timestamp: new Date() },
  { id: '2', content: 'Hi there!', sender: 'assistant', timestamp: new Date() }
];

<AssistantChat
  title="Rescale Assistant"
  messages={messages}
  onSendMessage={(message) => console.log('Sent:', message)}
  placeholder="Type your message..."
  loading={false}
/>
```

### JobsTable Component

Advanced table for displaying job data:

```tsx
import { JobsTable } from 'rescale-design-system';

const jobs = [
  {
    id: '1',
    name: 'CFD Simulation',
    status: 'running',
    progress: 45,
    startTime: new Date(),
    cores: 16
  }
];

<JobsTable
  jobs={jobs}
  onJobClick={(job) => console.log('Clicked:', job)}
  loading={false}
  sortable
  filterable
/>
```

## 🎯 Best Practices

### 1. Always Use Theme Provider

Wrap your app with `RescaleThemeProvider` to ensure proper theming:

```tsx
<RescaleThemeProvider>
  <App />
</RescaleThemeProvider>
```

### 2. Import CSS

Don't forget to import the CSS file for proper styling:

```tsx
import 'rescale-design-system/dist/index.css';
```

### 3. Use Design Tokens

Always use design tokens instead of hardcoded values:

```tsx
// ❌ Bad
<div style={{ color: '#3B82F6' }}>Text</div>

// ✅ Good
<div style={{ color: designTokens.colors.primary[500] }}>Text</div>
```

### 4. Accessibility First

Use semantic HTML and ARIA attributes:

```tsx
<Button aria-label="Delete item" iconOnly icon={<DeleteOutlined />} />
```

### 5. Responsive Design

Use responsive props and utilities:

```tsx
<Grid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} gap={4}>
  {/* Grid items */}
</Grid>
```


## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow the existing component patterns
- Add tests for new functionality
- Update Storybook stories
- Document props with JSDoc comments

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built on top of [Ant Design](https://ant.design/)
- Animated with [Framer Motion](https://www.framer.com/motion/)
- Documented with [Storybook](https://storybook.js.org/)
- Inspired by [Atomic Design](https://atomicdesign.bradfrost.com/)

---

<p align="center">
  Made with ❤️ by the Rescale Design System Team
</p>