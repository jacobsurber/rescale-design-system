// =============================================================================
// Stores Index - Re-export all Zustand stores
// =============================================================================

// App store
export {
  useAppStore,
  useUser,
  useIsAuthenticated,
  useAppSettings,
  useTheme,
  useNotificationSettings,
  useViewState,
  useSidebarCollapsed,
  useActiveWorkspaceId,
  useCurrentPage,
  useBreadcrumbs,
  useLoading,
  useError,
  useAppActions,
} from './useAppStore';

// Job store
export {
  useJobStore,
  useJobs,
  useJobsById,
  useJob,
  useJobsByWorkspace,
  useJobFilters,
  useJobSorting,
  useJobViewState,
  useSelectedJobs,
  useExpandedJobs,
  useJobViewMode,
  useAutoRefresh,
  useJobPagination,
  useSelectedJob,
  useJobCache,
  useJobActions,
  useFilteredJobs,
  useJobStatistics,
} from './useJobStore';

// Store types
export type {
  User,
  AppSettings,
  ViewState,
  AppState,
  AppActions,
} from './useAppStore';

export type {
  JobFiltersState,
  JobViewState,
  JobState,
  JobActions,
} from './useJobStore';