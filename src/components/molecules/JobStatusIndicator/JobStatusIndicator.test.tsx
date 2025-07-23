import { screen, waitFor } from '@testing-library/react';
import { JobStatusIndicator } from './JobStatusIndicator';
import { 
  render, 
  commonTestScenarios, 
  runAxeTest,
  snapshotHelpers,
} from '../../../test-utils';

describe('JobStatusIndicator', () => {
  const defaultProps = {
    status: 'running' as const,
    progress: 65,
    duration: '1h 30m',
  };

  // Common test scenarios
  commonTestScenarios.shouldRender(JobStatusIndicator, defaultProps);
  commonTestScenarios.shouldBeAccessible(JobStatusIndicator, defaultProps);
  commonTestScenarios.shouldWorkWithThemes(JobStatusIndicator, defaultProps);
  commonTestScenarios.shouldBeResponsive(JobStatusIndicator, defaultProps);

  describe('Status Display', () => {
    it('displays running status correctly', () => {
      render(<JobStatusIndicator status="running" progress={45} />);
      
      expect(screen.getByText('Running')).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '45');
    });

    it('displays completed status correctly', () => {
      render(<JobStatusIndicator status="completed" duration="2h 15m" />);
      
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByText('2h 15m')).toBeInTheDocument();
    });

    it('displays failed status correctly', () => {
      render(<JobStatusIndicator status="failed" message="Job failed due to timeout" />);
      
      expect(screen.getByText('Failed')).toBeInTheDocument();
      expect(screen.getByText('Job failed due to timeout')).toBeInTheDocument();
    });

    it('displays warning status correctly', () => {
      render(<JobStatusIndicator status="warning" message="Job completed with warnings" />);
      
      expect(screen.getByText('Warning')).toBeInTheDocument();
      expect(screen.getByText('Job completed with warnings')).toBeInTheDocument();
    });

    it('displays queued status correctly', () => {
      render(<JobStatusIndicator status="queued" />);
      
      expect(screen.getByText('Queued')).toBeInTheDocument();
    });

    it('displays pending status correctly', () => {
      render(<JobStatusIndicator status="pending" />);
      
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });
  });

  describe('Progress Animation', () => {
    it('shows progress bar for running jobs', () => {
      render(<JobStatusIndicator status="running" progress={75} animated />);
      
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveAttribute('aria-valuenow', '75');
    });

    it('does not show progress bar for completed jobs', () => {
      render(<JobStatusIndicator status="completed" />);
      
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    it('handles animation prop correctly', async () => {
      const { rerender } = render(
        <JobStatusIndicator status="running" progress={50} animated={false} />
      );
      
      let progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '50');
      
      // Test with animation enabled
      rerender(<JobStatusIndicator status="running" progress={75} animated />);
      
      progressBar = screen.getByRole('progressbar');
      await waitFor(() => {
        expect(progressBar).toHaveAttribute('aria-valuenow', '75');
      });
    });
  });

  describe('Size Variants', () => {
    it('renders small size correctly', () => {
      const { container } = render(
        <JobStatusIndicator status="running" size="small" />
      );
      
      expect(container.firstChild).toHaveClass('size-small');
    });

    it('renders default size correctly', () => {
      const { container } = render(
        <JobStatusIndicator status="running" size="default" />
      );
      
      expect(container.firstChild).toHaveClass('size-default');
    });

    it('renders large size correctly', () => {
      const { container } = render(
        <JobStatusIndicator status="running" size="large" />
      );
      
      expect(container.firstChild).toHaveClass('size-large');
    });
  });

  describe('Details Display', () => {
    it('shows details when showDetails is true', () => {
      render(
        <JobStatusIndicator 
          status="running" 
          progress={65} 
          duration="1h 30m"
          message="Processing simulation"
          showDetails
        />
      );
      
      expect(screen.getByText('1h 30m')).toBeInTheDocument();
      expect(screen.getByText('Processing simulation')).toBeInTheDocument();
    });

    it('hides details when showDetails is false', () => {
      render(
        <JobStatusIndicator 
          status="running" 
          progress={65} 
          duration="1h 30m"
          message="Processing simulation"
          showDetails={false}
        />
      );
      
      expect(screen.queryByText('1h 30m')).not.toBeInTheDocument();
      expect(screen.queryByText('Processing simulation')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for progress bar', () => {
      render(<JobStatusIndicator status="running" progress={65} />);
      
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '65');
      expect(progressBar).toHaveAttribute('aria-valuemin', '0');
      expect(progressBar).toHaveAttribute('aria-valuemax', '100');
    });

    it('has proper status announcement', () => {
      render(<JobStatusIndicator status="failed" message="Job failed" />);
      
      const statusElement = screen.getByText('Failed');
      expect(statusElement).toHaveAttribute('role', 'status');
      expect(statusElement).toHaveAttribute('aria-live', 'polite');
    });

    it('provides context for screen readers', async () => {
      const { container } = render(
        <JobStatusIndicator 
          status="running" 
          progress={65} 
          duration="1h 30m"
          message="Processing CFD simulation"
        />
      );
      
      await runAxeTest(container);
    });
  });

  describe('Status Colors', () => {
    it('applies correct color for running status', () => {
      const { container } = render(<JobStatusIndicator status="running" />);
      
      const statusElement = container.querySelector('[data-status="running"]');
      expect(statusElement).toHaveStyle({ color: 'var(--rescale-color-brand-blue)' });
    });

    it('applies correct color for completed status', () => {
      const { container } = render(<JobStatusIndicator status="completed" />);
      
      const statusElement = container.querySelector('[data-status="completed"]');
      expect(statusElement).toHaveStyle({ color: 'var(--rescale-color-success)' });
    });

    it('applies correct color for failed status', () => {
      const { container } = render(<JobStatusIndicator status="failed" />);
      
      const statusElement = container.querySelector('[data-status="failed"]');
      expect(statusElement).toHaveStyle({ color: 'var(--rescale-color-error)' });
    });

    it('applies correct color for warning status', () => {
      const { container } = render(<JobStatusIndicator status="warning" />);
      
      const statusElement = container.querySelector('[data-status="warning"]');
      expect(statusElement).toHaveStyle({ color: 'var(--rescale-color-warning)' });
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined progress gracefully', () => {
      render(<JobStatusIndicator status="running" />);
      
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '0');
    });

    it('handles invalid progress values', () => {
      render(<JobStatusIndicator status="running" progress={150} />);
      
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '100');
    });

    it('handles negative progress values', () => {
      render(<JobStatusIndicator status="running" progress={-10} />);
      
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '0');
    });
  });

  describe('Snapshots', () => {
    it('matches snapshot for running status', () => {
      snapshotHelpers.createComponentSnapshot(JobStatusIndicator, {
        status: 'running',
        progress: 65,
        duration: '1h 30m',
        message: 'Processing simulation',
      });
    });

    it('matches snapshot for completed status', () => {
      snapshotHelpers.createComponentSnapshot(JobStatusIndicator, {
        status: 'completed',
        duration: '2h 15m',
        message: 'Job completed successfully',
      });
    });

    it('matches snapshot for failed status', () => {
      snapshotHelpers.createComponentSnapshot(JobStatusIndicator, {
        status: 'failed',
        duration: '45m',
        message: 'Job failed due to error',
      });
    });
  });
});