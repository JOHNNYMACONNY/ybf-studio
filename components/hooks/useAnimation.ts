import { useState, useEffect, useRef, useCallback } from 'react';

interface UseAnimationOptions {
  delay?: number;
  duration?: number;
  threshold?: number;
  trigger?: 'scroll' | 'hover' | 'click' | 'mount';
  stagger?: number;
  loop?: boolean;
  easing?: 'ease-out' | 'ease-in' | 'ease-in-out' | 'cubic-bezier';
}

interface UseAnimationReturn {
  isVisible: boolean;
  isAnimating: boolean;
  triggerAnimation: () => void;
  ref: React.RefObject<HTMLElement | HTMLButtonElement | HTMLDivElement | null>;
}

// Mathematical harmony timing constants
const HARMONY_TIMING = {
  FAST: 200,      // Quick micro-interactions
  MEDIUM: 400,    // Standard animations
  SLOW: 800,      // Complex transitions
  STAGGER: 100,   // Staggered element timing
  DELAY: 150,     // Initial delay
};

// Performance-optimized easing functions
const EASING_FUNCTIONS = {
  'ease-out': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  'ease-in': 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
  'ease-in-out': 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  'cubic-bezier': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
};

export const useAnimation = (options: UseAnimationOptions = {}): UseAnimationReturn => {
  const {
    delay = 0,
    duration = HARMONY_TIMING.MEDIUM,
    threshold = 0.1,
    trigger = 'scroll',
    stagger = 0,
    loop = false,
    easing = 'ease-out'
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const ref = useRef<HTMLElement | HTMLButtonElement | HTMLDivElement>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Check for reduced motion preference
  const isReducedMotion = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Check if device is mobile
  const isMobile = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  }, []);

  // Trigger animation manually
  const triggerAnimation = useCallback(() => {
    if (isReducedMotion() || isMobile()) {
      setIsVisible(true);
      return;
    }

    setIsAnimating(true);
    setTimeout(() => {
      setIsVisible(true);
      setTimeout(() => {
        setIsAnimating(false);
      }, duration);
    }, delay + stagger);
  }, [delay, duration, stagger, isReducedMotion, isMobile]);

  // Scroll-triggered animation
  useEffect(() => {
    if (trigger !== 'scroll' || isReducedMotion() || isMobile()) {
      setIsVisible(true);
      return;
    }

    if (typeof window === 'undefined' || !window.IntersectionObserver) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsAnimating(true);
            setTimeout(() => {
              setIsVisible(true);
              setTimeout(() => {
                setIsAnimating(false);
              }, duration);
            }, stagger);
          }, delay);
          
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      { 
        threshold,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [trigger, delay, duration, threshold, stagger, isReducedMotion, isMobile]);

  // Mount-triggered animation
  useEffect(() => {
    if (trigger === 'mount') {
      triggerAnimation();
    }
  }, [trigger, triggerAnimation]);

  // Loop animation
  useEffect(() => {
    if (!loop || !isVisible) return;

    const loopTimeout = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        triggerAnimation();
      }, HARMONY_TIMING.FAST);
    }, duration + HARMONY_TIMING.SLOW);

    return () => clearTimeout(loopTimeout);
  }, [loop, isVisible, duration, triggerAnimation]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  return {
    isVisible,
    isAnimating,
    triggerAnimation,
    ref
  };
};

// Specialized animation hooks for common patterns
export const useFadeIn = (delay = 0) => useAnimation({ delay, trigger: 'scroll' });
export const useSlideUp = (delay = 0) => useAnimation({ delay, trigger: 'scroll' });
export const useScaleIn = (delay = 0) => useAnimation({ delay, trigger: 'scroll' });
export const useStaggeredAnimation = (index: number) => useAnimation({ 
  delay: index * HARMONY_TIMING.STAGGER, 
  trigger: 'scroll' 
});
export const useHoverAnimation = () => useAnimation({ trigger: 'hover' });
export const useClickAnimation = () => useAnimation({ trigger: 'click' });
export const useMountAnimation = (delay = HARMONY_TIMING.DELAY) => useAnimation({ 
  delay, 
  trigger: 'mount' 
}); 