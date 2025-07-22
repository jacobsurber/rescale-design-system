import type { Meta, StoryObj } from '@storybook/react';
import { ResourceMetrics, ResourceMetric } from './ResourceMetrics';

/**
 * The ResourceMetrics component displays system resource usage with circular progress indicators.
 * It provides visual feedback for CPU, memory, storage, and network utilization with color-coded states.
 */
const meta: Meta<typeof ResourceMetrics> = {
  title: 'Components/Rescale/Resource Metrics',
  component: ResourceMetrics,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The ResourceMetrics component provides a comprehensive view of system resource utilization
using circular progress indicators with color-coded visual feedback.

## Features
- **Multiple Resource Types**: Supports CPU, Memory, Storage, and Network metrics
- **Color-Coded Status**: Green (healthy), Blue (moderate), Yellow (warning), Red (critical)
- **Animated Transitions**: Smooth value animations on mount and updates
- **Flexible Layouts**: Horizontal, vertical, and grid layout options
- **Detailed Information**: Current/total values with units
- **Card Styling**: Optional card presentation for better visual separation
- **Accessibility**: Proper ARIA labels and semantic structure

## Usage Guidelines
- **Green (0-49%)**: Healthy resource usage
- **Blue (50-74%)**: Moderate usage, within normal range  
- **Yellow (75-89%)**: High usage, may need attention
- **Red (90%+)**: Critical usage, immediate attention required

Use this component in dashboards, job detail views, and system monitoring interfaces.
        `,
      },
    },
  },
  argTypes: {
    metrics: {
      description: 'Array of resource metrics to display',
    },
    size: {
      control: 'select',
      options: ['small', 'default', 'large'],
      description: 'Size of the circular progress indicators',
    },
    layout: {
      control: 'select',
      options: ['horizontal', 'vertical', 'grid'],
      description: 'Layout orientation of the metrics',
    },
    showDetails: {
      control: 'boolean',
      description: 'Whether to show detailed current/total values',
    },
    animated: {
      control: 'boolean',
      description: 'Whether to animate values on mount',
    },
    animationDuration: {
      control: { type: 'number', min: 100, max: 2000, step: 100 },
      description: 'Animation duration in milliseconds',
    },
    asCards: {
      control: 'boolean',
      description: 'Whether to display metrics as cards',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample resource data
const sampleMetrics: ResourceMetric[] = [
  {
    type: 'cpu',
    usage: 65,
    current: '2.6 GHz',
    total: '4.0 GHz',
    unit: 'GHz',
  },
  {
    type: 'memory',
    usage: 42,
    current: '6.7 GB',
    total: '16 GB',
    unit: 'GB',
  },
  {
    type: 'storage',
    usage: 78,
    current: '780 GB',
    total: '1 TB',
    unit: 'GB',
  },
  {
    type: 'network',
    usage: 23,
    current: '23 MB/s',
    total: '100 MB/s',
    unit: 'MB/s',
  },
];

/**
 * Default resource metrics display with horizontal layout.
 */
export const Default: Story = {
  args: {
    metrics: sampleMetrics,
    size: 'default',
    layout: 'horizontal',
    showDetails: true,
    animated: true,
    animationDuration: 400,
    asCards: false,
  },
};

/**
 * Vertical layout - useful for sidebar or narrow containers.
 */
export const Vertical: Story = {
  args: {
    metrics: sampleMetrics,
    size: 'default',
    layout: 'vertical',
    showDetails: true,
    animated: true,
    asCards: false,
  },
};

/**
 * Grid layout - useful for dashboard cards.
 */
export const Grid: Story = {
  args: {
    metrics: sampleMetrics,
    size: 'default',
    layout: 'grid',
    showDetails: true,
    animated: true,
    asCards: false,
  },
};

/**
 * Card presentation with shadow and borders.
 */
export const AsCards: Story = {
  args: {
    metrics: sampleMetrics,
    size: 'default',
    layout: 'grid',
    showDetails: true,
    animated: true,
    asCards: true,
  },
};

/**
 * Small size variant for compact displays.
 */
export const Small: Story = {
  args: {
    metrics: sampleMetrics,
    size: 'small',
    layout: 'horizontal',
    showDetails: false,
    animated: true,
    asCards: false,
  },
};

/**
 * Large size variant for prominent displays.
 */
export const Large: Story = {
  args: {
    metrics: sampleMetrics,
    size: 'large',
    layout: 'horizontal',
    showDetails: true,
    animated: true,
    asCards: false,
  },
};

/**
 * High usage scenarios with warning colors.
 */
export const HighUsage: Story = {
  args: {
    metrics: [
      {
        type: 'cpu',
        usage: 85,
        current: '3.4 GHz',
        total: '4.0 GHz',
        unit: 'GHz',
      },
      {
        type: 'memory',
        usage: 92,
        current: '14.7 GB',
        total: '16 GB',
        unit: 'GB',
      },
      {
        type: 'storage',
        usage: 76,
        current: '760 GB',
        total: '1 TB',
        unit: 'GB',
      },
      {
        type: 'network',
        usage: 95,
        current: '95 MB/s',
        total: '100 MB/s',
        unit: 'MB/s',
      },
    ],
    size: 'default',
    layout: 'horizontal',
    showDetails: true,
    animated: true,
    asCards: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Resource metrics showing high usage with warning (yellow) and critical (red) states.',
      },
    },
  },
};

/**
 * Low usage with healthy green indicators.
 */
export const LowUsage: Story = {
  args: {
    metrics: [
      {
        type: 'cpu',
        usage: 15,
        current: '0.6 GHz',
        total: '4.0 GHz',
        unit: 'GHz',
      },
      {
        type: 'memory',
        usage: 25,
        current: '4.0 GB',
        total: '16 GB',
        unit: 'GB',
      },
      {
        type: 'storage',
        usage: 35,
        current: '350 GB',
        total: '1 TB',
        unit: 'GB',
      },
      {
        type: 'network',
        usage: 8,
        current: '8 MB/s',
        total: '100 MB/s',
        unit: 'MB/s',
      },
    ],
    size: 'default',
    layout: 'horizontal',
    showDetails: true,
    animated: true,
    asCards: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Resource metrics showing healthy low usage with green indicators.',
      },
    },
  },
};

/**
 * Custom colors and labels.
 */
export const CustomColors: Story = {
  args: {
    metrics: [
      {
        type: 'cpu',
        usage: 60,
        label: 'Processor',
        current: '2.4 GHz',
        total: '4.0 GHz',
        color: '#722ed1', // Purple
      },
      {
        type: 'memory',
        usage: 45,
        label: 'RAM',
        current: '7.2 GB',
        total: '16 GB',
        color: '#eb2f96', // Pink
      },
      {
        type: 'storage',
        usage: 70,
        label: 'Disk',
        current: '700 GB',
        total: '1 TB',
        color: '#fa541c', // Orange
      },
    ],
    size: 'default',
    layout: 'horizontal',
    showDetails: true,
    animated: true,
    asCards: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Resource metrics with custom colors and labels override.',
      },
    },
  },
};

/**
 * Without detailed information.
 */
export const WithoutDetails: Story = {
  args: {
    metrics: sampleMetrics,
    size: 'default',
    layout: 'horizontal',
    showDetails: false,
    animated: true,
    asCards: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Simplified view showing only percentages without current/total values.',
      },
    },
  },
};

/**
 * All layout variations side by side.
 */
export const AllLayouts: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h4 style={{ marginBottom: '16px' }}>Horizontal Layout:</h4>
        <ResourceMetrics
          metrics={sampleMetrics}
          layout="horizontal"
          showDetails={true}
          animated={false}
        />
      </div>
      <div>
        <h4 style={{ marginBottom: '16px' }}>Vertical Layout:</h4>
        <ResourceMetrics
          metrics={sampleMetrics}
          layout="vertical"
          showDetails={true}
          animated={false}
        />
      </div>
      <div>
        <h4 style={{ marginBottom: '16px' }}>Grid Layout:</h4>
        <ResourceMetrics
          metrics={sampleMetrics}
          layout="grid"
          showDetails={true}
          animated={false}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all available layout options.',
      },
    },
  },
};

/**
 * Single metric display.
 */
export const SingleMetric: Story = {
  args: {
    metrics: [sampleMetrics[0]], // Just CPU
    size: 'large',
    layout: 'vertical',
    showDetails: true,
    animated: true,
    asCards: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Single resource metric display - useful for focused monitoring.',
      },
    },
  },
};