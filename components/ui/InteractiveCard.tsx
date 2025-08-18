import React, { useState, useRef, ReactNode } from 'react';
import Image from 'next/image';
import { AdvancedButton } from './AdvancedButton';

interface InteractiveCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'glass' | 'premium';
  interactive?: boolean;
  hoverEffect?: 'scale' | 'glow' | 'lift' | 'all';
  onClick?: () => void;
  onHover?: (isHovered: boolean) => void;
  disabled?: boolean;
  loading?: boolean;
  actions?: {
    primary?: { label: string; action: () => void; variant?: string };
    secondary?: { label: string; action: () => void; variant?: string };
  };
  badge?: { text: string; variant?: 'success' | 'warning' | 'error' | 'info' };
  image?: { src: string; alt: string; aspectRatio?: 'square' | 'video' | 'wide' };
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  className = '',
  variant = 'default',
  interactive = true,
  hoverEffect = 'all',
  onClick,
  onHover,
  disabled = false,
  loading = false,
  actions,
  badge,
  image
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (disabled || loading) return;
    setIsHovered(true);
    onHover?.(true);
  };

  const handleMouseLeave = () => {
    if (disabled || loading) return;
    setIsHovered(false);
    setIsPressed(false);
    onHover?.(false);
  };

  const handleMouseDown = () => {
    if (disabled || loading) return;
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    if (disabled || loading) return;
    setIsPressed(false);
  };

  const handleClick = () => {
    if (disabled || loading) return;
    onClick?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled || loading) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'elevated':
        return 'bg-neutral-800/80 border border-neutral-700/50 shadow-lg';
      case 'glass':
        return 'bg-white/5 backdrop-blur-xl border border-white/10';
      case 'premium':
        return 'bg-gradient-to-br from-neutral-800/90 to-neutral-900/90 border border-amber-500/20 shadow-xl';
      default:
        return 'bg-neutral-800/60 border border-neutral-700/30';
    }
  };

  const getHoverClasses = () => {
    if (!interactive || disabled || loading) return '';

    const baseClasses = 'transition-all duration-300 ease-out';
    let effectClasses = '';

    if (hoverEffect === 'scale' || hoverEffect === 'all') {
      effectClasses += ' hover:scale-105';
    }
    if (hoverEffect === 'glow' || hoverEffect === 'all') {
      effectClasses += ' hover:shadow-amber-500/20 hover:shadow-2xl';
    }
    if (hoverEffect === 'lift' || hoverEffect === 'all') {
      effectClasses += ' hover:-translate-y-1';
    }

    return `${baseClasses} ${effectClasses}`;
  };

  const getInteractiveClasses = () => {
    if (!interactive || disabled || loading) return '';

    return `
      cursor-pointer
      focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-neutral-900
      active:scale-[0.98] active:translate-y-0
      ${isHovered ? 'shadow-2xl shadow-amber-500/10' : ''}
      ${isPressed ? 'scale-[0.98] translate-y-0' : ''}
      ${isFocused ? 'ring-2 ring-amber-500/50 ring-offset-2 ring-offset-neutral-900' : ''}
    `;
  };

  const getBadgeClasses = () => {
    if (!badge) return '';
    
    const baseClasses = 'absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium z-10';
    switch (badge.variant) {
      case 'success':
        return `${baseClasses} bg-emerald-500/20 text-emerald-300 border border-emerald-500/30`;
      case 'warning':
        return `${baseClasses} bg-amber-500/20 text-amber-300 border border-amber-500/30`;
      case 'error':
        return `${baseClasses} bg-red-500/20 text-red-300 border border-red-500/30`;
      case 'info':
        return `${baseClasses} bg-blue-500/20 text-blue-300 border border-blue-500/30`;
      default:
        return `${baseClasses} bg-neutral-700/50 text-neutral-300 border border-neutral-600`;
    }
  };

  const getImageClasses = () => {
    if (!image) return '';
    
    const aspectClasses = {
      square: 'aspect-square',
      video: 'aspect-video',
      wide: 'aspect-[16/9]'
    };
    
    return `w-full object-cover rounded-t-xl ${aspectClasses[image.aspectRatio || 'square']}`;
  };

  return (
    <div
      ref={cardRef}
      className={`
        relative group
        ${getVariantClasses()}
        ${getHoverClasses()}
        ${getInteractiveClasses()}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${loading ? 'cursor-wait' : ''}
        ${className}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      tabIndex={interactive && !disabled ? 0 : undefined}
      role={interactive ? 'button' : undefined}
      aria-disabled={disabled}
      aria-busy={loading}
    >
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm rounded-xl flex items-center justify-center z-20">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-500 border-t-transparent" />
        </div>
      )}

      {/* Badge */}
      {badge && (
        <div className={getBadgeClasses()}>
          {badge.text}
        </div>
      )}

      {/* Image */}
      {image && (
        <div className="relative overflow-hidden">
          <Image
            src={image.src}
            alt={image.alt}
            width={400}
            height={400}
            className={`${getImageClasses()} transition-transform duration-300 group-hover:scale-105`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}

      {/* Content */}
      <div className={`p-6 ${image ? '' : 'rounded-xl'}`}>
        {children}
      </div>

      {/* Actions */}
      {actions && (
        <div className="px-6 pb-6 space-y-3">
          {actions.primary && (
            <AdvancedButton
              onClick={(e) => {
                e.stopPropagation();
                actions.primary!.action();
              }}
              variant={(actions.primary.variant as 'gradient' | 'primary' | 'secondary' | 'ghost') || 'gradient'}
              size="md"
              className="w-full min-h-[48px]"
              disabled={disabled || loading}
            >
              {actions.primary.label}
            </AdvancedButton>
          )}
          
          {actions.secondary && (
            <AdvancedButton
              onClick={(e) => {
                e.stopPropagation();
                actions.secondary!.action();
              }}
              variant="ghost"
              size="md"
              className="w-full min-h-[48px]"
              disabled={disabled || loading}
            >
              {actions.secondary.label}
            </AdvancedButton>
          )}
        </div>
      )}

      {/* Hover Glow Effect */}
      {interactive && !disabled && !loading && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}
    </div>
  );
};

// Predefined card variants
export const InteractiveCardVariants = {
  beat: {
    variant: 'elevated' as const,
    hoverEffect: 'all' as const,
    image: { aspectRatio: 'square' as const }
  },
  service: {
    variant: 'glass' as const,
    hoverEffect: 'lift' as const
  },
  blog: {
    variant: 'default' as const,
    hoverEffect: 'scale' as const,
    image: { aspectRatio: 'wide' as const }
  },
  premium: {
    variant: 'premium' as const,
    hoverEffect: 'all' as const
  }
};

export default InteractiveCard; 