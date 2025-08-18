import React from 'react';
import Badge from './Badge';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'info';
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  variant = 'default',
  className = ''
}) => {
  const variantStyles = {
    default: 'text-neutral-100',
    success: 'text-success',
    warning: 'text-accent',
    info: 'text-neutral-100',
  };

  const trendColors = {
    positive: 'text-success',
    negative: 'text-red-400',
  };

  return (
    <div className={`card-base hover-lift ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {icon && (
              <div className="text-neutral-500">
                {icon}
              </div>
            )}
            <h3 className="text-micro text-neutral-500">
              {title}
            </h3>
          </div>
          
          <div className="space-y-1">
            <p className={`text-display-small font-normal tracking-tight font-instrument-serif ${variantStyles[variant]}`}>
              {value}
            </p>
            
            {subtitle && (
              <p className="text-neutral-500">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {trend && (
          <div className="flex items-center gap-1">
            <Badge 
              variant={trend.isPositive ? 'success' : 'warning'} 
              size="sm"
            >
              {trend.isPositive ? '+' : ''}{trend.value}%
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;