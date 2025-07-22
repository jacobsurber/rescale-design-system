import type { Preview } from '@storybook/react';
import { create } from '@storybook/theming/create';
import '../src/theme/cssVariables.css';
import '../src/index.css';

// Custom Rescale theme for Storybook
const rescaleTheme = create({
  base: 'light',
  brandTitle: 'Rescale Design System',
  brandUrl: 'https://rescale.com',
  brandImage: undefined, // Add logo URL here if available
  brandTarget: '_self',

  // Colors
  colorPrimary: '#0066cc', // Rescale blue
  colorSecondary: '#1890ff',

  // UI colors
  appBg: '#ffffff',
  appContentBg: '#ffffff',
  appPreviewBg: '#ffffff',
  appBorderColor: '#e8e9ea',
  appBorderRadius: 8,

  // Fonts
  fontBase: '"Segoe UI", system-ui, -apple-system, "San Francisco", "Helvetica Neue", sans-serif',
  fontCode: 'Monaco, "Fira Code", "Consolas", monospace',

  // Text colors
  textColor: '#2c3e50',
  textInverseColor: '#ffffff',

  // Toolbar default and active colors
  barTextColor: '#999999',
  barSelectedColor: '#0066cc',
  barHoverColor: '#0066cc',
  barBg: '#ffffff',

  // Form colors
  inputBg: '#ffffff',
  inputBorder: '#d9d9d9',
  inputTextColor: '#2c3e50',
  inputBorderRadius: 6,
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      theme: rescaleTheme,
      toc: true,
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'gray',
          value: '#f5f5f5',
        },
        {
          name: 'dark',
          value: '#2c3e50',
        },
      ],
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1200px',
            height: '900px',
          },
        },
        large: {
          name: 'Large Desktop',
          styles: {
            width: '1440px',
            height: '1024px',
          },
        },
      },
    },
    // Organization and ordering
    options: {
      storySort: {
        order: [
          'Introduction',
          ['Welcome', 'Getting Started', 'Design Tokens'],
          'Design System',
          ['Colors', 'Typography', 'Spacing', 'Breakpoints'],
          'Components',
          [
            'Atoms',
            'Molecules', 
            'Organisms',
            'Rescale',
            ['Job Status', 'Software Grid', 'Resource Metrics', 'Workspace Selector', 'Quick Actions', 'Assistant Chat'],
            'Navigation',
            'Layout',
            'Forms',
            'Display',
            'Cards',
            'Templates',
          ],
          'Examples',
          'Guides',
        ],
      },
    },
    // Accessibility testing
    a11y: {
      element: '#storybook-root',
      config: {},
      options: {},
      manual: true,
    },
  },
  // Global decorators
  decorators: [
    (Story) => (
      <div style={{ padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default preview;