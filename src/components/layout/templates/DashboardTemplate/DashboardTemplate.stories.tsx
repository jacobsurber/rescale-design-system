import type { Meta, StoryObj } from '@storybook/react';
import { DashboardTemplate } from './DashboardTemplate';
import { Progress, List, Statistic } from 'antd';
import { DollarOutlined, UserOutlined, DatabaseOutlined, ClockCircleOutlined } from '@ant-design/icons';

const meta: Meta<typeof DashboardTemplate> = {
  title: 'Layout/Templates/DashboardTemplate',
  component: DashboardTemplate,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Template for dashboard pages with metrics and widgets.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleMetrics = [
  {
    key: 'active-jobs',
    title: 'Active Jobs',
    value: '24',
    unit: 'running',
    trend: 'up' as const,
    icon: <DatabaseOutlined />,
  },
  {
    key: 'compute-hours',
    title: 'Compute Hours',
    value: '1,247',
    unit: 'hours',
    trend: 'up' as const,
    icon: <ClockCircleOutlined />,
  },
  {
    key: 'monthly-cost',
    title: 'Monthly Cost',
    value: '$2,847',
    trend: 'down' as const,
    icon: <DollarOutlined />,
  },
  {
    key: 'active-users',
    title: 'Active Users',
    value: '18',
    unit: 'users',
    trend: 'up' as const,
    icon: <UserOutlined />,
  },
];

const recentJobs = [
  { id: 'job-001', name: 'CFD Wing Analysis', status: 'Completed', progress: 100 },
  { id: 'job-002', name: 'Structural Test', status: 'Running', progress: 67 },
  { id: 'job-003', name: 'Heat Transfer', status: 'Queued', progress: 0 },
  { id: 'job-004', name: 'Optimization', status: 'Running', progress: 23 },
];

const resourceUsage = [
  { name: 'CPU Usage', value: 72 },
  { name: 'Memory Usage', value: 45 },
  { name: 'Storage Used', value: 83 },
  { name: 'Network I/O', value: 38 },
];

const activityData = [
  'John Doe submitted a new CFD analysis job',
  'Jane Smith launched a new workstation',
  'Mike Johnson completed optimization run #12',
  'Sarah Wilson shared project results',
  'Tom Brown updated simulation parameters',
];

export const Default: Story = {
  args: {
    title: 'Project Dashboard',
    description: 'Overview of your project activity, resources, and performance',
    metrics: sampleMetrics,
    widgets: [
      {
        key: 'recent-jobs',
        title: 'Recent Jobs',
        span: 8,
        content: (
          <List
            dataSource={recentJobs}
            renderItem={(job) => (
              <List.Item>
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 500 }}>{job.name}</span>
                    <span style={{ color: '#666' }}>{job.status}</span>
                  </div>
                  <Progress percent={job.progress} size="small" />
                </div>
              </List.Item>
            )}
          />
        ),
      },
      {
        key: 'resource-usage',
        title: 'Resource Usage',
        span: 4,
        content: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {resourceUsage.map((resource) => (
              <div key={resource.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>{resource.name}</span>
                  <span>{resource.value}%</span>
                </div>
                <Progress percent={resource.value} size="small" />
              </div>
            ))}
          </div>
        ),
      },
      {
        key: 'activity-feed',
        title: 'Recent Activity',
        span: 6,
        content: (
          <List
            dataSource={activityData}
            renderItem={(item) => (
              <List.Item style={{ padding: '8px 0' }}>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  {item}
                </div>
              </List.Item>
            )}
          />
        ),
      },
      {
        key: 'storage-overview',
        title: 'Storage Overview',
        span: 6,
        content: (
          <div style={{ textAlign: 'center' }}>
            <Progress
              type="circle"
              percent={73}
              format={() => '73%\nUsed'}
              size={120}
            />
            <div style={{ marginTop: '16px', color: '#666' }}>
              <div>2.3 TB of 3.2 TB used</div>
              <div style={{ fontSize: '12px', marginTop: '4px' }}>
                890 GB remaining
              </div>
            </div>
          </div>
        ),
      },
    ],
  },
};

export const ExecutiveDashboard: Story = {
  args: {
    title: 'Executive Dashboard',
    description: 'High-level overview of organizational metrics and KPIs',
    actions: [
      {
        key: 'export',
        label: 'Export Report',
        onClick: () => console.log('Export report'),
      },
      {
        key: 'refresh',
        label: 'Refresh',
        type: 'primary',
        onClick: () => console.log('Refresh dashboard'),
      },
    ],
    metrics: [
      {
        key: 'total-revenue',
        title: 'Total Revenue',
        value: '$127K',
        unit: 'this month',
        trend: 'up' as const,
        variant: 'success',
        icon: <DollarOutlined />,
      },
      {
        key: 'active-projects',
        title: 'Active Projects',
        value: '42',
        trend: 'up' as const,
        icon: <DatabaseOutlined />,
      },
      {
        key: 'total-users',
        title: 'Total Users',
        value: '1,284',
        trend: 'up' as const,
        icon: <UserOutlined />,
      },
      {
        key: 'avg-job-time',
        title: 'Avg Job Time',
        value: '2.4h',
        trend: 'down' as const,
        variant: 'success',
        icon: <ClockCircleOutlined />,
      },
    ],
    widgets: [
      {
        key: 'revenue-chart',
        title: 'Revenue Trend',
        span: 8,
        height: 300,
        content: (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            [Revenue Chart Would Go Here]
          </div>
        ),
      },
      {
        key: 'top-customers',
        title: 'Top Customers',
        span: 4,
        content: (
          <List
            dataSource={[
              { name: 'Aerospace Corp', value: '$45K' },
              { name: 'Auto Dynamics', value: '$32K' },
              { name: 'Energy Solutions', value: '$28K' },
              { name: 'Research Lab', value: '$19K' },
            ]}
            renderItem={(customer) => (
              <List.Item>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span>{customer.name}</span>
                  <span style={{ fontWeight: 500 }}>{customer.value}</span>
                </div>
              </List.Item>
            )}
          />
        ),
      },
    ],
  },
};

export const MasonryLayout: Story = {
  args: {
    title: 'Masonry Dashboard',
    description: 'Dashboard with masonry layout for varied widget heights',
    layout: 'masonry',
    showMetrics: false,
    widgets: [
      {
        key: 'quick-stats',
        title: 'Quick Stats',
        content: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Statistic title="Jobs Today" value={15} />
            <Statistic title="Errors" value={2} valueStyle={{ color: '#cf1322' }} />
          </div>
        ),
      },
      {
        key: 'long-list',
        title: 'Recent Activity',
        content: (
          <List
            dataSource={activityData.concat([
              'Alice Cooper reviewed simulation results',
              'Bob Smith updated model parameters',
              'Carol Johnson exported data',
              'Dave Wilson started new analysis',
            ])}
            renderItem={(item) => (
              <List.Item style={{ padding: '4px 0', fontSize: '13px' }}>
                {item}
              </List.Item>
            )}
          />
        ),
      },
      {
        key: 'resource-chart',
        title: 'Resource Usage',
        content: (
          <div>
            {resourceUsage.map((resource) => (
              <div key={resource.name} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px' }}>{resource.name}</span>
                  <span style={{ fontSize: '13px' }}>{resource.value}%</span>
                </div>
                <Progress percent={resource.value} size="small" />
              </div>
            ))}
          </div>
        ),
      },
      {
        key: 'notifications',
        title: 'Notifications',
        content: (
          <div style={{ color: '#666', fontSize: '14px' }}>
            <p>No new notifications</p>
          </div>
        ),
      },
    ],
  },
};