import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BucketHeader } from './bucket-header';
import type { BucketData } from '@/types';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined)
  }
});

describe('BucketHeader Component', () => {
  const mockBucket: BucketData = {
    id: 'bucket-1',
    name: 'My Documents',
    description: 'Important documents and files',
    publicKey: 'pub_123456789',
    fileCount: 15,
    totalSize: 1024000,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:45:00Z'
  };

  const defaultProps = {
    bucket: mockBucket,
    onUpload: jest.fn(),
    onSettings: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders bucket information', () => {
    render(<BucketHeader {...defaultProps} />);
    
    expect(screen.getByText('My Documents')).toBeInTheDocument();
    expect(screen.getByText('Important documents and files')).toBeInTheDocument();
    expect(screen.getByText('15 files')).toBeInTheDocument();
    expect(screen.getByText('Public')).toBeInTheDocument();
  });

  it('shows public key when bucket is public', () => {
    render(<BucketHeader {...defaultProps} />);
    
    expect(screen.getByText('Public Key:')).toBeInTheDocument();
    expect(screen.getByText('pub_123456789')).toBeInTheDocument();
  });

  it('hides public key when bucket is private', () => {
    const privateBucket = { ...mockBucket, publicKey: undefined };
    render(<BucketHeader {...defaultProps} bucket={privateBucket} />);
    
    expect(screen.queryByText('Public Key:')).not.toBeInTheDocument();
    expect(screen.getByText('Private')).toBeInTheDocument();
  });

  it('calls onUpload when upload button is clicked', () => {
    const onUpload = jest.fn();
    render(<BucketHeader {...defaultProps} onUpload={onUpload} />);
    
    const uploadButton = screen.getByText('Upload Files');
    fireEvent.click(uploadButton);
    expect(onUpload).toHaveBeenCalledTimes(1);
  });

  it('calls onSettings when settings button is clicked', () => {
    const onSettings = jest.fn();
    render(<BucketHeader {...defaultProps} onSettings={onSettings} />);
    
    const settingsButton = screen.getByRole('button', { name: /settings/i });
    fireEvent.click(settingsButton);
    expect(onSettings).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = jest.fn();
    render(<BucketHeader {...defaultProps} onDelete={onDelete} />);
    
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('copies public key to clipboard when copy button is clicked', async () => {
    render(<BucketHeader {...defaultProps} />);
    
    const copyButton = screen.getByRole('button', { name: /copy public key/i });
    fireEvent.click(copyButton);
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('pub_123456789');
    
    await waitFor(() => {
      expect(screen.getByText('Public key copied to clipboard')).toBeInTheDocument();
    });
  });

  it('shows share button when onShare is provided and bucket is public', () => {
    const onShare = jest.fn();
    render(<BucketHeader {...defaultProps} onShare={onShare} />);
    
    const shareButton = screen.getByRole('button', { name: /share/i });
    expect(shareButton).toBeInTheDocument();
    
    fireEvent.click(shareButton);
    expect(onShare).toHaveBeenCalledTimes(1);
  });

  it('hides share button when bucket is private', () => {
    const privateBucket = { ...mockBucket, publicKey: undefined };
    const onShare = jest.fn();
    render(<BucketHeader {...defaultProps} bucket={privateBucket} onShare={onShare} />);
    
    expect(screen.queryByRole('button', { name: /share/i })).not.toBeInTheDocument();
  });

  it('formats file count correctly', () => {
    const testCases = [
      { fileCount: 0, expected: 'No files' },
      { fileCount: 1, expected: '1 file' },
      { fileCount: 5, expected: '5 files' }
    ];

    testCases.forEach(({ fileCount, expected }) => {
      const bucket = { ...mockBucket, fileCount };
      const { rerender } = render(<BucketHeader {...defaultProps} bucket={bucket} />);
      
      expect(screen.getByText(expected)).toBeInTheDocument();
      rerender(<div />);
    });
  });
});