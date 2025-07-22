import React from 'react';
import styled from 'styled-components';
import { mediaQueries } from '../../../styles/breakpoints';

export interface GridProps {
  /** Number of columns (1-12) */
  columns?: number;
  /** Gap between grid items */
  gap?: number | string;
  /** Gap between rows */
  rowGap?: number | string;
  /** Gap between columns */
  columnGap?: number | string;
  /** Grid template columns override */
  templateColumns?: string;
  /** Grid template rows override */
  templateRows?: string;
  /** Grid auto flow */
  autoFlow?: 'row' | 'column' | 'row dense' | 'column dense';
  /** Align items */
  alignItems?: 'start' | 'end' | 'center' | 'stretch';
  /** Justify items */
  justifyItems?: 'start' | 'end' | 'center' | 'stretch';
  /** Children to render */
  children: React.ReactNode;
  /** Custom className */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

export interface ColProps {
  /** Column span (1-12) */
  span?: number;
  /** Column offset */
  offset?: number;
  /** Column order */
  order?: number;
  /** Column span on mobile */
  spanMobile?: number;
  /** Column span on tablet */
  spanTablet?: number;
  /** Column span on desktop */
  spanDesktop?: number;
  /** Grid area name */
  area?: string;
  /** Align self */
  alignSelf?: 'start' | 'end' | 'center' | 'stretch';
  /** Justify self */
  justifySelf?: 'start' | 'end' | 'center' | 'stretch';
  /** Children to render */
  children: React.ReactNode;
  /** Custom className */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

const getGapValue = (gap: number | string): string => {
  if (typeof gap === 'number') {
    return `calc(var(--rescale-space-base) * ${gap})`;
  }
  return gap;
};

const StyledGrid = styled.div<{
  $columns: number;
  $gap?: string;
  $rowGap?: string;
  $columnGap?: string;
  $templateColumns?: string;
  $templateRows?: string;
  $autoFlow?: string;
  $alignItems?: string;
  $justifyItems?: string;
}>`
  display: grid;
  grid-template-columns: ${props => 
    props.$templateColumns || `repeat(${props.$columns}, 1fr)`
  };
  grid-template-rows: ${props => props.$templateRows || 'auto'};
  grid-auto-flow: ${props => props.$autoFlow || 'row'};
  gap: ${props => props.$gap || 'var(--rescale-space-4)'};
  row-gap: ${props => props.$rowGap || props.$gap || 'var(--rescale-space-4)'};
  column-gap: ${props => props.$columnGap || props.$gap || 'var(--rescale-space-4)'};
  align-items: ${props => props.$alignItems || 'stretch'};
  justify-items: ${props => props.$justifyItems || 'stretch'};
  
  ${mediaQueries.mobile} {
    grid-template-columns: 1fr;
    gap: var(--rescale-space-3);
  }
`;

const StyledCol = styled.div<{
  $span?: number;
  $offset?: number;
  $order?: number;
  $spanMobile?: number;
  $spanTablet?: number;
  $spanDesktop?: number;
  $area?: string;
  $alignSelf?: string;
  $justifySelf?: string;
}>`
  grid-column: ${props => {
    if (props.$span) {
      const start = (props.$offset || 0) + 1;
      const end = start + props.$span;
      return `${start} / ${end}`;
    }
    return 'auto';
  }};
  
  grid-area: ${props => props.$area || 'auto'};
  order: ${props => props.$order || 'auto'};
  align-self: ${props => props.$alignSelf || 'auto'};
  justify-self: ${props => props.$justifySelf || 'auto'};
  
  ${mediaQueries.mobile} {
    grid-column: ${props => {
      if (props.$spanMobile) {
        return `span ${props.$spanMobile}`;
      }
      return 'span 1';
    }};
  }
  
  ${mediaQueries.tablet} {
    grid-column: ${props => {
      if (props.$spanTablet) {
        return `span ${props.$spanTablet}`;
      }
      if (props.$span) {
        const start = (props.$offset || 0) + 1;
        const end = start + props.$span;
        return `${start} / ${end}`;
      }
      return 'auto';
    }};
  }
  
  ${mediaQueries.desktop} {
    grid-column: ${props => {
      if (props.$spanDesktop) {
        return `span ${props.$spanDesktop}`;
      }
      if (props.$span) {
        const start = (props.$offset || 0) + 1;
        const end = start + props.$span;
        return `${start} / ${end}`;
      }
      return 'auto';
    }};
  }
`;

export const Grid: React.FC<GridProps> = ({
  columns = 12,
  gap,
  rowGap,
  columnGap,
  templateColumns,
  templateRows,
  autoFlow,
  alignItems,
  justifyItems,
  children,
  className,
  style,
}) => {
  return (
    <StyledGrid
      $columns={columns}
      $gap={gap ? getGapValue(gap) : undefined}
      $rowGap={rowGap ? getGapValue(rowGap) : undefined}
      $columnGap={columnGap ? getGapValue(columnGap) : undefined}
      $templateColumns={templateColumns}
      $templateRows={templateRows}
      $autoFlow={autoFlow}
      $alignItems={alignItems}
      $justifyItems={justifyItems}
      className={className}
      style={style}
    >
      {children}
    </StyledGrid>
  );
};

export const Col: React.FC<ColProps> = ({
  span,
  offset,
  order,
  spanMobile,
  spanTablet,
  spanDesktop,
  area,
  alignSelf,
  justifySelf,
  children,
  className,
  style,
}) => {
  return (
    <StyledCol
      $span={span}
      $offset={offset}
      $order={order}
      $spanMobile={spanMobile}
      $spanTablet={spanTablet}
      $spanDesktop={spanDesktop}
      $area={area}
      $alignSelf={alignSelf}
      $justifySelf={justifySelf}
      className={className}
      style={style}
    >
      {children}
    </StyledCol>
  );
};

export default Grid;