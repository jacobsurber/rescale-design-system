import React, { useState, useMemo } from 'react';
import { Table, Space, Button, Dropdown, Checkbox, Input, Tag, Avatar, Tooltip } from 'antd';
import type { TableProps, ColumnsType } from 'antd/es/table';

import styled from 'styled-components';
import { JobStatusIndicator } from '../../molecules/JobStatusIndicator';
import { ResourceMetrics } from '../../molecules/ResourceMetrics';
import { SoftwareLogoGrid } from '../SoftwareLogoGrid';
import { designTokens } from '../../../theme/tokens';
import { Icon } from '../../atoms/Icon';

const StyledTable = styled(Table)`
  /* Table header styling to match Figma */
  .ant-table-thead > tr > th {
    background: ${designTokens.colors.neutral.white};
    border-bottom: 1px solid ${designTokens.colors.neutral.gray200};
    font-family: ${designTokens.typography.fontFamily.primary};
    font-size: ${designTokens.typography.fontSize.sm}px;
    font-weight: ${designTokens.typography.fontWeight.medium};
    color: ${designTokens.colors.neutral.characterPrimary};
    padding: 12px 16px;
    height: 44px; /* Match Figma row height */
  }
  
  /* Table body styling to match Figma */
  .ant-table-tbody > tr > td {
    font-family: ${designTokens.typography.fontFamily.primary};
    font-size: ${designTokens.typography.fontSize.sm}px;
    color: ${designTokens.colors.neutral.characterPrimary};
    padding: 12px 16px;
    height: 44px; /* Match Figma row height */
    border-bottom: 1px solid ${designTokens.colors.neutral.gray200};
  }
  
  .ant-table-tbody > tr {
    background: ${designTokens.colors.neutral.white};
    
    &:hover > td {
      background: ${designTokens.colors.primary.goldenPurple1};
    }
  }
  
  /* Selection styling */
  .ant-table-row-selected > td {
    background: ${designTokens.colors.primary.lightBlue} !important;
  }
  
  /* Remove default Ant Design borders and spacing */
  .ant-table-container {
    border: none;
  }
  
  .ant-table {
    border: none;
    background: ${designTokens.colors.neutral.white};
  }
  
  /* Ensure proper spacing matches Figma */
  .ant-table-cell {
    vertical-align: middle;
  }
`;

const ActionButton = styled(Button)`
  border: none;
  box-shadow: none;
  padding: ${designTokens.spacing[1]}px ${designTokens.spacing[2]}px;
  
  &:hover {
    background: ${designTokens.colors.semantic.background.hover};
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${designTokens.spacing[2]}px;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-weight: ${designTokens.typography.fontWeight.medium};
  color: ${designTokens.colors.semantic.text.primary};
  font-size: ${designTokens.typography.fontSize.sm}px;
`;

const UserEmail = styled.span`
  color: ${designTokens.colors.semantic.text.muted};
  font-size: ${designTokens.typography.fontSize.xs}px;
`;

// Job status type
export type JobStatus = 
  | 'running' 
  | 'completed' 
  | 'failed' 
  | 'queued' 
  | 'paused' 
  | 'cancelled' 
  | 'initializing'
  | 'terminating';

// Job priority type
export type JobPriority = 'low' | 'normal' | 'high' | 'urgent';

// Software interface
export interface Software {
  name: string;
  version?: string;
  logo?: string;
}

// User interface
export interface JobUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Resource usage interface
export interface ResourceUsage {
  cpu: number;
  memory: number;
  storage?: number;
  gpu?: number;
}

// Job interface
export interface Job {
  id: string;
  name: string;
  status: JobStatus;
  priority: JobPriority;
  software: Software[];
  user: JobUser;
  resources: ResourceUsage;
  createdAt: Date;
  updatedAt: Date;
  duration?: number; // in minutes
  progress?: number; // percentage
  description?: string;
  tags?: string[];
  
  // Additional fields from Figma design
  folder?: string;
  runTime?: string;
  type?: string;
}

export interface JobsTableProps extends Omit<TableProps<Job>, 'dataSource' | 'columns'> {
  /** Job data */
  jobs: Job[];
  /** Selected job IDs */
  selectedJobIds?: string[];
  /** Whether to show selection checkboxes */
  showSelection?: boolean;
  /** Whether to show search */
  showSearch?: boolean;
  /** Whether to show bulk actions */
  showBulkActions?: boolean;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Custom action buttons */
  customActions?: (job: Job) => React.ReactNode;
  /** Callback when jobs are selected */
  onSelectionChange?: (selectedJobIds: string[], selectedJobs: Job[]) => void;
  /** Callback when search changes */
  onSearch?: (searchTerm: string) => void;
  /** Action callbacks */
  onJobAction?: (action: string, jobId: string) => void;
  onBulkAction?: (action: string, jobIds: string[]) => void;
  /** Custom columns to add */
  extraColumns?: ColumnsType<Job>;
}

/**
 * JobsTable - A comprehensive table for displaying and managing simulation jobs
 * 
 * Features:
 * - Job status indicators with colors and icons
 * - Resource usage metrics
 * - Software logos with overflow handling
 * - User information with avatars
 * - Bulk selection and actions
 * - Search and filtering
 * - Action menus for individual jobs
 * - Responsive design
 */
export const JobsTable: React.FC<JobsTableProps> = ({
  jobs,
  selectedJobIds = [],
  showSelection = true,
  showSearch = true,
  showBulkActions = true,
  searchPlaceholder = 'Search jobs...',
  customActions,
  onSelectionChange,
  onSearch,
  onJobAction,
  onBulkAction,
  extraColumns = [],
  ...tableProps
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter jobs based on search
  const filteredJobs = useMemo(() => {
    if (!searchTerm) return jobs;
    
    const term = searchTerm.toLowerCase();
    return jobs.filter(job => 
      job.name.toLowerCase().includes(term) ||
      job.user.name.toLowerCase().includes(term) ||
      job.user.email.toLowerCase().includes(term) ||
      job.software.some(sw => sw.name.toLowerCase().includes(term)) ||
      job.description?.toLowerCase().includes(term) ||
      job.tags?.some(tag => tag.toLowerCase().includes(term))
    );
  }, [jobs, searchTerm]);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch?.(value);
  };

  // Handle row selection
  const handleSelectionChange = (selectedRowKeys: React.Key[], selectedRows: Job[]) => {
    const selectedIds = selectedRowKeys.map(key => String(key));
    onSelectionChange?.(selectedIds, selectedRows);
  };

  // Job action handlers
  const handleJobAction = (action: string, jobId: string) => {
    onJobAction?.(action, jobId);
  };

  // Bulk action handlers
  const handleBulkAction = (action: string) => {
    onBulkAction?.(action, selectedJobIds);
  };

  // Job action menu items
  const getJobActions = (job: Job) => [
    {
      key: 'view',
      label: 'View Details',
      icon: <Icon name="EyeOutlined" />,
      onClick: () => handleJobAction('view', job.id),
    },
    {
      key: 'start',
      label: 'Start',
      icon: <Icon name="PlayCircleOutlined" />,
      disabled: job.status === 'running',
      onClick: () => handleJobAction('start', job.id),
    },
    {
      key: 'pause',
      label: 'Pause',
      icon: <Icon name="PauseCircleOutlined" />,
      disabled: job.status !== 'running',
      onClick: () => handleJobAction('pause', job.id),
    },
    {
      key: 'stop',
      label: 'Stop',
      icon: <Icon name="StopOutlined" />,
      disabled: !['running', 'queued', 'paused'].includes(job.status),
      onClick: () => handleJobAction('stop', job.id),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: <Icon name="DeleteOutlined" />,
      danger: true,
      onClick: () => handleJobAction('delete', job.id),
    },
  ];

  // Bulk action menu items
  const bulkActions = [
    {
      key: 'start',
      label: 'Start Selected',
      icon: <Icon name="PlayCircleOutlined" />,
      onClick: () => handleBulkAction('start'),
    },
    {
      key: 'pause',
      label: 'Pause Selected',
      icon: <Icon name="PauseCircleOutlined" />,
      onClick: () => handleBulkAction('pause'),
    },
    {
      key: 'stop',
      label: 'Stop Selected',
      icon: <Icon name="StopOutlined" />,
      onClick: () => handleBulkAction('stop'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'delete',
      label: 'Delete Selected',
      icon: <Icon name="DeleteOutlined" />,
      danger: true,
      onClick: () => handleBulkAction('delete'),
    },
  ];

  // Table columns
  const columns: ColumnsType<Job> = [
    {
      title: 'Job Name',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      render: (name: string, job: Job) => (
        <div>
          <div style={{ fontWeight: designTokens.typography.fontWeight.medium }}>
            {name}
          </div>
          {job.description && (
            <div style={{ 
              fontSize: designTokens.typography.fontSize.xs,
              color: designTokens.colors.semantic.text.muted,
              marginTop: designTokens.spacing[1],
            }}>
              {job.description}
            </div>
          )}
          {job.tags && job.tags.length > 0 && (
            <div style={{ marginTop: designTokens.spacing[1] }}>
              {job.tags.map(tag => (
                <Tag key={tag} size="small" style={{ marginRight: designTokens.spacing[1] }}>
                  {tag}
                </Tag>
              ))}
            </div>
          )}
        </div>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: JobStatus, job: Job) => (
        <JobStatusIndicator 
          status={status} 
          progress={job.progress}
          showProgress={status === 'running' && job.progress !== undefined}
        />
      ),
      filters: [
        { text: 'Running', value: 'running' },
        { text: 'Completed', value: 'completed' },
        { text: 'Failed', value: 'failed' },
        { text: 'Queued', value: 'queued' },
        { text: 'Paused', value: 'paused' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Software',
      dataIndex: 'software',
      key: 'software',
      width: 200,
      render: (software: Software[]) => (
        <SoftwareLogoGrid 
          items={software.map((s, index) => ({
            id: `${s.name}-${index}`,
            name: s.name,
            logo: s.logo,
            software: s.name,
            version: s.version,
          }))}
          maxVisible={3}
          size="small"
        />
      ),
    },
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      width: 180,
      render: (user: JobUser) => (
        <UserInfo>
          <Avatar 
            src={user.avatar} 
            size="small"
            style={{ backgroundColor: designTokens.colors.brand.brandBlue }}
          >
            {user.name.charAt(0).toUpperCase()}
          </Avatar>
          <UserDetails>
            <UserName>{user.name}</UserName>
            <UserEmail>{user.email}</UserEmail>
          </UserDetails>
        </UserInfo>
      ),
      sorter: (a, b) => a.user.name.localeCompare(b.user.name),
    },
    {
      title: 'Resources',
      dataIndex: 'resources',
      key: 'resources',
      width: 150,
      render: (resources: ResourceUsage) => {
        const metrics = [
          { type: 'cpu' as const, usage: resources.cpu || 0, label: 'CPU' },
          { type: 'memory' as const, usage: resources.memory || 0, label: 'Memory' },
          ...(resources.storage ? [{ type: 'storage' as const, usage: resources.storage, label: 'Storage' }] : []),
          ...(resources.gpu ? [{ type: 'network' as const, usage: resources.gpu, label: 'GPU' }] : []),
        ].filter(metric => metric.usage > 0);
        
        return (
          <ResourceMetrics 
            metrics={metrics}
            size="small"
            layout="horizontal"
            showDetails={false}
          />
        );
      },
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: Date) => (
        <Tooltip title={date.toLocaleString()}>
          <span style={{ fontSize: designTokens.typography.fontSize.xs }}>
            {date.toLocaleDateString()}
          </span>
        </Tooltip>
      ),
      sorter: (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    },
    ...extraColumns,
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      fixed: 'right' as const,
      render: (_, job: Job) => (
        <Space>
          {customActions?.(job)}
          <Dropdown 
            menu={{ items: getJobActions(job) }}
            trigger={['click']}
            placement="bottomRight"
          >
            <ActionButton 
              icon={<Icon name="MoreOutlined" />} 
              size="small"
              aria-label={`Actions for ${job.name}`}
            />
          </Dropdown>
        </Space>
      ),
    },
  ];

  // Row selection configuration
  const rowSelection = showSelection ? {
    selectedRowKeys: selectedJobIds,
    onChange: handleSelectionChange,
    getCheckboxProps: (record: Job) => ({
      name: record.name,
    }),
  } : undefined;

  return (
    <div>
      {(showSearch || showBulkActions) && (
        <div style={{ 
          marginBottom: designTokens.spacing[4],
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: designTokens.spacing[3],
        }}>
          {showSearch && (
            <Input.Search
              placeholder={searchPlaceholder}
              allowClear
              onChange={(e) => handleSearch(e.target.value)}
              onSearch={handleSearch}
              style={{ maxWidth: 400 }}
              prefix={<Icon name="SearchOutlined" />}
            />
          )}
          
          {showBulkActions && selectedJobIds.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing[2] }}>
              <span style={{ 
                fontSize: designTokens.typography.fontSize.sm,
                color: designTokens.colors.semantic.text.muted,
              }}>
                {selectedJobIds.length} selected
              </span>
              <Dropdown 
                menu={{ items: bulkActions }}
                trigger={['click']}
              >
                <Button size="small">
                  Bulk Actions
                </Button>
              </Dropdown>
            </div>
          )}
        </div>
      )}
      
      <StyledTable
        {...tableProps}
        dataSource={filteredJobs}
        columns={columns}
        rowKey="id"
        rowSelection={rowSelection}
        scroll={{ x: 1200 }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} jobs`,
          ...tableProps.pagination,
        }}
      />
    </div>
  );
};

export default JobsTable;