import React from 'react';
import { Card, Button, Switch, Avatar, Tag, Tooltip } from 'antd';
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  LinkOutlined,
  DisconnectOutlined,
  InfoCircleOutlined,
  ApiOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import { StatusTag } from '../../display/StatusTag';

type ConnectorStatus = 'connected' | 'disconnected' | 'error' | 'pending';
type ConnectorCategory = 'cloud' | 'storage' | 'compute' | 'monitoring' | 'cicd' | 'collaboration';

export interface ConnectorCardProps {
  /** Connector unique identifier */
  id: string;
  /** Connector name */
  name: string;
  /** Connector description */
  description: string;
  /** Connector category */
  category: ConnectorCategory;
  /** Current connection status */
  status: ConnectorStatus;
  /** Connector icon/logo URL */
  icon?: string;
  /** Provider name (e.g., "AWS", "Google Cloud", "GitHub") */
  provider: string;
  /** Whether connector is enabled */
  enabled: boolean;
  /** Last sync/activity timestamp */
  lastActivity?: Date;
  /** Configuration status */
  configurationComplete?: boolean;
  /** Number of active connections/integrations */
  activeConnections?: number;
  /** Tags/labels for the connector */
  tags?: string[];
  /** Whether connector supports webhooks */
  supportsWebhooks?: boolean;
  /** Whether connector is in beta */
  isBeta?: boolean;
  /** Handler for toggle enable/disable */
  onToggle?: (connectorId: string, enabled: boolean) => void;
  /** Handler for configure button */
  onConfigure?: (connectorId: string) => void;
  /** Handler for connect/disconnect */
  onConnect?: (connectorId: string) => void;
  /** Handler for view details */
  onViewDetails?: (connectorId: string) => void;
  /** Custom className */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

const getCategoryColor = (category: ConnectorCategory) => {
  const colorMap = {
    cloud: '#1890FF',
    storage: '#52C41A',
    compute: '#722ED1',
    monitoring: '#FA8C16',
    cicd: '#13C2C2',
    collaboration: '#EB2F96',
  };
  return colorMap[category];
};

const getCategoryIcon = (category: ConnectorCategory) => {
  const iconMap = {
    cloud: <ApiOutlined />,
    storage: <ApiOutlined />,
    compute: <ApiOutlined />,
    monitoring: <ApiOutlined />,
    cicd: <ApiOutlined />,
    collaboration: <ApiOutlined />,
  };
  return iconMap[category];
};

const ConnectorCardContainer = styled(Card)<{ $status: ConnectorStatus }>`
  border: 2px solid ${props => 
    props.$status === 'connected' 
      ? 'var(--rescale-color-success)' 
      : props.$status === 'error' 
        ? 'var(--rescale-color-error)'
        : 'var(--rescale-color-gray-300)'
  };
  border-radius: var(--rescale-radius-lg);
  transition: all var(--rescale-duration-normal) var(--rescale-easing-ease-in-out);
  height: 100%;
  
  &:hover {
    box-shadow: var(--rescale-shadow-lg);
    transform: translateY(-2px);
  }

  .ant-card-body {
    padding: var(--rescale-space-6);
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .ant-card-actions {
    background: var(--rescale-color-gray-100);
    border-top: 1px solid var(--rescale-color-gray-300);
    
    .ant-card-actions > li {
      margin: 0;
      
      &:not(:last-child) {
        border-right: 1px solid var(--rescale-color-gray-300);
      }
    }
  }
`;

const ConnectorHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--rescale-space-4);
  margin-bottom: var(--rescale-space-4);
`;

const ConnectorIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: var(--rescale-radius-base);
  background: var(--rescale-color-gray-100);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid var(--rescale-color-gray-300);
  
  .ant-avatar {
    width: 40px;
    height: 40px;
  }
  
  .anticon {
    font-size: 24px;
    color: var(--rescale-color-gray-600);
  }
`;

const ConnectorInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ConnectorTitle = styled.div`
  display: flex;
  align-items: center;
  gap: var(--rescale-space-2);
  margin-bottom: var(--rescale-space-1);
`;

const ConnectorName = styled.h3`
  margin: 0;
  font-size: var(--rescale-font-size-lg);
  font-weight: var(--rescale-font-weight-semibold);
  color: var(--rescale-color-gray-900);
`;

const BetaBadge = styled(Tag)`
  font-size: var(--rescale-font-size-xs);
  font-weight: var(--rescale-font-weight-medium);
  line-height: 1;
  padding: 2px 6px;
  margin-left: var(--rescale-space-2);
`;

const ProviderName = styled.div`
  font-size: var(--rescale-font-size-sm);
  color: var(--rescale-color-gray-600);
  margin-bottom: var(--rescale-space-2);
`;

const ConnectorDescription = styled.p`
  margin: 0 0 var(--rescale-space-4) 0;
  font-size: var(--rescale-font-size-sm);
  color: var(--rescale-color-gray-700);
  line-height: var(--rescale-line-height-normal);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
`;

const ConnectorStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--rescale-space-4);
`;

const StatusInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--rescale-space-3);
`;

const ConnectorStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--rescale-space-2);
  margin-bottom: var(--rescale-space-4);
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--rescale-font-size-sm);
`;

const StatLabel = styled.span`
  color: var(--rescale-color-gray-600);
`;

const StatValue = styled.span`
  color: var(--rescale-color-gray-900);
  font-weight: var(--rescale-font-weight-medium);
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--rescale-space-1);
  margin-top: auto;
`;

const CategoryTag = styled(Tag)<{ $color: string }>`
  background: ${props => props.$color}10;
  border: 1px solid ${props => props.$color}40;
  color: ${props => props.$color};
  font-size: var(--rescale-font-size-xs);
  font-weight: var(--rescale-font-weight-medium);
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ActionButton = styled(Button)`
  border: none;
  background: transparent;
  color: var(--rescale-color-gray-600);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--rescale-space-1);
  font-size: var(--rescale-font-size-xs);
  height: 32px;
  
  &:hover,
  &:focus {
    background: var(--rescale-color-gray-100);
    color: var(--rescale-color-brand-blue);
    border: none;
  }
`;

const ConnectButton = styled(ActionButton)<{ $connected: boolean }>`
  color: ${props => props.$connected ? 'var(--rescale-color-error)' : 'var(--rescale-color-success)'};
  
  &:hover,
  &:focus {
    color: ${props => props.$connected ? 'var(--rescale-color-error)' : 'var(--rescale-color-success)'};
    background: ${props => props.$connected ? 'rgba(255, 77, 79, 0.1)' : 'rgba(82, 196, 26, 0.1)'};
  }
`;

export const ConnectorCard: React.FC<ConnectorCardProps> = ({
  id,
  name,
  description,
  category,
  status,
  icon,
  provider,
  enabled,
  lastActivity,
  configurationComplete = false,
  activeConnections = 0,
  tags = [],
  supportsWebhooks = false,
  isBeta = false,
  onToggle,
  onConfigure,
  onConnect,
  onViewDetails,
  className,
  style,
}) => {
  const formatLastActivity = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  const handleToggle = (checked: boolean) => {
    onToggle?.(id, checked);
  };

  const handleConfigure = (e: React.MouseEvent) => {
    e.stopPropagation();
    onConfigure?.(id);
  };

  const handleConnect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onConnect?.(id);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetails?.(id);
  };

  const getStatusVariant = () => {
    switch (status) {
      case 'connected': return 'success';
      case 'error': return 'error';
      case 'pending': return 'warning';
      default: return 'pending';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected': return 'Connected';
      case 'disconnected': return 'Disconnected';
      case 'error': return 'Error';
      case 'pending': return 'Connecting';
      default: return 'Unknown';
    }
  };

  const isConnected = status === 'connected';
  const categoryColor = getCategoryColor(category);
  const categoryIcon = getCategoryIcon(category);

  const actions = [
    <Tooltip title="Configure connector" key="configure">
      <ActionButton icon={<SettingOutlined />} onClick={handleConfigure}>
        Configure
      </ActionButton>
    </Tooltip>,
    <Tooltip title={isConnected ? 'Disconnect' : 'Connect'} key="connect">
      <ConnectButton 
        $connected={isConnected}
        icon={isConnected ? <DisconnectOutlined /> : <LinkOutlined />}
        onClick={handleConnect}
      >
        {isConnected ? 'Disconnect' : 'Connect'}
      </ConnectButton>
    </Tooltip>,
    <Tooltip title="View details" key="details">
      <ActionButton icon={<InfoCircleOutlined />} onClick={handleViewDetails}>
        Details
      </ActionButton>
    </Tooltip>,
  ];

  return (
    <ConnectorCardContainer
      $status={status}
      actions={actions}
      className={className}
      style={style}
    >
      <ConnectorHeader>
        <ConnectorIcon>
          {icon ? (
            <Avatar src={icon} size={40} />
          ) : (
            categoryIcon
          )}
        </ConnectorIcon>
        
        <ConnectorInfo>
          <ConnectorTitle>
            <ConnectorName>{name}</ConnectorName>
            {isBeta && <BetaBadge color="orange">BETA</BetaBadge>}
          </ConnectorTitle>
          <ProviderName>{provider}</ProviderName>
        </ConnectorInfo>
      </ConnectorHeader>

      <ConnectorDescription>{description}</ConnectorDescription>

      <ConnectorStatus>
        <StatusInfo>
          <StatusTag variant={getStatusVariant()} showDot>
            {getStatusText()}
          </StatusTag>
          {!configurationComplete && (
            <Tooltip title="Configuration incomplete">
              <ExclamationCircleOutlined style={{ color: 'var(--rescale-color-warning)' }} />
            </Tooltip>
          )}
        </StatusInfo>
        
        <Switch
          checked={enabled}
          onChange={handleToggle}
          size="small"
          disabled={status === 'error'}
        />
      </ConnectorStatus>

      <ConnectorStats>
        {lastActivity && (
          <StatItem>
            <StatLabel>Last Activity:</StatLabel>
            <StatValue>{formatLastActivity(lastActivity)}</StatValue>
          </StatItem>
        )}
        
        <StatItem>
          <StatLabel>Active Connections:</StatLabel>
          <StatValue>{activeConnections}</StatValue>
        </StatItem>
        
        {supportsWebhooks && (
          <StatItem>
            <StatLabel>Webhooks:</StatLabel>
            <StatValue>
              <CheckCircleOutlined style={{ color: 'var(--rescale-color-success)' }} /> Supported
            </StatValue>
          </StatItem>
        )}
      </ConnectorStats>

      <TagsContainer>
        <CategoryTag $color={categoryColor} icon={categoryIcon}>
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </CategoryTag>
        
        {tags.slice(0, 2).map((tag, index) => (
          <Tag key={index}>
            {tag}
          </Tag>
        ))}
        
        {tags.length > 2 && (
          <Tooltip title={tags.slice(2).join(', ')}>
            <Tag>+{tags.length - 2}</Tag>
          </Tooltip>
        )}
      </TagsContainer>
    </ConnectorCardContainer>
  );
};

export default ConnectorCard;