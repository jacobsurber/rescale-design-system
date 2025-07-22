import React from 'react';
import styled from 'styled-components';
import { mediaQueries } from '../../../styles/breakpoints';

export interface ContainerProps {
  /** Maximum width of the container */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | number | string;
  /** Whether to center the container */
  centered?: boolean;
  /** Whether to add default padding */
  padded?: boolean;
  /** Fluid container (no max-width) */
  fluid?: boolean;
  /** Children to render */
  children: React.ReactNode;
  /** Custom className */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

const getMaxWidth = (maxWidth: ContainerProps['maxWidth']): string => {
  if (typeof maxWidth === 'number') {
    return `${maxWidth}px`;
  }
  
  if (typeof maxWidth === 'string' && maxWidth !== 'full') {
    const widths = {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    };
    
    return widths[maxWidth as keyof typeof widths] || maxWidth;
  }
  
  return 'none';
};

const StyledContainer = styled.div<{
  $maxWidth: string;
  $centered: boolean;
  $padded: boolean;
  $fluid: boolean;
}>`
  width: 100%;
  max-width: ${props => props.$fluid ? 'none' : props.$maxWidth};
  margin: ${props => props.$centered ? '0 auto' : '0'};
  padding: ${props => props.$padded ? 'var(--rescale-space-4)' : '0'};
  
  ${mediaQueries.mobile} {
    padding: ${props => props.$padded ? 'var(--rescale-space-3)' : '0'};
  }
`;

export const Container: React.FC<ContainerProps> = ({
  maxWidth = 'xl',
  centered = true,
  padded = false,
  fluid = false,
  children,
  className,
  style,
}) => {
  return (
    <StyledContainer
      $maxWidth={getMaxWidth(maxWidth)}
      $centered={centered}
      $padded={padded}
      $fluid={fluid}
      className={className}
      style={style}
    >
      {children}
    </StyledContainer>
  );
};

// Pre-configured container variants
export const SmallContainer: React.FC<Omit<ContainerProps, 'maxWidth'>> = (props) => (
  <Container {...props} maxWidth="sm" />
);

export const MediumContainer: React.FC<Omit<ContainerProps, 'maxWidth'>> = (props) => (
  <Container {...props} maxWidth="md" />
);

export const LargeContainer: React.FC<Omit<ContainerProps, 'maxWidth'>> = (props) => (
  <Container {...props} maxWidth="lg" />
);

export const XLargeContainer: React.FC<Omit<ContainerProps, 'maxWidth'>> = (props) => (
  <Container {...props} maxWidth="xl" />
);

export const FluidContainer: React.FC<Omit<ContainerProps, 'fluid'>> = (props) => (
  <Container {...props} fluid />
);

export default Container;