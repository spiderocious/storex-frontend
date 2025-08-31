export interface FileData {
  id: string;
  name: string;
  originalName: string;
  type: string;
  size: number;
  downloads: number;
  publicKey?: string;
  metadata?: Record<string, any>;
  bucketId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DownloadInfo {
  url: string;
  expiresIn: number;
  method: string;
  cached: boolean;
}

export interface DownloadResponse {
  uri: string;
  type: string;
  file: FileData;
  download: DownloadInfo;
}

export interface UploadRequest {
  fileName?: string;
  fileType: string;
  fileSize: number;
  originalName?: string;
  metadata?: Record<string, any>;
}

export type FileViewMode = 'preview' | 'download' | 'info' | 'embed';