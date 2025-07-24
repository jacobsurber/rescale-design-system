import React, { useState, useCallback } from 'react';
import { Card, Badge, Button, Tabs, Space, Typography, Alert, Spin, Tag, message } from 'antd';
import { 
  WifiOutlined, 
  DisconnectOutlined, 
  ReloadOutlined,
  BgColorsOutlined,
  ComponentOutlined,
  EyeOutlined,
  DownloadOutlined,
  SyncOutlined,
  CopyOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { useMCPConnection } from './hooks/useMCPConnection';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// Types
interface DesignToken {
  name: string;
  value: string;
  type: 'color' | 'typography' | 'spacing' | 'shadow';
  category: string;
}

// Styled Components
const DashboardContainer = styled.div`
  padding: 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
`;

const HeaderSection = styled.div`
  margin-bottom: 24px;
`;

const ConnectionCard = styled(Card)`
  .ant-card-body {
    padding: 16px 24px;
  }
`;

const TokenGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-top: 16px;
`;

const TokenCard = styled(Card)`
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
`;

const ColorPreview = styled.div<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: ${props => props.color};
  border: 1px solid #e0e0e0;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SelectionPreview = styled.div`
  background: #fafafa;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  padding: 32px;
  text-align: center;
  margin: 16px 0;
`;

const StatusIndicator = styled(Badge)<{ connected: boolean }>`
  .ant-badge-status-dot {
    background-color: ${props => props.connected ? '#52c41a' : '#ff4d4f'};
  }
`;

export const FigmaMCPDashboard: React.FC = () => {
  const {
    // Connection state
    connected,
    health,
    error,
    lastChecked,
    checking,
    checkHealth,
    
    // Selection state
    currentSelection,
    monitoring,
    lastUpdated,
    
    // Token state
    tokens,
    extracting,
    lastExtracted,
    extractTokens,
    clearTokens,
    
    // Utility methods
    getComponentInfo,
    getNodeImage
  } = useMCPConnection();

  const [displayTokens, setDisplayTokens] = useState<DesignToken[]>([]);

  // Convert MCP tokens to display format
  React.useEffect(() => {
    if (!tokens) {
      setDisplayTokens([]);
      return;
    }

    const converted: DesignToken[] = [];

    // Convert colors
    Object.entries(tokens.colors).forEach(([name, color]) => {
      converted.push({
        name,
        value: color.hex,
        type: 'color',
        category: 'Colors'
      });
    });

    // Convert typography
    Object.entries(tokens.typography).forEach(([name, typo]) => {
      converted.push({
        name,
        value: `${typo.fontSize}px ${typo.fontFamily}`,
        type: 'typography',
        category: 'Typography'
      });
    });

    // Convert spacing
    Object.entries(tokens.spacing).forEach(([name, space]) => {
      converted.push({
        name,
        value: `${space.value}${space.unit}`,
        type: 'spacing',
        category: 'Spacing'
      });
    });

    // Convert shadows
    Object.entries(tokens.shadows).forEach(([name, shadow]) => {
      converted.push({
        name,
        value: `${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.color}`,
        type: 'shadow',
        category: 'Shadows'
      });
    });

    setDisplayTokens(converted);
  }, [tokens]);

  // Handle token extraction
  const handleExtractTokens = useCallback(async () => {
    try {
      await extractTokens(currentSelection?.nodeId);
      message.success('Design tokens extracted successfully!');
    } catch (error) {
      message.error('Failed to extract tokens: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }, [extractTokens, currentSelection]);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    message.success('Copied to clipboard!');
  }, []);

  const renderTokenCard = (token: DesignToken) => (
    <TokenCard 
      key={token.name}
      size="small"
      hoverable
      onClick={() => copyToClipboard(token.value)}
      actions={[
        <Button 
          size="small" 
          icon={<CopyOutlined />} 
          onClick={(e) => {
            e.stopPropagation();
            copyToClipboard(token.name);
          }}
        >
          Copy Name
        </Button>
      ]}
    >
      <Space align="start">
        {token.type === 'color' && (
          <ColorPreview color={token.value} />
        )}
        <div>
          <Text strong>{token.name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {token.value}
          </Text>
          <br />
          <Tag size="small" color="blue">
            {token.category}
          </Tag>
        </div>
      </Space>
    </TokenCard>
  );

  return (
    <DashboardContainer>
      <HeaderSection>
        <Title level={2}>
          🎨 Figma MCP Dashboard
        </Title>
        <Paragraph type="secondary">
          Real-time design token extraction and component synchronization
        </Paragraph>
      </HeaderSection>

      {/* Connection Status */}
      <ConnectionCard>
        <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space align="center">
            <StatusIndicator 
              status={connected ? 'success' : 'error'}
              connected={connected}
            />
            <div>
              <Text strong>
                {connected ? 'Connected' : 'Disconnected'}
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {health?.server || 'localhost:3845'} • Last checked: {lastChecked?.toLocaleTimeString() || 'Never'}
              </Text>
              {monitoring && (
                <div>
                  <Badge status="processing" text="Monitoring selection" />
                </div>
              )}
            </div>
          </Space>
          
          <Space>
            <Button 
              icon={<ReloadOutlined />}
              onClick={checkHealth}
              loading={checking}
            >
              Refresh
            </Button>
            
            {connected && (
              <Button 
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleExtractTokens}
                loading={extracting}
              >
                Extract Tokens
              </Button>
            )}
          </Space>
        </Space>

        {error && (
          <Alert
            type="error"
            message="Connection Error"
            description={error}
            style={{ marginTop: 16 }}
            showIcon
          />
        )}
      </ConnectionCard>

      {/* Current Selection */}
      {currentSelection && (
        <Card title="Current Figma Selection" style={{ marginTop: 16 }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text strong>{currentSelection.name}</Text>
              <Tag style={{ marginLeft: 8 }}>{currentSelection.type}</Tag>
            </div>
            <Text type="secondary">Node ID: {currentSelection.nodeId}</Text>
            <Button 
              type="primary" 
              icon={<EyeOutlined />}
              size="small"
              onClick={handleExtractTokens}
            >
              Extract from Selection
            </Button>
          </Space>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Card style={{ marginTop: 16 }}>
        <Tabs defaultActiveKey="tokens">
          <TabPane 
            tab={
              <span>
                <BgColorsOutlined />
                Design Tokens ({displayTokens.length})
              </span>
            } 
            key="tokens"
          >
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Text type="secondary">
                  {displayTokens.length} tokens extracted
                </Text>
                {lastExtracted && (
                  <Text type="secondary">
                    • Last extracted: {lastExtracted.toLocaleTimeString()}
                  </Text>
                )}
                {displayTokens.length > 0 && (
                  <Button size="small" onClick={clearTokens}>
                    Clear All
                  </Button>
                )}
              </Space>
            </div>
            
            {extracting ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Spin size="large" />
                <div style={{ marginTop: 16 }}>
                  <Text>Extracting design tokens from Figma...</Text>
                </div>
              </div>
            ) : displayTokens.length > 0 ? (
              <TokenGrid>
                {displayTokens.map(renderTokenCard)}
              </TokenGrid>
            ) : (
              <SelectionPreview>
                <BgColorsOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
                <div style={{ marginTop: 16 }}>
                  <Text type="secondary">
                    {connected 
                      ? 'Select an element in Figma and click "Extract Tokens" to see design tokens here'
                      : 'Connect to MCP server first to extract design tokens'
                    }
                  </Text>
                </div>
              </SelectionPreview>
            )}
          </TabPane>

          <TabPane 
            tab={
              <span>
                <ComponentOutlined />
                Components
              </span>
            } 
            key="components"
          >
            <SelectionPreview>
              <ComponentOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
              <div style={{ marginTop: 16 }}>
                <Text type="secondary">
                  Component gallery and validation coming soon...
                </Text>
              </div>
            </SelectionPreview>
          </TabPane>

          <TabPane 
            tab={
              <span>
                <SyncOutlined />
                Real-time Sync
              </span>
            } 
            key="sync"
          >
            <SelectionPreview>
              <SyncOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
              <div style={{ marginTop: 16 }}>
                <Text type="secondary">
                  Real-time synchronization controls coming soon...
                </Text>
              </div>
            </SelectionPreview>
          </TabPane>
        </Tabs>
      </Card>
    </DashboardContainer>
  );
};

export default FigmaMCPDashboard;