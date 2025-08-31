import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { HiOutlineXMark } from 'react-icons/hi2';
import { Button } from '@/components/ui/button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  children: React.ReactNode;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'medium',
  children,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = ''
}) => {
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'max-w-md';
      case 'medium':
        return 'max-w-lg';
      case 'large':
        return 'max-w-2xl';
      case 'fullscreen':
        return 'max-w-full max-h-full m-0 rounded-none';
      default:
        return 'max-w-lg';
    }
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleOverlayClick}
      />
      
      <div className={`
        relative bg-primary rounded-lg shadow-xl w-full mx-4
        ${getSizeClasses()}
        ${size === 'fullscreen' ? 'h-full' : 'max-h-[90vh]'}
        ${className}
      `}>
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-hover">
            {title && (
              <h2 className="text-lg font-semibold text-secondary">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <Button
                variant="ghost"
                size="small"
                onClick={onClose}
                className="ml-auto"
                icon={<HiOutlineXMark className="w-5 h-5" />}
                title="Close modal"
              />
            )}
          </div>
        )}
        
        <div className={`
          p-6 
          ${size === 'fullscreen' ? 'flex-1 overflow-auto' : 'overflow-y-auto'}
        `}>
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};