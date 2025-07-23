import type { Meta, StoryObj } from '@storybook/react';
import { ListPageTemplate } from './ListPageTemplate';
import { Table, Tag, Avatar, Button } from 'antd';
import { PauseCircleOutlined, StopOutlined } from '@ant-design/icons';
import { Icon } from '../../../atoms/Icon';

const meta: Meta<typeof ListPageTemplate> = {
  title: 'Layout/Templates/ListPageTemplate',
  component: ListPageTemplate,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Template for list pages like Jobs, Workstations, etc. Includes search, filtering, and content area.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data for the table
const sampleJobs = [
  {
    key: '1',
    id: 'job-001',
    name: 'CFD Analysis - Wing Design',
    status: 'running',
    progress: 75,
    owner: 'john.doe@company.com',
    created: '2024-01-15 10:30:00',
    duration: '2h 15m',
  },
  {
    key: '2',
    id: 'job-002',
    name: 'Structural Analysis - Bridge',
    status: 'completed',
    progress: 100,
    owner: 'jane.smith@company.com',
    created: '2024-01-14 14:20:00',
    duration: '45m',
  },
  {
    key: '3',
    id: 'job-003',
    name: 'Heat Transfer Simulation',
    status: 'queued',
    progress: 0,
    owner: 'mike.johnson@company.com',
    created: '2024-01-16 09:15:00',
    duration: '-',
  },
];

const jobColumns = [
  {
    title: 'Job ID',
    dataIndex: 'id',
    key: 'id',
    width: 120,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    render: (status: string) => {
      const statusConfig = {
        running: { color: 'processing', text: 'Running' },
        completed: { color: 'success', text: 'Completed' },
        queued: { color: 'default', text: 'Queued' },
        failed: { color: 'error', text: 'Failed' },
      };
      const config = statusConfig[status as keyof typeof statusConfig];
      return <Tag color={config?.color}>{config?.text}</Tag>;
    },
  },
  {
    title: 'Owner',
    dataIndex: 'owner',
    key: 'owner',
    width: 200,
    render: (owner: string) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Avatar size="small">{owner.charAt(0).toUpperCase()}</Avatar>
        {owner}
      </div>
    ),
  },
  {
    title: 'Created',
    dataIndex: 'created',
    key: 'created',
    width: 160,
  },
  {
    title: 'Duration',
    dataIndex: 'duration',
    key: 'duration',
    width: 100,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 150,
    render: () => (
      <div style={{ display: 'flex', gap: '8px' }}>
        <Button size="small" icon={<Icon name="PlayCircleOutlined" />} />
        <Button size="small" icon={<PauseCircleOutlined />} />
        <Button size="small" icon={<StopOutlined />} danger />
      </div>
    ),
  },
];

export const JobsList: Story = {
  args: {
    title: 'Jobs',
    description: 'Manage and monitor your simulation jobs',
    breadcrumbs: [
      { title: 'Projects', href: '/projects' },
      { title: 'My Project', href: '/projects/123' },
      { title: 'Jobs' },
    ],
    actions: [
      {
        key: 'create',
        label: 'Submit Job',
        type: 'primary',
        onClick: () => console.log('Create job'),
      },
    ],
    searchPlaceholder: 'Search jobs...',
    filters: [
      { key: 'all', label: 'All Jobs', value: 'all' },
      { key: 'running', label: 'Running', value: 'running' },
      { key: 'completed', label: 'Completed', value: 'completed' },
      { key: 'failed', label: 'Failed', value: 'failed' },
    ],
    children: (
      <Table
        columns={jobColumns}
        dataSource={sampleJobs}
        pagination={{
          total: 50,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} jobs`,
        }}
      />
    ),
  },
};

export const WorkstationsList: Story = {
  args: {
    title: 'Workstations',
    description: 'Manage your compute workstations and resources',
    actions: [
      {
        key: 'create',
        label: 'Launch Workstation',
        type: 'primary',
        onClick: () => console.log('Create workstation'),
      },
    ],
    searchPlaceholder: 'Search workstations...',
    filters: [
      { key: 'all', label: 'All', value: 'all' },
      { key: 'running', label: 'Running', value: 'running' },
      { key: 'stopped', label: 'Stopped', value: 'stopped' },
    ],
    children: (
      <div style={{ padding: '24px', textAlign: 'center', color: '#666' }}>
        <p>No workstations found. Launch your first workstation to get started.</p>
        <Button type="primary" style={{ marginTop: '16px' }}>
          Launch Workstation
        </Button>
      </div>
    ),
  },
};

export const WithTabs: Story = {
  args: {
    title: 'Project Resources',
    description: 'View and manage all project resources in one place',
    tabs: {
      activeKey: 'jobs',
      items: [
        { key: 'jobs', label: 'Jobs' },
        { key: 'workstations', label: 'Workstations' },
        { key: 'data', label: 'Data Files' },
        { key: 'results', label: 'Results' },
      ],
      onChange: (key: string) => console.log('Tab changed:', key),
    },
    searchPlaceholder: 'Search resources...',
    toolbarActions: (
      <Button type="text">
        Export All
      </Button>
    ),
    children: (
      <Table
        columns={jobColumns}
        dataSource={sampleJobs}
        pagination={false}
      />
    ),
  },
};

export const MinimalList: Story = {
  args: {
    title: 'Simple List',
    description: 'A minimal list template without filters or complex toolbar',
    showToolbar: false,
    children: (
      <div style={{ padding: '24px' }}>
        <p>This is a simple list template without the toolbar.</p>
        <p>Useful for simpler list views that don't need search or filtering.</p>
      </div>
    ),
  },
};