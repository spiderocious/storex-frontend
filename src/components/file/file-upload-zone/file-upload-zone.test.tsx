import { render, screen, fireEvent } from '@testing-library/react';
import { FileUploadZone } from './file-upload-zone';

// Mock file creation helper
const createMockFile = (name: string, size: number, type: string = 'text/plain') => {
  const file = new File([''], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

describe('FileUploadZone Component', () => {
  const defaultProps = {
    onFilesSelected: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders upload zone', () => {
    render(<FileUploadZone {...defaultProps} />);
    expect(screen.getByText('Drop files to upload')).toBeInTheDocument();
    expect(screen.getByText(/browse files/)).toBeInTheDocument();
  });

  it('shows maximum file size information', () => {
    render(<FileUploadZone {...defaultProps} maxFileSize={50 * 1024 * 1024} />);
    expect(screen.getByText('Maximum file size: 50 MB')).toBeInTheDocument();
  });

  it('shows accepted file types when provided', () => {
    render(<FileUploadZone {...defaultProps} acceptedTypes={['jpg', 'png', 'pdf']} />);
    expect(screen.getByText('Accepted types: jpg, png, pdf')).toBeInTheDocument();
  });

  it('calls onFilesSelected with valid files', () => {
    const onFilesSelected = jest.fn();
    render(<FileUploadZone {...defaultProps} onFilesSelected={onFilesSelected} />);
    
    const file = createMockFile('test.txt', 1024);
    const input = screen.getByRole('button', { hidden: true });
    
    fireEvent.change(input, { target: { files: [file] } });
    expect(onFilesSelected).toHaveBeenCalledWith([file]);
  });

  it('rejects files that are too large', () => {
    render(<FileUploadZone {...defaultProps} maxFileSize={1024} />);
    
    const largeFile = createMockFile('large.txt', 2048);
    const input = screen.getByRole('button', { hidden: true });
    
    fireEvent.change(input, { target: { files: [largeFile] } });
    expect(screen.getByText(/large.txt is too large/)).toBeInTheDocument();
  });

  it('rejects files with invalid types', () => {
    render(<FileUploadZone {...defaultProps} acceptedTypes={['jpg', 'png']} />);
    
    const invalidFile = createMockFile('document.pdf', 1024);
    const input = screen.getByRole('button', { hidden: true });
    
    fireEvent.change(input, { target: { files: [invalidFile] } });
    expect(screen.getByText(/document.pdf is not an accepted file type/)).toBeInTheDocument();
  });

  it('handles drag and drop events', () => {
    const onFilesSelected = jest.fn();
    render(<FileUploadZone {...defaultProps} onFilesSelected={onFilesSelected} />);
    
    const uploadZone = screen.getByText('Drop files to upload').parentElement?.parentElement;
    const file = createMockFile('dropped.txt', 1024);
    
    // Simulate drag over
    fireEvent.dragOver(uploadZone!, {
      dataTransfer: { files: [file] }
    });
    
    // Simulate drop
    fireEvent.drop(uploadZone!, {
      dataTransfer: { files: [file] }
    });
    
    expect(onFilesSelected).toHaveBeenCalledWith([file]);
  });

  it('rejects multiple files when multiple is false', () => {
    render(<FileUploadZone {...defaultProps} multiple={false} />);
    
    const file1 = createMockFile('file1.txt', 1024);
    const file2 = createMockFile('file2.txt', 1024);
    const input = screen.getByRole('button', { hidden: true });
    
    fireEvent.change(input, { target: { files: [file1, file2] } });
    expect(screen.getByText('Only one file can be uploaded at a time.')).toBeInTheDocument();
  });

  it('shows multiple files allowed text when multiple is true', () => {
    render(<FileUploadZone {...defaultProps} multiple />);
    expect(screen.getByText('Multiple files allowed')).toBeInTheDocument();
  });

  it('disables upload zone when disabled', () => {
    render(<FileUploadZone {...defaultProps} disabled />);
    
    const uploadZone = screen.getByText('Drop files to upload').parentElement?.parentElement;
    expect(uploadZone).toHaveClass('cursor-not-allowed');
  });

  it('dismisses error when dismiss button is clicked', () => {
    render(<FileUploadZone {...defaultProps} maxFileSize={1024} />);
    
    const largeFile = createMockFile('large.txt', 2048);
    const input = screen.getByRole('button', { hidden: true });
    
    fireEvent.change(input, { target: { files: [largeFile] } });
    expect(screen.getByText(/large.txt is too large/)).toBeInTheDocument();
    
    const dismissButton = screen.getByRole('button', { name: /dismiss/i });
    fireEvent.click(dismissButton);
    expect(screen.queryByText(/large.txt is too large/)).not.toBeInTheDocument();
  });
});