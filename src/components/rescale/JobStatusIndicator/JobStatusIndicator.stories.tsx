import type { Meta, StoryObj } from '@storybook/react';
import { JobStatusIndicator } from './JobStatusIndicator';

/**
 * The JobStatusIndicator component displays the current status of a job with appropriate visual indicators,
 * progress animation, and duration information. It supports multiple states and sizes.
 */
const meta: Meta<typeof JobStatusIndicator> = {
  title: 'Components/Rescale/Job Status Indicator',
  component: JobStatusIndicator,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The JobStatusIndicator is a specialized component for displaying job status in Rescale applications.
It provides visual feedback through color-coded states, animated progress bars, and duration display.

## Features
- **Multiple States**: Supports running, completed, failed, warning, queued, and pending states
- **Animated Progress**: Smooth progress bar animation for running jobs
- **Duration Display**: Shows elapsed or total time for jobs
- **Responsive Design**: Adapts to different container sizes
- **Accessibility**: Proper ARIA labels and semantic markup

## Usage
Use this component in job lists, dashboards, and detail views to provide clear status information to users.
        `,
      },
    },
  },
  argTypes: {
    status: {
      control: 'select',
      options: ['running', 'completed', 'failed', 'warning', 'queued', 'pending'],
      description: 'Current status of the job',
    },
    progress: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Progress percentage (0-100) - only applicable for running jobs',
    },
    duration: {
      control: 'text',
      description: 'Duration string to display (e.g., "2h 30m", "45 seconds")',
    },
    animated: {
      control: 'boolean',
      description: 'Whether to animate the progress bar',
    },
    size: {
      control: 'select',
      options: ['small', 'default', 'large'],
      description: 'Size variant of the component',
    },
    showDetails: {
      control: 'boolean',
      description: 'Whether to show additional details',
    },
    message: {
      control: 'text',
      description: 'Additional message to display',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default job status indicator showing a running job with progress.
 */
export const Default: Story = {
  args: {
    status: 'running',
    progress: 65,
    duration: '1h 23m',
    animated: true,
    size: 'default',
    showDetails: true,
  },
};

/**
 * Running job with animated progress bar.
 */
export const Running: Story = {
  args: {
    status: 'running',
    progress: 45,
    duration: '45m 12s',
    animated: true,
    showDetails: true,
    message: 'Processing simulation...',
  },
};

/**
 * Successfully completed job.
 */
export const Completed: Story = {
  args: {
    status: 'completed',
    duration: '2h 15m',
    showDetails: true,
    message: 'Job completed successfully',
  },
};

/**
 * Failed job with error indication.
 */
export const Failed: Story = {
  args: {
    status: 'failed',
    duration: '35m 8s',
    showDetails: true,
    message: 'Job failed due to insufficient resources',
  },
};

/**
 * Job with warning status.
 */
export const Warning: Story = {
  args: {
    status: 'warning',
    duration: '1h 52m',
    showDetails: true,
    message: 'Job completed with warnings',
  },
};

/**
 * Job in queue waiting to start.
 */
export const Queued: Story = {
  args: {
    status: 'queued',
    duration: '5m 30s',
    showDetails: true,
    message: 'Waiting for available resources',
  },
};

/**
 * Pending job waiting for user action.
 */
export const Pending: Story = {
  args: {
    status: 'pending',
    showDetails: true,
    message: 'Waiting for user approval',
  },
};

/**
 * Small size variant - useful for compact layouts.
 */
export const Small: Story = {
  args: {
    status: 'running',
    progress: 30,
    duration: '15m',
    size: 'small',
    animated: true,
  },
};

/**
 * Large size variant - useful for prominent displays.
 */
export const Large: Story = {
  args: {
    status: 'completed',
    duration: '3h 45m',
    size: 'large',
    showDetails: true,
    message: 'Large-scale CFD simulation completed',
  },
};

/**
 * Multiple job statuses shown together.
 */
export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <JobStatusIndicator status="running" progress={75} duration="2h 15m" message="Running simulation" />
      <JobStatusIndicator status="completed" duration="1h 30m" message="Job completed successfully" />
      <JobStatusIndicator status="failed" duration="45m" message="Job failed - out of memory" />
      <JobStatusIndicator status="warning" duration="2h 5m" message="Completed with warnings" />
      <JobStatusIndicator status="queued" duration="3m" message="Waiting in queue" />
      <JobStatusIndicator status="pending" message="Awaiting approval" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A showcase of all available job status states with their visual indicators.',
      },
    },
  },
};