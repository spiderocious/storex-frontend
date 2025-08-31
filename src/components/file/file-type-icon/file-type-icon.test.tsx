import { render } from '@testing-library/react';
import { FileTypeIcon } from './file-type-icon';

describe('FileTypeIcon Component', () => {
  it('renders image icon for image files', () => {
    const imageTypes = ['jpg', 'png', 'gif', 'svg'];
    
    imageTypes.forEach(type => {
      const { container } = render(<FileTypeIcon fileType={type} />);
      expect(container.querySelector('svg')).toHaveClass('text-blue-500');
    });
  });

  it('renders video icon for video files', () => {
    const videoTypes = ['mp4', 'webm', 'mov', 'avi'];
    
    videoTypes.forEach(type => {
      const { container } = render(<FileTypeIcon fileType={type} />);
      expect(container.querySelector('svg')).toHaveClass('text-red-500');
    });
  });

  it('renders audio icon for audio files', () => {
    const audioTypes = ['mp3', 'wav', 'aac', 'ogg'];
    
    audioTypes.forEach(type => {
      const { container } = render(<FileTypeIcon fileType={type} />);
      expect(container.querySelector('svg')).toHaveClass('text-purple-500');
    });
  });

  it('renders archive icon for archive files', () => {
    const archiveTypes = ['zip', 'rar', '7z', 'tar'];
    
    archiveTypes.forEach(type => {
      const { container } = render(<FileTypeIcon fileType={type} />);
      expect(container.querySelector('svg')).toHaveClass('text-orange-500');
    });
  });

  it('renders code icon for code files', () => {
    const codeTypes = ['js', 'ts', 'py', 'java', 'html', 'css'];
    
    codeTypes.forEach(type => {
      const { container } = render(<FileTypeIcon fileType={type} />);
      expect(container.querySelector('svg')).toHaveClass('text-green-500');
    });
  });

  it('renders document icon for document files', () => {
    const docTypes = ['pdf', 'doc', 'txt', 'md'];
    
    docTypes.forEach(type => {
      const { container } = render(<FileTypeIcon fileType={type} />);
      expect(container.querySelector('svg')).toHaveClass('text-blue-600');
    });
  });

  it('renders default icon for unknown file types', () => {
    const { container } = render(<FileTypeIcon fileType="unknown" />);
    expect(container.querySelector('svg')).toHaveClass('text-text-tertiary');
  });

  it('renders different sizes correctly', () => {
    const sizes = ['small', 'medium', 'large'] as const;
    
    sizes.forEach(size => {
      const { container } = render(<FileTypeIcon fileType="pdf" size={size} />);
      expect(container.firstChild).toMatchSnapshot(`file-type-icon-${size}`);
    });
  });

  it('handles case insensitive file types', () => {
    const { container: upperContainer } = render(<FileTypeIcon fileType="PDF" />);
    const { container: lowerContainer } = render(<FileTypeIcon fileType="pdf" />);
    
    expect(upperContainer.querySelector('svg')).toHaveClass('text-blue-600');
    expect(lowerContainer.querySelector('svg')).toHaveClass('text-blue-600');
  });
});