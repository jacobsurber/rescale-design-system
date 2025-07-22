// =============================================================================
// useWorkflows Hook - Custom hooks for workflow data management
// =============================================================================

import { 
  useQuery, 
  UseQueryResult
} from '@tanstack/react-query';
import { Workflow, QueryKeys } from '../types/api';
import { apiClient } from '../services/apiClient';
import { mockApi } from '../services/mockApi';

// Environment check for API selection
const useRealApi = process.env.REACT_APP_USE_REAL_API === 'true';

// =============================================================================
// Query Hooks
// =============================================================================

/**
 * Hook to fetch all workflows
 */
export const useWorkflows = (): UseQueryResult<Workflow[], Error> => {
  return useQuery({
    queryKey: QueryKeys.workflows,
    queryFn: async () => {
      if (useRealApi) {
        return apiClient.get<Workflow[]>('/workflows');
      } else {
        return mockApi.getWorkflows();
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - workflows change infrequently
  });
};

/**
 * Hook to fetch a single workflow by ID
 */
export const useWorkflow = (workflowId: string): UseQueryResult<Workflow, Error> => {
  return useQuery({
    queryKey: QueryKeys.workflow(workflowId),
    queryFn: async () => {
      if (useRealApi) {
        return apiClient.get<Workflow>(`/workflows/${workflowId}`);
      } else {
        const workflows = await mockApi.getWorkflows();
        const workflow = workflows.find(w => w.id === workflowId);
        if (!workflow) {
          throw new Error(`Workflow ${workflowId} not found`);
        }
        return workflow;
      }
    },
    enabled: !!workflowId,
    staleTime: 2 * 60 * 1000, // 2 minutes for individual workflow
  });
};

/**
 * Hook to fetch published workflows only
 */
export const usePublishedWorkflows = (): UseQueryResult<Workflow[], Error> => {
  return useQuery({
    queryKey: [...QueryKeys.workflows, 'published'],
    queryFn: async () => {
      if (useRealApi) {
        return apiClient.get<Workflow[]>('/workflows', { 
          params: { status: 'published' } 
        });
      } else {
        const workflows = await mockApi.getWorkflows();
        return workflows.filter(w => w.status === 'published');
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes for published workflows
  });
};