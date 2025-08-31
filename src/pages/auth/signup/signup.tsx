import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input, Card, ErrorBanner } from '@/components';
import { useAuth } from '@/providers/auth-provider';
import { logger } from '@/utils';
import { ROUTES } from '@/configs';
import type { SignupRequest } from '@/types';

export const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const validatePassword = (pass: string): string | null => {
    if (pass.length < 6 || pass.length > 128) {
      return 'Password must be between 6 and 128 characters';
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(pass)) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      const signupData: SignupRequest = { email, password };
      
      logger.log('Attempting signup', { email });
      
      await signup(signupData);
      
      logger.log('Signup successful, navigating to dashboard');
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Signup failed';
      setError(errorMessage);
      logger.error('Signup failed', { email, error: err });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4">
      <Card className="w-full max-w-md" padding="large">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-secondary mb-2">Create Account</h1>
          <p className="text-text-tertiary">Join File Service today</p>
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
            placeholder="Create a password"
            value={password}
            onChange={setPassword}
            required
            helperText="6-128 characters, must include uppercase, lowercase, and number"
            error={error && error.includes('password') ? error : undefined}
          />

          {error && !error.includes('email') && !error.includes('password') && (
            <ErrorBanner
              type="error"
              message={error}
              onDismiss={() => setError('')}
            />
          )}

          <Button
            type="submit"
            variant="primary"
            size="large"
            loading={isLoading}
            className="w-full"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-text-tertiary text-sm">
            Already have an account?{' '}
            <Link 
              to={ROUTES.LOGIN} 
              className="text-secondary hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};