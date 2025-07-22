import type { Preview } from '@storybook/react';
import { RescaleThemeProvider } from '../src/theme/ThemeProvider';
import { MotionProvider } from '../src/providers/MotionProvider';
import '../src/theme/cssVariables.css';
import '../src/index.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      toc: true,
    },
    options: {
      storySort: {
        order: [
          'Introduction',
          'Design Tokens',
          'Rescale Components',
          ['JobStatusIndicator', 'SoftwareLogoGrid', 'ResourceMetrics', 'WorkspaceSelector', 'QuickActions', 'AssistantChat'],
          'Atoms',
          'Molecules', 
          'Organisms',
          'Layout',
          'Navigation',
          'Forms',
          'Display',
          'Cards',
          'Templates',
          'Demo',
        ],
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark', 
          value: '#1f1f1f',
        },
        {
          name: 'rescale-blue',
          value: '#f0f8ff',
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
            height: '800px',
          },
        },
      },
    },
  },
  // Global decorators
  decorators: [
    (Story) => (
      <RescaleThemeProvider>
        <MotionProvider>
          <div style={{ padding: '1rem' }}>
            <Story />
          </div>
        </MotionProvider>
      </RescaleThemeProvider>
    ),
  ],
};

export default preview;