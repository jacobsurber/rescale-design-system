import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Logo, type LogoSize } from './Logo';
import { logoSizes, softwareLogoMap } from './Logo.constants';
import { Space, Row, Col, Tooltip } from 'antd';

const meta: Meta<typeof Logo> = {
  title: 'Atoms/Logo',
  component: Logo,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Versatile logo component for brand and software logos with automatic fallbacks and consistent sizing.',
      },
    },
  },
  argTypes: {
    src: {
      control: { type: 'text' },
      description: 'Logo source URL or React component',
    },
    software: {
      control: { type: 'text' },
      description: 'Software name for automatic logo mapping',
    },
    alt: {
      control: { type: 'text' },
      description: 'Alternative text for accessibility',
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Size of the logo',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'square', 'rounded', 'circle'],
      description: 'Visual variant of the logo container',
    },
    clickable: {
      control: { type: 'boolean' },
      description: 'Whether the logo is clickable',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Whether to show loading state',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Logo>;

export const Default: Story = {
  args: {
    software: 'ansys',
    alt: 'ANSYS Logo',
    size: 'md',
  },
};

export const AllSizes: Story = {
  render: () => (
    <Space direction="vertical" size="large">
      <div>
        <h3 style={{ marginBottom: 16 }}>Logo Sizes</h3>
        <Space align="center" size="large">
          {Object.entries(logoSizes).map(([size, config]) => (
            <div key={size} style={{ textAlign: 'center' }}>
              <Logo software="python" alt="Python" size={size as LogoSize} />
              <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                {size.toUpperCase()}
              </div>
              <div style={{ fontSize: 10, color: '#999' }}>
                {config.width}
              </div>
            </div>
          ))}
        </Space>
      </div>
    </Space>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete size system from xs (16px) to 2xl (96px) with consistent proportions.',
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <Space direction="vertical" size="large">
      <div>
        <h3 style={{ marginBottom: 16 }}>Logo Variants</h3>
        <Row gutter={[24, 24]}>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <Logo software="matlab" alt="MATLAB" size="xl" variant="default" />
              <div style={{ marginTop: 8, fontSize: 14 }}>Default</div>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <Logo software="matlab" alt="MATLAB" size="xl" variant="square" />
              <div style={{ marginTop: 8, fontSize: 14 }}>Square</div>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <Logo software="matlab" alt="MATLAB" size="xl" variant="rounded" />
              <div style={{ marginTop: 8, fontSize: 14 }}>Rounded</div>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <Logo software="matlab" alt="MATLAB" size="xl" variant="circle" />
              <div style={{ marginTop: 8, fontSize: 14 }}>Circle</div>
            </div>
          </Col>
        </Row>
      </div>
    </Space>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different visual variants for logo containers including border radius options.',
      },
    },
  },
};

export const SoftwareLogos: Story = {
  render: () => {
    const softwareCategories = [
      {
        category: 'CAE/Simulation Software',
        software: ['ansys', 'fluent', 'abaqus', 'star-ccm', 'openfoam', 'nastran', 'ls-dyna', 'comsol'],
      },
      {
        category: 'Computing Platforms',
        software: ['matlab', 'python', 'r'],
      },
      {
        category: 'Visualization & Analysis',
        software: ['paraview', 'pymol', 'gaussview'],
      },
      {
        category: 'Engineering Tools',
        software: ['cst', 'hfss', 'wrf', 'gromacs', 'ncl'],
      },
    ];
    
    return (
      <Space direction="vertical" size="large">
        <h3>Software Logo Catalog</h3>
        {softwareCategories.map(({ category, software }) => (
          <div key={category}>
            <h4 style={{ marginBottom: 16, color: '#666' }}>{category}</h4>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
              gap: '16px',
              marginBottom: 32 
            }}>
              {software.map(name => {
                const logoInfo = softwareLogoMap[name];
                return (
                  <Tooltip key={name} title={`${name.toUpperCase()} - Click to copy code`}>
                    <div 
                      style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        padding: '16px',
                        border: '1px solid #f0f0f0',
                        borderRadius: '8px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#0272c3';
                        e.currentTarget.style.backgroundColor = '#f3f7ff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#f0f0f0';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      onClick={() => {
                        navigator.clipboard.writeText(`<Logo software="${name}" alt="${name.toUpperCase()}" />`);
                        alert(`Copied: <Logo software="${name}" alt="${name.toUpperCase()}" />`);
                      }}
                    >
                      <Logo software={name} alt={name.toUpperCase()} size="lg" />
                      <div style={{ fontSize: 12, color: '#666', marginTop: 8, textTransform: 'uppercase' }}>
                        {name}
                      </div>
                      <div style={{ fontSize: 10, color: '#999', marginTop: 2 }}>
                        {logoInfo?.icon}
                      </div>
                    </div>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        ))}
        
        <p style={{ fontSize: 12, color: '#999', marginTop: 16 }}>
          * Currently using icon fallbacks. Click any logo to copy usage code.
        </p>
      </Space>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete catalog of supported software logos with automatic icon fallbacks.',
      },
    },
  },
};

export const WithImages: Story = {
  render: () => (
    <Space direction="vertical" size="large">
      <div>
        <h3 style={{ marginBottom: 16 }}>Image-based Logos</h3>
        
        <div style={{ marginBottom: 24 }}>
          <h4>External Images (Placeholder URLs)</h4>
          <Space size="large">
            <Logo 
              src="https://via.placeholder.com/64x64/0272c3/ffffff?text=R"
              alt="Rescale Logo"
              size="lg"
            />
            <Logo 
              src="https://via.placeholder.com/64x64/ff6b35/ffffff?text=A"
              alt="ANSYS Logo"
              size="lg"
              variant="rounded"
            />
            <Logo 
              src="https://via.placeholder.com/64x64/3776ab/ffffff?text=PY"
              alt="Python Logo"
              size="lg"
              variant="circle"
            />
          </Space>
        </div>
        
        <div style={{ marginBottom: 24 }}>
          <h4>Error Handling (Broken URLs)</h4>
          <Space size="large">
            <Logo 
              src="https://broken-url.com/logo.png"
              software="python"
              alt="Python Logo with Fallback"
              size="lg"
            />
            <Logo 
              src="https://another-broken-url.com/logo.png"
              alt="Broken Logo"
              size="lg"
              fallback={<div style={{ color: '#999' }}>LOGO</div>}
            />
          </Space>
          <p style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
            These logos have broken URLs and show fallback behavior
          </p>
        </div>
      </div>
    </Space>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Image-based logos with error handling and fallback mechanisms.',
      },
    },
  },
};

export const InteractiveLogos: Story = {
  render: () => {
    const [clickedLogo, setClickedLogo] = React.useState<string | null>(null);
    
    return (
      <Space direction="vertical" size="large">
        <div>
          <h3 style={{ marginBottom: 16 }}>Interactive Logos</h3>
          
          <div style={{ marginBottom: 24 }}>
            <h4>Clickable Software Logos</h4>
            <Space size="large">
              <Logo 
                software="ansys"
                alt="ANSYS"
                size="xl"
                clickable
                onClick={() => {
                  setClickedLogo('ANSYS');
                  setTimeout(() => setClickedLogo(null), 2000);
                }}
              />
              <Logo 
                software="python"
                alt="Python"
                size="xl"
                clickable
                onClick={() => {
                  setClickedLogo('Python');
                  setTimeout(() => setClickedLogo(null), 2000);
                }}
              />
              <Logo 
                software="matlab"
                alt="MATLAB"
                size="xl"
                clickable
                onClick={() => {
                  setClickedLogo('MATLAB');
                  setTimeout(() => setClickedLogo(null), 2000);
                }}
              />
            </Space>
            {clickedLogo && (
              <p style={{ fontSize: 14, color: '#0272c3', marginTop: 16 }}>
                Clicked: {clickedLogo}
              </p>
            )}
          </div>
          
          <div>
            <h4>Software Selection Grid</h4>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', 
              gap: '12px',
              maxWidth: '400px'
            }}>
              {['ansys', 'python', 'matlab', 'openfoam', 'abaqus', 'comsol'].map(software => (
                <Logo
                  key={software}
                  software={software}
                  alt={software.toUpperCase()}
                  size="lg"
                  clickable
                  onClick={() => alert(`Selected: ${software.toUpperCase()}`)}
                />
              ))}
            </div>
          </div>
        </div>
      </Space>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive logos with click handlers and hover effects for selection interfaces.',
      },
    },
  },
};

export const LoadingStates: Story = {
  render: () => {
    const [isLoading, setIsLoading] = React.useState(true);
    
    React.useEffect(() => {
      const timer = setInterval(() => {
        setIsLoading(prev => !prev);
      }, 3000);
      return () => clearInterval(timer);
    }, []);
    
    return (
      <Space direction="vertical" size="large">
        <div>
          <h3 style={{ marginBottom: 16 }}>Loading States</h3>
          
          <div style={{ marginBottom: 24 }}>
            <h4>Loading Animation (Auto-cycling)</h4>
            <Space size="large">
              <Logo loading alt="Loading Logo" size="sm" />
              <Logo loading alt="Loading Logo" size="md" />
              <Logo loading alt="Loading Logo" size="lg" />
              <Logo loading alt="Loading Logo" size="xl" variant="circle" />
            </Space>
          </div>
          
          <div>
            <h4>Dynamic Loading State</h4>
            <Space direction="vertical">
              <Space size="large">
                <Logo 
                  software="python"
                  alt="Python"
                  size="xl"
                  loading={isLoading}
                />
                <Logo 
                  software="matlab"
                  alt="MATLAB"
                  size="xl"
                  variant="rounded"
                  loading={isLoading}
                />
              </Space>
              <p style={{ fontSize: 14, color: '#666' }}>
                State: {isLoading ? 'Loading...' : 'Loaded'} (cycles every 3 seconds)
              </p>
            </Space>
          </div>
        </div>
      </Space>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading states with skeleton animations for async logo loading.',
      },
    },
  },
};

export const CustomSizing: Story = {
  render: () => (
    <Space direction="vertical" size="large">
      <div>
        <h3 style={{ marginBottom: 16 }}>Custom Sizing</h3>
        
        <div style={{ marginBottom: 24 }}>
          <h4>Custom Width & Height</h4>
          <Space size="large" align="end">
            <Logo software="python" alt="Python" width={40} height={20} />
            <Logo software="python" alt="Python" width={60} height={60} variant="circle" />
            <Logo software="python" alt="Python" width="100px" height="50px" variant="rounded" />
          </Space>
        </div>
        
        <div>
          <h4>Responsive Sizing</h4>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <Logo software="ansys" alt="ANSYS" size="xs" />
            <span style={{ fontSize: 12 }}>Small text with xs logo</span>
            <Logo software="ansys" alt="ANSYS" size="sm" />
            <span style={{ fontSize: 14 }}>Medium text with sm logo</span>
            <Logo software="ansys" alt="ANSYS" size="md" />
            <span style={{ fontSize: 16 }}>Large text with md logo</span>
          </div>
        </div>
      </div>
    </Space>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Custom sizing options including explicit width/height and responsive patterns.',
      },
    },
  },
};

export const AccessibilityDemo: Story = {
  render: () => (
    <Space direction="vertical" size="large">
      <div>
        <h3 style={{ marginBottom: 16 }}>Accessibility Features</h3>
        
        <div style={{ marginBottom: 24 }}>
          <h4>Proper Alt Text</h4>
          <Space size="large">
            <Logo 
              software="python"
              alt="Python programming language logo"
              size="lg"
            />
            <Logo 
              software="matlab"
              alt="MATLAB technical computing platform"
              size="lg"
            />
            <Logo 
              software="ansys"
              alt="ANSYS simulation software suite"
              size="lg"
            />
          </Space>
          <p style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
            Logos include descriptive alt text for screen readers
          </p>
        </div>
        
        <div style={{ marginBottom: 24 }}>
          <h4>Keyboard Navigation</h4>
          <Space size="large">
            <Logo 
              software="python"
              alt="Python - Press Enter to learn more"
              size="lg"
              clickable
              onClick={() => alert('Python information')}
            />
            <Logo 
              software="matlab"
              alt="MATLAB - Press Enter to learn more"
              size="lg"
              clickable
              onClick={() => alert('MATLAB information')}
            />
          </Space>
          <p style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
            Use Tab to navigate and Enter/Space to activate clickable logos
          </p>
        </div>
        
        <div>
          <h4>Software Information Cards</h4>
          <Row gutter={16}>
            <Col span={8}>
              <div style={{ 
                padding: '16px', 
                border: '1px solid #f0f0f0', 
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <Logo software="python" alt="Python" size="xl" />
                <h4 style={{ marginTop: 12, marginBottom: 4 }}>Python</h4>
                <p style={{ fontSize: 12, color: '#666', margin: 0 }}>
                  Programming Language
                </p>
              </div>
            </Col>
            <Col span={8}>
              <div style={{ 
                padding: '16px', 
                border: '1px solid #f0f0f0', 
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <Logo software="ansys" alt="ANSYS" size="xl" />
                <h4 style={{ marginTop: 12, marginBottom: 4 }}>ANSYS</h4>
                <p style={{ fontSize: 12, color: '#666', margin: 0 }}>
                  Simulation Suite
                </p>
              </div>
            </Col>
            <Col span={8}>
              <div style={{ 
                padding: '16px', 
                border: '1px solid #f0f0f0', 
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <Logo software="matlab" alt="MATLAB" size="xl" />
                <h4 style={{ marginTop: 12, marginBottom: 4 }}>MATLAB</h4>
                <p style={{ fontSize: 12, color: '#666', margin: 0 }}>
                  Technical Computing
                </p>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </Space>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Accessibility features including proper alt text, keyboard navigation, and semantic usage.',
      },
    },
  },
};