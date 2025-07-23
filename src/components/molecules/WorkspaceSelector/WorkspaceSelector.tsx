import React, { useState } from 'react';
import { Select, Avatar, Input, Divider, Empty, Typography } from 'antd';

import styled from 'styled-components';
import { Icon } from '../../atoms/Icon';

export interface Workspace {
  /** Unique identifier */
  id: string;
  /** Workspace name */
  name: string;
  /** Workspace description */
  description?: string;
  /** Workspace icon/logo */
  icon?: string | React.ReactNode;
  /** Workspace type */
  type?: 'personal' | 'team' | 'organization';
  /** Whether workspace is private */
  private?: boolean;
  /** Whether workspace is starred/favorited */
  starred?: boolean;
  /** Last accessed timestamp */
  lastAccessed?: Date;
  /** Number of members (for team workspaces) */
  memberCount?: number;
  /** Workspace owner */
  owner?: string;
}

export interface WorkspaceSelectorProps {
  /** Available workspaces */
  workspaces: Workspace[];
  /** Currently selected workspace */
  selectedWorkspace?: Workspace;
  /** Callback when workspace is selected */
  onSelect?: (workspace: Workspace) => void;
  /** Whether to show recent workspaces section */
  showRecent?: boolean;
  /** Whether search functionality is enabled */
  searchable?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Maximum number of recent workspaces to show */
  maxRecent?: number;
  /** Custom className */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

const StyledSelect = styled(Select)`
  .ant-select-selector {
    padding: var(--rescale-space-2) var(--rescale-space-3) !important;
    min-height: 40px;
    border-radius: var(--rescale-radius-base);
    
    .ant-select-selection-item {
      padding: 0;
      display: flex;
      align-items: center;
    }
  }
  
  .ant-select-arrow {
    color: var(--rescale-color-gray-500);
  }
  
  &:hover .ant-select-selector {
    border-color: var(--rescale-color-brand-blue);
  }
  
  &.ant-select-focused .ant-select-selector {
    border-color: var(--rescale-color-brand-blue);
    box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.1);
  }
`;

const DropdownContent = styled.div`
  .ant-select-item {
    padding: 0;
    
    &:hover {
      background: var(--rescale-color-gray-100);
    }
    
    &.ant-select-item-option-selected {
      background: var(--rescale-color-light-blue);
    }
  }
`;

const SearchContainer = styled.div`
  padding: var(--rescale-space-3);
  border-bottom: 1px solid var(--rescale-color-gray-300);
`;

const SectionTitle = styled.div`
  padding: var(--rescale-space-2) var(--rescale-space-3);
  font-size: var(--rescale-font-size-xs);
  font-weight: var(--rescale-font-weight-semibold);
  color: var(--rescale-color-gray-700);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: var(--rescale-color-gray-50);
  border-bottom: 1px solid var(--rescale-color-gray-200);
`;

const WorkspaceOption = styled.div`
  display: flex;
  align-items: center;
  gap: var(--rescale-space-3);
  padding: var(--rescale-space-3);
  cursor: pointer;
  transition: background var(--rescale-duration-fast);
  
  &:hover {
    background: var(--rescale-color-gray-100);
  }
`;

const WorkspaceIcon = styled.div`
  flex-shrink: 0;
  position: relative;
`;

const WorkspaceInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--rescale-space-1);
`;

const WorkspaceName = styled.div`
  font-size: var(--rescale-font-size-sm);
  font-weight: var(--rescale-font-weight-medium);
  color: var(--rescale-color-gray-900);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: var(--rescale-space-2);
`;

const WorkspaceDescription = styled.div`
  font-size: var(--rescale-font-size-xs);
  color: var(--rescale-color-gray-600);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const WorkspaceMeta = styled.div`
  display: flex;
  align-items: center;
  gap: var(--rescale-space-4);
  font-size: var(--rescale-font-size-xs);
  color: var(--rescale-color-gray-500);
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: var(--rescale-space-1);
`;

const IconBadge = styled.div<{ $type: 'star' | 'private' | 'team' }>`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: ${props => {
    switch (props.$type) {
      case 'star': return 'var(--rescale-color-warning)';
      case 'private': return 'var(--rescale-color-gray-600)';
      case 'team': return 'var(--rescale-color-brand-blue)';
    }
  }};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
`;

const SelectedWorkspace = styled.div`
  display: flex;
  align-items: center;
  gap: var(--rescale-space-2);
  width: 100%;
`;

const SelectedName = styled.span`
  font-size: var(--rescale-font-size-sm);
  font-weight: var(--rescale-font-weight-medium);
  color: var(--rescale-color-gray-900);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SelectedMeta = styled.span`
  font-size: var(--rescale-font-size-xs);
  color: var(--rescale-color-gray-500);
  margin-left: auto;
`;

export const WorkspaceSelector: React.FC<WorkspaceSelectorProps> = ({
  workspaces,
  selectedWorkspace,
  onSelect,
  showRecent = true,
  searchable = true,
  placeholder = 'Select workspace...',
  maxRecent = 5,
  className,
  style,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Sort and filter workspaces
  const recentWorkspaces = workspaces
    .filter(w => w.lastAccessed)
    .sort((a, b) => (b.lastAccessed?.getTime() || 0) - (a.lastAccessed?.getTime() || 0))
    .slice(0, maxRecent);

  const filteredWorkspaces = workspaces.filter(workspace =>
    workspace.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    workspace.description?.toLowerCase().includes(searchValue.toLowerCase())
  );

  const formatLastAccessed = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return `${Math.floor(days / 30)}mo ago`;
  };

  const renderWorkspaceIcon = (workspace: Workspace) => (
    <WorkspaceIcon>
      {typeof workspace.icon === 'string' ? (
        <Avatar size={32} src={workspace.icon} />
      ) : workspace.icon ? (
        <Avatar size={32}>{workspace.icon}</Avatar>
      ) : (
        <Avatar size={32} style={{ backgroundColor: 'var(--rescale-color-brand-blue)' }}>
          {workspace.name.charAt(0).toUpperCase()}
        </Avatar>
      )}
      
      {workspace.starred && (
        <IconBadge $type="star">
          <Icon name="StarOutlined" />
        </IconBadge>
      )}
      
      {workspace.private && (
        <IconBadge $type="private">
          <Icon name="LockOutlined" />
        </IconBadge>
      )}
      
      {workspace.type === 'team' && !workspace.private && (
        <IconBadge $type="team">
          <Icon name="TeamOutlined" />
        </IconBadge>
      )}
    </WorkspaceIcon>
  );

  const renderWorkspaceOption = (workspace: Workspace) => (
    <WorkspaceOption key={workspace.id} onClick={() => onSelect?.(workspace)}>
      {renderWorkspaceIcon(workspace)}
      
      <WorkspaceInfo>
        <WorkspaceName>
          {workspace.name}
          {workspace.type === 'team' && <Icon name="TeamOutlined" />}
          {workspace.private && <Icon name="LockOutlined" />}
        </WorkspaceName>
        
        {workspace.description && (
          <WorkspaceDescription>{workspace.description}</WorkspaceDescription>
        )}
        
        <WorkspaceMeta>
          {workspace.lastAccessed && (
            <MetaItem>
              <Icon name="ClockCircleOutlined" />
              {formatLastAccessed(workspace.lastAccessed)}
            </MetaItem>
          )}
          
          {workspace.memberCount && workspace.memberCount > 1 && (
            <MetaItem>
              <Icon name="TeamOutlined" />
              {workspace.memberCount} members
            </MetaItem>
          )}
          
          {workspace.owner && (
            <MetaItem>
              Owner: {workspace.owner}
            </MetaItem>
          )}
        </WorkspaceMeta>
      </WorkspaceInfo>
    </WorkspaceOption>
  );

  const dropdownRender = () => (
    <DropdownContent>
      {searchable && (
        <SearchContainer>
          <Input
            placeholder="Search workspaces..."
            prefix={<Icon name="SearchOutlined" />}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            bordered={false}
          />
        </SearchContainer>
      )}
      
      {showRecent && recentWorkspaces.length > 0 && !searchValue && (
        <>
          <SectionTitle>Recent Workspaces</SectionTitle>
          {recentWorkspaces.map(renderWorkspaceOption)}
          {workspaces.length > recentWorkspaces.length && <Divider style={{ margin: 0 }} />}
        </>
      )}
      
      {searchValue || !showRecent ? (
        <>
          {searchValue && <SectionTitle>Search Results</SectionTitle>}
          {filteredWorkspaces.length > 0 ? (
            filteredWorkspaces.map(renderWorkspaceOption)
          ) : (
            <div style={{ padding: 'var(--rescale-space-6)' }}>
              <Empty 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No workspaces found"
              />
            </div>
          )}
        </>
      ) : (
        <>
          <SectionTitle>All Workspaces</SectionTitle>
          {workspaces.filter(w => !recentWorkspaces.includes(w)).map(renderWorkspaceOption)}
        </>
      )}
    </DropdownContent>
  );

  return (
    <StyledSelect
      className={className}
      style={style}
      placeholder={placeholder}
      value={selectedWorkspace?.id}
      open={dropdownOpen}
      onDropdownVisibleChange={setDropdownOpen}
      dropdownRender={() => dropdownRender()}
      showSearch={false}
      suffixIcon={<Icon name="FolderOutlined" />}
    >
      {selectedWorkspace && (
        <Select.Option key={selectedWorkspace.id} value={selectedWorkspace.id}>
          <SelectedWorkspace>
            {renderWorkspaceIcon(selectedWorkspace)}
            <SelectedName>{selectedWorkspace.name}</SelectedName>
            <SelectedMeta>
              {selectedWorkspace.type === 'team' ? 'Team' : 'Personal'}
            </SelectedMeta>
          </SelectedWorkspace>
        </Select.Option>
      )}
    </StyledSelect>
  );
};

export default WorkspaceSelector;