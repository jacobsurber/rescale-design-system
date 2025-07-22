// =============================================================================
// Custom Hooks Index - Re-export all custom hooks
// =============================================================================

// Job hooks
export {
  useJobs,
  useJobsInfinite,
  useJob,
  useJobsByWorkspace,
  useCreateJob,
  useUpdateJob,
  useDeleteJob,
  useCancelJob,
  useRestartJob,
  useJobStats,
} from './useJobs';

// Workstation hooks
export {
  useWorkstations,
  useWorkstation,
  useActiveWorkstations,
  useStartWorkstation,
  useStopWorkstation,
  useRestartWorkstation,
  useWorkstationStats,
} from './useWorkstations';

// Workspace hooks
export {
  useWorkspaces,
  useWorkspace,
  useWorkspaceUsage,
  useWorkspaceQuotas,
} from './useWorkspaces';

// Workflow hooks
export {
  useWorkflows,
  useWorkflow,
  usePublishedWorkflows,
} from './useWorkflows';

// Software hooks
export {
  useSoftwarePackages,
  useSoftwareByCategory,
  useSoftwareCategories,
} from './useSoftware';

// WebSocket hooks
export {
  useWebSocket,
  useWebSocketEvent,
  useJobUpdates,
  useWorkspaceUpdates,
  useWebSocketNotifications,
  useAutoRefresh,
  useConnectionStatus,
  useRealTimeUpdates,
} from './useWebSocket';

// Performance hooks
export {
  useDebounce,
  useDebouncedCallback,
  useThrottledCallback,
  usePrevious,
  useStableCallback,
  useEffectOnce,
  useMountedRef,
  useAsyncCallback,
  useLocalStorage,
  useIntersectionObserverLazy,
  useWindowSize,
  useMediaQuery,
  useRenderCount,
} from './usePerformance';

// Pagination and infinite scroll hooks
export {
  usePagination,
  useInfiniteScroll,
  useHybridScroll,
} from './usePagination';