import React from 'react';
import { useInteraction } from '../hooks/useInteraction';
import { useAnimation } from '../hooks/useAnimation';

interface AdvancedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'gradient' | 'premium' | 'teal' | 'amber' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  glow?: boolean;
  ripple?: boolean;
  pulse?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  stagger?: number;
  delay?: number;
}

export const AdvancedButton: React.FC<AdvancedButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  glow = false,
  ripple = true,
  pulse = false,
  loading = false,
  icon,
  iconPosition = 'left',
  stagger = 0,
  delay = 0,
  disabled = false,
  ...props
}) => {
  const { isHovered, isPressed, isFocused, interactionProps } = useInteraction({
    disabled: disabled || loading,
    delay: 50
  });

  const { isVisible, ref: animationRef } = useAnimation({
    delay: delay + stagger,
    trigger: 'scroll'
  }) as { isVisible: boolean; ref: React.RefObject<HTMLButtonElement> };

  const getVariantClasses = () => {
    const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900';
    
    switch (variant) {
      case 'primary':
        return `${baseClasses} bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 text-white shadow-md hover:shadow-lg focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-neutral-900`;
      case 'secondary':
        return `${baseClasses} bg-gray-700 hover:bg-gray-600 text-white shadow-md hover:shadow-lg focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-neutral-900`;
      case 'gradient':
        return `${baseClasses} bg-gradient-to-r from-teal-400 via-blue-500 to-teal-400 hover:from-teal-500 hover:via-blue-600 hover:to-teal-500 text-white shadow-md hover:shadow-lg focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-neutral-900`;
      case 'premium':
        return `${baseClasses} bg-gradient-to-r from-teal-400 via-blue-500 to-teal-400 text-white shadow-md hover:shadow-lg focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-neutral-900`;
      case 'teal':
        return `${baseClasses} bg-gradient-to-r from-3d-spline-primary to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-3d-spline-text-primary shadow-md hover:shadow-lg focus:ring-2 focus:ring-3d-spline-primary focus:ring-offset-2 focus:ring-offset-neutral-900`;
      case 'amber':
        return `${baseClasses} bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white shadow-md hover:shadow-lg focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-neutral-900`;
      case 'ghost':
        return `${baseClasses} bg-transparent hover:bg-white/10 text-3d-spline-text-primary border border-3d-spline-primary/20 hover:border-3d-spline-primary/40 focus:ring-2 focus:ring-3d-spline-primary/50 focus:ring-offset-2 focus:ring-offset-neutral-900`;
      default:
        return `${baseClasses} bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 text-white shadow-md hover:shadow-lg focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-neutral-900`;
    }
  };

  // Enhanced size classes with touch-friendly minimums
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm min-h-[44px] min-w-[44px]'; // Touch-friendly minimum
      case 'md':
        return 'px-6 py-3 text-base min-h-[48px] min-w-[48px]'; // Enhanced touch target
      case 'lg':
        return 'px-8 py-4 text-lg min-h-[56px] min-w-[56px]'; // Large touch target
      case 'xl':
        return 'px-10 py-5 text-xl min-h-[64px] min-w-[64px]'; // Extra large touch target
      default:
        return 'px-6 py-3 text-base min-h-[48px] min-w-[48px]'; // Default enhanced touch target
    }
  };

  const getInteractionClasses = () => {
    const classes = [];
    
    if (!disabled && !loading) {
      if (isHovered) {
        classes.push('hover:scale-105');
        if (glow) classes.push('hover:shadow-glow');
      }
      
      if (isPressed) {
        classes.push('scale-95');
        if (ripple) classes.push('shadow-inner');
      }
      
      if (isFocused) {
        classes.push('ring-2 ring-opacity-50');
      }
    }
    
    if (pulse && !disabled && !loading) {
      classes.push('animate-pulse');
    }
    
    return classes.join(' ');
  };

  const getAnimationClasses = () => {
    if (!isVisible) {
      return 'opacity-0 translate-y-2 scale-95';
    }
    return 'opacity-100 translate-y-0 scale-100';
  };

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Loading...</span>
        </>
      );
    }

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
      ref={animationRef}
      className={`
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${getInteractionClasses()}
        ${getAnimationClasses()}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      disabled={disabled || loading}
      {...interactionProps}
      {...props}
    >
      {/* Ripple effect */}
      {ripple && isPressed && !disabled && !loading && (
        <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" />
      )}
      
      {/* Glow effect */}
      {glow && isHovered && !disabled && !loading && (
        <div className="absolute inset-0 bg-gradient-to-r from-teal-400/30 to-blue-500/30 rounded-full blur-lg -z-10" />
      )}
      
      {/* Content */}
      <div className="relative z-10 flex items-center gap-2">
        {renderContent()}
      </div>
    </button>
  );
}; 