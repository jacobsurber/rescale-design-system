import React, { useEffect, useState } from 'react';
import { Progress, Tooltip, Card } from 'antd';
import { ApiOutlined, CloudServerOutlined, ThunderboltOutlined,  } from '@ant-design/icons';
import styled, { keyframes } from 'styled-components';
import { Icon } from '../../atoms/Icon';

export interface ResourceMetric {
  /** Metric type */
  type: 'cpu' | 'memory' | 'storage' | 'network';
  /** Current usage percentage (0-100) */
  usage: number;
  /** Optional label override */
  label?: string;
  /** Optional unit (e.g., 'GB', 'MB/s') */
  unit?: string;
  /** Current value with unit */
  current?: string;
  /** Maximum/total value with unit */
  total?: string;
  /** Custom color override */
  color?: string;
}

export interface ResourceMetricsProps {
  /** Array of resource metrics */
  metrics: ResourceMetric[];
  /** Size of the circular progress indicators */
  size?: 'small' | 'default' | 'large';
  /** Layout orientation */
  layout?: 'horizontal' | 'vertical' | 'grid';
  /** Whether to show detailed information */
  showDetails?: boolean;
  /** Whether to animate on mount */
  animated?: boolean;
  /** Animation duration in milliseconds */
  animationDuration?: number;
  /** Whether to show as cards */
  asCards?: boolean;
  /** Custom className */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const MetricsContainer = styled.div<{ 
  $layout: string; 
  $animated: boolean;
  $asCards: boolean;
}>`
  display: ${props => {
    if (props.$layout === 'grid') return 'grid';
    return 'flex';
  }};
  
  ${props => {
    if (props.$layout === 'grid') {
      return `
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: var(--rescale-space-4);
      `;
    }
    if (props.$layout === 'vertical') {
      return `
        flex-direction: column;
        gap: var(--rescale-space-4);
      `;
    }
    return `
      flex-direction: row;
      gap: var(--rescale-space-6);
      align-items: center;
    `;
  }}
  
  ${props => props.$animated && `
    animation: ${fadeInUp} 0.6s ease-out;
  `}
`;

const MetricItem = styled.div<{ 
  $size: string; 
  $layout: string;
  $asCard: boolean;
  $index: number;
  $animated: boolean;
  $animationDuration: number;
}>`
  display: flex;
  ${props => props.$layout === 'horizontal' ? 'align-items: center;' : 'flex-direction: column; align-items: center;'}
  gap: ${props => {
    switch (props.$size) {
      case 'small': return 'var(--rescale-space-2)';
      case 'large': return 'var(--rescale-space-4)';
      default: return 'var(--rescale-space-3)';
    }
  }};
  
  ${props => props.$asCard && `
    padding: var(--rescale-space-4);
    background: var(--rescale-color-white);
    border: 1px solid var(--rescale-color-gray-300);
    border-radius: var(--rescale-radius-lg);
    box-shadow: var(--rescale-shadow-sm);
    
    &:hover {
      box-shadow: var(--rescale-shadow-md);
    }
  `}
  
  ${props => props.$animated && `
    animation: ${fadeInUp} ${props.$animationDuration}ms ease-out;
    animation-delay: ${props.$index * 100}ms;
    animation-fill-mode: both;
  `}
`;

const ProgressContainer = styled.div<{ $size: string }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProgressIcon = styled.div<{ $usage: number; $size: string }>`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => {
    switch (props.$size) {
      case 'small': return '14px';
      case 'large': return '24px';
      default: return '18px';
    }
  }};
  color: ${props => {
    if (props.$usage >= 90) return 'var(--rescale-color-error)';
    if (props.$usage >= 75) return 'var(--rescale-color-warning)';
    if (props.$usage >= 50) return 'var(--rescale-color-brand-blue)';
    return 'var(--rescale-color-success)';
  }};
`;

const MetricInfo = styled.div<{ $layout: string }>`
  display: flex;
  flex-direction: column;
  ${props => props.$layout === 'horizontal' ? 'align-items: flex-start;' : 'align-items: center; text-align: center;'}
  gap: var(--rescale-space-1);
`;

const MetricLabel = styled.span<{ $size: string }>`
  font-size: ${props => {
    switch (props.$size) {
      case 'small': return 'var(--rescale-font-size-xs)';
      case 'large': return 'var(--rescale-font-size-base)';
      default: return 'var(--rescale-font-size-sm)';
    }
  }};
  font-weight: var(--rescale-font-weight-semibold);
  color: var(--rescale-color-gray-900);
`;

const MetricUsage = styled.span<{ $size: string; $usage: number }>`
  font-size: ${props => {
    switch (props.$size) {
      case 'small': return 'var(--rescale-font-size-lg)';
      case 'large': return 'var(--rescale-font-size-2xl)';
      default: return 'var(--rescale-font-size-xl)';
    }
  }};
  font-weight: var(--rescale-font-weight-bold);
  color: ${props => {
    if (props.$usage >= 90) return 'var(--rescale-color-error)';
    if (props.$usage >= 75) return 'var(--rescale-color-warning)';
    if (props.$usage >= 50) return 'var(--rescale-color-brand-blue)';
    return 'var(--rescale-color-success)';
  }};
`;

const MetricDetails = styled.div<{ $size: string }>`
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

export const ResourceMetrics: React.FC<ResourceMetricsProps> = ({
  metrics,
  size = 'default',
  layout = 'horizontal',
  showDetails = true,
  animated = true,
  animationDuration = 400,
  asCards = false,
  className,
  style,
}) => {
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({});

  useEffect(() => {
    if (animated) {
      // Initialize with 0
      const initialValues: Record<string, number> = {};
      metrics.forEach((metric) => {
        initialValues[metric.type] = 0;
      });
      setAnimatedValues(initialValues);

      // Animate to actual values
      const timer = setTimeout(() => {
        const finalValues: Record<string, number> = {};
        metrics.forEach((metric) => {
          finalValues[metric.type] = metric.usage;
        });
        setAnimatedValues(finalValues);
      }, 100);

      return () => clearTimeout(timer);
    } else {
      // Set final values immediately
      const values: Record<string, number> = {};
      metrics.forEach((metric) => {
        values[metric.type] = metric.usage;
      });
      setAnimatedValues(values);
    }
  }, [animated, metrics]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'cpu':
        return <ApiOutlined />;
      case 'memory':
        return <Icon name="DatabaseOutlined" />;
      case 'storage':
        return <CloudServerOutlined />;
      case 'network':
        return <ThunderboltOutlined />;
      default:
        return <ApiOutlined />;
    }
  };

  const getLabel = (metric: ResourceMetric) => {
    if (metric.label) return metric.label;
    
    switch (metric.type) {
      case 'cpu':
        return 'CPU';
      case 'memory':
        return 'Memory';
      case 'storage':
        return 'Storage';
      case 'network':
        return 'Network';
      default:
        return metric.type.toUpperCase();
    }
  };

  const getProgressColor = (usage: number, customColor?: string) => {
    if (customColor) return customColor;
    
    if (usage >= 90) return 'var(--rescale-color-error)';
    if (usage >= 75) return 'var(--rescale-color-warning)';
    if (usage >= 50) return 'var(--rescale-color-brand-blue)';
    return 'var(--rescale-color-success)';
  };

  const getProgressSize = () => {
    switch (size) {
      case 'small':
        return 60;
      case 'large':
        return 120;
      default:
        return 80;
    }
  };

  const renderMetricItem = (metric: ResourceMetric, index: number) => {
    const currentUsage = animatedValues[metric.type] || 0;
    const progressColor = getProgressColor(metric.usage, metric.color);
    
    const tooltipTitle = showDetails && (metric.current || metric.total) && (
      <div>
        <div style={{ fontWeight: 600 }}>{getLabel(metric)}</div>
        {metric.current && metric.total && (
          <div>{metric.current} / {metric.total}</div>
        )}
        <div>{metric.usage}% used</div>
      </div>
    );

    const content = (
      <MetricItem
        key={metric.type}
        $size={size}
        $layout={layout}
        $asCard={asCards}
        $index={index}
        $animated={animated}
        $animationDuration={animationDuration}
      >
        <ProgressContainer $size={size}>
          <Progress
            type="circle"
            percent={currentUsage}
            size={getProgressSize()}
            strokeColor={progressColor}
            showInfo={false}
            strokeWidth={size === 'small' ? 6 : 8}
            trailColor="var(--rescale-color-gray-200)"
          />
          <ProgressIcon $usage={metric.usage} $size={size}>
            {getIcon(metric.type)}
          </ProgressIcon>
        </ProgressContainer>
        
        <MetricInfo $layout={layout}>
          <MetricLabel $size={size}>
            {getLabel(metric)}
          </MetricLabel>
          
          <MetricUsage $size={size} $usage={metric.usage}>
            {Math.round(currentUsage)}%
          </MetricUsage>
          
          {showDetails && (metric.current || metric.total) && (
            <MetricDetails $size={size}>
              {metric.current && metric.total ? (
                `${metric.current} / ${metric.total}`
              ) : metric.current ? (
                metric.current
              ) : metric.total ? (
                `Total: ${metric.total}`
              ) : null}
            </MetricDetails>
          )}
        </MetricInfo>
      </MetricItem>
    );

    if (tooltipTitle) {
      return (
        <Tooltip key={metric.type} title={tooltipTitle} placement="top">
          {content}
        </Tooltip>
      );
    }

    return content;
  };

  return (
    <MetricsContainer
      $layout={layout}
      $animated={animated}
      $asCards={asCards}
      className={className}
      style={style}
    >
      {metrics.map((metric, index) => renderMetricItem(metric, index))}
    </MetricsContainer>
  );
};

export default ResourceMetrics;