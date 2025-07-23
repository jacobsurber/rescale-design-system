import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
const action = (name: string) => () => console.log(name);
import { ExclamationCircleOutlined, LoadingOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { StatusTag } from './StatusTag';

const meta: Meta<typeof StatusTag> = {
  title: 'Display/StatusTag',
  component: StatusTag,
  parameters: {
    docs: {
      description: {
        component: `
# StatusTag Component

A flexible status indicator component with multiple variants and sizes for displaying job statuses, workflow states, and other status information.

## Features
- **Multiple Variants**: Success, warning, error, info, processing, pending, etc.
- **Three Sizes**: Small (20px), default (24px), large (28px)
- **Icon Support**: Optional icons with proper sizing
- **Status Dots**: Optional colored dots for visual indication
- **Clickable**: Optional click handling with hover states
- **Accessibility**: Proper ARIA labels and keyboard navigation

## Status Variants
- \`success\` / \`completed\` - Green for successful states
- \`warning\` / \`queued\` - Orange for warning states  
- \`error\` / \`failed\` - Red for error states
- \`info\` / \`processing\` - Blue for informational states
- \`pending\` / \`cancelled\` - Gray for neutral states
- \`running\` - Rescale blue for active states

## Usage
\`\`\`tsx
import { StatusTag } from '@/components/display';
import { Icon } from '../Icon';

<StatusTag variant="success" showDot>
  Completed
</StatusTag>

<StatusTag 
  variant="running" 
  icon={<Icon name="PlayCircleOutlined" />}
  clickable
  onClick={handleClick}
>
  Running
</StatusTag>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'success',
        'warning', 
        'error',
        'info',
        'processing',
        'pending',
        'queued',
        'completed',
        'failed',
        'cancelled',
        'running',
      ],
    },
    size: {
      control: 'select',
      options: ['small', 'default', 'large'],
    },
    showDot: {
      control: 'boolean',
    },
    clickable: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof StatusTag>;

export const Default: Story = {
  args: {
    variant: 'success',
    children: 'Completed',
    size: 'default',
    showDot: false,
    clickable: false,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
      <StatusTag variant="success">Success</StatusTag>
      <StatusTag variant="completed">Completed</StatusTag>
      <StatusTag variant="warning">Warning</StatusTag>
      <StatusTag variant="queued">Queued</StatusTag>
      <StatusTag variant="error">Error</StatusTag>
      <StatusTag variant="failed">Failed</StatusTag>
      <StatusTag variant="info">Info</StatusTag>
      <StatusTag variant="processing">Processing</StatusTag>
      <StatusTag variant="pending">Pending</StatusTag>
      <StatusTag variant="cancelled">Cancelled</StatusTag>
      <StatusTag variant="running">Running</StatusTag>
    </div>
  ),
};

export const WithDots: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
      <StatusTag variant="success" showDot>Completed</StatusTag>
      <StatusTag variant="warning" showDot>Queued</StatusTag>
      <StatusTag variant="error" showDot>Failed</StatusTag>
      <StatusTag variant="info" showDot>Processing</StatusTag>
      <StatusTag variant="pending" showDot>Pending</StatusTag>
      <StatusTag variant="running" showDot>Running</StatusTag>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
      <StatusTag variant="success" icon={<Icon name="CheckCircleOutlined" />}>
        Completed
      </StatusTag>
      <StatusTag variant="warning" icon={<Icon name="ClockCircleOutlined" />}>
        Queued
      </StatusTag>
      <StatusTag variant="error" icon={<Icon name="CloseCircleOutlined" />}>
        Failed
      </StatusTag>
      <StatusTag variant="processing" icon={<LoadingOutlined spin />}>
        Processing
      </StatusTag>
      <StatusTag variant="running" icon={<Icon name="PlayCircleOutlined" />}>
        Running
      </StatusTag>
      <StatusTag variant="pending" icon={<PauseCircleOutlined />}>
        Pending
      </StatusTag>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <span style={{ width: '60px', fontSize: '12px', color: '#666' }}>Small:</span>
        <StatusTag variant="success" size="small">Completed</StatusTag>
        <StatusTag variant="warning" size="small" showDot>Queued</StatusTag>
        <StatusTag variant="running" size="small" icon={<Icon name="PlayCircleOutlined" />}>Running</StatusTag>
      </div>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <span style={{ width: '60px', fontSize: '12px', color: '#666' }}>Default:</span>
        <StatusTag variant="success" size="default">Completed</StatusTag>
        <StatusTag variant="warning" size="default" showDot>Queued</StatusTag>
        <StatusTag variant="running" size="default" icon={<Icon name="PlayCircleOutlined" />}>Running</StatusTag>
      </div>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <span style={{ width: '60px', fontSize: '12px', color: '#666' }}>Large:</span>
        <StatusTag variant="success" size="large">Completed</StatusTag>
        <StatusTag variant="warning" size="large" showDot>Queued</StatusTag>
        <StatusTag variant="running" size="large" icon={<Icon name="PlayCircleOutlined" />}>Running</StatusTag>
      </div>
    </div>
  ),
};

export const Clickable: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
      <StatusTag 
        variant="success" 
        clickable 
        onClick={action('success-clicked')}
      >
        Completed (Click me)
      </StatusTag>
      <StatusTag 
        variant="error" 
        clickable 
        icon={<Icon name="CloseCircleOutlined" />}
        onClick={action('error-clicked')}
      >
        Failed (Click me)
      </StatusTag>
      <StatusTag 
        variant="running" 
        clickable 
        showDot
        onClick={action('running-clicked')}
      >
        Running (Click me)
      </StatusTag>
    </div>
  ),
};

export const JobStatuses: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h4>Common Job Statuses</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        <StatusTag variant="queued" icon={<Icon name="ClockCircleOutlined" />} showDot>
          Queued
        </StatusTag>
        <StatusTag variant="running" icon={<Icon name="PlayCircleOutlined" />} showDot>
          Running
        </StatusTag>
        <StatusTag variant="processing" icon={<LoadingOutlined spin />} showDot>
          Post-processing
        </StatusTag>
        <StatusTag variant="completed" icon={<Icon name="CheckCircleOutlined" />} showDot>
          Completed
        </StatusTag>
        <StatusTag variant="failed" icon={<Icon name="CloseCircleOutlined" />} showDot>
          Failed
        </StatusTag>
        <StatusTag variant="cancelled" icon={<ExclamationCircleOutlined />} showDot>
          Cancelled
        </StatusTag>
      </div>
    </div>
  ),
};

export const WorkflowStatuses: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h4>Workflow Statuses</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        <StatusTag variant="pending" showDot>Draft</StatusTag>
        <StatusTag variant="info" showDot>Validated</StatusTag>
        <StatusTag variant="running" showDot>Executing</StatusTag>
        <StatusTag variant="success" showDot>Complete</StatusTag>
        <StatusTag variant="error" showDot>Error</StatusTag>
      </div>
    </div>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [selectedStatus, setSelectedStatus] = React.useState<string>('');

    const statuses = [
      { variant: 'queued' as const, label: 'Queued', icon: <Icon name="ClockCircleOutlined" /> },
      { variant: 'running' as const, label: 'Running', icon: <Icon name="PlayCircleOutlined" /> },
      { variant: 'completed' as const, label: 'Completed', icon: <Icon name="CheckCircleOutlined" /> },
      { variant: 'failed' as const, label: 'Failed', icon: <Icon name="CloseCircleOutlined" /> },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h4>Click to select a status:</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {statuses.map(({ variant, label, icon }) => (
            <StatusTag
              key={variant}
              variant={variant}
              icon={icon}
              showDot
              clickable
              onClick={() => setSelectedStatus(variant)}
              style={{
                boxShadow: selectedStatus === variant ? '0 0 0 2px #0066CC' : undefined,
              }}
            >
              {label}
            </StatusTag>
          ))}
        </div>
        {selectedStatus && (
          <p>Selected: <strong>{selectedStatus}</strong></p>
        )}
      </div>
    );
  },
};