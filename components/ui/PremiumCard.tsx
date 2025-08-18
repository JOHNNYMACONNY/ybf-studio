import React from 'react';

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  variant?: 'default' | 'elevated' | 'glass' | 'overlay' | 'premium' | 'minimal';
  scale?: boolean;
  glow?: boolean;
  border?: boolean;
  onClick?: () => void;
}

export const PremiumCard: React.FC<PremiumCardProps> = ({ 
  children, 
  className = '', 
  hover = true,
  variant = 'default',
  scale = true,
  glow = false,
  border = true,
  onClick
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'elevated':
        return 'bg-gradient-to-br from-slate-800/90 via-slate-800/90 to-slate-800/95 border-white/10 shadow-card-hover';
      case 'glass':
        return 'bg-gradient-card backdrop-blur-xl border-white/10 shadow-glass';
      case 'overlay':
        return 'bg-gradient-overlay backdrop-blur-sm border-white/20';
      case 'premium':
        return 'bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 border-teal-400/20 shadow-macos';
      case 'minimal':
        return 'bg-slate-800/50 backdrop-blur-sm border-white/5 shadow-sm';
      default:
        return 'bg-gradient-to-br from-slate-800/90 via-slate-800/90 to-slate-800/95 border-white/10 shadow-lg';
    }
  };

  const getGlowClasses = () => {
    if (!glow) return '';
    return 'shadow-[0_0_30px_rgba(20,184,166,0.15)] hover:shadow-[0_0_40px_rgba(20,184,166,0.25)]';
  };

  const getBorderClasses = () => {
    if (!border) return '';
    return 'border border-white/10';
  };

  return (
    <div 
      className={`
        ${getVariantClasses()} rounded-2xl p-6
        ${getBorderClasses()}
        ${getGlowClasses()}
        ${hover ? 'hover:border-white/20 transition-all duration-300' : ''}
        ${scale && hover ? 'hover:scale-105' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}; 