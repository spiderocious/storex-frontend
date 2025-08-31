export interface UserData {
  id: string;
  email: string;
  createdAt: string;
  memberSince?: string;
}

export interface AuthResponse {
  user: UserData;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
}

export interface DashboardStats {
  totalBuckets: number;
  totalFiles: number;
  totalApiCalls: number;
}