import React from 'react';
import { Card } from 'antd';
import styled from 'styled-components';
import { MainLayout } from '../../MainLayout';
import { PageHeader } from '../../../molecules/PageHeader';
import { Container } from '../../Container';
import { Grid, Col } from '../../Grid';
import { Stack } from '../../Spacing';
import { MetricCard } from '../../../molecules/MetricCard';
import type { PageHeaderProps } from '../../../molecules/PageHeader';
import type { MetricCardProps } from '../../../molecules/MetricCard';
import { mediaQueries } from '../../../../styles/breakpoints';

export interface DashboardMetric extends Omit<MetricCardProps, 'onClick'> {
  key: string;
  span?: number;
  order?: number;
}

export interface DashboardWidget {
  key: string;
  title: string;
  content: React.ReactNode;
  span?: number;
  height?: number | string;
  order?: number;
  actions?: React.ReactNode;
}

export interface DashboardTemplateProps extends Omit<PageHeaderProps, 'children'> {
  /** Key metrics to display at the top */
  metrics?: DashboardMetric[];
  /** Dashboard widgets */
  widgets?: DashboardWidget[];
  /** Additional content to render */
  children?: React.ReactNode;
  /** Layout configuration */
  layout?: 'grid' | 'masonry';
  /** Number of columns for grid layout */
  columns?: number;
  /** Whether to show metrics section */
  showMetrics?: boolean;
  /** Metrics section title */
  metricsTitle?: string;
  /** Layout container props */
  containerProps?: {
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
    padded?: boolean;
  };
}

const MetricsSection = styled.div`
  margin-bottom: var(--rescale-space-8);
  
  ${mediaQueries.mobile} {
    margin-bottom: var(--rescale-space-6);
  }
`;

const MetricsTitle = styled.h2`
  margin: 0 0 var(--rescale-space-4) 0;
  color: var(--rescale-color-gray-900);
  font-size: var(--rescale-font-size-lg);
  font-weight: var(--rescale-font-weight-semibold);
`;

const MetricsGrid = styled(Grid)`
  ${mediaQueries.mobile} {
    grid-template-columns: 1fr;
  }
`;

const WidgetCard = styled(Card)<{ 
  $height?: number | string;
  $order?: number;
}>`
  height: ${props => {
    if (typeof props.$height === 'number') {
      return `${props.$height}px`;
    }
    return props.$height || 'auto';
  }};
  order: ${props => props.$order || 0};
  
  .ant-card-head {
    border-bottom: 1px solid var(--rescale-color-gray-300);
    
    .ant-card-head-title {
      font-size: var(--rescale-font-size-base);
      font-weight: var(--rescale-font-weight-semibold);
      color: var(--rescale-color-gray-900);
    }
  }
  
  .ant-card-body {
    padding: var(--rescale-space-6);
    height: ${props => props.$height ? 'calc(100% - 57px)' : 'auto'};
    overflow: auto;
    
    ${mediaQueries.mobile} {
      padding: var(--rescale-space-4);
    }
  }
`;

const MasonryContainer = styled.div<{ $columns?: number }>`
  columns: ${props => props.$columns || 3};
  column-gap: var(--rescale-space-6);
  
  ${mediaQueries.tablet} {
    columns: 2;
    column-gap: var(--rescale-space-4);
  }
  
  ${mediaQueries.mobile} {
    columns: 1;
  }
`;

const MasonryItem = styled.div`
  break-inside: avoid;
  margin-bottom: var(--rescale-space-6);
  
  ${mediaQueries.mobile} {
    margin-bottom: var(--rescale-space-4);
  }
`;

export const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
  metrics = [],
  widgets = [],
  children,
  layout = 'grid',
  columns = 12,
  showMetrics = true,
  metricsTitle = 'Key Metrics',
  containerProps = { maxWidth: 'xl', padded: true },
  ...pageHeaderProps
}) => {
  const renderMetrics = () => {
    if (!showMetrics || metrics.length === 0) return null;

    return (
      <MetricsSection>
        <MetricsTitle>{metricsTitle}</MetricsTitle>
        <MetricsGrid columns={12} gap={4}>
          {metrics.map((metric) => (
            <Col 
              key={metric.key}
              span={metric.span || 3}
              spanMobile={6}
              spanTablet={4}
              order={metric.order}
            >
              <MetricCard {...metric} />
            </Col>
          ))}
        </MetricsGrid>
      </MetricsSection>
    );
  };

  const renderWidgets = () => {
    if (widgets.length === 0 && !children) return null;

    if (layout === 'masonry') {
      return (
        <MasonryContainer $columns={columns === 12 ? 3 : Math.min(columns, 4)}>
          {widgets.map((widget) => (
            <MasonryItem key={widget.key}>
              <WidgetCard
                title={widget.title}
                extra={widget.actions}
                $height={widget.height}
                $order={widget.order}
              >
                {widget.content}
              </WidgetCard>
            </MasonryItem>
          ))}
          {children && (
            <MasonryItem>
              {children}
            </MasonryItem>
          )}
        </MasonryContainer>
      );
    }

    return (
      <Grid columns={columns} gap={6}>
        {widgets.map((widget) => (
          <Col 
            key={widget.key}
            span={widget.span || 6}
            order={widget.order}
          >
            <WidgetCard
              title={widget.title}
              extra={widget.actions}
              $height={widget.height}
              $order={widget.order}
            >
              {widget.content}
            </WidgetCard>
          </Col>
        ))}
        {children && (
          <Col span={12}>
            {children}
          </Col>
        )}
      </Grid>
    );
  };

  return (
    <MainLayout>
      <Container {...containerProps}>
        <Stack gap={8}>
          <PageHeader {...pageHeaderProps} />
          
          {renderMetrics()}
          
          {renderWidgets()}
        </Stack>
      </Container>
    </MainLayout>
  );
};

export default DashboardTemplate;