import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';
import { MotionProvider } from '../../../providers/MotionProvider';

const meta: Meta<typeof Skeleton> = {
  title: 'Atoms/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <MotionProvider>
        <div style={{ padding: '20px', width: '400px' }}>
          <Story />
        </div>
      </MotionProvider>
    ),
  ],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['text', 'circular', 'rectangular', 'rounded'],
    },
    animate: {
      control: { type: 'boolean' },
    },
    lines: {
      control: { type: 'number', min: 1, max: 10 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  args: {
    width: '100%',
    height: '20px',
    variant: 'rectangular',
    animate: true,
  },
};

export const Text: Story = {
  args: {
    variant: 'text',
    width: '200px',
  },
};

export const Circular: Story = {
  args: {
    variant: 'circular',
    width: 40,
    height: 40,
  },
};

export const Rounded: Story = {
  args: {
    variant: 'rounded',
    width: '100%',
    height: '120px',
  },
};

export const MultipleLines: Story = {
  args: {
    variant: 'text',
    lines: 3,
  },
};

export const NoAnimation: Story = {
  args: {
    animate: false,
    width: '100%',
    height: '60px',
  },
};

export const ProfileCard: Story = {
  render: () => (
    <MotionProvider>
      <div style={{ 
        width: '300px',
        padding: '20px',
        border: '1px solid #d9d9d9',
        borderRadius: '8px',
        background: '#fff',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <Skeleton variant="circular" width={48} height={48} />
          <div style={{ flex: 1 }}>
            <Skeleton variant="text" width="120px" />
            <Skeleton variant="text" width="200px" />
          </div>
        </div>
        <Skeleton variant="rounded" width="100%" height="200px" />
        <div style={{ marginTop: '16px' }}>
          <Skeleton variant="text" lines={3} />
        </div>
      </div>
    </MotionProvider>
  ),
};

export const TableSkeleton: Story = {
  render: () => (
    <MotionProvider>
      <div style={{ width: '500px' }}>
        {/* Table Header */}
        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          padding: '12px 0', 
          borderBottom: '1px solid #f0f0f0',
          marginBottom: '8px' 
        }}>
          <Skeleton variant="text" width="100px" />
          <Skeleton variant="text" width="150px" />
          <Skeleton variant="text" width="120px" />
          <Skeleton variant="text" width="80px" />
        </div>
        
        {/* Table Rows */}
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            gap: '16px', 
            padding: '12px 0', 
            borderBottom: '1px solid #f9f9f9' 
          }}>
            <Skeleton variant="text" width="100px" />
            <Skeleton variant="text" width="150px" />
            <Skeleton variant="text" width="120px" />
            <Skeleton variant="circular" width={24} height={24} />
          </div>
        ))}
      </div>
    </MotionProvider>
  ),
};