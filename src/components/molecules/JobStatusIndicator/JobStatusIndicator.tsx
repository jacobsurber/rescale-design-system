import React from 'react';
import { Progress, Tag } from 'antd';

import styled, { keyframes, css } from 'styled-components';
import { Icon } from '../../atoms/Icon';

export type JobStatus = 'running' | 'completed' | 'failed' | 'warning' | 'queued' | 'pending';

export interface JobStatusIndicatorProps {
  /** Current job status */
  status: JobStatus;
  /** Progress percentage for running jobs (0-100) */
  progress?: number;
  /** Job duration or elapsed time */
  duration?: string;
  /** Whether to show animated progress for running jobs */
  animated?: boolean;
  /** Size variant */
  size?: 'small' | 'default' | 'large';
  /** Whether to show detailed information */
  showDetails?: boolean;
  /** Additional status message */
  message?: string;
  /** Custom className */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

const pulse = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
`;

const StatusContainer = styled.div<{ $size: string }>`
  display: flex;
  align-items: center;
  gap: ${props => {
    switch (props.$size) {
      case 'small': return 'var(--rescale-space-2)';
      case 'large': return 'var(--rescale-space-4)';
      default: return 'var(--rescale-space-3)';
    }
  }};
`;

const StatusIcon = styled.div<{ 
  $status: JobStatus; 
  $size: string;
  $animated: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => {
    switch (props.$size) {
      case 'small': return '14px';
      case 'large': return '20px';
      default: return '16px';
    }
  }};
  
  color: ${props => {
    switch (props.$status) {
      case 'running': return '#0272c3'; // Updated to Figma blue
      case 'completed': return '#50c878'; // Updated to Figma green
      case 'failed': return 'var(--rescale-color-error)';
      case 'warning': return 'var(--rescale-color-warning)';
      case 'queued': return '#455f87'; // Updated to Figma dark blue
      case 'pending': return '#7d53b3'; // Updated to Figma purple
      default: return 'var(--rescale-color-gray-600)';
    }
  }};
  
  ${props => props.$animated && props.$status === 'running' && css`
    animation: ${pulse} 1.5s ease-in-out infinite;
  `}
`;

const StatusInfo = styled.div<{ $size: string }>`
  display: flex;
  flex-direction: column;
  gap: var(--rescale-space-1);
  min-width: 0;
`;

const StatusText = styled.span<{ 
  $status: JobStatus; 
  $size: string;
}>`
  font-size: ${props => {
    switch (props.$size) {
      case 'small': return 'var(--rescale-font-size-xs)';
      case 'large': return 'var(--rescale-font-size-base)';
      default: return 'var(--rescale-font-size-sm)';
    }
  }};
  font-weight: var(--rescale-font-weight-medium);
  color: ${props => {
    switch (props.$status) {
      case 'running': return '#0272c3'; // Updated to Figma blue
      case 'completed': return '#50c878'; // Updated to Figma green
      case 'failed': return 'var(--rescale-color-error)';
      case 'warning': return 'var(--rescale-color-warning)';
      case 'queued': return '#455f87'; // Updated to Figma dark blue
      case 'pending': return '#7d53b3'; // Updated to Figma purple
      default: return 'var(--rescale-color-gray-900)';
    }
  }};
`;

const DurationText = styled.span<{ $size: string }>`
  font-size: ${props => {
    switch (props.$size) {
      case 'small': return '10px';
      case 'large': return 'var(--rescale-font-size-sm)';
      default: return 'var(--rescale-font-size-xs)';
    }
  }};
  color: var(--rescale-color-gray-600);
  display: flex;
  align-items: center;
  gap: var(--rescale-space-1);
`;

const ProgressContainer = styled.div<{ $size: string }>`
  min-width: ${props => {
    switch (props.$size) {
      case 'small': return '60px';
      case 'large': return '120px';
      default: return '80px';
    }
  }};
`;

const MessageText = styled.div<{ $size: string }>`
  font-size: ${props => {
    switch (props.$size) {
      case 'small': return '10px';
      case 'large': return 'var(--rescale-font-size-sm)';
      default: return 'var(--rescale-font-size-xs)';
    }
  }};
  color: var(--rescale-color-gray-600);
  margin-top: var(--rescale-space-1);
`;

export const JobStatusIndicator: React.FC<JobStatusIndicatorProps> = ({
  status,
  progress = 0,
  duration,
  animated = true,
  size = 'default',
  showDetails = true,
  message,
  className,
  style,
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'running':
        return <Icon name="LoadingOutlined" />;
      case 'completed':
        return <Icon name="CheckCircleOutlined" />;
      case 'failed':
        return <Icon name="CloseCircleOutlined" />;
      case 'warning':
        return <Icon name="ExclamationCircleOutlined" />;
      case 'queued':
        return <Icon name="ClockCircleOutlined" />;
      case 'pending':
        return <Icon name="PlayCircleOutlined" />;
      default:
        return <Icon name="ClockCircleOutlined" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'running':
        return 'Running';
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
      case 'warning':
        return 'Warning';
      case 'queued':
        return 'Queued';
      case 'pending':
        return 'Pending';
      default:
        return 'Unknown';
    }
  };

  const getProgressColor = () => {
    switch (status) {
      case 'running':
        return '#0272c3'; // Updated to Figma blue
      case 'completed':
        return '#50c878'; // Updated to Figma green
      case 'failed':
        return 'var(--rescale-color-error)';
      case 'warning':
        return 'var(--rescale-color-warning)';
      default:
        return 'var(--rescale-color-gray-400)';
    }
  };

  const progressSize = size === 'small' ? 'small' : 'default';

  return (
    <StatusContainer $size={size} className={className} style={style}>
      <StatusIcon 
        $status={status} 
        $size={size}
        $animated={animated}
      >
        {getStatusIcon()}
      </StatusIcon>
      
      <StatusInfo $size={size}>
        <StatusText $status={status} $size={size}>
          {getStatusText()}
        </StatusText>
        
        {duration && (
          <DurationText $size={size}>
            <Icon name="ClockCircleOutlined" />
            {duration}
          </DurationText>
        )}
        
        {message && showDetails && (
          <MessageText $size={size}>
            {message}
          </MessageText>
        )}
      </StatusInfo>
      
      {status === 'running' && progress > 0 && (
        <ProgressContainer $size={size}>
          <Progress
            percent={progress}
            size={progressSize}
            strokeColor={getProgressColor()}
            showInfo={size !== 'small'}
            format={(percent) => `${percent}%`}
          />
        </ProgressContainer>
      )}
      
      {status === 'running' && progress === 0 && showDetails && (
        <Tag color="processing" style={{ margin: 0 }}>
          Processing
        </Tag>
      )}
    </StatusContainer>
  );
};

export default JobStatusIndicator;