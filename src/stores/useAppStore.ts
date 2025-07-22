// =============================================================================
// App Store - Global application state management with Zustand
// =============================================================================

import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// =============================================================================
// Types
// =============================================================================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: 'admin' | 'user' | 'viewer';
  workspaces: string[];
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh';
  timezone: string;
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12h' | '24h';
  notifications: {
    jobCompletion: boolean;
    jobFailure: boolean;
    systemMaintenance: boolean;
    email: boolean;
    inApp: boolean;
  };
}

export interface ViewState {
  sidebarCollapsed: boolean;
  activeWorkspaceId: string | null;
  currentPage: string;
  breadcrumbs: Array<{ key: string; label: string; href?: string }>;
}

export interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  
  // Application settings
  settings: AppSettings;
  
  // UI state
  view: ViewState;
  
  // Loading states
  loading: {
    auth: boolean;
    workspace: boolean;
    global: boolean;
  };
  
  // Error state
  error: string | null;
}

export interface AppActions {
  // Authentication actions
  setUser: (user: User | null) => void;
  logout: () => void;
  
  // Settings actions
  updateSettings: (settings: Partial<AppSettings>) => void;
  resetSettings: () => void;
  
  // UI actions
  setSidebarCollapsed: (collapsed: boolean) => void;
  setActiveWorkspace: (workspaceId: string | null) => void;
  setCurrentPage: (page: string) => void;
  setBreadcrumbs: (breadcrumbs: Array<{ key: string; label: string; href?: string }>) => void;
  
  // Loading actions
  setLoading: (key: keyof AppState['loading'], value: boolean) => void;
  
  // Error actions
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Utility actions
  reset: () => void;
}

// =============================================================================
// Default State
// =============================================================================

const defaultSettings: AppSettings = {
  theme: 'light',
  language: 'en',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  notifications: {
    jobCompletion: true,
    jobFailure: true,
    systemMaintenance: true,
    email: true,
    inApp: true,
  },
};

const defaultViewState: ViewState = {
  sidebarCollapsed: false,
  activeWorkspaceId: null,
  currentPage: 'dashboard',
  breadcrumbs: [{ key: 'dashboard', label: 'Dashboard' }],
};

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  settings: defaultSettings,
  view: defaultViewState,
  loading: {
    auth: false,
    workspace: false,
    global: false,
  },
  error: null,
};

// =============================================================================
// Store Implementation
// =============================================================================

export const useAppStore = create<AppState & AppActions>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set, get) => ({
          ...initialState,
          
          // Authentication actions
          setUser: (user) =>
            set((state) => {
              state.user = user;
              state.isAuthenticated = !!user;
              if (user && user.workspaces.length > 0 && !state.view.activeWorkspaceId) {
                state.view.activeWorkspaceId = user.workspaces[0];
              }
            }),
          
          logout: () =>
            set((state) => {
              state.user = null;
              state.isAuthenticated = false;
              state.view.activeWorkspaceId = null;
              state.error = null;
            }),
          
          // Settings actions
          updateSettings: (newSettings) =>
            set((state) => {
              Object.assign(state.settings, newSettings);
            }),
          
          resetSettings: () =>
            set((state) => {
              state.settings = defaultSettings;
            }),
          
          // UI actions
          setSidebarCollapsed: (collapsed) =>
            set((state) => {
              state.view.sidebarCollapsed = collapsed;
            }),
          
          setActiveWorkspace: (workspaceId) =>
            set((state) => {
              state.view.activeWorkspaceId = workspaceId;
            }),
          
          setCurrentPage: (page) =>
            set((state) => {
              state.view.currentPage = page;
            }),
          
          setBreadcrumbs: (breadcrumbs) =>
            set((state) => {
              state.view.breadcrumbs = breadcrumbs;
            }),
          
          // Loading actions
          setLoading: (key, value) =>
            set((state) => {
              state.loading[key] = value;
            }),
          
          // Error actions
          setError: (error) =>
            set((state) => {
              state.error = error;
            }),
          
          clearError: () =>
            set((state) => {
              state.error = null;
            }),
          
          // Utility actions
          reset: () =>
            set((state) => {
              Object.assign(state, initialState);
            }),
        }))
      ),
      {
        name: 'rescale-app-store',
        partialize: (state) => ({
          settings: state.settings,
          view: {
            sidebarCollapsed: state.view.sidebarCollapsed,
            activeWorkspaceId: state.view.activeWorkspaceId,
          },
        }),
        version: 1,
      }
    ),
    {
      name: 'AppStore',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

// =============================================================================
// Selectors
// =============================================================================

// User selectors
export const useUser = () => useAppStore((state) => state.user);
export const useIsAuthenticated = () => useAppStore((state) => state.isAuthenticated);

// Settings selectors
export const useAppSettings = () => useAppStore((state) => state.settings);
export const useTheme = () => useAppStore((state) => state.settings.theme);
export const useNotificationSettings = () => useAppStore((state) => state.settings.notifications);

// UI selectors
export const useViewState = () => useAppStore((state) => state.view);
export const useSidebarCollapsed = () => useAppStore((state) => state.view.sidebarCollapsed);
export const useActiveWorkspaceId = () => useAppStore((state) => state.view.activeWorkspaceId);
export const useCurrentPage = () => useAppStore((state) => state.view.currentPage);
export const useBreadcrumbs = () => useAppStore((state) => state.view.breadcrumbs);

// Loading selectors
export const useLoading = (key?: keyof AppState['loading']) =>
  useAppStore((state) => key ? state.loading[key] : state.loading);

// Error selectors
export const useError = () => useAppStore((state) => state.error);

// Actions selectors
export const useAppActions = () =>
  useAppStore((state) => ({
    setUser: state.setUser,
    logout: state.logout,
    updateSettings: state.updateSettings,
    resetSettings: state.resetSettings,
    setSidebarCollapsed: state.setSidebarCollapsed,
    setActiveWorkspace: state.setActiveWorkspace,
    setCurrentPage: state.setCurrentPage,
    setBreadcrumbs: state.setBreadcrumbs,
    setLoading: state.setLoading,
    setError: state.setError,
    clearError: state.clearError,
    reset: state.reset,
  }));

// =============================================================================
// Store Subscriptions
// =============================================================================

// Subscribe to theme changes to update document class
useAppStore.subscribe(
  (state) => state.settings.theme,
  (theme) => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.setAttribute('data-theme', theme);
      
      // Handle auto theme
      if (theme === 'auto') {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        root.setAttribute('data-theme', mediaQuery.matches ? 'dark' : 'light');
        
        const handleChange = (e: MediaQueryListEvent) => {
          root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        };
        
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      }
    }
  }
);

// Subscribe to error changes to auto-clear after timeout
useAppStore.subscribe(
  (state) => state.error,
  (error) => {
    if (error) {
      const timer = setTimeout(() => {
        useAppStore.getState().clearError();
      }, 10000); // Auto-clear errors after 10 seconds
      
      return () => clearTimeout(timer);
    }
  }
);