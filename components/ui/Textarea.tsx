import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea: React.FC<TextareaProps> = ({ className = '', label, error, helperText, id, ...props }) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {label && <label htmlFor={textareaId} className="block text-sm font-medium text-neutral-300 mb-2">{label}</label>}
      <textarea
        id={textareaId}
        className={`w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p id={`${textareaId}-error`} className="text-sm text-red-400 mt-1">{error}</p>}
      {helperText && !error && <p id={`${textareaId}-helper`} className="text-sm text-neutral-400 mt-1">{helperText}</p>}
    </div>
  );
};

export default Textarea;