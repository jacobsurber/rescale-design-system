# Rescale Design System

A comprehensive React component library built on Ant Design, specifically designed for Rescale applications. The design system provides consistent UI components, design tokens, and patterns to accelerate development and ensure design consistency across all Rescale products.

## ✨ Features

- 🎨 **Pre-configured Rescale Theme** - Ready-to-use theme with Rescale branding
- 🧩 **Extensive Component Library** - 50+ components including specialized Rescale components
- 🚀 **Built on Ant Design 5.x** - Leverages the power and stability of Ant Design
- 💎 **Design Tokens** - Consistent spacing, colors, typography, and more
- 📱 **Responsive Design** - Mobile-first approach with breakpoint system
- 🔧 **TypeScript Support** - Full TypeScript definitions included
- 📚 **Comprehensive Documentation** - Storybook with interactive examples
- ♿ **Accessibility** - WCAG 2.1 compliant components
- 🎭 **Theming Support** - Easy customization and dark mode support

## 📦 Installation

```bash
npm install rescale-design-system
# or
yarn add rescale-design-system
```

### Peer Dependencies

```bash
npm install react react-dom antd @ant-design/icons styled-components dayjs
```

## 🚀 Quick Start

### 1. Setup Theme Provider

```jsx
import React from 'react';
import { ThemeProvider } from 'rescale-design-system';
import 'rescale-design-system/dist/index.css';

function App() {
  return (
    <ThemeProvider>
      <YourApplication />
    </ThemeProvider>
  );
}

export default App;
```

### 2. Use Components

```jsx
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

## 📁 Project Structure

```
src/
├── components/
│   ├── atoms/          # Basic building blocks (Button, Card, etc.)
│   ├── molecules/      # Combinations of atoms
│   ├── organisms/      # Complex components
│   ├── layout/         # Layout components
│   ├── navigation/     # Navigation components
│   ├── forms/          # Form components
│   ├── display/        # Display components
│   ├── cards/          # Card components
│   ├── templates/      # Page layouts
│   └── rescale/        # Rescale-specific components
├── theme/
│   ├── cssVariables.css    # CSS design tokens
│   ├── rescaleTheme.ts     # Ant Design theme
│   └── tokens.ts           # Design token definitions
├── styles/
│   ├── breakpoints.ts      # Responsive breakpoints
│   └── global.css          # Global styles
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── demo/               # Demo applications
└── stories/            # Storybook documentation
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run build:all` | Build app + Storybook |
| `npm run preview` | Preview production build |
| `npm run storybook` | Launch Storybook |
| `npm run test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |
| `npm run lint` | Check code quality |
| `npm run lint:fix` | Fix linting issues |
| `npm run format` | Format code with Prettier |

## 🌐 Deployment

### GitHub Pages (Recommended)

This project is configured for automatic deployment on GitHub Pages:

1. Push your code to your GitHub repository
2. Enable GitHub Pages in repository settings
3. GitHub Actions will automatically:
   - Run tests and quality checks
   - Build Storybook
   - Deploy to GitHub Pages

The GitHub Actions workflow handles:
- Running the complete CI/CD pipeline
- Building and deploying Storybook
- Visual regression testing with Chromatic
- Accessibility testing

### Local Development

```bash
# Start development server
npm run dev

# Start Storybook
npm run storybook

# Build for production
npm run build:lib
```

## 🎨 Component Development

### Creating New Components

1. **Choose the right level** (atom, molecule, organism, template)
2. **Create component folder** with these files:
   ```
   ComponentName/
   ├── ComponentName.tsx      # Component implementation
   ├── ComponentName.stories.tsx  # Storybook stories
   ├── ComponentName.test.tsx     # Unit tests
   └── index.ts              # Exports
   ```

3. **Follow naming conventions**:
   - Use PascalCase for component names
   - Export both named and default exports
   - Include TypeScript interfaces

### Example Component Structure

```typescript
// Button.tsx
import React from 'react';
import { Button as AntButton } from 'antd';
import type { ButtonProps as AntButtonProps } from 'antd';

export interface ButtonProps extends AntButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'text';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', ...props }) => {
  return <AntButton {...props} />;
};

export default Button;
```

## 🧪 Testing

The project uses Jest and React Testing Library:

```typescript
// Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

## 📚 Storybook

Stories document component usage and provide interactive testing:

```typescript
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Atoms/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
  },
};
```

## 🎨 Theming

Customize the design system by modifying `src/styles/theme.ts`:

```typescript
export const theme: ThemeConfig = {
  token: {
    colorPrimary: '#1890ff',
    fontFamily: 'Inter, sans-serif',
    borderRadius: 6,
    // ... more tokens
  },
  components: {
    Button: {
      borderRadius: 6,
      // ... component-specific overrides
    },
  },
};
```

## 🔗 Links

- **GitHub Repository**: `https://github.com/jacobsurber/rescale-design-system`
- **GitHub Pages (Storybook)**: `https://jacobsurber.github.io/rescale-design-system`
- **Local Development**: `http://localhost:5173` (main app) | `http://localhost:6006` (Storybook)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Add tests and stories
4. Run linting: `npm run lint:fix`
5. Run tests: `npm test`
6. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.