import React from 'react';
import { Card, Avatar, Tag, Button, Tooltip } from 'antd';
import { UserOutlined, CopyOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { StatusTag } from '../../atoms/StatusTag';
import { Icon } from '../../atoms/Icon';

type WorkflowStatus = 'draft' | 'validated' | 'running' | 'completed' | 'failed' | 'paused';

interface WorkflowStep {
  id: string;
  name: string;
  software: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

export interface WorkflowCardProps {
  /** Workflow ID */
  id: string;
  /** Workflow name */
  name: string;
  /** Workflow description */
  description?: string;
  /** Current workflow status */
  status: WorkflowStatus;
  /** Workflow steps */
  steps: WorkflowStep[];
  /** Workflow owner */
  owner: {
    name: string;
    avatar?: string;
  };
  /** Creation date */
  createdAt: Date;
  /** Last modified date */
  lastModified?: Date;
  /** Estimated runtime */
  estimatedRuntime?: string;
  /** Actual runtime if completed */
  actualRuntime?: string;
  /** Tags/labels */
  tags?: string[];
  /** Whether workflow is shared */
  isShared?: boolean;
  /** Click handler for the workflow */
  onClick?: (workflow: WorkflowCardProps) => void;
  /** Handler for run workflow */
  onRun?: (workflowId: string) => void;
  /** Handler for clone workflow */
  onClone?: (workflowId: string) => void;
  /** Handler for edit workflow */
  onEdit?: (workflowId: string) => void;
  /** Custom className */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

const WorkflowCardContainer = styled(Card)`
  border: 1px solid var(--rescale-color-gray-300);
  border-radius: var(--rescale-radius-lg);
  transition: all var(--rescale-duration-normal) var(--rescale-easing-ease-in-out);
  cursor: pointer;
  
  &:hover {
    border-color: var(--rescale-color-brand-blue);
    box-shadow: var(--rescale-shadow-md);
    transform: translateY(-2px);
  }

  .ant-card-body {
    padding: var(--rescale-space-6);
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

const WorkflowHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--rescale-space-4);
`;

const WorkflowInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const WorkflowTitle = styled.h3`
  margin: 0 0 var(--rescale-space-2) 0;
  font-size: var(--rescale-font-size-lg);
  font-weight: var(--rescale-font-weight-semibold);
  color: var(--rescale-color-gray-900);
  word-break: break-word;
`;

const WorkflowId = styled.p`
  margin: 0 0 var(--rescale-space-2) 0;
  font-size: var(--rescale-font-size-xs);
  color: var(--rescale-color-gray-500);
  font-family: monospace;
`;

const WorkflowDescription = styled.p`
  margin: 0 0 var(--rescale-space-4) 0;
  font-size: var(--rescale-font-size-sm);
  color: var(--rescale-color-gray-700);
  line-height: var(--rescale-line-height-normal);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
`;

const WorkflowSteps = styled.div`
  margin-bottom: var(--rescale-space-4);
`;

const StepsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--rescale-space-3);
`;

const StepsTitle = styled.span`
  font-size: var(--rescale-font-size-sm);
  font-weight: var(--rescale-font-weight-medium);
  color: var(--rescale-color-gray-700);
`;

const StepsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--rescale-space-2);
`;

const StepItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--rescale-space-3);
  padding: var(--rescale-space-2);
  background: var(--rescale-color-gray-100);
  border-radius: var(--rescale-radius-base);
  font-size: var(--rescale-font-size-xs);
`;

const StepName = styled.span`
  flex: 1;
  color: var(--rescale-color-gray-900);
  font-weight: var(--rescale-font-weight-medium);
`;

const StepSoftware = styled.span`
  color: var(--rescale-color-gray-600);
`;

const WorkflowMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--rescale-space-4);
`;

const MetaInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--rescale-space-1);
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--rescale-space-2);
  font-size: var(--rescale-font-size-xs);
  color: var(--rescale-color-gray-600);
`;

const OwnerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--rescale-space-2);
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--rescale-space-1);
  margin-bottom: var(--rescale-space-4);
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

const RunButton = styled(ActionButton)`
  color: var(--rescale-color-success);
  
  &:hover,
  &:focus {
    color: var(--rescale-color-success);
    background: rgba(82, 196, 26, 0.1);
  }
`;

export const WorkflowCard: React.FC<WorkflowCardProps> = ({
  id,
  name,
  description,
  status,
  steps,
  owner,
  createdAt,
  lastModified: _lastModified,
  estimatedRuntime,
  actualRuntime,
  tags = [],
  isShared: _isShared = false,
  onClick,
  onRun,
  onClone,
  onEdit,
  className,
  style,
}) => {

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const getStepStatusIcon = (stepStatus: string) => {
    switch (stepStatus) {
      case 'running':
        return <Icon name="ClockCircleOutlined" style />;
      case 'completed':
        return <Icon name="PlayCircleOutlined" style />;
      case 'failed':
        return <Icon name="PlayCircleOutlined" style />;
      default:
        return <Icon name="ClockCircleOutlined" style />;
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card click if clicking on action buttons
    if ((e.target as HTMLElement).closest('.ant-card-actions')) {
      return;
    }
    // Pass the entire workflow props
    onClick?.({
      id,
      name,
      description,
      status,
      steps,
      owner,
      createdAt,
      lastModified: _lastModified,
      estimatedRuntime,
      actualRuntime,
      tags,
      isShared: _isShared,
      onClick,
      onRun,
      onClone,
      onEdit,
      className,
      style,
    });
  };

  const handleRun = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRun?.(id);
  };

  const handleClone = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClone?.(id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(id);
  };

  const canRun = status === 'draft' || status === 'validated' || status === 'paused';

  const actions = [
    canRun && (
      <Tooltip title="Run workflow" key="run">
        <RunButton icon={<Icon name="PlayCircleOutlined" />} onClick={handleRun}>
          Run
        </RunButton>
      </Tooltip>
    ),
    <Tooltip title="Clone workflow" key="clone">
      <ActionButton icon={<CopyOutlined />} onClick={handleClone}>
        Clone
      </ActionButton>
    </Tooltip>,
    <Tooltip title="Edit workflow" key="edit">
      <ActionButton icon={<Icon name="EditOutlined" />} onClick={handleEdit}>
        Edit
      </ActionButton>
    </Tooltip>,
  ].filter(Boolean);

  return (
    <WorkflowCardContainer
      actions={actions}
      onClick={handleCardClick}
      className={className}
      style={style}
    >
      <WorkflowHeader>
        <WorkflowInfo>
          <WorkflowTitle>{name}</WorkflowTitle>
          <WorkflowId>{id}</WorkflowId>
        </WorkflowInfo>
        <StatusTag variant={status === 'failed' ? 'error' : status === 'completed' ? 'success' : 'info'}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </StatusTag>
      </WorkflowHeader>

      {description && (
        <WorkflowDescription>{description}</WorkflowDescription>
      )}

      <WorkflowSteps>
        <StepsHeader>
          <StepsTitle>Steps ({steps.length})</StepsTitle>
        </StepsHeader>
        <StepsList>
          {steps.slice(0, 3).map((step) => (
            <StepItem key={step.id}>
              {getStepStatusIcon(step.status)}
              <StepName>{step.name}</StepName>
              <StepSoftware>{step.software}</StepSoftware>
            </StepItem>
          ))}
          {steps.length > 3 && (
            <StepItem>
              <span style={{ color: 'var(--rescale-color-gray-500)' }}>
                +{steps.length - 3} more steps
              </span>
            </StepItem>
          )}
        </StepsList>
      </WorkflowSteps>

      {tags.length > 0 && (
        <TagsContainer>
          {tags.slice(0, 3).map((tag, index) => (
            <Tag key={index}>
              {tag}
            </Tag>
          ))}
          {tags.length > 3 && (
            <Tooltip title={tags.slice(3).join(', ')}>
              <Tag>+{tags.length - 3}</Tag>
            </Tooltip>
          )}
        </TagsContainer>
      )}

      <WorkflowMeta>
        <MetaInfo>
          <MetaItem>
            <Icon name="ClockCircleOutlined" />
            Created {formatDate(createdAt)}
          </MetaItem>
          {estimatedRuntime && (
            <MetaItem>
              Runtime: {actualRuntime || estimatedRuntime}
            </MetaItem>
          )}
        </MetaInfo>
        
        <OwnerInfo>
          <Avatar
            size={24}
            src={owner.avatar}
            icon={!owner.avatar && <UserOutlined />}
          />
          <span style={{ fontSize: 'var(--rescale-font-size-xs)', color: 'var(--rescale-color-gray-700)' }}>
            {owner.name}
          </span>
        </OwnerInfo>
      </WorkflowMeta>
    </WorkflowCardContainer>
  );
};

export default WorkflowCard;