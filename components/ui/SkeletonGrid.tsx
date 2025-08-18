import React from 'react';
import SkeletonCard from './SkeletonCard';

interface SkeletonGridProps {
  count?: number;
  variant?: 'default' | 'beat' | 'service' | 'blog' | 'testimonial';
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

export const SkeletonGrid: React.FC<SkeletonGridProps> = ({
  count = 6,
  variant = 'default',
  columns = 3,
  className = ''
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6'
  };

  const getDelayClass = (index: number) => {
    const delays = [
      'animate-delay-0',
      'animate-delay-1',
      'animate-delay-2',
      'animate-delay-3',
      'animate-delay-4',
      'animate-delay-5',
      'animate-delay-6',
      'animate-delay-7',
      'animate-delay-8'
    ];
    return delays[index] || delays[0];
  };

  return (
    <div className={`grid gap-6 ${gridCols[columns]} ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard
          key={index}
          variant={variant}
          className={`animate-pulse ${getDelayClass(index)}`}
        />
      ))}
    </div>
  );
};

export default SkeletonGrid; 