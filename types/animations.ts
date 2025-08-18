// Animation System Type Definitions
// This file provides TypeScript types for the animation system

export type AnimationType = 'fadeUp' | 'fadeDown' | 'fadeLeft' | 'fadeRight' | 'fade-up-stagger' | 'scale-in' | 'slide-up' | 'glow-pulse' | 'glow-pulse-amber';

export type AnimationDelay = number;

export type AnimationDuration = 200 | 300 | 500 | 800 | 1000 | 2000;

export type AnimationEasing = 'ease-out' | 'ease-in' | 'ease-in-out' | 'linear';

export interface AnimationConfig {
  type: AnimationType;
  delay?: AnimationDelay;
  duration?: AnimationDuration;
  easing?: AnimationEasing;
  threshold?: number;
}

export interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: AnimationDelay;
  className?: string;
  animation?: AnimationType;
  duration?: AnimationDuration;
  threshold?: number;
}

// Animation class utilities
export const getAnimationClass = (type: AnimationType, delay?: AnimationDelay): string => {
  const baseClass = `animate-${type}`;
  if (delay && delay > 0) {
    const delayClass = `animate-delay-${Math.ceil(delay / 100)}`;
    return `${baseClass} ${delayClass}`;
  }
  return baseClass;
};

// Animation delay mapping
export const ANIMATION_DELAYS: Record<number, string> = {
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

// Animation type mapping
export const ANIMATION_CLASSES: Record<AnimationType, string> = {
  'fadeUp': 'animate-fadeUp',
  'fadeDown': 'animate-fadeDown',
  'fadeLeft': 'animate-fadeLeft',
  'fadeRight': 'animate-fadeRight',
  'fade-up-stagger': 'animate-fade-up-stagger',
  'scale-in': 'animate-scale-in',
  'slide-up': 'animate-slide-up',
  'glow-pulse': 'animate-glow-pulse',
  'glow-pulse-amber': 'animate-glow-pulse-amber',
};

// Utility function to build animation classes
export const buildAnimationClasses = (config: AnimationConfig): string => {
  const { type, delay } = config;
  const baseClass = ANIMATION_CLASSES[type];
  const delayClass = delay ? ANIMATION_DELAYS[delay] : '';
  
  return [baseClass, delayClass].filter(Boolean).join(' ');
};

// Animation performance utilities
export const isReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
};

export const shouldAnimate = (): boolean => {
  return !isReducedMotion() && !isMobile();
};

// Animation timing constants
export const ANIMATION_TIMING = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
  PAGE_LOAD: 800,
  LONG: 1000,
  VERY_LONG: 2000,
} as const;

// Animation easing constants
export const ANIMATION_EASING = {
  EASE_OUT: 'ease-out',
  EASE_IN: 'ease-in',
  EASE_IN_OUT: 'ease-in-out',
  LINEAR: 'linear',
} as const; 