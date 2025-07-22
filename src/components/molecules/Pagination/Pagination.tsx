// =============================================================================
// Pagination Component
// =============================================================================

import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
// import { Button } from '../../atoms/Button/Button';
import { Select } from 'antd';
import type { UsePaginationReturn } from '../../../hooks/usePagination';

// =============================================================================
// Styled Components
// =============================================================================

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border.primary};
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  
  @media (max-width: 480px) {
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const PageButton = styled(motion.button)<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  margin: 0;
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary.main : theme.colors.background.paper};
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary.contrast : theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ $isActive }) => $isActive ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover:not(:disabled) {
    background-color: ${({ theme, $isActive }) =>
      $isActive ? theme.colors.primary.dark : theme.colors.background.hover};
    border-color: ${({ theme }) => theme.colors.primary.main};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const InfoText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  white-space: nowrap;

  @media (max-width: 480px) {
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
  }
`;

const PageSizeSelector = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};

  .ant-select {
    min-width: 70px;
  }
`;

const Ellipsis = styled.span`
  padding: 0 ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

// =============================================================================
// Component Props
// =============================================================================

export interface PaginationProps extends UsePaginationReturn {
  /** Show page size selector */
  showSizeChanger?: boolean;
  /** Available page size options */
  pageSizeOptions?: number[];
  /** Show quick jumper */
  showQuickJumper?: boolean;
  /** Show total info */
  showTotal?: boolean;
  /** Custom total info formatter */
  showTotalFormatter?: (total: number, range: [number, number]) => string;
  /** Size variant */
  size?: 'small' | 'default' | 'large';
  /** Disabled state */
  disabled?: boolean;
  /** Custom class name */
  className?: string;
}

// =============================================================================
// Component
// =============================================================================

/**
 * Pagination component with comprehensive navigation controls
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  hasPrevious,
  hasNext,
  visiblePages,
  itemsPerPage,
  goToPage,
  goToNext,
  goToPrevious,
  goToFirst,
  goToLast,
  setItemsPerPage,
  showSizeChanger = true,
  pageSizeOptions = [10, 20, 50, 100],
  showQuickJumper = false,
  showTotal = true,
  showTotalFormatter,
  size = 'default',
  disabled = false,
  className,
}) => {
  const formatTotal = (total: number, range: [number, number]): string => {
    if (showTotalFormatter) {
      return showTotalFormatter(total, range);
    }
    return `${range[0]}-${range[1]} of ${total} items`;
  };

  const handlePageSizeChange = (newSize: number) => {
    setItemsPerPage(newSize);
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <PaginationContainer className={className}>
      {/* Total Info */}
      {showTotal && (
        <InfoText>
          {formatTotal(totalItems, [startIndex + 1, endIndex])}
        </InfoText>
      )}

      {/* Pagination Controls */}
      <PaginationControls>
        {/* First Page */}
        <PageButton
          as={motion.button}
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          onClick={goToFirst}
          disabled={!hasPrevious || disabled}
          title="First page"
        >
          ⟪
        </PageButton>

        {/* Previous Page */}
        <PageButton
          as={motion.button}
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          onClick={goToPrevious}
          disabled={!hasPrevious || disabled}
          title="Previous page"
        >
          ⟨
        </PageButton>

        {/* Page Numbers */}
        <AnimatePresence mode="wait">
          {visiblePages.map((pageNum, index) => {
            const showStartEllipsis = index === 0 && pageNum > 1;
            const showEndEllipsis = index === visiblePages.length - 1 && pageNum < totalPages;

            return (
              <React.Fragment key={pageNum}>
                {showStartEllipsis && <Ellipsis>...</Ellipsis>}
                <PageButton
                  as={motion.button}
                  variants={buttonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  $isActive={pageNum === currentPage}
                  onClick={() => goToPage(pageNum)}
                  disabled={disabled}
                  title={`Page ${pageNum}`}
                >
                  {pageNum}
                </PageButton>
                {showEndEllipsis && <Ellipsis>...</Ellipsis>}
              </React.Fragment>
            );
          })}
        </AnimatePresence>

        {/* Next Page */}
        <PageButton
          as={motion.button}
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          onClick={goToNext}
          disabled={!hasNext || disabled}
          title="Next page"
        >
          ⟩
        </PageButton>

        {/* Last Page */}
        <PageButton
          as={motion.button}
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          onClick={goToLast}
          disabled={!hasNext || disabled}
          title="Last page"
        >
          ⟫
        </PageButton>
      </PaginationControls>

      {/* Page Size Selector */}
      {showSizeChanger && (
        <PageSizeSelector>
          <span>Show</span>
          <Select
            value={itemsPerPage}
            onChange={handlePageSizeChange}
            disabled={disabled}
            size={size === 'small' ? 'small' : size === 'large' ? 'large' : 'middle'}
            options={pageSizeOptions.map(option => ({
              value: option,
              label: option.toString(),
            }))}
          />
          <span>per page</span>
        </PageSizeSelector>
      )}
    </PaginationContainer>
  );
};

export default Pagination;