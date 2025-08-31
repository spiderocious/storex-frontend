import React, { useState } from 'react';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number';
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  label,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  value,
  onChange,
  className = ''
}) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const inputType = type === 'password' && showPassword ? 'text' : type;
  const hasError = !!error;
  
  const baseClasses = 'w-full px-3 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-1';
  const normalClasses = 'border-gray-300 bg-primary text-secondary';
  const errorClasses = 'border-error bg-red-50';
  const disabledClasses = 'bg-hover text-text-disabled cursor-not-allowed';
  
  let inputClasses = `${baseClasses} ${normalClasses}`;
  
  if (hasError) {
    inputClasses = `${baseClasses} ${errorClasses}`;
  } else if (disabled) {
    inputClasses = `${baseClasses} ${disabledClasses}`;
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
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          required={required}
          className={inputClasses}
        />
        
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
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