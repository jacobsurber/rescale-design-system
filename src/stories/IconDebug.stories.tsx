import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from '../components/atoms/Icon';
import * as AntIcons from '@ant-design/icons';

const meta: Meta = {
  title: 'Debug/IconDebug',
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj;

export const SidebarIcons: Story = {
  render: () => {
    const sidebarIcons = [
      'MenuFoldOutlined',
      'MenuUnfoldOutlined',
      'LogoutOutlined',
      'QuestionCircleOutlined',
      'UserOutlined',
    ];

    return (
      <div>
        <h2>Sidebar Icons Debug</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {sidebarIcons.map(iconName => {
            const IconComponent = AntIcons[iconName as keyof typeof AntIcons];
            const exists = typeof IconComponent !== 'undefined';
            
            return (
              <div key={iconName} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px',
                padding: '12px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px'
              }}>
                <div style={{ width: '200px' }}>
                  <strong>{iconName}:</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {exists ? (
                    <>
                      <span>✅ Exists</span>
                      <div style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }}>
                        <Icon name={iconName as any} size="lg" />
                      </div>
                      <span>← Using Icon component</span>
                    </>
                  ) : (
                    <span>❌ Not found</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <h3 style={{ marginTop: '32px' }}>Direct Ant Design Icons (for comparison)</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <AntIcons.MenuFoldOutlined style={{ fontSize: '24px' }} />
          <AntIcons.MenuUnfoldOutlined style={{ fontSize: '24px' }} />
          <AntIcons.LogoutOutlined style={{ fontSize: '24px' }} />
          <AntIcons.QuestionCircleOutlined style={{ fontSize: '24px' }} />
          <AntIcons.UserOutlined style={{ fontSize: '24px' }} />
        </div>
      </div>
    );
  },
};

export const AllIconsUsedInStories: Story = {
  render: () => {
    const allIcons = [
      'PlusOutlined', 'EditOutlined', 'DeleteOutlined', 'DownloadOutlined',
      'SearchOutlined', 'HeartOutlined', 'SaveOutlined', 'UploadOutlined',
      'ShareAltOutlined', 'StarOutlined', 'HomeOutlined', 'ThunderboltOutlined',
      'CrownOutlined', 'LoadingOutlined', 'SyncOutlined', 'ReloadOutlined',
      'ArrowUpOutlined', 'MoreOutlined', 'MessageOutlined', 'ArrowLeftOutlined',
      'ArrowRightOutlined', 'UserOutlined', 'BellOutlined', 'SettingOutlined',
      'PlayCircleOutlined', 'PauseCircleOutlined', 'StopOutlined', 'CheckCircleOutlined',
      'ExclamationCircleOutlined', 'CloseCircleOutlined', 'ClockCircleOutlined',
      'DatabaseOutlined', 'CloudOutlined', 'TeamOutlined', 'BarChartOutlined',
      'TrophyOutlined', 'MenuFoldOutlined', 'MenuUnfoldOutlined', 'LogoutOutlined',
      'QuestionCircleOutlined'
    ];

    return (
      <div>
        <h2>All Icons Used in Stories</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '16px',
          marginTop: '16px'
        }}>
          {allIcons.map(iconName => (
            <div key={iconName} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '16px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              gap: '8px'
            }}>
              <Icon name={iconName as any} size="xl" />
              <span style={{ fontSize: '12px', textAlign: 'center' }}>{iconName}</span>
            </div>
          ))}
        </div>
      </div>
    );
  },
};