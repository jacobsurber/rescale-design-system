import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  InputNumber,
  Switch,
  Slider,
  Radio,
  Checkbox,
  Upload,
  Button,
  Steps,
  Alert,
  Divider,
  Space,
  Typography,
  message,
} from 'antd';
import { InboxOutlined, EyeOutlined, CloudUploadOutlined,  } from '@ant-design/icons';
import {
  MainLayout,
  PageHeader,
  DateRangePicker,
  EnhancedSelect,
  SoftwareLogoGrid,
  QuickActions,
} from '../index';
import type { SoftwareItem } from '../index';
import styled from 'styled-components';
import { Icon } from '../components/atoms/Icon';

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Dragger } = Upload;

// Mock data
const softwareOptions: SoftwareItem[] = [
  {
    id: 'ansys-fluent',
    name: 'ANSYS Fluent',
    version: '2024.1',
    logo: '🌊',
    description: 'Computational Fluid Dynamics solver',
    category: 'CFD',
  },
  {
    id: 'openfoam',
    name: 'OpenFOAM',
    version: '11.0',
    logo: '💨',
    description: 'Open source CFD toolbox',
    category: 'CFD',
  },
  {
    id: 'abaqus',
    name: 'Abaqus',
    version: '2024',
    logo: '🔧',
    description: 'Finite Element Analysis',
    category: 'FEA',
  },
  {
    id: 'star-ccm',
    name: 'STAR-CCM+',
    version: '2024.1',
    logo: '⭐',
    description: 'Multiphysics simulation',
    category: 'CFD',
  },
  {
    id: 'matlab',
    name: 'MATLAB',
    version: 'R2024a',
    logo: '📊',
    description: 'Technical computing',
    category: 'Computing',
  },
  {
    id: 'python',
    name: 'Python',
    version: '3.11',
    logo: '🐍',
    description: 'Programming language',
    category: 'Computing',
  },
];

const FormContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const StepCard = styled(Card)`
  margin-bottom: var(--rescale-space-4);
  
  .ant-card-head {
    background: var(--rescale-color-gray-50);
    border-bottom: 1px solid var(--rescale-color-gray-200);
  }
`;

const FileUploadArea = styled.div`
  border: 2px dashed var(--rescale-color-gray-300);
  border-radius: var(--rescale-radius-base);
  padding: var(--rescale-space-6);
  text-align: center;
  background: var(--rescale-color-gray-50);
  
  &:hover {
    border-color: var(--rescale-color-brand-blue);
    background: var(--rescale-color-light-blue);
  }
`;

const ParameterSection = styled.div`
  background: var(--rescale-color-gray-50);
  padding: var(--rescale-space-4);
  border-radius: var(--rescale-radius-base);
  margin-bottom: var(--rescale-space-4);
`;

export function FormExamplePage() {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSoftware, setSelectedSoftware] = useState<SoftwareItem[]>([]);
  const [formData, setFormData] = useState<any>({});

  const steps = [
    {
      title: 'Basic Information',
      description: 'Job name and description',
    },
    {
      title: 'Software Selection',
      description: 'Choose simulation software',
    },
    {
      title: 'Parameters',
      description: 'Configure simulation parameters',
    },
    {
      title: 'Files & Resources',
      description: 'Upload files and set resources',
    },
    {
      title: 'Review & Submit',
      description: 'Review and submit job',
    },
  ];

  const handleNext = async () => {
    try {
      const values = await form.validateFields();
      setFormData({ ...formData, ...values });
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const finalData = { ...formData, ...values };
      console.log('Final form data:', finalData);
      message.success('Job submitted successfully!');
    } catch (error) {
      console.error('Submit failed:', error);
    }
  };

  const handleSoftwareSelect = (software: SoftwareItem) => {
    if (!selectedSoftware.find(s => s.id === software.id)) {
      setSelectedSoftware([...selectedSoftware, software]);
      form.setFieldValue('software', [...selectedSoftware, software]);
    }
  };

  const handleSoftwareRemove = (softwareId: string) => {
    const updated = selectedSoftware.filter(s => s.id !== softwareId);
    setSelectedSoftware(updated);
    form.setFieldValue('software', updated);
  };

  const renderBasicInformation = () => (
    <StepCard title="Basic Information">
      <Row gutter={24}>
        <Col span={24}>
          <Form.Item
            label="Job Name"
            name="jobName"
            rules={[{ required: true, message: 'Please enter a job name' }]}
          >
            <Input placeholder="Enter descriptive job name" size="large" />
          </Form.Item>
        </Col>
        
        <Col span={24}>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please enter a description' }]}
          >
            <TextArea
              rows={4}
              placeholder="Describe your simulation objectives, methodology, and expected outcomes"
            />
          </Form.Item>
        </Col>
        
        <Col md={12} sm={24}>
          <Form.Item
            label="Project"
            name="project"
            rules={[{ required: true, message: 'Please select a project' }]}
          >
            <Select
              placeholder="Select project"
              size="large"
              options={[
                { label: 'Aerospace Research', value: 'aerospace' },
                { label: 'Automotive Development', value: 'automotive' },
                { label: 'Energy Systems', value: 'energy' },
                { label: 'Materials Science', value: 'materials' },
              ]}
            />
          </Form.Item>
        </Col>
        
        <Col md={12} sm={24}>
          <Form.Item
            label="Priority"
            name="priority"
            initialValue="medium"
          >
            <Radio.Group size="large">
              <Radio.Button value="low">Low</Radio.Button>
              <Radio.Button value="medium">Medium</Radio.Button>
              <Radio.Button value="high">High</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
        
        <Col span={24}>
          <Form.Item label="Tags" name="tags">
            <Select
              mode="tags"
              placeholder="Add tags (press Enter to add)"
              style={{ width: '100%' }}
              tokenSeparators={[',']}
            />
          </Form.Item>
        </Col>
      </Row>
    </StepCard>
  );

  const renderSoftwareSelection = () => (
    <StepCard title="Software Selection">
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div>
          <Title level={5}>Available Software:</Title>
          <SoftwareLogoGrid
            items={softwareOptions}
            maxVisible={8}
            size="large"
            showNames={true}
            onItemClick={handleSoftwareSelect}
            clickable={true}
          />
        </div>
        
        {selectedSoftware.length > 0 && (
          <div>
            <Title level={5}>Selected Software:</Title>
            <Space wrap>
              {selectedSoftware.map(software => (
                <Card key={software.id} size="small" style={{ width: 200 }}>
                  <Space>
                    <span style={{ fontSize: '20px' }}>{software.logo}</span>
                    <div>
                      <Text strong>{software.name}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {software.version}
                      </Text>
                    </div>
                    <Button
                      size="small"
                      danger
                      type="text"
                      onClick={() => handleSoftwareRemove(software.id)}
                    >
                      Remove
                    </Button>
                  </Space>
                </Card>
              ))}
            </Space>
          </div>
        )}
        
        <Form.Item name="software" hidden>
          <Input />
        </Form.Item>
      </Space>
    </StepCard>
  );

  const renderParameters = () => (
    <StepCard title="Simulation Parameters">
      <Row gutter={24}>
        <Col md={12} sm={24}>
          <ParameterSection>
            <Title level={5}>Mesh Configuration</Title>
            <Form.Item label="Mesh Size" name="meshSize" initialValue={1000000}>
              <InputNumber
                min={100000}
                max={50000000}
                step={100000}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                style={{ width: '100%' }}
                addonAfter="cells"
              />
            </Form.Item>
            
            <Form.Item label="Mesh Quality" name="meshQuality" initialValue={0.8}>
              <Slider
                min={0.1}
                max={1.0}
                step={0.1}
                marks={{
                  0.1: 'Coarse',
                  0.5: 'Medium', 
                  1.0: 'Fine'
                }}
              />
            </Form.Item>
          </ParameterSection>
        </Col>
        
        <Col md={12} sm={24}>
          <ParameterSection>
            <Title level={5}>Solver Configuration</Title>
            <Form.Item label="Solver Type" name="solverType" initialValue="pressure-based">
              <Select
                options={[
                  { label: 'Pressure-Based', value: 'pressure-based' },
                  { label: 'Density-Based', value: 'density-based' },
                  { label: 'Coupled', value: 'coupled' },
                ]}
              />
            </Form.Item>
            
            <Form.Item label="Time Step (s)" name="timeStep" initialValue={0.001}>
              <InputNumber
                min={0.0001}
                max={1}
                step={0.0001}
                precision={4}
                style={{ width: '100%' }}
              />
            </Form.Item>
            
            <Form.Item label="Max Iterations" name="maxIterations" initialValue={1000}>
              <InputNumber
                min={100}
                max={10000}
                step={100}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </ParameterSection>
        </Col>
        
        <Col span={24}>
          <ParameterSection>
            <Title level={5}>Advanced Options</Title>
            <Row gutter={16}>
              <Col md={8} sm={24}>
                <Form.Item label="Turbulence Model" name="turbulenceModel" initialValue="k-epsilon">
                  <Select
                    options={[
                      { label: 'k-epsilon', value: 'k-epsilon' },
                      { label: 'k-omega SST', value: 'k-omega-sst' },
                      { label: 'Spalart-Allmaras', value: 'spalart-allmaras' },
                      { label: 'LES', value: 'les' },
                    ]}
                  />
                </Form.Item>
              </Col>
              
              <Col md={8} sm={24}>
                <Form.Item label="Convergence Criteria" name="convergence" initialValue={1e-5}>
                  <Select
                    options={[
                      { label: '1e-3', value: 1e-3 },
                      { label: '1e-4', value: 1e-4 },
                      { label: '1e-5', value: 1e-5 },
                      { label: '1e-6', value: 1e-6 },
                    ]}
                  />
                </Form.Item>
              </Col>
              
              <Col md={8} sm={24}>
                <Form.Item label="Parallel Processing" name="parallelProcessing" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
          </ParameterSection>
        </Col>
      </Row>
    </StepCard>
  );

  const renderFilesAndResources = () => (
    <StepCard title="Files & Resources">
      <Row gutter={24}>
        <Col md={12} sm={24}>
          <Title level={5}>Input Files</Title>
          <Form.Item name="inputFiles">
            <Dragger
              multiple
              action="/api/upload"
              accept=".mesh,.cas,.dat,.msh,.inp"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag files to this area to upload</p>
              <p className="ant-upload-hint">
                Support for mesh files, case files, and input data
              </p>
            </Dragger>
          </Form.Item>
        </Col>
        
        <Col md={12} sm={24}>
          <Title level={5}>Resource Requirements</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Form.Item label="CPU Cores" name="cpuCores" initialValue={16}>
              <Slider
                min={1}
                max={128}
                marks={{
                  1: '1',
                  16: '16',
                  32: '32',
                  64: '64',
                  128: '128'
                }}
              />
            </Form.Item>
            
            <Form.Item label="Memory (GB)" name="memory" initialValue={32}>
              <Slider
                min={4}
                max={512}
                marks={{
                  4: '4GB',
                  32: '32GB',
                  128: '128GB',
                  512: '512GB'
                }}
              />
            </Form.Item>
            
            <Form.Item label="Storage (GB)" name="storage" initialValue={100}>
              <Slider
                min={10}
                max={1000}
                marks={{
                  10: '10GB',
                  100: '100GB',
                  500: '500GB',
                  1000: '1TB'
                }}
              />
            </Form.Item>
            
            <Form.Item label="Max Runtime" name="maxRuntime">
              <Select
                placeholder="Select maximum runtime"
                options={[
                  { label: '1 hour', value: '1h' },
                  { label: '6 hours', value: '6h' },
                  { label: '12 hours', value: '12h' },
                  { label: '24 hours', value: '24h' },
                  { label: '48 hours', value: '48h' },
                  { label: 'No limit', value: 'unlimited' },
                ]}
              />
            </Form.Item>
          </Space>
        </Col>
        
        <Col span={24}>
          <Divider />
          <Title level={5}>Additional Options</Title>
          <Row gutter={16}>
            <Col md={8} sm={24}>
              <Form.Item label="Email Notifications" name="emailNotifications" valuePropName="checked">
                <Checkbox>Send email when job completes</Checkbox>
              </Form.Item>
            </Col>
            
            <Col md={8} sm={24}>
              <Form.Item label="Auto-Download Results" name="autoDownload" valuePropName="checked">
                <Checkbox>Automatically download results</Checkbox>
              </Form.Item>
            </Col>
            
            <Col md={8} sm={24}>
              <Form.Item label="Archive Job" name="archiveJob" valuePropName="checked">
                <Checkbox>Archive job after completion</Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>
    </StepCard>
  );

  const renderReviewAndSubmit = () => (
    <StepCard title="Review & Submit">
      <Alert
        message="Review Your Job Configuration"
        description="Please review all settings before submitting your job. Once submitted, some parameters cannot be changed."
        type="info"
        showIcon
        style={{ marginBottom: '24px' }}
      />
      
      <Row gutter={24}>
        <Col md={12} sm={24}>
          <Card title="Job Summary" size="small">
            <p><strong>Name:</strong> {formData.jobName || 'Not specified'}</p>
            <p><strong>Project:</strong> {formData.project || 'Not specified'}</p>
            <p><strong>Priority:</strong> {formData.priority || 'Medium'}</p>
            <p><strong>Selected Software:</strong></p>
            <ul>
              {selectedSoftware.map(software => (
                <li key={software.id}>{software.name} {software.version}</li>
              ))}
            </ul>
          </Card>
        </Col>
        
        <Col md={12} sm={24}>
          <Card title="Resource Summary" size="small">
            <p><strong>CPU Cores:</strong> {formData.cpuCores || 16}</p>
            <p><strong>Memory:</strong> {formData.memory || 32} GB</p>
            <p><strong>Storage:</strong> {formData.storage || 100} GB</p>
            <p><strong>Max Runtime:</strong> {formData.maxRuntime || 'Not specified'}</p>
          </Card>
        </Col>
        
        <Col span={24}>
          <Card title="Estimated Cost" size="small">
            <Row gutter={16}>
              <Col span={8}>
                <Statistic title="Compute Cost" value={125.50} prefix="$" precision={2} />
              </Col>
              <Col span={8}>
                <Statistic title="Storage Cost" value={12.30} prefix="$" precision={2} />
              </Col>
              <Col span={8}>
                <Statistic title="Total Estimated" value={137.80} prefix="$" precision={2} />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </StepCard>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderBasicInformation();
      case 1:
        return renderSoftwareSelection();
      case 2:
        return renderParameters();
      case 3:
        return renderFilesAndResources();
      case 4:
        return renderReviewAndSubmit();
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="New Simulation Job"
        subTitle="Configure and submit a new simulation job"
        extra={
          <QuickActions
            actions={[
              {
                id: 'save-draft',
                label: 'Save Draft',
                icon: <Icon name="SaveOutlined" />,
                type: 'secondary',
              },
              {
                id: 'preview',
                label: 'Preview',
                icon: <EyeOutlined />,
                type: 'secondary',
              },
            ]}
            showDefaults={false}
          />
        }
      />

      <FormContainer>
        <Steps current={currentStep} items={steps} style={{ marginBottom: '32px' }} />
        
        <Form
          form={form}
          layout="vertical"
          size="large"
          scrollToFirstError
        >
          {renderStepContent()}
        </Form>
        
        <Card>
          <Space>
            {currentStep > 0 && (
              <Button size="large" onClick={handlePrev}>
                Previous
              </Button>
            )}
            
            {currentStep < steps.length - 1 && (
              <Button type="primary" size="large" onClick={handleNext}>
                Next
              </Button>
            )}
            
            {currentStep === steps.length - 1 && (
              <Button
                type="primary"
                size="large"
                icon={<Icon name="PlayCircleOutlined" />}
                onClick={handleSubmit}
              >
                Submit Job
              </Button>
            )}
          </Space>
        </Card>
      </FormContainer>
    </MainLayout>
  );
}