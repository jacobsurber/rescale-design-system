import type { Meta, StoryObj } from '@storybook/react';
import { JobsTable, type Job } from './JobsTable';
import { designTokens } from '../../../theme/tokens';

const meta: Meta<typeof JobsTable> = {
  title: 'Organisms/JobsTable/Figma Exact Match',
  component: JobsTable,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'JobsTable component configured to exactly match the Figma design specification',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof JobsTable>;

// Sample jobs data that matches the Figma interface structure
const figmaMatchJobs: Job[] = [
  {
    id: 'TFEBC',
    name: 'Second Canopy Wall Crash test',
    status: 'completed',
    priority: 'normal',
    software: [
      { name: 'LS-DYNA', version: '11.0', logo: '/logos/lsdyna.png' },
    ],
    user: {
      id: 'user-001',
      name: 'Dr. Sarah Chen',
      email: 'sarah.chen@rescale.com',
      avatar: '/avatars/sarah.jpg',
    },
    resources: {
      cpu: 0,
      memory: 0,
      storage: 45,
    },
    createdAt: new Date('2023-05-18T18:00:00'),
    updatedAt: new Date('2023-05-18T18:00:00'),
    duration: 48.02,
    description: 'Crash simulation analysis',
    tags: ['compute', 'insights-libs'],
    folder: 'Folder Name',
    runTime: '48.02:25',
    type: 'Job',
  },
  {
    id: 'TFEBC',
    name: 'Second Canopy Wall Crash test',
    status: 'completed',
    priority: 'normal', 
    software: [
      { name: 'LS-DYNA', version: '11.0', logo: '/logos/lsdyna.png' },
    ],
    user: {
      id: 'user-002',
      name: 'Dr. Sarah Chen',
      email: 'sarah.chen@rescale.com',
      avatar: '/avatars/sarah.jpg',
    },
    resources: {
      cpu: 0,
      memory: 0,
      storage: 45,
    },
    createdAt: new Date('2023-05-18T18:00:00'),
    updatedAt: new Date('2023-05-18T18:00:00'),
    duration: 48.02,
    description: 'Crash simulation analysis',
    tags: ['compute', 'insights-libs'],
    folder: 'Folder Name',
    runTime: '48.02:25',
    type: 'Job',
  },
  // Repeat for all visible rows in Figma...
  {
    id: 'TFEBC',
    name: 'Second Canopy Wall Crash test',
    status: 'completed',
    priority: 'normal',
    software: [
      { name: 'LS-DYNA', version: '11.0', logo: '/logos/lsdyna.png' },
    ],
    user: {
      id: 'user-003',
      name: 'Dr. Sarah Chen',
      email: 'sarah.chen@rescale.com',
      avatar: '/avatars/sarah.jpg',
    },
    resources: {
      cpu: 0,
      memory: 0,
      storage: 45,
    },
    createdAt: new Date('2023-05-18T18:00:00'),
    updatedAt: new Date('2023-05-18T18:00:00'),
    duration: 48.02,
    description: 'Crash simulation analysis',
    tags: ['compute', 'insights-libs'],
    folder: 'Folder Name',
    runTime: '48.02:25',
    type: 'Job',
  },
];

/**
 * Exact replica of the Figma workspace table design
 * Matches column layout, spacing, colors, and typography precisely
 */
export const FigmaExactMatch: Story = {
  args: {
    jobs: figmaMatchJobs,
    showSelection: true,
    showSearch: false,
    showBulkActions: false,
    size: 'middle',
    // Custom columns to match Figma exactly
    extraColumns: [
      {
        title: 'Type',
        key: 'type',
        width: 80,
        render: (_, job) => (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <div style={{
              width: '16px',
              height: '16px',
              backgroundColor: designTokens.colors.primary.rescaleBlue,
              borderRadius: '2px'
            }} />
            <span style={{
              fontSize: '14px',
              fontFamily: designTokens.typography.fontFamily.primary,
              color: designTokens.colors.neutral.characterPrimary
            }}>
              {job.type || 'Job'}
            </span>
          </div>
        ),
      },
      {
        title: 'Folder',
        key: 'folder', 
        width: 120,
        render: (_, job) => (
          <span style={{
            fontSize: '14px',
            fontFamily: designTokens.typography.fontFamily.primary,
            color: designTokens.colors.neutral.characterPrimary
          }}>
            {job.folder || 'Folder Name'}
          </span>
        ),
      },
      {
        title: 'ID',
        key: 'id',
        width: 80,
        render: (_, job) => (
          <span style={{
            fontSize: '14px',
            fontFamily: 'monospace',
            color: designTokens.colors.neutral.characterPrimary,
          }}>
            {job.id}
          </span>
        ),
      },
      {
        title: 'Run Time',
        key: 'runTime',
        width: 100,
        render: (_, job) => (
          <span style={{
            fontSize: '14px',
            fontFamily: 'monospace',
            color: designTokens.colors.neutral.characterPrimary,
          }}>
            {job.runTime || '48.02:25'}
          </span>
        ),
      },
      {
        title: 'Tags', 
        key: 'tags',
        width: 150,
        render: (_, job) => (
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {job.tags?.map((tag, index) => {
              const isCompute = tag === 'compute';
              const isInsights = tag.includes('insights');
              
              return (
                <div
                  key={index}
                  style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontFamily: designTokens.typography.fontFamily.primary,
                    backgroundColor: isInsights ? '#FF6B6B' : designTokens.colors.status.tagBlue,
                    color: designTokens.colors.neutral.white,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {tag}
                </div>
              );
            })}
          </div>
        ),
      },
    ],
  },
  render: (args) => (
    <div style={{
      width: '100%',
      height: '100vh',
      backgroundColor: designTokens.colors.neutral.white,
      padding: 0,
      margin: 0,
    }}>
      <JobsTable {...args} />
    </div>
  ),
};

/**
 * Story that demonstrates the precise visual match to Figma
 * with proper spacing, typography, and color matching
 */
export const FigmaWorkspaceReplication: Story = {
  args: {
    ...FigmaExactMatch.args,
    jobs: Array(12).fill(null).map((_, index) => ({
      ...figmaMatchJobs[0],
      id: `TFEBC${index}`,
      name: 'Second Canopy Wall Crash test',
      user: {
        ...figmaMatchJobs[0].user,
        id: `user-${index}`,
      },
    })),
  },
  render: (args) => (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#F8F9FA', // Match Figma page background
      fontFamily: designTokens.typography.fontFamily.primary,
    }}>
      {/* Match the exact layout structure from Figma */}
      <div style={{
        backgroundColor: designTokens.colors.neutral.white,
        margin: 0,
        padding: 0,
        minHeight: '100vh'
      }}>
        <JobsTable {...args} 
          style={{
            margin: 0,
            padding: 0,
          }}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'This story precisely replicates the Figma workspace table design with exact column layout, colors, and typography.',
      },
    },
  },
};