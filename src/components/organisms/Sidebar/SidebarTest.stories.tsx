import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from '../../atoms/Icon';
import { MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined, QuestionCircleOutlined, UserOutlined } from '@ant-design/icons';

const meta: Meta = {
  title: 'Navigation/SidebarIconTest',
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj;

export const DirectAntIcons: Story = {
  render: () => (
    <div>
      <h2>Direct Ant Design Icons (these should always work)</h2>
      <div style={{ display: 'flex', gap: '16px', fontSize: '24px' }}>
        <MenuFoldOutlined />
        <MenuUnfoldOutlined />
        <LogoutOutlined />
        <QuestionCircleOutlined />
        <UserOutlined />
      </div>
    </div>
  ),
};

export const UsingIconComponent: Story = {
  render: () => (
    <div>
      <h2>Using Icon Component</h2>
      <div style={{ display: 'flex', gap: '16px' }}>
        <Icon name="MenuFoldOutlined" size="lg" />
        <Icon name="MenuUnfoldOutlined" size="lg" />
        <Icon name="LogoutOutlined" size="lg" />
        <Icon name="QuestionCircleOutlined" size="lg" />
        <Icon name="UserOutlined" size="lg" />
      </div>
    </div>
  ),
};

export const SidebarIconsInContext: Story = {
  render: () => {
    // Simulate how icons are used in Sidebar
    const iconStyle = { fontSize: '16px', color: '#666' };
    
    return (
      <div>
        <h2>Icons as used in Sidebar Component</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <h3>Collapse/Expand Buttons</h3>
          <button style={{ padding: '8px', marginRight: '8px' }}>
            <Icon name="MenuFoldOutlined" />
          </button>
          <button style={{ padding: '8px' }}>
            <Icon name="MenuUnfoldOutlined" />
          </button>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <h3>User Section Icons</h3>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ padding: '8px', border: '1px solid #ccc' }}>
              <Icon name="UserOutlined" />
              <span> User Avatar</span>
            </div>
            <div style={{ padding: '8px', border: '1px solid #ccc' }}>
              <Icon name="QuestionCircleOutlined" />
              <span> Help</span>
            </div>
            <div style={{ padding: '8px', border: '1px solid #ccc' }}>
              <Icon name="LogoutOutlined" />
              <span> Logout</span>
            </div>
          </div>
        </div>
      </div>
    );
  },
};