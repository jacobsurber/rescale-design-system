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
  width: ${props => props.$collapsed ? '64px' : '280px'};
  min-height: 100vh;
  background: #FFFFFF;
  border-right: 1px solid #E9F0FF;
  display: flex;
  flex-direction: column;
  transition: width 0.2s ease;
  position: relative;
  font-family: 'Roboto', sans-serif;

  .ant-menu {
    border-right: none;
    flex: 1;
    background: transparent;
    padding: 8px 0;
    
    .ant-menu-item {
      height: 40px;
      line-height: 40px;
      margin: 2px 12px;
      border-radius: 8px;
      padding: 0 16px;
      font-size: 14px;
      font-weight: 400;
      color: #606D95;
      
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
        background-color: #F3F7FF;
        color: #606D95;
      }
      
      .ant-menu-item-icon {
        color: #8F99B8;
        font-size: 16px;
        margin-right: 12px;
      }
    }
    
    .ant-menu-submenu {
      .ant-menu-submenu-title {
        height: 40px;
        line-height: 40px;
        margin: 2px 12px;
        border-radius: 8px;
        padding: 0 16px;
        font-size: 14px;
        font-weight: 500;
        color: #606D95;
        
        &:hover {
          background-color: #F3F7FF;
        }
        
        .ant-menu-submenu-arrow {
          color: #8F99B8;
        }
      }
      
      .ant-menu-sub {
        background: transparent;
        
        .ant-menu-item {
          margin-left: 32px;
          padding-left: 32px;
          
          &::before {
            content: '';
            position: absolute;
            left: 24px;
            top: 50%;
            transform: translateY(-50%);
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background-color: #A5B2D3;
          }
        }
      }
    }
  }
`;

const SidebarHeader = styled.div<{ $collapsed: boolean }>`
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: ${props => props.$collapsed ? 'center' : 'flex-start'};
  border-bottom: 1px solid #E9F0FF;
  height: 64px;
  background: #FFFFFF;
`;

const Logo = styled.div<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  
  .logo-text {
    font-family: 'Roboto', sans-serif;
    font-weight: 500;
    font-size: 18px;
    color: #000000;
    display: ${props => props.$collapsed ? 'none' : 'block'};
  }
  
  .logo-icon {
    width: 32px;
    height: 32px;
    background: #3399BB;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 500;
    font-size: 16px;
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
  padding: 16px 20px;
  border-top: 1px solid #E9F0FF;
  background: #FFFFFF;
  margin-top: auto;
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
          <div className="logo-icon">R</div>
          <span className="logo-text">Rescale</span>
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

      {userProfile && (
        <UserSection $collapsed={collapsed}>
          <UserProfile $collapsed={collapsed} onClick={onUserProfileClick}>
            <Avatar 
              size={32} 
              src={userProfile.avatar} 
              icon={!userProfile.avatar && <UserOutlined />}
            />
            <div className="user-info">
              <Text className="user-name">{userProfile.name}</Text>
              <Text className="user-email">{userProfile.email}</Text>
            </div>
          </UserProfile>

          <UserActions $collapsed={collapsed}>
            {collapsed ? (
              <>
                <Tooltip title="Help" placement="right">
                  <ActionButton onClick={onHelpClick} aria-label="Help">
                    <QuestionCircleOutlined />
                  </ActionButton>
                </Tooltip>
                <Tooltip title="Logout" placement="right">
                  <ActionButton onClick={onLogoutClick} aria-label="Logout">
                    <LogoutOutlined />
                  </ActionButton>
                </Tooltip>
              </>
            ) : (
              <>
                <ActionButton onClick={onHelpClick} aria-label="Help">
                  <QuestionCircleOutlined />
                </ActionButton>
                <ActionButton onClick={onLogoutClick} aria-label="Logout">
                  <LogoutOutlined />
                </ActionButton>
              </>
            )}
          </UserActions>
        </UserSection>
      )}
    </SidebarContainer>
  );
};

export default Sidebar;