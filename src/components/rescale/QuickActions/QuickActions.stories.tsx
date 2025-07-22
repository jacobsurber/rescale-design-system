import type { Meta, StoryObj } from '@storybook/react';
import { QuickActions } from './QuickActions'
import type { QuickAction } from './QuickActions';
import { 
  RocketOutlined, 
  FileOutlined, 
  SettingOutlined, 
  TeamOutlined,
  CloudUploadOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';

/**
 * The QuickActions component provides a flexible interface for displaying action buttons
 * in various layouts, with support for default Rescale actions and custom actions.
 */
const meta: Meta<typeof QuickActions> = {
  title: 'Components/Rescale/Quick Actions',
  component: QuickActions,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The QuickActions component is designed to provide quick access to common actions in Rescale applications.
It supports both default platform actions and custom actions with flexible layout options.

## Features
- **Default Actions**: Pre-configured "New Job", "New Workstation", and "New Workflow" actions
- **Custom Actions**: Support for additional custom actions with full styling options
- **Multiple Layouts**: Horizontal, vertical, and grid layout options
- **Action Types**: Primary, secondary, success, warning, and danger action styles
- **Loading States**: Built-in loading indicators for async operations
- **Tooltips**: Descriptive tooltips for better user experience
- **Responsive Design**: Adapts to different container sizes

## Default Actions
- **New Job**: Submit a new simulation job
- **New Workstation**: Launch a new remote workstation
- **New Workflow**: Create a new automated workflow

Use this component in dashboards, navigation areas, and main application interfaces
to provide users with quick access to primary actions.
        `,
      },
    },
  },
  argTypes: {
    actions: {
      description: 'Array of custom actions to display',
    },
    layout: {
      control: 'select',
      options: ['horizontal', 'vertical', 'grid'],
      description: 'Layout orientation of the actions',
    },
    size: {
      control: 'select',
      options: ['small', 'default', 'large'],
      description: 'Size of the action buttons',
    },
    showDefaults: {
      control: 'boolean',
      description: 'Whether to show default Rescale actions',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether buttons should be full width in vertical layout',
    },
    onNewJob: {
      action: 'newJobClicked',
      description: 'Callback for "New Job" action',
    },
    onNewWorkstation: {
      action: 'newWorkstationClicked',
      description: 'Callback for "New Workstation" action',
    },
    onNewWorkflow: {
      action: 'newWorkflowClicked',
      description: 'Callback for "New Workflow" action',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample custom actions
const customActions: QuickAction[] = [
  {
    id: 'upload-file',
    label: 'Upload File',
    icon: <CloudUploadOutlined />,
    description: 'Upload files to workspace',
    type: 'secondary',
  },
  {
    id: 'manage-team',
    label: 'Manage Team',
    icon: <TeamOutlined />,
    description: 'Manage team members and permissions',
    type: 'secondary',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <SettingOutlined />,
    description: 'Configure workspace settings',
    type: 'secondary',
  },
];

/**
 * Default quick actions with horizontal layout.
 */
export const Default: Story = {
  args: {
    actions: [],
    layout: 'horizontal',
    size: 'default',
    showDefaults: true,
    fullWidth: false,
  },
};

/**
 * Vertical layout - useful for sidebars.
 */
export const Vertical: Story = {
  args: {
    actions: customActions.slice(0, 2),
    layout: 'vertical',
    size: 'default',
    showDefaults: true,
    fullWidth: true,
  },
};

/**
 * Grid layout - useful for dashboard cards.
 */
export const Grid: Story = {
  args: {
    actions: customActions,
    layout: 'grid',
    size: 'default',
    showDefaults: true,
    fullWidth: false,
  },
};

/**
 * Small size variant for compact layouts.
 */
export const Small: Story = {
  args: {
    actions: [],
    layout: 'horizontal',
    size: 'small',
    showDefaults: true,
    fullWidth: false,
  },
};

/**
 * Large size variant for prominent displays.
 */
export const Large: Story = {
  args: {
    actions: customActions.slice(0, 1),
    layout: 'horizontal',
    size: 'large',
    showDefaults: true,
    fullWidth: false,
  },
};

/**
 * Custom actions only (no defaults).
 */
export const CustomOnly: Story = {
  args: {
    actions: [
      {
        id: 'experiment',
        label: 'Run Experiment',
        icon: <ExperimentOutlined />,
        description: 'Start a new experimental run',
        type: 'primary',
      },
      {
        id: 'analyze',
        label: 'Analyze Data',
        icon: <FileOutlined />,
        description: 'Analyze existing simulation data',
        type: 'secondary',
      },
      {
        id: 'deploy',
        label: 'Deploy Model',
        icon: <RocketOutlined />,
        description: 'Deploy model to production',
        type: 'success',
      },
    ],
    layout: 'horizontal',
    size: 'default',
    showDefaults: false,
    fullWidth: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Quick actions with only custom actions, no default Rescale actions.',
      },
    },
  },
};

/**
 * Actions with different types and states.
 */
export const ActionTypes: Story = {
  args: {
    actions: [
      {
        id: 'success',
        label: 'Success Action',
        icon: <RocketOutlined />,
        description: 'Successful operation',
        type: 'success',
      },
      {
        id: 'warning',
        label: 'Warning Action',
        icon: <ExperimentOutlined />,
        description: 'Proceed with caution',
        type: 'warning',
      },
      {
        id: 'danger',
        label: 'Danger Action',
        icon: <SettingOutlined />,
        description: 'Destructive operation',
        type: 'danger',
      },
    ],
    layout: 'horizontal',
    size: 'default',
    showDefaults: false,
    fullWidth: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Quick actions demonstrating different action types with color coding.',
      },
    },
  },
};

/**
 * Actions with loading and disabled states.
 */
export const LoadingAndDisabled: Story = {
  args: {
    actions: [
      {
        id: 'loading',
        label: 'Processing...',
        icon: <CloudUploadOutlined />,
        description: 'Currently processing',
        type: 'primary',
        loading: true,
      },
      {
        id: 'disabled',
        label: 'Disabled Action',
        icon: <TeamOutlined />,
        description: 'Not available',
        type: 'secondary',
        disabled: true,
      },
      {
        id: 'normal',
        label: 'Normal Action',
        icon: <FileOutlined />,
        description: 'Available action',
        type: 'secondary',
      },
    ],
    layout: 'horizontal',
    size: 'default',
    showDefaults: false,
    fullWidth: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Quick actions showing loading and disabled states.',
      },
    },
  },
};

/**
 * Vertical layout with full width buttons.
 */
export const VerticalFullWidth: Story = {
  args: {
    actions: customActions,
    layout: 'vertical',
    size: 'default',
    showDefaults: true,
    fullWidth: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Vertical layout with full-width buttons, ideal for sidebar navigation.',
      },
    },
  },
};

/**
 * Grid layout comparison.
 */
export const GridLayouts: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h4 style={{ marginBottom: '16px' }}>Default Grid:</h4>
        <QuickActions
          actions={customActions}
          layout="grid"
          showDefaults={true}
        />
      </div>
      <div>
        <h4 style={{ marginBottom: '16px' }}>Large Grid:</h4>
        <QuickActions
          actions={customActions.slice(0, 2)}
          layout="grid"
          size="large"
          showDefaults={false}
        />
      </div>
      <div>
        <h4 style={{ marginBottom: '16px' }}>Small Grid:</h4>
        <QuickActions
          actions={customActions}
          layout="grid"
          size="small"
          showDefaults={false}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of grid layouts at different sizes.',
      },
    },
  },
};

/**
 * No actions available state.
 */
export const NoActions: Story = {
  args: {
    actions: [],
    layout: 'horizontal',
    size: 'default',
    showDefaults: false,
    fullWidth: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Quick actions component when no actions are available.',
      },
    },
  },
};

/**
 * Mixed default and custom actions.
 */
export const MixedActions: Story = {
  args: {
    actions: [
      {
        id: 'custom-analysis',
        label: 'Custom Analysis',
        icon: <ExperimentOutlined />,
        description: 'Run custom analysis workflow',
        type: 'secondary',
      },
      {
        id: 'export-data',
        label: 'Export Data',
        icon: <CloudUploadOutlined />,
        description: 'Export results to external system',
        type: 'secondary',
      },
    ],
    layout: 'horizontal',
    size: 'default',
    showDefaults: true,
    fullWidth: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Quick actions combining default Rescale actions with custom actions.',
      },
    },
  },
};