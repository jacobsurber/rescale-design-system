# Rescale Design System

A comprehensive React TypeScript design system built with Ant Design, Storybook, and modern development tools.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Launch Storybook
npm run storybook
```

## 📦 What's Included

- ⚛️ **React 19** with TypeScript
- 🎨 **Ant Design** with custom theming
- 💅 **Styled Components** for custom styling
- 📚 **Storybook** for component documentation
- 🧪 **Jest + React Testing Library** for testing
- ⚡ **Vite** for fast builds and HMR
- 🔧 **ESLint + Prettier** for code quality
- 🏗️ **Atomic Design** component structure

## 📁 Project Structure

```
src/
├── components/
│   ├── atoms/          # Basic building blocks (Button, Card, etc.)
│   ├── molecules/      # Combinations of atoms
│   ├── organisms/      # Complex components
│   └── templates/      # Page layouts
├── styles/
│   ├── theme.ts        # Ant Design theme configuration
│   └── global.css      # Global styles
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── pages/              # Page components
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

### Vercel (Recommended)

This project is configured for automatic deployment on Vercel:

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Vercel will automatically:
   - Build the main app and deploy to the root domain
   - Build Storybook and make it available at `/storybook`

The `vercel.json` configuration handles:
- Building both the main app and Storybook
- Routing Storybook to `/storybook` path
- Proper caching headers for assets

### Manual Deployment

```bash
# Build everything
npm run build:all

# The dist/ folder contains:
# - Main app files in the root
# - Storybook in dist/storybook/
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

- **Main App**: Your Vercel domain
- **Storybook**: `your-domain.vercel.app/storybook`
- **Repository**: Link to your GitHub repo

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Add tests and stories
4. Run linting: `npm run lint:fix`
5. Run tests: `npm test`
6. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.