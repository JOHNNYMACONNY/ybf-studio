import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'pulse' | 'dots' | 'bars' | 'ring';
  className?: string;
  color?: 'default' | 'teal' | 'amber' | 'white';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  className = '',
  color = 'default'
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    default: 'text-teal-400',
    teal: 'text-teal-400',
    amber: 'text-amber-400',
    white: 'text-white'
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'pulse':
        return (
          <div className={`animate-pulse ${sizeClasses[size]} ${colorClasses[color]} ${className}`}>
            <div className="w-full h-full bg-current rounded-full" />
          </div>
        );

      case 'dots':
        return (
          <div className={`flex space-x-1 ${className}`}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`${sizeClasses[size]} bg-current rounded-full animate-bounce ${colorClasses[color]}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        );

      case 'bars':
        return (
          <div className={`flex space-x-1 ${className}`}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-1 bg-current rounded-full animate-pulse ${colorClasses[color]}`}
                style={{ 
                  height: size === 'sm' ? '16px' : size === 'md' ? '24px' : size === 'lg' ? '32px' : '48px',
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        );

      case 'ring':
        return (
          <div className={`${sizeClasses[size]} ${className}`}>
            <div className={`w-full h-full border-2 border-current/20 border-t-current rounded-full animate-spin ${colorClasses[color]}`} />
          </div>
        );

      default:
        return (
          <div className={`${sizeClasses[size]} ${className}`}>
            <div className={`w-full h-full border-2 border-current/20 border-t-current rounded-full animate-spin ${colorClasses[color]}`} />
          </div>
        );
    }
  };

  return renderSpinner();
};

export default LoadingSpinner; 