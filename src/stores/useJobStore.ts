// =============================================================================
// Job Store - Specialized state management for job-related data
// =============================================================================

import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { Job, JobStatus, JobFilters, PaginationParams } from '../types/api';

// =============================================================================
// Types
// =============================================================================

export interface JobFiltersState extends JobFilters {
  // Extended filters for UI state
  showCompleted: boolean;
  showFailed: boolean;
  groupBy: 'none' | 'status' | 'workspace' | 'software';
  sortBy: 'submittedAt' | 'startedAt' | 'completedAt' | 'name' | 'priority';
  sortOrder: 'asc' | 'desc';
}

export interface JobViewState {
  selectedJobs: string[];
  expandedJobs: string[];
  viewMode: 'list' | 'grid' | 'table';
  showMetrics: boolean;
  autoRefresh: boolean;
  refreshInterval: number; // in seconds
}

export interface JobState {
  // Data state
  jobs: Record<string, Job>;
  jobsByWorkspace: Record<string, string[]>;
  
  // Filter and view state
  filters: JobFiltersState;
  view: JobViewState;
  pagination: PaginationParams;
  
  // Selection and interaction state
  selectedJobId: string | null;
  
  // Real-time updates
  liveUpdates: Record<string, Job>;
  
  // Cache metadata
  lastFetch: number | null;
  isStale: boolean;
}

export interface JobActions {
  // Data actions
  setJobs: (jobs: Job[]) => void;
  addJob: (job: Job) => void;
  updateJob: (jobId: string, updates: Partial<Job>) => void;
  removeJob: (jobId: string) => void;
  
  // Filter actions
  setFilters: (filters: Partial<JobFiltersState>) => void;
  clearFilters: () => void;
  
  // View actions
  setViewMode: (mode: 'list' | 'grid' | 'table') => void;
  toggleJobSelection: (jobId: string) => void;
  selectMultipleJobs: (jobIds: string[]) => void;
  clearSelection: () => void;
  toggleJobExpanded: (jobId: string) => void;
  setShowMetrics: (show: boolean) => void;
  setAutoRefresh: (enabled: boolean, interval?: number) => void;
  
  // Pagination actions
  setPagination: (pagination: Partial<PaginationParams>) => void;
  
  // Selection actions
  setSelectedJob: (jobId: string | null) => void;
  
  // Real-time actions
  applyLiveUpdate: (jobId: string, update: Partial<Job>) => void;
  clearLiveUpdates: () => void;
  
  // Cache actions
  markStale: () => void;
  markFresh: () => void;
  
  // Utility actions
  reset: () => void;
}

// =============================================================================
// Default State
// =============================================================================

const defaultFilters: JobFiltersState = {
  showCompleted: true,
  showFailed: true,
  groupBy: 'none',
  sortBy: 'submittedAt',
  sortOrder: 'desc',
};

const defaultView: JobViewState = {
  selectedJobs: [],
  expandedJobs: [],
  viewMode: 'table',
  showMetrics: true,
  autoRefresh: true,
  refreshInterval: 30,
};

const defaultPagination: PaginationParams = {
  page: 1,
  limit: 20,
  sort: 'submittedAt',
  order: 'desc',
};

const initialState: JobState = {
  jobs: {},
  jobsByWorkspace: {},
  filters: defaultFilters,
  view: defaultView,
  pagination: defaultPagination,
  selectedJobId: null,
  liveUpdates: {},
  lastFetch: null,
  isStale: false,
};

// =============================================================================
// Store Implementation
// =============================================================================

export const useJobStore = create<JobState & JobActions>()(
  devtools(
    subscribeWithSelector(
      immer((set, get) => ({
        ...initialState,
        
        // Data actions
        setJobs: (jobs) =>
          set((state) => {
            // Clear existing data
            state.jobs = {};
            state.jobsByWorkspace = {};
            
            // Add new jobs
            jobs.forEach((job) => {
              state.jobs[job.id] = job;
              
              // Group by workspace
              if (!state.jobsByWorkspace[job.workspaceId]) {
                state.jobsByWorkspace[job.workspaceId] = [];
              }
              state.jobsByWorkspace[job.workspaceId].push(job.id);
            });
            
            state.lastFetch = Date.now();
            state.isStale = false;
          }),
        
        addJob: (job) =>
          set((state) => {
            state.jobs[job.id] = job;
            
            // Add to workspace group
            if (!state.jobsByWorkspace[job.workspaceId]) {
              state.jobsByWorkspace[job.workspaceId] = [];
            }
            if (!state.jobsByWorkspace[job.workspaceId].includes(job.id)) {
              state.jobsByWorkspace[job.workspaceId].unshift(job.id);
            }
          }),
        
        updateJob: (jobId, updates) =>
          set((state) => {
            if (state.jobs[jobId]) {
              Object.assign(state.jobs[jobId], updates);
            }
          }),
        
        removeJob: (jobId) =>
          set((state) => {
            const job = state.jobs[jobId];
            if (job) {
              // Remove from jobs
              delete state.jobs[jobId];
              
              // Remove from workspace group
              const workspaceJobs = state.jobsByWorkspace[job.workspaceId];
              if (workspaceJobs) {
                const index = workspaceJobs.indexOf(jobId);
                if (index > -1) {
                  workspaceJobs.splice(index, 1);
                }
              }
              
              // Clear selection if removed job was selected
              if (state.selectedJobId === jobId) {
                state.selectedJobId = null;
              }
              
              // Remove from selections
              const selectedIndex = state.view.selectedJobs.indexOf(jobId);
              if (selectedIndex > -1) {
                state.view.selectedJobs.splice(selectedIndex, 1);
              }
              
              // Remove from expanded
              const expandedIndex = state.view.expandedJobs.indexOf(jobId);
              if (expandedIndex > -1) {
                state.view.expandedJobs.splice(expandedIndex, 1);
              }
            }
          }),
        
        // Filter actions
        setFilters: (newFilters) =>
          set((state) => {
            Object.assign(state.filters, newFilters);
            
            // Update pagination sort if sortBy changed
            if (newFilters.sortBy) {
              state.pagination.sort = newFilters.sortBy;
              state.pagination.order = state.filters.sortOrder;
            }
            if (newFilters.sortOrder) {
              state.pagination.order = newFilters.sortOrder;
            }
          }),
        
        clearFilters: () =>
          set((state) => {
            state.filters = { ...defaultFilters };
            state.pagination = { ...defaultPagination };
          }),
        
        // View actions
        setViewMode: (mode) =>
          set((state) => {
            state.view.viewMode = mode;
          }),
        
        toggleJobSelection: (jobId) =>
          set((state) => {
            const index = state.view.selectedJobs.indexOf(jobId);
            if (index > -1) {
              state.view.selectedJobs.splice(index, 1);
            } else {
              state.view.selectedJobs.push(jobId);
            }
          }),
        
        selectMultipleJobs: (jobIds) =>
          set((state) => {
            state.view.selectedJobs = [...new Set([...state.view.selectedJobs, ...jobIds])];
          }),
        
        clearSelection: () =>
          set((state) => {
            state.view.selectedJobs = [];
          }),
        
        toggleJobExpanded: (jobId) =>
          set((state) => {
            const index = state.view.expandedJobs.indexOf(jobId);
            if (index > -1) {
              state.view.expandedJobs.splice(index, 1);
            } else {
              state.view.expandedJobs.push(jobId);
            }
          }),
        
        setShowMetrics: (show) =>
          set((state) => {
            state.view.showMetrics = show;
          }),
        
        setAutoRefresh: (enabled, interval = 30) =>
          set((state) => {
            state.view.autoRefresh = enabled;
            if (interval) {
              state.view.refreshInterval = interval;
            }
          }),
        
        // Pagination actions
        setPagination: (newPagination) =>
          set((state) => {
            Object.assign(state.pagination, newPagination);
          }),
        
        // Selection actions
        setSelectedJob: (jobId) =>
          set((state) => {
            state.selectedJobId = jobId;
          }),
        
        // Real-time actions
        applyLiveUpdate: (jobId, update) =>
          set((state) => {
            // Store the live update
            if (!state.liveUpdates[jobId]) {
              state.liveUpdates[jobId] = { ...state.jobs[jobId] };
            }
            Object.assign(state.liveUpdates[jobId], update);
            
            // Apply to main job data
            if (state.jobs[jobId]) {
              Object.assign(state.jobs[jobId], update);
            }
          }),
        
        clearLiveUpdates: () =>
          set((state) => {
            state.liveUpdates = {};
          }),
        
        // Cache actions
        markStale: () =>
          set((state) => {
            state.isStale = true;
          }),
        
        markFresh: () =>
          set((state) => {
            state.isStale = false;
            state.lastFetch = Date.now();
          }),
        
        // Utility actions
        reset: () =>
          set((state) => {
            Object.assign(state, initialState);
          }),
      }))
    ),
    {
      name: 'JobStore',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

// =============================================================================
// Selectors
// =============================================================================

// Data selectors
export const useJobs = () => useJobStore((state) => Object.values(state.jobs));
export const useJobsById = () => useJobStore((state) => state.jobs);
export const useJob = (jobId: string) => useJobStore((state) => state.jobs[jobId]);
export const useJobsByWorkspace = (workspaceId: string) =>
  useJobStore((state) => 
    state.jobsByWorkspace[workspaceId]?.map(id => state.jobs[id]).filter(Boolean) || []
  );

// Filter selectors
export const useJobFilters = () => useJobStore((state) => state.filters);
export const useJobSorting = () => useJobStore((state) => ({
  sortBy: state.filters.sortBy,
  sortOrder: state.filters.sortOrder,
}));

// View selectors
export const useJobViewState = () => useJobStore((state) => state.view);
export const useSelectedJobs = () => useJobStore((state) => 
  state.view.selectedJobs.map(id => state.jobs[id]).filter(Boolean)
);
export const useExpandedJobs = () => useJobStore((state) => state.view.expandedJobs);
export const useJobViewMode = () => useJobStore((state) => state.view.viewMode);
export const useAutoRefresh = () => useJobStore((state) => state.view.autoRefresh);

// Pagination selectors
export const useJobPagination = () => useJobStore((state) => state.pagination);

// Selection selectors
export const useSelectedJob = () => useJobStore((state) => 
  state.selectedJobId ? state.jobs[state.selectedJobId] : null
);

// Cache selectors
export const useJobCache = () => useJobStore((state) => ({
  lastFetch: state.lastFetch,
  isStale: state.isStale,
}));

// Actions selectors
export const useJobActions = () =>
  useJobStore((state) => ({
    setJobs: state.setJobs,
    addJob: state.addJob,
    updateJob: state.updateJob,
    removeJob: state.removeJob,
    setFilters: state.setFilters,
    clearFilters: state.clearFilters,
    setViewMode: state.setViewMode,
    toggleJobSelection: state.toggleJobSelection,
    selectMultipleJobs: state.selectMultipleJobs,
    clearSelection: state.clearSelection,
    toggleJobExpanded: state.toggleJobExpanded,
    setShowMetrics: state.setShowMetrics,
    setAutoRefresh: state.setAutoRefresh,
    setPagination: state.setPagination,
    setSelectedJob: state.setSelectedJob,
    applyLiveUpdate: state.applyLiveUpdate,
    clearLiveUpdates: state.clearLiveUpdates,
    markStale: state.markStale,
    markFresh: state.markFresh,
    reset: state.reset,
  }));

// =============================================================================
// Computed Selectors
// =============================================================================

// Filtered jobs based on current filters
export const useFilteredJobs = () =>
  useJobStore((state) => {
    let jobs = Object.values(state.jobs);
    const filters = state.filters;
    
    // Apply status filters
    if (!filters.showCompleted) {
      jobs = jobs.filter(job => job.status !== 'completed');
    }
    if (!filters.showFailed) {
      jobs = jobs.filter(job => job.status !== 'failed');
    }
    
    // Apply other filters
    if (filters.status?.length) {
      jobs = jobs.filter(job => filters.status!.includes(job.status));
    }
    if (filters.priority?.length) {
      jobs = jobs.filter(job => filters.priority!.includes(job.priority));
    }
    if (filters.workspaceId) {
      jobs = jobs.filter(job => job.workspaceId === filters.workspaceId);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      jobs = jobs.filter(job => 
        job.name.toLowerCase().includes(search) ||
        job.description?.toLowerCase().includes(search) ||
        job.software.some(sw => sw.name.toLowerCase().includes(search))
      );
    }
    
    // Apply sorting
    jobs.sort((a, b) => {
      let aVal: any = a[filters.sortBy as keyof Job];
      let bVal: any = b[filters.sortBy as keyof Job];
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (filters.sortOrder === 'desc') {
        return bVal > aVal ? 1 : -1;
      }
      return aVal > bVal ? 1 : -1;
    });
    
    return jobs;
  });

// Job statistics
export const useJobStatistics = () =>
  useJobStore((state) => {
    const jobs = Object.values(state.jobs);
    
    return {
      total: jobs.length,
      running: jobs.filter(j => j.status === 'running').length,
      queued: jobs.filter(j => j.status === 'queued').length,
      completed: jobs.filter(j => j.status === 'completed').length,
      failed: jobs.filter(j => j.status === 'failed').length,
      cancelled: jobs.filter(j => j.status === 'cancelled').length,
      warning: jobs.filter(j => j.status === 'warning').length,
    };
  });