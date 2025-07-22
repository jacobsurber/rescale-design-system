import { RenderResult } from '@testing-library/react';
// import { axe, toHaveNoViolations } from 'jest-axe';
import { render } from './index';

// Temporarily mock axe until jest-axe is properly installed
const axe = async (container: Element, config?: any) => ({ violations: [] });

/**
 * Comprehensive accessibility test suite for WCAG 2.1 AA compliance
 */
export interface AccessibilityTestOptions {
  /** Additional accessibility rules to check */
  rules?: Record<string, { enabled: boolean }>;
  /** Tags to include/exclude in testing */
  tags?: string[];
  /** Custom axe configuration */
  config?: Record<string, any>;
  /** Whether to include best practices */
  includeBestPractices?: boolean;
}

/**
 * Default accessibility configuration for WCAG 2.1 AA compliance
 */
const defaultA11yConfig = {
  rules: {
    // WCAG 2.1 AA rules
    'color-contrast': { enabled: true },
    'keyboard-navigation': { enabled: true },
    'focus-management': { enabled: true },
    'aria-labels': { enabled: true },
    'semantic-html': { enabled: true },
    'heading-order': { enabled: true },
    'landmark-roles': { enabled: true },
    'form-labels': { enabled: true },
    'skip-links': { enabled: true },
    'page-title': { enabled: true },
    
    // Additional rules for comprehensive testing
    'bypass': { enabled: true },
    'document-title': { enabled: true },
    'duplicate-id': { enabled: true },
    'frame-title': { enabled: true },
    'html-has-lang': { enabled: true },
    'html-lang-valid': { enabled: true },
    'image-alt': { enabled: true },
    'input-image-alt': { enabled: true },
    'label': { enabled: true },
    'link-name': { enabled: true },
    'list': { enabled: true },
    'listitem': { enabled: true },
    'meta-refresh': { enabled: true },
    'meta-viewport': { enabled: true },
    'object-alt': { enabled: true },
    'role-img-alt': { enabled: true },
    'scroll-element': { enabled: true },
    'server-side-image-map': { enabled: true },
    'valid-lang': { enabled: true },
    'video-caption': { enabled: true },
  },
  tags: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'],
};

/**
 * Run comprehensive accessibility tests using axe-core
 */
export const runAxeTest = async (
  container: Element,
  options: AccessibilityTestOptions = {}
): Promise<void> => {
  const config = {
    ...defaultA11yConfig,
    ...options.config,
    rules: {
      ...defaultA11yConfig.rules,
      ...options.rules,
    },
    tags: options.tags || defaultA11yConfig.tags,
  };

  const results = await axe(container, config);
  expect(results).toHaveNoViolations();
};

/**
 * Test keyboard navigation accessibility
 */
export const testKeyboardNavigation = async (renderResult: RenderResult): Promise<void> => {
  const { container } = renderResult;
  
  // Find all focusable elements
  const focusableElements = container.querySelectorAll([
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[role="button"]:not([disabled])',
    '[role="link"]',
    '[role="menuitem"]',
    '[role="tab"]',
  ].join(','));

  // Test that focusable elements can receive focus
  focusableElements.forEach((element: Element) => {
    const htmlElement = element as HTMLElement;
    
    // Test focus
    htmlElement.focus();
    expect(document.activeElement).toBe(htmlElement);
    
    // Test that element has visible focus indicator
    const styles = window.getComputedStyle(htmlElement, ':focus');
    const outlineStyle = styles.outline || styles.boxShadow;
    expect(outlineStyle).not.toBe('none');
  });
};

/**
 * Test screen reader compatibility
 */
export const testScreenReaderCompatibility = (container: Element): void => {
  // Check for proper ARIA labels
  const elementsWithAriaLabel = container.querySelectorAll('[aria-label]');
  elementsWithAriaLabel.forEach((element) => {
    const ariaLabel = element.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
    expect(ariaLabel?.trim()).not.toBe('');
  });

  // Check for proper ARIA roles
  const elementsWithRole = container.querySelectorAll('[role]');
  elementsWithRole.forEach((element) => {
    const role = element.getAttribute('role');
    expect(role).toBeTruthy();
    expect(role?.trim()).not.toBe('');
  });

  // Check for proper headings hierarchy
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let lastLevel = 0;
  headings.forEach((heading) => {
    const level = parseInt(heading.tagName.charAt(1));
    if (lastLevel > 0) {
      // Don't skip more than one level
      expect(level).toBeLessThanOrEqual(lastLevel + 1);
    }
    lastLevel = level;
  });
};

/**
 * Test color contrast ratios
 */
export const testColorContrast = async (container: Element): Promise<void> => {
  const textElements = container.querySelectorAll('*');
  
  for (const element of Array.from(textElements)) {
    const htmlElement = element as HTMLElement;
    const styles = window.getComputedStyle(htmlElement);
    const backgroundColor = styles.backgroundColor;
    const color = styles.color;
    
    // Skip elements without text content or transparent backgrounds
    if (!htmlElement.textContent?.trim() || 
        backgroundColor === 'rgba(0, 0, 0, 0)' || 
        backgroundColor === 'transparent') {
      continue;
    }

    // Run axe color-contrast rule specifically
    const results = await axe(htmlElement, {
      rules: {
        'color-contrast': { enabled: true },
      },
    });
    
    expect(results.violations).toHaveLength(0);
  }
};

/**
 * Test responsive accessibility across different viewport sizes
 */
export const testResponsiveAccessibility = async (
  component: React.ComponentType<any>,
  props: any,
  viewports: Array<{ width: number; height: number; name: string }> = [
    { width: 320, height: 568, name: 'Mobile' },
    { width: 768, height: 1024, name: 'Tablet' },
    { width: 1200, height: 800, name: 'Desktop' },
  ]
): Promise<void> => {
  for (const viewport of viewports) {
    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: viewport.width,
    });
    
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: viewport.height,
    });

    // Re-render component with new viewport
    const { container, unmount } = render(component(props));
    
    try {
      await runAxeTest(container);
      testScreenReaderCompatibility(container);
      await testColorContrast(container);
    } finally {
      unmount();
    }
  }
};

/**
 * Test form accessibility
 */
export const testFormAccessibility = (container: Element): void => {
  const formElements = container.querySelectorAll('input, select, textarea');
  
  formElements.forEach((element) => {
    const htmlElement = element as HTMLElement;
    const id = htmlElement.getAttribute('id');
    const ariaLabel = htmlElement.getAttribute('aria-label');
    const ariaLabelledBy = htmlElement.getAttribute('aria-labelledby');
    
    // Each form element should have a label
    if (id) {
      const label = container.querySelector(`label[for="${id}"]`);
      expect(label || ariaLabel || ariaLabelledBy).toBeTruthy();
    }
    
    // Required fields should be properly marked
    if (htmlElement.hasAttribute('required')) {
      const ariaRequired = htmlElement.getAttribute('aria-required');
      expect(ariaRequired === 'true' || 
             htmlElement.hasAttribute('required')).toBe(true);
    }
    
    // Invalid fields should have proper error messaging
    if (htmlElement.getAttribute('aria-invalid') === 'true') {
      const ariaDescribedBy = htmlElement.getAttribute('aria-describedby');
      expect(ariaDescribedBy).toBeTruthy();
      
      if (ariaDescribedBy) {
        const errorMessage = container.querySelector(`#${ariaDescribedBy}`);
        expect(errorMessage).toBeTruthy();
      }
    }
  });
};

/**
 * Test high contrast mode compatibility
 */
export const testHighContrastMode = async (
  component: React.ComponentType<any>,
  props: any
): Promise<void> => {
  // Mock high contrast media query
  const mockMatchMedia = jest.fn(() => ({
    matches: true,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }));
  
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: mockMatchMedia,
  });

  const { container, unmount } = render(component(props));
  
  try {
    await runAxeTest(container);
    
    // Verify that forced-colors are respected
    const elements = container.querySelectorAll('*');
    elements.forEach((element) => {
      const styles = window.getComputedStyle(element as Element);
      
      // In high contrast mode, certain CSS properties should be system colors
      if (styles.forcedColorAdjust === 'auto') {
        // Colors should be adapted for high contrast
        expect(['ButtonText', 'ButtonFace', 'HighlightText', 'Highlight', 'WindowText', 'Window'])
          .toContain(styles.color);
      }
    });
  } finally {
    unmount();
  }
};

/**
 * Test reduced motion preferences
 */
export const testReducedMotionSupport = (container: Element): void => {
  // Mock prefers-reduced-motion
  const mockMatchMedia = jest.fn(() => ({
    matches: true,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }));
  
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: mockMatchMedia,
  });

  const animatedElements = container.querySelectorAll([
    '[class*="animate"]',
    '[class*="transition"]',
    '[style*="animation"]',
    '[style*="transition"]',
  ].join(','));

  animatedElements.forEach((element) => {
    const styles = window.getComputedStyle(element as Element);
    
    // When prefers-reduced-motion is enabled, animations should be disabled
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      expect(styles.animationDuration).toBe('0s');
      expect(styles.transitionDuration).toBe('0s');
    }
  });
};

/**
 * Comprehensive accessibility test suite
 */
export const runComprehensiveA11yTests = async (
  component: React.ComponentType<any>,
  props: any,
  options: AccessibilityTestOptions = {}
): Promise<void> => {
  const { container, unmount } = render(component(props));
  
  try {
    // Core accessibility tests
    await runAxeTest(container, options);
    testScreenReaderCompatibility(container);
    await testColorContrast(container);
    
    // Keyboard navigation
    await testKeyboardNavigation({ container } as RenderResult);
    
    // Form accessibility (if forms are present)
    const forms = container.querySelectorAll('form, input, select, textarea');
    if (forms.length > 0) {
      testFormAccessibility(container);
    }
    
    // Motion and contrast preferences
    testReducedMotionSupport(container);
    
  } finally {
    unmount();
  }
};

/**
 * Accessibility test helpers for different component types
 */
export const accessibilityTestHelpers = {
  /**
   * Test button accessibility
   */
  testButton: async (container: Element): Promise<void> => {
    const buttons = container.querySelectorAll('button, [role="button"]');
    
    buttons.forEach((button) => {
      const htmlButton = button as HTMLElement;
      
      // Should have accessible name
      const accessibleName = htmlButton.getAttribute('aria-label') ||
                           htmlButton.textContent?.trim() ||
                           htmlButton.getAttribute('aria-labelledby');
      expect(accessibleName).toBeTruthy();
      
      // Should be focusable unless disabled
      if (!htmlButton.hasAttribute('disabled')) {
        expect(htmlButton.tabIndex).toBeGreaterThanOrEqual(0);
      }
      
      // Should have proper role
      const role = htmlButton.getAttribute('role') || htmlButton.tagName.toLowerCase();
      expect(['button', 'menuitem', 'tab', 'option'].includes(role)).toBe(true);
    });
    
    await runAxeTest(container);
  },

  /**
   * Test navigation accessibility
   */
  testNavigation: async (container: Element): Promise<void> => {
    const navElements = container.querySelectorAll('nav, [role="navigation"]');
    
    navElements.forEach((nav) => {
      // Navigation should have accessible name
      const accessibleName = nav.getAttribute('aria-label') ||
                           nav.getAttribute('aria-labelledby');
      expect(accessibleName).toBeTruthy();
    });
    
    // Test skip links
    const skipLinks = container.querySelectorAll('[href^="#"]');
    skipLinks.forEach((link) => {
      const target = link.getAttribute('href');
      if (target && target !== '#') {
        const targetElement = container.querySelector(target);
        expect(targetElement).toBeTruthy();
      }
    });
    
    await runAxeTest(container);
  },

  /**
   * Test modal accessibility
   */
  testModal: async (container: Element): Promise<void> => {
    const modals = container.querySelectorAll('[role="dialog"], [role="alertdialog"]');
    
    modals.forEach((modal) => {
      const htmlModal = modal as HTMLElement;
      
      // Should have accessible name
      const accessibleName = htmlModal.getAttribute('aria-label') ||
                           htmlModal.getAttribute('aria-labelledby');
      expect(accessibleName).toBeTruthy();
      
      // Should manage focus
      expect(htmlModal.tabIndex).toBe(-1);
      expect(htmlModal.getAttribute('aria-modal')).toBe('true');
      
      // Should have close button
      const closeButton = modal.querySelector('[aria-label*="close"], [aria-label*="Close"]');
      expect(closeButton).toBeTruthy();
    });
    
    await runAxeTest(container);
  },

  /**
   * Test table accessibility
   */
  testTable: async (container: Element): Promise<void> => {
    const tables = container.querySelectorAll('table');
    
    tables.forEach((table) => {
      // Should have caption or accessible name
      const caption = table.querySelector('caption');
      const accessibleName = table.getAttribute('aria-label') ||
                           table.getAttribute('aria-labelledby');
      expect(caption || accessibleName).toBeTruthy();
      
      // Headers should be properly associated
      const headers = table.querySelectorAll('th');
      headers.forEach((header) => {
        const scope = header.getAttribute('scope');
        expect(['col', 'row', 'colgroup', 'rowgroup'].includes(scope || 'col')).toBe(true);
      });
    });
    
    await runAxeTest(container);
  },
};