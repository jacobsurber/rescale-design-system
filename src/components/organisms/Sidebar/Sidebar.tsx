import React from 'react';
import { Menu, Avatar, Typography, Tooltip } from 'antd';
import styled from 'styled-components';
import { Icon } from '../../atoms/Icon';

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
  width: ${props => props.$collapsed ? '64px' : '240px'};
  min-height: 100vh;
  background: var(--rescale-color-white);
  border-right: 1px solid var(--rescale-color-gray-300);
  display: flex;
  flex-direction: column;
  transition: width var(--rescale-duration-normal) var(--rescale-easing-ease-in-out);
  position: relative;

  .ant-menu {
    border-right: none;
    flex: 1;
    
    .ant-menu-item {
      height: 44px;
      line-height: 44px;
      margin: 0;
      border-radius: 0;
      
      &.ant-menu-item-selected {
        background-color: var(--rescale-color-light-blue);
        color: var(--rescale-color-brand-blue);
        
        .ant-menu-item-icon {
          color: var(--rescale-color-brand-blue);
        }
      }
      
      &:hover:not(.ant-menu-item-selected) {
        background-color: var(--rescale-color-gray-100);
      }
    }
    
    .ant-menu-submenu-title {
      height: 44px;
      line-height: 44px;
      margin: 0;
      border-radius: 0;
      
      &:hover {
        background-color: var(--rescale-color-gray-100);
      }
    }
  }
`;

const SidebarHeader = styled.div<{ $collapsed: boolean }>`
  padding: var(--rescale-space-4);
  display: flex;
  align-items: center;
  justify-content: ${props => props.$collapsed ? 'center' : 'space-between'};
  border-bottom: 1px solid var(--rescale-color-gray-300);
  height: 56px;
`;

const Logo = styled.div<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: var(--rescale-space-3);
  
  .logo-text {
    font-weight: var(--rescale-font-weight-bold);
    font-size: var(--rescale-font-size-lg);
    color: var(--rescale-color-brand-blue);
    display: ${props => props.$collapsed ? 'none' : 'block'};
  }
  
  .logo-icon {
    width: 32px;
    height: 32px;
    background: var(--rescale-color-brand-blue);
    border-radius: var(--rescale-radius-base);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: var(--rescale-font-weight-bold);
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
  padding: var(--rescale-space-4);
  border-top: 1px solid var(--rescale-color-gray-300);
  display: flex;
  flex-direction: column;
  gap: var(--rescale-space-2);
`;

const UserProfile = styled.div<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: var(--rescale-space-3);
  padding: var(--rescale-space-3);
  border-radius: var(--rescale-radius-base);
  cursor: pointer;
  transition: background-color var(--rescale-duration-normal);
  
  &:hover {
    background-color: var(--rescale-color-gray-100);
  }
  
  .user-info {
    display: ${props => props.$collapsed ? 'none' : 'flex'};
    flex-direction: column;
    flex: 1;
    
    .user-name {
      font-weight: var(--rescale-font-weight-medium);
      color: var(--rescale-color-gray-900);
      font-size: var(--rescale-font-size-sm);
    }
    
    .user-email {
      color: var(--rescale-color-gray-500);
      font-size: var(--rescale-font-size-xs);
    }
  }
`;

const UserActions = styled.div<{ $collapsed: boolean }>`
  display: flex;
  gap: var(--rescale-space-1);
  justify-content: ${props => props.$collapsed ? 'center' : 'flex-start'};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: var(--rescale-space-2);
  cursor: pointer;
  border-radius: var(--rescale-radius-base);
  color: var(--rescale-color-gray-500);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: var(--rescale-color-gray-100);
    color: var(--rescale-color-brand-blue);
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
            <Icon name="MenuFoldOutlined" />
          </CollapseButton>
        )}
        {collapsed && (
          <Tooltip title="Expand sidebar" placement="right">
            <CollapseButton onClick={handleCollapseToggle} aria-label="Expand sidebar">
              <Icon name="MenuUnfoldOutlined" />
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
              icon={!userProfile.avatar && <Icon name="UserOutlined" />}
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
                    <Icon name="QuestionCircleOutlined" />
                  </ActionButton>
                </Tooltip>
                <Tooltip title="Logout" placement="right">
                  <ActionButton onClick={onLogoutClick} aria-label="Logout">
                    <Icon name="LogoutOutlined" />
                  </ActionButton>
                </Tooltip>
              </>
            ) : (
              <>
                <ActionButton onClick={onHelpClick} aria-label="Help">
                  <Icon name="QuestionCircleOutlined" />
                </ActionButton>
                <ActionButton onClick={onLogoutClick} aria-label="Logout">
                  <Icon name="LogoutOutlined" />
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