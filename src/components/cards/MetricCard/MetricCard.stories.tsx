import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
const action = (name: string) => () => console.log(name);
import {
  DollarOutlined,
  ClockCircleOutlined,
  BarChartOutlined,
  DatabaseOutlined,
  CloudOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { MetricCard } from './MetricCard';

const meta: Meta<typeof MetricCard> = {
  title: 'Cards/MetricCard',
  component: MetricCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# MetricCard Component

A versatile card component for displaying key metrics and statistics with support for trends, progress indicators, and multiple visual variants.

## Features
- **Multiple Variants**: Default, success, warning, error color schemes
- **Trend Indicators**: Up/down arrows with percentage changes
- **Progress Bars**: Optional progress visualization with custom colors
- **Icons & Info**: Support for custom icons and tooltip information
- **Clickable**: Optional click handling with hover states
- **Loading State**: Built-in loading skeleton
- **Accessibility**: Proper ARIA labels and keyboard navigation

## Use Cases
- **System Metrics**: CPU, memory, storage usage
- **Business KPIs**: Revenue, user counts, conversion rates
- **Performance Data**: Response times, throughput, error rates
- **Resource Utilization**: Compute hours, storage consumption

## Variants
- \`default\` - Rescale blue theme for standard metrics
- \`success\` - Green theme for positive metrics
- \`warning\` - Orange theme for metrics needing attention
- \`error\` - Red theme for critical metrics

## Usage
\`\`\`tsx
import { MetricCard } from '@/components/cards';

<MetricCard
  title="CPU Usage"
  value={75}
  unit="%"
  subtitle="8 vCPUs allocated"
  percentage={75}
  showProgress
  variant="warning"
  icon={<CpuOutlined />}
  trend="up"
  changePercentage={12}
  previousValue={63}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error'],
    },
    trend: {
      control: 'select',
      options: ['up', 'down', 'neutral'],
    },
    loading: {
      control: 'boolean',
    },
    showProgress: {
      control: 'boolean',
    },
    clickable: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof MetricCard>;

export const Default: Story = {
  args: {
    title: 'Total Jobs',
    value: 1247,
    subtitle: 'This month',
    variant: 'default',
    icon: <CloudOutlined />,
  },
};

export const WithProgress: Story = {
  args: {
    title: 'CPU Usage',
    value: 75,
    unit: '%',
    subtitle: '8 vCPUs allocated',
    percentage: 75,
    showProgress: true,
    variant: 'warning',
    icon: <BarChartOutlined />,
    info: 'Current CPU utilization across all instances',
  },
};

export const WithTrend: Story = {
  args: {
    title: 'Monthly Spend',
    value: '$12,450',
    subtitle: 'Compute costs',
    trend: 'up',
    changePercentage: 15,
    previousValue: '$10,826',
    variant: 'default',
    icon: <DollarOutlined />,
  },
};

export const ErrorVariant: Story = {
  args: {
    title: 'Failed Jobs',
    value: 23,
    subtitle: 'Last 7 days',
    trend: 'down',
    changePercentage: 8,
    previousValue: 31,
    variant: 'error',
    percentage: 12,
    showProgress: true,
  },
};

export const SuccessVariant: Story = {
  args: {
    title: 'Successful Jobs',
    value: 1224,
    subtitle: 'This month',
    trend: 'up',
    changePercentage: 23,
    previousValue: 994,
    variant: 'success',
    icon: <CloudOutlined />,
  },
};

export const Loading: Story = {
  args: {
    title: 'Storage Usage',
    value: 0,
    loading: true,
  },
};

export const Clickable: Story = {
  args: {
    title: 'Active Users',
    value: 342,
    subtitle: 'Currently online',
    clickable: true,
    onClick: action('card-clicked'),
    icon: <TeamOutlined />,
    info: 'Click to view user details',
  },
};

export const SystemMetrics: Story = {
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '16px',
      maxWidth: '1200px'
    }}>
      <MetricCard
        title="CPU Usage"
        value={68}
        unit="%"
        subtitle="16 vCPUs allocated"
        percentage={68}
        showProgress
        variant="default"
        icon={<BarChartOutlined />}
        trend="up"
        changePercentage={5}
        info="Average CPU utilization across all instances"
      />
      
      <MetricCard
        title="Memory Usage"
        value={42.8}
        unit="GB"
        subtitle="64 GB total"
        percentage={67}
        showProgress
        variant="warning"
        icon={<DatabaseOutlined />}
        trend="up"
        changePercentage={12}
        previousValue={38.2}
      />
      
      <MetricCard
        title="Storage Used"
        value={2.4}
        unit="TB"
        subtitle="10 TB allocated"
        percentage={24}
        showProgress
        variant="success"
        icon={<DatabaseOutlined />}
        trend="neutral"
        changePercentage={2}
      />
      
      <MetricCard
        title="Network I/O"
        value={156}
        unit="MB/s"
        subtitle="Current throughput"
        variant="default"
        trend="down"
        changePercentage={8}
        previousValue={170}
      />
    </div>
  ),
};

export const BusinessMetrics: Story = {
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '16px',
      maxWidth: '1200px'
    }}>
      <MetricCard
        title="Monthly Revenue"
        value="$48,230"
        subtitle="Subscription revenue"
        variant="success"
        icon={<DollarOutlined />}
        trend="up"
        changePercentage={18}
        previousValue="$40,876"
        clickable
        onClick={action('revenue-clicked')}
      />
      
      <MetricCard
        title="Active Jobs"
        value={156}
        subtitle="Currently running"
        variant="default"
        icon={<CloudOutlined />}
        trend="up"
        changePercentage={12}
        previousValue={139}
      />
      
      <MetricCard
        title="Avg. Job Runtime"
        value="4h 23m"
        subtitle="This week"
        variant="default"
        icon={<ClockCircleOutlined />}
        trend="down"
        changePercentage={7}
        previousValue="4h 42m"
      />
      
      <MetricCard
        title="New Users"
        value={89}
        subtitle="This month"
        variant="success"
        icon={<TeamOutlined />}
        trend="up"
        changePercentage={34}
        previousValue={66}
      />
    </div>
  ),
};

export const VariantShowcase: Story = {
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '16px',
      maxWidth: '1000px'
    }}>
      <MetricCard
        title="Default Variant"
        value={1234}
        subtitle="Standard metric display"
        variant="default"
        icon={<CloudOutlined />}
        trend="up"
        changePercentage={5}
      />
      
      <MetricCard
        title="Success Variant"
        value="98.5%"
        subtitle="System uptime"
        variant="success"
        percentage={98.5}
        showProgress
        trend="up"
        changePercentage={2}
      />
      
      <MetricCard
        title="Warning Variant"
        value={75}
        unit="%"
        subtitle="Resource usage"
        variant="warning"
        percentage={75}
        showProgress
        trend="up"
        changePercentage={15}
      />
      
      <MetricCard
        title="Error Variant"
        value={23}
        subtitle="Critical alerts"
        variant="error"
        trend="down"
        changePercentage={30}
        previousValue={33}
      />
    </div>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [clickCount, setClickCount] = React.useState(0);
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <MetricCard
          title="Interactive Counter"
          value={clickCount}
          subtitle="Click to increment"
          variant="default"
          clickable
          onClick={() => setClickCount(prev => prev + 1)}
          icon={<CloudOutlined />}
          info="This card responds to clicks"
        />
        
        <p style={{ color: '#666', fontSize: '14px' }}>
          Click the card above to see the value change. This demonstrates how MetricCard can be used for interactive dashboards.
        </p>
      </div>
    );
  },
};