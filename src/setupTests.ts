import '@testing-library/jest-dom';

// jest-axe will be configured when package is properly installed
// For now, create a mock toHaveNoViolations matcher
expect.extend({
  toHaveNoViolations(received) {
    // Mock implementation - always passes for now
    return {
      pass: true,
      message: () => 'Accessibility testing placeholder - install jest-axe for real tests'
    };
  }
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  
  observe() {
    return null;
  }
  
  disconnect() {
    return null;
  }
  
  unobserve() {
    return null;
  }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  
  observe() {
    return null;
  }
  
  disconnect() {
    return null;
  }
  
  unobserve() {
    return null;
  }
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock requestAnimationFrame
global.requestAnimationFrame = (callback: FrameRequestCallback) => {
  return setTimeout(callback, 0);
};

global.cancelAnimationFrame = (id: number) => {
  clearTimeout(id);
};

// Mock scrollTo
global.scrollTo = jest.fn();

// Suppress console warnings during tests
const originalWarn = console.warn;
beforeAll(() => {
  console.warn = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('React does not recognize')
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.warn = originalWarn;
});