import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
const action = (name: string) => () => console.log(name);
import { WorkflowCard, type WorkflowCardProps } from './WorkflowCard';

const meta: Meta<typeof WorkflowCard> = {
  title: 'Cards/WorkflowCard',
  component: WorkflowCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# WorkflowCard Component

A comprehensive card component for displaying workflow information with steps, status, and actions.

## Features
- **Status Indicators**: Visual status with colored tags
- **Step Visualization**: Display workflow steps with status icons
- **Owner Information**: User avatar and name
- **Action Buttons**: Run, clone, and edit functionality
- **Tags & Metadata**: Flexible labeling and timestamp display
- **Hover Effects**: Interactive states with elevation
- **Responsive**: Adapts to different screen sizes

## Workflow Statuses
- \`draft\` - Workflow being created
- \`validated\` - Ready to run
- \`running\` - Currently executing
- \`completed\` - Successfully finished
- \`failed\` - Execution failed
- \`paused\` - Temporarily stopped

## Usage
\`\`\`tsx
import { WorkflowCard } from '@/components/cards';

<WorkflowCard
  id="wf_123"
  name="CFD Analysis Pipeline"
  description="Complete fluid dynamics analysis workflow"
  status="validated"
  steps={workflowSteps}
  owner={{ name: "Dr. Smith", avatar: "/avatar.jpg" }}
  createdAt={new Date()}
  onRun={handleRun}
  onClone={handleClone}
  onEdit={handleEdit}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    status: {
      control: 'select',
      options: ['draft', 'validated', 'running', 'completed', 'failed', 'paused'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof WorkflowCard>;

const sampleSteps = [
  {
    id: 'step1',
    name: 'Mesh Generation',
    software: 'Gmsh',
    status: 'completed' as const,
  },
  {
    id: 'step2',
    name: 'CFD Simulation',
    software: 'OpenFOAM',
    status: 'running' as const,
  },
  {
    id: 'step3',
    name: 'Post-processing',
    software: 'ParaView',
    status: 'pending' as const,
  },
  {
    id: 'step4',
    name: 'Report Generation',
    software: 'Python',
    status: 'pending' as const,
  },
];

export const Default: Story = {
  args: {
    id: 'wf_cfd_001',
    name: 'CFD Analysis Pipeline',
    description: 'Complete computational fluid dynamics analysis workflow for aerodynamic studies with automated mesh generation and post-processing.',
    status: 'validated',
    steps: sampleSteps,
    owner: {
      name: 'Dr. Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c1c1?w=100&h=100&fit=crop&crop=face',
    },
    createdAt: new Date('2024-01-15T10:30:00'),
    estimatedRuntime: '2h 45m',
    tags: ['CFD', 'Aerospace', 'Production'],
    onClick: action('workflow-clicked'),
    onRun: action('workflow-run'),
    onClone: action('workflow-clone'),
    onEdit: action('workflow-edit'),
  },
};

export const RunningWorkflow: Story = {
  args: {
    ...Default.args,
    status: 'running',
    actualRuntime: '1h 23m',
    steps: [
      { ...sampleSteps[0], status: 'completed' },
      { ...sampleSteps[1], status: 'running' },
      { ...sampleSteps[2], status: 'pending' },
      { ...sampleSteps[3], status: 'pending' },
    ],
  },
};

export const CompletedWorkflow: Story = {
  args: {
    ...Default.args,
    status: 'completed',
    actualRuntime: '2h 38m',
    steps: sampleSteps.map(step => ({ ...step, status: 'completed' as const })),
  },
};

export const FailedWorkflow: Story = {
  args: {
    ...Default.args,
    status: 'failed',
    actualRuntime: '45m',
    steps: [
      { ...sampleSteps[0], status: 'completed' },
      { ...sampleSteps[1], status: 'failed' },
      { ...sampleSteps[2], status: 'pending' },
      { ...sampleSteps[3], status: 'pending' },
    ],
  },
};

export const DraftWorkflow: Story = {
  args: {
    ...Default.args,
    status: 'draft',
    name: 'New Molecular Dynamics Study',
    description: 'Protein folding simulation workflow - still being configured.',
    steps: [
      {
        id: 'step1',
        name: 'System Preparation',
        software: 'CHARMM-GUI',
        status: 'pending' as const,
      },
      {
        id: 'step2',
        name: 'MD Simulation',
        software: 'GROMACS',
        status: 'pending' as const,
      },
      {
        id: 'step3',
        name: 'Analysis',
        software: 'MDAnalysis',
        status: 'pending' as const,
      },
    ],
    tags: ['MD', 'Biology', 'Draft'],
    owner: {
      name: 'Prof. Michael Torres',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    },
  },
};

export const NoAvatar: Story = {
  args: {
    ...Default.args,
    owner: {
      name: 'Emily Rodriguez',
    },
  },
};

export const ManySteps: Story = {
  args: {
    ...Default.args,
    name: 'Complex Multi-Physics Simulation',
    steps: [
      { id: 'step1', name: 'Geometry Import', software: 'CAD', status: 'completed' as const },
      { id: 'step2', name: 'Mesh Generation', software: 'Gmsh', status: 'completed' as const },
      { id: 'step3', name: 'Structural Analysis', software: 'Abaqus', status: 'completed' as const },
      { id: 'step4', name: 'Thermal Analysis', software: 'ANSYS', status: 'running' as const },
      { id: 'step5', name: 'CFD Analysis', software: 'OpenFOAM', status: 'pending' as const },
      { id: 'step6', name: 'Optimization', software: 'MATLAB', status: 'pending' as const },
      { id: 'step7', name: 'Post-processing', software: 'ParaView', status: 'pending' as const },
    ],
    tags: ['Multi-physics', 'Optimization', 'Complex', 'Research', 'Long-term'],
  },
};

export const ManyTags: Story = {
  args: {
    ...Default.args,
    tags: ['CFD', 'Aerospace', 'Production', 'Validated', 'Critical', 'High-priority', 'External'],
  },
};

export const NoDescription: Story = {
  args: {
    ...Default.args,
    description: undefined,
  },
};

export const MinimalSteps: Story = {
  args: {
    ...Default.args,
    name: 'Simple Data Processing',
    steps: [
      {
        id: 'step1',
        name: 'Data Analysis',
        software: 'Python',
        status: 'completed' as const,
      },
    ],
    tags: ['Data', 'Simple'],
  },
};

export const WorkflowGrid: Story = {
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
      gap: '16px',
      maxWidth: '1200px'
    }}>
      <WorkflowCard
        id="wf_001"
        name="CFD Wind Tunnel"
        description="Aerodynamic analysis for vehicle design optimization"
        status="running"
        steps={sampleSteps.slice(0, 3)}
        owner={{ name: "Dr. Chen", avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c1c1?w=100&h=100&fit=crop&crop=face" }}
        createdAt={new Date('2024-01-15')}
        tags={['CFD', 'Automotive']}
        onRun={action('run')}
        onClone={action('clone')}
        onEdit={action('edit')}
      />
      
      <WorkflowCard
        id="wf_002"
        name="Molecular Dynamics"
        description="Protein folding simulation study"
        status="completed"
        steps={[
          { id: 's1', name: 'Setup', software: 'CHARMM', status: 'completed' },
          { id: 's2', name: 'Simulation', software: 'GROMACS', status: 'completed' },
        ]}
        owner={{ name: "Prof. Torres" }}
        createdAt={new Date('2024-01-10')}
        actualRuntime="6h 45m"
        tags={['MD', 'Biology']}
        onRun={action('run')}
        onClone={action('clone')}
        onEdit={action('edit')}
      />
      
      <WorkflowCard
        id="wf_003"
        name="Structural Analysis"
        description="FEA stress testing for aerospace components"
        status="failed"
        steps={[
          { id: 's1', name: 'Mesh', software: 'ANSYS', status: 'completed' },
          { id: 's2', name: 'Analysis', software: 'Abaqus', status: 'failed' },
        ]}
        owner={{ name: "Emily Rodriguez", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" }}
        createdAt={new Date('2024-01-12')}
        tags={['FEA', 'Aerospace', 'Urgent']}
        onRun={action('run')}
        onClone={action('clone')}
        onEdit={action('edit')}
      />
      
      <WorkflowCard
        id="wf_004"
        name="Weather Forecasting"
        status="validated"
        steps={[
          { id: 's1', name: 'Data Ingestion', software: 'Python', status: 'pending' },
          { id: 's2', name: 'WRF Model', software: 'WRF', status: 'pending' },
          { id: 's3', name: 'Post-process', software: 'NCL', status: 'pending' },
        ]}
        owner={{ name: "Dr. Liu" }}
        createdAt={new Date('2024-01-14')}
        estimatedRuntime="4h 30m"
        tags={['Weather', 'Daily']}
        onRun={action('run')}
        onClone={action('clone')}
        onEdit={action('edit')}
      />
    </div>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [workflows, setWorkflows] = React.useState<WorkflowCardProps[]>([
      {
        ...(Default.args! as WorkflowCardProps),
        id: 'wf_interactive',
        name: 'Interactive Workflow',
        status: 'validated',
      },
    ]);

    const handleRun = (id: string) => {
      setWorkflows(prev => prev.map(wf => 
        wf.id === id ? { ...wf, status: 'running' } : wf
      ));
      action('workflow-run')();
    };

    const handleClone = (id: string) => {
      const original = workflows.find(wf => wf.id === id);
      if (original) {
        const cloned = {
          ...original,
          id: `${id}_clone_${Date.now()}`,
          name: `${original.name} (Copy)`,
          status: 'draft' as const,
        };
        setWorkflows(prev => [...prev, cloned]);
      }
      action('workflow-clone')();
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ 
          padding: '16px', 
          background: '#f5f5f5', 
          borderRadius: '8px' 
        }}>
          <p><strong>Interactive Demo:</strong> Try running or cloning the workflow below.</p>
          <p>Total workflows: <strong>{workflows.length}</strong></p>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
          gap: '16px' 
        }}>
          {workflows.map(workflow => (
            <WorkflowCard
              key={workflow.id}
              {...workflow}
              onRun={handleRun}
              onClone={handleClone}
              onEdit={action('workflow-edit')}
              onClick={action('workflow-click')}
            />
          ))}
        </div>
      </div>
    );
  },
};