import React, { useState, useEffect } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { GradientText } from '../ui/GradientText';
import { PremiumTypography } from '../ui/PremiumTypography';

interface Metric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  changePercentage: number;
  color: string;
  icon: string;
}

interface RealTimeMetricsProps {
  className?: string;
  refreshInterval?: number;
  showTrends?: boolean;
  showPercentages?: boolean;
  maxMetrics?: number;
}

export const RealTimeMetrics: React.FC<RealTimeMetricsProps> = ({
  className = '',
  refreshInterval = 30000, // 30 seconds
  showTrends = true,
  showPercentages = true,
  maxMetrics = 6
}) => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Mock data - in production, this would fetch from your analytics API
  const generateMockMetrics = (): Metric[] => {
    const mockMetrics: Metric[] = [
      {
        id: 'active-users',
        name: 'Active Users',
        value: Math.floor(Math.random() * 1000) + 500,
        previousValue: Math.floor(Math.random() * 1000) + 500,
        unit: 'users',
        trend: Math.random() > 0.5 ? 'up' : 'down',
        change: Math.floor(Math.random() * 50) + 10,
        changePercentage: Math.floor(Math.random() * 20) + 5,
        color: 'teal',
        icon: '👥'
      },
      {
        id: 'revenue',
        name: 'Revenue',
        value: Math.floor(Math.random() * 10000) + 5000,
        previousValue: Math.floor(Math.random() * 10000) + 5000,
        unit: '$',
        trend: Math.random() > 0.5 ? 'up' : 'down',
        change: Math.floor(Math.random() * 500) + 100,
        changePercentage: Math.floor(Math.random() * 15) + 3,
        color: 'green',
        icon: '💰'
      },
      {
        id: 'orders',
        name: 'Orders',
        value: Math.floor(Math.random() * 100) + 50,
        previousValue: Math.floor(Math.random() * 100) + 50,
        unit: 'orders',
        trend: Math.random() > 0.5 ? 'up' : 'down',
        change: Math.floor(Math.random() * 10) + 2,
        changePercentage: Math.floor(Math.random() * 25) + 8,
        color: 'blue',
        icon: '📦'
      },
      {
        id: 'conversion-rate',
        name: 'Conversion Rate',
        value: Math.floor(Math.random() * 10) + 2,
        previousValue: Math.floor(Math.random() * 10) + 2,
        unit: '%',
        trend: Math.random() > 0.5 ? 'up' : 'down',
        change: Math.floor(Math.random() * 2) + 0.5,
        changePercentage: Math.floor(Math.random() * 30) + 10,
        color: 'purple',
        icon: '📈'
      },
      {
        id: 'page-views',
        name: 'Page Views',
        value: Math.floor(Math.random() * 5000) + 2000,
        previousValue: Math.floor(Math.random() * 5000) + 2000,
        unit: 'views',
        trend: Math.random() > 0.5 ? 'up' : 'down',
        change: Math.floor(Math.random() * 200) + 50,
        changePercentage: Math.floor(Math.random() * 20) + 5,
        color: 'amber',
        icon: '👁️'
      },
      {
        id: 'bounce-rate',
        name: 'Bounce Rate',
        value: Math.floor(Math.random() * 30) + 20,
        previousValue: Math.floor(Math.random() * 30) + 20,
        unit: '%',
        trend: Math.random() > 0.5 ? 'down' : 'up', // Lower is better for bounce rate
        change: Math.floor(Math.random() * 5) + 1,
        changePercentage: Math.floor(Math.random() * 15) + 5,
        color: 'red',
        icon: '↩️'
      }
    ];

    return mockMetrics.slice(0, maxMetrics);
  };

  const fetchMetrics = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newMetrics = generateMockMetrics();
      setMetrics(newMetrics);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, maxMetrics]);

  const getTrendColor = (trend: string, metricColor: string) => {
    if (trend === 'up') return 'text-green-400';
    if (trend === 'down') return 'text-red-400';
    return 'text-gray-400';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return '↗️';
    if (trend === 'down') return '↘️';
    return '→';
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === '$') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    }
    if (unit === '%') {
      return `${value.toFixed(1)}%`;
    }
    return new Intl.NumberFormat('en-US').format(value);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <PremiumTypography variant="h3" gradient="teal-blue" className="mb-2">
            Real-Time Metrics
          </PremiumTypography>
          <p className="text-gray-400 text-sm">
            Live data updates every {refreshInterval / 1000} seconds
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Last Updated</div>
          <div className="text-white font-medium">
            {lastUpdated.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric) => (
          <GlassCard
            key={metric.id}
            variant="elevated"
            className="p-6 hover:scale-105 transition-transform duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{metric.icon}</div>
                <div>
                  <h3 className="text-gray-300 text-sm font-medium">
                    {metric.name}
                  </h3>
                  <div className="text-2xl font-bold text-white">
                    {formatValue(metric.value, metric.unit)}
                  </div>
                </div>
              </div>
              {showTrends && (
                <div className={`text-lg ${getTrendColor(metric.trend, metric.color)}`}>
                  {getTrendIcon(metric.trend)}
                </div>
              )}
            </div>

            {showPercentages && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${getTrendColor(metric.trend, metric.color)}`}>
                    {metric.trend === 'up' ? '+' : metric.trend === 'down' ? '-' : ''}
                    {metric.changePercentage.toFixed(1)}%
                  </span>
                  <span className="text-gray-400 text-xs">
                    vs previous period
                  </span>
                </div>
                <div className="text-gray-400 text-xs">
                  {metric.change > 0 ? '+' : ''}{formatValue(metric.change, metric.unit)}
                </div>
              </div>
            )}

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    metric.trend === 'up' ? 'bg-gradient-to-r from-green-400 to-teal-400' :
                    metric.trend === 'down' ? 'bg-gradient-to-r from-red-400 to-pink-400' :
                    'bg-gradient-to-r from-gray-400 to-slate-400'
                  }`}
                  style={{
                    width: `${Math.min((metric.value / (metric.previousValue * 1.5)) * 100, 100)}%`
                  }}
                />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
          <p className="text-gray-400 mt-2">Updating metrics...</p>
        </div>
      )}

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={fetchMetrics}
          disabled={isLoading}
          className="px-6 py-2 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-lg hover:from-teal-500 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Updating...' : 'Refresh Now'}
        </button>
      </div>
    </div>
  );
};

// Specialized metric components
export const UserMetrics: React.FC<Omit<RealTimeMetricsProps, 'maxMetrics'>> = (props) => {
  return <RealTimeMetrics maxMetrics={3} {...props} />;
};

export const RevenueMetrics: React.FC<Omit<RealTimeMetricsProps, 'maxMetrics'>> = (props) => {
  return <RealTimeMetrics maxMetrics={4} {...props} />;
};

export const PerformanceMetrics: React.FC<Omit<RealTimeMetricsProps, 'maxMetrics'>> = (props) => {
  return <RealTimeMetrics maxMetrics={5} {...props} />;
}; 