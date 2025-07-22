import type { Meta, StoryObj } from '@storybook/react';
import { FigmaButtonExample } from './FigmaStyledButton';

const meta: Meta<typeof FigmaButtonExample> = {
  title: 'Examples/Figma Styled Components',
  component: FigmaButtonExample,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## Figma Frame-to-Component Styling Example

This example demonstrates how to extract exact styling dimensions and properties from specific Figma frames and apply them to React components.

### What's Demonstrated:
- **Exact Dimensions**: Width and height extracted from Figma frames
- **Precise Spacing**: Padding values pulled directly from Figma design
- **Multiple Implementation Methods**: Styled-components, CSS variables, and dynamic styles
- **Design-Code Consistency**: Pixel-perfect matching between Figma and React

### Frame Extraction Process:
1. \`node scripts/figma-frame-finder.js YOUR_TOKEN "button"\` - Find button frames
2. \`node scripts/figma-frame-extractor.js YOUR_TOKEN FRAME_ID\` - Extract styles
3. Import and apply the generated style constants

This approach ensures your React components match the Figma designs exactly, maintaining perfect design-development consistency.
        `,
      },
    },
  },
  argTypes: {},
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Complete example showing all methods for applying Figma-extracted styles to React components.
 * Demonstrates the exact dimensions and spacing extracted from the "_Logout Button" frame.
 */
export const AllMethods: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Shows three different approaches for applying Figma-extracted styles, with a comparison to the default Ant Design button styling.',
      },
    },
  },
};

/**
 * Visual comparison highlighting the precision of Figma-extracted dimensions.
 */
export const PrecisionDemo: Story = {
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
      gap: '20px',
      padding: '20px'
    }}>
      <div style={{ 
        border: '2px solid #0066CC', 
        borderRadius: '8px', 
        padding: '16px',
        background: '#f8f9fa'
      }}>
        <h4 style={{ color: '#0066CC', marginTop: 0 }}>🎯 Figma Frame Specs</h4>
        <p style={{ fontFamily: 'monospace', fontSize: '14px', margin: 0 }}>
          Width: 246px<br/>
          Height: 32px<br/>
          Padding: 4px 14px
        </p>
      </div>
      <div style={{ 
        border: '2px solid #52c41a', 
        borderRadius: '8px', 
        padding: '16px',
        background: '#f6ffed'
      }}>
        <h4 style={{ color: '#52c41a', marginTop: 0 }}>✅ React Implementation</h4>
        <p style={{ fontSize: '14px', margin: 0 }}>
          Exact match achieved using<br/>
          extracted style constants
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Visual demonstration of how the extracted Figma specifications translate to precise React component styling.',
      },
    },
  },
};