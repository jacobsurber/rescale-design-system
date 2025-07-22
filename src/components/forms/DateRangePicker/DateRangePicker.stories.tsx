import type { Meta, StoryObj } from '@storybook/react';
import { DateRangePicker } from './DateRangePicker';
import dayjs from 'dayjs';

const meta: Meta<typeof DateRangePicker> = {
  title: 'Forms/DateRangePicker',
  component: DateRangePicker,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Enhanced date range picker with preset options and relative time display.',
      },
    },
  },
  argTypes: {
    showPresets: {
      control: 'boolean',
      description: 'Whether to show preset options',
    },
    showRelativeTime: {
      control: 'boolean',
      description: 'Whether to show relative time descriptions',
    },
    showTime: {
      control: 'boolean',
      description: 'Whether to show time selection',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the picker is disabled',
    },
    allowClear: {
      control: 'boolean',
      description: 'Whether to allow clearing the selection',
    },
    size: {
      control: 'select',
      options: ['small', 'middle', 'large'],
      description: 'Size of the picker',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    showPresets: true,
    showRelativeTime: true,
    placeholder: ['Start date', 'End date'],
  },
};

export const WithTimeSelection: Story = {
  args: {
    showPresets: true,
    showRelativeTime: true,
    showTime: true,
    placeholder: ['Start datetime', 'End datetime'],
  },
};

export const WithoutPresets: Story = {
  args: {
    showPresets: false,
    showRelativeTime: false,
    placeholder: ['From', 'To'],
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: [dayjs().subtract(7, 'day'), dayjs()],
    placeholder: ['Start date', 'End date'],
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    showPresets: true,
    showRelativeTime: true,
    placeholder: ['Start date', 'End date'],
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    showPresets: true,
    showRelativeTime: true,
    placeholder: ['Start date', 'End date'],
  },
};