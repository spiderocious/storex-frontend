import React from 'react';
import type { ButtonVariant, ButtonSize } from '@/types';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-secondary text-primary hover:bg-hover hover:text-secondary',
  secondary: 'bg-accent text-primary hover:bg-active',
  danger: 'bg-error text-primary hover:bg-red-600',
  ghost: 'bg-transparent text-secondary hover:bg-hover'
};

const sizeClasses: Record<ButtonSize, string> = {
  small: 'h-8 px-3 text-sm',
  medium: 'h-10 px-4 text-base',
  large: 'h-12 px-5 text-lg'
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  children,
  onClick,
  type = 'button',
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2';
  const variantClass = variantClasses[variant];
  const sizeClass = sizeClasses[size];
  const disabledClass = disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  const finalClassName = `${baseClasses} ${variantClass} ${sizeClass} ${disabledClass} ${className}`.trim();

  return (
    <button
      type={type}
      className={finalClassName}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span className="w-4 h-4">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};