# File Service App - Technical Documentation

## Project Overview

This document outlines the technical architecture, tooling decisions, and implementation strategy for building a React-based file service web application with cloud storage capabilities.

## Technology Stack & Decision Matrix

### Core Framework: React 18+ with TypeScript
**Why React?**
-  Component-based architecture aligns with our reusable component strategy
-  Excellent TypeScript support for type safety
-  Large ecosystem for file handling libraries
-  Great tooling integration with Vite

**Why TypeScript?**
-  Prevents runtime errors with compile-time type checking
-  Better IDE support and developer experience
-  Self-documenting code with interfaces
-  Easier refactoring and maintenance

### Build Tool: Vite
**Why Vite over Create React App?**
-  Faster development server with Hot Module Replacement
-  Faster builds using esbuild
-  Better tree-shaking and code splitting
-  Native TypeScript support
-  Smaller bundle sizes

### Routing: React Router v6
**Why React Router?**
-  Industry standard for React routing
-  Supports nested routes for our bucket/file hierarchy
-  Built-in lazy loading support
-  Type-safe route definitions with TypeScript

### Styling: Tailwind CSS
**Why Tailwind over CSS-in-JS?**
-  Utility-first approach reduces CSS bundle size
-  Consistent design system through configuration
-  No runtime CSS generation (better performance)
-  Easier to maintain consistent spacing/colors
-  Great responsive design utilities

### Testing: Jest + React Testing Library
**Why Jest + RTL?**
-  Jest provides snapshot testing for component regression
-  RTL promotes accessibility-focused testing
-  Great TypeScript support
-  Comprehensive mocking capabilities for API calls

## Project Architecture

### Domain-Driven Design Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI elements
│   │   ├── button/
│   │   │   ├── index.ts
│   │   │   ├── button.tsx
│   │   │   └── button.test.tsx
│   │   └── index.ts     # Barrel export
│   ├── file/            # File domain components
│   │   ├── file-viewer/
│   │   │   ├── index.ts
│   │   │   ├── file-viewer.tsx
│   │   │   └── file-viewer.test.tsx
│   │   └── index.ts
│   └── index.ts         # Root barrel export
├── pages/               # Page components
│   ├── auth/
│   │   ├── login/
│   │   ├── signup/
│   │   └── index.ts
│   ├── dashboard/
│   ├── buckets/
│   └── index.ts
├── configs/             # Configuration files
│   ├── api.ts
│   ├── routes.ts
│   └── index.ts
├── routes/              # Route definitions
│   ├── auth-routes.tsx
│   ├── app-routes.tsx
│   └── index.ts
├── types/               # TypeScript type definitions
│   ├── api.ts
│   ├── file.ts
│   ├── user.ts
│   └── index.ts
├── utils/               # Utility functions
│   ├── logger/
│   │   ├── index.ts
│   │   └── logger.ts
│   ├── api-client/
│   │   ├── index.ts
│   │   └── api-client.ts
│   └── index.ts
├── hooks/               # Custom React hooks
│   ├── use-api.ts
│   ├── use-file.ts
│   └── index.ts
└── providers/           # Context providers
    ├── auth-provider.tsx
    ├── error-boundary.tsx
    └── index.ts
```

### File Naming Convention: Snake Case
- **Components**: `file-viewer/`, `upload-zone/`, `bucket-card/`
- **Pages**: `bucket-details/`, `file-upload/`
- **Utils**: `api-client/`, `format-size/`
- **Hooks**: `use-auth.ts`, `use-file-upload.ts`

### Barrel Exports Strategy
Every folder includes an `index.ts` file that exports all public interfaces:

```typescript
// src/components/ui/index.ts
export { Button } from './button';
export { Input } from './input';
export { Card } from './card';
export { Modal } from './modal';

// src/components/index.ts
export * from './ui';
export * from './file';
export * from './bucket';

// Usage in pages
import { Button, Input, FileViewer } from '@/components';
```

## Configuration Setup

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand colors
        primary: '#FFFFFF',
        secondary: '#000000',
        accent: '#1F2937',
        
        // Interactive states
        hover: '#F3F4F6',
        active: '#6B7280',
        focus: '#3B82F6',
        
        // Status colors
        error: '#EF4444',
        success: '#10B981',
        warning: '#F59E0B',
        
        // Text colors
        text: {
          primary: '#000000',
          secondary: '#1F2937',
          tertiary: '#6B7280',
          disabled: '#9CA3AF'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'base': '16px',
        'lg': '18px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '32px'
      }
    }
  },
  plugins: []
};
```

### Named Routes Configuration
```typescript
// src/configs/routes.ts
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
```

## Utility Systems

### Logger Utility
```typescript
// src/utils/logger/logger.ts
interface LogLevel {
  ERROR: 0;
  WARN: 1;
  INFO: 2;
  DEBUG: 3;
}

interface LoggerConfig {
  enabled: boolean;
  level: keyof LogLevel;
  externalService?: {
    endpoint: string;
    apiKey: string;
  };
}

class Logger {
  private config: LoggerConfig;
  private levels: LogLevel = { ERROR: 0, WARN: 1, INFO: 2, DEBUG: 3 };

  constructor(config: LoggerConfig = { enabled: true, level: 'INFO' }) {
    this.config = config;
  }

  private shouldLog(level: keyof LogLevel): boolean {
    if (!this.config.enabled) return false;
    return this.levels[level] <= this.levels[this.config.level];
  }

  private async sendToExternal(level: string, message: string, data?: any) {
    if (!this.config.externalService) return;
    
    try {
      await fetch(this.config.externalService.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.externalService.apiKey}`
        },
        body: JSON.stringify({
          level,
          message,
          data,
          timestamp: new Date().toISOString(),
          source: 'file-service-app'
        })
      });
    } catch (error) {
      console.error('Failed to send log to external service:', error);
    }
  }

  log(message: string, data?: any) {
    if (!this.shouldLog('INFO')) return;
    console.log(`[INFO] ${message}`, data || '');
    this.sendToExternal('INFO', message, data);
  }

  error(message: string, error?: any) {
    if (!this.shouldLog('ERROR')) return;
    console.error(`[ERROR] ${message}`, error || '');
    this.sendToExternal('ERROR', message, error);
  }

  warn(message: string, data?: any) {
    if (!this.shouldLog('WARN')) return;
    console.warn(`[WARN] ${message}`, data || '');
    this.sendToExternal('WARN', message, data);
  }

  debug(message: string, data?: any) {
    if (!this.shouldLog('DEBUG')) return;
    console.debug(`[DEBUG] ${message}`, data || '');
    this.sendToExternal('DEBUG', message, data);
  }

  updateConfig(newConfig: Partial<LoggerConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  disable() {
    this.config.enabled = false;
  }

  enable() {
    this.config.enabled = true;
  }
}

// Global logger instance
export const logger = new Logger({
  enabled: process.env.NODE_ENV !== 'production',
  level: process.env.NODE_ENV === 'development' ? 'DEBUG' : 'INFO'
});

// src/utils/logger/index.ts
export { logger } from './logger';
export type { LoggerConfig } from './logger';
```

### API Client Utility
```typescript
// src/utils/api-client/api-client.ts
import { logger } from '@/utils/logger';

interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string = '/api/v1') {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json'
    };
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private getHeaders(includeAuth: boolean = true): Record<string, string> {
    const headers = { ...this.defaultHeaders };
    
    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return headers;
  }

  async request<T>(
    endpoint: string, 
    options: RequestInit = {}, 
    requireAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      logger.debug(`API Request: ${options.method || 'GET'} ${url}`);
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(requireAuth),
          ...options.headers
        }
      });

      const data = await response.json();
      
      logger.debug(`API Response: ${response.status}`, data);
      
      if (!response.ok) {
        logger.error(`API Error: ${response.status}`, data);
        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      logger.error(`API Request Failed: ${url}`, error);
      throw error;
    }
  }

  // Convenience methods
  get<T>(endpoint: string, requireAuth: boolean = true) {
    return this.request<T>(endpoint, { method: 'GET' }, requireAuth);
  }

  post<T>(endpoint: string, body: any, requireAuth: boolean = true) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    }, requireAuth);
  }

  put<T>(endpoint: string, body: any, requireAuth: boolean = true) {
    return this.request<T>(endpoint, {
      method: 'PUT', 
      body: JSON.stringify(body)
    }, requireAuth);
  }

  delete<T>(endpoint: string, requireAuth: boolean = true) {
    return this.request<T>(endpoint, { method: 'DELETE' }, requireAuth);
  }
}

export const apiClient = new ApiClient();
```

## Error Boundary Implementation

### Global Error Boundary
```typescript
// src/providers/error-boundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '@/utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('React Error Boundary caught an error', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-black mb-4">
              Something went wrong
            </h1>
            <p className="text-accent mb-6">
              We're sorry for the inconvenience. Please refresh the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-hover"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## Testing Strategy

### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/test/**/*'
  ],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{ts,tsx}'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': ['@swc/jest']
  }
};
```

### Test Setup
```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
import { server } from './mocks/server';

// Mock API server
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock logger in tests
jest.mock('@/utils/logger', () => ({
  logger: {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }
}));
```

### Snapshot Testing Setup
```typescript
// src/components/ui/button/button.test.tsx
import { render } from '@testing-library/react';
import { Button } from './button';

describe('Button Component', () => {
  it('renders primary button correctly', () => {
    const { container } = render(
      <Button variant="primary" size="medium">
        Click me
      </Button>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders all variants correctly', () => {
    const variants = ['primary', 'secondary', 'danger', 'ghost'] as const;
    
    variants.forEach(variant => {
      const { container } = render(
        <Button variant={variant} size="medium">
          {variant} button
        </Button>
      );
      expect(container.firstChild).toMatchSnapshot(`button-${variant}`);
    });
  });
});
```

## Key Architectural Decisions

### 1. Domain-Driven Architecture
**Why?**
-  Clear separation of concerns
-  Easier to navigate codebase
-  Better code organization for team development
-  Scales well as features grow

**Implementation**:
- Group related components by domain (file, bucket, auth)
- Separate business logic from UI components
- Use barrel exports for clean imports

### 2. Snake Case File Naming
**Why?**
-  Consistent with backend naming conventions
-  Avoids case sensitivity issues across platforms
-  Clearer separation of words
-  Easier to search and filter files

### 3. Folder-per-Component Structure
**Why?**
-  Co-locates component, tests, and related files
-  Easier to refactor and move components
-  Clear ownership and boundaries
-  Supports component-specific assets

**Example Structure**:
```
file-viewer/
├── index.ts              # Barrel export
├── file-viewer.tsx       # Main component
├── file-viewer.test.tsx  # Tests
├── file-viewer.types.ts  # Type definitions
└── file-viewer.stories.tsx # Storybook stories (optional)
```

### 4. Centralized Route Management
**Why?**
-  Single source of truth for all routes
-  Type-safe route building functions
-  Easier to refactor routes
-  Prevents hardcoded route strings

### 5. Logger Utility Design
**Implementation Strategy**:
```typescript
// src/utils/logger/index.ts
import { Logger } from './logger';

// Environment-based configuration
const loggerConfig = {
  enabled: process.env.NODE_ENV !== 'production',
  level: process.env.VITE_LOG_LEVEL || 'INFO',
  externalService: process.env.VITE_LOG_ENDPOINT ? {
    endpoint: process.env.VITE_LOG_ENDPOINT,
    apiKey: process.env.VITE_LOG_API_KEY
  } : undefined
};

export const logger = new Logger(loggerConfig);

// Easy global control
export const disableLogging = () => logger.disable();
export const enableLogging = () => logger.enable();
```

**Usage Examples**:
```typescript
import { logger } from '@/utils/logger';

// In components
logger.log('File upload started', { fileId, bucketId });
logger.error('Upload failed', error);

// Disable all logging globally
import { disableLogging } from '@/utils/logger';
disableLogging();
```

## Component Implementation Patterns

### 1. FileViewer Component Architecture
```typescript
// src/components/file/file-viewer/file-viewer.tsx
import { useState, useEffect } from 'react';
import { apiClient } from '@/utils/api-client';
import { logger } from '@/utils/logger';
import { FileData, DownloadResponse } from '@/types';

interface FileViewerProps {
  fileId: string;
  mode?: 'preview' | 'download' | 'info' | 'embed';
  className?: string;
  showDetails?: boolean;
  onError?: (error: string) => void;
  onSuccess?: (file: FileData) => void;
}

export const FileViewer: React.FC<FileViewerProps> = ({
  fileId,
  mode = 'preview',
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
      logger.log('Fetching file data', { fileId, mode });
      
      const response = await apiClient.get<DownloadResponse>(
        `/public/file/download-uri/${fileId}`,
        false // No auth required for public endpoint
      );

      setFileData(response.data);
      setLoading(false);
      onSuccess?.(response.data);
      
      logger.log('File data fetched successfully', { 
        fileId, 
        type: response.data.type,
        size: response.data.file.size 
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load file';
      setError(errorMessage);
      setLoading(false);
      onError?.(errorMessage);
      
      logger.error('Failed to fetch file data', { fileId, error: err });
    }
  };

  const renderFileContent = () => {
    if (!fileData) return null;

    const { file, download } = fileData;
    const fileType = file.type.toLowerCase();

    // Image files
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileType)) {
      return (
        <img
          src={download.url}
          alt={file.originalName}
          className="max-w-full h-auto rounded-lg shadow-sm"
          onError={() => setError('Failed to load image')}
        />
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
        <audio
          controls
          className="w-full"
          preload="metadata"
        >
          <source src={download.url} type={`audio/${fileType}`} />
          Your browser does not support audio playback.
        </audio>
      );
    }

    // PDF files
    if (fileType === 'pdf') {
      return (
        <embed
          src={download.url}
          type="application/pdf"
          className="w-full h-96 rounded-lg border border-hover"
        />
      );
    }

    // Default: Download interface
    return (
      <div className="flex flex-col items-center p-8 bg-hover rounded-lg">
        <FileTypeIcon fileType={fileType} size="large" />
        <h3 className="mt-4 text-lg font-semibold text-black">
          {file.originalName}
        </h3>
        <p className="text-sm text-accent mt-1">
          {formatFileSize(file.size)} • {fileType.toUpperCase()}
        </p>
        <Button
          variant="primary"
          size="medium"
          className="mt-4"
          onClick={() => window.open(download.url, '_blank')}
        >
          Download File
        </Button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="bg-hover rounded-lg h-48 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-error rounded-lg p-4">
        <p className="text-error font-medium">Error loading file</p>
        <p className="text-sm text-accent mt-1">{error}</p>
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
    <div className={`file-viewer ${className || ''}`}>
      {renderFileContent()}
      {showDetails && fileData && (
        <FileInfoCard file={fileData.file} className="mt-4" />
      )}
    </div>
  );
};
```

## Development Workflow

### 1. Component Development Process
1. **Create Component Folder**: `src/components/domain/component-name/`
2. **Define Types**: Create `.types.ts` file with interfaces
3. **Implement Component**: Create `.tsx` file with implementation
4. **Write Tests**: Create `.test.tsx` with unit tests and snapshots
5. **Export**: Add to barrel export in `index.ts`
6. **Document**: Add to Storybook (optional)

### 2. Page Development Process  
1. **Define Route**: Add to `src/configs/routes.ts`
2. **Create Page Folder**: `src/pages/domain/page-name/`
3. **Implement Page**: Compose using existing components
4. **Add to Router**: Include in route configuration
5. **Test Integration**: Write integration tests

### 3. Utility Development Process
1. **Create Utility Folder**: `src/utils/utility-name/`
2. **Implement Logic**: Single responsibility principle
3. **Add Tests**: Comprehensive unit tests
4. **Export**: Add to barrel export
5. **Document**: Include usage examples

## Type Definitions

### Core Types
```typescript
// src/types/file.ts
export interface FileData {
  id: string;
  name: string;
  originalName: string;
  type: string;
  size: number;
  downloads: number;
  metadata?: Record<string, any>;
  bucketId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface DownloadResponse {
  uri: string;
  type: string;
  file: FileData;
  download: {
    url: string;
    expiresIn: number;
    method: string;
    cached: boolean;
  };
}

// src/types/bucket.ts
export interface BucketData {
  id: string;
  name: string;
  ownerId?: string;
  fileCount: number;
  totalSize: number;
  publicKey?: string;
  privateKey?: string;
  createdAt: string;
}

// src/types/user.ts
export interface UserData {
  id: string;
  email: string;
  createdAt: string;
  memberSince?: string;
}

export interface AuthResponse {
  user: UserData;
  token: string;
}
```

## Performance Optimizations

### 1. Code Splitting
```typescript
// src/pages/index.ts
import { lazy } from 'react';

export const LoginPage = lazy(() => import('./auth/login'));
export const DashboardPage = lazy(() => import('./dashboard'));
export const BucketsPage = lazy(() => import('./buckets'));
```

### 2. Image Optimization
- Use `loading="lazy"` for file previews
- Implement image placeholder while loading
- Add error fallbacks for broken images

### 3. Virtual Scrolling
- Implement for large file lists
- Use react-window or react-virtualized
- Maintain smooth scrolling performance

## Build Configuration

### Vite Configuration
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@/components/ui'],
          utils: ['@/utils']
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
});
```

### Environment Variables
```bash
# .env.local
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_LOG_LEVEL=DEBUG
VITE_LOG_ENDPOINT=https://logs.example.com/api/logs
VITE_LOG_API_KEY=your_log_api_key
```

## Deployment Strategy

### Build Process
1. **Type Check**: `tsc --noEmit`
2. **Lint**: `eslint src --ext .ts,.tsx`
3. **Test**: `jest --coverage`
4. **Build**: `vite build`
5. **Preview**: `vite preview`

### Bundle Analysis
- Use `vite-bundle-analyzer` to analyze bundle size
- Implement code splitting for optimal loading
- Monitor bundle size in CI/CD pipeline

## Security Considerations

### 1. File Upload Security
- Validate file types on both client and server
- Implement file size limits
- Scan uploaded files for malware (server-side)
- Use presigned URLs to avoid direct server uploads

### 2. Authentication Security
- Store JWT tokens in httpOnly cookies (when possible)
- Implement token refresh mechanism
- Add CSRF protection for forms
- Validate all user inputs

### 3. Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline';
               style-src 'self' 'unsafe-inline';
               img-src 'self' data: https:;
               connect-src 'self' https://api.cloudflare.com;">
```

## Monitoring & Analytics

### 1. Performance Monitoring
- Web Vitals tracking
- Bundle size monitoring
- API response time tracking
- Error rate monitoring

### 2. User Analytics
- Page view tracking
- Feature usage analytics
- File upload/download metrics
- User journey analysis

## Future Enhancements

### 1. Progressive Web App (PWA)
- Service worker for offline support
- App manifest for installation
- Background sync for uploads

### 2. Advanced Features
- File sharing with expiration dates
- Collaborative file editing
- File versioning system
- Bulk operations (multi-select)

### 3. Performance Improvements
- CDN integration for faster file delivery
- Image resizing and optimization
- Caching strategies for frequently accessed files

## Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build

# Testing
npm run test            # Run tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint errors
npm run type-check      # Run TypeScript compiler

# Utilities
npm run clean           # Clean build artifacts
npm run analyze         # Analyze bundle size
```

This architecture provides a solid foundation for building a scalable, maintainable file service application with proper separation of concerns, type safety, and comprehensive testing coverage.