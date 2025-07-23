import React, { useState } from 'react';
import { 
  Table, 
  Space, 
  Button, 
  Input, 
  Select, 
  DatePicker, 
  Tag,
  Dropdown,
  MenuProps,
} from 'antd';
import { FilterOutlined, EllipsisOutlined, PauseCircleOutlined, StopOutlined, EyeOutlined,  } from '@ant-design/icons';
import { 
  MainLayout, 
  PageHeader,
  JobStatusIndicator,
  SoftwareLogoGrid,
  ResourceMetrics,
  QuickActions,
} from '../index';
import type { ResourceMetric, SoftwareItem } from '../index';
import styled from 'styled-components';
import { Icon } from '../components/atoms/Icon';

const { RangePicker } = DatePicker;

// Demo data
const mockJobs = [
  {
    id: 'job-001',
    name: 'Aerodynamic Analysis - Wing Design',
    status: 'running' as const,
    progress: 67,
    duration: '2h 15m',
    software: [
      { id: 'ansys-fluent', name: 'ANSYS Fluent', logo: '🌊' },
      { id: 'openfoam', name: 'OpenFOAM', logo: '💨' },
    ] as SoftwareItem[],
    submittedBy: 'Sarah Chen',
    submittedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    priority: 'high',
    resourceMetrics: [
      { type: 'cpu', usage: 78, current: '3.1 GHz', total: '4.0 GHz' },
      { type: 'memory', usage: 65, current: '10.4 GB', total: '16 GB' },
      { type: 'storage', usage: 45, current: '450 GB', total: '1 TB' },
    ] as ResourceMetric[],
  },
  {
    id: 'job-002', 
    name: 'Structural FEA - Turbine Blade',
    status: 'completed' as const,
    duration: '1h 42m',
    software: [
      { id: 'abaqus', name: 'Abaqus', logo: '🔧' },
      { id: 'nastran', name: 'MSC Nastran', logo: '⚙️' },
    ] as SoftwareItem[],
    submittedBy: 'Michael Rodriguez',
    submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    priority: 'medium',
    resourceMetrics: [
      { type: 'cpu', usage: 0, current: '0 GHz', total: '4.0 GHz' },
      { type: 'memory', usage: 0, current: '0 GB', total: '16 GB' },
      { type: 'storage', usage: 55, current: '550 GB', total: '1 TB' },
    ] as ResourceMetric[],
  },
  {
    id: 'job-003',
    name: 'Heat Transfer Simulation',
    status: 'failed' as const,
    duration: '45m',
    software: [
      { id: 'star-ccm', name: 'STAR-CCM+', logo: '🔥' },
    ] as SoftwareItem[],
    submittedBy: 'Lisa Wang',
    submittedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    priority: 'low',
    resourceMetrics: [
      { type: 'cpu', usage: 0, current: '0 GHz', total: '4.0 GHz' },
      { type: 'memory', usage: 0, current: '0 GB', total: '16 GB' },
      { type: 'storage', usage: 23, current: '230 GB', total: '1 TB' },
    ] as ResourceMetric[],
  },
  {
    id: 'job-004',
    name: 'Multi-Phase Flow Analysis',
    status: 'queued' as const,
    software: [
      { id: 'ansys-fluent', name: 'ANSYS Fluent', logo: '🌊' },
      { id: 'matlab', name: 'MATLAB', logo: '📊' },
    ] as SoftwareItem[],
    submittedBy: 'David Kim',
    submittedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    priority: 'high',
    resourceMetrics: [
      { type: 'cpu', usage: 0, current: '0 GHz', total: '4.0 GHz' },
      { type: 'memory', usage: 0, current: '0 GB', total: '16 GB' },
      { type: 'storage', usage: 12, current: '120 GB', total: '1 TB' },
    ] as ResourceMetric[],
  },
];

const FilterContainer = styled.div`
  display: flex;
  gap: var(--rescale-space-3);
  margin-bottom: var(--rescale-space-4);
  flex-wrap: wrap;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const TableContainer = styled.div`
  .ant-table-wrapper {
    border-radius: var(--rescale-radius-base);
    box-shadow: var(--rescale-shadow-base);
  }
  
  .ant-table-thead > tr > th {
    background: var(--rescale-color-gray-50);
    font-weight: var(--rescale-font-weight-semibold);
  }
`;

export function JobsListPage() {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<any>(null);

  const getJobActions = (job: typeof mockJobs[0]): MenuProps['items'] => {
    const baseActions = [
      {
        key: 'view',
        label: 'View Details',
        icon: <EyeOutlined />,
      },
      {
        key: 'edit', 
        label: 'Edit Job',
        icon: <Icon name="EditOutlined" />,
      },
    ];

    const statusActions = {
      running: [
        {
          key: 'pause',
          label: 'Pause Job',
          icon: <PauseCircleOutlined />,
        },
        {
          key: 'stop',
          label: 'Stop Job',
          icon: <StopOutlined />,
          danger: true,
        },
      ],
      queued: [
        {
          key: 'start',
          label: 'Start Job',
          icon: <Icon name="PlayCircleOutlined" />,
        },
      ],
      completed: [],
      failed: [
        {
          key: 'restart',
          label: 'Restart Job', 
          icon: <Icon name="PlayCircleOutlined" />,
        },
      ],
    };

    return [
      ...baseActions,
      ...(statusActions[job.status] || []),
      {
        type: 'divider',
      },
      {
        key: 'delete',
        label: 'Delete Job',
        icon: <Icon name="DeleteOutlined" />,
        danger: true,
      },
    ];
  };

  const columns = [
    {
      title: 'Job Name',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
      render: (name: string) => (
        <Button type="link" style={{ padding: 0, height: 'auto', fontSize: 'inherit' }}>
          {name}
        </Button>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      render: (status: string, record: typeof mockJobs[0]) => (
        <JobStatusIndicator
          status={status as any}
          progress={record.progress}
          duration={record.duration}
          size="small"
        />
      ),
    },
    {
      title: 'Software',
      dataIndex: 'software',
      key: 'software',
      width: '20%',
      render: (software: SoftwareItem[]) => (
        <SoftwareLogoGrid
          items={software}
          maxVisible={3}
          size="small"
          showNames={false}
        />
      ),
    },
    {
      title: 'Resources',
      dataIndex: 'resourceMetrics',
      key: 'resources',
      width: '25%',
      render: (metrics: ResourceMetric[]) => (
        <ResourceMetrics
          metrics={metrics}
          layout="horizontal"
          size="small"
          showDetails={false}
        />
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Tag color={priority === 'high' ? 'red' : priority === 'medium' ? 'orange' : 'default'}>
          {priority.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Submitted By',
      dataIndex: 'submittedBy',
      key: 'submittedBy',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 50,
      render: (_, record: typeof mockJobs[0]) => (
        <Dropdown menu={{ items: getJobActions(record) }} trigger={['click']}>
          <Button icon={<EllipsisOutlined />} type="text" />
        </Dropdown>
      ),
    },
  ];

  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = job.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         job.submittedBy.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;  
    const matchesPriority = priorityFilter === 'all' || job.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <MainLayout>
      <PageHeader
        title="Jobs"
        subTitle={`${filteredJobs.length} jobs`}
        extra={
          <QuickActions
            showDefaults={true}
            layout="horizontal"
            onNewJob={() => console.log('New job')}
            onNewWorkstation={() => console.log('New workstation')}
            onNewWorkflow={() => console.log('New workflow')}
          />
        }
      />
      
      <FilterContainer>
        <Input
          placeholder="Search jobs..."
          prefix={<Icon name="SearchOutlined" />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 250 }}
        />
        
        <Select
          placeholder="Filter by status"
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 150 }}
          options={[
            { label: 'All Status', value: 'all' },
            { label: 'Running', value: 'running' },
            { label: 'Completed', value: 'completed' },
            { label: 'Failed', value: 'failed' },
            { label: 'Queued', value: 'queued' },
          ]}
        />
        
        <Select
          placeholder="Filter by priority"
          value={priorityFilter}
          onChange={setPriorityFilter}
          style={{ width: 150 }}
          options={[
            { label: 'All Priority', value: 'all' },
            { label: 'High', value: 'high' },
            { label: 'Medium', value: 'medium' },
            { label: 'Low', value: 'low' },
          ]}
        />
        
        <RangePicker
          placeholder={['Start date', 'End date']}
          value={dateRange}
          onChange={setDateRange}
        />
        
        <Button icon={<FilterOutlined />}>
          More Filters
        </Button>
      </FilterContainer>

      <TableContainer>
        <Table
          columns={columns}
          dataSource={filteredJobs}
          rowKey="id"
          pagination={{
            total: filteredJobs.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} jobs`,
          }}
          scroll={{ x: 1200 }}
        />
      </TableContainer>
    </MainLayout>
  );
}