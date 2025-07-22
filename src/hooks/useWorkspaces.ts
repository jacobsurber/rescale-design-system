// =============================================================================
// useWorkspaces Hook - Custom hooks for workspace data management
// =============================================================================

import { 
  useQuery, 
  useMutation, 
  UseQueryResult,
  UseMutationResult
} from '@tanstack/react-query';
import { Workspace, QueryKeys } from '../types/api';
import { apiClient } from '../services/apiClient';
import { mockApi } from '../services/mockApi';
import { queryUtils } from '../lib/queryClient';
import { notification } from 'antd';

// Environment check for API selection
const useRealApi = process.env.REACT_APP_USE_REAL_API === 'true';

// =============================================================================
// Query Hooks
// =============================================================================

/**
 * Hook to fetch all workspaces
 */
export const useWorkspaces = (): UseQueryResult<Workspace[], Error> => {
  return useQuery({
    queryKey: QueryKeys.workspaces,
    queryFn: async () => {
      if (useRealApi) {
        return apiClient.get<Workspace[]>('/workspaces');
      } else {
        return mockApi.getWorkspaces();
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - workspaces change infrequently
  });
};

/**
 * Hook to fetch a single workspace by ID
 */
export const useWorkspace = (workspaceId: string): UseQueryResult<Workspace, Error> => {
  return useQuery({
    queryKey: QueryKeys.workspace(workspaceId),
    queryFn: async () => {
      if (useRealApi) {
        return apiClient.get<Workspace>(`/workspaces/${workspaceId}`);
      } else {
        const workspaces = await mockApi.getWorkspaces();
        const workspace = workspaces.find(w => w.id === workspaceId);
        if (!workspace) {
          throw new Error(`Workspace ${workspaceId} not found`);
        }
        return workspace;
      }
    },
    enabled: !!workspaceId,
    staleTime: 2 * 60 * 1000, // 2 minutes for individual workspace
  });
};

// =============================================================================
// Utility Hooks
// =============================================================================

/**
 * Hook to get workspace usage statistics
 */
export const useWorkspaceUsage = (workspaceId: string) => {
  return useQuery({
    queryKey: [...QueryKeys.workspace(workspaceId), 'usage'],
    queryFn: async () => {
      if (useRealApi) {
        return apiClient.get(`/workspaces/${workspaceId}/usage`);
      } else {
        const workspace = await mockApi.getWorkspaces().then(workspaces => 
          workspaces.find(w => w.id === workspaceId)
        );
        if (!workspace) {
          throw new Error(`Workspace ${workspaceId} not found`);
        }
        return workspace.usage;
      }
    },
    enabled: !!workspaceId,
    staleTime: 30 * 1000, // 30 seconds for usage data
    refetchInterval: 30 * 1000, // Auto-refetch every 30 seconds
  });
};

/**
 * Hook to get workspace resource quotas
 */
export const useWorkspaceQuotas = (workspaceId: string) => {
  return useQuery({
    queryKey: [...QueryKeys.workspace(workspaceId), 'quotas'],
    queryFn: async () => {
      if (useRealApi) {
        return apiClient.get(`/workspaces/${workspaceId}/quotas`);
      } else {
        const workspace = await mockApi.getWorkspaces().then(workspaces => 
          workspaces.find(w => w.id === workspaceId)
        );
        if (!workspace) {
          throw new Error(`Workspace ${workspaceId} not found`);
        }
        return workspace.quotas;
      }
    },
    enabled: !!workspaceId,
    staleTime: 5 * 60 * 1000, // 5 minutes for quotas
  });
};