import React, { useState, useMemo } from 'react';
import { Tree, Input, Button, Space, Typography, Tooltip, Spin } from 'antd';
import type { TreeProps, TreeDataNode } from 'antd';
import { FolderOutlined, FolderOpenOutlined, FileOutlined, FileTextOutlined, ReloadOutlined,  } from '@ant-design/icons';
import styled from 'styled-components';
import { designTokens } from '../../../theme/tokens';
import { Icon } from '../../atoms/Icon';

const { Search } = Input;
const { Text } = Typography;

// Styled container
const FileBrowserContainer = styled.div`
  border: 1px solid ${designTokens.colors.semantic.border.primary};
  border-radius: ${designTokens.borderRadius.base}px;
  background: ${designTokens.colors.semantic.background.primary};
  overflow: hidden;
`;

const Toolbar = styled.div`
  padding: ${designTokens.spacing[3]}px;
  border-bottom: 1px solid ${designTokens.colors.semantic.border.secondary};
  background: ${designTokens.colors.semantic.background.secondary};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${designTokens.spacing[2]}px;
`;

const TreeContainer = styled.div`
  padding: ${designTokens.spacing[2]}px;
  max-height: 400px;
  overflow-y: auto;
  
  .ant-tree {
    background: transparent;
    
    .ant-tree-node-content-wrapper {
      border-radius: ${designTokens.borderRadius.sm}px;
      transition: ${designTokens.animation.transitions.background};
      
      &:hover {
        background: ${designTokens.colors.semantic.background.hover};
      }
      
      &.ant-tree-node-selected {
        background: ${designTokens.colors.brand.lightBlue};
        
        .ant-tree-title {
          color: ${designTokens.colors.brand.brandBlue};
        }
      }
    }
    
    .ant-tree-title {
      font-size: ${designTokens.typography.fontSize.sm}px;
      color: ${designTokens.colors.semantic.text.primary};
    }
    
    .ant-tree-switcher {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${designTokens.spacing[8]}px ${designTokens.spacing[4]}px;
  color: ${designTokens.colors.semantic.text.muted};
`;

// File type definitions
export interface FileNode {
  key: string;
  title: string;
  type: 'file' | 'folder';
  size?: number;
  modified?: Date;
  extension?: string;
  path: string;
  children?: FileNode[];
  isLeaf?: boolean;
}

export interface FileBrowserProps {
  /** File tree data */
  data: FileNode[];
  /** Currently selected file/folder keys */
  selectedKeys?: string[];
  /** Expanded folder keys */
  expandedKeys?: string[];
  /** Whether multiple selection is allowed */
  multiple?: boolean;
  /** Whether to show search functionality */
  showSearch?: boolean;
  /** Whether to show toolbar actions */
  showActions?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Maximum height of the browser */
  height?: number;
  /** Placeholder text for search */
  searchPlaceholder?: string;
  /** Custom file icons by extension */
  fileIcons?: Record<string, React.ReactNode>;
  /** Callback when files are selected */
  onSelect?: (selectedKeys: string[], info: any) => void;
  /** Callback when folders are expanded/collapsed */
  onExpand?: (expandedKeys: string[], info: any) => void;
  /** Callback when search is performed */
  onSearch?: (value: string) => void;
  /** Callback for refresh action */
  onRefresh?: () => void;
  /** Callback for upload action */
  onUpload?: () => void;
  /** Callback for create folder action */
  onCreateFolder?: () => void;
  /** Custom actions in toolbar */
  actions?: React.ReactNode;
}

// Helper function to get file icon
const getFileIcon = (node: FileNode, customIcons?: Record<string, React.ReactNode>) => {
  if (node.type === 'folder') {
    return <FolderOutlined style={{ color: designTokens.colors.brand.skyBlue }} />;
  }

  const extension = node.extension?.toLowerCase();
  
  // Check custom icons first
  if (customIcons && extension && customIcons[extension]) {
    return customIcons[extension];
  }

  // Default file type icons
  switch (extension) {
    case 'txt':
    case 'md':
    case 'log':
      return <FileTextOutlined style={{ color: designTokens.colors.semantic.text.muted }} />;
    case 'json':
    case 'csv':
    case 'xml':
    case 'sql':
      return <Icon name="DatabaseOutlined" style />;
    default:
      return <FileOutlined style={{ color: designTokens.colors.semantic.text.muted }} />;
  }
};

// Helper function to format file size
const formatFileSize = (bytes?: number) => {
  if (!bytes) return '';
  
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

// Convert FileNode to TreeDataNode
const convertToTreeData = (
  nodes: FileNode[], 
  customIcons?: Record<string, React.ReactNode>,
  searchValue?: string
): TreeDataNode[] => {
  return nodes.map(node => {
    const isMatch = searchValue ? 
      node.title.toLowerCase().includes(searchValue.toLowerCase()) : true;
    
    if (!isMatch && node.type === 'file') {
      return null;
    }

    const icon = getFileIcon(node, customIcons);
    const sizeText = node.size ? formatFileSize(node.size) : '';
    
    const titleElement = (
      <Space size="small">
        {icon}
        <Text>{node.title}</Text>
        {sizeText && (
          <Text type="secondary" style={{ fontSize: designTokens.typography.fontSize.xs }}>
            {sizeText}
          </Text>
        )}
      </Space>
    );

    return {
      key: node.key,
      title: titleElement,
      icon,
      isLeaf: node.type === 'file',
      children: node.children ? convertToTreeData(node.children, customIcons, searchValue) : undefined,
    };
  }).filter(Boolean) as TreeDataNode[];
};

/**
 * FileBrowser - A comprehensive file browser component with tree view
 * 
 * Features:
 * - File and folder tree navigation
 * - Search functionality
 * - File type icons
 * - Size display
 * - Toolbar actions (refresh, upload, create folder)
 * - Custom file icons support
 * - Accessibility support
 */
export const FileBrowser: React.FC<FileBrowserProps> = ({
  data,
  selectedKeys = [],
  expandedKeys,
  multiple = false,
  showSearch = true,
  showActions = true,
  loading = false,
  height = 400,
  searchPlaceholder = 'Search files...',
  fileIcons,
  onSelect,
  onExpand,
  onSearch,
  onRefresh,
  onUpload,
  onCreateFolder,
  actions,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [internalExpandedKeys, setInternalExpandedKeys] = useState<string[]>(expandedKeys || []);

  // Memoized tree data based on search
  const treeData = useMemo(() => {
    return convertToTreeData(data, fileIcons, searchValue);
  }, [data, fileIcons, searchValue]);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchValue(value);
    onSearch?.(value);
  };

  // Handle tree expand
  const handleExpand = (keys: React.Key[], info: any) => {
    const stringKeys = keys.map(k => String(k));
    setInternalExpandedKeys(stringKeys);
    onExpand?.(stringKeys, info);
  };

  // Handle tree select
  const handleSelect = (keys: React.Key[], info: any) => {
    const stringKeys = keys.map(k => String(k));
    onSelect?.(stringKeys, info);
  };

  const currentExpandedKeys = expandedKeys || internalExpandedKeys;

  return (
    <FileBrowserContainer style={{ height }}>
      {(showSearch || showActions) && (
        <Toolbar>
          <div style={{ flex: 1 }}>
            {showSearch && (
              <Search
                placeholder={searchPlaceholder}
                allowClear
                prefix={<Icon name="SearchOutlined" />}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ maxWidth: 300 }}
              />
            )}
          </div>
          
          {showActions && (
            <Space>
              {actions}
              {onRefresh && (
                <Tooltip title="Refresh">
                  <Button 
                    icon={<ReloadOutlined />} 
                    size="small"
                    onClick={onRefresh}
                  />
                </Tooltip>
              )}
              {onCreateFolder && (
                <Tooltip title="Create Folder">
                  <Button 
                    icon={<Icon name="PlusOutlined" />} 
                    size="small"
                    onClick={onCreateFolder}
                  />
                </Tooltip>
              )}
              {onUpload && (
                <Tooltip title="Upload Files">
                  <Button 
                    icon={<Icon name="UploadOutlined" />} 
                    size="small"
                    type="primary"
                    onClick={onUpload}
                  />
                </Tooltip>
              )}
            </Space>
          )}
        </Toolbar>
      )}
      
      <TreeContainer>
        {loading ? (
          <div style={{ textAlign: 'center', padding: designTokens.spacing[8] }}>
            <Spin size="large" />
          </div>
        ) : treeData.length > 0 ? (
          <Tree
            treeData={treeData}
            selectedKeys={selectedKeys}
            expandedKeys={currentExpandedKeys}
            multiple={multiple}
            showIcon
            onSelect={handleSelect}
            onExpand={handleExpand}
            switcherIcon={({ expanded, isLeaf }) => {
              if (isLeaf) return null;
              return expanded ? <FolderOpenOutlined /> : <FolderOutlined />;
            }}
          />
        ) : (
          <EmptyState>
            <Text type="secondary">
              {searchValue ? 'No files match your search' : 'No files to display'}
            </Text>
          </EmptyState>
        )}
      </TreeContainer>
    </FileBrowserContainer>
  );
};

export default FileBrowser;