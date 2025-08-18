import React from 'react';

interface SkeletonCardProps {
  variant?: 'default' | 'beat' | 'service' | 'blog' | 'testimonial';
  className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  variant = 'default',
  className = ''
}) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'beat':
        return (
          <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 animate-pulse ${className}`}>
            <div className="space-y-4">
              {/* Cover image skeleton */}
              <div className="w-full h-48 bg-white/10 rounded-lg" />
              
              {/* Title skeleton */}
              <div className="h-6 bg-white/10 rounded w-3/4" />
              
              {/* Artist skeleton */}
              <div className="h-4 bg-white/10 rounded w-1/2" />
              
              {/* Genre and BPM skeleton */}
              <div className="flex justify-between">
                <div className="h-4 bg-white/10 rounded w-16" />
                <div className="h-4 bg-white/10 rounded w-20" />
              </div>
              
              {/* Price and button skeleton */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <div className="h-8 bg-white/10 rounded w-20" />
                <div className="h-10 bg-white/10 rounded w-24" />
              </div>
            </div>
          </div>
        );

      case 'service':
        return (
          <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 animate-pulse ${className}`}>
            <div className="space-y-4">
              {/* Icon skeleton */}
              <div className="w-16 h-16 bg-white/10 rounded-full mx-auto" />
              
              {/* Title skeleton */}
              <div className="h-6 bg-white/10 rounded w-3/4 mx-auto" />
              
              {/* Description skeleton */}
              <div className="space-y-2">
                <div className="h-4 bg-white/10 rounded w-full" />
                <div className="h-4 bg-white/10 rounded w-2/3 mx-auto" />
              </div>
              
              {/* Price skeleton */}
              <div className="h-8 bg-white/10 rounded w-1/3 mx-auto" />
              
              {/* Button skeleton */}
              <div className="h-12 bg-white/10 rounded w-full" />
            </div>
          </div>
        );

      case 'blog':
        return (
          <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 animate-pulse ${className}`}>
            <div className="space-y-4">
              {/* Image skeleton */}
              <div className="w-full h-48 bg-white/10 rounded-lg" />
              
              {/* Title skeleton */}
              <div className="h-6 bg-white/10 rounded w-full" />
              
              {/* Excerpt skeleton */}
              <div className="space-y-2">
                <div className="h-4 bg-white/10 rounded w-full" />
                <div className="h-4 bg-white/10 rounded w-full" />
                <div className="h-4 bg-white/10 rounded w-2/3" />
              </div>
              
              {/* Meta skeleton */}
              <div className="flex justify-between items-center">
                <div className="h-4 bg-white/10 rounded w-20" />
                <div className="h-4 bg-white/10 rounded w-16" />
              </div>
            </div>
          </div>
        );

      case 'testimonial':
        return (
          <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 animate-pulse ${className}`}>
            <div className="space-y-4">
              {/* Avatar skeleton */}
              <div className="w-12 h-12 bg-white/10 rounded-full" />
              
              {/* Quote skeleton */}
              <div className="space-y-2">
                <div className="h-4 bg-white/10 rounded w-full" />
                <div className="h-4 bg-white/10 rounded w-full" />
                <div className="h-4 bg-white/10 rounded w-3/4" />
              </div>
              
              {/* Name and rating skeleton */}
              <div className="flex justify-between items-center">
                <div className="h-4 bg-white/10 rounded w-24" />
                <div className="flex space-x-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-4 h-4 bg-white/10 rounded" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 animate-pulse ${className}`}>
            <div className="space-y-4">
              {/* Generic content skeleton */}
              <div className="w-full h-32 bg-white/10 rounded-lg" />
              <div className="h-6 bg-white/10 rounded w-3/4" />
              <div className="space-y-2">
                <div className="h-4 bg-white/10 rounded w-full" />
                <div className="h-4 bg-white/10 rounded w-2/3" />
              </div>
            </div>
          </div>
        );
    }
  };

  return renderSkeleton();
};

export default SkeletonCard; 