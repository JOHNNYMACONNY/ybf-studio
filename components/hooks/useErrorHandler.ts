import { useState, useCallback } from 'react';

interface ErrorState {
  hasError: boolean;
  error?: Error;
  message?: string;
}

interface UseErrorHandlerOptions {
  onError?: (error: Error) => void;
  fallbackMessage?: string;
}

export const useErrorHandler = (options: UseErrorHandlerOptions = {}) => {
  const [errorState, setErrorState] = useState<ErrorState>({ hasError: false });

  const handleError = useCallback((error: Error | string, fallbackMessage?: string) => {
    const errorObj = error instanceof Error ? error : new Error(error);
    const message = fallbackMessage || options.fallbackMessage || 'Something went wrong';
    
    console.error('Error caught by useErrorHandler:', errorObj);
    
    setErrorState({
      hasError: true,
      error: errorObj,
      message
    });

    if (options.onError) {
      options.onError(errorObj);
    }
  }, [options]);

  const clearError = useCallback(() => {
    setErrorState({ hasError: false });
  }, []);

  const resetError = useCallback(() => {
    setErrorState({ hasError: false });
  }, []);

  return {
    error: errorState.error,
    hasError: errorState.hasError,
    message: errorState.message,
    handleError,
    clearError,
    resetError
  };
};

export default useErrorHandler; 