import type { Meta, StoryObj } from '@storybook/react';
import { message } from 'antd';
import { FileBrowser, type FileNode } from './FileBrowser';
import { CodeOutlined, FileImageOutlined, FileOutlined } from '@ant-design/icons';
import { Icon } from '../../atoms/Icon';

const meta: Meta<typeof FileBrowser> = {
  title: 'Molecules/FileBrowser',
  component: FileBrowser,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A comprehensive file browser component with tree view, search, and file management actions.',
      },
    },
  },
  argTypes: {
    multiple: {
      control: { type: 'boolean' },
      description: 'Allow multiple file selection',
    },
    showSearch: {
      control: { type: 'boolean' },
      description: 'Show search functionality',
    },
    showActions: {
      control: { type: 'boolean' },
      description: 'Show toolbar actions',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Loading state',
    },
    height: {
      control: { type: 'number', min: 200, max: 800 },
      description: 'Browser height in pixels',
    },
  },
};

export default meta;
type Story = StoryObj<typeof FileBrowser>;

// Sample file data
const sampleData: FileNode[] = [
  {
    key: 'project',
    title: 'My Simulation Project',
    type: 'folder',
    path: '/project',
    children: [
      {
        key: 'project-input',
        title: 'Input Files',
        type: 'folder',
        path: '/project/input',
        children: [
          {
            key: 'mesh-file',
            title: 'mesh.msh',
            type: 'file',
            path: '/project/input/mesh.msh',
            size: 2048576,
            extension: 'msh',
            modified: new Date('2024-01-15'),
          },
          {
            key: 'config-file',
            title: 'config.json',
            type: 'file',
            path: '/project/input/config.json',
            size: 1024,
            extension: 'json',
            modified: new Date('2024-01-14'),
          },
          {
            key: 'materials-file',
            title: 'materials.csv',
            type: 'file',
            path: '/project/input/materials.csv',
            size: 512,
            extension: 'csv',
            modified: new Date('2024-01-13'),
          },
        ],
      },
      {
        key: 'project-output',
        title: 'Output Files',
        type: 'folder',
        path: '/project/output',
        children: [
          {
            key: 'results-file',
            title: 'results.vtk',
            type: 'file',
            path: '/project/output/results.vtk',
            size: 10485760,
            extension: 'vtk',
            modified: new Date('2024-01-16'),
          },
          {
            key: 'log-file',
            title: 'simulation.log',
            type: 'file',
            path: '/project/output/simulation.log',
            size: 4096,
            extension: 'log',
            modified: new Date('2024-01-16'),
          },
          {
            key: 'plots-folder',
            title: 'Plots',
            type: 'folder',
            path: '/project/output/plots',
            children: [
              {
                key: 'plot1',
                title: 'temperature_field.png',
                type: 'file',
                path: '/project/output/plots/temperature_field.png',
                size: 256000,
                extension: 'png',
                modified: new Date('2024-01-16'),
              },
              {
                key: 'plot2',
                title: 'velocity_vectors.png',
                type: 'file',
                path: '/project/output/plots/velocity_vectors.png',
                size: 298000,
                extension: 'png',
                modified: new Date('2024-01-16'),
              },
            ],
          },
        ],
      },
      {
        key: 'project-scripts',
        title: 'Scripts',
        type: 'folder',
        path: '/project/scripts',
        children: [
          {
            key: 'script1',
            title: 'preprocessing.py',
            type: 'file',
            path: '/project/scripts/preprocessing.py',
            size: 8192,
            extension: 'py',
            modified: new Date('2024-01-12'),
          },
          {
            key: 'script2',
            title: 'postprocessing.py',
            type: 'file',
            path: '/project/scripts/postprocessing.py',
            size: 12288,
            extension: 'py',
            modified: new Date('2024-01-17'),
          },
        ],
      },
    ],
  },
  {
    key: 'documentation',
    title: 'Documentation',
    type: 'folder',
    path: '/documentation',
    children: [
      {
        key: 'readme',
        title: 'README.md',
        type: 'file',
        path: '/documentation/README.md',
        size: 1500,
        extension: 'md',
        modified: new Date('2024-01-10'),
      },
      {
        key: 'manual',
        title: 'user_manual.pdf',
        type: 'file',
        path: '/documentation/user_manual.pdf',
        size: 2097152,
        extension: 'pdf',
        modified: new Date('2024-01-08'),
      },
    ],
  },
  {
    key: 'standalone-file',
    title: 'standalone_data.txt',
    type: 'file',
    path: '/standalone_data.txt',
    size: 750,
    extension: 'txt',
    modified: new Date('2024-01-18'),
  },
];

// Custom file icons
const customFileIcons = {
  py: <CodeOutlined style={{ color: '#3776ab' }} />,
  png: <FileImageOutlined style={{ color: '#ff6b6b' }} />,
  pdf: <FileOutlined style={{ color: '#dc3545' }} />,
  vtk: <Icon name="DatabaseOutlined" style />,
  msh: <Icon name="DatabaseOutlined" style />,
};

export const Default: Story = {
  args: {
    data: sampleData,
    height: 400,
    onSelect: (selectedKeys) => {
      console.log('Selected:', selectedKeys);
      message.info(`Selected: ${selectedKeys.join(', ')}`);
    },
    onSearch: (value) => {
      console.log('Search:', value);
    },
    onRefresh: () => {
      message.success('Files refreshed');
    },
    onUpload: () => {
      message.info('Upload dialog would open');
    },
    onCreateFolder: () => {
      message.info('Create folder dialog would open');
    },
  },
};

export const WithCustomIcons: Story = {
  args: {
    data: sampleData,
    fileIcons: customFileIcons,
    height: 400,
    onSelect: (selectedKeys) => {
      message.info(`Selected: ${selectedKeys.join(', ')}`);
    },
  },
};

export const MultipleSelection: Story = {
  args: {
    data: sampleData,
    multiple: true,
    fileIcons: customFileIcons,
    height: 400,
    onSelect: (selectedKeys) => {
      message.info(`Selected ${selectedKeys.length} files: ${selectedKeys.join(', ')}`);
    },
  },
};

export const NoSearch: Story = {
  args: {
    data: sampleData,
    showSearch: false,
    height: 350,
    onSelect: (selectedKeys) => {
      message.info(`Selected: ${selectedKeys.join(', ')}`);
    },
  },
};

export const NoActions: Story = {
  args: {
    data: sampleData,
    showActions: false,
    height: 350,
    onSelect: (selectedKeys) => {
      message.info(`Selected: ${selectedKeys.join(', ')}`);
    },
  },
};

export const LoadingState: Story = {
  args: {
    data: [],
    loading: true,
    height: 300,
  },
};

export const EmptyState: Story = {
  args: {
    data: [],
    height: 300,
    onRefresh: () => {
      message.success('Refreshing...');
    },
    onUpload: () => {
      message.info('Upload dialog would open');
    },
  },
};

export const CompactHeight: Story = {
  args: {
    data: sampleData,
    height: 250,
    fileIcons: customFileIcons,
    onSelect: (selectedKeys) => {
      message.info(`Selected: ${selectedKeys.join(', ')}`);
    },
  },
};

export const TallHeight: Story = {
  args: {
    data: sampleData,
    height: 600,
    fileIcons: customFileIcons,
    multiple: true,
    onSelect: (selectedKeys) => {
      message.info(`Selected ${selectedKeys.length} items: ${selectedKeys.join(', ')}`);
    },
  },
};

export const SearchDemo: Story = {
  args: {
    data: sampleData,
    fileIcons: customFileIcons,
    searchPlaceholder: 'Search simulation files...',
    height: 400,
    onSelect: (selectedKeys) => {
      message.info(`Selected: ${selectedKeys.join(', ')}`);
    },
    onSearch: (value) => {
      if (value) {
        message.info(`Searching for: "${value}"`);
      }
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Try searching for terms like "config", "png", "python", or "results" to see the filtering in action.',
      },
    },
  },
};