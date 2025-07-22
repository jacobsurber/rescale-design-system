import React, { useState, useEffect, useMemo } from 'react';
import { Card, Row, Col, Statistic, Progress, Tabs, Table, Tag, Button, Space } from 'antd';
import { ReloadOutlined, TrophyOutlined, ThunderboltOutlined, ClockCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useWebVitals } from '../WebVitalsTracker';
import { measureBundleSize } from '../../../utils/performance';

const DashboardContainer = styled.div`
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
`;

const MetricCard = styled(Card)`
  .ant-statistic-title {
    font-size: 14px;
    margin-bottom: 8px;
  }
  
  .ant-statistic-content {
    font-size: 24px;
  }
`;

const ScoreIndicator = styled.div<{ score: 'good' | 'needs-improvement' | 'poor' }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  
  ${({ score }) => {
    switch (score) {
      case 'good':
        return `
          background: #f6ffed;
          color: #52c41a;
          border: 1px solid #b7eb8f;
        `;
      case 'needs-improvement':
        return `
          background: #fff7e6;
          color: #fa8c16;
          border: 1px solid #ffd591;
        `;
      case 'poor':
        return `
          background: #fff2f0;
          color: #ff4d4f;
          border: 1px solid #ffccc7;
        `;
    }
  }}
`;

interface BundleInfo {
  name: string;
  size: number;
  type: 'js' | 'css' | 'other';
}

interface PerformanceData {
  renderTime: number;
  bundleSize: number;
  apiResponseTime: number;
  memoryUsage: number;
}

export interface PerformanceDashboardProps {
  /** Whether to show detailed metrics */
  showDetails?: boolean;
  /** Custom performance data */
  performanceData?: Partial<PerformanceData>;
  /** Whether to auto-refresh metrics */
  autoRefresh?: boolean;
  /** Refresh interval in seconds */
  refreshInterval?: number;
}

/**
 * PerformanceDashboard - Comprehensive performance monitoring dashboard
 * 
 * @example
 * ```tsx
 * <PerformanceDashboard 
 *   showDetails={true}
 *   autoRefresh={true}
 *   refreshInterval={30}
 * />
 * ```
 */
export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  showDetails = true,
  performanceData = {},
  autoRefresh = false,
  refreshInterval = 30,
}) => {
  const { vitals, isLoading, getScore, getOverallScore, refresh } = useWebVitals();
  const [bundleInfo, setBundleInfo] = useState<BundleInfo[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Mock performance data (replace with real metrics)
  const mockPerformanceData: PerformanceData = useMemo(() => ({
    renderTime: 12.5,
    bundleSize: 245.8,
    apiResponseTime: 142,
    memoryUsage: 28.4,
    ...performanceData,
  }), [performanceData]);

  // Refresh all metrics
  const refreshMetrics = React.useCallback(() => {
    refresh();
    setLastUpdated(new Date());
    
    // Update bundle info
    const bundleData = measureBundleSize();
    if (bundleData) {
      const bundles: BundleInfo[] = bundleData.resources.map(resource => ({
        name: resource.name.split('/').pop() || resource.name,
        size: resource.transferSize,
        type: resource.name.endsWith('.js') ? 'js' 
              : resource.name.endsWith('.css') ? 'css' 
              : 'other',
      })).filter(bundle => bundle.size > 0);
      
      setBundleInfo(bundles.sort((a, b) => b.size - a.size));
    }
  }, [refresh]);

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(refreshMetrics, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, refreshMetrics]);

  // Initial load
  useEffect(() => {
    refreshMetrics();
  }, [refreshMetrics]);

  // Calculate overall score
  const overallScore = useMemo(() => {
    return getOverallScore();
  }, [getOverallScore]);

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  // Bundle analysis table columns
  const bundleColumns = [
    {
      title: 'File',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'js' ? 'blue' : type === 'css' ? 'green' : 'default'}>
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      render: (size: number) => formatFileSize(size),
      sorter: (a: BundleInfo, b: BundleInfo) => a.size - b.size,
    },
    {
      title: 'Size %',
      key: 'percentage',
      render: (_: any, record: BundleInfo) => {
        const total = bundleInfo.reduce((sum, item) => sum + item.size, 0);
        const percentage = ((record.size / total) * 100).toFixed(1);
        return `${percentage}%`;
      },
    },
  ];

  return (
    <DashboardContainer>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Performance Dashboard</h1>
        <Space>
          <span style={{ fontSize: 12, color: '#666' }}>
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <Button icon={<ReloadOutlined />} onClick={refreshMetrics}>
            Refresh
          </Button>
        </Space>
      </div>

      {/* Overall Score */}
      {overallScore && (
        <Card style={{ marginBottom: 24 }}>
          <Row gutter={16} align="middle">
            <Col>
              <TrophyOutlined style={{ fontSize: 32, color: '#1890ff' }} />
            </Col>
            <Col flex={1}>
              <h2>Overall Performance Score</h2>
              <Progress
                percent={overallScore.percentage}
                status={overallScore.rating === 'good' ? 'success' : 'exception'}
                strokeColor={
                  overallScore.rating === 'good' ? '#52c41a' :
                  overallScore.rating === 'needs-improvement' ? '#fa8c16' : '#ff4d4f'
                }
              />
              <p style={{ margin: '8px 0 0' }}>
                {overallScore.goodCount} of {overallScore.totalCount} Core Web Vitals are good
              </p>
            </Col>
          </Row>
        </Card>
      )}

      {/* Core Web Vitals */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <MetricCard>
            <Statistic
              title="Largest Contentful Paint (LCP)"
              value={vitals.LCP?.value.toFixed(0) || 'N/A'}
              suffix="ms"
              prefix={<ClockCircleOutlined />}
            />
            {vitals.LCP && (
              <ScoreIndicator score={getScore('LCP')?.rating || 'needs-improvement'}>
                {getScore('LCP')?.rating.replace('-', ' ')}
              </ScoreIndicator>
            )}
          </MetricCard>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <MetricCard>
            <Statistic
              title="First Input Delay (FID)"
              value={vitals.FID?.value.toFixed(0) || 'N/A'}
              suffix="ms"
              prefix={<ThunderboltOutlined />}
            />
            {vitals.FID && (
              <ScoreIndicator score={getScore('FID')?.rating || 'needs-improvement'}>
                {getScore('FID')?.rating.replace('-', ' ')}
              </ScoreIndicator>
            )}
          </MetricCard>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <MetricCard>
            <Statistic
              title="Cumulative Layout Shift (CLS)"
              value={vitals.CLS?.value.toFixed(3) || 'N/A'}
              prefix={<TrophyOutlined />}
            />
            {vitals.CLS && (
              <ScoreIndicator score={getScore('CLS')?.rating || 'needs-improvement'}>
                {getScore('CLS')?.rating.replace('-', ' ')}
              </ScoreIndicator>
            )}
          </MetricCard>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <MetricCard>
            <Statistic
              title="First Contentful Paint (FCP)"
              value={vitals.FCP?.value.toFixed(0) || 'N/A'}
              suffix="ms"
              prefix={<ClockCircleOutlined />}
            />
            {vitals.FCP && (
              <ScoreIndicator score={getScore('FCP')?.rating || 'needs-improvement'}>
                {getScore('FCP')?.rating.replace('-', ' ')}
              </ScoreIndicator>
            )}
          </MetricCard>
        </Col>
      </Row>

      {/* Additional Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <MetricCard>
            <Statistic
              title="Average Render Time"
              value={mockPerformanceData.renderTime}
              suffix="ms"
              precision={1}
            />
          </MetricCard>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <MetricCard>
            <Statistic
              title="Bundle Size"
              value={mockPerformanceData.bundleSize}
              suffix="KB"
              precision={1}
            />
          </MetricCard>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <MetricCard>
            <Statistic
              title="API Response Time"
              value={mockPerformanceData.apiResponseTime}
              suffix="ms"
            />
          </MetricCard>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <MetricCard>
            <Statistic
              title="Memory Usage"
              value={mockPerformanceData.memoryUsage}
              suffix="MB"
              precision={1}
            />
          </MetricCard>
        </Col>
      </Row>

      {/* Detailed Analytics */}
      {showDetails && (
        <Tabs defaultActiveKey="bundle">
          <Tabs.TabPane tab="Bundle Analysis" key="bundle">
            <Card>
              <h3>Bundle Size Analysis</h3>
              <Table
                dataSource={bundleInfo}
                columns={bundleColumns}
                rowKey="name"
                size="small"
                pagination={{ pageSize: 10 }}
              />
            </Card>
          </Tabs.TabPane>
          
          <Tabs.TabPane tab="Performance Tips" key="tips">
            <Card>
              <h3>Performance Optimization Tips</h3>
              <ul>
                <li>Images should be optimized and use next-gen formats (WebP, AVIF)</li>
                <li>Use React.memo for pure components to prevent unnecessary re-renders</li>
                <li>Implement code splitting with React.lazy for large components</li>
                <li>Use virtual scrolling for large lists and tables</li>
                <li>Optimize bundle size by tree-shaking unused code</li>
                <li>Implement proper caching strategies for API responses</li>
              </ul>
            </Card>
          </Tabs.TabPane>
        </Tabs>
      )}

      {isLoading && (
        <Card style={{ marginTop: 24, textAlign: 'center' }}>
          <p>Loading Web Vitals data...</p>
        </Card>
      )}
    </DashboardContainer>
  );
};

export default PerformanceDashboard;