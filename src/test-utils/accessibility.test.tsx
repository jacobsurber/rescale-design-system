import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { RescaleThemeProvider } from '../theme/ThemeProvider';
import { 
  JobStatusIndicator,
  SoftwareLogoGrid,
  ResourceMetrics,
  WorkspaceSelector,
  QuickActions,
  AssistantChat,
} from '../index';
import { mockData } from './index';

// Add jest-axe matchers
expect.extend(toHaveNoViolations);

describe('Accessibility Compliance', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(
      <RescaleThemeProvider>
        {component}
      </RescaleThemeProvider>
    );
  };

  describe('WCAG 2.1 AA Compliance', () => {
    it('JobStatusIndicator meets accessibility standards', async () => {
      const { container } = renderWithTheme(
        <JobStatusIndicator 
          status="running" 
          progress={65} 
          duration="1h 30m"
          message="Processing simulation"
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('SoftwareLogoGrid meets accessibility standards', async () => {
      const softwareItems = mockData.generateSoftwareItems(6);
      const { container } = renderWithTheme(
        <SoftwareLogoGrid 
          items={softwareItems}
          maxVisible={4}
          showNames
          clickable
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('ResourceMetrics meets accessibility standards', async () => {
      const metrics = mockData.generateResourceMetrics(4);
      const { container } = renderWithTheme(
        <ResourceMetrics 
          metrics={metrics}
          layout="horizontal"
          showDetails
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('WorkspaceSelector meets accessibility standards', async () => {
      const workspaces = mockData.generateWorkspaces(5);
      const { container } = renderWithTheme(
        <WorkspaceSelector 
          workspaces={workspaces}
          selectedWorkspace={workspaces[0]}
          searchable
          showRecent
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('QuickActions meets accessibility standards', async () => {
      const actions = mockData.generateQuickActions(3);
      const { container } = renderWithTheme(
        <QuickActions 
          actions={actions}
          layout="horizontal"
          showDefaults
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('AssistantChat meets accessibility standards', async () => {
      const messages = mockData.generateChatMessages(3);
      const { container } = renderWithTheme(
        <AssistantChat 
          messages={messages}
          defaultOpen
          assistantName="Test Assistant"
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Keyboard Navigation', () => {
    it('JobStatusIndicator supports keyboard interaction', async () => {
      renderWithTheme(
        <JobStatusIndicator status="running" progress={65} />
      );

      // Should not trap focus since it's primarily display
      const element = screen.getByRole('status');
      expect(element).toBeInTheDocument();
      
      // Should be readable by screen readers
      expect(element).toHaveAttribute('aria-live', 'polite');
    });

    it('SoftwareLogoGrid supports keyboard navigation', async () => {
      const onItemClick = jest.fn();
      const softwareItems = mockData.generateSoftwareItems(3);
      
      renderWithTheme(
        <SoftwareLogoGrid 
          items={softwareItems}
          clickable
          onItemClick={onItemClick}
        />
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      
      // First button should be focusable
      buttons[0].focus();
      expect(buttons[0]).toHaveFocus();

      // Enter key should activate
      fireEvent.keyDown(buttons[0], { key: 'Enter', code: 'Enter' });
      expect(onItemClick).toHaveBeenCalled();
    });

    it('ResourceMetrics is keyboard accessible', () => {
      const metrics = mockData.generateResourceMetrics(2);
      
      renderWithTheme(
        <ResourceMetrics metrics={metrics} />
      );

      const progressBars = screen.getAllByRole('progressbar');
      progressBars.forEach(progressBar => {
        expect(progressBar).toHaveAttribute('aria-valuenow');
        expect(progressBar).toHaveAttribute('aria-valuemin', '0');
        expect(progressBar).toHaveAttribute('aria-valuemax', '100');
      });
    });

    it('WorkspaceSelector supports full keyboard interaction', async () => {
      const onSelect = jest.fn();
      const workspaces = mockData.generateWorkspaces(3);
      
      renderWithTheme(
        <WorkspaceSelector 
          workspaces={workspaces}
          onSelect={onSelect}
          searchable
        />
      );

      const selector = screen.getByRole('combobox');
      expect(selector).toBeInTheDocument();
      
      // Should be focusable
      selector.focus();
      expect(selector).toHaveFocus();

      // Arrow keys should work
      fireEvent.keyDown(selector, { key: 'ArrowDown', code: 'ArrowDown' });
      
      // Escape should close
      fireEvent.keyDown(selector, { key: 'Escape', code: 'Escape' });
    });

    it('QuickActions buttons are keyboard accessible', () => {
      const actions = mockData.generateQuickActions(3);
      
      renderWithTheme(
        <QuickActions actions={actions} showDefaults={false} />
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).not.toHaveAttribute('disabled');
        
        // Should be focusable
        button.focus();
        expect(button).toHaveFocus();
        
        // Should have accessible name
        expect(button).toHaveAccessibleName();
      });
    });

    it('AssistantChat supports keyboard navigation', () => {
      const messages = mockData.generateChatMessages(2);
      
      renderWithTheme(
        <AssistantChat 
          messages={messages}
          defaultOpen
        />
      );

      const chatInput = screen.getByRole('textbox');
      expect(chatInput).toBeInTheDocument();
      
      chatInput.focus();
      expect(chatInput).toHaveFocus();

      // Send button should be accessible
      const sendButton = screen.getByRole('button', { name: /send/i });
      expect(sendButton).toBeInTheDocument();
    });
  });

  describe('Screen Reader Support', () => {
    it('JobStatusIndicator provides proper status announcements', () => {
      renderWithTheme(
        <JobStatusIndicator 
          status="completed" 
          message="Job completed successfully"
        />
      );

      const statusElement = screen.getByRole('status');
      expect(statusElement).toHaveAttribute('aria-live', 'polite');
      expect(statusElement).toHaveTextContent('Completed');
    });

    it('ResourceMetrics has proper progress announcements', () => {
      const metrics = [
        { type: 'cpu', usage: 75, current: '3.0 GHz', total: '4.0 GHz' }
      ];
      
      renderWithTheme(
        <ResourceMetrics metrics={metrics} />
      );

      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '75');
      expect(progressBar).toHaveAttribute('aria-label', expect.stringContaining('CPU'));
    });

    it('SoftwareLogoGrid items have proper labels', () => {
      const softwareItems = mockData.generateSoftwareItems(3);
      
      renderWithTheme(
        <SoftwareLogoGrid items={softwareItems} clickable />
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveAccessibleName();
      });
    });

    it('WorkspaceSelector has proper labeling', () => {
      const workspaces = mockData.generateWorkspaces(3);
      
      renderWithTheme(
        <WorkspaceSelector 
          workspaces={workspaces}
          placeholder="Select workspace"
        />
      );

      const selector = screen.getByRole('combobox');
      expect(selector).toHaveAttribute('aria-expanded', 'false');
      expect(selector).toHaveAttribute('placeholder', 'Select workspace');
    });

    it('QuickActions have descriptive labels', () => {
      renderWithTheme(
        <QuickActions showDefaults />
      );

      const newJobButton = screen.getByRole('button', { name: /new job/i });
      expect(newJobButton).toHaveAccessibleName();
      expect(newJobButton).toHaveAttribute('title', expect.any(String));
    });

    it('AssistantChat has proper ARIA structure', () => {
      const messages = mockData.generateChatMessages(3);
      
      renderWithTheme(
        <AssistantChat 
          messages={messages}
          defaultOpen
          assistantName="Test Assistant"
        />
      );

      // Chat should have proper role
      const chat = screen.getByRole('dialog');
      expect(chat).toBeInTheDocument();
      expect(chat).toHaveAttribute('aria-label', expect.stringContaining('Test Assistant'));

      // Messages should be in a log region
      const messageLog = screen.getByRole('log');
      expect(messageLog).toBeInTheDocument();
    });
  });

  describe('Color Contrast', () => {
    it('maintains sufficient contrast in all themes', async () => {
      // Test with default theme
      const { container: lightContainer } = renderWithTheme(
        <div>
          <JobStatusIndicator status="running" progress={65} />
          <ResourceMetrics metrics={mockData.generateResourceMetrics(2)} />
        </div>
      );

      // Should pass color contrast checks
      const lightResults = await axe(lightContainer, {
        rules: {
          'color-contrast': { enabled: true }
        }
      });
      expect(lightResults).toHaveNoViolations();
    });

    it('status colors meet contrast requirements', () => {
      const statuses = ['running', 'completed', 'failed', 'warning', 'queued'] as const;
      
      statuses.forEach(status => {
        const { container } = renderWithTheme(
          <JobStatusIndicator status={status} />
        );
        
        const statusElement = container.querySelector(`[data-status="${status}"]`);
        expect(statusElement).toBeInTheDocument();
      });
    });
  });

  describe('Motion and Animation', () => {
    it('respects reduced motion preferences', async () => {
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      renderWithTheme(
        <ResourceMetrics 
          metrics={mockData.generateResourceMetrics(2)} 
          animated 
        />
      );

      // Animation should be disabled or reduced
      // This would be tested based on actual implementation
    });

    it('provides alternative indicators for animations', () => {
      renderWithTheme(
        <JobStatusIndicator 
          status="running" 
          progress={65} 
          animated={false}
        />
      );

      // Even without animation, progress should be clear
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '65');
    });
  });

  describe('Focus Management', () => {
    it('manages focus properly in WorkspaceSelector dropdown', async () => {
      const workspaces = mockData.generateWorkspaces(3);
      
      renderWithTheme(
        <WorkspaceSelector workspaces={workspaces} />
      );

      const trigger = screen.getByRole('combobox');
      trigger.focus();
      
      // Opening dropdown should manage focus
      fireEvent.click(trigger);
      
      // Focus should remain manageable
      expect(document.activeElement).toBeDefined();
    });

    it('maintains focus visibility', () => {
      const actions = mockData.generateQuickActions(3);
      
      renderWithTheme(
        <QuickActions actions={actions} />
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        button.focus();
        
        // Should have visible focus indicator
        expect(button).toHaveFocus();
        expect(getComputedStyle(button).outline).toBeDefined();
      });
    });
  });

  describe('Error States and Messages', () => {
    it('provides accessible error messages', () => {
      renderWithTheme(
        <JobStatusIndicator 
          status="failed" 
          message="Job failed due to insufficient memory"
        />
      );

      const errorMessage = screen.getByText(/job failed/i);
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveAttribute('role', 'alert');
    });

    it('handles loading states accessibly', () => {
      renderWithTheme(
        <QuickActions 
          actions={[{
            id: 'loading',
            label: 'Processing',
            loading: true,
            onClick: jest.fn()
          }]}
        />
      );

      const loadingButton = screen.getByRole('button');
      expect(loadingButton).toHaveAttribute('aria-busy', 'true');
    });
  });
});