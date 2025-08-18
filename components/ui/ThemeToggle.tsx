import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { useInteraction } from '../hooks/useInteraction';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  variant?: 'default' | 'minimal' | 'premium';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  size = 'md',
  showLabel = false,
  variant = 'default'
}) => {
  const { mode, effectiveMode, toggleMode, isDark, isLight } = useTheme();
  const { isHovered, isPressed, interactionProps } = useInteraction();

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8';
      case 'md':
        return 'w-10 h-10';
      case 'lg':
        return 'w-12 h-12';
      default:
        return 'w-10 h-10';
    }
  };

  const getVariantClasses = () => {
    const baseClasses = 'relative rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-neutral-900';
    
    switch (variant) {
      case 'minimal':
        return `${baseClasses} bg-transparent border border-white/20 hover:border-white/40`;
      case 'premium':
        return `${baseClasses} bg-gradient-to-r from-teal-400/20 to-blue-500/20 border border-white/20 hover:border-white/40 backdrop-blur-sm`;
      default:
        return `${baseClasses} bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/50 backdrop-blur-sm`;
    }
  };

  const getInteractionClasses = () => {
    const classes = [];
    
    if (isHovered) {
      classes.push('hover:scale-105');
      if (variant === 'premium') {
        classes.push('hover:shadow-glow');
      }
    }
    
    if (isPressed) {
      classes.push('scale-95');
    }
    
    return classes.join(' ');
  };

  const renderIcon = () => {
    if (isDark) {
      return (
        <svg
          className="w-5 h-5 text-amber-400 transition-transform duration-300"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>
      );
    }

    return (
      <svg
        className="w-5 h-5 text-blue-400 transition-transform duration-300"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
      </svg>
    );
  };

  const getLabel = () => {
    if (mode === 'auto') {
      return isDark ? 'Dark (Auto)' : 'Light (Auto)';
    }
    return isDark ? 'Dark' : 'Light';
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        className={`
          ${getSizeClasses()}
          ${getVariantClasses()}
          ${getInteractionClasses()}
          flex items-center justify-center
        `}
        onClick={toggleMode}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        title={`Current: ${getLabel()}`}
        {...interactionProps}
      >
        {/* Animated icon */}
        <div className="relative">
          {renderIcon()}
          
          {/* Pulse effect for auto mode */}
          {mode === 'auto' && (
            <div className="absolute inset-0 bg-current rounded-full animate-ping opacity-20" />
          )}
        </div>
      </button>
      
      {/* Optional label */}
      {showLabel && (
        <span className="text-sm text-gray-300 font-medium">
          {getLabel()}
        </span>
      )}
    </div>
  );
}; 