import type { Meta, StoryObj } from '@storybook/react';
import { PageHeader } from './PageHeader';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const meta: Meta<typeof PageHeader> = {
  title: 'Layout/PageHeader',
  component: PageHeader,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Page header component with title, description, breadcrumbs, actions, and tabs.',
      },
    },
  },
  argTypes: {
    showDivider: {
      control: 'boolean',
      description: 'Whether to show a divider at the bottom',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Page Title',
    description: 'This is a description of the page content and what the user can expect to find here.',
  },
};

export const WithBreadcrumbs: Story = {
  args: {
    title: 'Job Details',
    description: 'View and manage job execution details, logs, and results.',
    breadcrumbs: [
      { title: 'Projects', href: '/projects' },
      { title: 'My Project', href: '/projects/123' },
      { title: 'Jobs', href: '/projects/123/jobs' },
      { title: 'Job #456' },
    ],
  },
};

export const WithActions: Story = {
  args: {
    title: 'Workstation Management',
    description: 'Manage your compute workstations and resources.',
    actions: [
      {
        key: 'edit',
        label: 'Edit',
        icon: <EditOutlined />,
        onClick: () => console.log('Edit clicked'),
      },
      {
        key: 'delete',
        label: 'Delete',
        icon: <DeleteOutlined />,
        danger: true,
        onClick: () => console.log('Delete clicked'),
      },
      {
        key: 'create',
        label: 'Create New',
        type: 'primary',
        icon: <PlusOutlined />,
        onClick: () => console.log('Create clicked'),
      },
    ],
  },
};

export const WithTabs: Story = {
  args: {
    title: 'Project Dashboard',
    description: 'Overview of project resources, jobs, and team collaboration.',
    tabs: {
      activeKey: 'overview',
      items: [
        {
          key: 'overview',
          label: 'Overview',
        },
        {
          key: 'jobs',
          label: 'Jobs',
        },
        {
          key: 'workstations',
          label: 'Workstations',
        },
        {
          key: 'team',
          label: 'Team',
        },
        {
          key: 'settings',
          label: 'Settings',
        },
      ],
      onChange: (key) => console.log('Tab changed:', key),
    },
  },
};

export const CompleteExample: Story = {
  args: {
    title: 'Simulation Results',
    description: 'Analyze simulation outputs, visualize data, and export results.',
    breadcrumbs: [
      { title: 'Projects', href: '/projects' },
      { title: 'Aerodynamics Study', href: '/projects/456' },
      { title: 'Job #789', href: '/projects/456/jobs/789' },
      { title: 'Results' },
    ],
    actions: [
      {
        key: 'export',
        label: 'Export',
        onClick: () => console.log('Export clicked'),
      },
      {
        key: 'share',
        label: 'Share',
        onClick: () => console.log('Share clicked'),
      },
      {
        key: 'download',
        label: 'Download All',
        type: 'primary',
        onClick: () => console.log('Download clicked'),
      },
    ],
    tabs: {
      activeKey: 'visualizations',
      items: [
        {
          key: 'summary',
          label: 'Summary',
        },
        {
          key: 'visualizations',
          label: 'Visualizations',
        },
        {
          key: 'data',
          label: 'Raw Data',
        },
        {
          key: 'logs',
          label: 'Logs',
        },
      ],
      onChange: (key) => console.log('Tab changed:', key),
    },
  },
};