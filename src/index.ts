// =============================================================================
// Rescale Design System - Main Export File
// =============================================================================

// Theme and Configuration
export { ThemeProvider } from './theme/ThemeProvider';
export { rescaleTheme } from './theme/rescaleTheme';
export * from './theme/tokens';
export type { RescaleTheme } from './theme/rescaleTheme';

// Atoms
export * from './components/atoms';

// Molecules  
export * from './components/molecules';

// Organisms
export * from './components/organisms';

// Navigation Components
export * from './components/navigation';

// Layout Components
export * from './components/layout';

// Form Components
export * from './components/forms';

// Display Components
export * from './components/display';

// Card Components
export * from './components/cards';

// Template Components
export * from './components/templates';

// Rescale-specific Components
export * from './components/rescale/JobStatusIndicator';
export * from './components/rescale/SoftwareLogoGrid';
export * from './components/rescale/ResourceMetrics';
export * from './components/rescale/WorkspaceSelector';
export * from './components/rescale/QuickActions';
export * from './components/rescale/AssistantChat';

// Utilities
export * from './utils';

// Hooks
export * from './hooks';

// Styles and Breakpoints
export * from './styles/breakpoints';

// Types
export * from './types';

// CSS Variables (to be imported in consuming applications)
import './theme/cssVariables.css';
import './index.css';