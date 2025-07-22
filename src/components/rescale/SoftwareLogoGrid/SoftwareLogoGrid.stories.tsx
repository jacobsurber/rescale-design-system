import type { Meta, StoryObj } from '@storybook/react';
import { SoftwareLogoGrid, SoftwareItem } from './SoftwareLogoGrid';
import { CodeOutlined, DatabaseOutlined, CloudOutlined, ApiOutlined } from '@ant-design/icons';

/**
 * The SoftwareLogoGrid component displays a grid of software logos with overflow handling.
 * When there are more items than can be displayed, it shows a "+X More" button with additional options.
 */
const meta: Meta<typeof SoftwareLogoGrid> = {
  title: 'Components/Rescale/Software Logo Grid',
  component: SoftwareLogoGrid,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The SoftwareLogoGrid component is designed to display software packages available or used in Rescale jobs.
It provides a clean, organized way to show multiple software options with overflow management.

## Features
- **Flexible Display**: Shows software logos with optional names
- **Overflow Handling**: "+X More" button for additional items
- **Tooltips**: Hover tooltips with detailed software information
- **Popover**: Click to see all overflow items in a grid
- **Size Variants**: Multiple size options for different contexts
- **Clickable Items**: Optional click handlers for software selection

## Usage
Use this component in job configuration forms, software catalogs, and dashboard views
to display available software packages or show which software a job is using.
        `,
      },
    },
  },
  argTypes: {
    items: {
      description: 'Array of software items to display',
    },
    maxVisible: {
      control: { type: 'number', min: 1, max: 20 },
      description: 'Maximum number of logos to show before "+X More"',
    },
    size: {
      control: 'select',
      options: ['small', 'default', 'large'],
      description: 'Size of the logos',
    },
    showNames: {
      control: 'boolean',
      description: 'Whether to show software names below logos',
    },
    clickable: {
      control: 'boolean',
      description: 'Whether logos should be clickable',
    },
    onItemClick: {
      action: 'itemClicked',
      description: 'Callback when a software item is clicked',
    },
    onShowMore: {
      action: 'showMoreClicked',
      description: 'Custom callback for "+X More" button',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample software data
const sampleSoftware: SoftwareItem[] = [
  {
    id: 'ansys-fluent',
    name: 'ANSYS Fluent',
    logo: <CloudOutlined />,
    version: '2024.1',
    description: 'Computational Fluid Dynamics (CFD) solver',
    category: 'CFD',
    featured: true,
  },
  {
    id: 'openfoam',
    name: 'OpenFOAM',
    logo: <DatabaseOutlined />,
    version: '11.0',
    description: 'Open source CFD toolbox',
    category: 'CFD',
  },
  {
    id: 'abaqus',
    name: 'Abaqus',
    logo: <CodeOutlined />,
    version: '2024',
    description: 'Finite Element Analysis software',
    category: 'FEA',
    featured: true,
  },
  {
    id: 'nastran',
    name: 'MSC Nastran',
    logo: <ApiOutlined />,
    version: '2023.4',
    description: 'Multidisciplinary structural analysis',
    category: 'FEA',
  },
  {
    id: 'star-ccm',
    name: 'STAR-CCM+',
    logo: <CloudOutlined />,
    version: '2024.1',
    description: 'Multiphysics simulation platform',
    category: 'CFD',
  },
  {
    id: 'matlab',
    name: 'MATLAB',
    logo: <CodeOutlined />,
    version: 'R2024a',
    description: 'Technical computing platform',
    category: 'Computing',
  },
  {
    id: 'python',
    name: 'Python',
    logo: <DatabaseOutlined />,
    version: '3.11',
    description: 'Programming language and ecosystem',
    category: 'Computing',
  },
  {
    id: 'r',
    name: 'R',
    logo: <ApiOutlined />,
    version: '4.3',
    description: 'Statistical computing environment',
    category: 'Analytics',
  },
];

/**
 * Default software grid with overflow handling.
 */
export const Default: Story = {
  args: {
    items: sampleSoftware,
    maxVisible: 6,
    size: 'default',
    showNames: false,
    clickable: true,
  },
};

/**
 * Software grid with names displayed below logos.
 */
export const WithNames: Story = {
  args: {
    items: sampleSoftware.slice(0, 4),
    maxVisible: 4,
    size: 'default',
    showNames: true,
    clickable: true,
  },
};

/**
 * Small size variant - useful for compact displays.
 */
export const Small: Story = {
  args: {
    items: sampleSoftware,
    maxVisible: 8,
    size: 'small',
    showNames: false,
    clickable: true,
  },
};

/**
 * Large size variant - useful for prominent displays.
 */
export const Large: Story = {
  args: {
    items: sampleSoftware.slice(0, 4),
    maxVisible: 4,
    size: 'large',
    showNames: true,
    clickable: true,
  },
};

/**
 * Grid with few items (no overflow).
 */
export const FewItems: Story = {
  args: {
    items: sampleSoftware.slice(0, 3),
    maxVisible: 6,
    size: 'default',
    showNames: true,
    clickable: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'When there are fewer items than maxVisible, no "+X More" button is shown.',
      },
    },
  },
};

/**
 * Single software item.
 */
export const SingleItem: Story = {
  args: {
    items: [sampleSoftware[0]],
    maxVisible: 6,
    size: 'large',
    showNames: true,
    clickable: true,
  },
};

/**
 * Non-clickable grid (display only).
 */
export const NonClickable: Story = {
  args: {
    items: sampleSoftware.slice(0, 5),
    maxVisible: 5,
    size: 'default',
    showNames: false,
    clickable: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Software grid in display-only mode without click interactions.',
      },
    },
  },
};

/**
 * Different overflow configurations.
 */
export const OverflowVariations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h4 style={{ marginBottom: '16px' }}>Max 3 visible:</h4>
        <SoftwareLogoGrid
          items={sampleSoftware}
          maxVisible={3}
          size="default"
          clickable={true}
        />
      </div>
      <div>
        <h4 style={{ marginBottom: '16px' }}>Max 5 visible:</h4>
        <SoftwareLogoGrid
          items={sampleSoftware}
          maxVisible={5}
          size="default"
          clickable={true}
        />
      </div>
      <div>
        <h4 style={{ marginBottom: '16px' }}>Max 10 visible (no overflow):</h4>
        <SoftwareLogoGrid
          items={sampleSoftware}
          maxVisible={10}
          size="default"
          clickable={true}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different maxVisible settings showing how overflow behavior changes.',
      },
    },
  },
};

/**
 * Software grid with custom logos using images.
 */
export const WithImageLogos: Story = {
  args: {
    items: [
      {
        id: 'custom-1',
        name: 'Custom Software 1',
        logo: 'https://via.placeholder.com/40x40/0066cc/ffffff?text=C1',
        version: '1.0',
        description: 'Custom software with image logo',
        category: 'Custom',
      },
      {
        id: 'custom-2',
        name: 'Custom Software 2',
        logo: 'https://via.placeholder.com/40x40/1890ff/ffffff?text=C2',
        version: '2.0',
        description: 'Another custom software',
        category: 'Custom',
      },
      {
        id: 'custom-3',
        name: 'Custom Software 3',
        logo: 'https://via.placeholder.com/40x40/52c41a/ffffff?text=C3',
        version: '3.0',
        description: 'Third custom software',
        category: 'Custom',
      },
      ...sampleSoftware.slice(0, 3),
    ],
    maxVisible: 4,
    size: 'default',
    showNames: true,
    clickable: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Software grid supporting both image URLs and icon components as logos.',
      },
    },
  },
};