import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Row, Col, Space, Divider, Card as AntCard } from 'antd';
import { 
  HomeOutlined, 
  UserOutlined, 
  CloudOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  DownloadOutlined,
  BarChartOutlined,
  TrophyOutlined,
} from '@ant-design/icons';

// Import all components
import { Button } from '../components/atoms/Button';
import { Icon } from '../components/atoms/Icon';
import { Logo } from '../components/atoms/Logo';
import { StatusTag } from '../components/atoms/StatusTag';
import { LoadingSpinner } from '../components/atoms/LoadingSpinner';
import { FormInput } from '../components/molecules/FormInput';
import { PageHeader } from '../components/molecules/PageHeader';
import { JobsTable } from '../components/organisms/JobsTable';
import { SoftwareLogoGrid } from '../components/organisms/SoftwareLogoGrid';
import { Sidebar } from '../components/organisms/Sidebar';
import type { Job } from '../components/organisms/JobsTable';

const meta: Meta = {
  title: 'Design System/Kitchen Sink',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Kitchen Sink - All Components

This page showcases all available components in the Rescale Design System, demonstrating how they work together to create cohesive user interfaces.

## Components Included

### Atoms
- Button (all variants and sizes)
- Icon (with theme colors)
- Logo (software mapping)
- StatusTag (all states)
- LoadingSpinner

### Molecules  
- FormInput (with validation)
- PageHeader (with breadcrumbs)

### Organisms
- JobsTable (with sample data)
- SoftwareLogoGrid (engineering software)
- Sidebar (navigation menu)

### Design System
Use this page to test visual consistency, spacing, and component interactions across the entire system.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// Sample data
const sampleJobs: Job[] = [
  {
    id: 'job-1',
    name: 'CFD_Analysis_001',
    status: 'running',
    priority: 'high',
    software: [{ name: 'ANSYS Fluent', version: '2024.1' }],
    user: { id: 'user1', name: 'Dr. Sarah Chen', email: 'sarah@rescale.com' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    resources: { cores: 32, memory: 128, storage: 500, cpuUsage: 75, memoryUsage: 68 },
  },
  {
    id: 'job-2',
    name: 'Structural_Simulation',
    status: 'completed',
    priority: 'normal',
    software: [{ name: 'Abaqus', version: '2024' }],
    user: { id: 'user2', name: 'Mike Johnson', email: 'mike@rescale.com' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    resources: { cores: 16, memory: 64, storage: 250, cpuUsage: 100, memoryUsage: 95 },
  },
  {
    id: 'job-3',
    name: 'Optimization_Study',
    status: 'failed',
    priority: 'critical',
    software: [{ name: 'MATLAB', version: 'R2024a' }],
    user: { id: 'user3', name: 'Dr. Lisa Wang', email: 'lisa@rescale.com' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    resources: { cores: 8, memory: 32, storage: 100, cpuUsage: 0, memoryUsage: 0 },
  },
];

const sampleSoftware = [
  { id: '1', name: 'ANSYS Fluent', software: 'ansys', version: '2024.1', category: 'CFD' },
  { id: '2', name: 'OpenFOAM', software: 'openfoam', version: '11', category: 'CFD' },
  { id: '3', name: 'Abaqus', software: 'abaqus', version: '2024', category: 'FEA' },
  { id: '4', name: 'MATLAB', software: 'matlab', version: 'R2024a', category: 'Computing' },
  { id: '5', name: 'Python', software: 'python', version: '3.11', category: 'Computing' },
  { id: '6', name: 'COMSOL', software: 'comsol', version: '6.1', category: 'Simulation' },
];

const sampleMenuItems = [
  { key: 'dashboard', icon: <HomeOutlined />, label: 'Dashboard' },
  { key: 'jobs', icon: <CloudOutlined />, label: 'Jobs' },
  { key: 'analytics', icon: <BarChartOutlined />, label: 'Analytics' },
];

const sampleUserProfile = {
  name: 'Dr. Sarah Chen',
  email: 'sarah.chen@rescale.com',
  role: 'Senior Engineer',
};

export const AllComponents: Story = {
  render: () => (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      {/* Page Header */}
      <PageHeader
        title="Kitchen Sink - All Components"
        description="Comprehensive showcase of the Rescale Design System"
        breadcrumbs={[
          { title: 'Design System', href: '/design-system' },
          { title: 'Kitchen Sink' },
        ]}
        actions={[
          {
            key: 'export',
            label: 'Export',
            icon: <DownloadOutlined />,
            onClick: () => alert('Export clicked'),
          },
          {
            key: 'new',
            label: 'Create New',
            type: 'primary',
            icon: <PlusOutlined />,
            onClick: () => alert('Create clicked'),
          },
        ]}
      />

      <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Atoms Section */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ marginBottom: '24px', color: '#1f1f1f' }}>Atoms</h2>
          
          <Row gutter={[24, 24]}>
            {/* Buttons */}
            <Col xs={24} lg={12}>
              <AntCard title="Buttons">
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div>
                    <h4 style={{ marginBottom: '12px' }}>Variants</h4>
                    <Space wrap>
                      <Button variant="primary">Primary</Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="text">Text</Button>
                      <Button variant="danger">Danger</Button>
                    </Space>
                  </div>
                  
                  <div>
                    <h4 style={{ marginBottom: '12px' }}>Sizes</h4>
                    <Space align="center" wrap>
                      <Button size="xs">Extra Small</Button>
                      <Button size="sm">Small</Button>
                      <Button size="md">Medium</Button>
                      <Button size="lg">Large</Button>
                      <Button size="xl">Extra Large</Button>
                    </Space>
                  </div>
                  
                  <div>
                    <h4 style={{ marginBottom: '12px' }}>With Icons</h4>
                    <Space wrap>
                      <Button icon={<EditOutlined />}>Edit</Button>
                      <Button icon={<DeleteOutlined />} variant="danger">Delete</Button>
                      <Button icon={<PlusOutlined />} variant="primary">Add New</Button>
                      <Button icon={<DownloadOutlined />} variant="ghost">Download</Button>
                    </Space>
                  </div>
                </Space>
              </AntCard>
            </Col>

            {/* Icons and Status */}
            <Col xs={24} lg={12}>
              <AntCard title="Icons & Status" size="md">
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div>
                    <h4 style={{ marginBottom: '12px' }}>Icons</h4>
                    <Space size="large">
                      <Icon name="HomeOutlined" size="lg" color="primary" />
                      <Icon name="UserOutlined" size="lg" color="secondary" />
                      <Icon name="CloudOutlined" size="lg" color="success" />
                      <Icon name="BarChartOutlined" size="lg" color="warning" />
                      <Icon name="EditOutlined" size="lg" color="error" />
                    </Space>
                  </div>
                  
                  <div>
                    <h4 style={{ marginBottom: '12px' }}>Software Logos</h4>
                    <Space size="large">
                      <Logo software="ansys" alt="ANSYS" size="lg" />
                      <Logo software="python" alt="Python" size="lg" />
                      <Logo software="matlab" alt="MATLAB" size="lg" />
                      <Logo software="comsol" alt="COMSOL" size="lg" />
                    </Space>
                  </div>
                  
                  <div>
                    <h4 style={{ marginBottom: '12px' }}>Status Tags</h4>
                    <Space wrap>
                      <StatusTag status="pending" />
                      <StatusTag status="running" />
                      <StatusTag status="completed" />
                      <StatusTag status="failed" />
                      <StatusTag status="cancelled" />
                    </Space>
                  </div>
                  
                  <div>
                    <h4 style={{ marginBottom: '12px' }}>Loading Spinner</h4>
                    <LoadingSpinner size="md" />
                  </div>
                </Space>
              </AntCard>
            </Col>
          </Row>
        </section>

        {/* Molecules Section */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ marginBottom: '24px', color: '#1f1f1f' }}>Molecules</h2>
          
          <Row gutter={[24, 24]}>
            {/* Cards */}
            <Col xs={24} lg={8}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <AntCard title="Default Card" size="sm">
                  Standard card with light border and background
                </AntCard>
                <AntCard title="Elevated Card" variant="elevated" size="sm" elevation="md">
                  Elevated card with shadow
                </AntCard>
                <AntCard title="Outlined Card" variant="outlined" size="sm">
                  Clean outlined card
                </AntCard>
              </Space>
            </Col>

            {/* Status Tags and Loading */}
            <Col xs={24} lg={8}>
              <AntCard title="Status Tags">
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div>
                    <h4 style={{ marginBottom: '12px' }}>Status Variants</h4>
                    <Space wrap>
                      <StatusTag status="pending" />
                      <StatusTag status="running" />
                      <StatusTag status="completed" />
                      <StatusTag status="failed" />
                      <StatusTag status="cancelled" />
                    </Space>
                  </div>
                  <div>
                    <h4 style={{ marginBottom: '12px' }}>Loading Spinner</h4>
                    <LoadingSpinner size="sm" />
                  </div>
                </Space>
              </AntCard>
            </Col>

            {/* Form Elements */}
            <Col xs={24} lg={8}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <FormInput
                  name="jobName"
                  label="Job Name"
                  placeholder="Enter job name"
                  required
                />
                <FormInput
                  name="description"
                  label="Description"
                  placeholder="Job description"
                  helperText="Optional description for the job"
                />
                <FormInput
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="user@rescale.com"
                  required
                />
              </Space>
            </Col>
          </Row>
        </section>

        {/* Organisms Section */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ marginBottom: '24px', color: '#1f1f1f' }}>Organisms</h2>
          
          <Row gutter={[24, 24]}>
            {/* Software Logo Grid */}
            <Col xs={24} lg={12}>
              <AntCard title="Software Logo Grid" size="md">
                <SoftwareLogoGrid
                  items={sampleSoftware}
                  size="default"
                  showNames
                  maxVisible={4}
                />
              </AntCard>
            </Col>

            {/* Sidebar Preview */}
            <Col xs={24} lg={12}>
              <AntCard title="Sidebar Navigation" size="md">
                <div style={{ height: '300px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ 
                    width: '240px', 
                    height: '100%', 
                    transform: 'scale(0.8)', 
                    transformOrigin: 'top left',
                    border: '1px solid #f0f0f0',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}>
                    <Sidebar
                      items={sampleMenuItems}
                      selectedKey="dashboard"
                      userProfile={sampleUserProfile}
                      collapsed={false}
                    />
                  </div>
                </div>
              </AntCard>
            </Col>
          </Row>
        </section>

        {/* Data Table Section */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ marginBottom: '24px', color: '#1f1f1f' }}>Data Display</h2>
          
          <AntCard title="Jobs Table" size="md">
            <JobsTable
              jobs={sampleJobs}
              selectable
              showPagination={false}
            />
          </AntCard>
        </section>

        {/* Interactive Elements */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ marginBottom: '24px', color: '#1f1f1f' }}>Interactive Elements</h2>
          
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={8}>
              <AntCard title="Clickable Cards" size="md">
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <AntCard 
                    size="sm" 
                    hoverable 
                    onClick={() => alert('Card 1 clicked!')}
                    style={{ cursor: 'pointer' }}
                  >
                    <Space>
                      <Icon name="CloudOutlined" color="primary" />
                      <div>
                        <div style={{ fontWeight: 600 }}>Active Jobs</div>
                        <div style={{ fontSize: 12, color: '#666' }}>Click to view details</div>
                      </div>
                    </Space>
                  </AntCard>
                  
                  <AntCard 
                    size="sm" 
                    hoverBorder
                    onClick={() => alert('Card 2 clicked!')}
                    style={{ cursor: 'pointer' }}
                  >
                    <Space>
                      <Icon name="BarChartOutlined" color="success" />
                      <div>
                        <div style={{ fontWeight: 600 }}>Analytics</div>
                        <div style={{ fontSize: 12, color: '#666' }}>View performance metrics</div>
                      </div>
                    </Space>
                  </AntCard>
                </Space>
              </AntCard>
            </Col>

            <Col xs={24} lg={8}>
              <AntCard title="Interactive Icons" size="md">
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div>
                    <h4 style={{ marginBottom: '12px' }}>Clickable Icons</h4>
                    <Space size="large">
                      <Icon 
                        name="EditOutlined" 
                        size="lg" 
                        clickable 
                        onClick={() => alert('Edit clicked!')}
                      />
                      <Icon 
                        name="DeleteOutlined" 
                        size="lg" 
                        color="error"
                        clickable 
                        onClick={() => alert('Delete clicked!')}
                      />
                      <Icon 
                        name="DownloadOutlined" 
                        size="lg" 
                        clickable 
                        onClick={() => alert('Download clicked!')}
                      />
                    </Space>
                  </div>
                  
                  <div>
                    <h4 style={{ marginBottom: '12px' }}>Software Selection</h4>
                    <Space wrap>
                      <Logo 
                        software="ansys" 
                        alt="ANSYS" 
                        size="md" 
                        clickable
                        onClick={() => alert('ANSYS selected!')}
                      />
                      <Logo 
                        software="python" 
                        alt="Python" 
                        size="md" 
                        clickable
                        onClick={() => alert('Python selected!')}
                      />
                      <Logo 
                        software="matlab" 
                        alt="MATLAB" 
                        size="md" 
                        clickable
                        onClick={() => alert('MATLAB selected!')}
                      />
                    </Space>
                  </div>
                </Space>
              </AntCard>
            </Col>

            <Col xs={24} lg={8}>
              <AntCard title="Action Buttons" size="md">
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Button 
                    variant="primary" 
                    style={{ width: '100%' }}
                    onClick={() => alert('Primary action!')}
                  >
                    Primary Action
                  </Button>
                  <Button 
                    variant="secondary" 
                    icon={<EditOutlined />}
                    style={{ width: '100%' }}
                    onClick={() => alert('Secondary action!')}
                  >
                    Edit Configuration
                  </Button>
                  <Button 
                    variant="ghost" 
                    icon={<DownloadOutlined />}
                    style={{ width: '100%' }}
                    onClick={() => alert('Ghost action!')}
                  >
                    Download Results
                  </Button>
                  <Button 
                    variant="danger" 
                    icon={<DeleteOutlined />}
                    style={{ width: '100%' }}
                    onClick={() => confirm('Are you sure?') && alert('Deleted!')}
                  >
                    Delete Job
                  </Button>
                </Space>
              </AntCard>
            </Col>
          </Row>
        </section>

        {/* Footer */}
        <Divider />
        <div style={{ textAlign: 'center', color: '#666', padding: '24px 0' }}>
          <p>Rescale Design System - Kitchen Sink</p>
          <p>All components working together in harmony</p>
        </div>
      </div>
    </div>
  ),
};

export const ColorThemes: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <h2 style={{ marginBottom: '24px' }}>Component Color Themes</h2>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={6}>
          <h3>Primary Theme</h3>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Button variant="primary">Primary Button</Button>
            <StatusTag status="running" />
            <StatusTag status="running" />
            <Icon name="CloudOutlined" size="lg" color="primary" />
          </Space>
        </Col>
        
        <Col xs={24} lg={6}>
          <h3>Success Theme</h3>  
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Button variant="success">Success Button</Button>
            <StatusTag status="completed" />
            <StatusTag status="completed" />
            <Icon name="TrophyOutlined" size="lg" color="success" />
          </Space>
        </Col>
        
        <Col xs={24} lg={6}>
          <h3>Warning Theme</h3>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Button variant="warning">Warning Button</Button>
            <StatusTag status="pending" />
            <StatusTag status="pending" />
            <Icon name="BarChartOutlined" size="lg" color="warning" />
          </Space>
        </Col>
        
        <Col xs={24} lg={6}>
          <h3>Error Theme</h3>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Button variant="danger">Error Button</Button>
            <StatusTag status="failed" />
            <StatusTag status="failed" />
            <Icon name="DeleteOutlined" size="lg" color="error" />
          </Space>
        </Col>
      </Row>
    </div>
  ),
};