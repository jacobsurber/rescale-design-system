import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
const action = (name: string) => () => console.log(name);
import { TopBar } from './TopBar';

const meta: Meta<typeof TopBar> = {
  title: 'Navigation/TopBar',
  component: TopBar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# TopBar Component

A responsive top navigation bar component for the Rescale platform featuring:

## Features
- **Fixed Height**: 56px as per design specifications
- **Breadcrumb Navigation**: Hierarchical navigation with clickable links
- **Search Functionality**: Global search with customizable placeholder
- **User Actions**: Notifications, help, AI assistant, and user profile
- **Responsive Design**: Adapts to mobile screens
- **Accessibility**: Full keyboard navigation and ARIA labels

## Design Specs
- Height: 56px
- Background: White with gray border
- Search width: 300px (desktop), 200px (tablet), hidden (mobile)
- Icon buttons: 32x32px with hover states

## Usage
\`\`\`tsx
import { TopBar } from '@/components/navigation';

<TopBar
  breadcrumbItems={[
    { title: 'Jobs', href: '/jobs' },
    { title: 'Running Jobs' },
  ]}
  searchPlaceholder="Search jobs..."
  userAvatar="/avatar.jpg"
  userName="Sarah Chen"
  notificationCount={5}
  onSearch={handleSearch}
  onUserClick={handleUserClick}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    notificationCount: {
      control: { type: 'number', min: 0, max: 99 },
      description: 'Number of unread notifications',
    },
    showAssistant: {
      control: 'boolean',
      description: 'Whether to show the AI assistant button',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TopBar>;

const defaultBreadcrumbItems = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Jobs', href: '/jobs' },
  { title: 'Running Jobs' },
];

export const Default: Story = {
  args: {
    breadcrumbItems: defaultBreadcrumbItems,
    searchPlaceholder: 'Search jobs, workflows, data...',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c1c1?w=100&h=100&fit=crop&crop=face',
    userName: 'Dr. Sarah Chen',
    notificationCount: 3,
    showAssistant: true,
    onSearchChange: action('onSearchChange'),
    onSearch: action('onSearch'),
    onNotificationsClick: action('onNotificationsClick'),
    onHelpClick: action('onHelpClick'),
    onAssistantClick: action('onAssistantClick'),
    onUserClick: action('onUserClick'),
  },
};

export const WithManyNotifications: Story = {
  args: {
    ...Default.args,
    notificationCount: 99,
  },
};

export const NoNotifications: Story = {
  args: {
    ...Default.args,
    notificationCount: 0,
  },
};

export const WithoutAssistant: Story = {
  args: {
    ...Default.args,
    showAssistant: false,
  },
};

export const NoAvatar: Story = {
  args: {
    ...Default.args,
    userAvatar: undefined,
    userName: 'John Doe',
  },
};

export const LongBreadcrumb: Story = {
  args: {
    ...Default.args,
    breadcrumbItems: [
      { title: 'Dashboard', href: '/dashboard' },
      { title: 'Projects', href: '/projects' },
      { title: 'Computational Fluid Dynamics', href: '/projects/cfd' },
      { title: 'Wind Tunnel Simulation', href: '/projects/cfd/wind-tunnel' },
      { title: 'Results Analysis' },
    ],
  },
};

export const SimpleBreadcrumb: Story = {
  args: {
    ...Default.args,
    breadcrumbItems: [
      { title: 'Dashboard', href: '/dashboard' },
      { title: 'Settings' },
    ],
  },
};

export const NoBreadcrumb: Story = {
  args: {
    ...Default.args,
    breadcrumbItems: [],
  },
};

export const CustomSearchPlaceholder: Story = {
  args: {
    ...Default.args,
    searchPlaceholder: 'Search simulation results...',
  },
};

// Interactive story with search functionality
export const Interactive: Story = {
  args: {
    ...Default.args,
  },
  render: (args) => {
    const [searchValue, setSearchValue] = React.useState('');
    const [notifications, setNotifications] = React.useState(3);

    const handleSearch = (value: string) => {
      action('onSearch')();
      console.log('Searching for:', value);
    };

    const handleNotificationClick = () => {
      setNotifications(0);
      action('onNotificationsClick')();
    };

    return (
      <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
        <TopBar
          {...args}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onSearch={handleSearch}
          notificationCount={notifications}
          onNotificationsClick={handleNotificationClick}
        />
        <div style={{ padding: '24px' }}>
          <h2>Main Content Area</h2>
          <p>Current search value: <strong>{searchValue || '(empty)'}</strong></p>
          <p>Notifications: <strong>{notifications}</strong></p>
          <p>Try typing in the search box or clicking the notification bell.</p>
          <div style={{ marginTop: '24px', padding: '16px', background: 'white', borderRadius: '8px' }}>
            <h3>Page Content</h3>
            <p>This demonstrates how the TopBar sits above your main content.</p>
          </div>
        </div>
      </div>
    );
  },
};

// Mobile-focused story
export const Mobile: Story = {
  args: {
    ...Default.args,
    breadcrumbItems: [
      { title: 'Jobs' },
    ],
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};