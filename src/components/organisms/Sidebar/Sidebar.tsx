import React from 'react';
import { Menu, Avatar, Typography, Tooltip } from 'antd';
import styled from 'styled-components';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, QuestionCircleOutlined, LogoutOutlined, DisconnectOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface MenuItem {
  key: string;
  icon?: React.ReactNode;
  label: string;
  children?: MenuItem[];
  disabled?: boolean;
}

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

export interface SidebarProps {
  /** Menu items to display */
  items: MenuItem[];
  /** Currently selected menu key */
  selectedKey?: string;
  /** Callback when menu item is selected */
  onSelect?: (key: string) => void;
  /** Whether sidebar is collapsed */
  collapsed?: boolean;
  /** Callback when collapse state changes */
  onCollapse?: (collapsed: boolean) => void;
  /** User profile information */
  userProfile?: UserProfile;
  /** Callback when user profile is clicked */
  onUserProfileClick?: () => void;
  /** Callback when logout is clicked */
  onLogoutClick?: () => void;
  /** Callback when help is clicked */
  onHelpClick?: () => void;
  /** Custom className */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

const SidebarContainer = styled.div<{ $collapsed: boolean }>`
  width: ${props => props.$collapsed ? '64px' : '248px'};
  min-height: 100vh;
  background: #FFFFFF;
  border-right: 1px solid #F0F0F0;
  display: flex;
  flex-direction: column;
  transition: width 0.2s ease;
  position: relative;
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  .ant-menu {
    border-right: none;
    flex: 1;
    background: transparent;
    padding: 16px 0;
    
    // Section headers (like "Rescale Data", "Rescale AI")
    .section-header {
      padding: 8px 24px 4px 24px;
      font-size: 12px;
      font-weight: 500;
      color: #8F99B8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 16px;
      
      &:first-child {
        margin-top: 0;
      }
    }
    
    .ant-menu-item {
      height: 36px;
      line-height: 36px;
      margin: 1px 16px;
      border-radius: 6px;
      padding: 0 12px;
      font-size: 14px;
      font-weight: 400;
      color: #000000;
      
      &.ant-menu-item-selected {
        background-color: #E5F4FF;
        color: #0272C3;
        
        .ant-menu-item-icon {
          color: #0272C3;
        }
        
        &::after {
          display: none;
        }
      }
      
      &:hover:not(.ant-menu-item-selected) {
        background-color: #F8F9FA;
        color: #000000;
      }
      
      .ant-menu-item-icon {
        color: #0272C3;
        font-size: 16px;
        margin-right: 8px;
        min-width: 16px;
      }
    }
    
    .workspace-item {
      height: 44px;
      margin: 4px 16px;
      padding: 0 12px;
      border-radius: 8px;
      font-weight: 500;
      background-color: #F8F9FA;
      border: 1px solid #E9ECEF;
      
      .workspace-icon {
        width: 24px;
        height: 24px;
        background: #0272C3;
        border-radius: 4px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-right: 8px;
        
        &::after {
          content: '📁';
          font-size: 12px;
        }
      }
    }
  }
`;

const SidebarHeader = styled.div<{ $collapsed: boolean }>`
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: ${props => props.$collapsed ? 'center' : 'flex-start'};
  border-bottom: 1px solid #F0F0F0;
  height: 60px;
  background: #FFFFFF;
`;

const Logo = styled.div<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  
  .logo-text {
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 16px;
    color: #000000;
    display: ${props => props.$collapsed ? 'none' : 'block'};
  }
  
  .logo-icon {
    width: 24px;
    height: 24px;
    background: #0272C3;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 400;
    font-size: 12px;
    position: relative;
    
    // Rescale cloud icon approximation
    &::before {
      content: '☁';
      font-size: 14px;
    }
  }
`;

const CollapseButton = styled.button`
  background: none;
  border: none;
  padding: var(--rescale-space-2);
  cursor: pointer;
  border-radius: var(--rescale-radius-base);
  color: var(--rescale-color-gray-700);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: var(--rescale-color-gray-100);
    color: var(--rescale-color-brand-blue);
  }
`;

const UserSection = styled.div<{ $collapsed: boolean }>`
  padding: 16px 24px;
  border-top: 1px solid #F0F0F0;
  background: #FFFFFF;
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  .footer-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 0;
    font-size: 14px;
    color: #0272C3;
    cursor: pointer;
    
    &:hover {
      background-color: #F8F9FA;
      border-radius: 4px;
      padding: 6px 8px;
      margin: 0 -8px;
    }
    
    .footer-icon {
      width: 16px;
      font-size: 14px;
      color: #0272C3;
    }
  }
  
  .submit-feedback {
    background: #0272C3;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    margin: 8px 0;
    
    &:hover {
      background: #025AA3;
    }
  }
  
  .user-email {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 0;
    font-size: 14px;
    color: #000000;
    
    .user-avatar {
      width: 24px;
      height: 24px;
      background: #0272C3;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 12px;
      font-weight: 500;
    }
  }
`;

const UserProfile = styled.div<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #F3F7FF;
  }
  
  .user-info {
    display: ${props => props.$collapsed ? 'none' : 'flex'};
    flex-direction: column;
    flex: 1;
    
    .user-name {
      font-family: 'Roboto', sans-serif;
      font-weight: 500;
      color: #000000;
      font-size: 14px;
      line-height: 20px;
    }
    
    .user-email {
      color: #767676;
      font-size: 12px;
      line-height: 16px;
    }
  }
`;

const UserActions = styled.div<{ $collapsed: boolean }>`
  display: flex;
  gap: 8px;
  justify-content: ${props => props.$collapsed ? 'center' : 'flex-start'};
  margin-top: 8px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: 6px;
  color: #8F99B8;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #F3F7FF;
    color: #0272C3;
  }
`;

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  selectedKey,
  onSelect,
  collapsed = false,
  onCollapse,
  userProfile,
  onUserProfileClick,
  onLogoutClick,
  onHelpClick,
  className,
  style,
}) => {

  const handleMenuSelect = ({ key }: { key: string }) => {
    onSelect?.(key);
  };

  const handleCollapseToggle = () => {
    onCollapse?.(!collapsed);
  };

  const renderMenuItem = (item: MenuItem) => {
    if (item.children && item.children.length > 0) {
      return {
        key: item.key,
        icon: item.icon,
        label: item.label,
        disabled: item.disabled,
        children: item.children.map(child => ({
          key: child.key,
          icon: child.icon,
          label: child.label,
          disabled: child.disabled,
        })),
      };
    }
    
    return {
      key: item.key,
      icon: item.icon,
      label: item.label,
      disabled: item.disabled,
    };
  };

  const menuItems = items.map(renderMenuItem);

  return (
    <SidebarContainer $collapsed={collapsed} className={className} style={style}>
      <SidebarHeader $collapsed={collapsed}>
        <Logo $collapsed={collapsed}>
          <div className="logo-icon"></div>
          <span className="logo-text">rescale</span>
        </Logo>
        {!collapsed && (
          <CollapseButton onClick={handleCollapseToggle} aria-label="Collapse sidebar">
            <MenuFoldOutlined />
          </CollapseButton>
        )}
        {collapsed && (
          <Tooltip title="Expand sidebar" placement="right">
            <CollapseButton onClick={handleCollapseToggle} aria-label="Expand sidebar">
              <MenuUnfoldOutlined />
            </CollapseButton>
          </Tooltip>
        )}
      </SidebarHeader>

      <Menu
        mode="inline"
        selectedKeys={selectedKey ? [selectedKey] : []}
        items={menuItems}
        onSelect={handleMenuSelect}
        inlineCollapsed={collapsed}
      />

      <UserSection $collapsed={collapsed}>
        {!collapsed && (
          <>
            <div className="footer-item" onClick={onHelpClick}>
              <span className="footer-icon">💡</span>
              Help
            </div>
            
            <div className="footer-item">
              <span className="footer-icon">🔄</span>
              Disable New UI
            </div>
            
            <button className="submit-feedback">
              Submit Feedback
            </button>
            
            {userProfile && (
              <div className="user-email">
                <div className="user-avatar">
                  {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
                </div>
                {userProfile.email}
              </div>
            )}
          </>
        )}
      </UserSection>
    </SidebarContainer>
  );
};

export default Sidebar;