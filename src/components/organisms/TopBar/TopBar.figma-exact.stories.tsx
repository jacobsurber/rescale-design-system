import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TopBar } from './TopBar';
import { designTokens } from '../../../theme/tokens';

const meta: Meta<typeof TopBar> = {
  title: 'Navigation/TopBar/Figma Exact Match',
  component: TopBar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'TopBar component styled to exactly match the Figma workspace design',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TopBar>;

/**
 * Exact replica of the Figma workspace TopBar design
 * Matches the breadcrumb, button layout, and user profile section
 */
export const FigmaWorkspaceTopBar: Story = {
  args: {
    breadcrumbItems: [
      { title: 'Workspace', href: '/workspace' },
    ],
    searchPlaceholder: 'Search...',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c1c1?w=100&h=100&fit=crop&crop=face',
    userName: 'John Doe',
    notificationCount: 0,
    showAssistant: false,
    onSearchChange: (value) => console.log('Search:', value),
    onSearch: (value) => console.log('Search submitted:', value),
    onNotificationsClick: () => console.log('Notifications clicked'),
    onHelpClick: () => console.log('Help clicked'),
    onUserClick: () => console.log('User clicked'),
  },
  render: (args) => (
    <div style={{
      width: '100%',
      height: '100vh',
      backgroundColor: '#F8F9FA',
      margin: 0,
      padding: 0,
    }}>
      <TopBar {...args} />
      
      {/* Mock the workspace content area */}
      <div style={{
        padding: '24px',
        height: 'calc(100vh - 56px)',
        backgroundColor: '#FFFFFF',
        fontFamily: designTokens.typography.fontFamily.primary,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '24px',
          padding: '12px 0',
          borderBottom: '1px solid #E8E8E8'
        }}>
          {/* Workspace navigation buttons that match Figma */}
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            border: '1px solid #D9D9D9',
            borderRadius: '6px',
            backgroundColor: '#FFFFFF',
            fontSize: '14px',
            fontFamily: designTokens.typography.fontFamily.primary,
            color: '#333333',
            cursor: 'pointer'
          }}>
            📄 New Job
          </button>
          
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            border: '1px solid #D9D9D9',
            borderRadius: '6px',
            backgroundColor: '#FFFFFF',
            fontSize: '14px',
            fontFamily: designTokens.typography.fontFamily.primary,
            color: '#333333',
            cursor: 'pointer'
          }}>
            🔬 New Workstation
          </button>
          
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            border: '1px solid #D9D9D9',
            borderRadius: '6px',
            backgroundColor: '#FFFFFF',
            fontSize: '14px',
            fontFamily: designTokens.typography.fontFamily.primary,
            color: '#333333',
            cursor: 'pointer'
          }}>
            📊 New Workflow
          </button>
          
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            border: '1px solid #D9D9D9',
            borderRadius: '6px',
            backgroundColor: '#FFFFFF',
            fontSize: '14px',
            fontFamily: designTokens.typography.fontFamily.primary,
            color: '#333333',
            cursor: 'pointer'
          }}>
            💾 New Storage Device
          </button>
        </div>
        
        {/* Tab navigation that matches Figma */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #E8E8E8',
          marginBottom: '24px'
        }}>
          {['Overview', 'Jobs', 'Workstations', 'Files'].map((tab, index) => (
            <button
              key={tab}
              style={{
                padding: '12px 16px',
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: '14px',
                fontFamily: designTokens.typography.fontFamily.primary,
                color: index === 1 ? designTokens.colors.primary.rescaleBlue : '#666666',
                borderBottom: index === 1 ? `2px solid ${designTokens.colors.primary.rescaleBlue}` : '2px solid transparent',
                cursor: 'pointer',
                fontWeight: index === 1 ? '500' : '400'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#333333',
          marginBottom: '16px'
        }}>
          Recent Workloads
        </div>
        
        <div style={{
          color: '#666666',
          fontSize: '14px'
        }}>
          This area would contain the JobsTable component with the exact Figma styling
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete workspace interface that exactly matches the Figma design, including TopBar, navigation, and content layout.',
      },
    },
  },
};