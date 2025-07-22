import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button, Result } from 'antd';
import { ReloadOutlined, BugOutlined } from '@ant-design/icons';
import styled from 'styled-components';

interface Props {
  children: ReactNode;
  /** Fallback component to render on error */
  fallback?: (error: Error, errorInfo: ErrorInfo, retry: () => void) => ReactNode;
  /** Callback when error occurs */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Whether to show detailed error info (dev mode) */
  showDetails?: boolean;
  /** Custom error boundary ID for tracking */
  boundaryId?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

const ErrorContainer = styled.div`
  padding: 24px;
  margin: 16px 0;
  border-radius: 8px;
  background: #fff2f0;
  border: 1px solid #ffccc7;
`;

const ErrorDetails = styled.details`
  margin-top: 16px;
  padding: 12px;
  background: #fafafa;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  
  summary {
    cursor: pointer;
    font-weight: 500;
    margin-bottom: 8px;
    
    &:hover {
      color: #1890ff;
    }
  }
  
  pre {
    margin: 0;
    font-size: 12px;
    line-height: 1.4;
    white-space: pre-wrap;
    word-break: break-word;
  }
`;

/**
 * ErrorBoundary - Catches JavaScript errors in component tree
 * 
 * @example
 * ```tsx
 * <ErrorBoundary onError={(error) => console.error(error)}>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state to show fallback UI
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error information
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Boundary Caught Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Boundary ID:', this.props.boundaryId);
      console.groupEnd();
    }

    // Report to error tracking service
    this.reportError(error, errorInfo);
  }

  private reportError = (error: Error, errorInfo: ErrorInfo): void => {
    // Here you would typically send to your error tracking service
    // Example: Sentry, Bugsnag, etc.
    if (typeof window !== 'undefined' && 'gtag' in window) {
      // Google Analytics error tracking
      (window as any).gtag('event', 'exception', {
        description: error.message,
        fatal: false,
        custom_map: {
          boundary_id: this.props.boundaryId,
          component_stack: errorInfo.componentStack,
        },
      });
    }
  };

  private handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });
  };

  private handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback(
          this.state.error,
          this.state.errorInfo!,
          this.handleRetry
        );
      }

      // Default fallback UI
      const isDevelopment = process.env.NODE_ENV === 'development';
      const showDetails = this.props.showDetails ?? isDevelopment;

      return (
        <ErrorContainer>
          <Result
            status="error"
            title="Something went wrong"
            subTitle="An unexpected error occurred. Please try refreshing the page or contact support if the problem persists."
            icon={<BugOutlined style={{ color: '#ff4d4f' }} />}
            extra={[
              <Button key="retry" type="primary" onClick={this.handleRetry}>
                Try Again
              </Button>,
              <Button key="reload" icon={<ReloadOutlined />} onClick={this.handleReload}>
                Reload Page
              </Button>,
            ]}
          />
          
          {showDetails && this.state.errorInfo && (
            <ErrorDetails>
              <summary>Error Details (Development Mode)</summary>
              <div>
                <strong>Error ID:</strong> {this.state.errorId}
              </div>
              <div>
                <strong>Boundary ID:</strong> {this.props.boundaryId || 'unknown'}
              </div>
              <div>
                <strong>Error Message:</strong>
                <pre>{this.state.error.message}</pre>
              </div>
              <div>
                <strong>Stack Trace:</strong>
                <pre>{this.state.error.stack}</pre>
              </div>
              <div>
                <strong>Component Stack:</strong>
                <pre>{this.state.errorInfo.componentStack}</pre>
              </div>
            </ErrorDetails>
          )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

/**
 * withErrorBoundary - HOC that wraps component with error boundary
 * 
 * @example
 * ```tsx
 * const SafeComponent = withErrorBoundary(MyComponent, {
 *   boundaryId: 'my-component-boundary'
 * });
 * ```
 */
export const withErrorBoundary = <P extends {}>(
  WrappedComponent: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) => {
  const WithErrorBoundaryComponent = React.forwardRef<any, P>((props, ref) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <WrappedComponent {...props} ref={ref} />
    </ErrorBoundary>
  ));

  WithErrorBoundaryComponent.displayName = `withErrorBoundary(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return WithErrorBoundaryComponent;
};

/**
 * useErrorHandler - Hook for handling errors in functional components
 */
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error | string) => {
    const errorObj = error instanceof Error ? error : new Error(error);
    setError(errorObj);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
};

export default ErrorBoundary;