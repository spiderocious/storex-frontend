import React, { useState, useEffect } from 'react';
import { apiClient } from '@/utils/api-client';
import { logger } from '@/utils/logger';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import type { FileData, DownloadResponse, FileViewMode } from '@/types';

interface FileViewerProps {
  fileId: string;
  mode?: FileViewMode;
  className?: string;
  showDetails?: boolean;
  onError?: (error: string) => void;
  onSuccess?: (file: FileData) => void;
}

export const FileViewer: React.FC<FileViewerProps> = ({
  fileId,
  mode = 'preview',
  className = '',
  showDetails = false,
  onError,
  onSuccess
}) => {
  const [fileData, setFileData] = useState<DownloadResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFileData();
  }, [fileId]);

  const fetchFileData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      logger.log('Fetching file data', { fileId, mode });
      
      const response = await apiClient.get<DownloadResponse>(
        `/public/file/download-uri/${fileId}`,
        false // No auth required for public endpoint
      );

      setFileData(response.data!);
      setLoading(false);
      onSuccess?.(response.data!.file);
      
      logger.log('File data fetched successfully', { 
        fileId, 
        type: response.data!.type,
        size: response.data!.file.size 
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load file';
      setError(errorMessage);
      setLoading(false);
      onError?.(errorMessage);
      
      logger.error('Failed to fetch file data', { fileId, error: err });
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderFileContent = () => {
    if (!fileData) return null;

    const { file, download } = fileData;
    const fileType = file.type.toLowerCase();

    // Image files
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileType)) {
      return (
        <div className="relative group">
          <img
            src={download.url}
            alt={file.originalName}
            className="max-w-full h-auto rounded-lg shadow-sm"
            onError={() => setError('Failed to load image')}
          />
          {mode !== 'embed' && (
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
              <Button
                variant="primary"
                size="medium"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => window.open(download.url, '_blank')}
              >
                Download
              </Button>
            </div>
          )}
        </div>
      );
    }

    // Video files
    if (['mp4', 'webm', 'mov', 'avi'].includes(fileType)) {
      return (
        <video
          controls
          className="max-w-full rounded-lg shadow-sm"
          preload="metadata"
        >
          <source src={download.url} type={`video/${fileType}`} />
          Your browser does not support video playback.
        </video>
      );
    }

    // Audio files
    if (['mp3', 'wav', 'aac', 'ogg', 'flac'].includes(fileType)) {
      return (
        <div className="bg-hover p-4 rounded-lg">
          <audio
            controls
            className="w-full"
            preload="metadata"
          >
            <source src={download.url} type={`audio/${fileType}`} />
            Your browser does not support audio playback.
          </audio>
        </div>
      );
    }

    // PDF files
    if (fileType === 'pdf') {
      return (
        <div className="bg-hover p-4 rounded-lg">
          <embed
            src={download.url}
            type="application/pdf"
            className="w-full h-96 rounded border border-hover"
          />
          <Button
            variant="primary"
            size="medium"
            className="mt-4"
            onClick={() => window.open(download.url, '_blank')}
          >
            Open in New Tab
          </Button>
        </div>
      );
    }

    // Default: Download interface for unsupported types
    return (
      <div className="flex flex-col items-center p-8 bg-hover rounded-lg">
        <div className="w-16 h-16 bg-accent rounded-lg flex items-center justify-center mb-4">
          <span className="text-2xl text-primary">📄</span>
        </div>
        <h3 className="text-lg font-semibold text-secondary mb-1">
          {file.originalName}
        </h3>
        <p className="text-sm text-text-tertiary mb-4">
          {formatFileSize(file.size)} • {fileType.toUpperCase()}
        </p>
        <Button
          variant="primary"
          size="medium"
          onClick={() => window.open(download.url, '_blank')}
        >
          Download File
        </Button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <LoadingSpinner size="medium" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-error rounded-lg p-4 ${className}`}>
        <p className="text-error font-medium">Error loading file</p>
        <p className="text-sm text-text-tertiary mt-1">{error}</p>
        <Button
          variant="secondary"
          size="small"
          className="mt-2"
          onClick={fetchFileData}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className={`file-viewer ${className}`}>
      {renderFileContent()}
      {showDetails && fileData && (
        <div className="mt-4 p-4 bg-hover rounded-lg">
          <h4 className="font-medium text-secondary mb-2">File Details</h4>
          <div className="space-y-1 text-sm">
            <div><span className="font-medium">Name:</span> {fileData.file.name}</div>
            <div><span className="font-medium">Size:</span> {formatFileSize(fileData.file.size)}</div>
            <div><span className="font-medium">Type:</span> {fileData.file.type}</div>
            <div><span className="font-medium">Downloads:</span> {fileData.file.downloads}</div>
          </div>
        </div>
      )}
    </div>
  );
};