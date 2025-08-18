import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'elevated' | 'glass' | 'gradient' | 'warm' | 'cool' | 'premium';
  background?: string;
  ring?: boolean;
  scale?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = true, 
  padding = 'md',
  variant = 'default',
  background,
  ring = true,
  scale = true
}) => {
  const baseStyles = "rounded-xl transition-all duration-300 focus:outline-none";
  
  const paddingStyles = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };
  
  const variantStyles = {
    default: 'card-base',
    elevated: 'card-elevated shadow-card-hover',
    glass: 'card-glass backdrop-blur-xl',
    gradient: 'bg-gradient-card ring-1 ring-neutral-800/60 shadow-sm',
    // New mathematical harmony variants
    warm: 'bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-amber-300/10 border-amber-500/20 backdrop-blur-xl',
    cool: 'bg-gradient-to-br from-teal-500/10 via-teal-400/5 to-teal-300/10 border-teal-500/20 backdrop-blur-xl',
    premium: 'bg-gradient-premium border-white/10 backdrop-blur-premium shadow-macos',
  };
  
  const hoverStyles = hover ? "hover-lift" : "";
  const scaleStyles = scale && hover ? "hover:scale-105" : "";
  const backgroundStyle = background ? { backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {};
  const ringStyle = ring ? "" : "ring-0";
  
  return (
    <div 
      className={`${baseStyles} ${paddingStyles[padding]} ${variantStyles[variant]} ${hoverStyles} ${scaleStyles} ${ringStyle} ${className}`}
      style={backgroundStyle}
    >
      {children}
    </div>
  );
};

export default Card;