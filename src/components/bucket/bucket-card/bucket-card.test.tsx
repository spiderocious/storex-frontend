import { render, screen, fireEvent } from '@testing-library/react';
import { BucketCard } from './bucket-card';
import type { BucketData } from '@/types';

describe('BucketCard Component', () => {
  const mockBucket: BucketData = {
    id: 'bucket-1',
    name: 'My Documents',
    description: 'Important documents and files',
    publicKey: undefined,
    fileCount: 15,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:45:00Z'
  };

  const defaultProps = {
    bucket: mockBucket,
    onView: jest.fn(),
    onSettings: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders bucket information', () => {
    render(<BucketCard {...defaultProps} />);
    
    expect(screen.getByText('My Documents')).toBeInTheDocument();
    expect(screen.getByText('Important documents and files')).toBeInTheDocument();
    expect(screen.getByText('15 files')).toBeInTheDocument();
    expect(screen.getByText('Private')).toBeInTheDocument();
  });

  it('shows public status when bucket has public key', () => {
    const publicBucket = { ...mockBucket, publicKey: 'pub_123' };
    render(<BucketCard {...defaultProps} bucket={publicBucket} />);
    
    expect(screen.getByText('Public')).toBeInTheDocument();
  });

  it('calls onView when card is clicked', () => {
    const onView = jest.fn();
    render(<BucketCard {...defaultProps} onView={onView} />);
    
    const card = screen.getByText('My Documents').closest('.cursor-pointer');
    fireEvent.click(card!);
    
    expect(onView).toHaveBeenCalledWith('bucket-1');
  });

  it('calls onView when View Files button is clicked', () => {
    const onView = jest.fn();
    render(<BucketCard {...defaultProps} onView={onView} />);
    
    const viewButton = screen.getByText('View Files');
    fireEvent.click(viewButton);
    
    expect(onView).toHaveBeenCalledWith('bucket-1');
  });

  it('calls onSettings when Settings button is clicked', () => {
    const onSettings = jest.fn();
    render(<BucketCard {...defaultProps} onSettings={onSettings} />);
    
    const settingsButton = screen.getByText('Settings');
    fireEvent.click(settingsButton);
    
    expect(onSettings).toHaveBeenCalledWith('bucket-1');
  });

  it('prevents card click when action buttons are clicked', () => {
    const onView = jest.fn();
    render(<BucketCard {...defaultProps} onView={onView} />);
    
    const settingsButton = screen.getByText('Settings');
    fireEvent.click(settingsButton);
    
    // onView should only be called once from the settings handler, not from card click
    expect(onView).not.toHaveBeenCalled();
  });

  it('formats file count correctly', () => {
    const testCases = [
      { fileCount: 0, expected: 'No files' },
      { fileCount: 1, expected: '1 file' },
      { fileCount: 5, expected: '5 files' }
    ];

    testCases.forEach(({ fileCount, expected }) => {
      const bucket = { ...mockBucket, fileCount };
      const { rerender } = render(<BucketCard {...defaultProps} bucket={bucket} />);
      
      expect(screen.getByText(expected)).toBeInTheDocument();
      rerender(<div />);
    });
  });

  it('formats date correctly', () => {
    render(<BucketCard {...defaultProps} />);
    expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument();
  });

  it('handles bucket without description', () => {
    const bucketWithoutDesc = { ...mockBucket, description: undefined };
    render(<BucketCard {...defaultProps} bucket={bucketWithoutDesc} />);
    
    expect(screen.getByText('My Documents')).toBeInTheDocument();
    expect(screen.queryByText('Important documents and files')).not.toBeInTheDocument();
  });
});