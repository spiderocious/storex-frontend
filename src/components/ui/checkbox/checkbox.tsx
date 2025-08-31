import React from 'react';
import { HiOutlineCheck } from 'react-icons/hi2';

interface CheckboxProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  checked: boolean;
  onChange: (checked: boolean) => void;
  indeterminate?: boolean;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  error,
  helperText,
  required = false,
  disabled = false,
  checked,
  onChange,
  indeterminate = false,
  className = ''
}) => {
  const hasError = !!error;
  
  const baseClasses = 'w-4 h-4 border-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-1';
  const normalClasses = 'border-gray-300 bg-primary';
  const checkedClasses = 'border-focus bg-focus';
  const errorClasses = 'border-error bg-red-50';
  const disabledClasses = 'border-gray-200 bg-hover cursor-not-allowed';
  
  let checkboxClasses = `${baseClasses} ${normalClasses}`;
  
  if (hasError) {
    checkboxClasses = `${baseClasses} ${errorClasses}`;
  } else if (disabled) {
    checkboxClasses = `${baseClasses} ${disabledClasses}`;
  } else if (checked || indeterminate) {
    checkboxClasses = `${baseClasses} ${checkedClasses}`;
  }
  
  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            required={required}
            className="sr-only"
          />
          <div
            className={checkboxClasses}
            onClick={() => !disabled && onChange(!checked)}
            tabIndex={disabled ? -1 : 0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                !disabled && onChange(!checked);
              }
            }}
            role="checkbox"
            aria-checked={indeterminate ? 'mixed' : checked}
            aria-disabled={disabled}
          >
            {(checked || indeterminate) && (
              <HiOutlineCheck 
                className={`w-3 h-3 ${disabled ? 'text-gray-400' : 'text-primary'}`}
              />
            )}
          </div>
        </div>
        
        {label && (
          <label 
            className={`text-sm font-medium cursor-pointer ${disabled ? 'text-text-disabled' : 'text-text-secondary'}`}
            onClick={() => !disabled && onChange(!checked)}
          >
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-error ml-7">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-text-tertiary ml-7">{helperText}</p>
      )}
    </div>
  );
};