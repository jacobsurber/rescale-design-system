// =============================================================================
// useSoftware Hook - Custom hooks for software package data management
// =============================================================================

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { SoftwarePackage, QueryKeys } from '../types/api';
import { apiClient } from '../services/apiClient';
import { mockApi } from '../services/mockApi';

// Environment check for API selection
const useRealApi = process.env.REACT_APP_USE_REAL_API === 'true';

// =============================================================================
// Query Hooks
// =============================================================================

/**
 * Hook to fetch all software packages
 */
export const useSoftwarePackages = (): UseQueryResult<SoftwarePackage[], Error> => {
  return useQuery({
    queryKey: QueryKeys.software,
    queryFn: async () => {
      if (useRealApi) {
        return apiClient.get<SoftwarePackage[]>('/software');
      } else {
        return mockApi.getSoftwarePackages();
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - software packages change rarely
  });
};

/**
 * Hook to fetch software packages by category
 */
export const useSoftwareByCategory = (category: string): UseQueryResult<SoftwarePackage[], Error> => {
  return useQuery({
    queryKey: [...QueryKeys.software, 'category', category],
    queryFn: async () => {
      if (useRealApi) {
        return apiClient.get<SoftwarePackage[]>('/software', {
          params: { category }
        });
      } else {
        const software = await mockApi.getSoftwarePackages();
        return software.filter(s => s.category === category);
      }
    },
    enabled: !!category,
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to get unique software categories
 */
export const useSoftwareCategories = (): UseQueryResult<string[], Error> => {
  return useQuery({
    queryKey: [...QueryKeys.software, 'categories'],
    queryFn: async () => {
      const software = useRealApi 
        ? await apiClient.get<SoftwarePackage[]>('/software')
        : await mockApi.getSoftwarePackages();
        
      const categories = Array.from(new Set(software.map(s => s.category)));
      return categories.sort();
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};