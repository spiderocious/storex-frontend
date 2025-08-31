export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface ApiError {
  error: string;
  status: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  count: number;
  total?: number;
  page?: number;
  limit?: number;
}