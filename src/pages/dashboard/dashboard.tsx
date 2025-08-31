import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineDatabase, HiOutlineFolder, HiOutlineLightningBolt } from 'react-icons/hi';
import { StatCard, Card, Button, LoadingSpinner } from '@/components';
import { apiClient, logger } from '@/utils';
import { ROUTES, buildRoute } from '@/configs';
import type { UserData, DashboardStats, BucketData } from '@/types';

interface DashboardData {
  user: UserData;
  stats: DashboardStats;
  recentBuckets: BucketData[];
}

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      logger.log('Fetching dashboard data');
      
      const response = await apiClient.get<DashboardData>('/app/dashboard');
      
      setData(response.data!);
      setLoading(false);
      
      logger.log('Dashboard data loaded successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard';
      setError(errorMessage);
      setLoading(false);
      logger.error('Dashboard data fetch failed', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md" padding="large">
          <div className="text-center">
            <h2 className="text-xl font-bold text-secondary mb-2">Error Loading Dashboard</h2>
            <p className="text-text-tertiary mb-4">{error}</p>
            <Button onClick={fetchDashboardData}>Retry</Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <header className="bg-primary border-b border-hover">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-secondary">File Service</h1>
            <div className="flex items-center space-x-4">
              <span className="text-text-tertiary">{data.user.email}</span>
              <Button variant="ghost" size="small">Logout</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-secondary mb-2">
            Welcome back, {data.user.email}
          </h2>
          <p className="text-text-tertiary">
            Member since {formatDate(data.user.memberSince || data.user.createdAt)}
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Buckets"
            value={data.stats.totalBuckets}
            icon={<HiOutlineDatabase className="w-6 h-6" />}
            subtitle={`${data.stats.totalBuckets} active buckets`}
          />
          <StatCard
            title="Total Files"
            value={data.stats.totalFiles}
            icon={<HiOutlineFolder className="w-6 h-6" />}
            subtitle={`${data.stats.totalFiles} files stored`}
          />
          <StatCard
            title="API Calls"
            value={data.stats.totalApiCalls}
            icon={<HiOutlineLightningBolt className="w-6 h-6" />}
            subtitle={`${data.stats.totalApiCalls} requests made`}
          />
        </div>

        {/* Recent Buckets Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-secondary">Recent Buckets</h3>
            <Link to={ROUTES.BUCKETS}>
              <Button variant="secondary" size="medium">
                View All Buckets
              </Button>
            </Link>
          </div>

          {data.recentBuckets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.recentBuckets.map((bucket) => (
                <Card key={bucket.id} hoverable className="cursor-pointer">
                  <Link to={buildRoute.bucketDetails(bucket.id)}>
                    <div className="p-4">
                      <h4 className="font-semibold text-secondary mb-2">{bucket.name}</h4>
                      <div className="space-y-1 text-sm text-text-tertiary">
                        <p>{bucket.fileCount} files</p>
                        <p>{formatFileSize(bucket.totalSize)}</p>
                        <p>Updated {formatDate(bucket.lastUpdated || bucket.createdAt)}</p>
                      </div>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <Card padding="large">
              <div className="text-center py-8">
                <div className="text-6xl mb-4"><HiOutlineDatabase className="w-16 h-16 mx-auto text-text-tertiary" /></div>
                <h4 className="text-lg font-medium text-secondary mb-2">No buckets yet</h4>
                <p className="text-text-tertiary mb-4">
                  Create your first bucket to start storing files
                </p>
                <Link to={ROUTES.BUCKET_CREATE}>
                  <Button variant="primary">Create First Bucket</Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};