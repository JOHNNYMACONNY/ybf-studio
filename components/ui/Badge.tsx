import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'neutral' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '' 
}) => {
  const baseStyles = "inline-flex items-center gap-1 rounded-full font-medium transition-all duration-200 focus:outline-none";
  
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };
  
  const variantStyles = {
    primary: 'badge-accent',
    secondary: 'badge-neutral',
    success: 'badge-success',
    warning: 'badge-accent',
    neutral: 'badge-neutral',
    outline: 'bg-transparent text-neutral-400 ring-1 ring-neutral-700 hover:bg-neutral-800',
  };

  return (
    <span className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge; 