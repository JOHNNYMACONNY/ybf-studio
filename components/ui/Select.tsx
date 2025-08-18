import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
  label?: string;
  error?: string;
  helperText?: string;
}

const Select: React.FC<SelectProps> = ({ 
  children, 
  className = '', 
  label,
  error,
  helperText,
  id,
  ...props 
}) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={selectId}
          className="block text-sm font-medium text-white"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={`
            input-base appearance-none rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-neutral-900
            min-h-[44px] px-4 py-3 text-base pr-10
            ${error ? 'border-red-500 focus:ring-red-400' : ''}
            ${className}
          `}
          aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
      </div>
      {error && (
        <p id={`${selectId}-error`} className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${selectId}-helper`} className="text-sm text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Select;