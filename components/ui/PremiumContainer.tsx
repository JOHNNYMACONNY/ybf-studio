import React from 'react';

interface PremiumContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'narrow' | 'wide' | 'full' | 'section' | 'hero';
  background?: 'none' | 'premium' | 'glass' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const PremiumContainer: React.FC<PremiumContainerProps> = ({
  children,
  className = '',
  variant = 'default',
  background = 'none',
  padding = 'md',
  spacing = 'md'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'narrow':
        return 'max-w-4xl';
      case 'wide':
        return 'max-w-7xl';
      case 'full':
        return 'max-w-none';
      case 'section':
        return 'max-w-6xl';
      case 'hero':
        return 'max-w-6xl';
      default:
        return 'max-w-6xl';
    }
  };

  const getBackgroundClasses = () => {
    switch (background) {
      case 'premium':
        return 'bg-gradient-premium';
      case 'glass':
        return 'bg-white/5 backdrop-blur-xl border border-white/10';
      case 'gradient':
        return 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900';
      default:
        return '';
    }
  };

  const getPaddingClasses = () => {
    switch (padding) {
      case 'none':
        return '';
      case 'sm':
        return 'p-4';
      case 'md':
        return 'p-6';
      case 'lg':
        return 'p-8';
      case 'xl':
        return 'p-12';
      default:
        return 'p-6';
    }
  };

  const getSpacingClasses = () => {
    switch (spacing) {
      case 'none':
        return '';
      case 'sm':
        return 'space-y-4';
      case 'md':
        return 'space-y-6';
      case 'lg':
        return 'space-y-8';
      case 'xl':
        return 'space-y-12';
      default:
        return 'space-y-6';
    }
  };

  return (
    <div className={`${getBackgroundClasses()} ${getPaddingClasses()} ${className}`}>
      <div className={`container mx-auto ${getVariantClasses()}`}>
        <div className={getSpacingClasses()}>
          {children}
        </div>
      </div>
    </div>
  );
};

export { PremiumContainer }; 