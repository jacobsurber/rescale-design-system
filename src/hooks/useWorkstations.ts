// =============================================================================
// useWorkstations Hook - Custom hooks for workstation data management
// =============================================================================

import { 
  useQuery, 
  useMutation, 
  UseQueryResult,
  UseMutationResult
} from '@tanstack/react-query';
import { Workstation, QueryKeys } from '../types/api';
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
 * Hook to fetch all workstations
 */
export const useWorkstations = (): UseQueryResult<Workstation[], Error> => {
  return useQuery({
    queryKey: QueryKeys.workstations,
    queryFn: async () => {
      if (useRealApi) {
        return apiClient.get<Workstation[]>('/workstations');
      } else {
        return mockApi.getWorkstations();
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - workstations change less frequently
  });
};

/**
 * Hook to fetch a single workstation by ID
 */
export const useWorkstation = (workstationId: string): UseQueryResult<Workstation, Error> => {
  return useQuery({
    queryKey: QueryKeys.workstation(workstationId),
    queryFn: async () => {
      if (useRealApi) {
        return apiClient.get<Workstation>(`/workstations/${workstationId}`);
      } else {
        const workstations = await mockApi.getWorkstations();
        const workstation = workstations.find(w => w.id === workstationId);
        if (!workstation) {
          throw new Error(`Workstation ${workstationId} not found`);
        }
        return workstation;
      }
    },
    enabled: !!workstationId,
    staleTime: 1 * 60 * 1000, // 1 minute for individual workstation
  });
};

/**
 * Hook to fetch active workstations only
 */
export const useActiveWorkstations = (): UseQueryResult<Workstation[], Error> => {
  return useQuery({
    queryKey: [...QueryKeys.workstations, 'active'],
    queryFn: async () => {
      if (useRealApi) {
        return apiClient.get<Workstation[]>('/workstations', { 
          params: { status: 'active' } 
        });
      } else {
        const workstations = await mockApi.getWorkstations();
        return workstations.filter(w => w.status === 'active');
      }
    },
    staleTime: 30 * 1000, // 30 seconds for active workstations
  });
};

// =============================================================================
// Mutation Hooks
// =============================================================================

/**
 * Hook to start/activate a workstation
 */
export const useStartWorkstation = (): UseMutationResult<Workstation, Error, string> => {
  return useMutation({
    mutationFn: async (workstationId: string) => {
      if (useRealApi) {
        return apiClient.post<Workstation>(`/workstations/${workstationId}/start`);
      } else {
        // Simulate starting workstation in mock API
        const workstations = await mockApi.getWorkstations();
        const workstation = workstations.find(w => w.id === workstationId);
        if (!workstation) {
          throw new Error(`Workstation ${workstationId} not found`);
        }
        
        return {
          ...workstation,
          status: 'active' as const,
          lastAccessedAt: new Date().toISOString(),
        };
      }
    },
    onSuccess: (updatedWorkstation) => {
      // Update workstation in cache
      queryUtils.setQueryData(QueryKeys.workstation(updatedWorkstation.id), updatedWorkstation);
      
      // Invalidate workstations list
      queryUtils.invalidateQueries(QueryKeys.workstations);
      
      notification.success({
        message: 'Workstation Started',
        description: `Workstation "${updatedWorkstation.name}" is now active.`,
        duration: 4,
      });
    },
    onError: (error: Error) => {
      notification.error({
        message: 'Failed to Start Workstation',
        description: error.message || 'An error occurred while starting the workstation.',
        duration: 6,
      });
    },
  });
};

/**
 * Hook to stop/deactivate a workstation
 */
export const useStopWorkstation = (): UseMutationResult<Workstation, Error, string> => {
  return useMutation({
    mutationFn: async (workstationId: string) => {
      if (useRealApi) {
        return apiClient.post<Workstation>(`/workstations/${workstationId}/stop`);
      } else {
        // Simulate stopping workstation in mock API
        const workstations = await mockApi.getWorkstations();
        const workstation = workstations.find(w => w.id === workstationId);
        if (!workstation) {
          throw new Error(`Workstation ${workstationId} not found`);
        }
        
        return {
          ...workstation,
          status: 'inactive' as const,
        };
      }
    },
    onSuccess: (updatedWorkstation) => {
      // Update workstation in cache
      queryUtils.setQueryData(QueryKeys.workstation(updatedWorkstation.id), updatedWorkstation);
      
      // Invalidate workstations list
      queryUtils.invalidateQueries(QueryKeys.workstations);
      
      notification.success({
        message: 'Workstation Stopped',
        description: `Workstation "${updatedWorkstation.name}" has been stopped.`,
        duration: 4,
      });
    },
    onError: (error: Error) => {
      notification.error({
        message: 'Failed to Stop Workstation',
        description: error.message || 'An error occurred while stopping the workstation.',
        duration: 6,
      });
    },
  });
};

/**
 * Hook to restart a workstation
 */
export const useRestartWorkstation = (): UseMutationResult<Workstation, Error, string> => {
  return useMutation({
    mutationFn: async (workstationId: string) => {
      if (useRealApi) {
        return apiClient.post<Workstation>(`/workstations/${workstationId}/restart`);
      } else {
        // Simulate restart in mock API
        const workstations = await mockApi.getWorkstations();
        const workstation = workstations.find(w => w.id === workstationId);
        if (!workstation) {
          throw new Error(`Workstation ${workstationId} not found`);
        }
        
        return {
          ...workstation,
          status: 'active' as const,
          lastAccessedAt: new Date().toISOString(),
          usage: {
            cpu: 5,
            memory: 10,
            storage: workstation.usage.storage,
            network: 0,
          },
        };
      }
    },
    onSuccess: (updatedWorkstation) => {
      // Update workstation in cache
      queryUtils.setQueryData(QueryKeys.workstation(updatedWorkstation.id), updatedWorkstation);
      
      // Invalidate workstations list
      queryUtils.invalidateQueries(QueryKeys.workstations);
      
      notification.success({
        message: 'Workstation Restarted',
        description: `Workstation "${updatedWorkstation.name}" has been restarted.`,
        duration: 4,
      });
    },
    onError: (error: Error) => {
      notification.error({
        message: 'Failed to Restart Workstation',
        description: error.message || 'An error occurred while restarting the workstation.',
        duration: 6,
      });
    },
  });
};

// =============================================================================
// Utility Hooks
// =============================================================================

/**
 * Hook to get workstation statistics
 */
export const useWorkstationStats = () => {
  return useQuery({
    queryKey: [...QueryKeys.workstations, 'stats'],
    queryFn: async () => {
      const workstations = useRealApi 
        ? await apiClient.get<Workstation[]>('/workstations')
        : await mockApi.getWorkstations();
        
      const stats = {
        total: workstations.length,
        active: workstations.filter(w => w.status === 'active').length,
        inactive: workstations.filter(w => w.status === 'inactive').length,
        maintenance: workstations.filter(w => w.status === 'maintenance').length,
        totalCores: workstations.reduce((sum, w) => sum + w.specs.cores, 0),
        totalMemory: workstations.reduce((sum, w) => sum + w.specs.memory, 0),
        averageCpuUsage: workstations.length > 0 
          ? Math.round(workstations.reduce((sum, w) => sum + w.usage.cpu, 0) / workstations.length)
          : 0,
        averageMemoryUsage: workstations.length > 0 
          ? Math.round(workstations.reduce((sum, w) => sum + w.usage.memory, 0) / workstations.length)
          : 0,
      };
      
      return stats;
    },
    staleTime: 60 * 1000, // 1 minute
  });
};