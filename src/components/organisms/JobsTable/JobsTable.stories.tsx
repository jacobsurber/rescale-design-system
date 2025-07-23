import type { Meta, StoryObj } from '@storybook/react';
import { message, Button } from 'antd';
import { JobsTable, type Job } from './JobsTable';
import { EyeOutlined, DownloadOutlined } from '@ant-design/icons';

const meta: Meta<typeof JobsTable> = {
  title: 'Organisms/JobsTable',
  component: JobsTable,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A comprehensive table for displaying and managing simulation jobs with status indicators, resource metrics, and bulk actions.',
      },
    },
  },
  argTypes: {
    showSelection: {
      control: { type: 'boolean' },
      description: 'Show selection checkboxes',
    },
    showSearch: {
      control: { type: 'boolean' },
      description: 'Show search functionality',
    },
    showBulkActions: {
      control: { type: 'boolean' },
      description: 'Show bulk action buttons',
    },
  },
};

export default meta;
type Story = StoryObj<typeof JobsTable>;

// Sample job data
const sampleJobs: Job[] = [
  {
    id: 'job-001',
    name: 'Fluid Dynamics Simulation',
    status: 'running',
    priority: 'high',
    progress: 65,
    software: [
      { name: 'OpenFOAM', version: '9.0', logo: '/logos/openfoam.png' },
      { name: 'ParaView', version: '5.9', logo: '/logos/paraview.png' },
    ],
    user: {
      id: 'user-001',
      name: 'Dr. Sarah Chen',
      email: 'sarah.chen@university.edu',
      avatar: '/avatars/sarah.jpg',
    },
    resources: {
      cpu: 85,
      memory: 70,
      storage: 45,
      gpu: 90,
    },
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-15T14:20:00'),
    duration: 240,
    description: 'High-fidelity CFD simulation of turbulent flow around aircraft wing',
    tags: ['CFD', 'Aerospace', 'Turbulence'],
  },
  {
    id: 'job-002',
    name: 'Structural Analysis - Bridge Design',
    status: 'completed',
    priority: 'normal',
    software: [
      { name: 'ANSYS Mechanical', version: '2023 R1', logo: '/logos/ansys.png' },
      { name: 'MATLAB', version: 'R2023a', logo: '/logos/matlab.png' },
    ],
    user: {
      id: 'user-002',
      name: 'Prof. Michael Rodriguez',
      email: 'm.rodriguez@engineering.com',
      avatar: '/avatars/michael.jpg',
    },
    resources: {
      cpu: 0,
      memory: 0,
      storage: 30,
    },
    createdAt: new Date('2024-01-14T08:00:00'),
    updatedAt: new Date('2024-01-14T16:45:00'),
    duration: 525,
    description: 'Finite element analysis of suspension bridge under various load conditions',
    tags: ['FEA', 'Civil Engineering', 'Bridge'],
  },
  {
    id: 'job-003',
    name: 'Climate Model Prediction',
    status: 'failed',
    priority: 'urgent',
    software: [
      { name: 'WRF', version: '4.4', logo: '/logos/wrf.png' },
      { name: 'Python', version: '3.9', logo: '/logos/python.png' },
      { name: 'NCL', version: '6.6', logo: '/logos/ncl.png' },
    ],
    user: {
      id: 'user-003',
      name: 'Dr. Emily Watson',
      email: 'e.watson@climate.org',
      avatar: '/avatars/emily.jpg',
    },
    resources: {
      cpu: 0,
      memory: 0,
      storage: 85,
    },
    createdAt: new Date('2024-01-13T12:15:00'),
    updatedAt: new Date('2024-01-13T18:30:00'),
    duration: 375,
    description: 'Regional climate simulation for extreme weather event prediction',
    tags: ['Climate', 'Weather', 'Prediction'],
  },
  {
    id: 'job-004',
    name: 'Molecular Dynamics - Protein Folding',
    status: 'queued',
    priority: 'normal',
    software: [
      { name: 'GROMACS', version: '2022.4', logo: '/logos/gromacs.png' },
      { name: 'PyMOL', version: '2.5', logo: '/logos/pymol.png' },
    ],
    user: {
      id: 'user-004',
      name: 'Dr. James Liu',
      email: 'j.liu@biochem.edu',
      avatar: '/avatars/james.jpg',
    },
    resources: {
      cpu: 0,
      memory: 0,
      storage: 15,
    },
    createdAt: new Date('2024-01-16T09:45:00'),
    updatedAt: new Date('2024-01-16T09:45:00'),
    description: 'All-atom molecular dynamics simulation of protein folding pathways',
    tags: ['MD', 'Proteins', 'Biochemistry'],
  },
  {
    id: 'job-005',
    name: 'Electromagnetic Field Analysis',
    status: 'paused',
    priority: 'low',
    progress: 35,
    software: [
      { name: 'CST Studio Suite', version: '2023', logo: '/logos/cst.png' },
      { name: 'HFSS', version: '2023 R1', logo: '/logos/hfss.png' },
    ],
    user: {
      id: 'user-005',
      name: 'Dr. Anna Kowalski',
      email: 'a.kowalski@tech.com',
      avatar: '/avatars/anna.jpg',
    },
    resources: {
      cpu: 25,
      memory: 40,
      storage: 20,
      gpu: 15,
    },
    createdAt: new Date('2024-01-12T14:20:00'),
    updatedAt: new Date('2024-01-15T11:10:00'),
    duration: 180,
    description: 'Electromagnetic compatibility analysis for 5G antenna design',
    tags: ['EM', '5G', 'Antenna'],
  },
  {
    id: 'job-006',
    name: 'Quantum Chemistry Calculation',
    status: 'initializing',
    priority: 'high',
    software: [
      { name: 'Gaussian', version: '16', logo: '/logos/gaussian.png' },
      { name: 'GaussView', version: '6.0', logo: '/logos/gaussview.png' },
    ],
    user: {
      id: 'user-006',
      name: 'Prof. David Kim',
      email: 'd.kim@chemistry.edu',
      avatar: '/avatars/david.jpg',
    },
    resources: {
      cpu: 5,
      memory: 10,
      storage: 5,
    },
    createdAt: new Date('2024-01-16T16:00:00'),
    updatedAt: new Date('2024-01-16T16:00:00'),
    description: 'DFT calculations for novel catalyst design optimization',
    tags: ['DFT', 'Catalysis', 'Chemistry'],
  },
];

export const Default: Story = {
  args: {
    jobs: sampleJobs,
    onSelectionChange: (selectedJobIds, selectedJobs) => {
      console.log('Selection changed:', selectedJobIds, selectedJobs);
      message.info(`Selected ${selectedJobIds.length} jobs`);
    },
    onSearch: (searchTerm) => {
      console.log('Search:', searchTerm);
    },
    onJobAction: (action, jobId) => {
      console.log('Job action:', action, jobId);
      message.success(`${action} action triggered for job ${jobId}`);
    },
    onBulkAction: (action, jobIds) => {
      console.log('Bulk action:', action, jobIds);
      message.success(`${action} action triggered for ${jobIds.length} jobs`);
    },
  },
};

export const WithCustomActions: Story = {
  args: {
    ...Default.args,
    customActions: (job) => (
      <Button
        size="small"
        icon={<EyeOutlined />}
        onClick={() => message.info(`View details for ${job.name}`)}
      >
        View
      </Button>
    ),
  },
};

export const NoSelection: Story = {
  args: {
    ...Default.args,
    showSelection: false,
    showBulkActions: false,
  },
};

export const NoSearch: Story = {
  args: {
    ...Default.args,
    showSearch: false,
  },
};

export const MinimalTable: Story = {
  args: {
    ...Default.args,
    showSelection: false,
    showSearch: false,
    showBulkActions: false,
  },
};

export const WithExtraColumns: Story = {
  args: {
    ...Default.args,
    extraColumns: [
      {
        title: 'Cost',
        key: 'cost',
        width: 100,
        render: (_, job) => (
          <span style={{ fontWeight: 'bold', color: '#52c41a' }}>
            ${Math.floor(Math.random() * 500 + 50)}
          </span>
        ),
        sorter: true,
      },
      {
        title: 'Download',
        key: 'download',
        width: 80,
        render: (_, job) => (
          <Button
            size="small"
            icon={<DownloadOutlined />}
            onClick={() => message.info(`Download results for ${job.name}`)}
          />
        ),
      },
    ],
  },
};

export const FilteredByStatus: Story = {
  args: {
    ...Default.args,
    jobs: sampleJobs.filter(job => job.status === 'running' || job.status === 'completed'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Table showing only running and completed jobs as an example of filtered data.',
      },
    },
  },
};

export const EmptyState: Story = {
  args: {
    ...Default.args,
    jobs: [],
  },
};

export const SingleJob: Story = {
  args: {
    ...Default.args,
    jobs: [sampleJobs[0]],
    showBulkActions: false,
  },
};

export const LoadingState: Story = {
  args: {
    ...Default.args,
    loading: true,
  },
};

export const CompactSize: Story = {
  args: {
    ...Default.args,
    size: 'small',
  },
};

export const InteractiveDemo: Story = {
  args: {
    ...Default.args,
    onJobAction: (action, jobId) => {
      const job = sampleJobs.find(j => j.id === jobId);
      message.success(`${action.charAt(0).toUpperCase() + action.slice(1)} action for "${job?.name}"`);
    },
    onBulkAction: (action, jobIds) => {
      message.success(`${action.charAt(0).toUpperCase() + action.slice(1)} action for ${jobIds.length} selected jobs`);
    },
    customActions: (job) => (
      <Button
        size="small"
        type="link"
        onClick={() => message.info(`Quick view: ${job.name}\nStatus: ${job.status}\nUser: ${job.user.name}`)}
      >
        Quick View
      </Button>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo with fully functional actions. Try selecting jobs, using bulk actions, searching, and clicking the action buttons.',
      },
    },
  },
};