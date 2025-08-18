import React from 'react';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  gradient?: 'teal-blue' | 'amber-orange' | 'purple-pink' | 'amber-teal' | 'teal-emerald';
}

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  className = '',
  gradient = 'teal-blue'
}) => {
  const getGradientClass = () => {
    switch (gradient) {
      case 'amber-orange':
        return 'bg-gradient-to-r from-amber-400 to-orange-500';
      case 'purple-pink':
        return 'bg-gradient-to-r from-purple-400 to-pink-500';
      case 'amber-teal':
        return 'bg-gradient-to-r from-amber-400 to-teal-400'; // Harmonious warm-to-cool
      case 'teal-emerald':
        return 'bg-gradient-to-r from-teal-400 to-emerald-400'; // Harmonious cool progression
      default:
        return 'bg-gradient-to-r from-teal-400 to-blue-500'; // Keep existing default
    }
  };

  return (
    <span className={`${getGradientClass()} bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  );
}; 