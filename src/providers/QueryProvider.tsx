// =============================================================================
// Query Provider - TanStack Query provider with error boundaries and devtools
// =============================================================================

import React, { ReactNode, Suspense } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '../lib/queryClient';
import { Spin, Alert, Button } from 'antd';
import styled from 'styled-components';

// Styled components
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  flex-direction: column;
  gap: 16px;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  padding: 24px;
`;

// Loading fallback component
const QueryLoadingFallback: React.FC<{ message?: string }> = ({ 
  message = 'Loading data...' 
}) => (
  <LoadingContainer>
    <Spin size="large" />
    <div style={{ color: '#666', fontSize: '14px' }}>{message}</div>
  </LoadingContainer>
);

// Error boundary for query errors
interface QueryErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class QueryErrorBoundary extends React.Component<
  { children: ReactNode; fallback?: React.ComponentType<{ error: Error; retry: () => void }> },
  QueryErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): QueryErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Query Error Boundary caught an error:', error, errorInfo);
    
    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error tracking service
      console.error('Production error:', { error, errorInfo });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    
    // Retry by clearing the query cache and refetching
    queryClient.invalidateQueries();
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback;
      
      if (FallbackComponent && this.state.error) {
        return <FallbackComponent error={this.state.error} retry={this.handleRetry} />;
      }

      return (
        <ErrorContainer>
          <Alert
            message="Something went wrong"
            description={
              this.state.error?.message || 'An unexpected error occurred while loading data.'
            }
            type="error"
            showIcon
            action={
              <Button size="small" danger onClick={this.handleRetry}>
                Try Again
              </Button>
            }
          />
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

// Default error fallback
const DefaultErrorFallback: React.FC<{ error: Error; retry: () => void }> = ({ 
  error, 
  retry 
}) => (
  <ErrorContainer>
    <Alert
      message="Data Loading Error"
      description={error.message || 'Failed to load data. Please try again.'}
      type="error"
      showIcon
      action={
        <Button size="small" danger onClick={retry}>
          Retry
        </Button>
      }
    />
  </ErrorContainer>
);

// Main Query Provider component
interface QueryProviderProps {
  children: ReactNode;
  errorFallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  loadingFallback?: React.ComponentType<{ message?: string }>;
  enableDevtools?: boolean;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({
  children,
  errorFallback = DefaultErrorFallback,
  loadingFallback = QueryLoadingFallback,
  enableDevtools = process.env.NODE_ENV === 'development',
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <QueryErrorBoundary fallback={errorFallback}>
        <Suspense fallback={<QueryLoadingFallback />}>
          {children}
        </Suspense>
      </QueryErrorBoundary>
      
      {/* React Query Devtools - only in development */}
      {enableDevtools && (
        <ReactQueryDevtools
          initialIsOpen={false}
          position="bottom-right"
          toggleButtonProps={{
            style: {
              fontSize: '12px',
              padding: '4px 8px',
            },
          }}
        />
      )}
    </QueryClientProvider>
  );
};

// Hook to access query utilities
export { queryUtils } from '../lib/queryClient';

// Re-export for convenience
export { queryClient } from '../lib/queryClient';