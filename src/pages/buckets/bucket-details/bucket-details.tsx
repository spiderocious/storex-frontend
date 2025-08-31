import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiOutlinePlus } from 'react-icons/hi2';
import { LoadingSpinner, ErrorBanner, Modal, Button } from '@/components';
import { BucketHeader } from '@/components/bucket';
import { FileListItem, FileUploadZone } from '@/components/file';
import { Navbar } from '@/components/layout';
import { apiClient, logger } from '@/utils';
import type { BucketData, FileData } from '@/types';
import { API_CONFIG } from '../../../configs';

interface BucketResponse {
  bucket: BucketData;
}

interface BucketFilesResponse {
  files: FileData[];
  count: number;
  bucketId: string;
}

export const BucketDetailsPage: React.FC = () => {
  const { bucketId } = useParams<{ bucketId: string }>();
  const navigate = useNavigate();
  
  const [bucket, setBucket] = useState<BucketData | null>(null);
  const [files, setFiles] = useState<FileData[]>([]);
  const [totalFiles, setTotalFiles] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (bucketId) {
      fetchBucketDetails();
    }
  }, [bucketId]);

  const fetchBucketDetails = async () => {
    if (!bucketId) return;
    
    try {
      setLoading(true);
      setError('');
      
      logger.log('Fetching bucket and files', { bucketId });
      
      // Fetch bucket details
      const bucketResponse = await apiClient.get<BucketResponse>(`/buckets/${bucketId}`);
      
      // Fetch bucket files  
      const filesResponse = await apiClient.get<BucketFilesResponse>(`/buckets/${bucketId}/files`);
      
      setBucket(bucketResponse.data!.bucket);
      setFiles(filesResponse.data!.files);
      setTotalFiles(filesResponse.data!.count);
      setLoading(false);
      
      logger.log('Bucket and files loaded successfully', {
        bucketId,
        fileCount: filesResponse.data!.count
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load bucket details';
      setError(errorMessage);
      setLoading(false);
      logger.error('Bucket details fetch failed', { bucketId, error: err });
    }
  };

  const handleFileUpload = async (files: File[]) => {
    if (!bucketId || !bucket?.publicKey || uploading) return;
    
    try {
      setUploading(true);
      
      logger.log('Starting file upload', { bucketId, fileCount: files.length });
      
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);
        formData.append('metadata', JSON.stringify({}));
        
        // Use public upload endpoint with bucket's public key
        const response = await fetch(`${API_CONFIG.BASE_URL}/public/file/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${bucket.publicKey}`
          },
          body: formData
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Upload failed');
        }
        
        logger.log('File uploaded successfully', { fileName: file.name });
      }
      
      setIsUploadModalOpen(false);
      await fetchBucketDetails();
      
      logger.log('All files uploaded successfully');
    } catch (error) {
      logger.error('File upload failed', error);
      setError(error instanceof Error ? error.message : 'File upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFileView = (fileId: string) => {
    navigate(`/buckets/${bucketId}/files/${fileId}`);
  };

  const handleFileDownload = async (fileId: string) => {
    try {
      logger.log('Downloading file', { fileId });
      
      const response = await apiClient.get<any>(`/public/file/download-uri/${fileId}`, false);
      
      if (response.success && response.data?.download?.url) {
        window.open(response.data.download.url, '_blank');
        logger.log('File download initiated', { fileId });
      }
    } catch (error) {
      logger.error('File download failed', { fileId, error });
      setError(error instanceof Error ? error.message : 'Download failed');
    }
  };

  const handleFileDelete = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    
    try {
      logger.log('Deleting file', { fileId });
      
      await apiClient.delete(`/files/${fileId}`);
      await fetchBucketDetails();
      
      logger.log('File deleted successfully', { fileId });
    } catch (error) {
      logger.error('File deletion failed', { fileId, error });
      setError(error instanceof Error ? error.message : 'Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary">
        <Navbar />
        <div className="flex items-center justify-center pt-20">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  if (error && !bucket) {
    return (
      <div className="min-h-screen bg-primary">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <ErrorBanner
            type="error"
            title="Failed to load bucket"
            message={error}
            showRetry
            onRetry={fetchBucketDetails}
          />
        </div>
      </div>
    );
  }

  if (!bucket) return null;

  return (
    <div className="min-h-screen bg-primary">
      <Navbar />
      
      <BucketHeader
        bucket={bucket}
        onUpload={() => setIsUploadModalOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <ErrorBanner
            type="error"
            message={error}
            onDismiss={() => setError('')}
            className="mb-6"
          />
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-secondary">
            Files ({totalFiles})
          </h2>
          
          <Button
            variant="primary"
            size="medium"
            onClick={() => setIsUploadModalOpen(true)}
            icon={<HiOutlinePlus className="w-4 h-4" />}
          >
            Upload Files
          </Button>
        </div>

        {files.length > 0 ? (
          <div className="space-y-2">
            {files.map((file) => (
              <FileListItem
                key={file.id}
                file={file}
                onView={handleFileView}
                onDownload={handleFileDownload}
                onDelete={handleFileDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-hover rounded-lg">
            <h3 className="text-lg font-medium text-secondary mb-2">
              No files in this bucket
            </h3>
            <p className="text-text-tertiary mb-6">
              Upload your first file to get started
            </p>
            <Button
              variant="primary"
              size="medium"
              onClick={() => setIsUploadModalOpen(true)}
              icon={<HiOutlinePlus className="w-4 h-4" />}
            >
              Upload Files
            </Button>
          </div>
        )}
      </main>

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Files"
        size="large"
      >
        <div className="space-y-4">
          <p className="text-text-secondary">
            Upload files to <strong>{bucket.name}</strong>
          </p>
          
          <FileUploadZone
            onFilesSelected={handleFileUpload}
            multiple
            disabled={uploading}
          />
          
          {uploading && (
            <div className="flex items-center justify-center py-4">
              <LoadingSpinner size="medium" />
              <span className="ml-3 text-text-secondary">Uploading files...</span>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};