import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  variant?: 'default' | 'warm' | 'cool' | 'elevated';
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  hover = true,
  gradient = false,
  variant = 'default'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'warm':
        return 'bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-amber-300/10 border-amber-500/20';
      case 'cool':
        return 'bg-gradient-to-br from-teal-500/10 via-teal-400/5 to-teal-300/10 border-teal-500/20';
      case 'elevated':
        return 'bg-gradient-to-br from-white/10 via-white/5 to-white/3 border-white/20 shadow-xl';
      default:
        return 'bg-white/5 backdrop-blur-xl border border-white/10';
    }
  };

  return (
    <div className={`
      ${getVariantClasses()} rounded-2xl p-6
      ${gradient ? 'bg-gradient-to-br from-teal-400/10 to-blue-500/5' : ''}
      ${hover ? 'hover:border-teal-400/20 hover:bg-white/10 transition-all duration-300' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
}; 