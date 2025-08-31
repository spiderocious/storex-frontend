import { logger } from '@/utils/logger';
import type { ApiResponse } from '@/types';
import { API_CONFIG } from '../../configs';

class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string = '/api/v1') {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json'
    };
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private getHeaders(includeAuth: boolean = true): Record<string, string> {
    const headers = { ...this.defaultHeaders };
    
    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return headers;
  }

  async request<T>(
    endpoint: string, 
    options: RequestInit = {}, 
    requireAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      logger.debug(`API Request: ${options.method || 'GET'} ${url}`);
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(requireAuth),
          ...options.headers
        }
      });

      const data = await response.json();
      
      logger.debug(`API Response: ${response.status}`, data);
      
      if (!response.ok) {
        logger.error(`API Error: ${response.status}`, data);
        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      logger.error(`API Request Failed: ${url}`, error);
      throw error;
    }
  }

  // Convenience methods
  get<T>(endpoint: string, requireAuth: boolean = true) {
    return this.request<T>(endpoint, { method: 'GET' }, requireAuth);
  }

  post<T>(endpoint: string, body: any, requireAuth: boolean = true) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    }, requireAuth);
  }

  put<T>(endpoint: string, body: any, requireAuth: boolean = true) {
    return this.request<T>(endpoint, {
      method: 'PUT', 
      body: JSON.stringify(body)
    }, requireAuth);
  }

  delete<T>(endpoint: string, requireAuth: boolean = true) {
    return this.request<T>(endpoint, { method: 'DELETE' }, requireAuth);
  }

  // File upload with FormData
  uploadFile<T>(endpoint: string, formData: FormData, requireAuth: boolean = true) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers: {} // Let browser set Content-Type for FormData
    }, requireAuth);
  }
}

export const apiClient = new ApiClient(API_CONFIG.BASE_URL);