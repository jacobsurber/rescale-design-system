import type { Meta, StoryObj } from '@storybook/react';
import { Grid, Col } from './Grid';
import { Card } from 'antd';
import styled from 'styled-components';

const ExampleCard = styled(Card)`
  background: var(--rescale-color-light-blue);
  border: 1px solid var(--rescale-color-brand-blue);
  text-align: center;
  
  .ant-card-body {
    padding: var(--rescale-space-4);
    color: var(--rescale-color-brand-blue);
    font-weight: var(--rescale-font-weight-semibold);
  }
`;

const meta: Meta<typeof Grid> = {
  title: 'Layout/Grid',
  component: Grid,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Responsive CSS Grid system with 12-column layout and flexible column components.',
      },
    },
  },
  argTypes: {
    columns: {
      control: { type: 'number', min: 1, max: 12 },
      description: 'Number of columns (1-12)',
    },
    gap: {
      control: { type: 'number', min: 0, max: 8 },
      description: 'Gap between grid items (multiplier of 4px)',
    },
    alignItems: {
      control: 'select',
      options: ['start', 'end', 'center', 'stretch'],
      description: 'Align items vertically',
    },
    justifyItems: {
      control: 'select',
      options: ['start', 'end', 'center', 'stretch'],
      description: 'Justify items horizontally',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    columns: 12,
    gap: 4,
    children: (
      <>
        <Col span={3}>
          <ExampleCard>Col 3</ExampleCard>
        </Col>
        <Col span={3}>
          <ExampleCard>Col 3</ExampleCard>
        </Col>
        <Col span={3}>
          <ExampleCard>Col 3</ExampleCard>
        </Col>
        <Col span={3}>
          <ExampleCard>Col 3</ExampleCard>
        </Col>
      </>
    ),
  },
};

export const ResponsiveColumns: Story = {
  args: {
    columns: 12,
    gap: 4,
    children: (
      <>
        <Col span={6} spanTablet={4} spanMobile={12}>
          <ExampleCard>Responsive Col</ExampleCard>
        </Col>
        <Col span={6} spanTablet={4} spanMobile={12}>
          <ExampleCard>Responsive Col</ExampleCard>
        </Col>
        <Col span={12} spanTablet={4} spanMobile={12}>
          <ExampleCard>Responsive Col</ExampleCard>
        </Col>
      </>
    ),
  },
};

export const VariedSizes: Story = {
  args: {
    columns: 12,
    gap: 4,
    children: (
      <>
        <Col span={8}>
          <ExampleCard>Col 8 (Main Content)</ExampleCard>
        </Col>
        <Col span={4}>
          <ExampleCard>Col 4 (Sidebar)</ExampleCard>
        </Col>
        <Col span={4}>
          <ExampleCard>Col 4</ExampleCard>
        </Col>
        <Col span={4}>
          <ExampleCard>Col 4</ExampleCard>
        </Col>
        <Col span={4}>
          <ExampleCard>Col 4</ExampleCard>
        </Col>
        <Col span={12}>
          <ExampleCard>Col 12 (Full Width)</ExampleCard>
        </Col>
      </>
    ),
  },
};

export const WithOffset: Story = {
  args: {
    columns: 12,
    gap: 4,
    children: (
      <>
        <Col span={4} offset={2}>
          <ExampleCard>Col 4 (Offset 2)</ExampleCard>
        </Col>
        <Col span={4}>
          <ExampleCard>Col 4</ExampleCard>
        </Col>
        <Col span={6} offset={3}>
          <ExampleCard>Col 6 (Offset 3)</ExampleCard>
        </Col>
        <Col span={3}>
          <ExampleCard>Col 3</ExampleCard>
        </Col>
      </>
    ),
  },
};

export const CustomGap: Story = {
  args: {
    columns: 12,
    gap: 1,
    children: (
      <>
        <Col span={2}>
          <ExampleCard>Small Gap</ExampleCard>
        </Col>
        <Col span={2}>
          <ExampleCard>Small Gap</ExampleCard>
        </Col>
        <Col span={2}>
          <ExampleCard>Small Gap</ExampleCard>
        </Col>
        <Col span={2}>
          <ExampleCard>Small Gap</ExampleCard>
        </Col>
        <Col span={2}>
          <ExampleCard>Small Gap</ExampleCard>
        </Col>
        <Col span={2}>
          <ExampleCard>Small Gap</ExampleCard>
        </Col>
      </>
    ),
  },
};

export const DashboardLayout: Story = {
  args: {
    columns: 12,
    gap: 6,
    children: (
      <>
        <Col span={12}>
          <ExampleCard>Header / Navigation</ExampleCard>
        </Col>
        <Col span={3}>
          <ExampleCard>Metric 1</ExampleCard>
        </Col>
        <Col span={3}>
          <ExampleCard>Metric 2</ExampleCard>
        </Col>
        <Col span={3}>
          <ExampleCard>Metric 3</ExampleCard>
        </Col>
        <Col span={3}>
          <ExampleCard>Metric 4</ExampleCard>
        </Col>
        <Col span={8}>
          <ExampleCard>Main Chart</ExampleCard>
        </Col>
        <Col span={4}>
          <ExampleCard>Side Widget</ExampleCard>
        </Col>
        <Col span={6}>
          <ExampleCard>Secondary Chart</ExampleCard>
        </Col>
        <Col span={6}>
          <ExampleCard>Data Table</ExampleCard>
        </Col>
      </>
    ),
  },
};