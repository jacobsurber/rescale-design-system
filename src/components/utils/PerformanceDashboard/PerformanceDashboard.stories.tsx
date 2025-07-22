import type { Meta, StoryObj } from '@storybook/react';
import { PerformanceDashboard } from './PerformanceDashboard';
import { WebVitalsTracker } from '../WebVitalsTracker';
import { ErrorBoundary } from '../ErrorBoundary';

const meta: Meta<typeof PerformanceDashboard> = {
  title: 'Utils/PerformanceDashboard',
  component: PerformanceDashboard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A comprehensive performance monitoring dashboard showing Web Vitals, bundle analysis, and performance metrics.',
      },
    },
  },
  decorators: [
    (Story) => (
      <ErrorBoundary>
        <WebVitalsTracker debug={true} />
        <Story />
      </ErrorBoundary>
    ),
  ],
  argTypes: {
    showDetails: {
      control: { type: 'boolean' },
      description: 'Whether to show detailed performance analytics',
    },
    autoRefresh: {
      control: { type: 'boolean' },
      description: 'Whether to auto-refresh metrics',
    },
    refreshInterval: {
      control: { type: 'number', min: 10, max: 300 },
      description: 'Refresh interval in seconds',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PerformanceDashboard>;

export const Default: Story = {
  args: {
    showDetails: true,
    autoRefresh: false,
    refreshInterval: 30,
  },
};

export const MinimalView: Story = {
  args: {
    showDetails: false,
    autoRefresh: false,
  },
};

export const WithAutoRefresh: Story = {
  args: {
    showDetails: true,
    autoRefresh: true,
    refreshInterval: 60,
  },
};

export const WithCustomMetrics: Story = {
  args: {
    showDetails: true,
    performanceData: {
      renderTime: 8.2,
      bundleSize: 180.5,
      apiResponseTime: 95,
      memoryUsage: 15.7,
    },
  },
};

export const PoorPerformance: Story = {
  args: {
    showDetails: true,
    performanceData: {
      renderTime: 45.8,
      bundleSize: 1200.3,
      apiResponseTime: 2500,
      memoryUsage: 95.4,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Example showing dashboard with poor performance metrics to demonstrate warning states.',
      },
    },
  },
};

export const MobileView: Story = {
  args: {
    showDetails: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile-optimized view of the performance dashboard.',
      },
    },
  },
};