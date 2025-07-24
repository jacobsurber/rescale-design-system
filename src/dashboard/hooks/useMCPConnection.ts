import { useState, useEffect, useCallback, useRef } from 'react';
import { mcpService, MCPHealthResponse, MCPSelectionResponse, MCPTokensResponse } from '../services/mcpService';

export interface MCPConnectionState {
  connected: boolean;
  health: MCPHealthResponse | null;
  error: string | null;
  lastChecked: Date | null;
  checking: boolean;
}

export interface MCPSelectionState {
  currentSelection: MCPSelectionResponse | null;
  monitoring: boolean;
  lastUpdated: Date | null;
}

export interface MCPTokenState {
  tokens: MCPTokensResponse | null;
  extracting: boolean;
  lastExtracted: Date | null;
}

export const useMCPConnection = () => {
  const [connectionState, setConnectionState] = useState<MCPConnectionState>({
    connected: false,
    health: null,
    error: null,
    lastChecked: null,
    checking: false
  });

  const [selectionState, setSelectionState] = useState<MCPSelectionState>({
    currentSelection: null,
    monitoring: false,
    lastUpdated: null
  });

  const [tokenState, setTokenState] = useState<MCPTokenState>({
    tokens: null,
    extracting: false,
    lastExtracted: null
  });

  const monitoringInterval = useRef<NodeJS.Timeout | null>(null);
  const healthCheckInterval = useRef<NodeJS.Timeout | null>(null);

  /**
   * Check MCP server health
   */
  const checkHealth = useCallback(async () => {
    setConnectionState(prev => ({ ...prev, checking: true, error: null }));

    try {
      const health = await mcpService.checkHealth();
      
      setConnectionState(prev => ({
        ...prev,
        connected: health.status === 'healthy',
        health,
        error: null,
        lastChecked: new Date(),
        checking: false
      }));

      return health;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      setConnectionState(prev => ({
        ...prev,
        connected: false,
        health: null,
        error: errorMessage,
        lastChecked: new Date(),
        checking: false
      }));

      throw error;
    }
  }, []);

  /**
   * Start monitoring Figma selection changes
   */
  const startSelectionMonitoring = useCallback(() => {
    if (monitoringInterval.current) {
      return; // Already monitoring
    }

    setSelectionState(prev => ({ ...prev, monitoring: true }));

    monitoringInterval.current = setInterval(async () => {
      try {
        const selection = await mcpService.getCurrentSelection();
        
        setSelectionState(prev => {
          // Only update if selection actually changed
          if (prev.currentSelection?.nodeId !== selection?.nodeId) {
            return {
              ...prev,
              currentSelection: selection,
              lastUpdated: new Date()
            };
          }
          return prev;
        });
      } catch (error) {
        console.error('Selection monitoring failed:', error);
      }
    }, 2000); // Check every 2 seconds
  }, []);

  /**
   * Stop monitoring Figma selection changes
   */
  const stopSelectionMonitoring = useCallback(() => {
    if (monitoringInterval.current) {
      clearInterval(monitoringInterval.current);
      monitoringInterval.current = null;
    }

    setSelectionState(prev => ({ ...prev, monitoring: false }));
  }, []);

  /**
   * Extract tokens from current selection or specific node
   */
  const extractTokens = useCallback(async (nodeId?: string) => {
    setTokenState(prev => ({ ...prev, extracting: true }));

    try {
      const extractedTokens = await mcpService.extractTokens(nodeId);
      
      setTokenState(prev => ({
        ...prev,
        tokens: extractedTokens,
        extracting: false,
        lastExtracted: new Date()
      }));

      return extractedTokens;
    } catch (error) {
      setTokenState(prev => ({ ...prev, extracting: false }));
      throw error;
    }
  }, []);

  /**
   * Clear all extracted tokens
   */
  const clearTokens = useCallback(() => {
    setTokenState(prev => ({
      ...prev,
      tokens: null,
      lastExtracted: null
    }));
  }, []);

  /**
   * Get component information for a node
   */
  const getComponentInfo = useCallback(async (nodeId: string) => {
    return await mcpService.getComponentInfo(nodeId);
  }, []);

  /**
   * Get image for a node
   */
  const getNodeImage = useCallback(async (nodeId: string) => {
    return await mcpService.getNodeImage(nodeId);
  }, []);

  // Auto-start health checking when connected
  useEffect(() => {
    if (connectionState.connected && !healthCheckInterval.current) {
      healthCheckInterval.current = setInterval(checkHealth, 30000); // Check every 30 seconds
    } else if (!connectionState.connected && healthCheckInterval.current) {
      clearInterval(healthCheckInterval.current);
      healthCheckInterval.current = null;
    }

    return () => {
      if (healthCheckInterval.current) {
        clearInterval(healthCheckInterval.current);
        healthCheckInterval.current = null;
      }
    };
  }, [connectionState.connected, checkHealth]);

  // Auto-start selection monitoring when connected
  useEffect(() => {
    if (connectionState.connected) {
      startSelectionMonitoring();
    } else {
      stopSelectionMonitoring();
    }

    return () => {
      stopSelectionMonitoring();
    };
  }, [connectionState.connected, startSelectionMonitoring, stopSelectionMonitoring]);

  // Initial health check
  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (monitoringInterval.current) {
        clearInterval(monitoringInterval.current);
      }
      if (healthCheckInterval.current) {
        clearInterval(healthCheckInterval.current);
      }
    };
  }, []);

  return {
    // Connection state
    ...connectionState,
    checkHealth,

    // Selection state
    ...selectionState,
    startSelectionMonitoring,
    stopSelectionMonitoring,

    // Token state
    ...tokenState,
    extractTokens,
    clearTokens,

    // Utility methods
    getComponentInfo,
    getNodeImage
  };
};