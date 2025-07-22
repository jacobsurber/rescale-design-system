import type { Preview } from '@storybook/react-vite'
import React from 'react'
import { RescaleThemeProvider } from '../src/theme'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#F8F9FA',
        },
        {
          name: 'white',
          value: '#FFFFFF',
        },
        {
          name: 'dark',
          value: '#212529',
        },
      ],
    },
  },
  decorators: [
    (Story) => (
      <RescaleThemeProvider>
        <Story />
      </RescaleThemeProvider>
    ),
  ],
};

export default preview;