import { screen, fireEvent } from '@testing-library/react';
import { SoftwareLogoGrid } from './SoftwareLogoGrid';
import { 
  render, 
  commonTestScenarios, 
  runAxeTest,
  mockData,
  snapshotHelpers,
} from '../../../test-utils';

describe('SoftwareLogoGrid', () => {
  const mockSoftware = mockData.generateSoftwareItems(8);
  const defaultProps = {
    items: mockSoftware,
    maxVisible: 6,
  };

  // Common test scenarios
  commonTestScenarios.shouldRender(SoftwareLogoGrid, defaultProps);
  commonTestScenarios.shouldBeAccessible(SoftwareLogoGrid, defaultProps);
  commonTestScenarios.shouldWorkWithThemes(SoftwareLogoGrid, defaultProps);
  commonTestScenarios.shouldBeResponsive(SoftwareLogoGrid, defaultProps);

  describe('Item Display', () => {
    it('displays all items when count is below maxVisible', () => {
      const items = mockData.generateSoftwareItems(3);
      render(<SoftwareLogoGrid items={items} maxVisible={6} />);
      
      items.forEach(item => {
        expect(screen.getByText(item.name.charAt(0).toUpperCase())).toBeInTheDocument();
      });
    });

    it('displays maxVisible items plus "+X More" button when items exceed limit', () => {
      render(<SoftwareLogoGrid items={mockSoftware} maxVisible={4} />);
      
      // Should show 4 visible items
      const visibleItems = screen.getAllByRole('button');
      expect(visibleItems).toHaveLength(5); // 4 items + 1 "+X More" button
      
      // Should show "+4 More" button
      expect(screen.getByText('4')).toBeInTheDocument();
    });

    it('shows software names when showNames is true', () => {
      const items = mockData.generateSoftwareItems(3);
      render(<SoftwareLogoGrid items={items} showNames />);
      
      items.forEach(item => {
        expect(screen.getByText(item.name)).toBeInTheDocument();
      });
    });

    it('hides software names when showNames is false', () => {
      const items = mockData.generateSoftwareItems(3);
      render(<SoftwareLogoGrid items={items} showNames={false} />);
      
      items.forEach(item => {
        expect(screen.queryByText(item.name)).not.toBeInTheDocument();
      });
    });
  });

  describe('Size Variants', () => {
    it('renders small size correctly', () => {
      const { container } = render(
        <SoftwareLogoGrid items={mockSoftware} size="small" />
      );
      
      const logoElements = container.querySelectorAll('.ant-avatar');
      logoElements.forEach(logo => {
        expect(logo).toHaveStyle({ width: '32px', height: '32px' });
      });
    });

    it('renders default size correctly', () => {
      const { container } = render(
        <SoftwareLogoGrid items={mockSoftware} size="default" />
      );
      
      const logoElements = container.querySelectorAll('.ant-avatar');
      logoElements.forEach(logo => {
        expect(logo).toHaveStyle({ width: '40px', height: '40px' });
      });
    });

    it('renders large size correctly', () => {
      const { container } = render(
        <SoftwareLogoGrid items={mockSoftware} size="large" />
      );
      
      const logoElements = container.querySelectorAll('.ant-avatar');
      logoElements.forEach(logo => {
        expect(logo).toHaveStyle({ width: '56px', height: '56px' });
      });
    });
  });

  describe('Interaction', () => {
    it('calls onItemClick when item is clicked and clickable is true', async () => {
      const onItemClick = jest.fn();
      const items = mockData.generateSoftwareItems(3);
      
      const { user } = render(
        <SoftwareLogoGrid 
          items={items} 
          clickable 
          onItemClick={onItemClick} 
        />
      );
      
      const firstItem = screen.getAllByRole('button')[0];
      await user.click(firstItem);
      
      expect(onItemClick).toHaveBeenCalledWith(items[0]);
    });

    it('does not call onItemClick when clickable is false', async () => {
      const onItemClick = jest.fn();
      const items = mockData.generateSoftwareItems(3);
      
      const { user } = render(
        <SoftwareLogoGrid 
          items={items} 
          clickable={false} 
          onItemClick={onItemClick} 
        />
      );
      
      const itemElements = screen.getAllByRole('button');
      if (itemElements.length > 0) {
        await user.click(itemElements[0]);
        expect(onItemClick).not.toHaveBeenCalled();
      }
    });

    it('shows popover when "+X More" button is clicked', async () => {
      const { user } = render(
        <SoftwareLogoGrid items={mockSoftware} maxVisible={4} />
      );
      
      const moreButton = screen.getByRole('button', { name: /\+\d+ More/ });
      await user.click(moreButton);
      
      // Check if popover content appears
      expect(screen.getByText(/\+\d+ More Software/)).toBeInTheDocument();
    });

    it('calls onShowMore when provided instead of showing popover', async () => {
      const onShowMore = jest.fn();
      const { user } = render(
        <SoftwareLogoGrid 
          items={mockSoftware} 
          maxVisible={4} 
          onShowMore={onShowMore} 
        />
      );
      
      const moreButton = screen.getByRole('button', { name: /\+\d+ More/ });
      await user.click(moreButton);
      
      expect(onShowMore).toHaveBeenCalled();
    });
  });

  describe('Tooltips', () => {
    it('shows tooltip with software details on hover when clickable', async () => {
      const items = mockData.generateSoftwareItems(1);
      items[0].description = 'Test description';
      items[0].version = '1.0.0';
      
      const { user } = render(
        <SoftwareLogoGrid items={items} clickable />
      );
      
      const itemButton = screen.getByRole('button');
      await user.hover(itemButton);
      
      // Tooltip should appear with software details
      expect(screen.getByText(items[0].name)).toBeInTheDocument();
      expect(screen.getByText('Version 1.0.0')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
    });

    it('does not show tooltip when item has no additional details', async () => {
      const items = [
        {
          id: 'test',
          name: 'Test Software',
          logo: '🧪',
        }
      ];
      
      const { user } = render(
        <SoftwareLogoGrid items={items} clickable />
      );
      
      const itemButton = screen.getByRole('button');
      await user.hover(itemButton);
      
      // Only the logo/name should be visible, no tooltip
      expect(screen.queryByText('Version')).not.toBeInTheDocument();
    });
  });

  describe('Logo Types', () => {
    it('renders string logos correctly', () => {
      const items = [
        {
          id: 'test',
          name: 'Test',
          logo: 'https://example.com/logo.png',
        }
      ];
      
      const { container } = render(<SoftwareLogoGrid items={items} />);
      
      const img = container.querySelector('img');
      expect(img).toHaveAttribute('src', 'https://example.com/logo.png');
    });

    it('renders React node logos correctly', () => {
      const items = [
        {
          id: 'test',
          name: 'Test',
          logo: <span data-testid="custom-logo">Custom</span>,
        }
      ];
      
      render(<SoftwareLogoGrid items={items} />);
      
      expect(screen.getByTestId('custom-logo')).toBeInTheDocument();
    });

    it('renders fallback when no logo provided', () => {
      const items = [
        {
          id: 'test',
          name: 'Test Software',
        }
      ];
      
      render(<SoftwareLogoGrid items={items} />);
      
      expect(screen.getByText('T')).toBeInTheDocument();
    });
  });

  describe('Popover Content', () => {
    it('displays all remaining items in popover grid', async () => {
      const items = mockData.generateSoftwareItems(8);
      const { user } = render(
        <SoftwareLogoGrid items={items} maxVisible={4} />
      );
      
      const moreButton = screen.getByRole('button', { name: /\+4/ });
      await user.click(moreButton);
      
      // Should show the 4 remaining items in popover
      const popoverItems = screen.getAllByTestId(/popover-item-/);
      expect(popoverItems).toHaveLength(4);
    });

    it('calls onItemClick when popover item is clicked', async () => {
      const onItemClick = jest.fn();
      const items = mockData.generateSoftwareItems(6);
      const { user } = render(
        <SoftwareLogoGrid 
          items={items} 
          maxVisible={4} 
          onItemClick={onItemClick}
          clickable
        />
      );
      
      const moreButton = screen.getByRole('button', { name: /\+2/ });
      await user.click(moreButton);
      
      const popoverItems = screen.getAllByTestId(/popover-item-/);
      await user.click(popoverItems[0]);
      
      expect(onItemClick).toHaveBeenCalledWith(items[4]); // First item in overflow
    });
  });

  describe('Empty State', () => {
    it('renders empty grid when no items provided', () => {
      const { container } = render(<SoftwareLogoGrid items={[]} />);
      
      expect(container.firstChild).toBeEmptyDOMElement();
    });

    it('does not show "+X More" button when no overflow items', () => {
      const items = mockData.generateSoftwareItems(3);
      render(<SoftwareLogoGrid items={items} maxVisible={6} />);
      
      expect(screen.queryByText(/\+\d+/)).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for interactive items', async () => {
      const items = mockData.generateSoftwareItems(3);
      const { container } = render(
        <SoftwareLogoGrid items={items} clickable />
      );
      
      await runAxeTest(container);
    });

    it('supports keyboard navigation', async () => {
      const onItemClick = jest.fn();
      const items = mockData.generateSoftwareItems(3);
      
      const { user } = render(
        <SoftwareLogoGrid 
          items={items} 
          clickable 
          onItemClick={onItemClick} 
        />
      );
      
      // Tab to first item
      await user.tab();
      expect(screen.getAllByRole('button')[0]).toHaveFocus();
      
      // Enter should trigger click
      await user.keyboard('{Enter}');
      expect(onItemClick).toHaveBeenCalledWith(items[0]);
    });

    it('has proper role and labels for "+X More" button', () => {
      render(<SoftwareLogoGrid items={mockSoftware} maxVisible={4} />);
      
      const moreButton = screen.getByRole('button', { name: /\+4/ });
      expect(moreButton).toBeInTheDocument();
      expect(moreButton).toHaveAttribute('aria-label', expect.stringContaining('Show more'));
    });
  });

  describe('Snapshots', () => {
    it('matches snapshot with few items', () => {
      const items = mockData.generateSoftwareItems(3);
      snapshotHelpers.createComponentSnapshot(SoftwareLogoGrid, {
        items,
        maxVisible: 6,
        showNames: true,
      });
    });

    it('matches snapshot with overflow', () => {
      snapshotHelpers.createComponentSnapshot(SoftwareLogoGrid, {
        items: mockSoftware,
        maxVisible: 4,
        showNames: false,
      });
    });

    it('matches snapshot in different sizes', () => {
      const items = mockData.generateSoftwareItems(4);
      
      ['small', 'default', 'large'].forEach(size => {
        snapshotHelpers.createComponentSnapshot(SoftwareLogoGrid, {
          items,
          size: size as 'small' | 'default' | 'large',
          showNames: true,
        });
      });
    });
  });
});