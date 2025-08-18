import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input: React.FC<InputProps> = ({ className = '', label, error, helperText, id, ...props }) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {label && <label htmlFor={inputId} className="block text-sm font-medium text-neutral-300 mb-2">{label}</label>}
      <input
        id={inputId}
        className={`w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors ${error ? 'border-red-500' : ''} ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        {...props}
      />
      {error && <p id={`${inputId}-error`} className="text-sm text-red-400 mt-1">{error}</p>}
      {helperText && !error && <p id={`${inputId}-helper`} className="text-sm text-neutral-400 mt-1">{helperText}</p>}
    </div>
  );
};

export default Input;
