import React from 'react';

interface PremiumBackgroundProps {
  children: React.ReactNode;
  variant?: 'premium' | 'card' | 'overlay' | 'accent' | 'minimal' | 'gradient';
  className?: string;
  overlay?: boolean;
  animated?: boolean;
  intensity?: 'low' | 'medium' | 'high';
}

export const PremiumBackground: React.FC<PremiumBackgroundProps> = ({
  children,
  variant = 'premium',
  className = '',
  overlay = false,
  animated = false,
  intensity = 'medium'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'premium':
        return 'bg-gradient-premium';
      case 'card':
        return 'bg-gradient-card';
      case 'overlay':
        return 'bg-gradient-overlay';
      case 'accent':
        return 'bg-gradient-accent';
      case 'minimal':
        return 'bg-slate-900/50';
      case 'gradient':
        return 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900';
      default:
        return 'bg-gradient-premium';
    }
  };

  const getIntensityClasses = () => {
    switch (intensity) {
      case 'low':
        return 'opacity-30';
      case 'high':
        return 'opacity-90';
      default:
        return 'opacity-60';
    }
  };

  const getAnimationClasses = () => {
    if (!animated) return '';
    return 'animate-pulse';
  };

  return (
    <div className={`
      relative min-h-screen w-full
      ${getVariantClasses()}
      ${getIntensityClasses()}
      ${getAnimationClasses()}
      ${className}
    `}>
      {overlay && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

// Specialized background components
export const PremiumHeroBackground: React.FC<Omit<PremiumBackgroundProps, 'variant'>> = (props) => {
  return <PremiumBackground variant="premium" overlay={true} {...props} />;
};

export const PremiumCardBackground: React.FC<Omit<PremiumBackgroundProps, 'variant'>> = (props) => {
  return <PremiumBackground variant="card" {...props} />;
};

export const PremiumAccentBackground: React.FC<Omit<PremiumBackgroundProps, 'variant'>> = (props) => {
  return <PremiumBackground variant="accent" {...props} />;
};

// Background pattern components
export const PremiumPatternBackground: React.FC<{
  children: React.ReactNode;
  pattern?: 'dots' | 'grid' | 'waves' | 'circles';
  className?: string;
}> = ({ children, pattern = 'dots', className = '' }) => {
  const getPatternClasses = () => {
    switch (pattern) {
      case 'dots':
        return 'bg-gradient-dots bg-dots';
      case 'grid':
        return 'bg-gradient-pattern-grid bg-pattern-grid';
      case 'waves':
        return 'bg-gradient-waves';
      case 'circles':
        return 'bg-gradient-circles';
      default:
        return '';
    }
  };

  return (
    <div className={`
      relative min-h-screen w-full
      bg-gradient-premium
      ${getPatternClasses()}
      ${className}
    `}>
      {children}
    </div>
  );
}; 