export const ROUTES = {
  // Auth routes
  SIGNUP: '/signup',
  LOGIN: '/login',
  
  // App routes
  DASHBOARD: '/dashboard',
  BUCKETS: '/buckets',
  BUCKET_CREATE: '/buckets/create',
  BUCKET_DETAILS: '/buckets/:bucketId',
  BUCKET_UPLOAD: '/buckets/:bucketId/upload',
  FILE_DETAILS: '/buckets/:bucketId/files/:fileId',
  
  // Public routes
  PUBLIC_FILE: '/file/:fileId'
} as const;

// Helper functions for dynamic routes
export const buildRoute = {
  bucketDetails: (bucketId: string) => `/buckets/${bucketId}`,
  fileDetails: (bucketId: string, fileId: string) => `/buckets/${bucketId}/files/${fileId}`,
  publicFile: (fileId: string) => `/file/${fileId}`
};