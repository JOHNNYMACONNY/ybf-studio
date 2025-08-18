import React, { useState, useEffect } from 'react';
import { PremiumContainer } from './PremiumContainer';

interface MobileOptimizedLayoutProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showMobileIndicator?: boolean;
  enablePullToRefresh?: boolean;
  onPullToRefresh?: () => void;
}

export const MobileOptimizedLayout: React.FC<MobileOptimizedLayoutProps> = ({
  children,
  className = '',
  padding = 'md',
  maxWidth = 'lg',
  showMobileIndicator = false,
  enablePullToRefresh = false,
  onPullToRefresh
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [pullToRefreshState, setPullToRefreshState] = useState<'idle' | 'pulling' | 'refreshing'>('idle');
  const [pullDistance, setPullDistance] = useState(0);

  // Detect device type
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Pull to refresh functionality
  useEffect(() => {
    if (!enablePullToRefresh || !onPullToRefresh) return;

    let startY = 0;
    let currentY = 0;
    let isPulling = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
        isPulling = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling) return;
      
      currentY = e.touches[0].clientY;
      const distance = currentY - startY;
      
      if (distance > 0 && window.scrollY === 0) {
        e.preventDefault();
        setPullDistance(Math.min(distance * 0.5, 100));
        
        if (distance > 80) {
          setPullToRefreshState('pulling');
        } else {
          setPullToRefreshState('idle');
        }
      }
    };

    const handleTouchEnd = () => {
      if (pullToRefreshState === 'pulling') {
        setPullToRefreshState('refreshing');
        onPullToRefresh();
        
        setTimeout(() => {
          setPullToRefreshState('idle');
          setPullDistance(0);
        }, 1000);
      } else {
        setPullDistance(0);
      }
      
      isPulling = false;
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enablePullToRefresh, onPullToRefresh, pullToRefreshState]);

  const getPaddingClasses = () => {
    switch (padding) {
      case 'none':
        return 'p-0';
      case 'sm':
        return 'p-4 md:p-6';
      case 'lg':
        return 'p-6 md:p-8 lg:p-10';
      case 'xl':
        return 'p-8 md:p-10 lg:p-12';
      default:
        return 'p-4 md:p-6 lg:p-8';
    }
  };

  const getMaxWidthClasses = () => {
    switch (maxWidth) {
      case 'sm':
        return 'max-w-sm';
      case 'md':
        return 'max-w-md';
      case 'lg':
        return 'max-w-lg';
      case 'xl':
        return 'max-w-xl';
      default:
        return 'max-w-7xl';
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-premium ${className}`}>
      {/* Pull to Refresh Indicator */}
      {enablePullToRefresh && (
        <div 
          className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300"
          style={{ 
            transform: `translate(-50%, ${pullDistance}px)`,
            opacity: pullDistance > 0 ? 1 : 0
          }}
        >
          <div className="flex items-center space-x-2 bg-slate-800/90 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
            {pullToRefreshState === 'refreshing' ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Refreshing...</span>
              </>
            ) : (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                <span>Pull to refresh</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Mobile Indicator (for development) */}
      {showMobileIndicator && process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
          {isMobile ? 'MOBILE' : isTablet ? 'TABLET' : 'DESKTOP'}
        </div>
      )}

      {/* Main Content */}
      <PremiumContainer 
        variant="wide" 
        background="none" 
        padding="none"
        className={`
          ${getPaddingClasses()}
          ${getMaxWidthClasses()}
          mx-auto
          ${isMobile ? 'space-y-6' : 'space-y-8'}
        `}
      >
        {/* Touch-friendly spacing for mobile */}
        <div className={`
          ${isMobile ? 'space-y-6' : 'space-y-8'}
          ${isTablet ? 'space-y-7' : ''}
        `}>
          {children}
        </div>
      </PremiumContainer>

      {/* Mobile-specific optimizations */}
      {isMobile && (
        <style jsx global>{`
          /* Ensure touch-friendly scrolling */
          html {
            -webkit-overflow-scrolling: touch;
            scroll-behavior: smooth;
          }
          
          /* Optimize for mobile performance */
          * {
            -webkit-tap-highlight-color: transparent;
          }
          
          /* Improve touch targets */
          button, a, input, select, textarea {
            min-height: 44px;
            min-width: 44px;
          }
          
          /* Optimize animations for mobile */
          @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}</style>
      )}
    </div>
  );
}; 