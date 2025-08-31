import React from 'react';
import { HiOutlineEye, HiOutlineArrowDownTray, HiOutlineTrash, HiOutlineEllipsisVertical } from 'react-icons/hi2';
import { Button } from '@/components/ui/button';
import { FileTypeIcon } from '@/components/file/file-type-icon';
import { FEATURE_FLAGS } from '@/configs';
import type { FileData } from '@/types';

interface FileListItemProps {
  file: FileData;
  onView: (fileId: string) => void;
  onDownload: (fileId: string) => void;
  onDelete?: (fileId: string) => void;
  onMoreActions?: (fileId: string) => void;
  showActions?: boolean;
  className?: string;
}

export const FileListItem: React.FC<FileListItemProps> = ({
  file,
  onView,
  onDownload,
  onDelete,
  onMoreActions,
  showActions = true,
  className = ''
}) => {
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDownloads = (count: number) => {
    if (count === 0) return 'No downloads';
    if (count === 1) return '1 download';
    return `${count} downloads`;
  };

  return (
    <div className={`
      flex items-center gap-4 p-4 bg-primary hover:bg-hover rounded-lg transition-colors border border-transparent hover:border-gray-200
      ${className}
    `}>
      {/* File Type Icon */}
      <div className="flex-shrink-0">
        <FileTypeIcon fileType={file.type} size="medium" />
      </div>
      
      {/* File Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-medium text-secondary truncate">
            {file.originalName}
          </h3>
          {file.publicKey && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
              Public
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-4 text-sm text-text-tertiary">
          <span>{formatFileSize(file.size)}</span>
          <span>•</span>
          <span>{file.type.toUpperCase()}</span>
          <span>•</span>
          <span>{formatDownloads(file.downloads)}</span>
          <span>•</span>
          <span>Uploaded {formatDate(file.createdAt)}</span>
        </div>
      </div>
      
      {/* Actions */}
      {showActions && (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="small"
            onClick={() => onView(file.id)}
            icon={<HiOutlineEye className="w-4 h-4" />}
            title="View file"
          />
          
          <Button
            variant="ghost"
            size="small"
            onClick={() => onDownload(file.id)}
            icon={<HiOutlineArrowDownTray className="w-4 h-4" />}
            title="Download file"
          />
          
          {FEATURE_FLAGS.enableFileDelete && onDelete && (
            <Button
              variant="ghost"
              size="small"
              onClick={() => onDelete(file.id)}
              icon={<HiOutlineTrash className="w-4 h-4" />}
              title="Delete file"
            />
          )}
          
          {onMoreActions && (
            <Button
              variant="ghost"
              size="small"
              onClick={() => onMoreActions(file.id)}
              icon={<HiOutlineEllipsisVertical className="w-4 h-4" />}
              title="More actions"
            />
          )}
        </div>
      )}
    </div>
  );
};