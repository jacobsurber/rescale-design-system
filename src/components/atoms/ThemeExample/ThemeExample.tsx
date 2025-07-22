import React from 'react';
import { useRescaleTheme } from '../../../theme';
import styled from 'styled-components';

const ExampleContainer = styled.div`
  padding: var(--rescale-space-6);
  border-radius: var(--rescale-radius-lg);
  background-color: var(--rescale-color-light-blue);
  border: 1px solid var(--rescale-color-brand-blue);
`;

const ThemeInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--rescale-space-4);
  margin-top: var(--rescale-space-4);
`;

const ColorSwatch = styled.div<{ color: string }>`
  width: 100%;
  height: 40px;
  background-color: ${props => props.color};
  border-radius: var(--rescale-radius-base);
  border: 1px solid var(--rescale-color-gray-300);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color === '#FFFFFF' ? 'var(--rescale-color-gray-900)' : 'var(--rescale-color-white)'};
  font-weight: var(--rescale-font-weight-medium);
  font-size: var(--rescale-font-size-sm);
`;

export const ThemeExample: React.FC = () => {
  const { tokens } = useRescaleTheme();

  return (
    <ExampleContainer>
      <h3 style={{ 
        margin: 0, 
        color: 'var(--rescale-color-dark-blue)', 
        fontFamily: 'var(--rescale-font-family)' 
      }}>
        Rescale Theme Example
      </h3>
      <p style={{ 
        color: 'var(--rescale-color-gray-700)', 
        fontSize: 'var(--rescale-font-size-sm)',
        margin: 'var(--rescale-space-2) 0'
      }}>
        This component demonstrates the useRescaleTheme hook and CSS variables.
      </p>
      
      <ThemeInfo>
        <div>
          <h4 style={{ fontSize: 'var(--rescale-font-size-base)', margin: '0 0 var(--rescale-space-2) 0' }}>
            Primary Colors
          </h4>
          <ColorSwatch color={tokens.colors.primary.brandBlue}>
            Brand Blue
          </ColorSwatch>
          <ColorSwatch color={tokens.colors.primary.darkBlue}>
            Dark Blue
          </ColorSwatch>
          <ColorSwatch color={tokens.colors.primary.skyBlue}>
            Sky Blue
          </ColorSwatch>
        </div>
        
        <div>
          <h4 style={{ fontSize: 'var(--rescale-font-size-base)', margin: '0 0 var(--rescale-space-2) 0' }}>
            Status Colors
          </h4>
          <ColorSwatch color={tokens.colors.status.success}>
            Success
          </ColorSwatch>
          <ColorSwatch color={tokens.colors.status.warning}>
            Warning
          </ColorSwatch>
          <ColorSwatch color={tokens.colors.status.error}>
            Error
          </ColorSwatch>
        </div>
        
        <div>
          <h4 style={{ fontSize: 'var(--rescale-font-size-base)', margin: '0 0 var(--rescale-space-2) 0' }}>
            Typography
          </h4>
          <div style={{ fontSize: 'var(--rescale-font-size-sm)', color: 'var(--rescale-color-gray-700)' }}>
            Font Family: {tokens.typography.fontFamily}
          </div>
          <div style={{ fontSize: 'var(--rescale-font-size-sm)', color: 'var(--rescale-color-gray-700)' }}>
            Base Size: {tokens.typography.fontSize.base}px
          </div>
          <div style={{ fontSize: 'var(--rescale-font-size-sm)', color: 'var(--rescale-color-gray-700)' }}>
            Border Radius: {tokens.borderRadius.base}px
          </div>
        </div>
      </ThemeInfo>
    </ExampleContainer>
  );
};

export default ThemeExample;