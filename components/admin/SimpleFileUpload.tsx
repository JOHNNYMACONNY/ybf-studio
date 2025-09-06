import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';

interface SimpleFileUploadProps {
  onFileSelect: (file: File | null) => void;
  accept: string;
  label: string;
  maxSize?: number; // in MB
  className?: string;
}

const SimpleFileUpload: React.FC<SimpleFileUploadProps> = ({
  onFileSelect,
  accept,
  label,
  maxSize = 50, // 50MB default
  className = ''
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.match(accept.replace('*', '.*'))) {
      return `Invalid file type. Please select a ${accept} file.`;
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB.`;
    }

    return null;
  };

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      onFileSelect(null);
      return;
    }

    setError(null);
    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setError(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-neutral-300">
        {label}
      </label>
      
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          isDragOver
            ? 'border-amber-500 bg-amber-500/10'
            : selectedFile
            ? 'border-green-500 bg-green-500/10'
            : 'border-neutral-600 hover:border-neutral-500'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />

        {selectedFile ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-neutral-200">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-neutral-400">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={handleRemoveFile}
              className="p-1 text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="mx-auto h-8 w-8 text-neutral-400 mb-2" />
            <p className="text-sm text-neutral-300 mb-1">
              Drag and drop a file here, or{' '}
              <button
                type="button"
                onClick={handleClick}
                className="text-amber-500 hover:text-amber-400 underline"
              >
                browse
              </button>
            </p>
            <p className="text-xs text-neutral-500">
              Accepted formats: {accept} (max {maxSize}MB)
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-red-400 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {selectedFile && !error && (
        <div className="text-xs text-neutral-400">
          <p className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-green-500" /> File selected successfully
          </p>
          <p className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3 text-amber-400" /> Next step: Upload to SoundCloud/Google Drive and enter URLs in the form below
          </p>
        </div>
      )}
    </div>
  );
};

export default SimpleFileUpload;
