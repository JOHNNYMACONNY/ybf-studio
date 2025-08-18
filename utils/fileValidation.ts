// File validation utilities for admin file uploads

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface FileValidationOptions {
  maxSize?: number; // in MB
  allowedTypes?: string[];
  maxWidth?: number; // for images
  maxHeight?: number; // for images
}

// Default validation options
const DEFAULT_AUDIO_OPTIONS: FileValidationOptions = {
  maxSize: 50, // 50MB
  allowedTypes: ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/wave']
};

const DEFAULT_IMAGE_OPTIONS: FileValidationOptions = {
  maxSize: 10, // 10MB
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
  maxWidth: 2048,
  maxHeight: 2048
};

/**
 * Validate audio file (MP3, WAV)
 */
export const validateAudioFile = (file: File, options: FileValidationOptions = {}): ValidationResult => {
  const opts = { ...DEFAULT_AUDIO_OPTIONS, ...options };

  // Check file type
  if (!opts.allowedTypes?.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid audio file type. Please select an MP3 or WAV file.`
    };
  }

  // Check file size
  if (file.size > (opts.maxSize || 50) * 1024 * 1024) {
    return {
      isValid: false,
      error: `Audio file size must be less than ${opts.maxSize || 50}MB.`
    };
  }

  return { isValid: true };
};

/**
 * Validate image file (JPG, PNG)
 */
export const validateImageFile = (file: File, options: FileValidationOptions = {}): ValidationResult => {
  const opts = { ...DEFAULT_IMAGE_OPTIONS, ...options };

  // Check file type
  if (!opts.allowedTypes?.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid image file type. Please select a JPG or PNG file.`
    };
  }

  // Check file size
  if (file.size > (opts.maxSize || 10) * 1024 * 1024) {
    return {
      isValid: false,
      error: `Image file size must be less than ${opts.maxSize || 10}MB.`
    };
  }

  return { isValid: true };
};

/**
 * Validate file dimensions (for images)
 */
export const validateImageDimensions = (file: File, maxWidth: number = 2048, maxHeight: number = 2048): Promise<ValidationResult> => {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      
      if (img.width > maxWidth || img.height > maxHeight) {
        resolve({
          isValid: false,
          error: `Image dimensions must be ${maxWidth}x${maxHeight} pixels or smaller.`
        });
      } else {
        resolve({ isValid: true });
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({
        isValid: false,
        error: 'Unable to read image dimensions.'
      });
    };

    img.src = url;
  });
};

/**
 * Get file size in human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

/**
 * Check if file is an audio file
 */
export const isAudioFile = (file: File): boolean => {
  return file.type.startsWith('audio/');
};

/**
 * Check if file is an image file
 */
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

/**
 * Validate URL format
 */
export const validateUrl = (url: string): ValidationResult => {
  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return {
      isValid: false,
      error: 'Please enter a valid URL.'
    };
  }
};

/**
 * Validate SoundCloud URL
 */
export const validateSoundCloudUrl = (url: string): ValidationResult => {
  const urlValidation = validateUrl(url);
  if (!urlValidation.isValid) {
    return urlValidation;
  }

  if (!url.includes('soundcloud.com')) {
    return {
      isValid: false,
      error: 'Please enter a valid SoundCloud URL.'
    };
  }

  return { isValid: true };
};

/**
 * Validate Google Drive URL
 */
export const validateGoogleDriveUrl = (url: string): ValidationResult => {
  const urlValidation = validateUrl(url);
  if (!urlValidation.isValid) {
    return urlValidation;
  }

  if (!url.includes('drive.google.com')) {
    return {
      isValid: false,
      error: 'Please enter a valid Google Drive URL.'
    };
  }

  return { isValid: true };
};
