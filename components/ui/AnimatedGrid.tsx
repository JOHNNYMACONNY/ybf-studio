import React from 'react';

interface AnimatedGridProps {
  variant?: 'default' | 'premium' | 'minimal' | 'dots' | 'lines';
  color?: 'teal' | 'blue' | 'amber' | 'harmony' | 'white';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}

export const AnimatedGrid: React.FC<AnimatedGridProps> = ({
  variant = 'default',
  color = 'harmony',
  size = 'md',
  className = '',
  animated = true
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'teal':
        return 'rgba(20, 184, 166, 0.1)';
      case 'blue':
        return 'rgba(59, 130, 246, 0.1)';
      case 'amber':
        return 'rgba(251, 191, 36, 0.1)';
      case 'white':
        return 'rgba(255, 255, 255, 0.1)';
      case 'harmony':
      default:
        return 'rgba(20, 184, 166, 0.1)';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'bg-grid-small';
      case 'lg':
        return 'bg-grid-large';
      default:
        return 'bg-grid-medium';
    }
  };

  const getVariantContent = () => {
    const gridColor = getColorClasses();
    const sizeClass = getSizeClasses();
    const animationClass = animated ? 'animate-pulse' : '';

    switch (variant) {
      case 'premium':
        return (
          <div className={`absolute inset-0 opacity-20 ${animationClass}`}>
            {/* Primary grid */}
            <div 
              className={`absolute inset-0 ${sizeClass}`}
              style={{
                backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`
              }}
            />
            {/* Secondary diagonal grid */}
            <div 
              className={`absolute inset-0 ${sizeClass}`}
              style={{
                backgroundImage: `linear-gradient(45deg, ${gridColor} 1px, transparent 1px), linear-gradient(-45deg, ${gridColor} 1px, transparent 1px)`
              }}
            />
          </div>
        );

      case 'minimal':
        return (
          <div className={`absolute inset-0 opacity-10 ${animationClass}`}>
            <div 
              className={`absolute inset-0 ${sizeClass}`}
              style={{
                backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`
              }}
            />
          </div>
        );

      case 'dots':
        return (
          <div className={`absolute inset-0 opacity-20 ${animationClass}`}>
            <div 
              className={`absolute inset-0 ${sizeClass}`}
              style={{
                backgroundImage: `radial-gradient(circle, ${gridColor} 1px, transparent 1px)`
              }}
            />
          </div>
        );

      case 'lines':
        return (
          <div className={`absolute inset-0 opacity-20 ${animationClass}`}>
            {/* Horizontal lines */}
            <div 
              className={`absolute inset-0 ${sizeClass}`}
              style={{
                backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px)`
              }}
            />
            {/* Vertical lines */}
            <div 
              className={`absolute inset-0 ${sizeClass}`}
              style={{
                backgroundImage: `linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`
              }}
            />
          </div>
        );

      default:
        return (
          <div className={`absolute inset-0 opacity-20 ${animationClass}`}>
            <div 
              className={`absolute inset-0 ${sizeClass}`}
              style={{
                backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`
              }}
            />
          </div>
        );
    }
  };

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {getVariantContent()}
    </div>
  );
};

// Standalone grid overlay component
interface GridOverlayProps {
  children: React.ReactNode;
  variant?: 'default' | 'premium' | 'minimal' | 'dots' | 'lines';
  color?: 'teal' | 'blue' | 'amber' | 'harmony' | 'white';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}

export const GridOverlay: React.FC<GridOverlayProps> = ({
  children,
  variant = 'default',
  color = 'harmony',
  size = 'md',
  className = '',
  animated = true
}) => {
  return (
    <div className={`relative ${className}`}>
      <AnimatedGrid 
        variant={variant}
        color={color}
        size={size}
        animated={animated}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}; 