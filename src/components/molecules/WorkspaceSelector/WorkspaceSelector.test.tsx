import { screen, fireEvent, waitFor } from '@testing-library/react';
import { WorkspaceSelector } from './WorkspaceSelector';
import { 
  render, 
  commonTestScenarios, 
  runAxeTest,
  mockData,
  snapshotHelpers,
} from '../../../test-utils';

describe('WorkspaceSelector', () => {
  const mockWorkspaces = mockData.generateWorkspaces(6);
  const defaultProps = {
    workspaces: mockWorkspaces,
  };

  // Common test scenarios
  commonTestScenarios.shouldRender(WorkspaceSelector, defaultProps);
  commonTestScenarios.shouldBeAccessible(WorkspaceSelector, defaultProps);
  commonTestScenarios.shouldWorkWithThemes(WorkspaceSelector, defaultProps);
  commonTestScenarios.shouldBeResponsive(WorkspaceSelector, defaultProps);

  describe('Basic Functionality', () => {
    it('displays placeholder when no workspace selected', () => {
      render(
        <WorkspaceSelector 
          workspaces={mockWorkspaces}
          placeholder="Select workspace"
        />
      );

      expect(screen.getByText('Select workspace')).toBeInTheDocument();
    });

    it('displays selected workspace', () => {
      const selectedWorkspace = mockWorkspaces[0];
      render(
        <WorkspaceSelector 
          workspaces={mockWorkspaces}
          selectedWorkspace={selectedWorkspace}
        />
      );

      expect(screen.getByText(selectedWorkspace.name)).toBeInTheDocument();
    });

    it('opens dropdown when clicked', async () => {
      const { user } = render(
        <WorkspaceSelector workspaces={mockWorkspaces} />
      );

      const selector = screen.getByRole('combobox');
      await user.click(selector);

      expect(selector).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('Search Functionality', () => {
    it('shows search input when searchable is true', async () => {
      const { user } = render(
        <WorkspaceSelector 
          workspaces={mockWorkspaces}
          searchable
        />
      );

      const selector = screen.getByRole('combobox');
      await user.click(selector);

      expect(screen.getByPlaceholderText('Search workspaces...')).toBeInTheDocument();
    });

    it('filters workspaces based on search input', async () => {
      const { user } = render(
        <WorkspaceSelector 
          workspaces={mockWorkspaces}
          searchable
        />
      );

      const selector = screen.getByRole('combobox');
      await user.click(selector);

      const searchInput = screen.getByPlaceholderText('Search workspaces...');
      await user.type(searchInput, 'Personal');

      // Should filter to show only matching workspaces
      const personalWorkspace = mockWorkspaces.find(w => w.name.includes('Personal'));
      if (personalWorkspace) {
        expect(screen.getByText(personalWorkspace.name)).toBeInTheDocument();
      }
    });

    it('shows no results when search has no matches', async () => {
      const { user } = render(
        <WorkspaceSelector 
          workspaces={mockWorkspaces}
          searchable
        />
      );

      const selector = screen.getByRole('combobox');
      await user.click(selector);

      const searchInput = screen.getByPlaceholderText('Search workspaces...');
      await user.type(searchInput, 'nonexistent');

      expect(screen.getByText('No workspaces found')).toBeInTheDocument();
    });

    it('hides search input when searchable is false', async () => {
      const { user } = render(
        <WorkspaceSelector 
          workspaces={mockWorkspaces}
          searchable={false}
        />
      );

      const selector = screen.getByRole('combobox');
      await user.click(selector);

      expect(screen.queryByPlaceholderText('Search workspaces...')).not.toBeInTheDocument();
    });
  });

  describe('Recent Workspaces', () => {
    it('shows recent workspaces section when showRecent is true', async () => {
      const { user } = render(
        <WorkspaceSelector 
          workspaces={mockWorkspaces}
          showRecent
        />
      );

      const selector = screen.getByRole('combobox');
      await user.click(selector);

      expect(screen.getByText('Recent Workspaces')).toBeInTheDocument();
    });

    it('limits recent workspaces by maxRecent prop', async () => {
      const { user } = render(
        <WorkspaceSelector 
          workspaces={mockWorkspaces}
          showRecent
          maxRecent={2}
        />
      );

      const selector = screen.getByRole('combobox');
      await user.click(selector);

      // Should show at most 2 recent workspaces
      const recentWorkspaces = mockWorkspaces
        .filter(w => w.lastAccessed)
        .sort((a, b) => (b.lastAccessed?.getTime() || 0) - (a.lastAccessed?.getTime() || 0))
        .slice(0, 2);

      recentWorkspaces.forEach(workspace => {
        expect(screen.getByText(workspace.name)).toBeInTheDocument();
      });
    });

    it('hides recent section when showRecent is false', async () => {
      const { user } = render(
        <WorkspaceSelector 
          workspaces={mockWorkspaces}
          showRecent={false}
        />
      );

      const selector = screen.getByRole('combobox');
      await user.click(selector);

      expect(screen.queryByText('Recent Workspaces')).not.toBeInTheDocument();
    });
  });

  describe('Workspace Selection', () => {
    it('calls onSelect when workspace is clicked', async () => {
      const onSelect = jest.fn();
      const { user } = render(
        <WorkspaceSelector 
          workspaces={mockWorkspaces}
          onSelect={onSelect}
        />
      );

      const selector = screen.getByRole('combobox');
      await user.click(selector);

      const workspaceOption = screen.getByText(mockWorkspaces[0].name);
      await user.click(workspaceOption);

      expect(onSelect).toHaveBeenCalledWith(mockWorkspaces[0]);
    });

    it('updates selected workspace display after selection', async () => {
      let selectedWorkspace = null;
      const onSelect = jest.fn((workspace) => {
        selectedWorkspace = workspace;
      });

      const { rerender, user } = render(
        <WorkspaceSelector 
          workspaces={mockWorkspaces}
          selectedWorkspace={selectedWorkspace}
          onSelect={onSelect}
        />
      );

      const selector = screen.getByRole('combobox');
      await user.click(selector);

      const workspaceOption = screen.getByText(mockWorkspaces[1].name);
      await user.click(workspaceOption);

      // Simulate parent component updating selectedWorkspace
      rerender(
        <WorkspaceSelector 
          workspaces={mockWorkspaces}
          selectedWorkspace={mockWorkspaces[1]}
          onSelect={onSelect}
        />
      );

      expect(screen.getByText(mockWorkspaces[1].name)).toBeInTheDocument();
    });
  });

  describe('Workspace Display', () => {
    it('displays workspace icons correctly', async () => {
      const { user } = render(
        <WorkspaceSelector workspaces={mockWorkspaces} />
      );

      const selector = screen.getByRole('combobox');
      await user.click(selector);

      // Should show workspace icons/avatars
      const avatars = screen.getAllByRole('img');
      expect(avatars.length).toBeGreaterThan(0);
    });

    it('shows workspace type indicators', async () => {
      const { user } = render(
        <WorkspaceSelector workspaces={mockWorkspaces} />
      );

      const selector = screen.getByRole('combobox');
      await user.click(selector);

      // Check for type indicators (team, personal, etc.)
      const teamWorkspaces = mockWorkspaces.filter(w => w.type === 'team');
      if (teamWorkspaces.length > 0) {
        expect(screen.getAllByText('Team').length).toBeGreaterThan(0);
      }
    });

    it('displays member count for team workspaces', async () => {
      const { user } = render(
        <WorkspaceSelector workspaces={mockWorkspaces} />
      );

      const selector = screen.getByRole('combobox');
      await user.click(selector);

      const teamWorkspaces = mockWorkspaces.filter(w => w.type === 'team' && w.memberCount);
      teamWorkspaces.forEach(workspace => {
        if (workspace.memberCount && workspace.memberCount > 1) {
          expect(screen.getByText(`${workspace.memberCount} members`)).toBeInTheDocument();
        }
      });
    });

    it('shows last accessed time formatting', async () => {
      const { user } = render(
        <WorkspaceSelector workspaces={mockWorkspaces} />
      );

      const selector = screen.getByRole('combobox');
      await user.click(selector);

      // Should show formatted time strings like "2h ago", "1d ago", etc.
      const timeElements = screen.getAllByText(/ago$/);
      expect(timeElements.length).toBeGreaterThan(0);
    });
  });

  describe('Visual Indicators', () => {
    it('shows starred workspaces with star indicator', async () => {
      const { user } = render(
        <WorkspaceSelector workspaces={mockWorkspaces} />
      );

      const selector = screen.getByRole('combobox');
      await user.click(selector);

      const starredWorkspaces = mockWorkspaces.filter(w => w.starred);
      if (starredWorkspaces.length > 0) {
        // Should have star icons for starred workspaces
        const starIcons = screen.getAllByTestId('star-icon');
        expect(starIcons.length).toBe(starredWorkspaces.length);
      }
    });

    it('shows private workspace indicators', async () => {
      const { user } = render(
        <WorkspaceSelector workspaces={mockWorkspaces} />
      );

      const selector = screen.getByRole('combobox');
      await user.click(selector);

      const privateWorkspaces = mockWorkspaces.filter(w => w.private);
      if (privateWorkspaces.length > 0) {
        // Should have lock icons for private workspaces
        const lockIcons = screen.getAllByTestId('lock-icon');
        expect(lockIcons.length).toBe(privateWorkspaces.length);
      }
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports arrow key navigation', async () => {
      const { user } = render(
        <WorkspaceSelector workspaces={mockWorkspaces} />
      );

      const selector = screen.getByRole('combobox');
      selector.focus();

      // Arrow down should open dropdown
      await user.keyboard('{ArrowDown}');
      expect(selector).toHaveAttribute('aria-expanded', 'true');

      // Continue arrow navigation
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowUp}');
    });

    it('supports Enter key for selection', async () => {
      const onSelect = jest.fn();
      const { user } = render(
        <WorkspaceSelector 
          workspaces={mockWorkspaces}
          onSelect={onSelect}
        />
      );

      const selector = screen.getByRole('combobox');
      selector.focus();

      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');

      expect(onSelect).toHaveBeenCalled();
    });

    it('supports Escape key to close dropdown', async () => {
      const { user } = render(
        <WorkspaceSelector workspaces={mockWorkspaces} />
      );

      const selector = screen.getByRole('combobox');
      await user.click(selector);
      
      expect(selector).toHaveAttribute('aria-expanded', 'true');

      await user.keyboard('{Escape}');
      expect(selector).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty workspace list', () => {
      const { container } = render(
        <WorkspaceSelector workspaces={[]} />
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles workspaces without lastAccessed date', async () => {
      const workspacesWithoutDate = mockWorkspaces.map(w => ({
        ...w,
        lastAccessed: undefined,
      }));

      const { user } = render(
        <WorkspaceSelector workspaces={workspacesWithoutDate} showRecent />
      );

      const selector = screen.getByRole('combobox');
      await user.click(selector);

      // Should not show recent workspaces section if none have lastAccessed
      expect(screen.queryByText('Recent Workspaces')).not.toBeInTheDocument();
    });

    it('handles long workspace names gracefully', async () => {
      const workspaceWithLongName = {
        ...mockWorkspaces[0],
        name: 'This is a very long workspace name that might cause display issues',
      };

      const { user } = render(
        <WorkspaceSelector 
          workspaces={[workspaceWithLongName]}
          selectedWorkspace={workspaceWithLongName}
        />
      );

      // Should truncate or handle long names appropriately
      expect(screen.getByText(workspaceWithLongName.name)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', async () => {
      const { container } = render(
        <WorkspaceSelector workspaces={mockWorkspaces} />
      );

      const selector = screen.getByRole('combobox');
      expect(selector).toHaveAttribute('aria-expanded');
      expect(selector).toHaveAttribute('aria-haspopup');

      await runAxeTest(container);
    });

    it('provides proper labeling for screen readers', () => {
      render(
        <WorkspaceSelector 
          workspaces={mockWorkspaces}
          placeholder="Select your workspace"
        />
      );

      const selector = screen.getByRole('combobox');
      expect(selector).toHaveAccessibleName(/workspace/i);
    });

    it('announces workspace selection to screen readers', async () => {
      const onSelect = jest.fn();
      const { user } = render(
        <WorkspaceSelector 
          workspaces={mockWorkspaces}
          onSelect={onSelect}
        />
      );

      const selector = screen.getByRole('combobox');
      await user.click(selector);

      const workspaceOption = screen.getByText(mockWorkspaces[0].name);
      expect(workspaceOption).toHaveAttribute('role', 'option');
    });
  });

  describe('Snapshots', () => {
    it('matches snapshot with basic configuration', () => {
      snapshotHelpers.createComponentSnapshot(WorkspaceSelector, {
        workspaces: mockWorkspaces.slice(0, 3),
        placeholder: 'Select workspace',
      });
    });

    it('matches snapshot with selected workspace', () => {
      snapshotHelpers.createComponentSnapshot(WorkspaceSelector, {
        workspaces: mockWorkspaces.slice(0, 3),
        selectedWorkspace: mockWorkspaces[0],
        showRecent: true,
        searchable: true,
      });
    });
  });
});