import React, { useState, useEffect, useRef } from 'react';

interface PremiumAnimationsProps {
  children: React.ReactNode;
  animation?: 'fadeInUp' | 'fadeInBlur' | 'slideInLeft' | 'slideInRight' | 'scaleIn' | 'rotateIn' | 'bounceIn';
  delay?: number;
  duration?: number;
  trigger?: 'onMount' | 'onScroll' | 'onHover' | 'onClick';
  className?: string;
  infinite?: boolean;
  stagger?: number;
}

export const PremiumAnimations: React.FC<PremiumAnimationsProps> = ({
  children,
  animation = 'fadeInUp',
  delay = 0,
  duration = 600,
  trigger = 'onMount',
  className = '',
  infinite = false,
  stagger = 0
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const getAnimationClasses = () => {
    const baseClasses = 'transition-all duration-600 ease-out';
    
    switch (animation) {
      case 'fadeInUp':
        return `${baseClasses} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`;
      case 'fadeInBlur':
        return `${baseClasses} ${isVisible ? 'opacity-100 blur-0' : 'opacity-0 blur-md'}`;
      case 'slideInLeft':
        return `${baseClasses} ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`;
      case 'slideInRight':
        return `${baseClasses} ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`;
      case 'scaleIn':
        return `${baseClasses} ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`;
      case 'rotateIn':
        return `${baseClasses} ${isVisible ? 'opacity-100 rotate-0' : 'opacity-0 rotate-12'}`;
      case 'bounceIn':
        return `${baseClasses} ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`;
      default:
        return baseClasses;
    }
  };

  const getTriggerClasses = () => {
    if (trigger === 'onHover') {
      return isHovered ? 'opacity-100 scale-105' : 'opacity-90 scale-100';
    }
    if (trigger === 'onClick') {
      return isClicked ? 'opacity-100 scale-110' : 'opacity-100 scale-100';
    }
    return '';
  };

  const getInfiniteClasses = () => {
    if (!infinite) return '';
    return 'animate-pulse';
  };

  useEffect(() => {
    if (trigger === 'onMount') {
      const timer = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timer);
    }
    
    // Return empty cleanup function for other triggers
    return () => {};
  }, [trigger, delay]);

  useEffect(() => {
    if (trigger === 'onScroll' && elementRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => setIsVisible(true), delay);
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(elementRef.current);
      return () => observer.disconnect();
    }
    
    // Return empty cleanup function for other triggers
    return () => {};
  }, [trigger, delay]);

  const handleMouseEnter = () => {
    if (trigger === 'onHover') setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (trigger === 'onHover') setIsHovered(false);
  };

  const handleClick = () => {
    if (trigger === 'onClick') {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 300);
    }
  };

  return (
    <div
      ref={elementRef}
      className={`
        ${getAnimationClasses()}
        ${getTriggerClasses()}
        ${getInfiniteClasses()}
        ${className}
      `}
      style={{ 
        transitionDelay: `${stagger}ms`,
        transitionDuration: `${duration}ms`
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

// Specialized animation components
export const FadeInUp: React.FC<Omit<PremiumAnimationsProps, 'animation'>> = (props) => {
  return <PremiumAnimations animation="fadeInUp" {...props} />;
};

export const FadeInBlur: React.FC<Omit<PremiumAnimationsProps, 'animation'>> = (props) => {
  return <PremiumAnimations animation="fadeInBlur" {...props} />;
};

export const SlideInLeft: React.FC<Omit<PremiumAnimationsProps, 'animation'>> = (props) => {
  return <PremiumAnimations animation="slideInLeft" {...props} />;
};

export const SlideInRight: React.FC<Omit<PremiumAnimationsProps, 'animation'>> = (props) => {
  return <PremiumAnimations animation="slideInRight" {...props} />;
};

export const ScaleIn: React.FC<Omit<PremiumAnimationsProps, 'animation'>> = (props) => {
  return <PremiumAnimations animation="scaleIn" {...props} />;
};

export const RotateIn: React.FC<Omit<PremiumAnimationsProps, 'animation'>> = (props) => {
  return <PremiumAnimations animation="rotateIn" {...props} />;
};

export const BounceIn: React.FC<Omit<PremiumAnimationsProps, 'animation'>> = (props) => {
  return <PremiumAnimations animation="bounceIn" {...props} />;
};

// Staggered animation container
export const StaggeredContainer: React.FC<{
  children: React.ReactNode;
  stagger?: number;
  className?: string;
}> = ({ children, stagger = 100, className = '' }) => {
  const childrenArray = React.Children.toArray(children);
  
  return (
    <div className={className}>
      {childrenArray.map((child, index) => (
        <div key={index} style={{ animationDelay: `${index * stagger}ms` }}>
          {child}
        </div>
      ))}
    </div>
  );
}; 