// =============================================================================
// useJobs Hook - Custom hooks for job data management
// =============================================================================

import { 
  useQuery, 
  useMutation, 
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
  useInfiniteQuery,
  UseInfiniteQueryResult
} from '@tanstack/react-query';
import { 
  Job, 
  PaginatedResponse, 
  PaginationParams, 
  JobFilters, 
  CreateJobRequest, 
  UpdateJobRequest,
  QueryKeys 
} from '../types/api';
import { apiClient } from '../services/apiClient';
import { mockApi } from '../services/mockApi';
import { queryUtils } from '../lib/queryClient';
import { notification } from 'antd';

// Environment check for API selection
const useRealApi = process.env.REACT_APP_USE_REAL_API === 'true';
const api = useRealApi ? apiClient : mockApi;

// =============================================================================
// Query Hooks
// =============================================================================

/**
 * Hook to fetch paginated jobs with filtering and sorting
 */
export const useJobs = (
  params: PaginationParams & { filters?: JobFilters } = { page: 1, limit: 20 }
): UseQueryResult<PaginatedResponse<Job>, Error> => {
  return useQuery({
    queryKey: [...QueryKeys.jobs, params],
    queryFn: async () => {
      if (useRealApi) {
        return apiClient.get<PaginatedResponse<Job>>('/jobs', { params });
      } else {
        return mockApi.getJobs(params);
      }
    },
    staleTime: 30 * 1000, // 30 seconds - jobs data changes frequently
    retry: 3,
  });
};

/**
 * Hook to fetch infinite scroll jobs list
 */
export const useJobsInfinite = (
  filters?: JobFilters,
  limit: number = 20
): UseInfiniteQueryResult<PaginatedResponse<Job>, Error> => {
  return useInfiniteQuery({
    queryKey: [...QueryKeys.jobs, 'infinite', filters],
    queryFn: async ({ pageParam = 1 }) => {
      const params = { page: pageParam as number, limit, filters };
      
      if (useRealApi) {
        return apiClient.get<PaginatedResponse<Job>>('/jobs', { params });
      } else {
        return mockApi.getJobs(params);
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNext 
        ? lastPage.pagination.page + 1 
        : undefined;
    },
    staleTime: 30 * 1000,
  });
};

/**
 * Hook to fetch a single job by ID
 */
export const useJob = (jobId: string): UseQueryResult<Job, Error> => {
  return useQuery({
    queryKey: QueryKeys.job(jobId),
    queryFn: async () => {
      if (useRealApi) {
        return apiClient.get<Job>(`/jobs/${jobId}`);
      } else {
        return mockApi.getJob(jobId);
      }
    },
    enabled: !!jobId,
    staleTime: 10 * 1000, // 10 seconds for individual job data
  });
};

/**
 * Hook to fetch jobs by workspace
 */
export const useJobsByWorkspace = (
  workspaceId: string,
  params: PaginationParams = { page: 1, limit: 20 }
): UseQueryResult<PaginatedResponse<Job>, Error> => {
  return useQuery({
    queryKey: QueryKeys.jobsByWorkspace(workspaceId),
    queryFn: async () => {
      const filters: JobFilters = { workspaceId };
      const queryParams = { ...params, filters };
      
      if (useRealApi) {
        return apiClient.get<PaginatedResponse<Job>>('/jobs', { params: queryParams });
      } else {
        return mockApi.getJobs(queryParams);
      }
    },
    enabled: !!workspaceId,
    staleTime: 30 * 1000,
  });
};

// =============================================================================
// Mutation Hooks
// =============================================================================

/**
 * Hook to create a new job
 */
export const useCreateJob = (): UseMutationResult<Job, Error, CreateJobRequest> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (request: CreateJobRequest) => {
      if (useRealApi) {
        return apiClient.post<Job>('/jobs', request);
      } else {
        return mockApi.createJob(request);
      }
    },
    onSuccess: (newJob) => {
      // Invalidate jobs list to refetch
      queryUtils.invalidateQueries(QueryKeys.jobs);
      
      // Optimistically add to cache
      queryUtils.setQueryData(QueryKeys.job(newJob.id), newJob);
      
      // Show success notification
      notification.success({
        message: 'Job Created',
        description: `Job "${newJob.name}" has been created successfully.`,
        duration: 4,
      });
    },
    onError: (error: Error) => {
      notification.error({
        message: 'Failed to Create Job',
        description: error.message || 'An error occurred while creating the job.',
        duration: 6,
      });
    },
  });
};

/**
 * Hook to update an existing job
 */
export const useUpdateJob = (): UseMutationResult<Job, Error, { id: string; data: UpdateJobRequest }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }) => {
      if (useRealApi) {
        return apiClient.patch<Job>(`/jobs/${id}`, data);
      } else {
        return mockApi.updateJob(id, data);
      }
    },
    onSuccess: (updatedJob, { id }) => {
      // Update job in cache
      queryUtils.setQueryData(QueryKeys.job(id), updatedJob);
      
      // Invalidate jobs list to reflect changes
      queryUtils.invalidateQueries(QueryKeys.jobs);
      
      notification.success({
        message: 'Job Updated',
        description: `Job "${updatedJob.name}" has been updated successfully.`,
        duration: 4,
      });
    },
    onError: (error: Error) => {
      notification.error({
        message: 'Failed to Update Job',
        description: error.message || 'An error occurred while updating the job.',
        duration: 6,
      });
    },
  });
};

/**
 * Hook to delete a job
 */
export const useDeleteJob = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (jobId: string) => {
      if (useRealApi) {
        return apiClient.delete<void>(`/jobs/${jobId}`);
      } else {
        return mockApi.deleteJob(jobId);
      }
    },
    onSuccess: (_, jobId) => {
      // Remove job from cache
      queryUtils.removeQueries(QueryKeys.job(jobId));
      
      // Invalidate jobs list
      queryUtils.invalidateQueries(QueryKeys.jobs);
      
      notification.success({
        message: 'Job Deleted',
        description: 'Job has been deleted successfully.',
        duration: 4,
      });
    },
    onError: (error: Error) => {
      notification.error({
        message: 'Failed to Delete Job',
        description: error.message || 'An error occurred while deleting the job.',
        duration: 6,
      });
    },
  });
};

/**
 * Hook to cancel a running job
 */
export const useCancelJob = (): UseMutationResult<Job, Error, string> => {
  return useMutation({
    mutationFn: async (jobId: string) => {
      if (useRealApi) {
        return apiClient.post<Job>(`/jobs/${jobId}/cancel`);
      } else {
        // Simulate cancellation in mock API
        const job = await mockApi.getJob(jobId);
        return mockApi.updateJob(jobId, { 
          status: 'cancelled' as any,
          completedAt: new Date().toISOString()
        });
      }
    },
    onSuccess: (cancelledJob) => {
      // Update job in cache
      queryUtils.setQueryData(QueryKeys.job(cancelledJob.id), cancelledJob);
      
      // Invalidate jobs list
      queryUtils.invalidateQueries(QueryKeys.jobs);
      
      notification.success({
        message: 'Job Cancelled',
        description: `Job "${cancelledJob.name}" has been cancelled.`,
        duration: 4,
      });
    },
    onError: (error: Error) => {
      notification.error({
        message: 'Failed to Cancel Job',
        description: error.message || 'An error occurred while cancelling the job.',
        duration: 6,
      });
    },
  });
};

/**
 * Hook to restart a failed or cancelled job
 */
export const useRestartJob = (): UseMutationResult<Job, Error, string> => {
  return useMutation({
    mutationFn: async (jobId: string) => {
      if (useRealApi) {
        return apiClient.post<Job>(`/jobs/${jobId}/restart`);
      } else {
        // Simulate restart in mock API
        return mockApi.updateJob(jobId, {
          status: 'queued' as any,
          progress: 0,
          submittedAt: new Date().toISOString(),
          startedAt: undefined,
          completedAt: undefined,
        });
      }
    },
    onSuccess: (restartedJob) => {
      // Update job in cache
      queryUtils.setQueryData(QueryKeys.job(restartedJob.id), restartedJob);
      
      // Invalidate jobs list
      queryUtils.invalidateQueries(QueryKeys.jobs);
      
      notification.success({
        message: 'Job Restarted',
        description: `Job "${restartedJob.name}" has been restarted.`,
        duration: 4,
      });
    },
    onError: (error: Error) => {
      notification.error({
        message: 'Failed to Restart Job',
        description: error.message || 'An error occurred while restarting the job.',
        duration: 6,
      });
    },
  });
};

// =============================================================================
// Utility Hooks
// =============================================================================

/**
 * Hook to get job statistics
 */
export const useJobStats = () => {
  return useQuery({
    queryKey: [...QueryKeys.jobs, 'stats'],
    queryFn: async () => {
      // Fetch all jobs to calculate stats
      const response = useRealApi 
        ? await apiClient.get<PaginatedResponse<Job>>('/jobs', { 
            params: { page: 1, limit: 1000 } 
          })
        : await mockApi.getJobs({ page: 1, limit: 1000 });
        
      const jobs = response.data;
      
      const stats = {
        total: jobs.length,
        running: jobs.filter(j => j.status === 'running').length,
        queued: jobs.filter(j => j.status === 'queued').length,
        completed: jobs.filter(j => j.status === 'completed').length,
        failed: jobs.filter(j => j.status === 'failed').length,
        cancelled: jobs.filter(j => j.status === 'cancelled').length,
        warning: jobs.filter(j => j.status === 'warning').length,
      };
      
      return stats;
    },
    staleTime: 60 * 1000, // 1 minute
  });
};