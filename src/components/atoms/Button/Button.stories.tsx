import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { Space } from 'antd';

const meta = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'ghost', 'text'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'middle', 'large'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
    loading: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
};

export const Ghost: Story = {
  args: {
    children: 'Ghost Button',
    variant: 'ghost',
  },
};

export const Text: Story = {
  args: {
    children: 'Text Button',
    variant: 'text',
  },
};

export const AllVariants: Story = {
  render: () => (
    <Space>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="text">Text</Button>
    </Space>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Space>
      <Button size="small">Small</Button>
      <Button size="middle">Medium</Button>
      <Button size="large">Large</Button>
    </Space>
  ),
};

export const States: Story = {
  render: () => (
    <Space direction="vertical">
      <Space>
        <Button>Default</Button>
        <Button loading>Loading</Button>
        <Button disabled>Disabled</Button>
      </Space>
      <Space>
        <Button variant="secondary">Default</Button>
        <Button variant="secondary" loading>Loading</Button>
        <Button variant="secondary" disabled>Disabled</Button>
      </Space>
    </Space>
  ),
};