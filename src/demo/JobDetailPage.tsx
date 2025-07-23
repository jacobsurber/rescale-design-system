import React, { useState } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Tabs, 
  Button,
  Space,
  Progress,
  Statistic,
  Timeline,
  Alert,
  Descriptions,
  Typography,
  Tag,
  Dropdown,
  MenuProps,
} from 'antd';
import { PauseCircleOutlined, StopOutlined, EllipsisOutlined, ExclamationCircleOutlined, SyncOutlined,  } from '@ant-design/icons';
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

const { Text } = Typography;
const { TabPane } = Tabs;

// Mock job data
const mockJob = {
  id: 'job-001',
  name: 'Aerodynamic Analysis - Wing Design',
  description: 'High-fidelity CFD simulation of wing aerodynamics at various angles of attack and Reynolds numbers.',
  status: 'running' as const,
  progress: 67,
  duration: '2h 15m',
  estimatedCompletion: '45m remaining',
  software: [
    { 
      id: 'ansys-fluent', 
      name: 'ANSYS Fluent', 
      version: '2024.1',
      logo: '🌊',
      description: 'Computational Fluid Dynamics solver'
    },
    { 
      id: 'openfoam', 
      name: 'OpenFOAM', 
      version: '11.0',
      logo: '💨',
      description: 'Open source CFD toolbox'
    },
  ] as SoftwareItem[],
  submittedBy: 'Sarah Chen',
  submittedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
  priority: 'high',
  workspace: 'Aerospace Team',
  tags: ['CFD', 'Wing Design', 'Production'],
  resourceMetrics: [
    { type: 'cpu', usage: 78, current: '3.1 GHz', total: '4.0 GHz', unit: 'GHz' },
    { type: 'memory', usage: 65, current: '10.4 GB', total: '16 GB', unit: 'GB' },
    { type: 'storage', usage: 45, current: '450 GB', total: '1 TB', unit: 'GB' },
    { type: 'network', usage: 23, current: '23 MB/s', total: '100 MB/s', unit: 'MB/s' },
  ] as ResourceMetric[],
  configuration: {
    meshSize: 2000000,
    timeStep: 0.001,
    iterations: 5000,
    solverType: 'Pressure-Based',
    turbulenceModel: 'k-epsilon',
  },
  timeline: [
    {
      time: '3h 15m ago',
      title: 'Job Submitted',
      description: 'Job submitted by Sarah Chen',
      status: 'completed',
      icon: <Icon name="CheckCircleOutlined" />,
    },
    {
      time: '3h 10m ago', 
      title: 'Validation Passed',
      description: 'Input files validated successfully',
      status: 'completed',
      icon: <Icon name="CheckCircleOutlined" />,
    },
    {
      time: '3h 5m ago',
      title: 'Resources Allocated',
      description: '16 cores, 32 GB RAM allocated',
      status: 'completed',
      icon: <Icon name="CheckCircleOutlined" />,
    },
    {
      time: '3h ago',
      title: 'Simulation Started', 
      description: 'CFD solver initialized',
      status: 'completed',
      icon: <Icon name="CheckCircleOutlined" />,
    },
    {
      time: '1h ago',
      title: 'Mesh Generation Complete',
      description: '2M cells generated successfully',
      status: 'completed',
      icon: <Icon name="CheckCircleOutlined" />,
    },
    {
      time: 'Now',
      title: 'Simulation Running',
      description: 'Iteration 3350/5000 (67% complete)',
      status: 'processing',
      icon: <SyncOutlined spin />,
    },
  ],
};

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--rescale-space-4);
  margin-bottom: var(--rescale-space-6);
`;

const ConfigCard = styled(Card)`
  .ant-card-head {
    border-bottom: 1px solid var(--rescale-color-gray-200);
  }
`;

const TimelineContainer = styled.div`
  .ant-timeline-item-head {
    border-color: var(--rescale-color-brand-blue);
  }
  
  .ant-timeline-item-content {
    margin-left: var(--rescale-space-4);
  }
`;

export function JobDetailPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const getJobActions = (): MenuProps['items'] => [
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
    {
      type: 'divider',
    },
    {
      key: 'clone',
      label: 'Clone Job',
      icon: <Icon name="ShareAltOutlined" />,
    },
    {
      key: 'download-inputs',
      label: 'Download Inputs',
      icon: <Icon name="DownloadOutlined" />,
    },
  ];

  const renderOverviewTab = () => (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Alert
          message="Job Running Successfully"
          description={`Simulation is ${mockJob.progress}% complete with ${mockJob.estimatedCompletion}`}
          type="success"
          showIcon
          style={{ marginBottom: '24px' }}
        />
      </Col>
      
      <Col span={24}>
        <MetricsGrid>
          <Card title="Progress" size="small">
            <Progress 
              percent={mockJob.progress} 
              strokeColor="var(--rescale-color-success)"
              format={() => `${mockJob.progress}%`}
            />
            <Text type="secondary" style={{ marginTop: '8px', display: 'block' }}>
              Estimated completion: {mockJob.estimatedCompletion}
            </Text>
          </Card>
          
          <Card title="Duration" size="small">
            <Statistic 
              value={mockJob.duration}
              prefix={<Icon name="ClockCircleOutlined" />}
              formatter={(value) => value as string}
            />
          </Card>
          
          <Card title="Priority" size="small">
            <Tag color={mockJob.priority === 'high' ? 'red' : 'default'} style={{ margin: 0 }}>
              {mockJob.priority.toUpperCase()} PRIORITY
            </Tag>
          </Card>
        </MetricsGrid>
      </Col>

      <Col span={24}>
        <Card title="Resource Usage" size="small">
          <ResourceMetrics
            metrics={mockJob.resourceMetrics}
            layout="horizontal"
            size="default"
            showDetails={true}
            animated={true}
          />
        </Card>
      </Col>

      <Col md={12} sm={24}>
        <Card title="Software" size="small">
          <SoftwareLogoGrid
            items={mockJob.software}
            size="large"
            showNames={true}
            maxVisible={10}
          />
        </Card>
      </Col>

      <Col md={12} sm={24}>
        <Card title="Job Details" size="small">
          <Descriptions column={1} size="small">
            <Descriptions.Item label="Job ID">{mockJob.id}</Descriptions.Item>
            <Descriptions.Item label="Submitted By">{mockJob.submittedBy}</Descriptions.Item>
            <Descriptions.Item label="Workspace">{mockJob.workspace}</Descriptions.Item>
            <Descriptions.Item label="Submitted">
              {mockJob.submittedAt.toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Tags">
              <Space>
                {mockJob.tags.map(tag => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </Space>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Col>
    </Row>
  );

  const renderConfigurationTab = () => (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <ConfigCard title="Simulation Configuration" size="small">
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Mesh Size">
              {mockJob.configuration.meshSize.toLocaleString()} cells
            </Descriptions.Item>
            <Descriptions.Item label="Time Step">
              {mockJob.configuration.timeStep}s
            </Descriptions.Item>
            <Descriptions.Item label="Iterations">
              {mockJob.configuration.iterations.toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Solver Type">
              {mockJob.configuration.solverType}
            </Descriptions.Item>
            <Descriptions.Item label="Turbulence Model" span={2}>
              {mockJob.configuration.turbulenceModel}
            </Descriptions.Item>
          </Descriptions>
        </ConfigCard>
      </Col>
      
      <Col span={24}>
        <Card title="Software Configuration" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            {mockJob.software.map(software => (
              <Card key={software.id} size="small" style={{ backgroundColor: '#fafafa' }}>
                <Row align="middle" gutter={16}>
                  <Col>
                    <Text style={{ fontSize: '24px' }}>{software.logo}</Text>
                  </Col>
                  <Col flex={1}>
                    <Text strong>{software.name}</Text>
                    <br />
                    <Text type="secondary">Version {software.version}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {software.description}
                    </Text>
                  </Col>
                </Row>
              </Card>
            ))}
          </Space>
        </Card>
      </Col>
    </Row>
  );

  const renderTimelineTab = () => (
    <Card title="Job Timeline" size="small">
      <TimelineContainer>
        <Timeline>
          {mockJob.timeline.map((item, index) => (
            <Timeline.Item
              key={index}
              color={item.status === 'completed' ? 'green' : 'blue'}
              dot={item.icon}
            >
              <div>
                <Text strong>{item.title}</Text>
                <Text type="secondary" style={{ marginLeft: '8px', fontSize: '12px' }}>
                  {item.time}
                </Text>
                <br />
                <Text type="secondary">{item.description}</Text>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </TimelineContainer>
    </Card>
  );

  return (
    <MainLayout>
      <PageHeader
        title={mockJob.name}
        subTitle={mockJob.description}
        tags={
          <JobStatusIndicator
            status={mockJob.status}
            progress={mockJob.progress}
            duration={mockJob.duration}
          />
        }
        extra={[
          <Button key="download" icon={<Icon name="DownloadOutlined" />}>
            Download Results
          </Button>,
          <Button key="share" icon={<Icon name="ShareAltOutlined" />}>
            Share
          </Button>,
          <Dropdown key="more" menu={{ items: getJobActions() }}>
            <Button icon={<EllipsisOutlined />} />
          </Dropdown>,
        ]}
      />

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Overview" key="overview">
          {renderOverviewTab()}
        </TabPane>
        <TabPane tab="Configuration" key="configuration">
          {renderConfigurationTab()}
        </TabPane>
        <TabPane tab="Timeline" key="timeline">
          {renderTimelineTab()}
        </TabPane>
        <TabPane tab="Files" key="files">
          <Card title="Input Files">
            <p>File management interface would go here</p>
          </Card>
        </TabPane>
        <TabPane tab="Logs" key="logs">
          <Card title="Job Logs">
            <p>Log viewer would go here</p>
          </Card>
        </TabPane>
      </Tabs>
    </MainLayout>
  );
}