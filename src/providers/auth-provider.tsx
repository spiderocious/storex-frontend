import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '@/utils/api-client';
import { logger } from '@/utils/logger';
import type { UserData, LoginRequest, SignupRequest } from '@/types';
import { STORAGE_KEYS } from '@/constants/storage-keys';

interface AuthState {
  user: UserData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (userData: SignupRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (!token) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      logger.log('Checking authentication status');
      
      const response = await apiClient.get<UserData>('/user/profile');
      
      if (response.success && response.data) {
        setAuthState({
          user: response.data,
          isLoading: false,
          isAuthenticated: true
        });
        logger.log('User authenticated successfully', { userId: response.data.id });
      } else {
        handleAuthError('Invalid token');
      }
    } catch (error) {
      logger.error('Auth check failed', error);
      handleAuthError('Authentication check failed');
    }
  };

  const handleAuthError = (errorMessage: string) => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false
    });
    logger.log('User logged out due to auth error', { reason: errorMessage });
  };

  const login = async (credentials: LoginRequest) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      logger.log('Attempting login', { email: credentials.email });
      
      const response = await apiClient.post<{ token: string; user: UserData }>(
        '/login',
        credentials,
        false
      );

      if (response.success && response.data) {
        const { token, user } = response.data;
        
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true
        });
        
        logger.log('Login successful', { userId: user.id });
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      logger.error('Login failed', error);
      throw error;
    }
  };

  const signup = async (userData: SignupRequest) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      logger.log('Attempting signup', { email: userData.email });
      
      const response = await apiClient.post<{ token: string; user: UserData }>(
        '/signup',
        userData,
        false
      );

      if (response.success && response.data) {
        const { token, user } = response.data;
        
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true
        });
        
        logger.log('Signup successful', { userId: user.id });
      } else {
        throw new Error('Signup failed');
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      logger.error('Signup failed', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false
    });
    logger.log('User logged out');
  };

  const refreshUser = async () => {
    try {
      const response = await apiClient.get<UserData>('/user/profile');
      
      if (response.success && response.data) {
        setAuthState(prev => ({
          ...prev,
          user: response.data!
        }));
        logger.log('User data refreshed');
      }
    } catch (error) {
      logger.error('Failed to refresh user data', error);
      handleAuthError('Failed to refresh user data');
    }
  };

  const contextValue: AuthContextType = {
    ...authState,
    login,
    signup,
    logout,
    refreshUser
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  console.log(context);
  if (context === undefined) {
    console.log('err');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};