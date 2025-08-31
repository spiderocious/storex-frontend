import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input, Card } from '@/components';
import { apiClient, logger } from '@/utils';
import { ROUTES } from '@/configs';
import type { LoginRequest, AuthResponse } from '@/types';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const loginData: LoginRequest = { email, password };
      
      logger.log('Attempting login', { email });
      
      const response = await apiClient.post<AuthResponse>('/login', loginData, false);
      
      // Store token
      localStorage.setItem('auth_token', response.data!.token);
      
      logger.log('Login successful', { userId: response.data!.user.id });
      
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      logger.error('Login failed', { email, error: err });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4">
      <Card className="w-full max-w-md" padding="large">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-secondary mb-2">Sign In</h1>
          <p className="text-text-tertiary">Welcome back to File Service</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChange={setEmail}
            required
            error={error && error.includes('email') ? error : undefined}
          />

          <Input
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={setPassword}
            required
            error={error && error.includes('password') ? error : undefined}
          />

          {error && !error.includes('email') && !error.includes('password') && (
            <div className="bg-red-50 border border-error rounded-lg p-3">
              <p className="text-error text-sm">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="large"
            loading={loading}
            className="w-full"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-text-tertiary text-sm">
            Don't have an account?{' '}
            <Link 
              to={ROUTES.SIGNUP} 
              className="text-secondary hover:underline font-medium"
            >
              Create one
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};