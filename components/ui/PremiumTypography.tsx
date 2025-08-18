import React from 'react';

interface PremiumTypographyProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption' | 'display';
  gradient?: 'premium' | 'glow' | 'brand' | 'teal-blue' | 'amber-teal' | 'none';
  className?: string;
  glow?: boolean;
  animated?: boolean;
}

export const PremiumTypography: React.FC<PremiumTypographyProps> = ({
  children,
  variant = 'body',
  gradient = 'none',
  className = '',
  glow = false,
  animated = false
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'display':
        return 'font-display-premium text-6xl md:text-8xl font-bold';
      case 'h1':
        return 'font-heading-premium text-4xl md:text-6xl font-bold';
      case 'h2':
        return 'font-heading-premium text-3xl md:text-5xl font-semibold';
      case 'h3':
        return 'font-heading-premium text-2xl md:text-4xl font-semibold';
      case 'h4':
        return 'font-heading-premium text-xl md:text-3xl font-medium';
      case 'h5':
        return 'font-heading-premium text-lg md:text-2xl font-medium';
      case 'h6':
        return 'font-heading-premium text-base md:text-xl font-medium';
      case 'caption':
        return 'font-body-premium text-sm text-gray-400';
      default:
        return 'font-body-premium text-base leading-relaxed';
    }
  };

  const getGradientClasses = () => {
    switch (gradient) {
      case 'premium':
        return 'text-gradient-premium';
      case 'glow':
        return 'text-gradient-glow';
      case 'brand':
        return 'text-gradient-brand';
      case 'teal-blue':
        return 'bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent';
      case 'amber-teal':
        return 'bg-gradient-to-r from-amber-400 to-teal-400 bg-clip-text text-transparent';
      default:
        return 'text-white';
    }
  };

  const getGlowClasses = () => {
    if (!glow) return '';
    return 'drop-shadow-[0_0_20px_rgba(20,184,166,0.3)]';
  };

  const getAnimationClasses = () => {
    if (!animated) return '';
    return 'animate-fadeInUp';
  };

  const Component = variant.startsWith('h') ? variant as keyof React.JSX.IntrinsicElements : 'div';

  return (
    <Component className={`
      ${getVariantClasses()}
      ${getGradientClasses()}
      ${getGlowClasses()}
      ${getAnimationClasses()}
      ${className}
    `}>
      {children}
    </Component>
  );
};

// Specialized components for common use cases
export const PremiumHeading: React.FC<Omit<PremiumTypographyProps, 'variant'> & { level?: 1 | 2 | 3 | 4 | 5 | 6 }> = ({
  level = 1,
  ...props
}) => {
  const variant = `h${level}` as const;
  return <PremiumTypography variant={variant} {...props} />;
};

export const PremiumDisplay: React.FC<Omit<PremiumTypographyProps, 'variant'>> = (props) => {
  return <PremiumTypography variant="display" {...props} />;
};

export const PremiumBody: React.FC<Omit<PremiumTypographyProps, 'variant'>> = (props) => {
  return <PremiumTypography variant="body" {...props} />;
};

export const PremiumCaption: React.FC<Omit<PremiumTypographyProps, 'variant'>> = (props) => {
  return <PremiumTypography variant="caption" {...props} />;
}; 