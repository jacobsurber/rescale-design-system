// =============================================================================
// useWebSocket Hook - React hooks for WebSocket functionality
// =============================================================================

import { useEffect, useCallback, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { 
  webSocketService, 
  WebSocketEventType, 
  WebSocketEventListener, 
  WebSocketEventMap 
} from '../services/websocket';
import { QueryKeys } from '../types/api';
import { useJobActions, useActiveWorkspaceId } from '../stores';
import { queryUtils } from '../lib/queryClient';

// =============================================================================
// Base WebSocket Hook
// =============================================================================

/**
 * Hook for managing WebSocket connection lifecycle
 */
export const useWebSocket = (options: { autoConnect?: boolean } = {}) => {
  const { autoConnect = true } = options;
  const [connectionStatus, setConnectionStatus] = useState(() => 
    webSocketService.getConnectionStatus()
  );
  
  // Connect on mount if autoConnect is enabled
  useEffect(() => {
    if (autoConnect) {
      webSocketService.connect();
    }
    
    // Listen for connection status changes
    const handleConnectionStatus = (data: WebSocketEventMap['connection_status']) => {
      setConnectionStatus({ connected: data.connected });
    };
    
    webSocketService.on('connection_status', handleConnectionStatus);
    
    // Cleanup on unmount
    return () => {
      webSocketService.off('connection_status', handleConnectionStatus);
      if (autoConnect) {
        webSocketService.disconnect();
      }
    };
  }, [autoConnect]);
  
  const connect = useCallback(() => {
    webSocketService.connect();
  }, []);
  
  const disconnect = useCallback(() => {
    webSocketService.disconnect();
  }, []);
  
  return {
    ...connectionStatus,
    connect,
    disconnect,
    reconnectionInfo: webSocketService.getReconnectionInfo(),
  };
};

// =============================================================================
// WebSocket Event Hook
// =============================================================================

/**
 * Hook for listening to specific WebSocket events
 */
export const useWebSocketEvent = <T extends WebSocketEventType>(
  eventType: T,
  listener: WebSocketEventListener<T>,
  dependencies: React.DependencyList = []
) => {
  const listenerRef = useRef(listener);
  listenerRef.current = listener;
  
  useEffect(() => {
    const stableListener = (data: WebSocketEventMap[T]) => {
      listenerRef.current(data);
    };
    
    webSocketService.on(eventType, stableListener);
    
    return () => {
      webSocketService.off(eventType, stableListener);
    };
  }, [eventType, ...dependencies]);
};

// =============================================================================
// Job Updates Hook
// =============================================================================

/**
 * Hook for receiving real-time job updates
 */
export const useJobUpdates = (jobId?: string) => {
  const queryClient = useQueryClient();
  const jobActions = useJobActions();
  
  // Subscribe to specific job updates
  useEffect(() => {
    if (jobId) {
      webSocketService.subscribeToJobUpdates(jobId);
      
      return () => {
        webSocketService.unsubscribeFromJobUpdates(jobId);
      };
    }
  }, [jobId]);
  
  // Listen for job update events
  useWebSocketEvent('job_update', useCallback((update) => {
    const { jobId: updatedJobId, status, progress, metrics } = update;
    
    // Update query cache
    queryUtils.setQueryData(QueryKeys.job(updatedJobId), (oldJob: any) => {
      if (!oldJob) return oldJob;
      
      return {
        ...oldJob,
        status,
        progress,
        metrics,
        // Update completed timestamp if job completed
        completedAt: status === 'completed' || status === 'failed' || status === 'cancelled' 
          ? new Date().toISOString() 
          : oldJob.completedAt,
      };
    });
    
    // Update job store
    jobActions.updateJob(updatedJobId, { status, progress, metrics });
    
    // Apply live update for real-time display
    jobActions.applyLiveUpdate(updatedJobId, { status, progress, metrics });
    
    // Invalidate related queries if job finished
    if (['completed', 'failed', 'cancelled'].includes(status)) {
      queryUtils.invalidateQueries(QueryKeys.jobs);
    }
  }, [queryClient, jobActions]), [jobId]);
};

// =============================================================================
// Workspace Updates Hook
// =============================================================================

/**
 * Hook for receiving real-time workspace updates
 */
export const useWorkspaceUpdates = () => {
  const queryClient = useQueryClient();
  const activeWorkspaceId = useActiveWorkspaceId();
  
  // Subscribe to active workspace updates
  useEffect(() => {
    if (activeWorkspaceId) {
      webSocketService.subscribeToWorkspaceUpdates(activeWorkspaceId);
      
      return () => {
        webSocketService.unsubscribeFromWorkspaceUpdates(activeWorkspaceId);
      };
    }
  }, [activeWorkspaceId]);
  
  // Listen for resource update events
  useWebSocketEvent('resource_update', useCallback((update) => {
    const { workstationId, usage } = update;
    
    // Update workstation query cache
    queryUtils.setQueryData(QueryKeys.workstation(workstationId), (oldWorkstation: any) => {
      if (!oldWorkstation) return oldWorkstation;
      
      return {
        ...oldWorkstation,
        usage,
        lastAccessedAt: new Date().toISOString(),
      };
    });
    
    // Invalidate workstations list to reflect changes
    queryUtils.invalidateQueries(QueryKeys.workstations);
  }, [queryClient]), [activeWorkspaceId]);
};

// =============================================================================
// Notifications Hook
// =============================================================================

/**
 * Hook for handling real-time notifications
 */
export const useWebSocketNotifications = () => {
  const [notifications, setNotifications] = useState<WebSocketEventMap['notification'][]>([]);
  
  useWebSocketEvent('notification', useCallback((notification) => {
    setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep last 10
  }, []), []);
  
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);
  
  const removeNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);
  
  return {
    notifications,
    clearNotifications,
    removeNotification,
  };
};

// =============================================================================
// Auto-refresh Hook
// =============================================================================

/**
 * Hook for auto-refreshing queries based on real-time updates
 */
export const useAutoRefresh = (queryKeys: string[][], enabled: boolean = true) => {
  const queryClient = useQueryClient();
  
  useWebSocketEvent('job_update', useCallback(() => {
    if (enabled) {
      queryKeys.forEach(key => {
        queryUtils.invalidateQueries(key);
      });
    }
  }, [queryKeys, enabled, queryClient]), [enabled]);
  
  useWebSocketEvent('resource_update', useCallback(() => {
    if (enabled) {
      queryUtils.invalidateQueries(QueryKeys.workstations);
    }
  }, [enabled, queryClient]), [enabled]);
};

// =============================================================================
// Connection Status Hook
// =============================================================================

/**
 * Hook for monitoring WebSocket connection status with visual feedback
 */
export const useConnectionStatus = () => {
  const [status, setStatus] = useState(() => webSocketService.getConnectionStatus());
  const [errors, setErrors] = useState<string[]>([]);
  
  useWebSocketEvent('connection_status', useCallback((data) => {
    setStatus({ connected: data.connected });
  }, []), []);
  
  useWebSocketEvent('error', useCallback((data) => {
    setErrors(prev => [data.error, ...prev.slice(0, 4)]); // Keep last 5 errors
  }, []), []);
  
  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);
  
  return {
    ...status,
    errors,
    clearErrors,
    reconnectionInfo: webSocketService.getReconnectionInfo(),
  };
};

// =============================================================================
// Compound Hook for Job Management
// =============================================================================

/**
 * Comprehensive hook that combines job updates, workspace updates, and notifications
 */
export const useRealTimeUpdates = (options: { 
  jobId?: string; 
  autoRefresh?: boolean;
  enableNotifications?: boolean;
} = {}) => {
  const { jobId, autoRefresh = true, enableNotifications = true } = options;
  
  // Initialize WebSocket connection
  const connection = useWebSocket({ autoConnect: true });
  
  // Set up job updates
  useJobUpdates(jobId);
  
  // Set up workspace updates
  useWorkspaceUpdates();
  
  // Set up notifications if enabled
  const notifications = enableNotifications ? useWebSocketNotifications() : null;
  
  // Set up auto-refresh for relevant queries
  useAutoRefresh([
    QueryKeys.jobs,
    QueryKeys.workstations,
  ], autoRefresh);
  
  return {
    connection,
    notifications: notifications || { notifications: [], clearNotifications: () => {}, removeNotification: () => {} },
  };
};