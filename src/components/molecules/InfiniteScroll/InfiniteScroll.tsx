// =============================================================================
// InfiniteScroll Component
// =============================================================================

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInfiniteScroll } from '../../../hooks/usePagination';
import { LoadingSpinner } from '../../atoms/LoadingSpinner/LoadingSpinner';

// =============================================================================
// Styled Components
// =============================================================================

const ScrollContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ContentContainer = styled.div`
  flex: 1;
`;

const LoadingContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
  min-height: 60px;
`;

const Sentinel = styled.div`
  height: 1px;
  visibility: hidden;
`;

const EndMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
`;

const ErrorMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
  gap: ${({ theme }) => theme.spacing.md};
  
  .error-text {
    color: ${({ theme }) => theme.colors.error.main};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    text-align: center;
  }
  
  .retry-button {
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    background-color: ${({ theme }) => theme.colors.primary.main};
    color: ${({ theme }) => theme.colors.primary.contrast};
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.primary.dark};
    }
  }
`;

// =============================================================================
// Component Props
// =============================================================================

export interface InfiniteScrollProps {
  /** Children to render */
  children: React.ReactNode;
  /** Function to load more data */
  loadMore: () => Promise<void> | void;
  /** Whether there are more items to load */
  hasMore: boolean;
  /** Whether currently loading initial data */
  isLoading?: boolean;
  /** Loading component to show when loading more */
  loader?: React.ReactNode;
  /** Message to show when no more data */
  endMessage?: React.ReactNode;
  /** Error state */
  error?: Error | string | null;
  /** Retry function for errors */
  onRetry?: () => void;
  /** Root margin for intersection observer */
  rootMargin?: string;
  /** Threshold for intersection observer */
  threshold?: number;
  /** Custom class name */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Custom data test id */
  'data-testid'?: string;
}

// =============================================================================
// Component
// =============================================================================

/**
 * InfiniteScroll component with loading states and error handling
 */
export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  children,
  loadMore,
  hasMore,
  isLoading = false,
  loader,
  endMessage,
  error,
  onRetry,
  rootMargin = '100px',
  threshold = 0.1,
  className,
  disabled = false,
  'data-testid': dataTestId,
}) => {
  const { sentinelRef, isLoadingMore } = useInfiniteScroll({
    loadMore,
    hasMore,
    isLoading,
    rootMargin,
    threshold,
    disabled: disabled || !!error,
  });

  const defaultLoader = (
    <LoadingContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <LoadingSpinner size="medium" />
    </LoadingContainer>
  );

  const defaultEndMessage = (
    <EndMessage>
      <div>No more items to load</div>
    </EndMessage>
  );

  const renderError = () => {
    if (!error) return null;

    const errorText = error instanceof Error ? error.message : String(error);

    return (
      <ErrorMessage>
        <div className="error-text">
          {errorText || 'Failed to load more items'}
        </div>
        {onRetry && (
          <button className="retry-button" onClick={onRetry}>
            Try Again
          </button>
        )}
      </ErrorMessage>
    );
  };

  const renderLoadingState = () => {
    if (error) return renderError();
    if (isLoadingMore) return loader || defaultLoader;
    if (!hasMore) return endMessage || defaultEndMessage;
    return null;
  };

  return (
    <ScrollContainer className={className} data-testid={dataTestId}>
      <ContentContainer>
        {children}
      </ContentContainer>

      {/* Loading/End State */}
      {renderLoadingState()}

      {/* Intersection Observer Sentinel */}
      {hasMore && !error && !disabled && (
        <Sentinel ref={sentinelRef} />
      )}
    </ScrollContainer>
  );
};

export default InfiniteScroll;