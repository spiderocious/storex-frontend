import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HiOutlineCheck, HiOutlineArrowLeft } from 'react-icons/hi';
import { Button, Input, Card } from '@/components';
import { apiClient, logger } from '@/utils';
import { ROUTES, buildRoute } from '@/configs';
import type { CreateBucketRequest, BucketData } from '@/types';

export const CreateBucketPage: React.FC = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdBucket, setCreatedBucket] = useState<BucketData | null>(null);
  const navigate = useNavigate();

  const validateName = (bucketName: string): string | null => {
    if (bucketName.length < 3 || bucketName.length > 50) {
      return 'Bucket name must be between 3 and 50 characters';
    }
    if (!/^[a-zA-Z0-9\s\-_]+$/.test(bucketName)) {
      return 'Bucket name can only contain letters, numbers, spaces, hyphens, and underscores';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Client-side validation
    const nameError = validateName(name);
    if (nameError) {
      setError(nameError);
      setLoading(false);
      return;
    }

    try {
      const bucketData: CreateBucketRequest = { name };
      
      logger.log('Creating bucket', { name });
      
      const response = await apiClient.post<{ bucket: BucketData }>('/buckets/create', bucketData);
      
      setCreatedBucket(response.data!.bucket);
      
      logger.log('Bucket created successfully', { bucketId: response.data!.bucket.id });
      
      // Redirect after showing success message
      setTimeout(() => {
        navigate(buildRoute.bucketDetails(response.data!.bucket.id));
      }, 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create bucket';
      setError(errorMessage);
      logger.error('Bucket creation failed', { name, error: err });
    } finally {
      setLoading(false);
    }
  };

  // Success state
  if (createdBucket) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary px-4">
        <Card className="w-full max-w-2xl" padding="large">
          <div className="text-center">
            <div className="text-6xl mb-4"><HiOutlineCheck className="w-16 h-16 mx-auto text-green-500" /></div>
            <h1 className="text-2xl font-bold text-secondary mb-4">Bucket Created Successfully!</h1>
            <p className="text-text-tertiary mb-6">Your bucket "{createdBucket.name}" is ready to use.</p>
            
            <div className="bg-hover rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-secondary mb-3">API Keys</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <label className="font-medium text-text-secondary">Public Key:</label>
                  <div className="bg-primary border border-hover rounded p-2 mt-1 font-mono text-xs break-all">
                    {createdBucket.publicKey}
                  </div>
                </div>
                <div>
                  <label className="font-medium text-text-secondary">Private Key:</label>
                  <div className="bg-primary border border-hover rounded p-2 mt-1 font-mono text-xs break-all">
                    {createdBucket.privateKey}
                  </div>
                </div>
              </div>
              <p className="text-xs text-text-tertiary mt-3">
                Save these keys securely. You'll need them for API access.
              </p>
            </div>
            
            <div className="space-x-3">
              <Button 
                variant="primary" 
                onClick={() => navigate(buildRoute.bucketDetails(createdBucket.id))}
              >
                Go to Bucket
              </Button>
              <Link to={ROUTES.BUCKETS}>
                <Button variant="secondary">View All Buckets</Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <header className="bg-primary border-b border-hover">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to={ROUTES.DASHBOARD} className="text-xl font-bold text-secondary hover:text-accent">
              File Service
            </Link>
            <Button variant="ghost" size="small">Logout</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link to={ROUTES.BUCKETS} className="text-text-tertiary hover:text-secondary text-sm">
            <HiOutlineArrowLeft className="w-4 h-4 inline mr-1" /> Back to Buckets
          </Link>
          <h1 className="text-3xl font-bold text-secondary mt-2">Create New Bucket</h1>
        </div>

        <Card padding="large">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="text"
              label="Bucket Name"
              placeholder="Enter bucket name"
              value={name}
              onChange={setName}
              required
              helperText="3-50 characters, letters, numbers, spaces, hyphens, and underscores allowed"
              error={error}
            />

            <div className="flex space-x-3">
              <Button
                type="submit"
                variant="primary"
                size="large"
                loading={loading}
                className="flex-1"
              >
                {loading ? 'Creating...' : 'Create Bucket'}
              </Button>
              <Link to={ROUTES.BUCKETS}>
                <Button variant="secondary" size="large">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
};