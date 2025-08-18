import React, { useEffect, useState } from 'react';

interface ProfessionalAnimatedBackgroundProps {
  variant?: 'premium' | 'brand' | 'warm' | 'cool' | 'pulse';
  intensity?: 'low' | 'medium' | 'high';
  debug?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const ProfessionalAnimatedBackground: React.FC<ProfessionalAnimatedBackgroundProps> = ({ 
  variant = 'premium',
  intensity = 'medium',
  debug = false,
  className = '',
  children
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate deterministic values for SSR to prevent hydration mismatch
  const getDeterministicValue = (index: number, type: 'left' | 'top' | 'delay' | 'duration' | 'rotation') => {
    const seed = index * 7 + type.charCodeAt(0); // Simple deterministic seed
    const random = (seed * 9301 + 49297) % 233280; // Linear congruential generator
    const normalized = random / 233280;
    
    switch (type) {
      case 'left':
        return `${normalized * 100}%`;
      case 'top':
        return `${normalized * 100}%`;
      case 'delay':
        return `${normalized * 5}s`;
      case 'duration':
        return `${4 + normalized * 8}s`;
      case 'rotation':
        return `rotate(${normalized * 360}deg)`;
      default:
        return '0';
    }
  };

  const getIntensityClasses = () => {
    if (debug) {
      return 'opacity-100'; // Full opacity in debug mode
    }
    
    switch (intensity) {
      case 'low':
        return 'opacity-60';
      case 'high':
        return 'opacity-95';
      default:
        return 'opacity-80';
    }
  };

  const getVariantContent = () => {
    switch (variant) {
      case 'premium':
        return (
          <>
            {/* Professional Premium Background */}
            <div className="absolute inset-0 bg-gradient-professional" />
            
            {/* Sophisticated Animated Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r from-brand-primary/20 via-accent-cool/15 to-accent-warm/20 animate-pulse ${getIntensityClasses()}`} />
            
            {/* Radial Depth Effect */}
            <div className="absolute inset-0 bg-gradient-radial from-brand-primary/10 via-transparent to-transparent animate-pulse" />
            
            {/* Additional Mathematical Harmony Layers */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent-neutral/10 via-transparent to-brand-accent/10 animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute inset-0 bg-gradient-to-tl from-accent-warm/8 via-transparent to-accent-cool/8 animate-pulse" style={{ animationDelay: '2s' }} />
            
            {/* Professional Grid Pattern */}
            <div className={`absolute inset-0 ${debug ? 'opacity-60' : 'opacity-20'}`}>
              <div className="absolute inset-0 bg-gradient-grid bg-grid animate-pulse" />
            </div>
            
            {/* Floating Geometric Elements */}
            <div className="absolute inset-0">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className={`absolute rounded-lg animate-float ${
                    i % 4 === 0 ? 'bg-brand-primary/20 w-8 h-8' :
                    i % 4 === 1 ? 'bg-accent-cool/20 w-6 h-6' :
                    i % 4 === 2 ? 'bg-accent-warm/20 w-4 h-4' :
                    'bg-accent-neutral/20 w-10 h-10'
                  }`}
                  style={{
                    left: mounted ? `${Math.random() * 100}%` : getDeterministicValue(i, 'left'),
                    top: mounted ? `${Math.random() * 100}%` : getDeterministicValue(i, 'top'),
                    animationDelay: mounted ? `${Math.random() * 4}s` : getDeterministicValue(i, 'delay'),
                    animationDuration: mounted ? `${6 + Math.random() * 8}s` : getDeterministicValue(i, 'duration'),
                    transform: mounted ? `rotate(${Math.random() * 360}deg)` : getDeterministicValue(i, 'rotation')
                  }}
                />
              ))}
            </div>
            
            {/* Subtle Particle System */}
            <div className="absolute inset-0">
              {Array.from({ length: 25 }).map((_, i) => (
                <div
                  key={`particle-${i}`}
                  className={`absolute rounded-full animate-float ${
                    i % 5 === 0 ? 'bg-brand-primary/15 w-2 h-2' :
                    i % 5 === 1 ? 'bg-accent-cool/15 w-1 h-1' :
                    i % 5 === 2 ? 'bg-accent-warm/15 w-3 h-3' :
                    i % 5 === 3 ? 'bg-accent-neutral/15 w-1 h-1' :
                    'bg-brand-accent/15 w-2 h-2'
                  }`}
                  style={{
                    left: mounted ? `${Math.random() * 100}%` : getDeterministicValue(i + 100, 'left'),
                    top: mounted ? `${Math.random() * 100}%` : getDeterministicValue(i + 100, 'top'),
                    animationDelay: mounted ? `${Math.random() * 6}s` : getDeterministicValue(i + 100, 'delay'),
                    animationDuration: mounted ? `${8 + Math.random() * 12}s` : getDeterministicValue(i + 100, 'duration')
                  }}
                />
              ))}
            </div>
          </>
        );
        
      case 'brand':
        return (
          <>
            {/* Brand Gradient Background */}
            <div className="absolute inset-0 bg-gradient-brand" />
            
            {/* Brand Animation Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r from-brand-primary/25 via-accent-cool/20 to-brand-accent/25 animate-pulse ${getIntensityClasses()}`} />
            
            {/* Radial Brand Effect */}
            <div className="absolute inset-0 bg-gradient-radial from-brand-primary/15 via-transparent to-transparent animate-pulse" />
            
            {/* Floating Brand Elements */}
            <div className="absolute inset-0">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className={`absolute rounded-full animate-float ${
                    i % 3 === 0 ? 'bg-brand-primary/30 w-6 h-6' :
                    i % 3 === 1 ? 'bg-accent-cool/30 w-4 h-4' :
                    'bg-brand-accent/30 w-8 h-8'
                  }`}
                  style={{
                    left: mounted ? `${Math.random() * 100}%` : getDeterministicValue(i + 200, 'left'),
                    top: mounted ? `${Math.random() * 100}%` : getDeterministicValue(i + 200, 'top'),
                    animationDelay: mounted ? `${Math.random() * 3}s` : getDeterministicValue(i + 200, 'delay'),
                    animationDuration: mounted ? `${5 + Math.random() * 6}s` : getDeterministicValue(i + 200, 'duration')
                  }}
                />
              ))}
            </div>
          </>
        );
        
      case 'warm':
        return (
          <>
            {/* Warm Gradient Background */}
            <div className="absolute inset-0 bg-gradient-warm" />
            
            {/* Warm Animation Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r from-accent-warm/30 via-brand-primary/20 to-accent-warm/30 animate-pulse ${getIntensityClasses()}`} />
            
            {/* Radial Warm Effect */}
            <div className="absolute inset-0 bg-gradient-radial from-accent-warm/20 via-transparent to-transparent animate-pulse" />
            
            {/* Floating Warm Elements */}
            <div className="absolute inset-0">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={`absolute rounded-lg animate-float ${
                    i % 2 === 0 ? 'bg-accent-warm/25 w-5 h-5' :
                    'bg-brand-primary/20 w-3 h-3'
                  }`}
                  style={{
                    left: mounted ? `${Math.random() * 100}%` : getDeterministicValue(i + 300, 'left'),
                    top: mounted ? `${Math.random() * 100}%` : getDeterministicValue(i + 300, 'top'),
                    animationDelay: mounted ? `${Math.random() * 4}s` : getDeterministicValue(i + 300, 'delay'),
                    animationDuration: mounted ? `${4 + Math.random() * 6}s` : getDeterministicValue(i + 300, 'duration'),
                    transform: mounted ? `rotate(${Math.random() * 360}deg)` : getDeterministicValue(i + 300, 'rotation')
                  }}
                />
              ))}
            </div>
          </>
        );
        
      case 'cool':
        return (
          <>
            {/* Cool Gradient Background */}
            <div className="absolute inset-0 bg-gradient-cool" />
            
            {/* Cool Animation Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r from-accent-cool/30 via-brand-primary/20 to-accent-cool/30 animate-pulse ${getIntensityClasses()}`} />
            
            {/* Radial Cool Effect */}
            <div className="absolute inset-0 bg-gradient-radial from-accent-cool/20 via-transparent to-transparent animate-pulse" />
            
            {/* Floating Cool Elements */}
            <div className="absolute inset-0">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={`absolute rounded-full animate-float ${
                    i % 2 === 0 ? 'bg-accent-cool/25 w-4 h-4' :
                    'bg-brand-primary/20 w-2 h-2'
                  }`}
                  style={{
                    left: mounted ? `${Math.random() * 100}%` : getDeterministicValue(i + 400, 'left'),
                    top: mounted ? `${Math.random() * 100}%` : getDeterministicValue(i + 400, 'top'),
                    animationDelay: mounted ? `${Math.random() * 3}s` : getDeterministicValue(i + 400, 'delay'),
                    animationDuration: mounted ? `${5 + Math.random() * 7}s` : getDeterministicValue(i + 400, 'duration')
                  }}
                />
              ))}
            </div>
          </>
        );
        
      case 'pulse':
        return (
          <>
            {/* Pulse Gradient Background */}
            <div className="absolute inset-0 bg-gradient-pulse animate-pulse" />
            
            {/* Mathematical Harmony Pulse */}
            <div className={`absolute inset-0 bg-gradient-to-r from-brand-primary/20 via-accent-cool/15 via-accent-warm/15 to-accent-neutral/20 animate-pulse ${getIntensityClasses()}`} />
            
            {/* Radial Pulse Effect */}
            <div className="absolute inset-0 bg-gradient-radial from-brand-primary/15 via-transparent to-transparent animate-pulse" />
            
            {/* Triadic Color Elements */}
            <div className="absolute inset-0">
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={i}
                  className={`absolute rounded-lg animate-float ${
                    i % 3 === 0 ? 'bg-triadic-blue/25 w-6 h-6' :
                    i % 3 === 1 ? 'bg-triadic-magenta/25 w-4 h-4' :
                    'bg-triadic-green/25 w-5 h-5'
                  }`}
                  style={{
                    left: mounted ? `${Math.random() * 100}%` : getDeterministicValue(i + 500, 'left'),
                    top: mounted ? `${Math.random() * 100}%` : getDeterministicValue(i + 500, 'top'),
                    animationDelay: mounted ? `${Math.random() * 5}s` : getDeterministicValue(i + 500, 'delay'),
                    animationDuration: mounted ? `${6 + Math.random() * 8}s` : getDeterministicValue(i + 500, 'duration'),
                    transform: mounted ? `rotate(${Math.random() * 360}deg)` : getDeterministicValue(i + 500, 'rotation')
                  }}
                />
              ))}
            </div>
          </>
        );
        
      default:
        return (
          <>
            {/* Default Professional Background */}
            <div className="absolute inset-0 bg-gradient-professional" />
            
            {/* Default Animation Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r from-brand-primary/20 via-accent-cool/15 to-accent-warm/20 animate-pulse ${getIntensityClasses()}`} />
            
            {/* Default Radial Effect */}
            <div className="absolute inset-0 bg-gradient-radial from-brand-primary/10 via-transparent to-transparent animate-pulse" />
          </>
        );
    }
  };

  return (
    <div className={`absolute inset-0 overflow-hidden ${debug ? 'border-4 border-red-500' : ''} ${className}`}>
      {getVariantContent()}
      
      {/* Content Overlay */}
      {children && (
        <div className="relative z-10 h-full">
          {children}
        </div>
      )}
    </div>
  );
};

// Specialized Background Components
export const ProfessionalHeroBackground: React.FC<Omit<ProfessionalAnimatedBackgroundProps, 'variant'>> = (props) => {
  return <ProfessionalAnimatedBackground variant="premium" intensity="medium" {...props} />;
};

export const ProfessionalBrandBackground: React.FC<Omit<ProfessionalAnimatedBackgroundProps, 'variant'>> = (props) => {
  return <ProfessionalAnimatedBackground variant="brand" intensity="high" {...props} />;
};

export const ProfessionalWarmBackground: React.FC<Omit<ProfessionalAnimatedBackgroundProps, 'variant'>> = (props) => {
  return <ProfessionalAnimatedBackground variant="warm" intensity="medium" {...props} />;
};

export const ProfessionalCoolBackground: React.FC<Omit<ProfessionalAnimatedBackgroundProps, 'variant'>> = (props) => {
  return <ProfessionalAnimatedBackground variant="cool" intensity="medium" {...props} />;
};

export const ProfessionalPulseBackground: React.FC<Omit<ProfessionalAnimatedBackgroundProps, 'variant'>> = (props) => {
  return <ProfessionalAnimatedBackground variant="pulse" intensity="high" {...props} />;
}; 