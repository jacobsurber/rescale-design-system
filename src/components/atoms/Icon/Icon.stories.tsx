import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Icon, iconSizes, type IconSize, type IconColor, type AntIconName } from './Icon';
import { Space, Row, Col, Input, Divider } from 'antd';

const meta: Meta<typeof Icon> = {
  title: 'Atoms/Icon',
  component: Icon,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Standardized icon component wrapping Ant Design icons with consistent sizing, theming, and interaction support.',
      },
    },
  },
  argTypes: {
    name: {
      control: { type: 'text' },
      description: 'Ant Design icon name',
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Size of the icon',
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'disabled', 'inherit'],
      description: 'Color theme of the icon',
    },
    spin: {
      control: { type: 'boolean' },
      description: 'Whether the icon should spin',
    },
    clickable: {
      control: { type: 'boolean' },
      description: 'Whether the icon is clickable with hover effects',
    },
    rotate: {
      control: { type: 'number' },
      description: 'Rotation angle in degrees',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: {
    name: 'HomeOutlined',
    size: 'md',
    color: 'inherit',
  },
};

export const AllSizes: Story = {
  render: () => (
    <Space direction="vertical" size="large">
      <div>
        <h3 style={{ marginBottom: 16 }}>Icon Sizes</h3>
        <Space align="center" size="large">
          {Object.entries(iconSizes).map(([size, config]) => (
            <div key={size} style={{ textAlign: 'center' }}>
              <Icon name="HomeOutlined" size={size as IconSize} />
              <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                {size.toUpperCase()}
              </div>
              <div style={{ fontSize: 10, color: '#999' }}>
                {config.size}
              </div>
            </div>
          ))}
        </Space>
      </div>
    </Space>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete size system from xs (12px) to 2xl (32px) with consistent proportions.',
      },
    },
  },
};

export const ColorThemes: Story = {
  render: () => {
    const colors: IconColor[] = ['primary', 'secondary', 'success', 'warning', 'error', 'disabled', 'inherit'];
    
    return (
      <Space direction="vertical" size="large">
        <div>
          <h3 style={{ marginBottom: 16 }}>Color Themes</h3>
          <Space wrap size="large">
            {colors.map(color => (
              <div key={color} style={{ textAlign: 'center' }}>
                <Icon name="StarOutlined" size="lg" color={color} />
                <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                  {color}
                </div>
              </div>
            ))}
          </Space>
        </div>
        
        <div>
          <h3 style={{ marginBottom: 16 }}>Custom Colors</h3>
          <Space wrap size="large">
            <div style={{ textAlign: 'center' }}>
              <Icon name="HeartOutlined" size="lg" color="#ff1890" />
              <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                Custom Pink
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Icon name="ThunderboltOutlined" size="lg" color="#722ed1" />
              <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                Custom Purple
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Icon name="CrownOutlined" size="lg" color="#faad14" />
              <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                Custom Gold
              </div>
            </div>
          </Space>
        </div>
      </Space>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Theme colors and custom color support for consistent iconography.',
      },
    },
  },
};

export const CommonIcons: Story = {
  render: () => {
    const commonIcons: { category: string; icons: AntIconName[] }[] = [
      {
        category: 'Navigation',
        icons: ['HomeOutlined', 'MenuOutlined', 'ArrowLeftOutlined', 'ArrowRightOutlined', 'SearchOutlined', 'FilterOutlined'],
      },
      {
        category: 'Actions',
        icons: ['PlusOutlined', 'EditOutlined', 'DeleteOutlined', 'SaveOutlined', 'DownloadOutlined', 'UploadOutlined'],
      },
      {
        category: 'Status',
        icons: ['CheckOutlined', 'CloseOutlined', 'WarningOutlined', 'InfoCircleOutlined', 'LoadingOutlined', 'SyncOutlined'],
      },
      {
        category: 'User & Communication',
        icons: ['UserOutlined', 'TeamOutlined', 'BellOutlined', 'MessageOutlined', 'ShareAltOutlined', 'HeartOutlined'],
      },
      {
        category: 'System & Data',
        icons: ['CloudOutlined', 'DatabaseOutlined', 'ApiOutlined', 'SettingOutlined', 'BugOutlined', 'ThunderboltOutlined'],
      },
      {
        category: 'Files & Media',
        icons: ['FileOutlined', 'FileImageOutlined', 'VideoCameraOutlined', 'PictureOutlined', 'FileTextOutlined', 'FilePdfOutlined'],
      },
    ];
    
    return (
      <Space direction="vertical" size="large">
        <h3>Common Icons by Category</h3>
        {commonIcons.map(({ category, icons }) => (
          <div key={category}>
            <h4 style={{ marginBottom: 12, color: '#666' }}>{category}</h4>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
              gap: '12px',
              marginBottom: 24 
            }}>
              {icons.map(iconName => (
                <div 
                  key={iconName} 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    padding: '8px',
                    border: '1px solid #f0f0f0',
                    borderRadius: '4px',
                    textAlign: 'center'
                  }}
                >
                  <Icon name={iconName} size="lg" color="primary" />
                  <div style={{ fontSize: 10, color: '#666', marginTop: 4, wordBreak: 'break-all' }}>
                    {iconName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Space>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Catalog of commonly used icons organized by category for easy reference.',
      },
    },
  },
};

export const InteractiveIcons: Story = {
  render: () => {
    const [clickCount, setClickCount] = React.useState(0);
    
    return (
      <Space direction="vertical" size="large">
        <div>
          <h3 style={{ marginBottom: 16 }}>Interactive Icons</h3>
          
          <div style={{ marginBottom: 24 }}>
            <h4>Clickable Icons</h4>
            <Space size="large">
              <Icon 
                name="HeartOutlined" 
                size="lg" 
                color="error" 
                clickable 
                onClick={() => setClickCount(prev => prev + 1)}
              />
              <Icon 
                name="StarOutlined" 
                size="lg" 
                color="warning" 
                clickable 
                onClick={() => alert('Star clicked!')}
              />
              <Icon 
                name="ShareAltOutlined" 
                size="lg" 
                color="primary" 
                clickable 
                onClick={() => alert('Share clicked!')}
              />
            </Space>
            <p style={{ fontSize: 14, color: '#666', marginTop: 8 }}>
              Heart clicked: {clickCount} times
            </p>
          </div>
          
          <div style={{ marginBottom: 24 }}>
            <h4>Spinning Icons</h4>
            <Space size="large">
              <Icon name="LoadingOutlined" size="lg" color="primary" spin />
              <Icon name="SyncOutlined" size="lg" color="success" spin />
              <Icon name="ReloadOutlined" size="lg" color="warning" spin />
            </Space>
          </div>
          
          <div>
            <h4>Rotated Icons</h4>
            <Space size="large">
              <Icon name="ArrowUpOutlined" size="lg" color="primary" />
              <Icon name="ArrowUpOutlined" size="lg" color="primary" rotate={45} />
              <Icon name="ArrowUpOutlined" size="lg" color="primary" rotate={90} />
              <Icon name="ArrowUpOutlined" size="lg" color="primary" rotate={135} />
              <Icon name="ArrowUpOutlined" size="lg" color="primary" rotate={180} />
            </Space>
          </div>
        </div>
      </Space>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive icon behaviors including clickable, spinning, and rotation effects.',
      },
    },
  },
};

export const IconButtons: Story = {
  render: () => (
    <Space direction="vertical" size="large">
      <div>
        <h3 style={{ marginBottom: 16 }}>Icon Buttons</h3>
        
        <div style={{ marginBottom: 24 }}>
          <h4>Toolbar Icons</h4>
          <Space>
            <Icon name="EditOutlined" size="md" clickable onClick={() => alert('Edit')} />
            <Icon name="DeleteOutlined" size="md" color="error" clickable onClick={() => alert('Delete')} />
            <Icon name="DownloadOutlined" size="md" clickable onClick={() => alert('Download')} />
            <Icon name="ShareAltOutlined" size="md" clickable onClick={() => alert('Share')} />
            <Icon name="MoreOutlined" size="md" clickable onClick={() => alert('More')} />
          </Space>
        </div>
        
        <div style={{ marginBottom: 24 }}>
          <h4>Social Actions</h4>
          <Space size="large">
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon name="HeartOutlined" size="sm" color="error" clickable />
              <span style={{ fontSize: 14 }}>24</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon name="ShareAltOutlined" size="sm" color="primary" clickable />
              <span style={{ fontSize: 14 }}>Share</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon name="MessageOutlined" size="sm" color="secondary" clickable />
              <span style={{ fontSize: 14 }}>12</span>
            </div>
          </Space>
        </div>
        
        <div>
          <h4>Navigation Icons</h4>
          <Space>
            <Icon name="ArrowLeftOutlined" size="lg" clickable onClick={() => alert('Previous')} />
            <Icon name="HomeOutlined" size="lg" color="primary" clickable onClick={() => alert('Home')} />
            <Icon name="ArrowRightOutlined" size="lg" clickable onClick={() => alert('Next')} />
          </Space>
        </div>
      </div>
    </Space>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Icon buttons for common interface patterns like toolbars, social actions, and navigation.',
      },
    },
  },
};

export const IconSearch: Story = {
  render: () => {
    const [searchTerm, setSearchTerm] = React.useState('');
    
    // Comprehensive list of commonly used icons
    const allIcons: AntIconName[] = [
      'HomeOutlined', 'UserOutlined', 'SettingOutlined', 'SearchOutlined', 'MenuOutlined',
      'PlusOutlined', 'EditOutlined', 'DeleteOutlined', 'SaveOutlined', 'CloseOutlined',
      'CheckOutlined', 'WarningOutlined', 'InfoCircleOutlined', 'QuestionCircleOutlined',
      'HeartOutlined', 'StarOutlined', 'ShareAltOutlined', 'DownloadOutlined', 'UploadOutlined',
      'CloudOutlined', 'DatabaseOutlined', 'ApiOutlined', 'CodeOutlined', 'BugOutlined',
      'FileOutlined', 'FileImageOutlined', 'FileTextOutlined', 'FilePdfOutlined',
      'BellOutlined', 'MessageOutlined', 'TeamOutlined', 'CrownOutlined', 'TrophyOutlined',
      'ThunderboltOutlined', 'FireOutlined', 'EyeOutlined', 'LockOutlined', 'UnlockOutlined',
      'CalendarOutlined', 'ClockCircleOutlined', 'EnvironmentOutlined', 'PhoneOutlined',
      'MailOutlined', 'GlobalOutlined', 'WifiOutlined', 'MobileOutlined', 'TabletOutlined',
      'ArrowLeftOutlined', 'ArrowRightOutlined', 'ArrowUpOutlined', 'ArrowDownOutlined',
      'LoadingOutlined', 'SyncOutlined', 'ReloadOutlined', 'PlayCircleOutlined', 'PauseCircleOutlined',
    ];
    
    const filteredIcons = allIcons.filter(icon => 
      icon.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return (
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <h3 style={{ marginBottom: 16 }}>Icon Search</h3>
          <Input
            placeholder="Search icons (e.g., home, user, edit)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<Icon name="SearchOutlined" />}
            style={{ maxWidth: 400, marginBottom: 16 }}
          />
          
          <div style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>
            Found {filteredIcons.length} icons
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
            gap: '12px',
            maxHeight: '400px',
            overflowY: 'auto',
            border: '1px solid #f0f0f0',
            borderRadius: '4px',
            padding: '16px'
          }}>
            {filteredIcons.map(iconName => (
              <div 
                key={iconName} 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  padding: '12px 8px',
                  border: '1px solid #f0f0f0',
                  borderRadius: '4px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#0272c3';
                  e.currentTarget.style.backgroundColor = '#f3f7ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#f0f0f0';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                onClick={() => {
                  navigator.clipboard.writeText(`<Icon name="${iconName}" />`);
                  alert(`Copied: <Icon name="${iconName}" />`);
                }}
              >
                <Icon name={iconName} size="lg" color="primary" />
                <div style={{ fontSize: 10, color: '#666', marginTop: 6, wordBreak: 'break-all' }}>
                  {iconName}
                </div>
              </div>
            ))}
          </div>
          
          <p style={{ fontSize: 12, color: '#999', marginTop: 16 }}>
            Click any icon to copy its usage code to clipboard
          </p>
        </div>
      </Space>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Searchable icon catalog with click-to-copy functionality for development workflow.',
      },
    },
  },
};

export const AccessibilityDemo: Story = {
  render: () => (
    <Space direction="vertical" size="large">
      <div>
        <h3 style={{ marginBottom: 16 }}>Accessibility Features</h3>
        
        <div style={{ marginBottom: 24 }}>
          <h4>Proper ARIA Labels</h4>
          <Space>
            <Icon 
              name="UserOutlined" 
              size="lg" 
              clickable 
              aria-label="User profile"
              onClick={() => alert('Profile opened')}
            />
            <Icon 
              name="BellOutlined" 
              size="lg" 
              clickable 
              aria-label="Notifications (3 unread)"
              onClick={() => alert('Notifications opened')}
            />
            <Icon 
              name="SettingOutlined" 
              size="lg" 
              clickable 
              aria-label="Settings and preferences"
              onClick={() => alert('Settings opened')}
            />
          </Space>
        </div>
        
        <div style={{ marginBottom: 24 }}>
          <h4>Keyboard Navigation</h4>
          <p style={{ fontSize: 14, color: '#666', marginBottom: 12 }}>
            Use Tab to navigate and Enter/Space to activate clickable icons:
          </p>
          <Space>
            <Icon name="PlayCircleOutlined" size="lg" color="success" clickable onClick={() => alert('Play')} />
            <Icon name="PauseCircleOutlined" size="lg" color="warning" clickable onClick={() => alert('Pause')} />
            <Icon name="StopOutlined" size="lg" color="error" clickable onClick={() => alert('Stop')} />
          </Space>
        </div>
        
        <div>
          <h4>Status Indicators</h4>
          <Space direction="vertical">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="CheckCircleOutlined" size="md" color="success" />
              <span>Task completed successfully</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="ExclamationCircleOutlined" size="md" color="warning" />
              <span>Warning: Review required</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="CloseCircleOutlined" size="md" color="error" />
              <span>Error: Action failed</span>
            </div>
          </Space>
        </div>
      </div>
    </Space>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Accessibility features including ARIA labels, keyboard navigation, and semantic usage.',
      },
    },
  },
};