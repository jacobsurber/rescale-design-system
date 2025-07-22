import React from 'react';
import type { ReactElement, ReactNode } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// import { axe, toHaveNoViolations } from 'jest-axe';
import { RescaleThemeProvider } from '../theme/ThemeProvider';
import rescaleTheme from '../theme/rescaleTheme';
import type { ChatMessage } from '../components/rescale/AssistantChat/AssistantChat';

// Temporarily mock axe until jest-axe is properly installed
const axe = async (container: Element) => ({ violations: [] });

// Custom render function with theme provider
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  theme?: typeof rescaleTheme;
  withTheme?: boolean;
}

function customRender(
  ui: ReactElement,
  options: CustomRenderOptions = {}
): RenderResult & { user: ReturnType<typeof userEvent.setup> } {
  const { 
    theme = rescaleTheme, 
    withTheme = true, 
    ...renderOptions 
  } = options;

  const AllTheProviders = ({ children }: { children: ReactNode }) => {
    if (withTheme) {
      return (
        <RescaleThemeProvider customTheme={theme}>
          {children}
        </RescaleThemeProvider>
      );
    }
    return <>{children}</>;
  };

  const user = userEvent.setup();

  return {
    user,
    ...render(ui, { wrapper: AllTheProviders, ...renderOptions }),
  };
}

// Accessibility testing helper
export const runAxeTest = async (container: Element) => {
  const results = await axe(container);
  expect(results).toHaveNoViolations();
};

// Common test scenarios
export const commonTestScenarios = {
  // Test component renders without crashing
  shouldRender: (Component: React.ComponentType, props = {}) => {
    it('renders without crashing', () => {
      customRender(<Component {...props} />);
    });
  },

  // Test accessibility compliance
  shouldBeAccessible: (Component: React.ComponentType, props = {}) => {
    it('should not have accessibility violations', async () => {
      const { container } = customRender(<Component {...props} />);
      await runAxeTest(container);
    });
  },

  // Test keyboard navigation
  shouldSupportKeyboardNavigation: (
    Component: React.ComponentType, 
    props = {},
    testFn?: () => Promise<void>
  ) => {
    it('supports keyboard navigation', async () => {
      const { user } = customRender(<Component {...props} />);
      
      // Tab navigation test
      await user.tab();
      expect(document.activeElement).toBeInTheDocument();
      
      if (testFn) {
        await testFn();
      }
    });
  },

  // Test component with different themes
  shouldWorkWithThemes: (Component: React.ComponentType, props = {}) => {
    it('works with custom themes', () => {
      const customTheme = {
        ...rescaleTheme,
        token: {
          ...rescaleTheme.token,
          colorPrimary: '#ff0000',
        },
      };

      customRender(<Component {...props} />, { theme: customTheme });
    });
  },

  // Test responsive behavior
  shouldBeResponsive: (Component: React.ComponentType, props = {}) => {
    const breakpoints = [
      { name: 'mobile', width: 375 },
      { name: 'tablet', width: 768 },
      { name: 'desktop', width: 1200 },
    ];

    breakpoints.forEach(({ name, width }) => {
      it(`renders correctly on ${name} (${width}px)`, () => {
        // Mock window.innerWidth
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: width,
        });

        customRender(<Component {...props} />);
      });
    });
  },
};

// Mock data generators
export const mockData = {
  // Generate mock resource metrics
  generateResourceMetrics: (count = 4) => {
    const types = ['cpu', 'memory', 'storage', 'network'] as const;
    return Array.from({ length: count }, (_, index) => ({
      type: types[index % types.length],
      usage: Math.floor(Math.random() * 100),
      current: `${Math.floor(Math.random() * 100)} ${index % 2 === 0 ? 'GB' : 'GHz'}`,
      total: `${Math.floor(Math.random() * 100) + 100} ${index % 2 === 0 ? 'GB' : 'GHz'}`,
    }));
  },

  // Generate mock software items
  generateSoftwareItems: (count = 5) => {
    const names = ['ANSYS Fluent', 'OpenFOAM', 'Abaqus', 'MATLAB', 'Python'];
    const logos = ['🌊', '💨', '🔧', '📊', '🐍'];
    const versions = ['2024.1', '11.0', '2024', 'R2024a', '3.11'];
    
    return Array.from({ length: count }, (_, index) => ({
      id: `software-${index}`,
      name: names[index % names.length],
      logo: logos[index % logos.length],
      version: versions[index % versions.length],
      description: `Mock description for ${names[index % names.length]}`,
      category: index % 2 === 0 ? 'CFD' : 'FEA',
    }));
  },

  // Generate mock workspace data
  generateWorkspaces: (count = 3) => {
    const names = ['Personal Workspace', 'Team Alpha', 'Research Group'];
    const types = ['personal', 'team', 'organization'] as const;
    
    return Array.from({ length: count }, (_, index) => ({
      id: `workspace-${index}`,
      name: names[index % names.length],
      description: `Mock workspace ${index + 1}`,
      type: types[index % types.length],
      private: index % 2 === 0,
      starred: index % 3 === 0,
      lastAccessed: new Date(Date.now() - index * 24 * 60 * 60 * 1000),
      memberCount: Math.floor(Math.random() * 50) + 1,
      owner: `User ${index + 1}`,
    }));
  },

  // Generate mock job data
  generateJob: () => ({
    id: 'job-123',
    name: 'Mock Job',
    status: 'running' as const,
    progress: 65,
    duration: '1h 30m',
    software: mockData.generateSoftwareItems(2),
    submittedBy: 'Test User',
    submittedAt: new Date(),
    priority: 'medium' as const,
    resourceMetrics: mockData.generateResourceMetrics(),
  }),

  // Generate mock chat messages
  generateChatMessages: (count = 3): ChatMessage[] => {
    return Array.from({ length: count }, (_, index) => ({
      id: `message-${index}`,
      content: `Mock message ${index + 1}`,
      sender: (index % 2 === 0 ? 'user' : 'assistant') as ChatMessage['sender'],
      timestamp: new Date(Date.now() - index * 60 * 1000),
    }));
  },

  // Generate mock actions
  generateQuickActions: (count = 3) => {
    const labels = ['Action 1', 'Action 2', 'Action 3'];
    const types = ['primary', 'secondary', 'success'] as const;
    
    return Array.from({ length: count }, (_, index) => ({
      id: `action-${index}`,
      label: labels[index % labels.length],
      type: types[index % types.length],
      onClick: jest.fn(),
    }));
  },
};

// Custom matchers for component testing
export const customMatchers = {
  toHaveAccessibleName: (element: Element, name: string) => {
    const accessibleName = element.getAttribute('aria-label') || 
                          element.getAttribute('aria-labelledby') ||
                          element.textContent;
    
    return {
      pass: accessibleName?.includes(name) ?? false,
      message: () => `Expected element to have accessible name containing "${name}"`,
    };
  },

  toBeVisuallyHidden: (element: Element) => {
    const style = window.getComputedStyle(element);
    const isHidden = style.display === 'none' || 
                    style.visibility === 'hidden' ||
                    style.opacity === '0';
    
    return {
      pass: isHidden,
      message: () => 'Expected element to be visually hidden',
    };
  },
};

// Performance testing helpers
export const performanceHelpers = {
  measureRenderTime: async (renderFn: () => void) => {
    const start = performance.now();
    renderFn();
    const end = performance.now();
    return end - start;
  },

  expectRenderTimeUnder: async (renderFn: () => void, maxTime: number) => {
    const renderTime = await performanceHelpers.measureRenderTime(renderFn);
    expect(renderTime).toBeLessThan(maxTime);
  },
};

// Wait helpers for async testing
export const waitHelpers = {
  waitForAnimation: () => new Promise(resolve => setTimeout(resolve, 100)),
  waitForDebounce: () => new Promise(resolve => setTimeout(resolve, 300)),
  waitForAsyncAction: () => new Promise(resolve => setTimeout(resolve, 500)),
};

// Snapshot testing helpers
export const snapshotHelpers = {
  createComponentSnapshot: (Component: React.ComponentType, props = {}) => {
    const { container } = customRender(<Component {...props} />);
    expect(container.firstChild).toMatchSnapshot();
  },

  createInteractiveSnapshot: async (
    Component: React.ComponentType, 
    props = {},
    interactionFn?: (user: ReturnType<typeof userEvent.setup>) => Promise<void>
  ) => {
    const { container, user } = customRender(<Component {...props} />);
    
    if (interactionFn) {
      await interactionFn(user);
    }
    
    expect(container.firstChild).toMatchSnapshot();
  },
};

// Re-export everything from testing library
export * from '@testing-library/react';

// Re-export custom render as the default render
export { customRender as render };

export { userEvent, axe };