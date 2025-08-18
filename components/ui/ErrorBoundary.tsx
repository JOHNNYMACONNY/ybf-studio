import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import { AdvancedButton } from './AdvancedButton';
import { GlassCard } from './GlassCard';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKey?: string | number;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleGoBack = () => {
    window.history.back();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

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
                We encountered an unexpected error. Don&apos;t worry, this is on our end and we&apos;re working to fix it.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-400 hover:text-white mb-2">
                  Error Details (Development)
                </summary>
                <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-3 text-xs text-red-300 font-mono overflow-auto max-h-32">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.message}
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Stack:</strong>
                      <pre className="whitespace-pre-wrap mt-1">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            <div className="space-y-3">
              <AdvancedButton
                onClick={this.handleReset}
                variant="gradient"
                size="lg"
                className="w-full"
                icon={<RefreshCw className="w-4 h-4" />}
              >
                Try Again
              </AdvancedButton>
              
              <div className="flex gap-3">
                <AdvancedButton
                  onClick={this.handleGoBack}
                  variant="ghost"
                  size="md"
                  className="flex-1"
                  icon={<ArrowLeft className="w-4 h-4" />}
                >
                  Go Back
                </AdvancedButton>
                
                <AdvancedButton
                  onClick={this.handleGoHome}
                  variant="ghost"
                  size="md"
                  className="flex-1"
                  icon={<Home className="w-4 h-4" />}
                >
                  Go Home
                </AdvancedButton>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-500">
                If this problem persists, please contact our support team.
              </p>
            </div>
          </GlassCard>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 