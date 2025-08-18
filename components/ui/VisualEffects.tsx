import React from 'react';

interface VisualEffectsProps {
  variant?: 'glow' | 'gradient' | 'shimmer' | 'wave' | 'pulse' | 'ripple';
  color?: 'teal' | 'blue' | 'amber' | 'harmony' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  children?: React.ReactNode;
}

export const VisualEffects: React.FC<VisualEffectsProps> = ({
  variant = 'glow',
  color = 'harmony',
  size = 'md',
  className = '',
  children
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'teal':
        return 'from-teal-400 to-teal-600';
      case 'blue':
        return 'from-blue-400 to-blue-600';
      case 'amber':
        return 'from-amber-400 to-amber-600';
      case 'white':
        return 'from-white to-gray-200';
      case 'harmony':
      default:
        return 'from-teal-400 via-blue-500 to-amber-400';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8';
      case 'lg':
        return 'w-16 h-16';
      case 'xl':
        return 'w-24 h-24';
      default:
        return 'w-12 h-12';
    }
  };

  const getVariantContent = () => {
    switch (variant) {
      case 'glow':
        return (
          <div className={`relative ${getSizeClasses()} ${className}`}>
            <div className={`absolute inset-0 bg-gradient-to-r ${getColorClasses()} rounded-full blur-lg opacity-50 animate-pulse`} />
            <div className={`relative ${getSizeClasses()} bg-gradient-to-r ${getColorClasses()} rounded-full flex items-center justify-center`}>
              {children}
            </div>
          </div>
        );

      case 'gradient':
        return (
          <div className={`relative ${getSizeClasses()} ${className}`}>
            <div className={`absolute inset-0 bg-gradient-to-r ${getColorClasses()} rounded-full animate-spin`} style={{ animationDuration: '3s' }} />
            <div className={`absolute inset-1 bg-slate-900 rounded-full flex items-center justify-center`}>
              {children}
            </div>
          </div>
        );

      case 'shimmer':
        return (
          <div className={`relative ${getSizeClasses()} overflow-hidden ${className}`}>
            <div className={`absolute inset-0 bg-gradient-to-r ${getColorClasses()} rounded-full`} />
            <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer`} />
            <div className={`relative ${getSizeClasses()} bg-slate-900 rounded-full flex items-center justify-center`}>
              {children}
            </div>
          </div>
        );

      case 'wave':
        return (
          <div className={`relative ${getSizeClasses()} ${className}`}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`absolute inset-0 border-2 border-teal-400 rounded-full animate-ping`}
                style={{ 
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: '2s'
                }}
              />
            ))}
            <div className={`relative ${getSizeClasses()} bg-gradient-to-r ${getColorClasses()} rounded-full flex items-center justify-center`}>
              {children}
            </div>
          </div>
        );

      case 'pulse':
        return (
          <div className={`relative ${getSizeClasses()} ${className}`}>
            <div className={`absolute inset-0 bg-gradient-to-r ${getColorClasses()} rounded-full animate-pulse`} />
            <div className={`relative ${getSizeClasses()} bg-slate-900 rounded-full flex items-center justify-center`}>
              {children}
            </div>
          </div>
        );

      case 'ripple':
        return (
          <div className={`relative ${getSizeClasses()} ${className}`}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`absolute inset-0 border border-teal-400 rounded-full animate-ping`}
                style={{ 
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: '1.5s'
                }}
              />
            ))}
            <div className={`relative ${getSizeClasses()} bg-gradient-to-r ${getColorClasses()} rounded-full flex items-center justify-center`}>
              {children}
            </div>
          </div>
        );

      default:
        return (
          <div className={`relative ${getSizeClasses()} ${className}`}>
            <div className={`absolute inset-0 bg-gradient-to-r ${getColorClasses()} rounded-full blur-lg opacity-50 animate-pulse`} />
            <div className={`relative ${getSizeClasses()} bg-gradient-to-r ${getColorClasses()} rounded-full flex items-center justify-center`}>
              {children}
            </div>
          </div>
        );
    }
  };

  return getVariantContent();
};

// Standalone glow effect component
interface GlowEffectProps {
  children: React.ReactNode;
  color?: 'teal' | 'blue' | 'amber' | 'harmony';
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

export const GlowEffect: React.FC<GlowEffectProps> = ({
  children,
  color = 'harmony',
  intensity = 'medium',
  className = ''
}) => {
  const getGlowClasses = () => {
    const baseGlow = 'shadow-lg';
    switch (color) {
      case 'teal':
        return `${baseGlow} shadow-teal-400/50`;
      case 'blue':
        return `${baseGlow} shadow-blue-400/50`;
      case 'amber':
        return `${baseGlow} shadow-amber-400/50`;
      case 'harmony':
      default:
        return `${baseGlow} shadow-teal-400/30 shadow-blue-400/20`;
    }
  };

  const getIntensityClasses = () => {
    switch (intensity) {
      case 'low':
        return 'hover:shadow-xl';
      case 'high':
        return 'hover:shadow-2xl animate-pulse';
      default:
        return 'hover:shadow-xl';
    }
  };

  return (
    <div className={`${getGlowClasses()} ${getIntensityClasses()} transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
}; 