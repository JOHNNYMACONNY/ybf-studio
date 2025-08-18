import React, { useState, useEffect, useRef } from 'react';

interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  animation?: 'fadeUp' | 'fadeIn' | 'slideUp' | 'scaleIn' | 'fadeDown' | 'fadeLeft' | 'fadeRight';
  duration?: number;
  threshold?: number;
  stagger?: boolean;
}

// Utility functions
const isReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
};

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  delay = 0,
  className = '',
  animation = 'fadeUp',
  duration = 800,
  threshold = 0.1,
  stagger = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldAnimateElement, setShouldAnimateElement] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  // Check if animations should be disabled
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const reducedMotion = isReducedMotion();
      const mobile = isMobile();
      setShouldAnimateElement(!reducedMotion && !mobile);
    }
  }, []);

  useEffect(() => {
    // Check if IntersectionObserver is supported
    if (typeof window === 'undefined' || !window.IntersectionObserver || !shouldAnimateElement) {
      // Fallback for SSR, older browsers, or disabled animations - show immediately
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          // Once visible, we can stop observing
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      { 
        threshold,
        rootMargin: '0px 0px -100px 0px' // Trigger when element is 100px from bottom of viewport
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
  }, [delay, threshold, shouldAnimateElement]);

  const getAnimationClass = () => {
    const baseClass = 'transition-all duration-800 ease-out';
    switch (animation) {
      case 'fadeIn':
        return `${baseClass} ${isVisible ? 'opacity-100' : 'opacity-0'}`;
      case 'slideUp':
        return `${baseClass} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`;
      case 'scaleIn':
        return `${baseClass} ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`;
      case 'fadeDown':
        return `${baseClass} ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`;
      case 'fadeLeft':
        return `${baseClass} ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`;
      case 'fadeRight':
        return `${baseClass} ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`;
      default:
        return `${baseClass} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`;
    }
  };

  // Legacy animation styles for backward compatibility
  const animationStyles = {
    fadeUp: 'animate-fade-up-stagger',
    fadeIn: 'animate-fade-in',
    slideUp: 'animate-slide-up',
    scaleIn: 'animate-scale-in',
    fadeDown: 'animate-fade-down',
    fadeLeft: 'animate-fade-left',
    fadeRight: 'animate-fade-right',
  };

  const delayStyles = {
    0: '',
    150: 'animate-delay-1',
    250: 'animate-delay-2',
    350: 'animate-delay-3',
    450: 'animate-delay-4',
    550: 'animate-delay-5',
    650: 'animate-delay-6',
    750: 'animate-delay-7',
    850: 'animate-delay-8',
  };

  const getLegacyAnimationClass = () => {
    if (delay > 0 && delay <= 850) {
      return `${animationStyles[animation]} ${delayStyles[delay as keyof typeof delayStyles] || ''}`;
    }
    return animationStyles[animation];
  };

  // Use new animation system for new animations, legacy for old ones
  const isNewAnimation = ['fadeIn', 'slideUp', 'scaleIn'].includes(animation);
  
  return (
    <div 
      ref={ref}
      className={`
        ${isNewAnimation 
          ? getAnimationClass() 
          : (isVisible && shouldAnimateElement ? getLegacyAnimationClass() : 'opacity-100')
        } 
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default AnimatedSection; 