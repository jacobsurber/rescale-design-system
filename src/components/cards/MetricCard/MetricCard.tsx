import React from 'react';
import { Card, Progress, Tooltip } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';

type MetricVariant = 'default' | 'success' | 'warning' | 'error';
type TrendDirection = 'up' | 'down' | 'neutral';

export interface MetricCardProps {
  /** Main title of the metric */
  title: string;
  /** Primary metric value */
  value: string | number;
  /** Unit of measurement */
  unit?: string;
  /** Optional subtitle or description */
  subtitle?: string;
  /** Percentage value for progress bar (0-100) */
  percentage?: number;
  /** Previous value for trend calculation */
  previousValue?: string | number;
  /** Trend direction */
  trend?: TrendDirection;
  /** Percentage change from previous value */
  changePercentage?: number;
  /** Metric variant affecting color scheme */
  variant?: MetricVariant;
  /** Optional icon */
  icon?: React.ReactNode;
  /** Additional info tooltip */
  info?: string;
  /** Whether the card is loading */
  loading?: boolean;
  /** Whether to show progress bar */
  showProgress?: boolean;
  /** Custom progress bar color */
  progressColor?: string;
  /** Click handler */
  onClick?: () => void;
  /** Whether card is clickable */
  clickable?: boolean;
  /** Custom className */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

const getVariantColors = (variant: MetricVariant) => {
  const colorMap = {
    default: {
      border: 'var(--rescale-color-gray-300)',
      icon: 'var(--rescale-color-brand-blue)',
      progress: 'var(--rescale-color-brand-blue)',
    },
    success: {
      border: 'var(--rescale-color-success)',
      icon: 'var(--rescale-color-success)',
      progress: 'var(--rescale-color-success)',
    },
    warning: {
      border: 'var(--rescale-color-warning)',
      icon: 'var(--rescale-color-warning)',
      progress: 'var(--rescale-color-warning)',
    },
    error: {
      border: 'var(--rescale-color-error)',
      icon: 'var(--rescale-color-error)',
      progress: 'var(--rescale-color-error)',
    },
  };
  return colorMap[variant];
};

const getTrendColor = (trend: TrendDirection) => {
  const colorMap = {
    up: 'var(--rescale-color-success)',
    down: 'var(--rescale-color-error)',
    neutral: 'var(--rescale-color-gray-500)',
  };
  return colorMap[trend];
};

const MetricCardContainer = styled(Card)<{
  $variant: MetricVariant;
  $clickable: boolean;
}>`
  ${({ $variant }) => {
    const colors = getVariantColors($variant);
    return `
      border: 2px solid ${colors.border};
    `;
  }}

  border-radius: var(--rescale-radius-lg);
  transition: all var(--rescale-duration-normal) var(--rescale-easing-ease-in-out);
  
  ${({ $clickable }) => $clickable && `
    cursor: pointer;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--rescale-shadow-lg);
    }
    
    &:active {
      transform: translateY(-1px);
    }
  `}

  .ant-card-body {
    padding: var(--rescale-space-6);
  }
`;

const MetricHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--rescale-space-4);
`;

const MetricTitle = styled.div`
  display: flex;
  align-items: center;
  gap: var(--rescale-space-2);
  flex: 1;
`;

const TitleText = styled.h3`
  margin: 0;
  font-size: var(--rescale-font-size-sm);
  font-weight: var(--rescale-font-weight-medium);
  color: var(--rescale-color-gray-700);
`;

const MetricIcon = styled.div<{ $variant: MetricVariant }>`
  ${({ $variant }) => {
    const colors = getVariantColors($variant);
    return `color: ${colors.icon};`;
  }}
  
  font-size: var(--rescale-font-size-lg);
  display: flex;
  align-items: center;
`;

const InfoIcon = styled(InfoCircleOutlined)`
  color: var(--rescale-color-gray-500);
  font-size: var(--rescale-font-size-sm);
  cursor: help;
  
  &:hover {
    color: var(--rescale-color-brand-blue);
  }
`;

const MetricValue = styled.div`
  display: flex;
  align-items: baseline;
  gap: var(--rescale-space-2);
  margin-bottom: var(--rescale-space-2);
`;

const ValueText = styled.span`
  font-size: var(--rescale-font-size-3xl);
  font-weight: var(--rescale-font-weight-bold);
  color: var(--rescale-color-gray-900);
  line-height: 1;
`;

const UnitText = styled.span`
  font-size: var(--rescale-font-size-base);
  font-weight: var(--rescale-font-weight-medium);
  color: var(--rescale-color-gray-500);
`;

const MetricSubtitle = styled.p`
  margin: 0 0 var(--rescale-space-4) 0;
  font-size: var(--rescale-font-size-sm);
  color: var(--rescale-color-gray-600);
`;

const MetricTrend = styled.div<{ $trend: TrendDirection }>`
  display: flex;
  align-items: center;
  gap: var(--rescale-space-1);
  font-size: var(--rescale-font-size-xs);
  font-weight: var(--rescale-font-weight-medium);
  color: ${({ $trend }) => getTrendColor($trend)};
  margin-bottom: var(--rescale-space-3);
`;

const TrendIcon = styled.span`
  font-size: var(--rescale-font-size-xs);
`;

const ProgressSection = styled.div`
  margin-top: var(--rescale-space-4);
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--rescale-space-2);
  font-size: var(--rescale-font-size-xs);
  color: var(--rescale-color-gray-600);
`;

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  percentage,
  previousValue,
  trend,
  changePercentage,
  variant = 'default',
  icon,
  info,
  loading = false,
  showProgress = false,
  progressColor,
  onClick,
  clickable = false,
  className,
  style,
}) => {

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return val;
  };

  const getTrendIcon = (trend: TrendDirection) => {
    switch (trend) {
      case 'up':
        return <ArrowUpOutlined />;
      case 'down':
        return <ArrowDownOutlined />;
      default:
        return null;
    }
  };

  const getProgressStatus = () => {
    if (variant === 'error') return 'exception';
    if (variant === 'success') return 'success';
    return 'normal';
  };

  const colors = getVariantColors(variant);
  const finalProgressColor = progressColor || colors.progress;

  return (
    <MetricCardContainer
      $variant={variant}
      $clickable={clickable || Boolean(onClick)}
      loading={loading}
      onClick={onClick}
      className={className}
      style={style}
    >
      <MetricHeader>
        <MetricTitle>
          {icon && <MetricIcon $variant={variant}>{icon}</MetricIcon>}
          <TitleText>{title}</TitleText>
          {info && (
            <Tooltip title={info} placement="top">
              <InfoIcon />
            </Tooltip>
          )}
        </MetricTitle>
      </MetricHeader>

      <MetricValue>
        <ValueText>{formatValue(value)}</ValueText>
        {unit && <UnitText>{unit}</UnitText>}
      </MetricValue>

      {subtitle && <MetricSubtitle>{subtitle}</MetricSubtitle>}

      {trend && changePercentage !== undefined && (
        <MetricTrend $trend={trend}>
          <TrendIcon>{getTrendIcon(trend)}</TrendIcon>
          {Math.abs(changePercentage)}%
          {previousValue && (
            <span style={{ color: 'var(--rescale-color-gray-500)' }}>
              vs {formatValue(previousValue)}
            </span>
          )}
        </MetricTrend>
      )}

      {showProgress && percentage !== undefined && (
        <ProgressSection>
          <ProgressLabel>
            <span>Usage</span>
            <span>{percentage}%</span>
          </ProgressLabel>
          <Progress
            percent={percentage}
            showInfo={false}
            strokeColor={finalProgressColor}
            status={getProgressStatus()}
          />
        </ProgressSection>
      )}
    </MetricCardContainer>
  );
};

export default MetricCard;