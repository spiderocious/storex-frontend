import { render, screen, fireEvent } from '@testing-library/react';
import { FileListItem } from './file-list-item';
import type { FileData } from '@/types';

describe('FileListItem Component', () => {
  const mockFile: FileData = {
    id: 'file-1',
    name: 'document.pdf',
    originalName: 'My Important Document.pdf',
    type: 'pdf',
    size: 1024000,
    downloads: 5,
    publicKey: undefined,
    bucketId: 'bucket-1',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:45:00Z'
  };

  const defaultProps = {
    file: mockFile,
    onView: jest.fn(),
    onDownload: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders file information', () => {
    render(<FileListItem {...defaultProps} />);
    
    expect(screen.getByText('My Important Document.pdf')).toBeInTheDocument();
    expect(screen.getByText('1000 KB')).toBeInTheDocument();
    expect(screen.getByText('PDF')).toBeInTheDocument();
    expect(screen.getByText('5 downloads')).toBeInTheDocument();
  });

  it('shows public badge for public files', () => {
    const publicFile = { ...mockFile, publicKey: 'pub_123' };
    render(<FileListItem {...defaultProps} file={publicFile} />);
    
    expect(screen.getByText('Public')).toBeInTheDocument();
  });

  it('calls onView when view button is clicked', () => {
    const onView = jest.fn();
    render(<FileListItem {...defaultProps} onView={onView} />);
    
    const viewButton = screen.getByRole('button', { name: /view file/i });
    fireEvent.click(viewButton);
    expect(onView).toHaveBeenCalledWith('file-1');
  });

  it('calls onDownload when download button is clicked', () => {
    const onDownload = jest.fn();
    render(<FileListItem {...defaultProps} onDownload={onDownload} />);
    
    const downloadButton = screen.getByRole('button', { name: /download file/i });
    fireEvent.click(downloadButton);
    expect(onDownload).toHaveBeenCalledWith('file-1');
  });

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = jest.fn();
    render(<FileListItem {...defaultProps} onDelete={onDelete} />);
    
    const deleteButton = screen.getByRole('button', { name: /delete file/i });
    fireEvent.click(deleteButton);
    expect(onDelete).toHaveBeenCalledWith('file-1');
  });

  it('calls onMoreActions when more actions button is clicked', () => {
    const onMoreActions = jest.fn();
    render(<FileListItem {...defaultProps} onMoreActions={onMoreActions} />);
    
    const moreButton = screen.getByRole('button', { name: /more actions/i });
    fireEvent.click(moreButton);
    expect(onMoreActions).toHaveBeenCalledWith('file-1');
  });

  it('hides actions when showActions is false', () => {
    render(<FileListItem {...defaultProps} showActions={false} />);
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('formats file size correctly', () => {
    const testCases = [
      { size: 0, expected: '0 B' },
      { size: 1024, expected: '1 KB' },
      { size: 1048576, expected: '1 MB' },
      { size: 1073741824, expected: '1 GB' }
    ];

    testCases.forEach(({ size, expected }) => {
      const file = { ...mockFile, size };
      const { rerender } = render(<FileListItem {...defaultProps} file={file} />);
      
      expect(screen.getByText(expected)).toBeInTheDocument();
      rerender(<div />);
    });
  });

  it('formats download count correctly', () => {
    const testCases = [
      { downloads: 0, expected: 'No downloads' },
      { downloads: 1, expected: '1 download' },
      { downloads: 5, expected: '5 downloads' }
    ];

    testCases.forEach(({ downloads, expected }) => {
      const file = { ...mockFile, downloads };
      const { rerender } = render(<FileListItem {...defaultProps} file={file} />);
      
      expect(screen.getByText(expected)).toBeInTheDocument();
      rerender(<div />);
    });
  });
});