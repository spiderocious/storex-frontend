import React from 'react';
import { 
  HiOutlineDocument,
  HiOutlinePhoto,
  HiOutlineVideoCamera,
  HiOutlineMusicalNote,
  HiOutlineArchiveBox,
  HiOutlineCodeBracket,
  HiOutlineTableCells,
  HiOutlinePresentationChartLine
} from 'react-icons/hi2';

interface FileTypeIconProps {
  fileType: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const FileTypeIcon: React.FC<FileTypeIconProps> = ({
  fileType,
  size = 'medium',
  className = ''
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-4 h-4';
      case 'medium':
        return 'w-5 h-5';
      case 'large':
        return 'w-6 h-6';
      default:
        return 'w-5 h-5';
    }
  };

  const getIcon = () => {
    const type = fileType.toLowerCase();
    const sizeClass = getSizeClasses();
    
    // Images
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'].includes(type)) {
      return <HiOutlinePhoto className={`${sizeClass} text-blue-500`} />;
    }
    
    // Videos
    if (['mp4', 'webm', 'mov', 'avi', 'mkv', 'flv', 'wmv'].includes(type)) {
      return <HiOutlineVideoCamera className={`${sizeClass} text-red-500`} />;
    }
    
    // Audio
    if (['mp3', 'wav', 'aac', 'ogg', 'flac', 'm4a', 'wma'].includes(type)) {
      return <HiOutlineMusicalNote className={`${sizeClass} text-purple-500`} />;
    }
    
    // Archives
    if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz'].includes(type)) {
      return <HiOutlineArchiveBox className={`${sizeClass} text-orange-500`} />;
    }
    
    // Code files
    if (['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'cs', 'php', 'rb', 'go', 'rs', 'swift', 'kt', 'html', 'css', 'scss', 'less', 'json', 'xml', 'yaml', 'yml'].includes(type)) {
      return <HiOutlineCodeBracket className={`${sizeClass} text-green-500`} />;
    }
    
    // Spreadsheets
    if (['xlsx', 'xls', 'csv', 'ods'].includes(type)) {
      return <HiOutlineTableCells className={`${sizeClass} text-green-600`} />;
    }
    
    // Presentations
    if (['pptx', 'ppt', 'odp'].includes(type)) {
      return <HiOutlinePresentationChartLine className={`${sizeClass} text-orange-600`} />;
    }
    
    // Documents
    if (['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt', 'md'].includes(type)) {
      return <HiOutlineDocument className={`${sizeClass} text-blue-600`} />;
    }
    
    // Default
    return <HiOutlineDocument className={`${sizeClass} text-text-tertiary`} />;
  };

  return (
    <div className={className}>
      {getIcon()}
    </div>
  );
};