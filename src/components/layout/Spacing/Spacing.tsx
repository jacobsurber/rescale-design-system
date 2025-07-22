import React from 'react';
import styled from 'styled-components';

export interface SpacingProps {
  /** Margin on all sides (multiplier of 4px base unit) */
  m?: number;
  /** Margin top */
  mt?: number;
  /** Margin right */
  mr?: number;
  /** Margin bottom */
  mb?: number;
  /** Margin left */
  ml?: number;
  /** Margin horizontal (left and right) */
  mx?: number;
  /** Margin vertical (top and bottom) */
  my?: number;
  /** Padding on all sides (multiplier of 4px base unit) */
  p?: number;
  /** Padding top */
  pt?: number;
  /** Padding right */
  pr?: number;
  /** Padding bottom */
  pb?: number;
  /** Padding left */
  pl?: number;
  /** Padding horizontal (left and right) */
  px?: number;
  /** Padding vertical (top and bottom) */
  py?: number;
  /** Children to render */
  children?: React.ReactNode;
  /** HTML element to render */
  as?: string;
  /** Custom className */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

const getSpacingValue = (value?: number): string => {
  return value !== undefined ? `calc(var(--rescale-space-base) * ${value})` : '0';
};

const SpacingContainer = styled.div<{
  $m?: number;
  $mt?: number;
  $mr?: number;
  $mb?: number;
  $ml?: number;
  $mx?: number;
  $my?: number;
  $p?: number;
  $pt?: number;
  $pr?: number;
  $pb?: number;
  $pl?: number;
  $px?: number;
  $py?: number;
}>`
  ${props => props.$m !== undefined && `margin: ${getSpacingValue(props.$m)};`}
  ${props => props.$mt !== undefined && `margin-top: ${getSpacingValue(props.$mt)};`}
  ${props => props.$mr !== undefined && `margin-right: ${getSpacingValue(props.$mr)};`}
  ${props => props.$mb !== undefined && `margin-bottom: ${getSpacingValue(props.$mb)};`}
  ${props => props.$ml !== undefined && `margin-left: ${getSpacingValue(props.$ml)};`}
  ${props => props.$mx !== undefined && `
    margin-left: ${getSpacingValue(props.$mx)};
    margin-right: ${getSpacingValue(props.$mx)};
  `}
  ${props => props.$my !== undefined && `
    margin-top: ${getSpacingValue(props.$my)};
    margin-bottom: ${getSpacingValue(props.$my)};
  `}
  
  ${props => props.$p !== undefined && `padding: ${getSpacingValue(props.$p)};`}
  ${props => props.$pt !== undefined && `padding-top: ${getSpacingValue(props.$pt)};`}
  ${props => props.$pr !== undefined && `padding-right: ${getSpacingValue(props.$pr)};`}
  ${props => props.$pb !== undefined && `padding-bottom: ${getSpacingValue(props.$pb)};`}
  ${props => props.$pl !== undefined && `padding-left: ${getSpacingValue(props.$pl)};`}
  ${props => props.$px !== undefined && `
    padding-left: ${getSpacingValue(props.$px)};
    padding-right: ${getSpacingValue(props.$px)};
  `}
  ${props => props.$py !== undefined && `
    padding-top: ${getSpacingValue(props.$py)};
    padding-bottom: ${getSpacingValue(props.$py)};
  `}
`;

export const Spacing: React.FC<SpacingProps> = ({
  m,
  mt,
  mr,
  mb,
  ml,
  mx,
  my,
  p,
  pt,
  pr,
  pb,
  pl,
  px,
  py,
  children,
  as = 'div',
  className,
  style,
}) => {
  return (
    <SpacingContainer
      as={as}
      $m={m}
      $mt={mt}
      $mr={mr}
      $mb={mb}
      $ml={ml}
      $mx={mx}
      $my={my}
      $p={p}
      $pt={pt}
      $pr={pr}
      $pb={pb}
      $pl={pl}
      $px={px}
      $py={py}
      className={className}
      style={style}
    >
      {children}
    </SpacingContainer>
  );
};

// Utility spacing components for common patterns
export const Stack = styled.div<{ gap?: number }>`
  display: flex;
  flex-direction: column;
  gap: ${props => getSpacingValue(props.gap || 4)};
`;

export const Inline = styled.div<{ gap?: number }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${props => getSpacingValue(props.gap || 2)};
`;

export const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default Spacing;