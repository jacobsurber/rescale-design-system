import React from 'react';
import { Breadcrumb, Input, Avatar, Button, Tooltip, Badge } from 'antd';

import styled from 'styled-components';
import { Icon } from '../../atoms/Icon';

const { Search } = Input;

interface BreadcrumbItem {
  title: string;
  href?: string;
  onClick?: () => void;
}

export interface TopBarProps {
  /** Breadcrumb navigation items */
  breadcrumbItems?: BreadcrumbItem[];
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Search value */
  searchValue?: string;
  /** Callback when search value changes */
  onSearchChange?: (value: string) => void;
  /** Callback when search is performed */
  onSearch?: (value: string) => void;
  /** User avatar URL */
  userAvatar?: string;
  /** User name for avatar alt text */
  userName?: string;
  /** Notification count */
  notificationCount?: number;
  /** Callback when notifications are clicked */
  onNotificationsClick?: () => void;
  /** Callback when help is clicked */
  onHelpClick?: () => void;
  /** Callback when assistant is clicked */
  onAssistantClick?: () => void;
  /** Callback when user avatar is clicked */
  onUserClick?: () => void;
  /** Whether to show the assistant button */
  showAssistant?: boolean;
  /** Custom className */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

const TopBarContainer = styled.div`
  height: 56px;
  background: #FFFFFF;
  border-bottom: 1px solid #E8E8E8;
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 24px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
`;

const BreadcrumbSection = styled.div`
  flex: 1;
  min-width: 0;
  
  .ant-breadcrumb {
    font-size: var(--rescale-font-size-sm);
    
    .ant-breadcrumb-link {
      color: var(--rescale-color-gray-700);
      text-decoration: none;
      
      &:hover {
        color: var(--rescale-color-brand-blue);
      }
    }
    
    .ant-breadcrumb-separator {
      color: var(--rescale-color-gray-500);
    }
  }
`;

const SearchSection = styled.div`
  width: 300px;
  
  .ant-input-search {
    .ant-input {
      background: var(--rescale-color-gray-100);
      border: 1px solid transparent;
      border-radius: var(--rescale-radius-base);
      height: 32px;
      
      &:focus,
      &:focus-within {
        background: var(--rescale-color-white);
        border-color: var(--rescale-color-brand-blue);
        box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.1);
      }
      
      &::placeholder {
        color: var(--rescale-color-gray-500);
      }
    }
    
    .ant-input-search-button {
      border: none;
      background: transparent;
      color: var(--rescale-color-gray-500);
      
      &:hover {
        color: var(--rescale-color-brand-blue);
      }
    }
  }
  
  @media (max-width: 768px) {
    width: 200px;
  }
  
  @media (max-width: 480px) {
    display: none;
  }
`;

const ActionsSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--rescale-space-3);
`;

const ActionButton = styled(Button)`
  border: none;
  background: transparent;
  color: var(--rescale-color-gray-700);
  padding: var(--rescale-space-2);
  height: 32px;
  width: 32px;
  border-radius: var(--rescale-radius-base);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover,
  &:focus {
    background: var(--rescale-color-gray-100);
    color: var(--rescale-color-brand-blue);
    border: none;
  }
  
  .anticon {
    font-size: 16px;
  }
`;

const AssistantButton = styled(ActionButton)`
  background: var(--rescale-color-brand-blue);
  color: var(--rescale-color-white);
  
  &:hover,
  &:focus {
    background: var(--rescale-color-dark-blue);
    color: var(--rescale-color-white);
  }
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color var(--rescale-duration-normal);
  
  &:hover {
    border-color: var(--rescale-color-brand-blue);
  }
`;

const MobileSearchButton = styled(ActionButton)`
  @media (min-width: 481px) {
    display: none;
  }
`;

export const TopBar: React.FC<TopBarProps> = ({
  breadcrumbItems = [],
  searchPlaceholder = 'Search jobs, workflows, data...',
  searchValue,
  onSearchChange,
  onSearch,
  userAvatar,
  userName = 'User',
  notificationCount = 0,
  onNotificationsClick,
  onHelpClick,
  onAssistantClick,
  onUserClick,
  showAssistant = true,
  className,
  style,
}) => {

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange?.(e.target.value);
  };

  const handleSearch = (value: string) => {
    onSearch?.(value);
  };

  const breadcrumbItemsFormatted = breadcrumbItems.map((item) => ({
    title: item.href ? (
      <a href={item.href} onClick={item.onClick}>
        {item.title}
      </a>
    ) : (
      <span onClick={item.onClick} style={{ cursor: item.onClick ? 'pointer' : 'default' }}>
        {item.title}
      </span>
    ),
  }));

  return (
    <TopBarContainer className={className} style={style}>
      <BreadcrumbSection>
        {breadcrumbItems.length > 0 && (
          <Breadcrumb items={breadcrumbItemsFormatted} />
        )}
      </BreadcrumbSection>

      <SearchSection>
        <Search
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={handleSearchChange}
          onSearch={handleSearch}
          enterButton={<Icon name="SearchOutlined" />}
          allowClear
        />
      </SearchSection>

      <ActionsSection>
        <MobileSearchButton
          icon={<Icon name="SearchOutlined" />}
          onClick={() => {/* Handle mobile search modal */}}
          aria-label="Search"
        />

        <Tooltip title="Notifications">
          <Badge count={notificationCount} size="small">
            <ActionButton
              icon={<Icon name="BellOutlined" />}
              onClick={onNotificationsClick}
              aria-label={`Notifications${notificationCount > 0 ? ` (${notificationCount})` : ''}`}
            />
          </Badge>
        </Tooltip>

        <Tooltip title="Help & Documentation">
          <ActionButton
            icon={<Icon name="QuestionCircleOutlined" />}
            onClick={onHelpClick}
            aria-label="Help"
          />
        </Tooltip>

        {showAssistant && (
          <Tooltip title="AI Assistant">
            <AssistantButton
              icon={<Icon name="RobotOutlined" />}
              onClick={onAssistantClick}
              aria-label="AI Assistant"
            />
          </Tooltip>
        )}

        <Tooltip title={`User: ${userName}`}>
          <UserAvatar
            size={32}
            src={userAvatar}
            icon={!userAvatar && <Icon name="UserOutlined" />}
            onClick={onUserClick}
            alt={userName}
          />
        </Tooltip>
      </ActionsSection>
    </TopBarContainer>
  );
};

export default TopBar;