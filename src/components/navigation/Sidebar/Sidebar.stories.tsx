import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
const action = (name: string) => () => console.log(name);
import {
  BankOutlined,
  BarChartOutlined,
  DeploymentUnitOutlined,
  MonitorOutlined,
  CloudOutlined,
  DashboardOutlined,
  FileTextOutlined,
  ApiOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Sidebar } from './Sidebar';

const meta: Meta<typeof Sidebar> = {
  title: 'Navigation/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Sidebar Component

A comprehensive navigation sidebar component for the Rescale platform with support for:

## Features
- **Fixed Width**: 240px expanded, 64px collapsed
- **Collapsible**: Toggle between expanded and collapsed states
- **Active States**: Highlighted active menu items with Rescale blue
- **Nested Menus**: Support for sub-menu items
- **User Profile**: Bottom section with user info and actions
- **Accessibility**: Full keyboard navigation and ARIA labels
- **Theming**: Uses Rescale design tokens

## Design Specs
- Width: 240px (expanded) / 64px (collapsed)
- Active background: #E8F2FF (Light Blue)
- Active text: #0066CC (Brand Blue)
- Item height: 44px
- Smooth transitions with easing

## Usage
\`\`\`tsx
import { Sidebar } from '@/components/navigation';

const menuItems = [
  { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: 'jobs', icon: <CloudOutlined />, label: 'Jobs' },
];

<Sidebar 
  items={menuItems}
  selectedKey="dashboard"
  onSelect={handleSelect}
  userProfile={{
    name: "John Doe",
    email: "john@rescale.com"
  }}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    collapsed: {
      control: 'boolean',
      description: 'Whether the sidebar is collapsed',
    },
    selectedKey: {
      control: 'text',
      description: 'Currently selected menu item key',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

const defaultMenuItems = [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
  },
  {
    key: 'jobs',
    icon: <CloudOutlined />,
    label: 'Jobs',
    children: [
      { key: 'all-jobs', label: 'All Jobs' },
      { key: 'running-jobs', label: 'Running Jobs' },
      { key: 'completed-jobs', label: 'Completed Jobs' },
    ],
  },
  {
    key: 'workflows',
    icon: <DeploymentUnitOutlined />,
    label: 'Workflows',
  },
  {
    key: 'analytics',
    icon: <BarChartOutlined />,
    label: 'Analytics',
    children: [
      { key: 'usage-reports', label: 'Usage Reports' },
      { key: 'cost-analysis', label: 'Cost Analysis' },
      { key: 'performance', label: 'Performance' },
    ],
  },
  {
    key: 'data',
    icon: <FileTextOutlined />,
    label: 'Data Management',
  },
  {
    key: 'monitoring',
    icon: <MonitorOutlined />,
    label: 'Monitoring',
  },
  {
    key: 'integrations',
    icon: <ApiOutlined />,
    label: 'Integrations',
  },
  {
    key: 'organization',
    icon: <BankOutlined />,
    label: 'Organization',
    children: [
      { key: 'users', label: 'Users' },
      { key: 'teams', label: 'Teams' },
      { key: 'permissions', label: 'Permissions' },
    ],
  },
  {
    key: 'settings',
    icon: <SettingOutlined />,
    label: 'Settings',
  },
];

const defaultUserProfile = {
  name: 'Dr. Sarah Chen',
  email: 'sarah.chen@rescale.com',
  role: 'Senior Engineer',
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c1c1?w=100&h=100&fit=crop&crop=face',
};

export const Default: Story = {
  args: {
    items: defaultMenuItems,
    selectedKey: 'dashboard',
    collapsed: false,
    userProfile: defaultUserProfile,
    onSelect: action('onSelect'),
    onCollapse: action('onCollapse'),
    onUserProfileClick: action('onUserProfileClick'),
    onLogoutClick: action('onLogoutClick'),
    onHelpClick: action('onHelpClick'),
  },
};

export const Collapsed: Story = {
  args: {
    ...Default.args,
    collapsed: true,
  },
};

export const WithActiveSubMenu: Story = {
  args: {
    ...Default.args,
    selectedKey: 'running-jobs',
  },
};

export const WithoutUserProfile: Story = {
  args: {
    items: defaultMenuItems,
    selectedKey: 'analytics',
    collapsed: false,
    onSelect: action('onSelect'),
    onCollapse: action('onCollapse'),
  },
};

export const MinimalMenu: Story = {
  args: {
    items: [
      {
        key: 'dashboard',
        icon: <DashboardOutlined />,
        label: 'Dashboard',
      },
      {
        key: 'jobs',
        icon: <CloudOutlined />,
        label: 'Jobs',
      },
      {
        key: 'settings',
        icon: <SettingOutlined />,
        label: 'Settings',
      },
    ],
    selectedKey: 'jobs',
    collapsed: false,
    userProfile: {
      name: 'John Doe',
      email: 'john@rescale.com',
    },
    onSelect: action('onSelect'),
    onCollapse: action('onCollapse'),
    onUserProfileClick: action('onUserProfileClick'),
    onLogoutClick: action('onLogoutClick'),
    onHelpClick: action('onHelpClick'),
  },
};

export const WithDisabledItems: Story = {
  args: {
    items: [
      {
        key: 'dashboard',
        icon: <DashboardOutlined />,
        label: 'Dashboard',
      },
      {
        key: 'jobs',
        icon: <CloudOutlined />,
        label: 'Jobs',
      },
      {
        key: 'analytics',
        icon: <BarChartOutlined />,
        label: 'Analytics',
        disabled: true,
      },
      {
        key: 'settings',
        icon: <SettingOutlined />,
        label: 'Settings',
        disabled: true,
      },
    ],
    selectedKey: 'dashboard',
    collapsed: false,
    userProfile: defaultUserProfile,
    onSelect: action('onSelect'),
    onCollapse: action('onCollapse'),
    onUserProfileClick: action('onUserProfileClick'),
    onLogoutClick: action('onLogoutClick'),
    onHelpClick: action('onHelpClick'),
  },
};

// Interactive story to demonstrate collapse functionality
export const Interactive: Story = {
  args: {
    ...Default.args,
  },
  render: (args) => {
    const [collapsed, setCollapsed] = React.useState(false);
    const [selectedKey, setSelectedKey] = React.useState('dashboard');

    return (
      <div style={{ height: '100vh', display: 'flex' }}>
        <Sidebar
          {...args}
          collapsed={collapsed}
          selectedKey={selectedKey}
          onCollapse={setCollapsed}
          onSelect={setSelectedKey}
        />
        <div style={{ 
          flex: 1, 
          padding: '24px', 
          background: '#f5f5f5',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <h2>Main Content Area</h2>
          <p>Selected: <strong>{selectedKey}</strong></p>
          <p>Collapsed: <strong>{collapsed ? 'Yes' : 'No'}</strong></p>
          <p>Click menu items to see selection changes. Use the collapse button to toggle sidebar width.</p>
        </div>
      </div>
    );
  },
};