import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { designTokens } from '../theme/tokens';
import { Row, Col, Card, Table } from 'antd';
import styled from 'styled-components';

const meta: Meta = {
  title: 'Design System/Tokens',
  parameters: {
    docs: {
      description: {
        component: `
# Design Tokens

Design tokens are the visual design atoms of the design system. They store visual design attributes such as colors, typography, spacing, and more. These tokens ensure consistency across all components and can be updated globally.

Our tokens are extracted from the Figma 2.5 Flow [JS] specification and organized into semantic categories.

## Token Categories

- **Colors** - Brand colors, semantic colors, and interaction states
- **Typography** - Font sizes, weights, and line heights
- **Spacing** - Consistent spacing scale based on 4px grid
- **Shadows** - Elevation system for depth and visual hierarchy
- **Border Radius** - Consistent corner radius values
- **Animation** - Duration and easing functions for transitions
- **Z-Index** - Layering system for overlays and modals

## Usage

\`\`\`tsx
import { designTokens } from '@rescale/design-system/tokens';

// Using color tokens
const StyledButton = styled.button\`
  background-color: \${designTokens.colors.brand.brandBlue};
  color: \${designTokens.colors.neutral.white};
  padding: \${designTokens.spacing[4]}px;
  border-radius: \${designTokens.borderRadius.base}px;
  box-shadow: \${designTokens.shadows.sm};
\`;
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const ColorSwatch = styled.div<{ color: string }>`
  width: 48px;
  height: 48px;
  background-color: ${({ color }) => color};
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ color }) => {
    // Simple contrast check
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000' : '#fff';
  }};
  font-size: 10px;
  font-weight: 500;
`;

const TokenRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const TokenInfo = styled.div`
  flex: 1;
`;

const TokenName = styled.div`
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
`;

const TokenValue = styled.div`
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  color: #666;
`;

const ShadowBox = styled.div<{ shadow: string }>`
  width: 80px;
  height: 40px;
  background: white;
  border-radius: 4px;
  box-shadow: ${({ shadow }) => shadow};
  border: 1px solid #f0f0f0;
`;

const SpacingBox = styled.div<{ size: number }>`
  width: ${({ size }) => size}px;
  height: 16px;
  background: #1890ff;
  border-radius: 2px;
  min-width: 4px;
`;

const TypographyExample = styled.div<{ fontSize: number; fontWeight: number }>`
  font-size: ${({ fontSize }) => fontSize}px;
  font-weight: ${({ fontWeight }) => fontWeight};
  line-height: 1.4;
`;

export const Colors: Story = {
  render: () => (
    <div>
      <h2>Color Tokens</h2>
      
      <h3>Brand Colors</h3>
      <Card>
        {Object.entries(designTokens.colors.brand).map(([name, color]) => (
          <TokenRow key={name}>
            <ColorSwatch color={color} />
            <TokenInfo>
              <TokenName>brand.{name}</TokenName>
              <TokenValue>{color}</TokenValue>
            </TokenInfo>
          </TokenRow>
        ))}
      </Card>

      <h3 style={{ marginTop: 32 }}>Neutral Colors</h3>
      <Card>
        {Object.entries(designTokens.colors.neutral).map(([name, color]) => (
          <TokenRow key={name}>
            <ColorSwatch color={color} />
            <TokenInfo>
              <TokenName>neutral.{name}</TokenName>
              <TokenValue>{color}</TokenValue>
            </TokenInfo>
          </TokenRow>
        ))}
      </Card>

      <h3 style={{ marginTop: 32 }}>Status Colors</h3>
      <Card>
        {Object.entries(designTokens.colors.status).map(([name, color]) => (
          <TokenRow key={name}>
            <ColorSwatch color={color} />
            <TokenInfo>
              <TokenName>status.{name}</TokenName>
              <TokenValue>{color}</TokenValue>
            </TokenInfo>
          </TokenRow>
        ))}
      </Card>

      <h3 style={{ marginTop: 32 }}>Semantic Colors</h3>
      <Card>
        <h4>Text Colors</h4>
        {Object.entries(designTokens.colors.semantic.text).map(([name, color]) => (
          <TokenRow key={name}>
            <ColorSwatch color={color} />
            <TokenInfo>
              <TokenName>semantic.text.{name}</TokenName>
              <TokenValue>{color}</TokenValue>
            </TokenInfo>
          </TokenRow>
        ))}
        
        <h4 style={{ marginTop: 24 }}>Background Colors</h4>
        {Object.entries(designTokens.colors.semantic.background).map(([name, color]) => (
          <TokenRow key={name}>
            <ColorSwatch color={color} />
            <TokenInfo>
              <TokenName>semantic.background.{name}</TokenName>
              <TokenValue>{color}</TokenValue>
            </TokenInfo>
          </TokenRow>
        ))}
        
        <h4 style={{ marginTop: 24 }}>Border Colors</h4>
        {Object.entries(designTokens.colors.semantic.border).map(([name, color]) => (
          <TokenRow key={name}>
            <ColorSwatch color={color} />
            <TokenInfo>
              <TokenName>semantic.border.{name}</TokenName>
              <TokenValue>{color}</TokenValue>
            </TokenInfo>
          </TokenRow>
        ))}
      </Card>
    </div>
  ),
};

export const Typography: Story = {
  render: () => (
    <div>
      <h2>Typography Tokens</h2>
      
      <h3>Font Sizes</h3>
      <Card>
        {Object.entries(designTokens.typography.fontSize).map(([name, size]) => (
          <TokenRow key={name}>
            <TypographyExample fontSize={size} fontWeight={400}>
              Aa
            </TypographyExample>
            <TokenInfo>
              <TokenName>fontSize.{name}</TokenName>
              <TokenValue>{size}px</TokenValue>
            </TokenInfo>
          </TokenRow>
        ))}
      </Card>

      <h3 style={{ marginTop: 32 }}>Font Weights</h3>
      <Card>
        {Object.entries(designTokens.typography.fontWeight).map(([name, weight]) => (
          <TokenRow key={name}>
            <TypographyExample fontSize={16} fontWeight={weight}>
              The quick brown fox
            </TypographyExample>
            <TokenInfo>
              <TokenName>fontWeight.{name}</TokenName>
              <TokenValue>{weight}</TokenValue>
            </TokenInfo>
          </TokenRow>
        ))}
      </Card>

      <h3 style={{ marginTop: 32 }}>Line Heights</h3>
      <Card>
        {Object.entries(designTokens.typography.lineHeight).map(([name, height]) => (
          <TokenRow key={name}>
            <div style={{ lineHeight: height, fontSize: 14 }}>
              Multi-line text example<br />
              showing line height spacing
            </div>
            <TokenInfo>
              <TokenName>lineHeight.{name}</TokenName>
              <TokenValue>{height}</TokenValue>
            </TokenInfo>
          </TokenRow>
        ))}
      </Card>
    </div>
  ),
};

export const Spacing: Story = {
  render: () => (
    <div>
      <h2>Spacing Tokens</h2>
      <p>Based on a 4px grid system for consistent layouts.</p>
      
      <Card>
        {Object.entries(designTokens.spacing).map(([name, size]) => (
          <TokenRow key={name}>
            <SpacingBox size={size} />
            <TokenInfo>
              <TokenName>spacing[{name}]</TokenName>
              <TokenValue>{size}px</TokenValue>
            </TokenInfo>
          </TokenRow>
        ))}
      </Card>
    </div>
  ),
};

export const Shadows: Story = {
  render: () => (
    <div>
      <h2>Shadow Tokens</h2>
      <p>Elevation system for depth and visual hierarchy.</p>
      
      <Card>
        {Object.entries(designTokens.shadows).map(([name, shadow]) => (
          <TokenRow key={name}>
            <ShadowBox shadow={shadow} />
            <TokenInfo>
              <TokenName>shadows.{name}</TokenName>
              <TokenValue>{shadow}</TokenValue>
            </TokenInfo>
          </TokenRow>
        ))}
      </Card>
    </div>
  ),
};

export const BorderRadius: Story = {
  render: () => (
    <div>
      <h2>Border Radius Tokens</h2>
      
      <Card>
        {Object.entries(designTokens.borderRadius).map(([name, radius]) => (
          <TokenRow key={name}>
            <div
              style={{
                width: 48,
                height: 48,
                backgroundColor: '#1890ff',
                borderRadius: `${radius}px`,
              }}
            />
            <TokenInfo>
              <TokenName>borderRadius.{name}</TokenName>
              <TokenValue>{radius}px</TokenValue>
            </TokenInfo>
          </TokenRow>
        ))}
      </Card>
    </div>
  ),
};

export const Animation: Story = {
  render: () => (
    <div>
      <h2>Animation Tokens</h2>
      
      <h3>Duration</h3>
      <Card>
        {Object.entries(designTokens.animation.duration).map(([name, duration]) => (
          <TokenRow key={name}>
            <div style={{ fontSize: 12, color: '#666' }}>
              {duration}
            </div>
            <TokenInfo>
              <TokenName>animation.duration.{name}</TokenName>
              <TokenValue>{duration}</TokenValue>
            </TokenInfo>
          </TokenRow>
        ))}
      </Card>

      <h3 style={{ marginTop: 32 }}>Easing</h3>
      <Card>
        {Object.entries(designTokens.animation.easing).map(([name, easing]) => (
          <TokenRow key={name}>
            <div style={{ fontSize: 12, color: '#666' }}>
              cubic-bezier
            </div>
            <TokenInfo>
              <TokenName>animation.easing.{name}</TokenName>
              <TokenValue>{easing}</TokenValue>
            </TokenInfo>
          </TokenRow>
        ))}
      </Card>
    </div>
  ),
};

export const ZIndex: Story = {
  render: () => (
    <div>
      <h2>Z-Index Tokens</h2>
      <p>Layering system for overlays, modals, and component stacking.</p>
      
      <Card>
        <Table
          dataSource={Object.entries(designTokens.zIndex).map(([name, value]) => ({
            key: name,
            name,
            value,
            usage: getZIndexUsage(name),
          }))}
          columns={[
            {
              title: 'Token',
              dataIndex: 'name',
              key: 'name',
              render: (name) => <code>zIndex.{name}</code>,
            },
            {
              title: 'Value',
              dataIndex: 'value',
              key: 'value',
              render: (value) => <strong>{value}</strong>,
            },
            {
              title: 'Usage',
              dataIndex: 'usage',
              key: 'usage',
            },
          ]}
          pagination={false}
        />
      </Card>
    </div>
  ),
};

function getZIndexUsage(name: string): string {
  const usageMap: { [key: string]: string } = {
    hide: 'Hidden elements',
    auto: 'Default stacking',
    base: 'Base layer',
    docked: 'Docked elements',
    loading: 'Loading overlays',
    layout: 'Layout components',
    dropdown: 'Dropdown menus',
    sticky: 'Sticky elements',
    banner: 'Banner notifications',
    overlay: 'General overlays',
    modal: 'Modal dialogs',
    popover: 'Popover components',
    skipLink: 'Skip links',
    toast: 'Toast notifications',
    tooltip: 'Tooltip components',
  };
  return usageMap[name] || 'Component stacking';
}

export const Usage: Story = {
  render: () => (
    <div>
      <h2>Using Design Tokens</h2>
      
      <h3>In Styled Components</h3>
      <Card>
        <pre style={{ 
          background: '#f6f8fa', 
          padding: '16px', 
          borderRadius: '6px',
          fontSize: '14px',
          overflow: 'auto'
        }}>
{`import styled from 'styled-components';
import { designTokens } from '@rescale/design-system/tokens';

const Button = styled.button\`
  background-color: \${designTokens.colors.brand.brandBlue};
  color: \${designTokens.colors.neutral.white};
  padding: \${designTokens.spacing[3]}px \${designTokens.spacing[4]}px;
  border-radius: \${designTokens.borderRadius.base}px;
  font-size: \${designTokens.typography.fontSize.base}px;
  font-weight: \${designTokens.typography.fontWeight.medium};
  box-shadow: \${designTokens.shadows.sm};
  transition: all \${designTokens.animation.duration.normal} 
              \${designTokens.animation.easing.easeInOut};
  
  &:hover {
    background-color: \${designTokens.colors.brand.darkBlue};
    box-shadow: \${designTokens.shadows.md};
  }
\`;`}
        </pre>
      </Card>

      <h3 style={{ marginTop: 32 }}>In CSS-in-JS</h3>
      <Card>
        <pre style={{ 
          background: '#f6f8fa', 
          padding: '16px', 
          borderRadius: '6px',
          fontSize: '14px',
          overflow: 'auto'
        }}>
{`import { designTokens } from '@rescale/design-system/tokens';

const buttonStyles = {
  backgroundColor: designTokens.colors.brand.brandBlue,
  color: designTokens.colors.neutral.white,
  padding: \`\${designTokens.spacing[3]}px \${designTokens.spacing[4]}px\`,
  borderRadius: \`\${designTokens.borderRadius.base}px\`,
  fontSize: \`\${designTokens.typography.fontSize.base}px\`,
  fontWeight: designTokens.typography.fontWeight.medium,
  boxShadow: designTokens.shadows.sm,
  transition: \`all \${designTokens.animation.duration.normal} 
               \${designTokens.animation.easing.easeInOut}\`,
};`}
        </pre>
      </Card>

      <h3 style={{ marginTop: 32 }}>Token Categories</h3>
      <Card>
        <ul>
          <li><strong>colors</strong> - Brand, neutral, status, and semantic colors</li>
          <li><strong>typography</strong> - Font sizes, weights, and line heights</li>
          <li><strong>spacing</strong> - 4px-based spacing scale (0-32)</li>
          <li><strong>shadows</strong> - Elevation system (sm, base, md, lg, xl)</li>
          <li><strong>borderRadius</strong> - Corner radius values (none to full)</li>
          <li><strong>animation</strong> - Duration and easing functions</li>
          <li><strong>zIndex</strong> - Layering system for component stacking</li>
          <li><strong>dimensions</strong> - Common component dimensions</li>
          <li><strong>breakpoints</strong> - Responsive design breakpoints</li>
        </ul>
      </Card>
    </div>
  ),
};