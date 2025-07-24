import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
const action = (name: string) => () => console.log(name);
import { BugOutlined, RocketOutlined, BarChartOutlined } from '@ant-design/icons';
import { EnhancedSelect } from './EnhancedSelect';
import { Icon } from '../../atoms/Icon';

const meta: Meta<typeof EnhancedSelect> = {
  title: 'Forms/EnhancedSelect',
  component: EnhancedSelect,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# EnhancedSelect Component

An advanced select component with search, grouping, descriptions, icons, and tags functionality.

## Features
- **Search Functionality**: Real-time filtering with highlighted matches
- **Grouped Options**: Organize options into logical groups
- **Rich Options**: Support for descriptions, icons, and tags
- **Multiple Selection**: Support for single and multi-select modes
- **Loading States**: Built-in loading indicator and custom loading text
- **Empty States**: Customizable empty state when no options match
- **Accessibility**: Full keyboard navigation and screen reader support
- **Custom Filtering**: Override default search behavior
- **Tag Display**: Show relevant tags for each option

## Option Structure
Each option can include:
- \`value\` - The option value
- \`label\` - Display text or React node
- \`description\` - Additional context text
- \`icon\` - Icon component
- \`tags\` - Array of tag strings
- \`group\` - Group name for categorization
- \`disabled\` - Whether option is selectable

## Usage
\`\`\`tsx
import { EnhancedSelect } from '@/components/forms';
import { Icon } from '../../atoms/Icon';

const options = [
  {
    value: 'aws',
    label: 'Amazon Web Services',
    description: 'Cloud computing platform',
    icon: <Icon name="CloudOutlined" />,
    tags: ['Cloud', 'AWS'],
    group: 'Cloud Providers',
  },
];

<EnhancedSelect
  options={options}
  searchable
  showDescriptions
  showIcons
  showTags
  groupBy
  placeholder="Select a service..."
  onChange={handleChange}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    searchable: {
      control: 'boolean',
      description: 'Enable search functionality',
    },
    groupBy: {
      control: 'boolean',
      description: 'Group options by category',
    },
    showDescriptions: {
      control: 'boolean',
      description: 'Show option descriptions',
    },
    showIcons: {
      control: 'boolean',
      description: 'Show option icons',
    },
    showTags: {
      control: 'boolean',
      description: 'Show option tags',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading state',
    },
    mode: {
      control: 'select',
      options: [undefined, 'multiple', 'tags'],
      description: 'Selection mode',
    },
  },
};

export default meta;
type Story = StoryObj<typeof EnhancedSelect>;

const sampleOptions = [
  {
    value: 'aws',
    label: 'Amazon Web Services',
    description: 'Comprehensive cloud computing platform with extensive services',
    icon: <Icon name="CloudOutlined" />,
    tags: ['Cloud', 'AWS', 'Popular'],
    group: 'Cloud Providers',
  },
  {
    value: 'gcp',
    label: 'Google Cloud Platform',
    description: 'Google\'s suite of cloud computing services',
    icon: <Icon name="CloudOutlined" />,
    tags: ['Cloud', 'Google', 'AI/ML'],
    group: 'Cloud Providers',
  },
  {
    value: 'azure',
    label: 'Microsoft Azure',
    description: 'Microsoft\'s cloud computing service',
    icon: <Icon name="CloudOutlined" />,
    tags: ['Cloud', 'Microsoft', 'Enterprise'],
    group: 'Cloud Providers',
  },
  {
    value: 's3',
    label: 'Amazon S3',
    description: 'Scalable object storage service',
    icon: <Icon name="DatabaseOutlined" />,
    tags: ['Storage', 'AWS', 'Object'],
    group: 'Storage Services',
  },
  {
    value: 'gcs',
    label: 'Google Cloud Storage',
    description: 'Unified object storage for developers and enterprises',
    icon: <Icon name="DatabaseOutlined" />,
    tags: ['Storage', 'Google', 'Object'],
    group: 'Storage Services',
  },
  {
    value: 'blob',
    label: 'Azure Blob Storage',
    description: 'Massively scalable object storage for unstructured data',
    icon: <Icon name="DatabaseOutlined" />,
    tags: ['Storage', 'Azure', 'Object'],
    group: 'Storage Services',
  },
  {
    value: 'slack',
    label: 'Slack',
    description: 'Team collaboration and communication platform',
    icon: <Icon name="TeamOutlined" />,
    tags: ['Communication', 'Teams', 'Chat'],
    group: 'Collaboration Tools',
  },
  {
    value: 'teams',
    label: 'Microsoft Teams',
    description: 'Unified communication and collaboration platform',
    icon: <Icon name="TeamOutlined" />,
    tags: ['Communication', 'Microsoft', 'Video'],
    group: 'Collaboration Tools',
  },
];

export const Default: Story = {
  args: {
    options: sampleOptions,
    placeholder: 'Select a service...',
    searchable: true,
    showDescriptions: false,
    showIcons: false,
    showTags: false,
    groupBy: false,
    style: { width: '300px' },
    onChange: action('onChange'),
    onSearch: action('onSearch'),
  },
};

export const WithIcons: Story = {
  args: {
    ...Default.args,
    showIcons: true,
  },
};

export const WithDescriptions: Story = {
  args: {
    ...Default.args,
    showDescriptions: true,
    style: { width: '400px' },
  },
};

export const WithTags: Story = {
  args: {
    ...Default.args,
    showTags: true,
    style: { width: '400px' },
  },
};

export const FullFeatured: Story = {
  args: {
    ...Default.args,
    showIcons: true,
    showDescriptions: true,
    showTags: true,
    groupBy: true,
    style: { width: '500px' },
  },
};

export const Grouped: Story = {
  args: {
    ...Default.args,
    groupBy: true,
    showIcons: true,
    style: { width: '400px' },
  },
};

export const MultipleSelection: Story = {
  args: {
    ...Default.args,
    mode: 'multiple',
    showIcons: true,
    showTags: true,
    maxTagCount: 2,
    style: { width: '400px' },
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    loading: true,
    loadingText: 'Loading services...',
  },
};

export const EmptyState: Story = {
  args: {
    ...Default.args,
    options: [],
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
    value: 'aws',
  },
};

export const SoftwareSelection: Story = {
  args: {
    options: [
      {
        value: 'openfoam',
        label: 'OpenFOAM',
        description: 'Open-source CFD software package',
        icon: <RocketOutlined />,
        tags: ['CFD', 'Open Source', 'C++'],
        group: 'Computational Fluid Dynamics',
      },
      {
        value: 'ansys-fluent',
        label: 'ANSYS Fluent',
        description: 'Commercial CFD simulation software',
        icon: <RocketOutlined />,
        tags: ['CFD', 'Commercial', 'Industry Standard'],
        group: 'Computational Fluid Dynamics',
      },
      {
        value: 'star-ccm',
        label: 'STAR-CCM+',
        description: 'Multiphysics simulation software',
        icon: <RocketOutlined />,
        tags: ['CFD', 'Multiphysics', 'Commercial'],
        group: 'Computational Fluid Dynamics',
      },
      {
        value: 'abaqus',
        label: 'Abaqus',
        description: 'Finite element analysis software',
        icon: <Icon name="SettingOutlined" />,
        tags: ['FEA', 'Structural', 'Commercial'],
        group: 'Finite Element Analysis',
      },
      {
        value: 'nastran',
        label: 'MSC Nastran',
        description: 'Multidisciplinary structural analysis solver',
        icon: <Icon name="SettingOutlined" />,
        tags: ['FEA', 'Solver', 'Aerospace'],
        group: 'Finite Element Analysis',
      },
      {
        value: 'matlab',
        label: 'MATLAB',
        description: 'Technical computing platform',
        icon: <Icon name="StarOutlined" />,
        tags: ['Computing', 'Data Analysis', 'Scripting'],
        group: 'General Purpose',
      },
      {
        value: 'python',
        label: 'Python',
        description: 'High-level programming language',
        icon: <BugOutlined />,
        tags: ['Programming', 'Data Science', 'Open Source'],
        group: 'General Purpose',
      },
    ],
    placeholder: 'Select simulation software...',
    searchable: true,
    showIcons: true,
    showDescriptions: true,
    showTags: true,
    groupBy: true,
    style: { width: '500px' },
    onChange: action('software-onChange'),
  },
};

export const UserSelection: Story = {
  args: {
    options: [
      {
        value: 'admin',
        label: 'Administrator',
        description: 'Full system access and management capabilities',
        icon: <Icon name="SettingOutlined" />,
        tags: ['Admin', 'Full Access'],
        group: 'System Roles',
      },
      {
        value: 'manager',
        label: 'Project Manager',
        description: 'Manage projects and team members',
        icon: <Icon name="TeamOutlined" />,
        tags: ['Management', 'Projects'],
        group: 'Management Roles',
      },
      {
        value: 'engineer',
        label: 'Engineer',
        description: 'Run simulations and analyze results',
        icon: <RocketOutlined />,
        tags: ['Technical', 'Simulations'],
        group: 'Technical Roles',
      },
      {
        value: 'analyst',
        label: 'Data Analyst',
        description: 'Analyze simulation data and generate reports',
        icon: <BarChartOutlined />,
        tags: ['Analytics', 'Reports'],
        group: 'Technical Roles',
      },
      {
        value: 'viewer',
        label: 'Viewer',
        description: 'View-only access to projects and results',
        icon: <Icon name="StarOutlined" />,
        tags: ['Read Only', 'Limited'],
        group: 'Basic Roles',
      },
    ],
    placeholder: 'Select user role...',
    searchable: true,
    showIcons: true,
    showDescriptions: true,
    showTags: true,
    groupBy: true,
    mode: 'multiple',
    style: { width: '500px' },
    onChange: action('role-onChange'),
  },
};

export const Interactive: Story = {
  render: () => {
    const [selectedValue, setSelectedValue] = React.useState();
    const [searchValue, setSearchValue] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleChange = (value: any) => {
      setSelectedValue(value);
      console.log('onChange', value);
    };

    const handleSearch = (value: string) => {
      setSearchValue(value);
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
      }, 500);
      
      console.log('onSearch', value);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ 
          padding: '16px', 
          background: '#f5f5f5', 
          borderRadius: '8px' 
        }}>
          <p><strong>Interactive Demo:</strong> Try searching and selecting options.</p>
          <p>Selected: <strong>{selectedValue || 'None'}</strong></p>
          <p>Search: <strong>{searchValue || 'None'}</strong></p>
        </div>
        
        <EnhancedSelect
          options={sampleOptions}
          placeholder="Search and select a service..."
          searchable
          showIcons
          showDescriptions
          showTags
          groupBy
          loading={loading}
          value={selectedValue}
          onChange={handleChange}
          onSearch={handleSearch}
          style={{ width: '500px' }}
        />
      </div>
    );
  },
};