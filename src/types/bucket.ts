export interface BucketData {
  id: string;
  name: string;
  description?: string;
  ownerId?: string;
  fileCount: number;
  totalSize: number;
  publicKey?: string;
  privateKey?: string;
  createdAt: string;
  updatedAt: string;
  lastUpdated?: string;
}

export interface CreateBucketRequest {
  name: string;
}

export interface BucketStats {
  totalBuckets: number;
  totalFiles: number;
  totalSize: number;
}