import React from 'react';
import { AlertTriangle, RefreshCw, X } from 'lucide-react';
import { AdvancedButton } from './AdvancedButton';
import { GlassCard } from './GlassCard';

interface ErrorFallbackProps {
  error?: Error;
  message?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  variant?: 'inline' | 'card' | 'fullscreen';
  className?: string;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  message,
  onRetry,
  onDismiss,
  variant = 'inline',
  className = ''
}) => {
  const errorMessage = message || error?.message || 'Something went wrong';

  const renderContent = () => (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0">
        <AlertTriangle className="w-5 h-5 text-red-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-red-300 font-medium">
          {errorMessage}
        </p>
        {process.env.NODE_ENV === 'development' && error?.stack && (
          <details className="mt-2">
            <summary className="cursor-pointer text-xs text-gray-400 hover:text-white">
              Stack trace (Development)
            </summary>
            <pre className="mt-1 text-xs text-gray-500 font-mono overflow-auto max-h-20">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
      <div className="flex-shrink-0 flex gap-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title="Retry"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );

  switch (variant) {
    case 'fullscreen':
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
          <GlassCard className="max-w-md w-full text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-300 mb-6">
                {errorMessage}
              </p>
            </div>

            {onRetry && (
              <AdvancedButton
                onClick={onRetry}
                variant="gradient"
                size="lg"
                className="w-full"
                icon={<RefreshCw className="w-4 h-4" />}
              >
                Try Again
              </AdvancedButton>
            )}
          </GlassCard>
        </div>
      );

    case 'card':
      return (
        <GlassCard className={`p-6 ${className}`}>
          <div className="text-center">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Error Occurred
            </h3>
            <p className="text-gray-300 mb-4">
              {errorMessage}
            </p>
            {onRetry && (
              <AdvancedButton
                onClick={onRetry}
                variant="gradient"
                size="md"
                icon={<RefreshCw className="w-4 h-4" />}
              >
                Retry
              </AdvancedButton>
            )}
          </div>
        </GlassCard>
      );

    case 'inline':
    default:
      return (
        <div className={`bg-red-900/20 border border-red-500/20 rounded-lg p-4 ${className}`}>
          {renderContent()}
        </div>
      );
  }
};

export default ErrorFallback; 