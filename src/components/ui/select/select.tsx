import React, { useState, useRef, useEffect } from 'react';
import { HiOutlineChevronDown, HiOutlineCheck } from 'react-icons/hi2';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  placeholder = 'Select an option',
  error,
  helperText,
  required = false,
  disabled = false,
  value,
  onChange,
  options,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  
  const hasError = !!error;
  const selectedOption = options.find(option => option.value === value);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;
    
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        setIsOpen(!isOpen);
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        break;
    }
  };

  const baseClasses = 'relative w-full px-3 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-1 cursor-pointer';
  const normalClasses = 'border-gray-300 bg-primary text-secondary';
  const errorClasses = 'border-error bg-red-50';
  const disabledClasses = 'bg-hover text-text-disabled cursor-not-allowed';
  
  let selectClasses = `${baseClasses} ${normalClasses}`;
  
  if (hasError) {
    selectClasses = `${baseClasses} ${errorClasses}`;
  } else if (disabled) {
    selectClasses = `${baseClasses} ${disabledClasses}`;
  }
  
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-text-secondary">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      
      <div className="relative" ref={selectRef}>
        <div
          className={`${selectClasses} flex items-center justify-between`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className={selectedOption ? 'text-secondary' : 'text-text-tertiary'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <HiOutlineChevronDown 
            className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''} ${disabled ? 'text-text-disabled' : 'text-text-tertiary'}`}
          />
        </div>
        
        {isOpen && !disabled && (
          <div className="absolute z-10 w-full mt-1 bg-primary border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {options.length === 0 ? (
              <div className="px-3 py-2 text-text-tertiary text-sm">
                No options available
              </div>
            ) : (
              options.map((option) => (
                <div
                  key={option.value}
                  className={`
                    px-3 py-2 cursor-pointer flex items-center justify-between hover:bg-hover transition-colors
                    ${option.disabled ? 'text-text-disabled cursor-not-allowed' : 'text-secondary'}
                    ${value === option.value ? 'bg-accent' : ''}
                  `}
                  onClick={() => !option.disabled && handleSelect(option.value)}
                  role="option"
                  aria-selected={value === option.value}
                >
                  <span>{option.label}</span>
                  {value === option.value && (
                    <HiOutlineCheck className="w-4 h-4 text-focus" />
                  )}
                </div>
              ))
            )}
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