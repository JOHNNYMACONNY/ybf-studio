import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { useSwipeable } from 'react-swipeable';
import { ChevronLeft, ChevronRight, Heart, Share2, Play } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { AdvancedButton } from './AdvancedButton';

interface SwipeableCardProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onTap?: () => void;
  className?: string;
  showActions?: boolean;
  actions?: {
    left?: { icon: ReactNode; label: string; action: () => void; color?: string };
    right?: { icon: ReactNode; label: string; action: () => void; color?: string };
  };
  disabled?: boolean;
}

export const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onTap,
  className = '',
  showActions = true,
  actions,
  disabled = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [showActionHint, setShowActionHint] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Auto-hide action hint after 3 seconds
  useEffect(() => {
    if (showActionHint) {
      const timer = setTimeout(() => setShowActionHint(false), 3000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [showActionHint]);

  const handleDragStart = () => {
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    if (disabled) return;
    setIsDragging(false);
    setDragOffset(0);
  };

  const handleDrag = (deltaX: number) => {
    if (disabled) return;
    const maxOffset = 100;
    const clampedOffset = Math.max(-maxOffset, Math.min(maxOffset, deltaX));
    setDragOffset(clampedOffset);
  };

  const handleSwipeLeft = () => {
    if (disabled) return;
    if (onSwipeLeft) {
      onSwipeLeft();
    } else if (actions?.left) {
      actions.left.action();
    }
  };

  const handleSwipeRight = () => {
    if (disabled) return;
    if (onSwipeRight) {
      onSwipeRight();
    } else if (actions?.right) {
      actions.right.action();
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleSwipeLeft,
    onSwipedRight: handleSwipeRight,
    onSwiping: (eventData) => handleDrag(eventData.deltaX),
    onSwipeStart: handleDragStart,
    onSwiped: handleDragEnd,

    trackMouse: false
  });

  const handleTap = () => {
    if (disabled || isDragging) return;
    if (onTap) onTap();
  };

  const getActionBackground = (side: 'left' | 'right') => {
    const action = side === 'left' ? actions?.left : actions?.right;
    if (!action) return '';
    
    switch (action.color) {
      case 'red':
        return 'bg-red-500/20 border-red-500/30';
      case 'green':
        return 'bg-emerald-500/20 border-emerald-500/30';
      case 'blue':
        return 'bg-blue-500/20 border-blue-500/30';
      case 'amber':
        return 'bg-amber-500/20 border-amber-500/30';
      default:
        return 'bg-neutral-700/50 border-neutral-600';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Action Hints */}
      {showActions && !disabled && (
        <>
          {actions?.left && (
            <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-10 transition-opacity duration-300 ${
              showActionHint ? 'opacity-100' : 'opacity-0'
            }`}>
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${getActionBackground('left')}`}>
                {actions.left.icon}
                <span className="text-sm text-neutral-200">{actions.left.label}</span>
              </div>
            </div>
          )}
          
          {actions?.right && (
            <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 z-10 transition-opacity duration-300 ${
              showActionHint ? 'opacity-100' : 'opacity-0'
            }`}>
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${getActionBackground('right')}`}>
                <span className="text-sm text-neutral-200">{actions.right.label}</span>
                {actions.right.icon}
              </div>
            </div>
          )}
        </>
      )}

      {/* Swipeable Card */}
      <div

        {...swipeHandlers}
        onClick={handleTap}
        className={`relative transition-transform duration-200 ease-out cursor-pointer ${
          disabled ? 'cursor-not-allowed opacity-50' : ''
        }`}
        style={{
          transform: `translateX(${dragOffset}px)`,
          touchAction: 'pan-y pinch-zoom'
        }}
      >
        <GlassCard 
          className={`relative overflow-hidden ${
            isDragging ? 'shadow-2xl scale-[1.02]' : ''
          } transition-all duration-200`}
        >
          {/* Swipe Indicators */}
          {!disabled && (
            <>
              <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 to-emerald-600 transition-opacity duration-200 ${
                dragOffset > 20 ? 'opacity-100' : 'opacity-0'
              }`} />
              <div className={`absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 to-amber-600 transition-opacity duration-200 ${
                dragOffset < -20 ? 'opacity-100' : 'opacity-0'
              }`} />
            </>
          )}

          {/* Content */}
          <div className="relative z-10">
            {children}
          </div>

          {/* Swipe Overlay */}
          {isDragging && !disabled && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
          )}
        </GlassCard>
      </div>

      {/* Action Buttons (Desktop) */}
      {showActions && actions && !disabled && (
        <div className="hidden md:flex absolute -bottom-4 left-1/2 transform -translate-x-1/2 space-x-2">
          {actions.left && (
            <AdvancedButton
              onClick={actions.left.action}
              variant="ghost"
              size="sm"
              className={`min-h-[44px] min-w-[44px] ${getActionBackground('left')}`}
              aria-label={actions.left.label}
            >
              {actions.left.icon}
            </AdvancedButton>
          )}
          
          {actions.right && (
            <AdvancedButton
              onClick={actions.right.action}
              variant="ghost"
              size="sm"
              className={`min-h-[44px] min-w-[44px] ${getActionBackground('right')}`}
              aria-label={actions.right.label}
            >
              {actions.right.icon}
            </AdvancedButton>
          )}
        </div>
      )}

      {/* Swipe Instructions (Mobile) */}
      {showActions && !disabled && (
        <div className="md:hidden mt-4 text-center">
          <div className="flex items-center justify-center space-x-4 text-xs text-neutral-500">
            {actions?.left && (
              <div className="flex items-center space-x-1">
                <ChevronLeft className="h-3 w-3" />
                <span>Swipe left to {actions.left.label.toLowerCase()}</span>
              </div>
            )}
            {actions?.right && (
              <div className="flex items-center space-x-1">
                <span>Swipe right to {actions.right.label.toLowerCase()}</span>
                <ChevronRight className="h-3 w-3" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Predefined action sets
export const SwipeableCardActions = {
  like: {
    left: {
      icon: <Heart className="h-4 w-4" />,
      label: 'Like',
      action: () => console.log('Liked!'),
      color: 'red' as const
    },
    right: {
      icon: <Share2 className="h-4 w-4" />,
      label: 'Share',
      action: () => console.log('Shared!'),
      color: 'blue' as const
    }
  },
  play: {
    left: {
      icon: <Play className="h-4 w-4" />,
      label: 'Play',
      action: () => console.log('Play!'),
      color: 'green' as const
    },
    right: {
      icon: <Heart className="h-4 w-4" />,
      label: 'Favorite',
      action: () => console.log('Favorited!'),
      color: 'red' as const
    }
  }
};

export default SwipeableCard; 