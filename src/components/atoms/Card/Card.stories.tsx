import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Button } from '../Button';
import { Space } from 'antd';

const meta = {
  title: 'Atoms/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'elevated', 'outlined'],
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'small'],
    },
    loading: {
      control: { type: 'boolean' },
    },
    hoverable: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Card Title',
    children: 'This is the card content. You can put any content here.',
    style: { width: 300 },
  },
};

export const Elevated: Story = {
  args: {
    title: 'Elevated Card',
    variant: 'elevated',
    children: 'This card has an elevated appearance with a shadow.',
    style: { width: 300 },
  },
};

export const Outlined: Story = {
  args: {
    title: 'Outlined Card',
    variant: 'outlined',
    children: 'This card has a simple outlined style.',
    style: { width: 300 },
  },
};

export const WithActions: Story = {
  args: {
    title: 'Card with Actions',
    style: { width: 300 },
    actions: [
      <Button key="1" variant="text" size="small">Edit</Button>,
      <Button key="2" variant="text" size="small">Delete</Button>,
    ],
    children: 'This card includes action buttons.',
  },
};

export const AllVariants: Story = {
  render: () => (
    <Space direction="vertical" size="large">
      <Card title="Default Card" style={{ width: 300 }}>
        Default card appearance
      </Card>
      <Card title="Elevated Card" variant="elevated" style={{ width: 300 }}>
        Elevated card with shadow
      </Card>
      <Card title="Outlined Card" variant="outlined" style={{ width: 300 }}>
        Simple outlined card
      </Card>
    </Space>
  ),
};

export const Loading: Story = {
  args: {
    loading: true,
    style: { width: 300 },
  },
};

export const Hoverable: Story = {
  args: {
    title: 'Hoverable Card',
    hoverable: true,
    variant: 'elevated',
    style: { width: 300 },
    children: 'Hover over this card to see the effect.',
  },
};