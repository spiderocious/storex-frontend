import '@testing-library/jest-dom';

// Mock logger in tests
jest.mock('@/utils/logger', () => ({
  logger: {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    disable: jest.fn(),
    enable: jest.fn()
  },
  disableLogging: jest.fn(),
  enableLogging: jest.fn()
}));

// Mock API client
jest.mock('@/utils/api-client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    uploadFile: jest.fn()
  }
}));

// Mock environment variables
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    pathname: '/'
  },
  writable: true
});

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

// Mock fetch
global.fetch = jest.fn();

// Cleanup after each test
afterEach(() => {
  jest.clearAllMocks();
});