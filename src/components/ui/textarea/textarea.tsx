import React from 'react';

interface TextareaProps {
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  maxLength?: number;
  className?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  value,
  onChange,
  rows = 4,
  maxLength,
  className = ''
}) => {
  const hasError = !!error;
  
  const baseClasses = 'w-full px-3 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-1 resize-vertical';
  const normalClasses = 'border-gray-300 bg-primary text-secondary';
  const errorClasses = 'border-error bg-red-50';
  const disabledClasses = 'bg-hover text-text-disabled cursor-not-allowed';
  
  let textareaClasses = `${baseClasses} ${normalClasses}`;
  
  if (hasError) {
    textareaClasses = `${baseClasses} ${errorClasses}`;
  } else if (disabled) {
    textareaClasses = `${baseClasses} ${disabledClasses}`;
  }
  
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-text-secondary">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          required={required}
          rows={rows}
          maxLength={maxLength}
          className={textareaClasses}
        />
        
        {maxLength && (
          <div className="absolute bottom-2 right-2 text-xs text-text-tertiary">
            {value.length}/{maxLength}
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-text-tertiary">{helperText}</p>
      )}
    </div>
  );
};