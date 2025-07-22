// =============================================================================
// Utilities Index - Re-export all utility functions and constants
// =============================================================================

// Data transformation utilities
export {
  formatDate,
  formatRelativeTime,
  formatDuration,
  formatBytes,
  formatMemory,
  formatStorage,
  getJobStatusColor,
  getJobPriorityColor,
  calculateJobProgress,
  estimateRemainingTime,
  transformJobForDisplay,
  formatResourceRequirements,
  calculateUtilization,
  getUtilizationColor,
  transformResourceUsage,
  getWorkstationStatusColor,
  transformWorkstationForDisplay,
  transformJobMetrics,
  normalizeJobStatus,
  normalizeJobPriority,
  normalizePercentage,
  getJobSearchText,
  filterJobsBySearch,
  groupJobs,
} from './dataTransforms';

// Formatters
export {
  formatNumber,
  formatCurrency,
  formatPercentage,
  formatDecimal,
  truncateText,
  capitalizeWords,
  camelToTitle,
  snakeToTitle,
  formatFileSize,
  formatNetworkSpeed,
  formatHash,
  formatList,
  formatPhoneNumber,
  formatEmail,
  formatUrl,
  formatVersion,
  formatStatus,
  formatTags,
  getInitials,
  formatFullName,
} from './formatters';

// Constants
export {
  API_CONFIG,
  WEBSOCKET_CONFIG,
  JOB_STATUSES,
  JOB_PRIORITIES,
  JOB_STATUS_COLORS,
  JOB_PRIORITY_COLORS,
  WORKSTATION_STATUSES,
  WORKSTATION_STATUS_COLORS,
  NODE_TYPES,
  SOFTWARE_CATEGORIES,
  THEMES,
  LANGUAGES,
  DATE_FORMATS,
  TIME_FORMATS,
  VIEW_MODES,
  PAGINATION_DEFAULTS,
  PAGE_SIZE_OPTIONS,
  FILE_TYPES,
  MAX_FILE_SIZE,
  CHUNK_SIZE,
  ALLOWED_FILE_EXTENSIONS,
  VALIDATION_RULES,
  RESOURCE_LIMITS,
  PERFORMANCE_CONFIG,
  ANIMATION_DURATIONS,
  EASING_FUNCTIONS,
  NOTIFICATION_TYPES,
  NOTIFICATION_DURATIONS,
  STORAGE_KEYS,
  ERROR_CODES,
  FEATURE_FLAGS,
} from './constants';

// Animation utilities
export * from './animations';

// Performance utilities
export * from './performance';

// Lazy loading utilities
export * from './lazy';