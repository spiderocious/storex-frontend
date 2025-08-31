import React from 'react';
import { HiOutlineXMark, HiOutlineExclamationTriangle, HiOutlineInformationCircle, HiOutlineCheckCircle } from 'react-icons/hi2';
import { Button } from '@/components/ui/button';

interface ErrorBannerProps {
  type?: 'error' | 'warning' | 'info' | 'success';
  title?: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  showRetry?: boolean;
  onRetry?: () => void;
  className?: string;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  type = 'error',
  title,
  message,
  dismissible = true,
  onDismiss,
  showRetry = false,
  onRetry,
  className = ''
}) => {
  const getIcon = () => {
    switch (type) {
      case 'error':
        return <HiOutlineExclamationTriangle className="w-5 h-5" />;
      case 'warning':
        return <HiOutlineExclamationTriangle className="w-5 h-5" />;
      case 'info':
        return <HiOutlineInformationCircle className="w-5 h-5" />;
      case 'success':
        return <HiOutlineCheckCircle className="w-5 h-5" />;
      default:
        return <HiOutlineExclamationTriangle className="w-5 h-5" />;
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      default:
        return 'bg-red-50 border-red-200 text-red-800';
    }
  };

  const getIconColorClasses = () => {
    switch (type) {
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      case 'info':
        return 'text-blue-400';
      case 'success':
        return 'text-green-400';
      default:
        return 'text-red-400';
    }
  };

  return (
    <div className={`
      flex items-start gap-3 p-4 border rounded-lg
      ${getColorClasses()}
      ${className}
    `}>
      <div className={`flex-shrink-0 ${getIconColorClasses()}`}>
        {getIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        {title && (
          <h3 className="text-sm font-medium mb-1">
            {title}
          </h3>
        )}
        <p className="text-sm">
          {message}
        </p>
        
        {showRetry && onRetry && (
          <div className="mt-3">
            <Button
              variant="ghost"
              size="small"
              onClick={onRetry}
              className="text-current hover:bg-black/10"
            >
              Try Again
            </Button>
          </div>
        )}
      </div>
      
      {dismissible && onDismiss && (
        <div className="flex-shrink-0">
          <Button
            variant="ghost"
            size="small"
            onClick={onDismiss}
            className="text-current hover:bg-black/10"
            icon={<HiOutlineXMark className="w-4 h-4" />}
          />
        </div>
      )}
    </div>
  );
};