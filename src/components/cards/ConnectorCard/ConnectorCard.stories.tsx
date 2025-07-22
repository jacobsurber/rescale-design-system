import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
const action = (name: string) => () => console.log(name);
import { ConnectorCard, type ConnectorCardProps } from './ConnectorCard';

const meta: Meta<typeof ConnectorCard> = {
  title: 'Cards/ConnectorCard',
  component: ConnectorCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# ConnectorCard Component

A comprehensive card component for displaying integration connectors with status, configuration, and action controls.

## Features
- **Status Indicators**: Visual status with colored borders and status tags
- **Provider Branding**: Support for custom logos and provider information
- **Action Controls**: Enable/disable toggle, connect/disconnect, configure
- **Category Classification**: Cloud, storage, compute, monitoring, CI/CD, collaboration
- **Activity Tracking**: Last activity timestamps and connection counts
- **Configuration Status**: Incomplete configuration warnings
- **Beta Badges**: Mark connectors in beta testing
- **Webhook Support**: Indicator for webhook capabilities

## Connector Statuses
- \`connected\` - Successfully connected and active
- \`disconnected\` - Not currently connected
- \`error\` - Connection or configuration error
- \`pending\` - Connection in progress

## Categories
- \`cloud\` - Cloud platform integrations (AWS, GCP, Azure)
- \`storage\` - Storage service integrations
- \`compute\` - Compute platform integrations
- \`monitoring\` - Monitoring and observability tools
- \`cicd\` - CI/CD pipeline integrations
- \`collaboration\` - Team collaboration tools

## Usage
\`\`\`tsx
import { ConnectorCard } from '@/components/cards';

<ConnectorCard
  id="aws-s3"
  name="Amazon S3"
  description="Connect to AWS S3 for file storage and data transfer"
  category="storage"
  provider="Amazon Web Services"
  status="connected"
  enabled={true}
  configurationComplete={true}
  activeConnections={3}
  onToggle={handleToggle}
  onConnect={handleConnect}
  onConfigure={handleConfigure}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    status: {
      control: 'select',
      options: ['connected', 'disconnected', 'error', 'pending'],
    },
    category: {
      control: 'select',
      options: ['cloud', 'storage', 'compute', 'monitoring', 'cicd', 'collaboration'],
    },
    enabled: {
      control: 'boolean',
    },
    configurationComplete: {
      control: 'boolean',
    },
    isBeta: {
      control: 'boolean',
    },
    supportsWebhooks: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ConnectorCard>;

export const Default: Story = {
  args: {
    id: 'aws-s3',
    name: 'Amazon S3',
    description: 'Connect to AWS S3 for scalable object storage, data backup, and content distribution.',
    category: 'storage',
    provider: 'Amazon Web Services',
    status: 'connected',
    enabled: true,
    lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    configurationComplete: true,
    activeConnections: 3,
    tags: ['Storage', 'AWS', 'Production'],
    supportsWebhooks: true,
    icon: 'https://logo.clearbit.com/aws.amazon.com',
    onToggle: action('toggle'),
    onConfigure: action('configure'),
    onConnect: action('connect'),
    onViewDetails: action('view-details'),
  },
};

export const Disconnected: Story = {
  args: {
    ...Default.args,
    status: 'disconnected',
    enabled: false,
    activeConnections: 0,
    lastActivity: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
  },
};

export const Error: Story = {
  args: {
    ...Default.args,
    name: 'Google Cloud Storage',
    provider: 'Google Cloud Platform',
    status: 'error',
    enabled: false,
    configurationComplete: false,
    activeConnections: 0,
    tags: ['Storage', 'GCP', 'Error'],
    icon: 'https://logo.clearbit.com/cloud.google.com',
  },
};

export const Pending: Story = {
  args: {
    ...Default.args,
    name: 'GitHub Actions',
    provider: 'GitHub',
    category: 'cicd',
    status: 'pending',
    configurationComplete: false,
    activeConnections: 0,
    tags: ['CI/CD', 'GitHub', 'Automation'],
    icon: 'https://logo.clearbit.com/github.com',
  },
};

export const BetaConnector: Story = {
  args: {
    ...Default.args,
    name: 'Kubernetes',
    provider: 'CNCF',
    category: 'compute',
    status: 'connected',
    isBeta: true,
    activeConnections: 1,
    tags: ['Container', 'Orchestration', 'Beta'],
    supportsWebhooks: false,
  },
};

export const NoIcon: Story = {
  args: {
    ...Default.args,
    name: 'Custom API',
    provider: 'Internal',
    category: 'monitoring',
    icon: undefined,
    tags: ['Custom', 'Internal', 'Monitoring'],
  },
};

export const AllCategories: Story = {
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '16px',
      maxWidth: '1400px'
    }}>
      <ConnectorCard
        id="aws"
        name="Amazon Web Services"
        description="Connect to AWS cloud services for compute, storage, and more."
        category="cloud"
        provider="Amazon"
        status="connected"
        enabled={true}
        configurationComplete={true}
        activeConnections={5}
        lastActivity={new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)}
        tags={['Cloud', 'AWS']}
        supportsWebhooks={true}
        icon="https://logo.clearbit.com/aws.amazon.com"
        onToggle={action('aws-toggle')}
        onConnect={action('aws-connect')}
        onConfigure={action('aws-configure')}
      />
      
      <ConnectorCard
        id="s3"
        name="Amazon S3"
        description="Scalable object storage service for data backup and archival."
        category="storage"
        provider="Amazon Web Services"
        status="connected"
        enabled={true}
        configurationComplete={true}
        activeConnections={3}
        lastActivity={new Date(Date.now() - 3 * 60 * 60 * 1000)}
        tags={['Storage', 'S3']}
        supportsWebhooks={true}
        icon="https://logo.clearbit.com/aws.amazon.com"
        onToggle={action('s3-toggle')}
        onConnect={action('s3-connect')}
        onConfigure={action('s3-configure')}
      />
      
      <ConnectorCard
        id="kubernetes"
        name="Kubernetes"
        description="Container orchestration platform for automated deployment."
        category="compute"
        provider="CNCF"
        status="pending"
        enabled={true}
        configurationComplete={false}
        activeConnections={0}
        tags={['Container', 'K8s']}
        isBeta={true}
        supportsWebhooks={false}
        onToggle={action('k8s-toggle')}
        onConnect={action('k8s-connect')}
        onConfigure={action('k8s-configure')}
      />
      
      <ConnectorCard
        id="datadog"
        name="Datadog"
        description="Monitoring and analytics platform for infrastructure and applications."
        category="monitoring"
        provider="Datadog"
        status="connected"
        enabled={true}
        configurationComplete={true}
        activeConnections={2}
        lastActivity={new Date(Date.now() - 30 * 60 * 1000)}
        tags={['Monitoring', 'APM']}
        supportsWebhooks={true}
        icon="https://logo.clearbit.com/datadoghq.com"
        onToggle={action('datadog-toggle')}
        onConnect={action('datadog-connect')}
        onConfigure={action('datadog-configure')}
      />
      
      <ConnectorCard
        id="github"
        name="GitHub Actions"
        description="CI/CD platform integrated with GitHub repositories."
        category="cicd"
        provider="GitHub"
        status="error"
        enabled={false}
        configurationComplete={false}
        activeConnections={0}
        lastActivity={new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)}
        tags={['CI/CD', 'Git']}
        supportsWebhooks={true}
        icon="https://logo.clearbit.com/github.com"
        onToggle={action('github-toggle')}
        onConnect={action('github-connect')}
        onConfigure={action('github-configure')}
      />
      
      <ConnectorCard
        id="slack"
        name="Slack"
        description="Team collaboration and communication platform."
        category="collaboration"
        provider="Slack Technologies"
        status="connected"
        enabled={true}
        configurationComplete={true}
        activeConnections={1}
        lastActivity={new Date(Date.now() - 2 * 60 * 60 * 1000)}
        tags={['Chat', 'Teams']}
        supportsWebhooks={true}
        icon="https://logo.clearbit.com/slack.com"
        onToggle={action('slack-toggle')}
        onConnect={action('slack-connect')}
        onConfigure={action('slack-configure')}
      />
    </div>
  ),
};

export const StatusVariations: Story = {
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '16px',
      maxWidth: '1400px'
    }}>
      <ConnectorCard
        id="connected"
        name="Connected Service"
        description="This connector is successfully connected and working properly."
        category="cloud"
        provider="Example Provider"
        status="connected"
        enabled={true}
        configurationComplete={true}
        activeConnections={5}
        lastActivity={new Date(Date.now() - 1 * 60 * 60 * 1000)}
        tags={['Active', 'Healthy']}
        supportsWebhooks={true}
        onToggle={action('connected-toggle')}
        onConnect={action('connected-connect')}
        onConfigure={action('connected-configure')}
      />
      
      <ConnectorCard
        id="disconnected"
        name="Disconnected Service"
        description="This connector is currently disconnected and not active."
        category="storage"
        provider="Example Provider"
        status="disconnected"
        enabled={false}
        configurationComplete={true}
        activeConnections={0}
        lastActivity={new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)}
        tags={['Inactive']}
        supportsWebhooks={true}
        onToggle={action('disconnected-toggle')}
        onConnect={action('disconnected-connect')}
        onConfigure={action('disconnected-configure')}
      />
      
      <ConnectorCard
        id="error"
        name="Error Service"
        description="This connector has encountered an error and needs attention."
        category="monitoring"
        provider="Example Provider"
        status="error"
        enabled={false}
        configurationComplete={false}
        activeConnections={0}
        lastActivity={new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)}
        tags={['Error', 'Needs Fix']}
        supportsWebhooks={false}
        onToggle={action('error-toggle')}
        onConnect={action('error-connect')}
        onConfigure={action('error-configure')}
      />
      
      <ConnectorCard
        id="pending"
        name="Pending Service"
        description="This connector is currently being set up and connected."
        category="cicd"
        provider="Example Provider"
        status="pending"
        enabled={true}
        configurationComplete={false}
        activeConnections={0}
        tags={['Setup', 'In Progress']}
        isBeta={true}
        supportsWebhooks={true}
        onToggle={action('pending-toggle')}
        onConnect={action('pending-connect')}
        onConfigure={action('pending-configure')}
      />
    </div>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [connectors, setConnectors] = React.useState<Pick<ConnectorCardProps, 'id' | 'name' | 'description' | 'category' | 'provider' | 'status' | 'enabled' | 'configurationComplete' | 'activeConnections' | 'tags' | 'supportsWebhooks' | 'icon'>[]>([
      {
        id: 'interactive-aws',
        name: 'AWS S3',
        description: 'Interactive Amazon S3 storage connector.',
        category: 'storage',
        provider: 'Amazon Web Services',
        status: 'disconnected',
        enabled: false,
        configurationComplete: true,
        activeConnections: 0,
        tags: ['Storage', 'AWS'],
        supportsWebhooks: true,
        icon: 'https://logo.clearbit.com/aws.amazon.com',
      },
    ]);

    const handleToggle = (id: string, enabled: boolean) => {
      setConnectors(prev => prev.map(conn => 
        conn.id === id ? { ...conn, enabled } : conn
      ));
      console.log('toggle', id, enabled);
    };

    const handleConnect = (id: string) => {
      setConnectors(prev => prev.map(conn => 
        conn.id === id 
          ? { 
              ...conn, 
              status: conn.status === 'connected' ? 'disconnected' : 'connected',
              activeConnections: conn.status === 'connected' ? 0 : 3,
            }
          : conn
      ));
      console.log('connect', id);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ 
          padding: '16px', 
          background: '#f5f5f5', 
          borderRadius: '8px' 
        }}>
          <p><strong>Interactive Demo:</strong> Try toggling the connector or connecting/disconnecting.</p>
          <p>Status: <strong>{connectors[0].status}</strong> | Enabled: <strong>{connectors[0].enabled ? 'Yes' : 'No'}</strong></p>
        </div>
        
        <div style={{ maxWidth: '400px' }}>
          <ConnectorCard
            {...connectors[0]}
            lastActivity={new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)}
            onToggle={handleToggle}
            onConnect={handleConnect}
            onConfigure={action('configure')}
            onViewDetails={action('view-details')}
          />
        </div>
      </div>
    );
  },
};