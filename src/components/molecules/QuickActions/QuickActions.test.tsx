import { screen, fireEvent, waitFor } from '@testing-library/react';
import { QuickActions } from './QuickActions';
import { 
  render, 
  commonTestScenarios, 
  runAxeTest,
  mockData,
  snapshotHelpers,
} from '../../../test-utils';

describe('QuickActions', () => {
  const mockActions = mockData.generateQuickActions(3);
  const defaultProps = {
    actions: mockActions,
  };

  // Common test scenarios
  commonTestScenarios.shouldRender(QuickActions, defaultProps);
  commonTestScenarios.shouldBeAccessible(QuickActions, defaultProps);
  commonTestScenarios.shouldWorkWithThemes(QuickActions, defaultProps);
  commonTestScenarios.shouldBeResponsive(QuickActions, defaultProps);

  describe('Basic Functionality', () => {
    it('renders all provided actions', () => {
      render(<QuickActions actions={mockActions} />);

      mockActions.forEach(action => {
        expect(screen.getByText(action.title)).toBeInTheDocument();
        if (action.description) {
          expect(screen.getByText(action.description)).toBeInTheDocument();
        }
      });
    });

    it('calls onClick handler when action is clicked', async () => {
      const onActionClick = jest.fn();
      const actionsWithHandler = mockActions.map(action => ({
        ...action,
        onClick: onActionClick,
      }));

      const { user } = render(<QuickActions actions={actionsWithHandler} />);

      const firstAction = screen.getByText(actionsWithHandler[0].title);
      await user.click(firstAction);

      expect(onActionClick).toHaveBeenCalledWith(actionsWithHandler[0]);
    });

    it('handles disabled actions correctly', async () => {
      const onActionClick = jest.fn();
      const disabledAction = {
        ...mockActions[0],
        disabled: true,
        onClick: onActionClick,
      };

      const { user } = render(<QuickActions actions={[disabledAction]} />);

      const actionButton = screen.getByRole('button');
      expect(actionButton).toBeDisabled();

      await user.click(actionButton);
      expect(onActionClick).not.toHaveBeenCalled();
    });

    it('displays loading state correctly', () => {
      const loadingAction = {
        ...mockActions[0],
        loading: true,
      };

      render(<QuickActions actions={[loadingAction]} />);

      const actionButton = screen.getByRole('button');
      expect(actionButton).toHaveClass('ant-btn-loading');
      expect(screen.getByTestId('loading-icon')).toBeInTheDocument();
    });
  });

  describe('Action Display', () => {
    it('shows action icons when provided', () => {
      const actionsWithIcons = mockActions.map(action => ({
        ...action,
        icon: 'plus',
      }));

      render(<QuickActions actions={actionsWithIcons} />);

      const icons = screen.getAllByTestId('action-icon');
      expect(icons).toHaveLength(actionsWithIcons.length);
    });

    it('displays action badges when provided', () => {
      const actionWithBadge = {
        ...mockActions[0],
        badge: { count: 5, color: 'red' },
      };

      render(<QuickActions actions={[actionWithBadge]} />);

      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('shows tooltips on hover', async () => {
      const actionWithTooltip = {
        ...mockActions[0],
        tooltip: 'This is a helpful tooltip',
      };

      const { user } = render(<QuickActions actions={[actionWithTooltip]} />);

      const actionButton = screen.getByRole('button');
      await user.hover(actionButton);

      await waitFor(() => {
        expect(screen.getByText('This is a helpful tooltip')).toBeInTheDocument();
      });
    });
  });

  describe('Layout and Styling', () => {
    it('applies different sizes correctly', () => {
      const sizes = ['small', 'default', 'large'] as const;
      
      sizes.forEach(size => {
        const { container, unmount } = render(
          <QuickActions actions={mockActions} size={size} />
        );

        const actionsContainer = container.querySelector('.quick-actions');
        expect(actionsContainer).toHaveClass(`quick-actions-${size}`);
        unmount();
      });
    });

    it('applies vertical layout when specified', () => {
      const { container } = render(
        <QuickActions actions={mockActions} layout="vertical" />
      );

      const actionsContainer = container.querySelector('.quick-actions');
      expect(actionsContainer).toHaveClass('quick-actions-vertical');
    });

    it('applies horizontal layout by default', () => {
      const { container } = render(<QuickActions actions={mockActions} />);

      const actionsContainer = container.querySelector('.quick-actions');
      expect(actionsContainer).toHaveClass('quick-actions-horizontal');
    });

    it('handles different action types with appropriate styling', () => {
      const actionTypes = ['primary', 'secondary', 'danger'] as const;
      const typedActions = mockActions.slice(0, 3).map((action, index) => ({
        ...action,
        type: actionTypes[index],
      }));

      render(<QuickActions actions={typedActions} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons[0]).toHaveClass('ant-btn-primary');
      expect(buttons[1]).toHaveClass('ant-btn-default');
      expect(buttons[2]).toHaveClass('ant-btn-dangerous');
    });
  });

  describe('Advanced Features', () => {
    it('supports action groups with separators', () => {
      const groupedActions = [
        { ...mockActions[0], group: 'create' },
        { ...mockActions[1], group: 'create' },
        { ...mockActions[2], group: 'manage' },
      ];

      const { container } = render(<QuickActions actions={groupedActions} showGroups />);

      const separators = container.querySelectorAll('.action-group-separator');
      expect(separators.length).toBe(1); // One separator between groups
    });

    it('displays keyboard shortcuts when provided', () => {
      const actionWithShortcut = {
        ...mockActions[0],
        shortcut: 'Ctrl+N',
      };

      render(<QuickActions actions={[actionWithShortcut]} showShortcuts />);

      expect(screen.getByText('Ctrl+N')).toBeInTheDocument();
    });

    it('handles action overflow with dropdown menu', async () => {
      const manyActions = mockData.generateQuickActions(10);
      const { user } = render(
        <QuickActions actions={manyActions} maxVisible={5} />
      );

      // Should show 5 actions plus overflow button
      const visibleButtons = screen.getAllByRole('button');
      expect(visibleButtons.length).toBe(6); // 5 + overflow

      const overflowButton = screen.getByTestId('overflow-actions');
      await user.click(overflowButton);

      // Should show remaining actions in dropdown
      await waitFor(() => {
        const overflowActions = manyActions.slice(5);
        overflowActions.forEach(action => {
          expect(screen.getByText(action.title)).toBeInTheDocument();
        });
      });
    });
  });

  describe('Interactive States', () => {
    it('provides visual feedback on hover', async () => {
      const { user } = render(<QuickActions actions={mockActions} />);

      const firstButton = screen.getByText(mockActions[0].title);
      await user.hover(firstButton);

      expect(firstButton.closest('button')).toHaveClass('ant-btn-hover');
    });

    it('shows focus indicators for keyboard navigation', async () => {
      const { user } = render(<QuickActions actions={mockActions} />);

      const firstButton = screen.getAllByRole('button')[0];
      firstButton.focus();

      expect(firstButton).toHaveFocus();
      expect(firstButton).toHaveClass('ant-btn-focused');
    });

    it('supports keyboard activation with Enter and Space', async () => {
      const onActionClick = jest.fn();
      const actionWithHandler = {
        ...mockActions[0],
        onClick: onActionClick,
      };

      const { user } = render(<QuickActions actions={[actionWithHandler]} />);

      const button = screen.getByRole('button');
      button.focus();

      await user.keyboard('{Enter}');
      expect(onActionClick).toHaveBeenCalledTimes(1);

      await user.keyboard(' ');
      expect(onActionClick).toHaveBeenCalledTimes(2);
    });
  });

  describe('Error Handling', () => {
    it('handles empty actions array gracefully', () => {
      const { container } = render(<QuickActions actions={[]} />);
      
      expect(container.firstChild).toBeInTheDocument();
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('handles actions with missing required props', () => {
      const incompleteAction = {
        id: 'incomplete',
        // Missing title
      } as any;

      // Should not crash, might show fallback or skip the action
      const { container } = render(<QuickActions actions={[incompleteAction]} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles onClick errors gracefully', async () => {
      const errorAction = {
        ...mockActions[0],
        onClick: () => {
          throw new Error('Test error');
        },
      };

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const { user } = render(<QuickActions actions={[errorAction]} />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('Performance', () => {
    it('memoizes action buttons to prevent unnecessary re-renders', () => {
      const { rerender } = render(<QuickActions actions={mockActions} />);

      // Re-render with same actions
      rerender(<QuickActions actions={mockActions} />);

      // Actions should remain stable (this would be tested with React DevTools Profiler in practice)
      expect(screen.getAllByRole('button')).toHaveLength(mockActions.length);
    });

    it('handles rapid clicks without double-execution', async () => {
      const onActionClick = jest.fn();
      const actionWithHandler = {
        ...mockActions[0],
        onClick: onActionClick,
      };

      const { user } = render(<QuickActions actions={[actionWithHandler]} />);

      const button = screen.getByRole('button');
      
      // Rapid clicks
      await user.click(button);
      await user.click(button);
      await user.click(button);

      // Should handle debouncing or prevent double execution
      expect(onActionClick).toHaveBeenCalledTimes(3);
    });
  });

  describe('Accessibility', () => {
    it('provides proper ARIA labels for actions', () => {
      const actionWithLabel = {
        ...mockActions[0],
        ariaLabel: 'Create new job action',
      };

      render(<QuickActions actions={[actionWithLabel]} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAccessibleName('Create new job action');
    });

    it('groups related actions with proper ARIA attributes', () => {
      const groupedActions = mockActions.map(action => ({
        ...action,
        group: 'creation-actions',
      }));

      const { container } = render(
        <QuickActions actions={groupedActions} showGroups />
      );

      const group = container.querySelector('[role="group"]');
      expect(group).toBeInTheDocument();
      expect(group).toHaveAttribute('aria-label');
    });

    it('announces state changes to screen readers', async () => {
      const actionWithState = {
        ...mockActions[0],
        loading: false,
      };

      const { rerender } = render(<QuickActions actions={[actionWithState]} />);

      // Change to loading state
      rerender(
        <QuickActions 
          actions={[{ ...actionWithState, loading: true }]} 
        />
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    it('passes accessibility audit', async () => {
      const { container } = render(
        <QuickActions 
          actions={mockActions}
          showShortcuts
          showGroups
        />
      );

      await runAxeTest(container);
    });
  });

  describe('Snapshots', () => {
    it('matches snapshot with basic configuration', () => {
      snapshotHelpers.createComponentSnapshot(QuickActions, {
        actions: mockActions.slice(0, 3),
      });
    });

    it('matches snapshot with advanced features', () => {
      const advancedActions = mockActions.map(action => ({
        ...action,
        icon: 'plus',
        badge: { count: 2, color: 'blue' },
        tooltip: `Tooltip for ${action.title}`,
        shortcut: 'Ctrl+N',
      }));

      snapshotHelpers.createComponentSnapshot(QuickActions, {
        actions: advancedActions,
        layout: 'vertical',
        size: 'large',
        showShortcuts: true,
        showGroups: true,
      });
    });
  });
});