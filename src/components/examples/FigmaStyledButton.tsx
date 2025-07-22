/**
 * Example: Figma-Styled Button Component
 * Demonstrates how to use extracted Figma frame styles in React components
 */

import React from 'react';
import styled from 'styled-components';
import { Button as AntButton } from 'antd';

// Import the extracted Figma styles
import { CustomComponentStyledProps } from '@/theme/figma-styles/customcomponent';

/**
 * Method 1: Styled Component with Figma Styles
 */
const FigmaStyledButton = styled(AntButton)`
  /* Apply exact dimensions from Figma */
  width: ${CustomComponentStyledProps.width};
  height: ${CustomComponentStyledProps.height};
  
  /* Apply exact padding from Figma */
  padding: ${CustomComponentStyledProps.paddingTop} ${CustomComponentStyledProps.paddingRight} 
           ${CustomComponentStyledProps.paddingBottom} ${CustomComponentStyledProps.paddingLeft};
  
  /* Override Ant Design defaults with Figma values */
  &.ant-btn {
    width: ${CustomComponentStyledProps.width};
    height: ${CustomComponentStyledProps.height};
    
    /* Ensure padding takes precedence over Ant Design */
    padding: ${CustomComponentStyledProps.paddingTop} ${CustomComponentStyledProps.paddingRight} 
             ${CustomComponentStyledProps.paddingBottom} ${CustomComponentStyledProps.paddingLeft} !important;
  }
  
  /* Add hover effects that respect Figma sizing */
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
`;

/**
 * Method 2: CSS Custom Properties Approach
 */
const FigmaCSSButton = styled(AntButton)`
  width: var(--figma-width);
  height: var(--figma-height);
  padding: var(--figma-padding);
  
  &.ant-btn {
    width: var(--figma-width);
    height: var(--figma-height);
    padding: var(--figma-padding) !important;
  }
`;

/**
 * Method 3: Dynamic Style Object
 */
const createFigmaButtonStyles = () => ({
  width: CustomComponentStyledProps.width,
  height: CustomComponentStyledProps.height,
  padding: `${CustomComponentStyledProps.paddingTop} ${CustomComponentStyledProps.paddingRight} ${CustomComponentStyledProps.paddingBottom} ${CustomComponentStyledProps.paddingLeft}`,
});

/**
 * Example Component showcasing all methods
 */
export const FigmaButtonExample: React.FC = () => {
  const dynamicStyles = createFigmaButtonStyles();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px' }}>
      <h3>Figma-Extracted Button Styles</h3>
      
      {/* Method 1: Styled Component */}
      <div>
        <h4>Method 1: Styled Component</h4>
        <FigmaStyledButton type="primary">
          Figma Styled Button (Exact Dimensions)
        </FigmaStyledButton>
        <p>
          <small>
            Dimensions: {CustomComponentStyledProps.width} × {CustomComponentStyledProps.height}<br/>
            Padding: {CustomComponentStyledProps.paddingTop} {CustomComponentStyledProps.paddingRight} {CustomComponentStyledProps.paddingBottom} {CustomComponentStyledProps.paddingLeft}
          </small>
        </p>
      </div>

      {/* Method 2: CSS Custom Properties */}
      <div>
        <h4>Method 2: CSS Custom Properties</h4>
        <FigmaCSSButton 
          type="primary"
          style={{
            '--figma-width': CustomComponentStyledProps.width,
            '--figma-height': CustomComponentStyledProps.height,
            '--figma-padding': `${CustomComponentStyledProps.paddingTop} ${CustomComponentStyledProps.paddingRight} ${CustomComponentStyledProps.paddingBottom} ${CustomComponentStyledProps.paddingLeft}`,
          } as React.CSSProperties}
        >
          CSS Variables Button
        </FigmaCSSButton>
      </div>

      {/* Method 3: Dynamic Styles */}
      <div>
        <h4>Method 3: Dynamic Style Object</h4>
        <AntButton 
          type="primary" 
          style={dynamicStyles}
        >
          Dynamic Styles Button
        </AntButton>
      </div>

      {/* Comparison with Default Button */}
      <div>
        <h4>Comparison: Default Ant Design Button</h4>
        <AntButton type="primary">
          Default Button (32px height)
        </AntButton>
      </div>

      {/* Visual Difference Highlight */}
      <div style={{ 
        background: '#f5f5f5', 
        padding: '16px', 
        borderRadius: '8px',
        marginTop: '16px'
      }}>
        <h4>📏 Figma Specifications Applied:</h4>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li><strong>Width:</strong> {CustomComponentStyledProps.width} (from Figma frame)</li>
          <li><strong>Height:</strong> {CustomComponentStyledProps.height} (from Figma frame)</li>
          <li><strong>Padding Left/Right:</strong> {CustomComponentStyledProps.paddingLeft}/{CustomComponentStyledProps.paddingRight}</li>
          <li><strong>Padding Top/Bottom:</strong> {CustomComponentStyledProps.paddingTop}/{CustomComponentStyledProps.paddingBottom}</li>
        </ul>
      </div>
    </div>
  );
};

export default FigmaButtonExample;