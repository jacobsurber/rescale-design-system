import { screen, waitFor } from '@testing-library/react';
import { ResourceMetrics } from './ResourceMetrics';
import { 
  render, 
  commonTestScenarios, 
  runAxeTest,
  mockData,
  snapshotHelpers,
  waitHelpers,
} from '../../../test-utils';

describe('ResourceMetrics', () => {
  const mockMetrics = mockData.generateResourceMetrics(4);
  const defaultProps = {
    metrics: mockMetrics,
  };

  // Common test scenarios
  commonTestScenarios.shouldRender(ResourceMetrics, defaultProps);
  commonTestScenarios.shouldBeAccessible(ResourceMetrics, defaultProps);
  commonTestScenarios.shouldWorkWithThemes(ResourceMetrics, defaultProps);
  commonTestScenarios.shouldBeResponsive(ResourceMetrics, defaultProps);

  describe('Metrics Display', () => {
    it('displays all provided metrics', () => {
      const metrics = [
        { type: 'cpu', usage: 75, current: '3.0 GHz', total: '4.0 GHz' },
        { type: 'memory', usage: 60, current: '9.6 GB', total: '16 GB' },
      ] as const;

      render(<ResourceMetrics metrics={metrics} />);

      expect(screen.getByText('CPU')).toBeInTheDocument();
      expect(screen.getByText('Memory')).toBeInTheDocument();
      expect(screen.getByText('75%')).toBeInTheDocument();
      expect(screen.getByText('60%')).toBeInTheDocument();
    });

    it('displays custom labels when provided', () => {
      const metrics = [
        { type: 'cpu', usage: 50, label: 'Processor Usage' },
        { type: 'memory', usage: 40, label: 'RAM Usage' },
      ] as const;

      render(<ResourceMetrics metrics={metrics} />);

      expect(screen.getByText('Processor Usage')).toBeInTheDocument();
      expect(screen.getByText('RAM Usage')).toBeInTheDocument();
    });

    it('shows detailed information when showDetails is true', () => {
      const metrics = [
        { type: 'cpu', usage: 75, current: '3.0 GHz', total: '4.0 GHz' },
      ] as const;

      render(<ResourceMetrics metrics={metrics} showDetails />);

      expect(screen.getByText('3.0 GHz / 4.0 GHz')).toBeInTheDocument();
    });

    it('hides detailed information when showDetails is false', () => {
      const metrics = [
        { type: 'cpu', usage: 75, current: '3.0 GHz', total: '4.0 GHz' },
      ] as const;

      render(<ResourceMetrics metrics={metrics} showDetails={false} />);

      expect(screen.queryByText('3.0 GHz / 4.0 GHz')).not.toBeInTheDocument();
    });
  });

  describe('Layout Variants', () => {
    it('renders horizontal layout correctly', () => {
      const { container } = render(
        <ResourceMetrics metrics={mockMetrics} layout="horizontal" />
      );

      const containerEl = container.firstChild as Element;
      expect(containerEl).toHaveStyle({ 
        display: 'flex',
        flexDirection: 'row'
      });
    });

    it('renders vertical layout correctly', () => {
      const { container } = render(
        <ResourceMetrics metrics={mockMetrics} layout="vertical" />
      );

      const containerEl = container.firstChild as Element;
      expect(containerEl).toHaveStyle({ 
        display: 'flex',
        flexDirection: 'column'
      });
    });

    it('renders grid layout correctly', () => {
      const { container } = render(
        <ResourceMetrics metrics={mockMetrics} layout="grid" />
      );

      const containerEl = container.firstChild as Element;
      expect(containerEl).toHaveStyle({ display: 'grid' });
    });
  });

  describe('Size Variants', () => {
    it('renders small progress indicators', () => {
      render(<ResourceMetrics metrics={mockMetrics} size="small" />);

      const progressElements = screen.getAllByRole('progressbar');
      progressElements.forEach(progress => {
        // Small size should have 60px diameter
        expect(progress.closest('.ant-progress-circle')).toHaveStyle({
          width: '60px',
          height: '60px'
        });
      });
    });

    it('renders default progress indicators', () => {
      render(<ResourceMetrics metrics={mockMetrics} size="default" />);

      const progressElements = screen.getAllByRole('progressbar');
      progressElements.forEach(progress => {
        // Default size should have 80px diameter
        expect(progress.closest('.ant-progress-circle')).toHaveStyle({
          width: '80px',
          height: '80px'
        });
      });
    });

    it('renders large progress indicators', () => {
      render(<ResourceMetrics metrics={mockMetrics} size="large" />);

      const progressElements = screen.getAllByRole('progressbar');
      progressElements.forEach(progress => {
        // Large size should have 120px diameter
        expect(progress.closest('.ant-progress-circle')).toHaveStyle({
          width: '120px',
          height: '120px'
        });
      });
    });
  });

  describe('Animation', () => {
    it('animates values when animated is true', async () => {
      const metrics = [
        { type: 'cpu', usage: 75, current: '3.0 GHz', total: '4.0 GHz' },
      ] as const;

      render(<ResourceMetrics metrics={metrics} animated />);

      const progressBar = screen.getByRole('progressbar');
      
      // Initially should be 0 for animation
      expect(progressBar).toHaveAttribute('aria-valuenow', '0');
      
      // After animation delay, should show actual value
      await waitFor(() => {
        expect(progressBar).toHaveAttribute('aria-valuenow', '75');
      }, { timeout: 1000 });
    });

    it('shows final values immediately when animated is false', () => {
      const metrics = [
        { type: 'cpu', usage: 75, current: '3.0 GHz', total: '4.0 GHz' },
      ] as const;

      render(<ResourceMetrics metrics={metrics} animated={false} />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '75');
    });

    it('supports custom animation duration', async () => {
      const metrics = [
        { type: 'cpu', usage: 50 },
      ] as const;

      render(
        <ResourceMetrics 
          metrics={metrics} 
          animated 
          animationDuration={200} 
        />
      );

      await waitHelpers.waitForAnimation();
      
      const progressBar = screen.getByRole('progressbar');
      await waitFor(() => {
        expect(progressBar).toHaveAttribute('aria-valuenow', '50');
      });
    });
  });

  describe('Color Coding', () => {
    it('applies green color for low usage (0-49%)', () => {
      const metrics = [{ type: 'cpu', usage: 30 }] as const;
      const { container } = render(<ResourceMetrics metrics={metrics} />);

      const progressCircle = container.querySelector('.ant-progress-circle-path');
      expect(progressCircle).toHaveAttribute('stroke', 'var(--rescale-color-success)');
    });

    it('applies blue color for moderate usage (50-74%)', () => {
      const metrics = [{ type: 'cpu', usage: 65 }] as const;
      const { container } = render(<ResourceMetrics metrics={metrics} />);

      const progressCircle = container.querySelector('.ant-progress-circle-path');
      expect(progressCircle).toHaveAttribute('stroke', 'var(--rescale-color-brand-blue)');
    });

    it('applies yellow color for high usage (75-89%)', () => {
      const metrics = [{ type: 'cpu', usage: 80 }] as const;
      const { container } = render(<ResourceMetrics metrics={metrics} />);

      const progressCircle = container.querySelector('.ant-progress-circle-path');
      expect(progressCircle).toHaveAttribute('stroke', 'var(--rescale-color-warning)');
    });

    it('applies red color for critical usage (90%+)', () => {
      const metrics = [{ type: 'cpu', usage: 95 }] as const;
      const { container } = render(<ResourceMetrics metrics={metrics} />);

      const progressCircle = container.querySelector('.ant-progress-circle-path');
      expect(progressCircle).toHaveAttribute('stroke', 'var(--rescale-color-error)');
    });

    it('uses custom color when provided', () => {
      const metrics = [
        { type: 'cpu', usage: 50, color: '#purple' }
      ] as const;
      
      const { container } = render(<ResourceMetrics metrics={metrics} />);

      const progressCircle = container.querySelector('.ant-progress-circle-path');
      expect(progressCircle).toHaveAttribute('stroke', '#purple');
    });
  });

  describe('Icons', () => {
    it('displays correct icon for CPU metric', () => {
      const metrics = [{ type: 'cpu', usage: 50 }] as const;
      render(<ResourceMetrics metrics={metrics} />);

      expect(screen.getByLabelText(/cpu/i)).toBeInTheDocument();
    });

    it('displays correct icon for Memory metric', () => {
      const metrics = [{ type: 'memory', usage: 50 }] as const;
      render(<ResourceMetrics metrics={metrics} />);

      expect(screen.getByLabelText(/memory/i)).toBeInTheDocument();
    });

    it('displays correct icon for Storage metric', () => {
      const metrics = [{ type: 'storage', usage: 50 }] as const;
      render(<ResourceMetrics metrics={metrics} />);

      expect(screen.getByLabelText(/storage/i)).toBeInTheDocument();
    });

    it('displays correct icon for Network metric', () => {
      const metrics = [{ type: 'network', usage: 50 }] as const;
      render(<ResourceMetrics metrics={metrics} />);

      expect(screen.getByLabelText(/network/i)).toBeInTheDocument();
    });
  });

  describe('Cards Styling', () => {
    it('renders as cards when asCards is true', () => {
      const { container } = render(
        <ResourceMetrics metrics={mockMetrics} asCards />
      );

      const cardElements = container.querySelectorAll('.ant-card');
      expect(cardElements).toHaveLength(mockMetrics.length);
    });

    it('renders without cards when asCards is false', () => {
      const { container } = render(
        <ResourceMetrics metrics={mockMetrics} asCards={false} />
      );

      const cardElements = container.querySelectorAll('.ant-card');
      expect(cardElements).toHaveLength(0);
    });
  });

  describe('Tooltips', () => {
    it('shows tooltip with detailed information on hover', async () => {
      const metrics = [
        { 
          type: 'cpu', 
          usage: 75, 
          current: '3.0 GHz', 
          total: '4.0 GHz' 
        }
      ] as const;

      const { user } = render(
        <ResourceMetrics metrics={metrics} showDetails />
      );

      const metricElement = screen.getByText('CPU');
      await user.hover(metricElement);

      expect(screen.getByText('CPU')).toBeInTheDocument();
      expect(screen.getByText('3.0 GHz / 4.0 GHz')).toBeInTheDocument();
      expect(screen.getByText('75% used')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('renders empty when no metrics provided', () => {
      const { container } = render(<ResourceMetrics metrics={[]} />);
      expect(container.firstChild).toBeEmptyDOMElement();
    });

    it('handles single metric correctly', () => {
      const metrics = [{ type: 'cpu', usage: 50 }] as const;
      render(<ResourceMetrics metrics={metrics} />);

      expect(screen.getByText('CPU')).toBeInTheDocument();
      expect(screen.getByText('50%')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for progress indicators', async () => {
      const { container } = render(<ResourceMetrics metrics={mockMetrics} />);
      
      const progressBars = screen.getAllByRole('progressbar');
      progressBars.forEach((progressBar, index) => {
        expect(progressBar).toHaveAttribute('aria-valuenow');
        expect(progressBar).toHaveAttribute('aria-valuemin', '0');
        expect(progressBar).toHaveAttribute('aria-valuemax', '100');
      });

      await runAxeTest(container);
    });

    it('provides accessible names for metrics', () => {
      const metrics = [
        { type: 'cpu', usage: 75, label: 'CPU Usage' },
      ] as const;

      render(<ResourceMetrics metrics={metrics} />);

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAccessibleName(/cpu/i);
    });

    it('supports keyboard navigation', async () => {
      const { user } = render(<ResourceMetrics metrics={mockMetrics} />);
      
      await user.tab();
      expect(document.activeElement).toBeInTheDocument();
    });
  });

  describe('Snapshots', () => {
    it('matches snapshot for horizontal layout', () => {
      snapshotHelpers.createComponentSnapshot(ResourceMetrics, {
        metrics: mockMetrics,
        layout: 'horizontal',
        showDetails: true,
      });
    });

    it('matches snapshot for grid layout', () => {
      snapshotHelpers.createComponentSnapshot(ResourceMetrics, {
        metrics: mockMetrics,
        layout: 'grid',
        asCards: true,
      });
    });

    it('matches snapshot for different sizes', () => {
      ['small', 'default', 'large'].forEach(size => {
        snapshotHelpers.createComponentSnapshot(ResourceMetrics, {
          metrics: mockMetrics.slice(0, 2),
          size: size as 'small' | 'default' | 'large',
          layout: 'horizontal',
        });
      });
    });
  });
});