// =============================================================================
// API Client - Centralized HTTP client with interceptors and error handling
// =============================================================================

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { ApiError } from '../types/api';

// Environment configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const API_TIMEOUT = 30000; // 30 seconds

export interface ApiClientConfig {
  baseURL?: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

export class ApiClient {
  private client: AxiosInstance;
  private retryAttempts: number;
  private retryDelay: number;
  private authToken: string | null = null;

  constructor(config: ApiClientConfig = {}) {
    this.retryAttempts = config.retryAttempts || 3;
    this.retryDelay = config.retryDelay || 1000;

    this.client = axios.create({
      baseURL: config.baseURL || API_BASE_URL,
      timeout: config.timeout || API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add authentication token
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }

        // Add request ID for tracking
        config.headers['X-Request-ID'] = this.generateRequestId();

        // Add timestamp
        config.headers['X-Request-Time'] = new Date().toISOString();

        // Log request in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
            params: config.params,
            data: config.data,
            headers: config.headers,
          });
        }

        return config;
      },
      (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        // Log response in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
            status: response.status,
            data: response.data,
            duration: this.calculateDuration(response.config.headers?.['X-Request-Time'] as string),
          });
        }

        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean; _retryCount?: number };

        // Log error in development
        if (process.env.NODE_ENV === 'development') {
          console.error(`❌ API Error: ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`, {
            status: error.response?.status,
            message: error.message,
            data: error.response?.data,
          });
        }

        // Handle specific error cases
        if (error.response) {
          const { status, data } = error.response;

          // Handle authentication errors
          if (status === 401) {
            this.handleAuthError();
            return Promise.reject(this.createApiError('Authentication failed', 'UNAUTHORIZED', error));
          }

          // Handle forbidden access
          if (status === 403) {
            return Promise.reject(this.createApiError('Access forbidden', 'FORBIDDEN', error));
          }

          // Handle not found
          if (status === 404) {
            return Promise.reject(this.createApiError('Resource not found', 'NOT_FOUND', error));
          }

          // Handle validation errors
          if (status === 422) {
            return Promise.reject(this.createApiError('Validation failed', 'VALIDATION_ERROR', error));
          }

          // Handle server errors with retry
          if (status >= 500) {
            if (this.shouldRetry(originalRequest)) {
              return this.retryRequest(originalRequest);
            }
            return Promise.reject(this.createApiError('Server error', 'SERVER_ERROR', error));
          }

          // Handle other client errors
          if (status >= 400) {
            const message = data?.message || error.message || 'Client error';
            return Promise.reject(this.createApiError(message, 'CLIENT_ERROR', error));
          }
        }

        // Handle network errors with retry
        if (error.code === 'ECONNABORTED' || error.code === 'NETWORK_ERROR' || !error.response) {
          if (this.shouldRetry(originalRequest)) {
            return this.retryRequest(originalRequest);
          }
          return Promise.reject(this.createApiError('Network error', 'NETWORK_ERROR', error));
        }

        return Promise.reject(this.createApiError(error.message, 'UNKNOWN_ERROR', error));
      }
    );
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private calculateDuration(startTime: string): number {
    if (!startTime) return 0;
    return Date.now() - new Date(startTime).getTime();
  }

  private createApiError(message: string, code: string, originalError: AxiosError): ApiError {
    return {
      message,
      code,
      details: {
        status: originalError.response?.status,
        statusText: originalError.response?.statusText,
        data: originalError.response?.data,
        url: originalError.config?.url,
        method: originalError.config?.method,
      },
    };
  }

  private shouldRetry(config?: AxiosRequestConfig & { _retry?: boolean; _retryCount?: number }): boolean {
    if (!config || config._retry) return false;
    const retryCount = config._retryCount || 0;
    return retryCount < this.retryAttempts;
  }

  private async retryRequest(config: AxiosRequestConfig & { _retry?: boolean; _retryCount?: number }) {
    config._retry = true;
    config._retryCount = (config._retryCount || 0) + 1;

    // Wait before retrying with exponential backoff
    const delay = this.retryDelay * Math.pow(2, config._retryCount - 1);
    await new Promise(resolve => setTimeout(resolve, delay));

    console.log(`🔄 Retrying request (attempt ${config._retryCount}/${this.retryAttempts}):`, config.url);

    return this.client.request(config);
  }

  private handleAuthError() {
    // Clear stored auth token
    this.authToken = null;
    
    // Clear from localStorage/sessionStorage
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');

    // Emit auth error event for global handling
    window.dispatchEvent(new CustomEvent('auth:expired'));
    
    // Redirect to login if not already there
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  // Public methods for setting authentication
  public setAuthToken(token: string) {
    this.authToken = token;
    localStorage.setItem('authToken', token);
  }

  public clearAuthToken() {
    this.authToken = null;
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
  }

  public getAuthToken(): string | null {
    if (this.authToken) return this.authToken;
    
    // Try to get from storage
    const stored = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (stored) {
      this.authToken = stored;
    }
    
    return this.authToken;
  }

  // HTTP method wrappers with proper typing
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  // Upload method with progress tracking
  public async upload<T>(
    url: string, 
    file: File | FormData, 
    onProgress?: (progress: number) => void,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const formData = file instanceof FormData ? file : new FormData();
    if (file instanceof File) {
      formData.append('file', file);
    }

    const response = await this.client.post<T>(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onProgress ? (progressEvent) => {
        const progress = progressEvent.total 
          ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
          : 0;
        onProgress(progress);
      } : undefined,
    });

    return response.data;
  }

  // Download method with progress tracking
  public async download(
    url: string,
    filename?: string,
    onProgress?: (progress: number) => void,
    config?: AxiosRequestConfig
  ): Promise<Blob> {
    const response = await this.client.get(url, {
      ...config,
      responseType: 'blob',
      onDownloadProgress: onProgress ? (progressEvent) => {
        const progress = progressEvent.total 
          ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
          : 0;
        onProgress(progress);
      } : undefined,
    });

    // Trigger download if filename is provided
    if (filename) {
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    }

    return response.data;
  }

  // Cancel token utilities
  public createCancelToken() {
    return axios.CancelToken.source();
  }

  public isCancel(error: any): boolean {
    return axios.isCancel(error);
  }

  // Health check
  public async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.get<{ status: string; timestamp: string }>('/health');
  }

  // Get axios instance for advanced usage
  public getClient(): AxiosInstance {
    return this.client;
  }
}

// Create and export default instance
export const apiClient = new ApiClient();

// Export factory function for custom instances
export const createApiClient = (config: ApiClientConfig) => new ApiClient(config);