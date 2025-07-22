import type { Meta, StoryObj } from '@storybook/react';
import { ThemeExample } from './ThemeExample';

const meta = {
  title: 'Atoms/ThemeExample',
  component: ThemeExample,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Example component demonstrating the useRescaleTheme hook and CSS variables usage.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ThemeExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithWrapper: Story = {
  render: () => (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <ThemeExample />
    </div>
  ),
};