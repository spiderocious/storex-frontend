import React, { useState } from 'react';
import { HiOutlineFolderOpen, HiOutlineClipboard } from 'react-icons/hi2';
import { Button } from '@/components/ui/button';
import { ErrorBanner } from '@/components/ui/error-banner';
import type { BucketData } from '@/types';

interface BucketHeaderProps {
  bucket: BucketData;
  onUpload: () => void;
  className?: string;
}

export const BucketHeader: React.FC<BucketHeaderProps> = ({
  bucket,
  onUpload,
  className = ''
}) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileCount = (count: number) => {
    if (count === 0) return 'No files';
    if (count === 1) return '1 file';
    return `${count} files`;
  };

  const copyPublicKey = async () => {
    if (!bucket.publicKey) return;
    
    try {
      await navigator.clipboard.writeText(bucket.publicKey);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy public key:', error);
    }
  };

  return (
    <div className={`bg-primary border-b border-hover ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {copySuccess && (
          <ErrorBanner
            type="success"
            message="Public key copied to clipboard"
            dismissible={false}
            className="mb-4"
          />
        )}
        
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
              <HiOutlineFolderOpen className="w-6 h-6 text-focus" />
            </div>
            
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold text-secondary mb-1">
                {bucket.name}
              </h1>
              
              {bucket.description && (
                <p className="text-text-secondary mb-3">
                  {bucket.description}
                </p>
              )}
              
              <div className="flex flex-wrap gap-4 text-sm text-text-tertiary">
                <span>
                  {formatFileCount(bucket.fileCount || 0)}
                </span>
                <span>•</span>
                <span>
                  Created {formatDate(bucket.createdAt)}
                </span>
                <span>•</span>
                <span className={bucket.publicKey ? 'text-green-600' : 'text-text-tertiary'}>
                  {bucket.publicKey ? 'Public' : 'Private'}
                </span>
              </div>
              
              {bucket.publicKey && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-sm text-text-tertiary">Public Key:</span>
                  <code className="text-sm bg-hover px-2 py-1 rounded font-mono">
                    {bucket.publicKey}
                  </code>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={copyPublicKey}
                    icon={<HiOutlineClipboard className="w-4 h-4" />}
                    title="Copy public key"
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="medium"
              onClick={onUpload}
            >
              Upload Files
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};