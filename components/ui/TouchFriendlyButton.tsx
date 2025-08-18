import React, { useState, useRef } from 'react';

interface TouchFriendlyButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  hapticFeedback?: boolean;
}

export const TouchFriendlyButton: React.FC<TouchFriendlyButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  hapticFeedback = true
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Touch-friendly minimum size (44px for accessibility)
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'min-h-[44px] px-4 py-2 text-sm';
      case 'lg':
        return 'min-h-[48px] px-6 py-3 text-lg';
      case 'xl':
        return 'min-h-[52px] px-8 py-4 text-xl';
      default:
        return 'min-h-[44px] px-5 py-2.5 text-base';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 hover:border-slate-500/50 text-white';
      case 'ghost':
        return 'bg-transparent hover:bg-white/10 border border-transparent hover:border-white/20 text-gray-300 hover:text-white';
      case 'gradient':
        return 'bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 text-white shadow-lg hover:shadow-xl';
      default:
        return 'bg-teal-500 hover:bg-teal-600 text-white shadow-md hover:shadow-lg';
    }
  };

  // Haptic feedback simulation
  const triggerHapticFeedback = () => {
    if (!hapticFeedback || typeof window === 'undefined') return;
    
    // Try to use native haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    
    // Visual feedback as fallback
    if (buttonRef.current) {
      buttonRef.current.style.transform = 'scale(0.98)';
      setTimeout(() => {
        if (buttonRef.current) {
          buttonRef.current.style.transform = 'scale(1)';
        }
      }, 100);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (disabled || loading) return;
    
    triggerHapticFeedback();
    onClick?.();
  };

  const handleTouchStart = () => {
    if (disabled || loading) return;
    setIsPressed(true);
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
  };

  const handleMouseDown = () => {
    if (disabled || loading) return;
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
  };

  // Prevent context menu on long press
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onContextMenu={handleContextMenu}
      disabled={disabled || loading}
      className={`
        relative inline-flex items-center justify-center font-medium rounded-xl
        transition-all duration-200 ease-out
        focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:ring-offset-2 focus:ring-offset-slate-900
        active:scale-95
        ${getSizeClasses()}
        ${getVariantClasses()}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${loading ? 'cursor-wait' : ''}
        ${fullWidth ? 'w-full' : ''}
        ${className}
        ${isPressed ? 'scale-95 shadow-inner' : ''}
        ${isHovered ? 'transform-gpu' : ''}
      `}
      style={{
        // Ensure touch-friendly sizing
        minWidth: size === 'xl' ? '120px' : size === 'lg' ? '100px' : '80px',
        touchAction: 'manipulation', // Optimize for touch
        WebkitTapHighlightColor: 'transparent', // Remove default tap highlight
      }}
      aria-disabled={disabled || loading}
      aria-busy={loading}
    >
      {/* Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Content */}
      <div className={`flex items-center space-x-2 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {icon && iconPosition === 'left' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        <span className="flex-shrink-0">{children}</span>
        {icon && iconPosition === 'right' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
      </div>

      {/* Ripple Effect */}
      <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-white/20 transform scale-0 transition-transform duration-300 ease-out" />
      </div>

      {/* Touch Target Indicator (for development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute inset-0 border-2 border-red-500/20 rounded-xl pointer-events-none" />
      )}
    </button>
  );
}; 