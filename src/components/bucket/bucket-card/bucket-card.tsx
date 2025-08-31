import React from 'react';
import { HiOutlineFolderOpen, HiOutlineEllipsisVertical, HiOutlineCalendar, HiOutlineDocumentText } from 'react-icons/hi2';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { BucketData } from '@/types';

interface BucketCardProps {
  bucket: BucketData;
  onView: (bucketId: string) => void;
  onSettings: (bucketId: string) => void;
  onDelete?: (bucketId: string) => void;
  className?: string;
}

export const BucketCard: React.FC<BucketCardProps> = ({
  bucket,
  onView,
  onSettings,
  onDelete: _onDelete,
  className = ''
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatFileCount = (count: number) => {
    if (count === 0) return 'No files';
    if (count === 1) return '1 file';
    return `${count} files`;
  };

  const handleCardClick = () => {
    onView(bucket.id);
  };

  return (
    <Card 
      className={`cursor-pointer hover:shadow-md transition-shadow ${className}`}
      onClick={handleCardClick}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <HiOutlineFolderOpen className="w-5 h-5 text-focus" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-secondary truncate">
                {bucket.name}
              </h3>
              <p className="text-sm text-text-tertiary">
                {bucket.publicKey ? 'Public' : 'Private'}
              </p>
            </div>
          </div>
          
          <div className="relative" data-action-button>
            <Button
              variant="ghost"
              size="small"
              onClick={() => onSettings(bucket.id)}
              icon={<HiOutlineEllipsisVertical className="w-4 h-4" />}
              title="More actions"
            />
          </div>
        </div>
        
        {bucket.description && (
          <p className="text-sm text-text-secondary mb-3 line-clamp-2">
            {bucket.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs text-text-tertiary">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <HiOutlineDocumentText className="w-4 h-4" />
              <span>{formatFileCount(bucket.fileCount || 0)}</span>
            </div>
            <div className="flex items-center gap-1">
              <HiOutlineCalendar className="w-4 h-4" />
              <span>{formatDate(bucket.createdAt)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4" data-action-button>
          <Button
            variant="primary"
            size="small"
            onClick={() => onView(bucket.id)}
            className="flex-1"
          >
            View Files
          </Button>
          <Button
            variant="secondary"
            size="small"
            onClick={() => onSettings(bucket.id)}
          >
            Settings
          </Button>
        </div>
      </div>
    </Card>
  );
};