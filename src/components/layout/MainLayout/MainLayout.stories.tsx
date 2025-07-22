import type { Meta, StoryObj } from '@storybook/react';
import { MainLayout } from './MainLayout';
import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const meta: Meta<typeof MainLayout> = {
  title: 'Layout/MainLayout',
  component: MainLayout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Main application layout with sidebar navigation and header.',
      },
    },
  },
  argTypes: {
    defaultCollapsed: {
      control: 'boolean',
      description: 'Whether the sidebar is initially collapsed',
    },
    showMobileMenu: {
      control: 'boolean',
      description: 'Whether to show the mobile menu button',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const SampleContent = () => (
  <Card>
    <Title level={2}>Welcome to Rescale</Title>
    <Paragraph>
      This is the main content area. The layout includes a collapsible sidebar,
      top navigation bar, and responsive behavior for mobile devices.
    </Paragraph>
    <Paragraph>
      Try resizing your browser window to see how the layout adapts to different
      screen sizes. On mobile, the sidebar becomes a drawer that can be opened
      with the menu button.
    </Paragraph>
  </Card>
);

export const Default: Story = {
  args: {
    children: <SampleContent />,
  },
};

export const CollapsedSidebar: Story = {
  args: {
    defaultCollapsed: true,
    children: <SampleContent />,
  },
};

export const WithoutMobileMenu: Story = {
  args: {
    showMobileMenu: false,
    children: <SampleContent />,
  },
};