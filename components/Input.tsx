import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input: React.FC<InputProps> = ({ 
  className = '', 
  label,
  error,
  helperText,
  id,
  ...props 
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-white"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          input-base rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-neutral-900
          min-h-[44px] px-4 py-3 text-base
          ${error ? 'border-red-500 focus:ring-red-400' : ''}
          ${className}
        `}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        aria-invalid={error ? 'true' : 'false'}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${inputId}-helper`} className="text-sm text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;