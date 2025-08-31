import React from 'react';

interface CardProps {
  className?: string;
  padding?: 'small' | 'medium' | 'large';
  hoverable?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

const paddingClasses = {
  small: 'p-3',
  medium: 'p-4',
  large: 'p-6'
};

export const Card: React.FC<CardProps> = ({
  className = '',
  padding = 'medium',
  hoverable = false,
  children,
  onClick
}) => {
  const baseClasses = 'bg-primary border border-hover rounded-lg';
  const paddingClass = paddingClasses[padding];
  const hoverClasses = hoverable ? 'hover:bg-hover hover:shadow-sm transition-all cursor-pointer' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';
  
  const finalClassName = `${baseClasses} ${paddingClass} ${hoverClasses} ${clickableClasses} ${className}`.trim();

  return (
    <div className={finalClassName} onClick={onClick}>
      {children}
    </div>
  );
};