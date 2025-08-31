import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { HiOutlineCloudArrowUp, HiOutlineXMark } from 'react-icons/hi2';
import { Button } from '@/components/ui/button';
import { ErrorBanner } from '@/components/ui/error-banner';

interface FileUploadZone {
  onFilesSelected: (files: File[]) => void;
  multiple?: boolean;
  maxFileSize?: number; // in bytes
  acceptedTypes?: string[];
  disabled?: boolean;
  className?: string;
}

interface UploadingFile {
  file: File;
  progress: number;
  error?: string;
}

export const FileUploadZone: React.FC<FileUploadZone> = ({
  onFilesSelected,
  multiple = true,
  maxFileSize = 100 * 1024 * 1024, // 100MB
  acceptedTypes,
  disabled = false,
  className = ''
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFiles = (files: File[]): { valid: File[], errors: string[] } => {
    const valid: File[] = [];
    const errors: string[] = [];

    files.forEach(file => {
      // Check file size
      if (file.size > maxFileSize) {
        errors.push(`${file.name} is too large (${formatFileSize(file.size)}). Maximum size is ${formatFileSize(maxFileSize)}.`);
        return;
      }

      // Check file type if specified
      if (acceptedTypes && acceptedTypes.length > 0) {
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        if (!fileExtension || !acceptedTypes.includes(fileExtension)) {
          errors.push(`${file.name} is not an accepted file type. Accepted types: ${acceptedTypes.join(', ')}`);
          return;
        }
      }

      valid.push(file);
    });

    return { valid, errors };
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setError(null);
    const fileArray = Array.from(files);
    
    if (!multiple && fileArray.length > 1) {
      setError('Only one file can be uploaded at a time.');
      return;
    }

    const { valid, errors } = validateFiles(fileArray);
    
    if (errors.length > 0) {
      setError(errors.join(' '));
      return;
    }

    if (valid.length > 0) {
      onFilesSelected(valid);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    handleFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleBrowseClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const removeUploadingFile = (index: number) => {
    setUploadingFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getAcceptAttribute = () => {
    if (!acceptedTypes || acceptedTypes.length === 0) return undefined;
    return acceptedTypes.map(type => `.${type}`).join(',');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {error && (
        <ErrorBanner
          type="error"
          message={error}
          onDismiss={() => setError(null)}
        />
      )}
      
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragOver && !disabled ? 'border-focus bg-blue-50' : 'border-gray-300'}
          ${disabled ? 'bg-hover border-gray-200 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={getAcceptAttribute()}
          onChange={handleFileInput}
          disabled={disabled}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center ${disabled ? 'bg-gray-200' : 'bg-accent'}`}>
            <HiOutlineCloudArrowUp className={`w-6 h-6 ${disabled ? 'text-gray-400' : 'text-focus'}`} />
          </div>
          
          <div>
            <h3 className={`text-lg font-medium ${disabled ? 'text-text-disabled' : 'text-secondary'}`}>
              {isDragOver ? 'Drop files here' : 'Drop files to upload'}
            </h3>
            <p className={`text-sm mt-1 ${disabled ? 'text-text-disabled' : 'text-text-tertiary'}`}>
              or{' '}
              <span className={disabled ? 'text-text-disabled' : 'text-focus font-medium'}>
                browse files
              </span>
              {' '}from your computer
            </p>
          </div>
          
          <div className={`text-xs ${disabled ? 'text-text-disabled' : 'text-text-tertiary'}`}>
            <p>Maximum file size: {formatFileSize(maxFileSize)}</p>
            {acceptedTypes && acceptedTypes.length > 0 && (
              <p>Accepted types: {acceptedTypes.join(', ')}</p>
            )}
            {multiple && <p>Multiple files allowed</p>}
          </div>
        </div>
      </div>
      
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-secondary">Uploading Files</h4>
          {uploadingFiles.map((uploadingFile, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-hover rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-secondary truncate">
                  {uploadingFile.file.name}
                </p>
                <p className="text-xs text-text-tertiary">
                  {formatFileSize(uploadingFile.file.size)}
                </p>
                
                {uploadingFile.error ? (
                  <p className="text-xs text-error mt-1">{uploadingFile.error}</p>
                ) : (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-focus h-1 rounded-full transition-all"
                        style={{ width: `${uploadingFile.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-text-tertiary mt-1">
                      {uploadingFile.progress}% uploaded
                    </p>
                  </div>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="small"
                onClick={() => removeUploadingFile(index)}
                icon={<HiOutlineXMark className="w-4 h-4" />}
                title="Remove file"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};