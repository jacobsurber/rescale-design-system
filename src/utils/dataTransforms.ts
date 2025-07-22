// =============================================================================
// Data Transformation Utilities - Helpers for data manipulation and formatting
// =============================================================================

import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';
import { 
  Job, 
  JobStatus, 
  JobPriority, 
  Workstation, 
  ResourceRequirements,
  JobMetrics,
  ResourceUsage 
} from '../types/api';

// =============================================================================
// Date and Time Transformations
// =============================================================================

/**
 * Format date string to human-readable format
 */
export const formatDate = (dateString: string, formatStr: string = 'MMM dd, yyyy'): string => {
  try {
    const date = parseISO(dateString);
    return isValid(date) ? format(date, formatStr) : 'Invalid date';
  } catch {
    return 'Invalid date';
  }
};

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return isValid(date) ? formatDistanceToNow(date, { addSuffix: true }) : 'Unknown';
  } catch {
    return 'Unknown';
  }
};

/**
 * Format duration in minutes to human-readable format
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 1) return '< 1 min';
  if (minutes < 60) return `${Math.round(minutes)} min`;
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours < 24) {
    if (remainingMinutes === 0) return `${hours}h`;
    return `${hours}h ${Math.round(remainingMinutes)}m`;
  }
  
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  
  if (remainingHours === 0) return `${days}d`;
  return `${days}d ${remainingHours}h`;
};

// =============================================================================
// Size and Memory Transformations
// =============================================================================

/**
 * Format bytes to human-readable format
 */
export const formatBytes = (bytes: number, decimals: number = 1): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

/**
 * Format memory in GB to human-readable format
 */
export const formatMemory = (gb: number): string => {
  if (gb < 1) return `${Math.round(gb * 1024)} MB`;
  return `${gb} GB`;
};

/**
 * Format storage in GB to human-readable format
 */
export const formatStorage = (gb: number): string => {
  if (gb < 1) return `${Math.round(gb * 1024)} MB`;
  if (gb >= 1024) return `${(gb / 1024).toFixed(1)} TB`;
  return `${gb} GB`;
};

// =============================================================================
// Job Data Transformations
// =============================================================================

/**
 * Get job status color
 */
export const getJobStatusColor = (status: JobStatus): string => {
  const colors: Record<JobStatus, string> = {
    queued: '#1890ff', // blue
    pending: '#faad14', // orange
    running: '#52c41a', // green
    completed: '#52c41a', // green
    failed: '#ff4d4f', // red
    cancelled: '#8c8c8c', // gray
    warning: '#fa8c16', // orange
  };
  return colors[status] || '#8c8c8c';
};

/**
 * Get job priority color
 */
export const getJobPriorityColor = (priority: JobPriority): string => {
  const colors: Record<JobPriority, string> = {
    low: '#52c41a', // green
    normal: '#1890ff', // blue
    high: '#fa8c16', // orange
    urgent: '#ff4d4f', // red
  };
  return colors[priority] || '#1890ff';
};

/**
 * Calculate job progress percentage
 */
export const calculateJobProgress = (job: Job): number => {
  if (job.status === 'completed') return 100;
  if (job.status === 'failed' || job.status === 'cancelled') return job.progress || 0;
  if (job.status === 'queued' || job.status === 'pending') return 0;
  return job.progress || 0;
};

/**
 * Estimate remaining time for a running job
 */
export const estimateRemainingTime = (job: Job): number | null => {
  if (job.status !== 'running' || !job.startedAt || job.progress === 0) {
    return null;
  }
  
  const startTime = new Date(job.startedAt).getTime();
  const now = Date.now();
  const elapsed = (now - startTime) / 1000 / 60; // minutes
  
  const progressRate = job.progress / elapsed; // progress per minute
  const remainingProgress = 100 - job.progress;
  
  return remainingProgress / progressRate;
};

/**
 * Transform job data for display
 */
export const transformJobForDisplay = (job: Job) => ({
  ...job,
  formattedSubmittedAt: formatDate(job.submittedAt),
  relativeSubmittedAt: formatRelativeTime(job.submittedAt),
  formattedStartedAt: job.startedAt ? formatDate(job.startedAt) : null,
  relativeStartedAt: job.startedAt ? formatRelativeTime(job.startedAt) : null,
  formattedCompletedAt: job.completedAt ? formatDate(job.completedAt) : null,
  relativeCompletedAt: job.completedAt ? formatRelativeTime(job.completedAt) : null,
  formattedDuration: job.actualDuration ? formatDuration(job.actualDuration) : null,
  formattedEstimatedDuration: job.estimatedDuration ? formatDuration(job.estimatedDuration) : null,
  statusColor: getJobStatusColor(job.status),
  priorityColor: getJobPriorityColor(job.priority),
  progressPercentage: calculateJobProgress(job),
  estimatedRemainingTime: estimateRemainingTime(job),
  softwareNames: job.software.map(s => s.name).join(', '),
});

// =============================================================================
// Resource Transformations
// =============================================================================

/**
 * Format resource requirements for display
 */
export const formatResourceRequirements = (resources: ResourceRequirements) => ({
  cores: `${resources.cores} core${resources.cores !== 1 ? 's' : ''}`,
  memory: formatMemory(resources.memory),
  storage: formatStorage(resources.storage),
  gpus: resources.gpus ? `${resources.gpus} GPU${resources.gpus !== 1 ? 's' : ''}` : null,
  nodeType: resources.nodeType || null,
  maxWallTime: resources.maxWallTime ? formatDuration(resources.maxWallTime) : null,
});

/**
 * Calculate resource utilization percentage
 */
export const calculateUtilization = (used: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((used / total) * 100);
};

/**
 * Get utilization color based on percentage
 */
export const getUtilizationColor = (percentage: number): string => {
  if (percentage < 50) return '#52c41a'; // green
  if (percentage < 80) return '#faad14'; // orange
  return '#ff4d4f'; // red
};

/**
 * Transform resource usage for display
 */
export const transformResourceUsage = (usage: ResourceUsage) => ({
  cpu: {
    value: usage.cpu,
    formatted: `${usage.cpu}%`,
    color: getUtilizationColor(usage.cpu),
  },
  memory: {
    value: usage.memory,
    formatted: `${usage.memory}%`,
    color: getUtilizationColor(usage.memory),
  },
  storage: {
    value: usage.storage,
    formatted: `${usage.storage}%`,
    color: getUtilizationColor(usage.storage),
  },
  network: usage.network ? {
    value: usage.network,
    formatted: `${usage.network} MB/s`,
  } : null,
});

// =============================================================================
// Workstation Transformations
// =============================================================================

/**
 * Get workstation status color
 */
export const getWorkstationStatusColor = (status: Workstation['status']): string => {
  const colors = {
    active: '#52c41a', // green
    inactive: '#8c8c8c', // gray
    maintenance: '#fa8c16', // orange
  };
  return colors[status] || '#8c8c8c';
};

/**
 * Transform workstation data for display
 */
export const transformWorkstationForDisplay = (workstation: Workstation) => ({
  ...workstation,
  formattedCreatedAt: formatDate(workstation.createdAt),
  relativeCreatedAt: formatRelativeTime(workstation.createdAt),
  formattedLastAccessed: workstation.lastAccessedAt ? formatRelativeTime(workstation.lastAccessedAt) : 'Never',
  statusColor: getWorkstationStatusColor(workstation.status),
  formattedSpecs: {
    cores: `${workstation.specs.cores} cores`,
    memory: formatMemory(workstation.specs.memory),
    storage: formatStorage(workstation.specs.storage),
    gpus: workstation.specs.gpus ? `${workstation.specs.gpus} GPUs` : null,
  },
  usage: transformResourceUsage(workstation.usage),
});

// =============================================================================
// Metrics Transformations
// =============================================================================

/**
 * Transform job metrics for display
 */
export const transformJobMetrics = (metrics: JobMetrics) => ({
  cpu: {
    value: metrics.cpuUsage,
    formatted: `${metrics.cpuUsage}%`,
    color: getUtilizationColor(metrics.cpuUsage),
  },
  memory: {
    value: metrics.memoryUsage,
    formatted: `${metrics.memoryUsage}%`,
    color: getUtilizationColor(metrics.memoryUsage),
  },
  storage: {
    value: metrics.storageUsage,
    formatted: `${metrics.storageUsage}%`,
    color: getUtilizationColor(metrics.storageUsage),
  },
  network: metrics.networkUsage ? {
    value: metrics.networkUsage,
    formatted: `${metrics.networkUsage} MB/s`,
  } : null,
  gpu: metrics.gpuUsage ? {
    value: metrics.gpuUsage,
    formatted: `${metrics.gpuUsage}%`,
    color: getUtilizationColor(metrics.gpuUsage),
  } : null,
  timestamp: formatRelativeTime(metrics.timestamp),
});

// =============================================================================
// Validation and Normalization
// =============================================================================

/**
 * Normalize job status
 */
export const normalizeJobStatus = (status: string): JobStatus => {
  const validStatuses: JobStatus[] = ['queued', 'pending', 'running', 'completed', 'failed', 'cancelled', 'warning'];
  return validStatuses.includes(status as JobStatus) ? (status as JobStatus) : 'pending';
};

/**
 * Normalize job priority
 */
export const normalizeJobPriority = (priority: string): JobPriority => {
  const validPriorities: JobPriority[] = ['low', 'normal', 'high', 'urgent'];
  return validPriorities.includes(priority as JobPriority) ? (priority as JobPriority) : 'normal';
};

/**
 * Validate and normalize percentage value
 */
export const normalizePercentage = (value: number): number => {
  return Math.max(0, Math.min(100, Math.round(value)));
};

// =============================================================================
// Search and Filter Utilities
// =============================================================================

/**
 * Create search-friendly text from job
 */
export const getJobSearchText = (job: Job): string => {
  return [
    job.name,
    job.description || '',
    ...job.software.map(s => s.name),
    ...job.software.map(s => s.category),
    job.status,
    job.priority,
  ].join(' ').toLowerCase();
};

/**
 * Filter jobs by search term
 */
export const filterJobsBySearch = (jobs: Job[], searchTerm: string): Job[] => {
  if (!searchTerm.trim()) return jobs;
  
  const term = searchTerm.toLowerCase();
  return jobs.filter(job => getJobSearchText(job).includes(term));
};

/**
 * Group jobs by specified field
 */
export const groupJobs = (jobs: Job[], groupBy: 'status' | 'priority' | 'workspace'): Record<string, Job[]> => {
  return jobs.reduce((groups, job) => {
    let key: string;
    
    switch (groupBy) {
      case 'status':
        key = job.status;
        break;
      case 'priority':
        key = job.priority;
        break;
      case 'workspace':
        key = job.workspaceId;
        break;
      default:
        key = 'all';
    }
    
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(job);
    
    return groups;
  }, {} as Record<string, Job[]>);
};