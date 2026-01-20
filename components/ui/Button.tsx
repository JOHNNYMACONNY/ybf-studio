import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'warning' | 'destructive' | 'gradient' | 'premium' | 'teal' | 'amber' | 'spline-primary' | 'spline-secondary';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  glow?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  glow = false,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900";

  // Enhanced size styles with touch-friendly minimums
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm min-h-[44px] min-w-[44px]', // Touch-friendly minimum
    md: 'px-6 py-3 text-base min-h-[48px] min-w-[48px]', // Enhanced touch target
    lg: 'px-8 py-4 text-lg min-h-[56px] min-w-[56px]', // Large touch target
    xl: 'px-10 py-5 text-xl min-h-[64px] min-w-[64px]', // Extra large touch target
  };

  const variantStyles = {
    primary: 'btn-primary hover-glow-amber',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    success: 'btn-success hover-glow',
    warning: 'bg-amber-600 hover:bg-amber-500 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 text-white shadow-sm hover:shadow-glow-amber',
    destructive: 'bg-red-600 hover:bg-red-500 focus-visible:ring-red-300 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 text-white shadow-sm hover:shadow-glow-red',
    // New mathematical harmony variants
    gradient: 'bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 text-white shadow-md hover:shadow-lg hover:scale-105 focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-neutral-900',
    premium: 'bg-gradient-to-r from-teal-400 via-blue-500 to-teal-400 text-white shadow-md hover:shadow-lg hover:scale-105 focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-neutral-900',
    teal: 'bg-gradient-to-r from-teal-400 to-teal-600 hover:from-teal-500 hover:to-teal-700 text-white shadow-md hover:shadow-lg hover:scale-105 focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-neutral-900',
    amber: 'bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white shadow-md hover:shadow-lg hover:scale-105 focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-neutral-900',
    'spline-primary': 'btn-3d-spline text-white font-semibold rounded-lg',
    'spline-secondary': 'btn-3d-spline-accent text-white font-semibold rounded-lg',
  };

  const glowStyles = glow ? 'glow-effect-hover' : '';

  const renderContent = () => {
    if (icon && iconPosition === 'right') {
      return (
        <>
          {children}
          {icon}
        </>
      );
    }
    return (
      <>
        {icon}
        {children}
      </>
    );
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${glowStyles} ${className}`}
      {...props}
    >
      {renderContent()}
    </button>
  );
};

export default Button;