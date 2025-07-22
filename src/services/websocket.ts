// =============================================================================
// WebSocket Service - Real-time communication with Rescale platform
// =============================================================================

import { 
  WebSocketMessage, 
  JobUpdatePayload, 
  ResourceUpdatePayload, 
  NotificationPayload 
} from '../types/api';
import { WEBSOCKET_CONFIG, FEATURE_FLAGS } from '../utils/constants';
import { notification } from 'antd';

// =============================================================================
// Types
// =============================================================================

export interface WebSocketEventMap {
  'job_update': JobUpdatePayload;
  'resource_update': ResourceUpdatePayload;
  'notification': NotificationPayload;
  'system_message': any;
  'connection_status': { connected: boolean; timestamp: string };
  'error': { error: string; timestamp: string };
}

export type WebSocketEventType = keyof WebSocketEventMap;

export type WebSocketEventListener<T extends WebSocketEventType> = (
  data: WebSocketEventMap[T]
) => void;

export interface WebSocketOptions {
  url?: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
  debug?: boolean;
}

// =============================================================================
// WebSocket Service Class
// =============================================================================

export class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectInterval: number;
  private maxReconnectAttempts: number;
  private heartbeatInterval: number;
  private debug: boolean;
  
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private isConnected = false;
  private shouldReconnect = true;
  
  private eventListeners = new Map<WebSocketEventType, Set<Function>>();
  
  constructor(options: WebSocketOptions = {}) {
    this.url = options.url || WEBSOCKET_CONFIG.URL;
    this.reconnectInterval = options.reconnectInterval || WEBSOCKET_CONFIG.RECONNECT_INTERVAL;
    this.maxReconnectAttempts = options.maxReconnectAttempts || WEBSOCKET_CONFIG.MAX_RECONNECT_ATTEMPTS;
    this.heartbeatInterval = options.heartbeatInterval || WEBSOCKET_CONFIG.HEARTBEAT_INTERVAL;
    this.debug = options.debug || FEATURE_FLAGS.ENABLE_DEBUG_MODE;
    
    this.log('WebSocket service initialized', { url: this.url });
  }
  
  // =============================================================================
  // Connection Management
  // =============================================================================
  
  /**
   * Connect to WebSocket server
   */
  connect(): void {
    if (!FEATURE_FLAGS.ENABLE_WEBSOCKETS) {
      this.log('WebSockets are disabled via feature flag');
      return;
    }
    
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.log('WebSocket is already connected');
      return;
    }
    
    try {
      this.log('Connecting to WebSocket...', { url: this.url });
      this.ws = new WebSocket(this.url);
      this.setupEventHandlers();
    } catch (error) {
      this.log('Failed to create WebSocket connection', { error });
      this.handleConnectionError(error as Error);
    }
  }
  
  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    this.shouldReconnect = false;
    this.clearTimers();
    
    if (this.ws) {
      this.log('Disconnecting from WebSocket');
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.emitEvent('connection_status', { connected: false, timestamp: new Date().toISOString() });
  }
  
  /**
   * Reconnect to WebSocket server
   */
  private reconnect(): void {
    if (!this.shouldReconnect || this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.log('Max reconnection attempts reached or reconnect disabled');
      return;
    }
    
    this.reconnectAttempts++;
    const delay = Math.min(this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1), 30000);
    
    this.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`);
    
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }
  
  // =============================================================================
  // Event Handlers
  // =============================================================================
  
  private setupEventHandlers(): void {
    if (!this.ws) return;
    
    this.ws.onopen = (event) => {
      this.log('WebSocket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.startHeartbeat();
      this.emitEvent('connection_status', { connected: true, timestamp: new Date().toISOString() });
    };
    
    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        this.log('Failed to parse WebSocket message', { error, data: event.data });
      }
    };
    
    this.ws.onclose = (event) => {
      this.log('WebSocket disconnected', { code: event.code, reason: event.reason });
      this.isConnected = false;
      this.clearTimers();
      this.emitEvent('connection_status', { connected: false, timestamp: new Date().toISOString() });
      
      // Reconnect unless it was a clean closure
      if (event.code !== 1000 && this.shouldReconnect) {
        this.reconnect();
      }
    };
    
    this.ws.onerror = (event) => {
      this.log('WebSocket error', { event });
      this.handleConnectionError(new Error('WebSocket error'));
    };
  }
  
  private handleMessage(message: WebSocketMessage): void {
    this.log('Received WebSocket message', { type: message.type });
    
    switch (message.type) {
      case 'job_update':
        this.emitEvent('job_update', message.payload);
        break;
        
      case 'resource_update':
        this.emitEvent('resource_update', message.payload);
        break;
        
      case 'notification':
        this.handleNotification(message.payload);
        break;
        
      case 'system_message':
        this.emitEvent('system_message', message.payload);
        break;
        
      default:
        this.log('Unknown message type', { type: message.type });
    }
  }
  
  private handleNotification(payload: NotificationPayload): void {
    this.emitEvent('notification', payload);
    
    // Show notification in UI if it's not expired
    if (!payload.expiresAt || new Date(payload.expiresAt) > new Date()) {
      notification[payload.type]({
        message: payload.title,
        description: payload.message,
        duration: payload.type === 'error' ? 6 : 4,
      });
    }
  }
  
  private handleConnectionError(error: Error): void {
    this.log('Connection error', { error });
    this.emitEvent('error', { error: error.message, timestamp: new Date().toISOString() });
  }
  
  // =============================================================================
  // Heartbeat
  // =============================================================================
  
  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected && this.ws?.readyState === WebSocket.OPEN) {
        this.send({
          type: 'ping',
          payload: { timestamp: new Date().toISOString() },
          timestamp: new Date().toISOString(),
        });
      }
    }, this.heartbeatInterval);
  }
  
  private clearTimers(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }
  
  // =============================================================================
  // Event System
  // =============================================================================
  
  /**
   * Add event listener
   */
  on<T extends WebSocketEventType>(event: T, listener: WebSocketEventListener<T>): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    
    this.eventListeners.get(event)!.add(listener);
    this.log(`Added listener for event: ${event}`);
  }
  
  /**
   * Remove event listener
   */
  off<T extends WebSocketEventType>(event: T, listener: WebSocketEventListener<T>): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(listener);
      this.log(`Removed listener for event: ${event}`);
    }
  }
  
  /**
   * Remove all event listeners for a specific event
   */
  removeAllListeners(event?: WebSocketEventType): void {
    if (event) {
      this.eventListeners.delete(event);
      this.log(`Removed all listeners for event: ${event}`);
    } else {
      this.eventListeners.clear();
      this.log('Removed all event listeners');
    }
  }
  
  /**
   * Emit event to all listeners
   */
  private emitEvent<T extends WebSocketEventType>(event: T, data: WebSocketEventMap[T]): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(data);
        } catch (error) {
          this.log(`Error in event listener for ${event}`, { error });
        }
      });
    }
  }
  
  // =============================================================================
  // Message Sending
  // =============================================================================
  
  /**
   * Send message to WebSocket server
   */
  send(message: WebSocketMessage): void {
    if (!this.isConnected || this.ws?.readyState !== WebSocket.OPEN) {
      this.log('Cannot send message: WebSocket not connected');
      return;
    }
    
    try {
      const messageString = JSON.stringify(message);
      this.ws.send(messageString);
      this.log('Sent WebSocket message', { type: message.type });
    } catch (error) {
      this.log('Failed to send message', { error });
    }
  }
  
  /**
   * Subscribe to job updates
   */
  subscribeToJobUpdates(jobId: string): void {
    this.send({
      type: 'subscribe',
      payload: { entity: 'job', id: jobId },
      timestamp: new Date().toISOString(),
    } as any);
  }
  
  /**
   * Unsubscribe from job updates
   */
  unsubscribeFromJobUpdates(jobId: string): void {
    this.send({
      type: 'unsubscribe',
      payload: { entity: 'job', id: jobId },
      timestamp: new Date().toISOString(),
    } as any);
  }
  
  /**
   * Subscribe to workspace updates
   */
  subscribeToWorkspaceUpdates(workspaceId: string): void {
    this.send({
      type: 'subscribe',
      payload: { entity: 'workspace', id: workspaceId },
      timestamp: new Date().toISOString(),
    } as any);
  }
  
  /**
   * Unsubscribe from workspace updates
   */
  unsubscribeFromWorkspaceUpdates(workspaceId: string): void {
    this.send({
      type: 'unsubscribe',
      payload: { entity: 'workspace', id: workspaceId },
      timestamp: new Date().toISOString(),
    } as any);
  }
  
  // =============================================================================
  // Utilities
  // =============================================================================
  
  /**
   * Get connection status
   */
  getConnectionStatus(): { connected: boolean; readyState?: number } {
    return {
      connected: this.isConnected,
      readyState: this.ws?.readyState,
    };
  }
  
  /**
   * Get reconnection info
   */
  getReconnectionInfo(): { attempts: number; maxAttempts: number; willReconnect: boolean } {
    return {
      attempts: this.reconnectAttempts,
      maxAttempts: this.maxReconnectAttempts,
      willReconnect: this.shouldReconnect,
    };
  }
  
  private log(message: string, data?: any): void {
    if (this.debug) {
      console.log(`[WebSocket] ${message}`, data || '');
    }
  }
}

// =============================================================================
// Singleton Instance
// =============================================================================

export const webSocketService = new WebSocketService();