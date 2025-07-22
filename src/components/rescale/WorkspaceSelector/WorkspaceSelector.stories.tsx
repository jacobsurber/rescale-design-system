import type { Meta, StoryObj } from '@storybook/react';
import { WorkspaceSelector, Workspace } from './WorkspaceSelector';
import { TeamOutlined, UserOutlined } from '@ant-design/icons';

/**
 * The WorkspaceSelector component provides a dropdown interface for selecting workspaces
 * with search functionality, recent workspace shortcuts, and detailed workspace information.
 */
const meta: Meta<typeof WorkspaceSelector> = {
  title: 'Components/Rescale/Workspace Selector',
  component: WorkspaceSelector,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The WorkspaceSelector is a specialized dropdown component for workspace management in Rescale applications.
It provides an intuitive interface for workspace selection with advanced features.

## Features
- **Search Functionality**: Filter workspaces by name or description
- **Recent Workspaces**: Quick access to recently used workspaces
- **Workspace Types**: Support for personal, team, and organization workspaces
- **Rich Information**: Shows workspace details, member count, and ownership
- **Visual Indicators**: Icons for private workspaces, starred items, and team workspaces
- **Responsive Design**: Adapts to different screen sizes and containers

## Workspace Types
- **Personal**: Individual user workspaces
- **Team**: Collaborative team workspaces with member management
- **Organization**: Organization-wide workspaces

Use this component in navigation bars, job creation forms, and workspace management interfaces.
        `,
      },
    },
  },
  argTypes: {
    workspaces: {
      description: 'Array of available workspaces',
    },
    selectedWorkspace: {
      description: 'Currently selected workspace',
    },
    onSelect: {
      action: 'workspaceSelected',
      description: 'Callback when a workspace is selected',
    },
    showRecent: {
      control: 'boolean',
      description: 'Whether to show recent workspaces section',
    },
    searchable: {
      control: 'boolean',
      description: 'Whether search functionality is enabled',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the selector',
    },
    maxRecent: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Maximum number of recent workspaces to show',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample workspace data
const sampleWorkspaces: Workspace[] = [
  {
    id: 'personal-1',
    name: 'My Personal Workspace',
    description: 'Personal projects and experiments',
    type: 'personal',
    private: true,
    starred: true,
    lastAccessed: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    owner: 'John Doe',
    icon: <UserOutlined />,
  },
  {
    id: 'team-aero',
    name: 'Aerospace Team',
    description: 'Aerodynamics and flight simulation projects',
    type: 'team',
    private: false,
    starred: false,
    lastAccessed: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    memberCount: 12,
    owner: 'Sarah Johnson',
    icon: <TeamOutlined />,
  },
  {
    id: 'team-cfd',
    name: 'CFD Research',
    description: 'Computational Fluid Dynamics research and development',
    type: 'team',
    private: true,
    starred: true,
    lastAccessed: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    memberCount: 8,
    owner: 'Michael Chen',
    icon: <TeamOutlined />,
  },
  {
    id: 'org-main',
    name: 'Organization Main',
    description: 'Main organizational workspace for company-wide projects',
    type: 'organization',
    private: false,
    starred: false,
    lastAccessed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    memberCount: 156,
    owner: 'Admin Team',
    icon: <TeamOutlined />,
  },
  {
    id: 'personal-2',
    name: 'Side Projects',
    description: 'Personal side projects and learning',
    type: 'personal',
    private: true,
    starred: false,
    lastAccessed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    owner: 'John Doe',
    icon: <UserOutlined />,
  },
  {
    id: 'team-auto',
    name: 'Automotive Division',
    description: 'Vehicle simulation and testing projects',
    type: 'team',
    private: false,
    starred: false,
    lastAccessed: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    memberCount: 24,
    owner: 'Lisa Wang',
    icon: <TeamOutlined />,
  },
  {
    id: 'team-materials',
    name: 'Materials Science',
    description: 'Materials modeling and simulation research',
    type: 'team',
    private: true,
    starred: false,
    lastAccessed: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    memberCount: 6,
    owner: 'Dr. Robert Kim',
    icon: <TeamOutlined />,
  },
];

/**
 * Default workspace selector with all features enabled.
 */
export const Default: Story = {
  args: {
    workspaces: sampleWorkspaces,
    selectedWorkspace: sampleWorkspaces[0],
    showRecent: true,
    searchable: true,
    placeholder: 'Select workspace...',
    maxRecent: 5,
  },
};

/**
 * Workspace selector without search functionality.
 */
export const WithoutSearch: Story = {
  args: {
    workspaces: sampleWorkspaces,
    selectedWorkspace: sampleWorkspaces[1],
    showRecent: true,
    searchable: false,
    placeholder: 'Choose workspace...',
    maxRecent: 3,
  },
};

/**
 * Workspace selector without recent workspaces section.
 */
export const WithoutRecent: Story = {
  args: {
    workspaces: sampleWorkspaces,
    selectedWorkspace: sampleWorkspaces[2],
    showRecent: false,
    searchable: true,
    placeholder: 'Select workspace...',
  },
  parameters: {
    docs: {
      description: {
        story: 'Workspace selector with recent workspaces section disabled.',
      },
    },
  },
};

/**
 * Minimal workspace selector (no search, no recent).
 */
export const Minimal: Story = {
  args: {
    workspaces: sampleWorkspaces.slice(0, 4),
    selectedWorkspace: undefined,
    showRecent: false,
    searchable: false,
    placeholder: 'Select workspace...',
  },
  parameters: {
    docs: {
      description: {
        story: 'Simplified workspace selector with basic functionality only.',
      },
    },
  },
};

/**
 * Few workspaces available.
 */
export const FewWorkspaces: Story = {
  args: {
    workspaces: sampleWorkspaces.slice(0, 2),
    selectedWorkspace: sampleWorkspaces[0],
    showRecent: true,
    searchable: true,
    placeholder: 'Select workspace...',
    maxRecent: 5,
  },
  parameters: {
    docs: {
      description: {
        story: 'Workspace selector with only a few available workspaces.',
      },
    },
  },
};

/**
 * No workspace selected initially.
 */
export const NoSelection: Story = {
  args: {
    workspaces: sampleWorkspaces,
    selectedWorkspace: undefined,
    showRecent: true,
    searchable: true,
    placeholder: 'Please select a workspace...',
    maxRecent: 3,
  },
  parameters: {
    docs: {
      description: {
        story: 'Workspace selector with no initial selection.',
      },
    },
  },
};

/**
 * Team workspaces only.
 */
export const TeamWorkspaces: Story = {
  args: {
    workspaces: sampleWorkspaces.filter(w => w.type === 'team'),
    selectedWorkspace: sampleWorkspaces.find(w => w.type === 'team'),
    showRecent: true,
    searchable: true,
    placeholder: 'Select team workspace...',
    maxRecent: 3,
  },
  parameters: {
    docs: {
      description: {
        story: 'Workspace selector showing only team workspaces.',
      },
    },
  },
};

/**
 * Personal workspaces only.
 */
export const PersonalWorkspaces: Story = {
  args: {
    workspaces: sampleWorkspaces.filter(w => w.type === 'personal'),
    selectedWorkspace: sampleWorkspaces.find(w => w.type === 'personal'),
    showRecent: true,
    searchable: true,
    placeholder: 'Select personal workspace...',
    maxRecent: 5,
  },
  parameters: {
    docs: {
      description: {
        story: 'Workspace selector showing only personal workspaces.',
      },
    },
  },
};

/**
 * Large number of recent workspaces.
 */
export const ManyRecent: Story = {
  args: {
    workspaces: sampleWorkspaces,
    selectedWorkspace: sampleWorkspaces[0],
    showRecent: true,
    searchable: true,
    placeholder: 'Select workspace...',
    maxRecent: 8,
  },
  parameters: {
    docs: {
      description: {
        story: 'Workspace selector with a higher limit for recent workspaces.',
      },
    },
  },
};

/**
 * Custom placeholder text.
 */
export const CustomPlaceholder: Story = {
  args: {
    workspaces: sampleWorkspaces,
    selectedWorkspace: undefined,
    showRecent: true,
    searchable: true,
    placeholder: '🚀 Choose your workspace to get started...',
    maxRecent: 5,
  },
  parameters: {
    docs: {
      description: {
        story: 'Workspace selector with custom placeholder text.',
      },
    },
  },
};