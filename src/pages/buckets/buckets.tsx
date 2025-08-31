import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineDatabase } from 'react-icons/hi';
import { Card, Button, LoadingSpinner } from '@/components';
import { apiClient, logger } from '@/utils';
import { ROUTES, buildRoute } from '@/configs';
import type { BucketData } from '@/types';

interface BucketsResponse {
  buckets: BucketData[];
  count: number;
}

export const BucketsPage: React.FC = () => {
  const [buckets, setBuckets] = useState<BucketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBuckets();
  }, []);

  const fetchBuckets = async () => {
    try {
      logger.log('Fetching buckets');
      
      const response = await apiClient.get<BucketsResponse>('/buckets');
      
      setBuckets(response.data!.buckets);
      setLoading(false);
      
      logger.log('Buckets loaded successfully', { count: response.data!.count });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load buckets';
      setError(errorMessage);
      setLoading(false);
      logger.error('Buckets fetch failed', err);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-secondary">My Buckets</h1>
          <Link to={ROUTES.BUCKET_CREATE}>
            <Button variant="primary" size="medium">
              Create Bucket
            </Button>
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-error rounded-lg p-4 mb-6">
            <p className="text-error">{error}</p>
            <Button variant="secondary" size="small" className="mt-2" onClick={fetchBuckets}>
              Retry
            </Button>
          </div>
        )}

        {buckets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buckets.map((bucket) => (
              <Card key={bucket.id} hoverable>
                <Link to={buildRoute.bucketDetails(bucket.id)}>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-secondary">{bucket.name}</h3>
                      <div className="text-2xl"><HiOutlineDatabase className="w-6 h-6" /></div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-text-tertiary">
                      <div className="flex justify-between">
                        <span>Files:</span>
                        <span className="font-medium">{bucket.fileCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Size:</span>
                        <span className="font-medium">{formatFileSize(bucket.totalSize)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Created:</span>
                        <span className="font-medium">{formatDate(bucket.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <Card padding="large">
            <div className="text-center py-12">
              <div className="text-8xl mb-6"><HiOutlineDatabase className="w-20 h-20 mx-auto text-text-tertiary" /></div>
              <h3 className="text-xl font-semibold text-secondary mb-2">No buckets yet</h3>
              <p className="text-text-tertiary mb-6">
                Create your first bucket to start organizing and storing files
              </p>
              <Link to={ROUTES.BUCKET_CREATE}>
                <Button variant="primary" size="large">
                  Create Your First Bucket
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};