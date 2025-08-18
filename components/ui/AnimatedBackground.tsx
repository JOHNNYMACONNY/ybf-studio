import React, { useEffect, useState } from 'react';

interface AnimatedBackgroundProps {
  variant?: 'default' | 'premium' | 'minimal' | 'particles' | 'gradient';
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  variant = 'default',
  intensity = 'medium',
  className = ''
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
    switch (intensity) {
      case 'low':
        return 'opacity-50';
      case 'high':
        return 'opacity-90';
      default:
        return 'opacity-70';
    }
  };

  const getVariantContent = () => {
    switch (variant) {
      case 'premium':
        return (
          <>
            {/* Professional Premium Background */}
            <div className="absolute inset-0 bg-gradient-professional" />
            
            {/* Mathematical Harmony Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r from-brand-primary/25 via-accent-cool/20 to-accent-warm/25 animate-pulse ${getIntensityClasses()}`} />
            
            {/* Radial Depth Effect */}
            <div className="absolute inset-0 bg-gradient-radial from-brand-primary/15 via-transparent to-transparent animate-pulse" />
            
            {/* Additional Mathematical Harmony Layers */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent-neutral/12 via-transparent to-brand-accent/12 animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute inset-0 bg-gradient-to-tl from-accent-warm/10 via-transparent to-accent-cool/10 animate-pulse" style={{ animationDelay: '2s' }} />
            
            {/* Floating Geometric Elements */}
            <div className="absolute inset-0">
              {Array.from({ length: 45 }).map((_, i) => (
                <div
                  key={i}
                  className={`absolute rounded-lg animate-float ${
                    i % 5 === 0 ? 'bg-brand-primary/30 w-4 h-4' :
                    i % 5 === 1 ? 'bg-accent-cool/30 w-3 h-3' :
                    i % 5 === 2 ? 'bg-accent-warm/30 w-2 h-2' :
                    i % 5 === 3 ? 'bg-accent-neutral/30 w-5 h-5' :
                    'bg-brand-accent/30 w-1 h-1'
                  }`}
                  style={{
                    left: mounted ? `${Math.random() * 100}%` : getDeterministicValue(i, 'left'),
                    top: mounted ? `${Math.random() * 100}%` : getDeterministicValue(i, 'top'),
                    animationDelay: mounted ? `${Math.random() * 4}s` : getDeterministicValue(i, 'delay'),
                    animationDuration: mounted ? `${5 + Math.random() * 8}s` : getDeterministicValue(i, 'duration'),
                    transform: mounted ? `rotate(${Math.random() * 360}deg)` : getDeterministicValue(i, 'rotation')
                  }}
                />
              ))}
            </div>
            
            {/* Professional Grid Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-gradient-grid bg-grid animate-pulse" />
            </div>
          </>
        );
        
      case 'minimal':
        return (
          <>
            {/* Professional Minimal Background */}
            <div className="absolute inset-0 bg-gradient-professional" />
            <div className={`absolute inset-0 bg-gradient-to-r from-brand-primary/15 to-accent-cool/15 ${getIntensityClasses()}`} />
          </>
        );
        
      case 'particles':
        return (
          <>
            {/* Professional Dark Base */}
            <div className="absolute inset-0 bg-background-primary" />
            
            {/* Professional Particle System */}
            <div className="absolute inset-0">
              {Array.from({ length: 60 }).map((_, i) => (
                <div
                  key={i}
                  className={`absolute rounded-full animate-float ${
                    i % 5 === 0 ? 'bg-brand-primary/40 w-2 h-2' :
                    i % 5 === 1 ? 'bg-accent-cool/40 w-2 h-2' :
                    i % 5 === 2 ? 'bg-accent-warm/40 w-2 h-2' :
                    i % 5 === 3 ? 'bg-accent-neutral/40 w-2 h-2' :
                    'bg-brand-accent/40 w-2 h-2'
                  }`}
                  style={{
                    left: mounted ? `${Math.random() * 100}%` : getDeterministicValue(i + 100, 'left'),
                    top: mounted ? `${Math.random() * 100}%` : getDeterministicValue(i + 100, 'top'),
                    animationDelay: mounted ? `${Math.random() * 6}s` : getDeterministicValue(i + 100, 'delay'),
                    animationDuration: mounted ? `${6 + Math.random() * 10}s` : getDeterministicValue(i + 100, 'duration')
                  }}
                />
              ))}
            </div>
          </>
        );
        
      case 'gradient':
        return (
          <>
            {/* Professional Gradient Background */}
            <div className="absolute inset-0 bg-gradient-professional" />
            <div className={`absolute inset-0 bg-gradient-to-r from-brand-primary/20 via-accent-cool/15 to-accent-warm/20 animate-pulse ${getIntensityClasses()}`} />
            <div className={`absolute inset-0 bg-gradient-to-br from-accent-cool/12 via-brand-primary/15 to-accent-neutral/12 animate-pulse ${getIntensityClasses()}`} style={{ animationDelay: '1s' }} />
            <div className={`absolute inset-0 bg-gradient-to-tl from-accent-warm/8 via-accent-cool/12 to-brand-accent/8 animate-pulse ${getIntensityClasses()}`} style={{ animationDelay: '2s' }} />
          </>
        );
        
      default:
        return (
          <>
            {/* Professional Default Background */}
            <div className="absolute inset-0 bg-gradient-professional" />
            
            {/* Mathematical Harmony Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r from-brand-primary/20 via-accent-cool/12 to-accent-neutral/20 animate-pulse ${getIntensityClasses()}`} />
            
            {/* Professional Floating Elements */}
            <div className="absolute inset-0">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className={`absolute rounded-lg animate-float ${
                    i % 4 === 0 ? 'bg-brand-primary/35 w-3 h-3' :
                    i % 4 === 1 ? 'bg-accent-cool/35 w-2 h-2' :
                    i % 4 === 2 ? 'bg-accent-neutral/35 w-4 h-4' :
                    'bg-brand-accent/35 w-1 h-1'
                  }`}
                  style={{
                    left: mounted ? `${Math.random() * 100}%` : getDeterministicValue(i + 200, 'left'),
                    top: mounted ? `${Math.random() * 100}%` : getDeterministicValue(i + 200, 'top'),
                    animationDelay: mounted ? `${Math.random() * 4}s` : getDeterministicValue(i + 200, 'delay'),
                    animationDuration: mounted ? `${4 + Math.random() * 8}s` : getDeterministicValue(i + 200, 'duration'),
                    transform: mounted ? `rotate(${Math.random() * 360}deg)` : getDeterministicValue(i + 200, 'rotation')
                  }}
                />
              ))}
            </div>
          </>
        );
    }
  };

  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden ${className}`}>
      {getVariantContent()}
    </div>
  );
}; 