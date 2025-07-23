import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button, type ButtonVariant, type ButtonSize } from './Button';
import { buttonSizes } from './Button.constants';
import { Space, Row, Col, Divider } from 'antd';
import { 
  PlusOutlined, 
  DeleteOutlined, 
  DownloadOutlined, 
  EditOutlined,
  SearchOutlined,
  SaveOutlined,
  UploadOutlined,
  HeartOutlined,
  StarOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Enhanced button component with comprehensive variant system, size options, and design token integration.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'ghost', 'text', 'danger', 'success', 'warning'],
      description: 'Visual variant of the button',
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size of the button',
    },
    shape: {
      control: { type: 'select' },
      options: ['default', 'round', 'circle'],
      description: 'Shape of the button',
    },
    iconOnly: {
      control: { type: 'boolean' },
      description: 'Whether this is an icon-only button',
    },
    disableAnimations: {
      control: { type: 'boolean' },
      description: 'Disable hover and tap animations',
    },
    showFocusRing: {
      control: { type: 'boolean' },
      description: 'Show focus ring for accessibility',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Loading state',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disabled state',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Default Button',
    variant: 'primary',
    size: 'md',
  },
};

export const AllVariants: Story = {
  render: () => (
    <Space direction="vertical" size="large">
      <div>
        <h3 style={{ marginBottom: 16 }}>Button Variants</h3>
        <Space wrap>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="text">Text</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="success">Success</Button>
          <Button variant="warning">Warning</Button>
        </Space>
      </div>
    </Space>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available button variants showing different visual styles for various use cases.',
      },
    },
  },
};

export const AllSizes: Story = {
  render: () => (
    <Space direction="vertical" size="large">
      <div>
        <h3 style={{ marginBottom: 16 }}>Button Sizes</h3>
        <Space align="center" wrap>
          <Button size="xs">Extra Small</Button>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Extra Large</Button>
        </Space>
      </div>
      
      <div>
        <h3 style={{ marginBottom: 16 }}>Size Comparison</h3>
        <Row gutter={[16, 16]}>
          {Object.entries(buttonSizes).map(([size, config]) => (
            <Col key={size} span={24}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Button size={size as ButtonSize}>{size.toUpperCase()}</Button>
                <span style={{ color: '#666', fontSize: 12 }}>
                  {config.height} × {config.padding} | {config.fontSize}px
                </span>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </Space>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete size system from xs (24px) to xl (48px) with proportional typography and spacing.',
      },
    },
  },
};

export const IconButtons: Story = {
  render: () => (
    <Space direction="vertical" size="large">
      <div>
        <h3 style={{ marginBottom: 16 }}>Icon-Only Buttons</h3>
        <Space wrap>
          <Button iconOnly icon={<PlusOutlined />} />
          <Button iconOnly icon={<EditOutlined />} variant="secondary" />
          <Button iconOnly icon={<DeleteOutlined />} variant="danger" />
          <Button iconOnly icon={<DownloadOutlined />} variant="ghost" />
          <Button iconOnly icon={<SearchOutlined />} variant="text" />
        </Space>
      </div>
      
      <div>
        <h3 style={{ marginBottom: 16 }}>Icon-Only Sizes</h3>
        <Space align="center" wrap>
          <Button iconOnly icon={<HeartOutlined />} size="xs" />
          <Button iconOnly icon={<HeartOutlined />} size="sm" />
          <Button iconOnly icon={<HeartOutlined />} size="md" />
          <Button iconOnly icon={<HeartOutlined />} size="lg" />
          <Button iconOnly icon={<HeartOutlined />} size="xl" />
        </Space>
      </div>
      
      <div>
        <h3 style={{ marginBottom: 16 }}>Buttons with Icons</h3>
        <Space wrap>
          <Button icon={<PlusOutlined />}>Add Item</Button>
          <Button icon={<SaveOutlined />} variant="secondary">Save</Button>
          <Button icon={<UploadOutlined />} variant="ghost">Upload</Button>
          <Button icon={<ShareAltOutlined />} variant="text">Share</Button>
        </Space>
      </div>
    </Space>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Icon-only buttons and buttons with icons. Icon-only buttons automatically adjust width to match height.',
      },
    },
  },
};

export const ButtonStates: Story = {
  render: () => (
    <Space direction="vertical" size="large">
      <div>
        <h3 style={{ marginBottom: 16 }}>Button States</h3>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Space direction="vertical">
              <h4>Default</h4>
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
            </Space>
          </Col>
          <Col span={6}>
            <Space direction="vertical">
              <h4>Loading</h4>
              <Button loading>Loading</Button>
              <Button variant="secondary" loading>Loading</Button>
              <Button variant="ghost" loading>Loading</Button>
            </Space>
          </Col>
          <Col span={6}>
            <Space direction="vertical">
              <h4>Disabled</h4>
              <Button disabled>Disabled</Button>
              <Button variant="secondary" disabled>Disabled</Button>
              <Button variant="ghost" disabled>Disabled</Button>
            </Space>
          </Col>
          <Col span={6}>
            <Space direction="vertical">
              <h4>Custom Loading</h4>
              <Button loading loadingText="Saving...">Save</Button>
              <Button variant="secondary" loading loadingText="Uploading...">Upload</Button>
              <Button variant="ghost" loading loadingText="Processing...">Process</Button>
            </Space>
          </Col>
        </Row>
      </div>
    </Space>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different button states including loading with custom text and disabled states.',
      },
    },
  },
};

export const VariantMatrix: Story = {
  render: () => {
    const variants: ButtonVariant[] = ['primary', 'secondary', 'ghost', 'text', 'danger', 'success', 'warning'];
    const sizes: ButtonSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
    
    return (
      <Space direction="vertical" size="large">
        <h3>Complete Variant × Size Matrix</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ padding: 8, textAlign: 'left', borderBottom: '1px solid #ddd' }}>Variant / Size</th>
                {sizes.map(size => (
                  <th key={size} style={{ padding: 8, textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                    {size.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {variants.map(variant => (
                <tr key={variant}>
                  <td style={{ padding: 8, borderBottom: '1px solid #eee', fontWeight: 'medium' }}>
                    {variant}
                  </td>
                  {sizes.map(size => (
                    <td key={`${variant}-${size}`} style={{ padding: 8, textAlign: 'center', borderBottom: '1px solid #eee' }}>
                      <Button variant={variant} size={size}>
                        {variant}
                      </Button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Space>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete matrix showing all variant and size combinations for comprehensive testing.',
      },
    },
  },
};

export const ButtonShapes: Story = {
  render: () => (
    <Space direction="vertical" size="large">
      <div>
        <h3 style={{ marginBottom: 16 }}>Button Shapes</h3>
        <Space wrap>
          <Button shape="default">Default Shape</Button>
          <Button shape="round">Round Shape</Button>
          <Button shape="circle" icon={<StarOutlined />} />
        </Space>
      </div>
      
      <div>
        <h3 style={{ marginBottom: 16 }}>Circle Buttons (All Sizes)</h3>
        <Space align="center" wrap>
          <Button shape="circle" icon={<PlusOutlined />} size="xs" />
          <Button shape="circle" icon={<PlusOutlined />} size="sm" />
          <Button shape="circle" icon={<PlusOutlined />} size="md" />
          <Button shape="circle" icon={<PlusOutlined />} size="lg" />
          <Button shape="circle" icon={<PlusOutlined />} size="xl" />
        </Space>
      </div>
    </Space>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different button shapes including default, round, and circle variants.',
      },
    },
  },
};

export const ButtonGroups: Story = {
  render: () => (
    <Space direction="vertical" size="large">
      <div>
        <h3 style={{ marginBottom: 16 }}>Button Groups</h3>
        <Space>
          <Button variant="primary">Primary Action</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Cancel</Button>
        </Space>
      </div>
      
      <div>
        <h3 style={{ marginBottom: 16 }}>Consistent Width Group</h3>
        <Space>
          <Button width={120}>Save</Button>
          <Button width={120} variant="secondary">Cancel</Button>
          <Button width={120} variant="ghost">Reset</Button>
        </Space>
      </div>
      
      <div>
        <h3 style={{ marginBottom: 16 }}>Action Toolbar</h3>
        <Space>
          <Button iconOnly icon={<EditOutlined />} variant="ghost" />
          <Button iconOnly icon={<DeleteOutlined />} variant="ghost" />
          <Button iconOnly icon={<DownloadOutlined />} variant="ghost" />
          <Divider type="vertical" />
          <Button icon={<PlusOutlined />} size="sm">Add New</Button>
        </Space>
      </div>
    </Space>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Examples of button groupings and consistent layouts for common interface patterns.',
      },
    },
  },
};

export const ResponsiveButtons: Story = {
  render: () => (
    <Space direction="vertical" size="large">
      <div>
        <h3 style={{ marginBottom: 16 }}>Responsive Button Patterns</h3>
        <div style={{ width: '100%', border: '1px dashed #ddd', padding: 16 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between' }}>
            <Button size="sm" style={{ flex: '1 1 auto', minWidth: 100 }}>
              Responsive
            </Button>
            <Button size="sm" variant="secondary" style={{ flex: '1 1 auto', minWidth: 100 }}>
              Buttons
            </Button>
            <Button size="sm" variant="ghost" style={{ flex: '1 1 auto', minWidth: 100 }}>
              That Scale
            </Button>
          </div>
        </div>
      </div>
    </Space>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Responsive button layouts that adapt to container width.',
      },
    },
  },
};

export const AccessibilityDemo: Story = {
  render: () => (
    <Space direction="vertical" size="large">
      <div>
        <h3 style={{ marginBottom: 16 }}>Accessibility Features</h3>
        <Space direction="vertical">
          <Button showFocusRing>Focus Ring Enabled (Default)</Button>
          <Button showFocusRing={false}>Focus Ring Disabled</Button>
          <Button disabled>Disabled Button (Not Focusable)</Button>
          <Button loading>Loading Button (Not Interactive)</Button>
        </Space>
      </div>
      
      <div style={{ padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
        <h4>Keyboard Navigation Test</h4>
        <p style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>
          Use Tab to navigate through these buttons and Space/Enter to activate them.
        </p>
        <Space wrap>
          <Button variant="primary" onClick={() => alert('Primary clicked!')}>
            Primary Action
          </Button>
          <Button variant="secondary" onClick={() => alert('Secondary clicked!')}>
            Secondary Action
          </Button>
          <Button variant="ghost" icon={<DeleteOutlined />} onClick={() => alert('Delete clicked!')}>
            Delete
          </Button>
          <Button iconOnly icon={<EditOutlined />} onClick={() => alert('Edit clicked!')} />
        </Space>
      </div>
    </Space>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Accessibility features including focus management, keyboard navigation, and screen reader support.',
      },
    },
  },
};

export const UsageExamples: Story = {
  render: () => (
    <Space direction="vertical" size="large">
      <div>
        <h3 style={{ marginBottom: 16 }}>Common Usage Patterns</h3>
        
        <div style={{ marginBottom: 24 }}>
          <h4>Form Actions</h4>
          <Space>
            <Button variant="primary" icon={<SaveOutlined />}>Save Changes</Button>
            <Button variant="secondary">Cancel</Button>
            <Button variant="text">Reset Form</Button>
          </Space>
        </div>
        
        <div style={{ marginBottom: 24 }}>
          <h4>Data Actions</h4>
          <Space>
            <Button variant="primary" icon={<PlusOutlined />} size="sm">Add Item</Button>
            <Button variant="ghost" icon={<EditOutlined />} size="sm">Edit</Button>
            <Button variant="danger" icon={<DeleteOutlined />} size="sm">Delete</Button>
          </Space>
        </div>
        
        <div style={{ marginBottom: 24 }}>
          <h4>Status Actions</h4>
          <Space>
            <Button variant="success" icon={<SaveOutlined />}>Complete</Button>
            <Button variant="warning" icon={<EditOutlined />}>Review</Button>
            <Button variant="danger" icon={<DeleteOutlined />}>Reject</Button>
          </Space>
        </div>
        
        <div>
          <h4>Compact Toolbar</h4>
          <Space>
            <Button iconOnly icon={<EditOutlined />} size="xs" variant="ghost" />
            <Button iconOnly icon={<DeleteOutlined />} size="xs" variant="ghost" />
            <Button iconOnly icon={<DownloadOutlined />} size="xs" variant="ghost" />
            <Button iconOnly icon={<ShareAltOutlined />} size="xs" variant="ghost" />
          </Space>
        </div>
      </div>
    </Space>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Real-world usage examples showing common button patterns in applications.',
      },
    },
  },
};

export const Performance: Story = {
  render: () => {
    const [animationsEnabled, setAnimationsEnabled] = React.useState(true);
    
    return (
      <Space direction="vertical" size="large">
        <div>
          <h3 style={{ marginBottom: 16 }}>Performance Options</h3>
          <div style={{ marginBottom: 16 }}>
            <Button 
              variant="secondary" 
              onClick={() => setAnimationsEnabled(!animationsEnabled)}
            >
              {animationsEnabled ? 'Disable' : 'Enable'} Animations
            </Button>
          </div>
          
          <Space wrap>
            <Button disableAnimations={!animationsEnabled}>Hover for Animation</Button>
            <Button variant="secondary" disableAnimations={!animationsEnabled}>Test Hover</Button>
            <Button variant="ghost" disableAnimations={!animationsEnabled}>Try Me</Button>
          </Space>
          
          <p style={{ fontSize: 14, color: '#666', marginTop: 16 }}>
            Animations can be disabled for better performance or user preference.
          </p>
        </div>
      </Space>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Performance optimization features including animation controls.',
      },
    },
  },
};