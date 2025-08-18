// Phase 12E: 3D Spline Background System Configuration
// This file contains all configuration and utilities for the 3D Spline background system

export const SPLINE_CONFIG = {
  // Spline iframe URL
  IFRAME_URL: 'https://my.spline.design/retrofuturismbganimation-Lb3VtL1bNaYUnirKNzn0FvaW',
  
  // CSS filter to transform the Spline colors to match our brand palette
  COLOR_FILTER: 'hue-rotate(140deg) saturate(1.3) brightness(1.1) contrast(1.2)',
  
  // Fallback background class
  FALLBACK_BACKGROUND: 'bg-black',
  
  // Animation settings
  ANIMATION: {
    FLOAT_DURATION: '6s',
    PULSE_DURATION: '3s',
    GLOW_DURATION: '4s'
  },
  
  // Performance settings
  PERFORMANCE: {
    MAX_PARTICLES: 30,
    PARTICLE_OPACITY: 0.4,
    GRID_OPACITY: 0.2
  }
};

// Utility function to check if Spline is available
export const isSplineAvailable = (): Promise<boolean> => {
  if (typeof window === 'undefined') return Promise.resolve(false);
  
  // Check if we can access the Spline URL
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = SPLINE_CONFIG.IFRAME_URL;
  });
};

// Utility function to get fallback background styles
export const getFallbackBackgroundStyles = () => ({
  background: 'linear-gradient(135deg, #0A0A0A 0%, #171717 100%)',
  position: 'fixed' as const,
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: -10
});

// Utility function to generate particle styles
export const generateParticleStyles = (index: number, mounted: boolean) => {
  const colors = [
    'bg-emerald-300/40',
    'bg-amber-400/40', 
    'bg-orange-500/40',
    'bg-emerald-600/40',
    'bg-amber-700/40',
    'bg-orange-700/40'
  ];
  
  const sizes = [
    'w-10 h-10',
    'w-8 h-8',
    'w-6 h-6',
    'w-12 h-12',
    'w-14 h-14',
    'w-16 h-16'
  ];
  
  const shapes = [
    'rounded-lg',
    'rounded-full',
    'rotate-45',
    'rounded-xl',
    'rounded-2xl',
    'rounded-3xl'
  ];
  
  const colorIndex = index % colors.length;
  const sizeIndex = index % sizes.length;
  const shapeIndex = index % shapes.length;
  
  return {
    className: `${colors[colorIndex]} ${sizes[sizeIndex]} ${shapes[shapeIndex]} absolute animate-float shadow-lg`,
    style: {
      left: mounted ? `${Math.random() * 100}%` : `${(index * 3.5) % 100}%`,
      top: mounted ? `${Math.random() * 100}%` : `${(index * 5.5) % 100}%`,
      animationDelay: mounted ? `${Math.random() * 7}s` : `${index * 0.25}s`,
      animationDuration: mounted ? `${12 + Math.random() * 18}s` : `${12 + index * 0.5}s`,
      transform: mounted ? `rotate(${Math.random() * 360}deg)` : `rotate(${index * 12}deg)`
    }
  };
};

// Utility function to check if device supports 3D animations
export const supports3DAnimations = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return false;
  
  // Check for WebGL support
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  return !!gl;
};

// Export types for TypeScript
export interface SplineBackgroundConfig {
  iframeUrl: string;
  colorFilter: string;
  fallbackBackground: string;
  animation: {
    floatDuration: string;
    pulseDuration: string;
    glowDuration: string;
  };
  performance: {
    maxParticles: number;
    particleOpacity: number;
    gridOpacity: number;
  };
}
