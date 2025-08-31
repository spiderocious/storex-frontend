export interface BucketData {
  id: string;
  name: string;
  ownerId?: string;
  fileCount: number;
  totalSize: number;
  publicKey?: string;
  privateKey?: string;
  createdAt: string;
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