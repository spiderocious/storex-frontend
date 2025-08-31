import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'black' | 'grey' | 'white';
  className?: string;
}

const sizeClasses = {
  small: 'w-4 h-4',
  medium: 'w-6 h-6',
  large: 'w-8 h-8'
};

const colorClasses = {
  black: 'border-secondary border-t-transparent',
  grey: 'border-accent border-t-transparent',
  white: 'border-primary border-t-transparent'
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'black',
  className = ''
}) => {
  const sizeClass = sizeClasses[size];
  const colorClass = colorClasses[color];
  
  return (
    <div
      className={`${sizeClass} border-2 ${colorClass} rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};