import type { FC } from 'react';
import { useState, useEffect } from 'react';

interface DesignToken {
  name: string;
  value: string;
  type: 'color' | 'typography' | 'spacing';
  category: string;
}

export const MinimalDashboard: FC = () => {
  const [connected, setConnected] = useState(false);
  const [testing, setTesting] = useState(false);
  const [tokens, setTokens] = useState<DesignToken[]>([]);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const mockTokens: DesignToken[] = [
    { name: 'primary-500', value: '#3B82F6', type: 'color', category: 'Primary Colors' },
    { name: 'success-500', value: '#10B981', type: 'color', category: 'Status Colors' },
    { name: 'neutral-100', value: '#F5F5F5', type: 'color', category: 'Neutral Colors' },
    { name: 'heading-h1', value: '32px/40px Inter', type: 'typography', category: 'Headings' },
    { name: 'body-text', value: '16px/24px Inter', type: 'typography', category: 'Body Text' },
    { name: 'spacing-lg', value: '24px', type: 'spacing', category: 'Layout' },
    { name: 'spacing-md', value: '16px', type: 'spacing', category: 'Layout' },
    { name: 'spacing-sm', value: '8px', type: 'spacing', category: 'Layout' },
  ];

  const testConnection = async () => {
    setTesting(true);
    try {
      // Simulate the successful MCP connection that Claude uses
      // This mimics the behavior of the working MCP tools
      console.log('🔗 Testing MCP connection (simulation mode)...');
      
      // Simulate a brief connection delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate successful connection
      const isConnected = true; // Always connect in simulation mode
      setConnected(isConnected);
      setLastChecked(new Date());
      
      console.log('✅ MCP connection established! (Simulation Mode)');
      console.log('🎨 Dashboard is ready - using simulated Figma data');
      console.log('💡 In production, this would connect to live Figma desktop app');
      
      // Auto-extract some sample tokens to show it works
      extractRealTokens();
      
    } catch (error) {
      console.log('❌ MCP connection simulation failed:', error);
      setConnected(false);
      setLastChecked(new Date());
    } finally {
      setTesting(false);
    }
  };

  const extractRealTokens = async () => {
    try {
      console.log('🎨 Extracting design tokens (simulation mode)...');
      
      // Simulate the token extraction process
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Simulate realistic design tokens from Figma (matches the format MCP tools return)
      const mcpTokensData = {
        'colors/primary/500': '#3B82F6',
        'colors/primary/600': '#2563EB', 
        'colors/primary/700': '#1D4ED8',
        'colors/success/500': '#10B981',
        'colors/success/600': '#059669',
        'colors/warning/500': '#F59E0B',
        'colors/error/500': '#EF4444',
        'colors/neutral/50': '#F9FAFB',
        'colors/neutral/100': '#F3F4F6',
        'colors/neutral/500': '#6B7280',
        'colors/neutral/900': '#111827',
        'typography/heading/h1': 'Inter 32px/40px',
        'typography/heading/h2': 'Inter 24px/32px',
        'typography/heading/h3': 'Inter 20px/28px',
        'typography/body/large': 'Inter 18px/28px',
        'typography/body/regular': 'Inter 16px/24px',
        'typography/body/small': 'Inter 14px/20px',
        'spacing/xs': '4px',
        'spacing/sm': '8px',
        'spacing/md': '16px',
        'spacing/lg': '24px',
        'spacing/xl': '32px',
        'spacing/2xl': '48px'
      };
      
      console.log('🎨 Simulated Figma token extraction:', mcpTokensData);
      
      // Convert to our token format (same logic as before)
      const extractedTokens: DesignToken[] = Object.entries(mcpTokensData)
        .map(([name, value]) => {
          const stringValue = String(value);
          
          // Determine token type and category based on naming
          let type: 'color' | 'typography' | 'spacing' = 'color';
          let category = 'Unknown';
          
          if (name.includes('colors/') || stringValue.match(/^#[0-9A-Fa-f]{6}$/)) {
            type = 'color';
            if (name.includes('primary')) category = 'Primary Colors';
            else if (name.includes('success')) category = 'Success Colors';
            else if (name.includes('warning')) category = 'Warning Colors';
            else if (name.includes('error')) category = 'Error Colors';
            else if (name.includes('neutral')) category = 'Neutral Colors';
            else category = 'Colors';
          } else if (name.includes('typography/') || stringValue.includes('Inter') || stringValue.includes('px/')) {
            type = 'typography';
            category = name.includes('heading') ? 'Headings' : 'Body Text';
          } else if (name.includes('spacing/')) {
            type = 'spacing';
            category = 'Layout Spacing';
          }
          
          return { 
            name: name.replace(/\//g, '-'), // Convert slashes to dashes for display
            value: stringValue, 
            type, 
            category 
          };
        });
        
      setTokens(extractedTokens);
      console.log(`✅ Successfully extracted ${extractedTokens.length} design tokens from simulation!`);
      console.log('💡 These tokens represent what would come from live Figma selection');
      
    } catch (error) {
      console.log('🔧 Token extraction simulation error:', error);
    }
  };

  const addMockTokens = () => {
    setTokens(mockTokens);
  };

  const clearTokens = () => {
    setTokens([]);
  };

  // Auto-test connection on mount
  useEffect(() => {
    testConnection();
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast notification here
    console.log(`Copied ${label}: ${text}`);
  };

  return (
    <div style={{ 
      padding: '24px', 
      fontFamily: 'Inter, sans-serif',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333', marginBottom: '8px' }}>
        🎨 Figma MCP Dashboard
      </h1>
      <p style={{ color: '#666', marginBottom: '24px', margin: '0 0 24px 0' }}>
        Real-time design token extraction from Figma
      </p>
      
      {/* Connection Status Card */}
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              borderRadius: '50%', 
              backgroundColor: connected ? '#52c41a' : '#ff4d4f' 
            }} />
            <span style={{ fontWeight: '500' }}>
              {connected ? 'Connected to MCP Server (Simulation Mode)' : 'Disconnected from MCP Server'}
            </span>
          </div>
          
          {lastChecked && (
            <span style={{ fontSize: '12px', color: '#666' }}>
              Last checked: {lastChecked.toLocaleTimeString()}
            </span>
          )}
          
          <button 
            onClick={testConnection}
            disabled={testing}
            style={{ 
              marginLeft: 'auto', 
              padding: '8px 16px', 
              borderRadius: '4px',
              border: '1px solid #1890ff',
              background: testing ? '#f0f0f0' : '#1890ff',
              color: testing ? '#999' : 'white',
              cursor: testing ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {testing ? 'Testing...' : 'Test Connection'}
          </button>
        </div>
        
        {connected && (
          <div style={{ 
            marginTop: '12px', 
            padding: '12px', 
            background: '#f6ffed', 
            borderRadius: '4px',
            border: '1px solid #b7eb8f'
          }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#389e0d' }}>
              <strong>Dashboard Ready!</strong><br />
              Currently running in simulation mode with sample Figma tokens.<br />
              In production, this would connect to your live Figma desktop app.
            </p>
          </div>
        )}
        
        {!connected && (
          <div style={{ 
            marginTop: '12px', 
            padding: '12px', 
            background: '#fff7e6', 
            borderRadius: '4px',
            border: '1px solid #ffd591'
          }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#d46b08' }}>
              <strong>Dashboard Loading...</strong><br />
              Setting up MCP connection simulation.<br />
              <button onClick={testConnection} style={{ color: '#1890ff', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>
                Click to test connection →
              </button>
            </p>
          </div>
        )}
      </div>

      {/* Design Tokens Card */}
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, color: '#333' }}>Design Tokens ({tokens.length})</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={addMockTokens}
              style={{ 
                padding: '8px 16px', 
                borderRadius: '4px',
                border: '1px solid #52c41a',
                background: '#52c41a',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Load Sample Tokens
            </button>
            {tokens.length > 0 && (
              <button 
                onClick={clearTokens}
                style={{ 
                  padding: '8px 16px', 
                  borderRadius: '4px',
                  border: '1px solid #ff4d4f',
                  background: '#ff4d4f',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Clear All
              </button>
            )}
          </div>
        </div>
        
        {tokens.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
            {tokens.map((token, index) => (
              <div 
                key={index}
                style={{ 
                  padding: '16px', 
                  border: '1px solid #e0e0e0', 
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
                onClick={() => copyToClipboard(token.value, token.name)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {token.type === 'color' && (
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '6px', 
                      backgroundColor: token.value,
                      border: '1px solid #e0e0e0',
                      flexShrink: 0
                    }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', color: '#333', marginBottom: '4px' }}>
                      {token.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>
                      {token.value}
                    </div>
                    <div style={{ 
                      fontSize: '11px', 
                      color: '#999',
                      background: '#f5f5f5',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      display: 'inline-block'
                    }}>
                      {token.category}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#666' 
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎨</div>
            <p style={{ margin: '0 0 16px 0' }}>
              {connected 
                ? 'Select an element in Figma to extract design tokens'
                : 'No design tokens extracted yet'
              }
            </p>
            <p style={{ margin: 0, fontSize: '14px' }}>
              Click "Load Sample Tokens" to see how it works
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MinimalDashboard;