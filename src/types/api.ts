// =============================================================================
// API Types - Comprehensive TypeScript definitions for Rescale API
// =============================================================================

// Base types
export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, any>;
}

// Job-related types
export type JobStatus = 
  | 'queued'
  | 'pending' 
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'warning';

export type JobPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface Job {
  id: string;
  name: string;
  description?: string;
  status: JobStatus;
  priority: JobPriority;
  progress: number;
  estimatedDuration?: number;
  actualDuration?: number;
  submittedAt: string;
  startedAt?: string;
  completedAt?: string;
  userId: string;
  workspaceId: string;
  software: SoftwarePackage[];
  resources: ResourceRequirements;
  files: JobFile[];
  parameters: JobParameter[];
  logs?: JobLog[];
  metrics?: JobMetrics;
}

export interface SoftwarePackage {
  id: string;
  name: string;
  version: string;
  logoUrl?: string;
  category: string;
  description?: string;
}

export interface ResourceRequirements {
  cores: number;
  memory: number; // GB
  storage: number; // GB
  gpus?: number;
  nodeType?: string;
  maxWallTime?: number; // minutes
}

export interface JobFile {
  id: string;
  name: string;
  path: string;
  size: number;
  type: 'input' | 'output';
  uploadedAt: string;
  url?: string;
}

export interface JobParameter {
  key: string;
  value: string | number | boolean;
  type: 'string' | 'number' | 'boolean' | 'file';
  description?: string;
}

export interface JobLog {
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  source?: string;
}

export interface JobMetrics {
  cpuUsage: number; // percentage
  memoryUsage: number; // percentage
  storageUsage: number; // percentage
  networkUsage?: number; // MB/s
  gpuUsage?: number; // percentage
  timestamp: string;
}

// Workstation types
export interface Workstation {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'maintenance';
  nodeType: string;
  specs: WorkstationSpecs;
  usage: ResourceUsage;
  createdAt: string;
  lastAccessedAt?: string;
}

export interface WorkstationSpecs {
  cores: number;
  memory: number;
  storage: number;
  gpus?: number;
  os: string;
}

export interface ResourceUsage {
  cpu: number; // percentage
  memory: number; // percentage  
  storage: number; // percentage
  network?: number; // MB/s
}

// Workflow types
export interface Workflow {
  id: string;
  name: string;
  description?: string;
  version: string;
  status: 'draft' | 'published' | 'deprecated';
  tags: string[];
  steps: WorkflowStep[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'job' | 'condition' | 'parallel' | 'sequential';
  config: Record<string, any>;
  dependencies: string[];
  position: { x: number; y: number };
}

// User and workspace types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: 'admin' | 'user' | 'viewer';
  workspaces: string[];
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  timezone: string;
  language: string;
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  jobCompletion: boolean;
  jobFailure: boolean;
  systemMaintenance: boolean;
  email: boolean;
  inApp: boolean;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  members: WorkspaceMember[];
  settings: WorkspaceSettings;
  quotas: ResourceQuotas;
  usage: WorkspaceUsage;
  createdAt: string;
}

export interface WorkspaceMember {
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: string;
}

export interface WorkspaceSettings {
  defaultPriority: JobPriority;
  autoShutdown: boolean;
  maxJobDuration: number;
  allowedSoftware: string[];
}

export interface ResourceQuotas {
  maxCores: number;
  maxMemory: number;
  maxStorage: number;
  maxJobs: number;
  maxWorkstations: number;
}

export interface WorkspaceUsage {
  cores: { used: number; total: number };
  memory: { used: number; total: number };
  storage: { used: number; total: number };
  jobs: { running: number; total: number };
  workstations: { active: number; total: number };
}

// API request/response types
export interface CreateJobRequest {
  name: string;
  description?: string;
  workspaceId: string;
  softwareIds: string[];
  resources: ResourceRequirements;
  parameters: Omit<JobParameter, 'id'>[];
  fileIds?: string[];
  priority?: JobPriority;
}

export interface UpdateJobRequest {
  name?: string;
  description?: string;
  priority?: JobPriority;
  parameters?: Omit<JobParameter, 'id'>[];
}

export interface JobFilters {
  status?: JobStatus[];
  priority?: JobPriority[];
  workspaceId?: string;
  userId?: string;
  softwareIds?: string[];
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

// WebSocket types
export interface WebSocketMessage {
  type: 'job_update' | 'resource_update' | 'notification' | 'system_message';
  payload: any;
  timestamp: string;
}

export interface JobUpdatePayload {
  jobId: string;
  status: JobStatus;
  progress: number;
  metrics?: JobMetrics;
}

export interface ResourceUpdatePayload {
  workstationId: string;
  usage: ResourceUsage;
}

export interface NotificationPayload {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  actionUrl?: string;
  expiresAt?: string;
}

// Query keys for TanStack Query
export const QueryKeys = {
  jobs: ['jobs'] as const,
  job: (id: string) => ['jobs', id] as const,
  jobsByWorkspace: (workspaceId: string) => ['jobs', 'workspace', workspaceId] as const,
  workstations: ['workstations'] as const,
  workstation: (id: string) => ['workstations', id] as const,
  workflows: ['workflows'] as const,
  workflow: (id: string) => ['workflows', id] as const,
  workspaces: ['workspaces'] as const,
  workspace: (id: string) => ['workspaces', id] as const,
  user: (id: string) => ['users', id] as const,
  software: ['software'] as const,
} as const;