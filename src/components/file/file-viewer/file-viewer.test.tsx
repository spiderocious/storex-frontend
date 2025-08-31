// import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { FileViewer } from './file-viewer';
import { apiClient } from '@/utils/api-client';

// Mock the API client
jest.mock('@/utils/api-client');
const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

const mockFileResponse = {
  success: true,
  statusCode: 200,
  message: 'Download URL generated successfully',
  data: {
    uri: 'https://example.com/file.jpg',
    type: 'jpg',
    file: {
      id: 'test-file-id',
      name: 'test-image.jpg',
      originalName: 'test.jpg',
      type: 'jpg',
      size: 1024000,
      downloads: 5
    },
    download: {
      url: 'https://example.com/download/file.jpg',
      expiresIn: 3600,
      method: 'GET',
      cached: true
    }
  },
  timestamp: '2023-01-01T00:00:00.000Z'
};

describe('FileViewer Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    mockApiClient.get.mockReturnValue(new Promise(() => {})); // Never resolves
    
    render(<FileViewer fileId="test-id" />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders image file correctly', async () => {
    mockApiClient.get.mockResolvedValue(mockFileResponse);
    
    render(<FileViewer fileId="test-id" showDetails={true} />);
    
    await waitFor(() => {
      expect(screen.getByAltText('test.jpg')).toBeInTheDocument();
    });
    
    // Check if file details are shown
    expect(screen.getByText('File Details')).toBeInTheDocument();
    expect(screen.getByText('test-image.jpg')).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    const errorMessage = 'File not found';
    mockApiClient.get.mockRejectedValue(new Error(errorMessage));
    
    render(<FileViewer fileId="invalid-id" />);
    
    await waitFor(() => {
      expect(screen.getByText('Error loading file')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
    
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('calls onSuccess callback when file loads', async () => {
    const onSuccess = jest.fn();
    mockApiClient.get.mockResolvedValue(mockFileResponse);
    
    render(<FileViewer fileId="test-id" onSuccess={onSuccess} />);
    
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(mockFileResponse.data.file);
    });
  });

  it('calls onError callback when file fails to load', async () => {
    const onError = jest.fn();
    const errorMessage = 'Network error';
    mockApiClient.get.mockRejectedValue(new Error(errorMessage));
    
    render(<FileViewer fileId="test-id" onError={onError} />);
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(errorMessage);
    });
  });

  it('matches snapshot for image file', async () => {
    mockApiClient.get.mockResolvedValue(mockFileResponse);
    
    const { container } = render(<FileViewer fileId="test-id" />);
    
    await waitFor(() => {
      expect(screen.getByAltText('test.jpg')).toBeInTheDocument();
    });
    
    expect(container.firstChild).toMatchSnapshot();
  });
});