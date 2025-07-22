import type { Meta, StoryObj } from '@storybook/react';
import { JobsListPage } from './JobsListPage';
import { JobDetailPage } from './JobDetailPage';
import { ConnectorsPage } from './ConnectorsPage';
import { FormExamplePage } from './FormExamplePage';

/**
 * Demo application pages showcasing the Rescale Design System in realistic scenarios.
 * These examples demonstrate how components work together to create complete user experiences.
 */
const meta: Meta = {
  title: 'Examples/Demo Applications',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Demo Applications

These demo pages showcase real-world usage of the Rescale Design System components 
in complete application scenarios. Each example demonstrates:

- **Component Composition**: How multiple components work together
- **Realistic Data**: Using mock data that resembles actual Rescale use cases
- **Responsive Design**: Layout adaptation across different screen sizes
- **User Interactions**: Complete user workflows and interactions
- **Best Practices**: Recommended patterns for building Rescale applications

## Demo Pages

### 1. Jobs List Page
A comprehensive job management interface showing active, completed, and failed simulation jobs with:
- Advanced filtering and search
- Resource usage monitoring
- Bulk operations
- Status indicators

### 2. Job Detail Page
Detailed view of a single simulation job including:
- Real-time progress tracking
- Resource utilization metrics
- Configuration details
- Job timeline and history

### 3. Connectors & Integrations
Management interface for third-party integrations featuring:
- Integration status monitoring
- Configuration management
- Connection setup flows
- Category-based organization

### 4. Form Example
Multi-step job submission form demonstrating:
- Complex form validation
- File upload functionality
- Dynamic parameter configuration
- Review and submission workflow

These examples serve as both documentation and starting points for building 
similar interfaces in Rescale applications.
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;

/**
 * Jobs listing page with advanced filtering, search, and job management capabilities.
 * Shows how to build a comprehensive data table interface with multiple Rescale components.
 */
export const JobsListDemo: StoryObj = {
  render: () => <JobsListPage />,
  parameters: {
    docs: {
      description: {
        story: `
**Jobs List Page Demo**

This demo shows a complete job management interface featuring:

- **Advanced Table**: Custom table with sortable columns and responsive design
- **Filtering System**: Multi-criteria filtering with search, status, and priority filters
- **Resource Monitoring**: Live resource usage display for running jobs
- **Software Visualization**: Software logos with overflow handling
- **Job Actions**: Contextual actions based on job status
- **Status Indicators**: Visual job status with progress tracking

**Components Used:**
- \`MainLayout\` - Page structure and navigation
- \`PageHeader\` - Page title with actions
- \`JobStatusIndicator\` - Job status with progress bars
- \`SoftwareLogoGrid\` - Software package visualization
- \`ResourceMetrics\` - System resource usage display
- \`QuickActions\` - Primary action buttons
        `,
      },
    },
  },
};

/**
 * Detailed job view showing comprehensive job information, progress tracking, and management options.
 * Demonstrates complex layout composition and data visualization.
 */
export const JobDetailDemo: StoryObj = {
  render: () => <JobDetailPage />,
  parameters: {
    docs: {
      description: {
        story: `
**Job Detail Page Demo**

This demo presents a detailed job view interface featuring:

- **Tabbed Interface**: Organized information across multiple tabs
- **Progress Tracking**: Real-time job progress with estimated completion
- **Resource Monitoring**: Live system resource utilization
- **Configuration Display**: Detailed simulation parameters
- **Timeline View**: Job execution history and milestones
- **Action Controls**: Context-aware job management actions

**Components Used:**
- \`MainLayout\` - Page structure
- \`PageHeader\` - Title with action buttons
- \`JobStatusIndicator\` - Status with animated progress
- \`ResourceMetrics\` - Multi-layout resource display
- \`SoftwareLogoGrid\` - Software visualization with details
- Various Ant Design components for data display

**Key Features:**
- Responsive grid layout
- Real-time data updates
- Contextual action menus
- Detailed configuration views
        `,
      },
    },
  },
};

/**
 * Connectors and integrations management page showing third-party service connections.
 * Demonstrates card-based layouts and status management interfaces.
 */
export const ConnectorsDemo: StoryObj = {
  render: () => <ConnectorsPage />,
  parameters: {
    docs: {
      description: {
        story: `
**Connectors & Integrations Demo**

This demo showcases a third-party integration management interface featuring:

- **Card Grid Layout**: Responsive grid of integration cards
- **Status Management**: Visual status indicators with contextual actions
- **Category Filtering**: Filter integrations by type and status
- **Connection Flows**: Modal-based configuration interfaces
- **Provider Branding**: Integration with external service branding

**Components Used:**
- \`MainLayout\` - Page structure
- \`PageHeader\` - Page header with primary actions
- \`ConnectorCard\` - Integration display cards
- Custom styled components for status indicators
- Modal dialogs for configuration

**Integration States:**
- Connected (active integrations)
- Disconnected (available but not connected)
- Error (failed connections requiring attention)
- Configuring (setup in progress)
- Available (ready to connect)

**Key Features:**
- Real-time connection status
- Bulk operations support
- Custom connector development
- Configuration management
        `,
      },
    },
  },
};

/**
 * Comprehensive multi-step form example for job submission with file uploads and parameter configuration.
 * Shows advanced form patterns and validation workflows.
 */
export const FormExampleDemo: StoryObj = {
  render: () => <FormExamplePage />,
  parameters: {
    docs: {
      description: {
        story: `
**Form Example Demo**

This demo illustrates a complex multi-step form interface featuring:

- **Step-by-Step Workflow**: Guided job submission process
- **Form Validation**: Field-level and form-level validation
- **File Upload**: Drag-and-drop file upload with validation
- **Dynamic Parameters**: Context-sensitive configuration options
- **Software Selection**: Interactive software package selection
- **Resource Configuration**: Slider-based resource allocation
- **Review Process**: Summary and confirmation before submission

**Components Used:**
- \`MainLayout\` - Page structure
- \`PageHeader\` - Title with action buttons
- \`SoftwareLogoGrid\` - Interactive software selection
- \`QuickActions\` - Form action buttons
- \`DateRangePicker\` - Enhanced date selection
- \`EnhancedSelect\` - Improved select components

**Form Steps:**
1. **Basic Information** - Name, description, project assignment
2. **Software Selection** - Choose simulation packages
3. **Parameters** - Configure simulation settings
4. **Files & Resources** - Upload files and set resource requirements
5. **Review & Submit** - Final review and cost estimation

**Key Features:**
- Progressive disclosure
- Contextual help and validation
- Estimated cost calculation
- Draft saving capability
- Mobile-responsive design
        `,
      },
    },
  },
};

/**
 * All demo pages displayed together for comparison and overview.
 */
export const AllDemosOverview: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <div>
        <h2 style={{ marginBottom: '20px' }}>Jobs List Demo</h2>
        <div style={{ height: '600px', overflow: 'hidden', border: '1px solid #d9d9d9' }}>
          <JobsListPage />
        </div>
      </div>
      
      <div>
        <h2 style={{ marginBottom: '20px' }}>Job Detail Demo</h2>
        <div style={{ height: '600px', overflow: 'hidden', border: '1px solid #d9d9d9' }}>
          <JobDetailPage />
        </div>
      </div>
      
      <div>
        <h2 style={{ marginBottom: '20px' }}>Connectors Demo</h2>
        <div style={{ height: '600px', overflow: 'hidden', border: '1px solid #d9d9d9' }}>
          <ConnectorsPage />
        </div>
      </div>
      
      <div>
        <h2 style={{ marginBottom: '20px' }}>Form Example Demo</h2>
        <div style={{ height: '600px', overflow: 'hidden', border: '1px solid #d9d9d9' }}>
          <FormExamplePage />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Overview of all demo applications showing the variety of interfaces possible with the Rescale Design System.',
      },
    },
  },
};