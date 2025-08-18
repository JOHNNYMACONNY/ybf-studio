import React from 'react';

interface ParticleSystemProps {
  variant?: 'default' | 'premium' | 'minimal' | 'stars' | 'music';
  particleCount?: number;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  variant = 'default',
  particleCount = 50,
  className = '',
  intensity = 'medium'
}) => {
  const getIntensityClasses = () => {
    switch (intensity) {
      case 'low':
        return 'opacity-20';
      case 'high':
        return 'opacity-60';
      default:
        return 'opacity-40';
    }
  };

  const getParticleConfig = () => {
    switch (variant) {
      case 'premium':
        return {
          colors: ['bg-teal-400/30', 'bg-blue-500/30', 'bg-amber-400/30', 'bg-purple-400/30'],
          sizes: ['w-1 h-1', 'w-2 h-2', 'w-1 h-1', 'w-3 h-3'],
          shapes: ['rounded-full', 'rounded-full', 'rounded-full', 'rounded-full'],
          animations: ['animate-float', 'animate-pulse', 'animate-float', 'animate-bounce']
        };
      case 'minimal':
        return {
          colors: ['bg-teal-400/20', 'bg-blue-500/20'],
          sizes: ['w-1 h-1', 'w-1 h-1'],
          shapes: ['rounded-full', 'rounded-full'],
          animations: ['animate-float', 'animate-float']
        };
      case 'stars':
        return {
          colors: ['bg-yellow-300/40', 'bg-white/30', 'bg-blue-300/30'],
          sizes: ['w-1 h-1', 'w-2 h-2', 'w-1 h-1'],
          shapes: ['rounded-full', 'rounded-full', 'rounded-full'],
          animations: ['animate-pulse', 'animate-float', 'animate-pulse']
        };
      case 'music':
        return {
          colors: ['bg-teal-400/40', 'bg-blue-500/40', 'bg-amber-400/40'],
          sizes: ['w-1 h-1', 'w-2 h-2', 'w-1 h-1'],
          shapes: ['rounded-full', 'rounded-full', 'rounded-full'],
          animations: ['animate-bounce', 'animate-pulse', 'animate-bounce']
        };
      default:
        return {
          colors: ['bg-teal-400/25', 'bg-blue-500/25', 'bg-amber-400/25'],
          sizes: ['w-1 h-1', 'w-2 h-2', 'w-1 h-1'],
          shapes: ['rounded-full', 'rounded-full', 'rounded-full'],
          animations: ['animate-float', 'animate-float', 'animate-float']
        };
    }
  };

  const config = getParticleConfig();

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {Array.from({ length: particleCount }).map((_, i) => {
        const colorIndex = i % config.colors.length;
        const sizeIndex = i % config.sizes.length;
        const shapeIndex = i % config.shapes.length;
        const animationIndex = i % config.animations.length;

        return (
          <div
            key={i}
            className={`absolute ${config.colors[colorIndex]} ${config.sizes[sizeIndex]} ${config.shapes[shapeIndex]} ${config.animations[animationIndex]} ${getIntensityClasses()}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 12}s`
            }}
          />
        );
      })}
    </div>
  );
}; 