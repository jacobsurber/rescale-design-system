import type { Meta, StoryObj } from '@storybook/react';
import { LoadingSpinner } from './LoadingSpinner';
import { MotionProvider } from '../../../providers/MotionProvider';

const meta: Meta<typeof LoadingSpinner> = {
  title: 'Atoms/LoadingSpinner',
  component: LoadingSpinner,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <MotionProvider>
        <div style={{ padding: '20px', position: 'relative' }}>
          <Story />
        </div>
      </MotionProvider>
    ),
  ],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    color: {
      control: { type: 'color' },
    },
    overlay: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof LoadingSpinner>;

export const Default: Story = {
  args: {
    size: 'medium',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
  },
};

export const CustomSize: Story = {
  args: {
    size: 48,
  },
};

export const CustomColor: Story = {
  args: {
    color: '#52c41a',
    size: 'large',
  },
};

export const WithOverlay: Story = {
  args: {
    overlay: true,
    size: 'large',
  },
  decorators: [
    (Story) => (
      <MotionProvider>
        <div style={{ 
          position: 'relative',
          width: '300px',
          height: '200px',
          background: '#f5f5f5',
          border: '1px solid #d9d9d9',
          borderRadius: '6px',
          padding: '20px',
        }}>
          <h3>Content with loading overlay</h3>
          <p>This content is behind the spinner overlay.</p>
          <Story />
        </div>
      </MotionProvider>
    ),
  ],
};

export const MultipleSpinners: Story = {
  render: () => (
    <MotionProvider>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <LoadingSpinner size="small" />
        <LoadingSpinner size="medium" />
        <LoadingSpinner size="large" />
        <LoadingSpinner size={48} color="#ff4d4f" />
      </div>
    </MotionProvider>
  ),
};