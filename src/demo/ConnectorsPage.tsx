import React, { useState } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Button,
  Input,
  Select,
  Badge,
  Switch,
  Tag,
  Space,
  Typography,
  Avatar,
  Modal,
  Form,
  message,
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  SettingOutlined,
  LinkOutlined,
  DisconnectOutlined,
  CloudOutlined,
  DatabaseOutlined,
  ApiOutlined,
  BugOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import {
  MainLayout,
  PageHeader,
  QuickActions,
} from '../index';
import styled from 'styled-components';

const { Text, Title } = Typography;
const { Meta } = Card;

// Mock connector data
const mockConnectors = [
  {
    id: 'aws-s3',
    name: 'Amazon S3',
    description: 'Store and retrieve simulation data in Amazon S3 buckets',
    provider: 'AWS',
    category: 'Storage',
    status: 'connected',
    icon: <CloudOutlined style={{ fontSize: '24px', color: '#ff9900' }} />,
    connectedAt: '2024-01-15',
    lastSync: '2 hours ago',
    dataTransfer: '2.4 TB',
    connectionCount: 1,
    config: {
      bucketName: 'rescale-simulations',
      region: 'us-west-2',
      encryptionEnabled: true,
    },
  },
  {
    id: 'mongodb',
    name: 'MongoDB Atlas',
    description: 'Store job metadata and results in MongoDB Atlas',
    provider: 'MongoDB',
    category: 'Database',
    status: 'connected',
    icon: <DatabaseOutlined style={{ fontSize: '24px', color: '#4db33d' }} />,
    connectedAt: '2024-01-20',
    lastSync: '30 minutes ago',
    dataTransfer: '145 GB',
    connectionCount: 3,
    config: {
      cluster: 'rescale-cluster',
      database: 'simulation_data',
      collections: ['jobs', 'results', 'metrics'],
    },
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Get job notifications and updates in Slack channels',
    provider: 'Slack',
    category: 'Notifications',
    status: 'disconnected',
    icon: <ApiOutlined style={{ fontSize: '24px', color: '#4a154b' }} />,
    connectedAt: null,
    lastSync: null,
    dataTransfer: null,
    connectionCount: 0,
    config: {},
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Sync simulation configurations and scripts with GitHub repositories',
    provider: 'GitHub',
    category: 'Version Control',
    status: 'error',
    icon: <BugOutlined style={{ fontSize: '24px', color: '#24292e' }} />,
    connectedAt: '2024-01-10',
    lastSync: 'Failed 1 day ago',
    dataTransfer: '12 GB',
    connectionCount: 2,
    config: {
      repository: 'rescale-org/simulations',
      branch: 'main',
      autoSync: false,
    },
    error: 'Authentication token expired',
  },
  {
    id: 'powerbi',
    name: 'Power BI',
    description: 'Create interactive dashboards from simulation results',
    provider: 'Microsoft',
    category: 'Analytics',
    status: 'configuring',
    icon: <DatabaseOutlined style={{ fontSize: '24px', color: '#f2c811' }} />,
    connectedAt: '2024-01-25',
    lastSync: 'Configuring...',
    dataTransfer: '0 GB',
    connectionCount: 0,
    config: {
      workspace: 'Rescale Analytics',
      dataset: 'simulation-results',
    },
  },
  {
    id: 'jira',
    name: 'Jira',
    description: 'Create and track issues from failed simulations',
    provider: 'Atlassian',
    category: 'Project Management',
    status: 'available',
    icon: <ApiOutlined style={{ fontSize: '24px', color: '#0052cc' }} />,
    connectedAt: null,
    lastSync: null,
    dataTransfer: null,
    connectionCount: 0,
    config: {},
  },
];

const FilterContainer = styled.div`
  display: flex;
  gap: var(--rescale-space-3);
  margin-bottom: var(--rescale-space-6);
  flex-wrap: wrap;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const ConnectorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--rescale-space-4);
  margin-bottom: var(--rescale-space-6);
`;

const ConnectorCardStyled = styled(Card)`
  border-radius: var(--rescale-radius-lg);
  box-shadow: var(--rescale-shadow-base);
  transition: all var(--rescale-duration-base) var(--rescale-easing-ease-out);
  
  &:hover {
    box-shadow: var(--rescale-shadow-lg);
    transform: translateY(-2px);
  }
  
  .ant-card-head {
    border-bottom: 1px solid var(--rescale-color-gray-200);
  }
  
  .ant-card-actions {
    border-top: 1px solid var(--rescale-color-gray-200);
  }
`;

const StatusIndicator = styled.div<{ status: string }>`
  display: flex;
  align-items: center;
  gap: var(--rescale-space-2);
  font-size: var(--rescale-font-size-sm);
  
  .status-icon {
    color: ${props => {
      switch (props.status) {
        case 'connected': return 'var(--rescale-color-success)';
        case 'error': return 'var(--rescale-color-error)';
        case 'configuring': return 'var(--rescale-color-warning)';
        case 'disconnected': return 'var(--rescale-color-gray-400)';
        default: return 'var(--rescale-color-brand-blue)';
      }
    }};
  }
`;

const CategoryTag = styled(Tag)<{ category: string }>`
  border-color: ${props => {
    switch (props.category.toLowerCase()) {
      case 'storage': return '#1890ff';
      case 'database': return '#52c41a';
      case 'notifications': return '#faad14';
      case 'analytics': return '#722ed1';
      case 'version control': return '#13c2c2';
      default: return '#d9d9d9';
    }
  }};
  color: ${props => {
    switch (props.category.toLowerCase()) {
      case 'storage': return '#1890ff';
      case 'database': return '#52c41a'; 
      case 'notifications': return '#faad14';
      case 'analytics': return '#722ed1';
      case 'version control': return '#13c2c2';
      default: return '#595959';
    }
  }};
`;

export function ConnectorsPage() {
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [selectedConnector, setSelectedConnector] = useState<typeof mockConnectors[0] | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircleOutlined className="status-icon" />;
      case 'error':
        return <CloseCircleOutlined className="status-icon" />;
      case 'configuring':
        return <SyncOutlined spin className="status-icon" />;
      case 'disconnected':
        return <DisconnectOutlined className="status-icon" />;
      default:
        return <ExclamationCircleOutlined className="status-icon" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return 'Connected';
      case 'error': return 'Error';
      case 'configuring': return 'Configuring';
      case 'disconnected': return 'Disconnected';
      case 'available': return 'Available';
      default: return status;
    }
  };

  const filteredConnectors = mockConnectors.filter(connector => {
    const matchesSearch = connector.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         connector.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || connector.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || connector.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [...new Set(mockConnectors.map(c => c.category))];
  const statuses = [...new Set(mockConnectors.map(c => c.status))];

  const handleConnect = (connector: typeof mockConnectors[0]) => {
    setSelectedConnector(connector);
    setConfigModalVisible(true);
  };

  const handleDisconnect = (connector: typeof mockConnectors[0]) => {
    Modal.confirm({
      title: `Disconnect ${connector.name}?`,
      content: 'This will disable the integration and may affect data synchronization.',
      okText: 'Disconnect',
      okType: 'danger',
      onOk: () => {
        message.success(`Disconnected from ${connector.name}`);
      },
    });
  };

  const handleConfigure = (connector: typeof mockConnectors[0]) => {
    setSelectedConnector(connector);
    setConfigModalVisible(true);
  };

  const getConnectorActions = (connector: typeof mockConnectors[0]) => {
    switch (connector.status) {
      case 'connected':
        return [
          <Button key="configure" icon={<SettingOutlined />} size="small">
            Configure
          </Button>,
          <Button 
            key="disconnect" 
            icon={<DisconnectOutlined />} 
            size="small"
            onClick={() => handleDisconnect(connector)}
          >
            Disconnect
          </Button>,
        ];
      case 'disconnected':
      case 'available':
        return [
          <Button 
            key="connect" 
            type="primary" 
            icon={<LinkOutlined />} 
            size="small"
            onClick={() => handleConnect(connector)}
          >
            Connect
          </Button>,
        ];
      case 'error':
        return [
          <Button 
            key="reconnect" 
            type="primary" 
            icon={<SyncOutlined />} 
            size="small"
            onClick={() => handleConnect(connector)}
          >
            Reconnect
          </Button>,
          <Button 
            key="configure" 
            icon={<SettingOutlined />} 
            size="small"
            onClick={() => handleConfigure(connector)}
          >
            Configure
          </Button>,
        ];
      case 'configuring':
        return [
          <Button key="configure" icon={<SettingOutlined />} size="small" loading>
            Configuring...
          </Button>,
        ];
      default:
        return [];
    }
  };

  const renderConnectorCard = (connector: typeof mockConnectors[0]) => (
    <ConnectorCardStyled
      key={connector.id}
      actions={getConnectorActions(connector)}
    >
      <Meta
        avatar={<Avatar size={48} icon={connector.icon} />}
        title={
          <Space>
            {connector.name}
            <CategoryTag category={connector.category}>
              {connector.category}
            </CategoryTag>
          </Space>
        }
        description={
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Text type="secondary">{connector.description}</Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              by {connector.provider}
            </Text>
            
            <StatusIndicator status={connector.status}>
              {getStatusIcon(connector.status)}
              <span>{getStatusText(connector.status)}</span>
              {connector.error && (
                <Text type="danger" style={{ fontSize: '12px' }}>
                  - {connector.error}
                </Text>
              )}
            </StatusIndicator>
            
            {connector.lastSync && (
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Last sync: {connector.lastSync}
              </Text>
            )}
            
            {connector.dataTransfer && (
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Data transferred: {connector.dataTransfer}
              </Text>
            )}
            
            {connector.connectionCount > 0 && (
              <Badge 
                count={connector.connectionCount} 
                style={{ backgroundColor: 'var(--rescale-color-brand-blue)' }}
              />
            )}
          </Space>
        }
      />
    </ConnectorCardStyled>
  );

  return (
    <MainLayout>
      <PageHeader
        title="Connectors & Integrations"
        subTitle={`${filteredConnectors.length} connectors available`}
        extra={
          <Button type="primary" icon={<PlusOutlined />}>
            Add Custom Connector
          </Button>
        }
      />
      
      <FilterContainer>
        <Input
          placeholder="Search connectors..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 250 }}
        />
        
        <Select
          placeholder="Filter by category"
          value={categoryFilter}
          onChange={setCategoryFilter}
          style={{ width: 200 }}
          options={[
            { label: 'All Categories', value: 'all' },
            ...categories.map(cat => ({ label: cat, value: cat })),
          ]}
        />
        
        <Select
          placeholder="Filter by status"
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 150 }}
          options={[
            { label: 'All Status', value: 'all' },
            ...statuses.map(status => ({ 
              label: getStatusText(status), 
              value: status 
            })),
          ]}
        />
      </FilterContainer>

      <ConnectorGrid>
        {filteredConnectors.map(renderConnectorCard)}
      </ConnectorGrid>

      <Modal
        title={selectedConnector ? `Configure ${selectedConnector.name}` : 'Configure Connector'}
        open={configModalVisible}
        onCancel={() => setConfigModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setConfigModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="save" type="primary">
            Save Configuration
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="Connection Status">
            <Switch 
              checked={selectedConnector?.status === 'connected'} 
              checkedChildren="Connected" 
              unCheckedChildren="Disconnected"
            />
          </Form.Item>
          
          {selectedConnector && (
            <>
              <Form.Item label="Description">
                <Text type="secondary">{selectedConnector.description}</Text>
              </Form.Item>
              
              <Form.Item label="Configuration">
                <pre style={{ 
                  background: '#f5f5f5', 
                  padding: '12px', 
                  borderRadius: '4px',
                  fontSize: '12px',
                }}>
                  {JSON.stringify(selectedConnector.config, null, 2)}
                </pre>
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </MainLayout>
  );
}