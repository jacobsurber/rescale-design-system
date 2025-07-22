// =============================================================================
// Constants - Application-wide constants and configuration values
// =============================================================================

// =============================================================================
// API Configuration
// =============================================================================

export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second base delay
} as const;

// =============================================================================
// WebSocket Configuration  
// =============================================================================

export const WEBSOCKET_CONFIG = {
  URL: process.env.REACT_APP_WS_URL || 'ws://localhost:3001/ws',
  RECONNECT_INTERVAL: 5000, // 5 seconds
  MAX_RECONNECT_ATTEMPTS: 10,
  HEARTBEAT_INTERVAL: 30000, // 30 seconds
} as const;

// =============================================================================
// Job Status and Priority Constants
// =============================================================================

export const JOB_STATUSES = {
  QUEUED: 'queued',
  PENDING: 'pending', 
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  WARNING: 'warning',
} as const;

export const JOB_PRIORITIES = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

export const JOB_STATUS_COLORS = {
  [JOB_STATUSES.QUEUED]: '#1890ff',
  [JOB_STATUSES.PENDING]: '#faad14',
  [JOB_STATUSES.RUNNING]: '#52c41a',
  [JOB_STATUSES.COMPLETED]: '#52c41a',
  [JOB_STATUSES.FAILED]: '#ff4d4f',
  [JOB_STATUSES.CANCELLED]: '#8c8c8c',
  [JOB_STATUSES.WARNING]: '#fa8c16',
} as const;

export const JOB_PRIORITY_COLORS = {
  [JOB_PRIORITIES.LOW]: '#52c41a',
  [JOB_PRIORITIES.NORMAL]: '#1890ff',
  [JOB_PRIORITIES.HIGH]: '#fa8c16',
  [JOB_PRIORITIES.URGENT]: '#ff4d4f',
} as const;

// =============================================================================
// Workstation Constants
// =============================================================================

export const WORKSTATION_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  MAINTENANCE: 'maintenance',
} as const;

export const WORKSTATION_STATUS_COLORS = {
  [WORKSTATION_STATUSES.ACTIVE]: '#52c41a',
  [WORKSTATION_STATUSES.INACTIVE]: '#8c8c8c',
  [WORKSTATION_STATUSES.MAINTENANCE]: '#fa8c16',
} as const;

export const NODE_TYPES = [
  'c5.large',
  'c5.xlarge',
  'c5.2xlarge',
  'c5.4xlarge',
  'c5.8xlarge',
  'c5.16xlarge',
  'm5.large',
  'm5.xlarge',
  'm5.2xlarge',
  'm5.4xlarge',
  'm5.8xlarge',
  'r5.large',
  'r5.xlarge',
  'r5.2xlarge',
  'r5.4xlarge',
  'p3.2xlarge',
  'p3.8xlarge',
  'p3.16xlarge',
] as const;

// =============================================================================
// Software Categories
// =============================================================================

export const SOFTWARE_CATEGORIES = {
  CFD: 'CFD',
  FEA: 'FEA',
  NUMERICAL_COMPUTING: 'Numerical Computing',
  MOLECULAR_DYNAMICS: 'Molecular Dynamics',
  MACHINE_LEARNING: 'Machine Learning',
  QUANTUM_CHEMISTRY: 'Quantum Chemistry',
  OPTIMIZATION: 'Optimization',
  VISUALIZATION: 'Visualization',
  CUSTOM: 'Custom',
} as const;

// =============================================================================
// UI Constants
// =============================================================================

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto',
} as const;

export const LANGUAGES = {
  EN: 'en',
  ES: 'es', 
  FR: 'fr',
  DE: 'de',
  JA: 'ja',
  ZH: 'zh',
} as const;

export const DATE_FORMATS = {
  US: 'MM/DD/YYYY',
  EUROPEAN: 'DD/MM/YYYY',
  ISO: 'YYYY-MM-DD',
} as const;

export const TIME_FORMATS = {
  '12H': '12h',
  '24H': '24h',
} as const;

export const VIEW_MODES = {
  LIST: 'list',
  GRID: 'grid',
  TABLE: 'table',
} as const;

// =============================================================================
// Pagination Constants
// =============================================================================

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  SORT: 'submittedAt',
  ORDER: 'desc',
} as const;

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

// =============================================================================
// File and Upload Constants
// =============================================================================

export const FILE_TYPES = {
  INPUT: 'input',
  OUTPUT: 'output',
} as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024 * 1024; // 10GB
export const CHUNK_SIZE = 1024 * 1024; // 1MB chunks

export const ALLOWED_FILE_EXTENSIONS = [
  '.dat', '.inp', '.msh', '.cas', '.jou', '.txt', '.csv', '.json', '.xml',
  '.py', '.m', '.r', '.sh', '.bat', '.exe', '.zip', '.tar', '.gz',
] as const;

// =============================================================================
// Validation Constants
// =============================================================================

export const VALIDATION_RULES = {
  JOB_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
    PATTERN: /^[a-zA-Z0-9\s\-_\.]+$/,
  },
  DESCRIPTION: {
    MAX_LENGTH: 500,
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  },
} as const;

// =============================================================================
// Resource Limits
// =============================================================================

export const RESOURCE_LIMITS = {
  CORES: {
    MIN: 1,
    MAX: 256,
  },
  MEMORY: {
    MIN: 1, // GB
    MAX: 1024, // GB
  },
  STORAGE: {
    MIN: 10, // GB
    MAX: 10000, // GB
  },
  GPUS: {
    MIN: 0,
    MAX: 16,
  },
  WALL_TIME: {
    MIN: 15, // minutes
    MAX: 10080, // 1 week in minutes
  },
} as const;

// =============================================================================
// Performance Constants
// =============================================================================

export const PERFORMANCE_CONFIG = {
  DEBOUNCE_DELAY: 300, // milliseconds
  THROTTLE_DELAY: 100, // milliseconds
  VIRTUAL_SCROLL_ITEM_HEIGHT: 50, // pixels
  INFINITE_SCROLL_THRESHOLD: 200, // pixels from bottom
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
  STALE_TIME: 30 * 1000, // 30 seconds
} as const;

// =============================================================================
// Animation and Transition Constants
// =============================================================================

export const ANIMATION_DURATIONS = {
  FAST: '0.15s',
  NORMAL: '0.3s',
  SLOW: '0.5s',
} as const;

export const EASING_FUNCTIONS = {
  EASE_OUT: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  EASE_IN_OUT: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

// =============================================================================
// Notification Constants
// =============================================================================

export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success', 
  WARNING: 'warning',
  ERROR: 'error',
} as const;

export const NOTIFICATION_DURATIONS = {
  SHORT: 2, // seconds
  NORMAL: 4, // seconds
  LONG: 6, // seconds
  PERSISTENT: 0, // don't auto-close
} as const;

// =============================================================================
// Local Storage Keys
// =============================================================================

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'rescale_auth_token',
  USER_PREFERENCES: 'rescale_user_preferences',
  APP_STATE: 'rescale-app-store',
  JOB_FILTERS: 'rescale_job_filters',
  WORKSPACE_SELECTION: 'rescale_workspace_selection',
} as const;

// =============================================================================
// Error Codes
// =============================================================================

export const ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  CLIENT_ERROR: 'CLIENT_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

// =============================================================================
// Feature Flags
// =============================================================================

export const FEATURE_FLAGS = {
  ENABLE_WEBSOCKETS: process.env.REACT_APP_ENABLE_WEBSOCKETS === 'true',
  ENABLE_TELEMETRY: process.env.REACT_APP_ENABLE_TELEMETRY === 'true',
  ENABLE_DEBUG_MODE: process.env.NODE_ENV === 'development',
  ENABLE_MOCK_API: process.env.REACT_APP_USE_REAL_API !== 'true',
} as const;