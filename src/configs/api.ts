export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  TIMEOUT: 30000,
  MAX_FILE_SIZE: 104857600, // 100MB
  SUPPORTED_FILE_TYPES: [
    // Images
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
    // Videos
    'video/mp4', 'video/webm', 'video/mov', 'video/avi',
    // Audio
    'audio/mp3', 'audio/wav', 'audio/aac', 'audio/ogg',
    // Documents
    'application/pdf', 'text/plain', 'application/msword',
    // Archives
    'application/zip', 'application/x-rar-compressed'
  ]
};