import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { PremiumTypography } from '../ui/PremiumTypography';

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  threshold: {
    warning: number;
    critical: number;
  };
  trend: 'improving' | 'stable' | 'declining';
  description: string;
}

interface PerformanceMonitorProps {
  className?: string;
  refreshInterval?: number;
  showAlerts?: boolean;
  showTrends?: boolean;
  maxMetrics?: number;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  className = '',
  refreshInterval = 10000, // 10 seconds
  showAlerts = true,
  showTrends = true,
  maxMetrics = 8
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const performanceRef = useRef<Performance | null>(null);

  // Mock performance data - in production, this would use real performance APIs
  const generatePerformanceMetrics = (): PerformanceMetric[] => {
    const mockMetrics: PerformanceMetric[] = [
      {
        id: 'fcp',
        name: 'First Contentful Paint',
        value: Math.random() * 2000 + 500, // 500-2500ms
        unit: 'ms',
        status: Math.random() > 0.7 ? 'excellent' : Math.random() > 0.4 ? 'good' : Math.random() > 0.2 ? 'warning' : 'critical',
        threshold: { warning: 1500, critical: 2500 },
        trend: Math.random() > 0.6 ? 'improving' : Math.random() > 0.3 ? 'stable' : 'declining',
        description: 'Time until first content is painted'
      },
      {
        id: 'lcp',
        name: 'Largest Contentful Paint',
        value: Math.random() * 4000 + 1000, // 1000-5000ms
        unit: 'ms',
        status: Math.random() > 0.7 ? 'excellent' : Math.random() > 0.4 ? 'good' : Math.random() > 0.2 ? 'warning' : 'critical',
        threshold: { warning: 2500, critical: 4000 },
        trend: Math.random() > 0.6 ? 'improving' : Math.random() > 0.3 ? 'stable' : 'declining',
        description: 'Time until largest content is painted'
      },
      {
        id: 'fid',
        name: 'First Input Delay',
        value: Math.random() * 300 + 50, // 50-350ms
        unit: 'ms',
        status: Math.random() > 0.7 ? 'excellent' : Math.random() > 0.4 ? 'good' : Math.random() > 0.2 ? 'warning' : 'critical',
        threshold: { warning: 100, critical: 300 },
        trend: Math.random() > 0.6 ? 'improving' : Math.random() > 0.3 ? 'stable' : 'declining',
        description: 'Time until first user interaction'
      },
      {
        id: 'cls',
        name: 'Cumulative Layout Shift',
        value: Math.random() * 0.3, // 0-0.3
        unit: '',
        status: Math.random() > 0.7 ? 'excellent' : Math.random() > 0.4 ? 'good' : Math.random() > 0.2 ? 'warning' : 'critical',
        threshold: { warning: 0.1, critical: 0.25 },
        trend: Math.random() > 0.6 ? 'improving' : Math.random() > 0.3 ? 'stable' : 'declining',
        description: 'Visual stability metric'
      },
      {
        id: 'ttfb',
        name: 'Time to First Byte',
        value: Math.random() * 800 + 200, // 200-1000ms
        unit: 'ms',
        status: Math.random() > 0.7 ? 'excellent' : Math.random() > 0.4 ? 'good' : Math.random() > 0.2 ? 'warning' : 'critical',
        threshold: { warning: 600, critical: 1000 },
        trend: Math.random() > 0.6 ? 'improving' : Math.random() > 0.3 ? 'stable' : 'declining',
        description: 'Server response time'
      },
      {
        id: 'memory',
        name: 'Memory Usage',
        value: Math.random() * 50 + 20, // 20-70MB
        unit: 'MB',
        status: Math.random() > 0.7 ? 'excellent' : Math.random() > 0.4 ? 'good' : Math.random() > 0.2 ? 'warning' : 'critical',
        threshold: { warning: 50, critical: 100 },
        trend: Math.random() > 0.6 ? 'improving' : Math.random() > 0.3 ? 'stable' : 'declining',
        description: 'JavaScript heap memory usage'
      },
      {
        id: 'fps',
        name: 'Frame Rate',
        value: Math.random() * 20 + 50, // 50-70 FPS
        unit: 'FPS',
        status: Math.random() > 0.7 ? 'excellent' : Math.random() > 0.4 ? 'good' : Math.random() > 0.2 ? 'warning' : 'critical',
        threshold: { warning: 30, critical: 20 },
        trend: Math.random() > 0.6 ? 'improving' : Math.random() > 0.3 ? 'stable' : 'declining',
        description: 'Animation frame rate'
      },
      {
        id: 'errors',
        name: 'Error Rate',
        value: Math.random() * 5, // 0-5%
        unit: '%',
        status: Math.random() > 0.7 ? 'excellent' : Math.random() > 0.4 ? 'good' : Math.random() > 0.2 ? 'warning' : 'critical',
        threshold: { warning: 1, critical: 5 },
        trend: Math.random() > 0.6 ? 'improving' : Math.random() > 0.3 ? 'stable' : 'declining',
        description: 'JavaScript error rate'
      }
    ];

    return mockMetrics.slice(0, maxMetrics);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-blue-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-400/20';
      case 'good': return 'bg-blue-400/20';
      case 'warning': return 'bg-yellow-400/20';
      case 'critical': return 'bg-red-400/20';
      default: return 'bg-gray-400/20';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return '↗️';
      case 'declining': return '↘️';
      case 'stable': return '→';
      default: return '→';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-400';
      case 'declining': return 'text-red-400';
      case 'stable': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === 'ms') return `${Math.round(value)}ms`;
    if (unit === 'MB') return `${Math.round(value)}MB`;
    if (unit === 'FPS') return `${Math.round(value)} FPS`;
    if (unit === '%') return `${value.toFixed(2)}%`;
    if (unit === '') return value.toFixed(3);
    return `${value}${unit}`;
  };

  const fetchPerformanceMetrics = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      const newMetrics = generatePerformanceMetrics();
      setMetrics(newMetrics);
      setLastUpdated(new Date());

      // Check for alerts
      const newAlerts: string[] = [];
      newMetrics.forEach(metric => {
        if (metric.status === 'critical') {
          newAlerts.push(`${metric.name} is critical: ${formatValue(metric.value, metric.unit)}`);
        } else if (metric.status === 'warning') {
          newAlerts.push(`${metric.name} needs attention: ${formatValue(metric.value, metric.unit)}`);
        }
      });
      setAlerts(newAlerts);
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformanceMetrics();
    const interval = setInterval(fetchPerformanceMetrics, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, maxMetrics]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <PremiumTypography variant="h3" gradient="amber-teal" className="mb-2">
            Performance Monitor
          </PremiumTypography>
          <p className="text-gray-400 text-sm">
            Real-time system performance monitoring
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Last Updated</div>
          <div className="text-white font-medium">
            {lastUpdated.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Alerts */}
      {showAlerts && alerts.length > 0 && (
        <GlassCard variant="default" className="p-4 border-l-4 border-red-400">
          <div className="flex items-center space-x-3">
            <div className="text-red-400 text-xl">⚠️</div>
            <div>
              <h4 className="text-red-400 font-semibold">Performance Alerts</h4>
              <ul className="text-sm text-gray-300 mt-1">
                {alerts.map((alert, index) => (
                  <li key={index}>• {alert}</li>
                ))}
              </ul>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric) => (
          <GlassCard
            key={metric.id}
            variant="elevated"
            className={`p-6 hover:scale-105 transition-transform duration-300 ${getStatusBgColor(metric.status)}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-gray-300 text-sm font-medium mb-1">
                  {metric.name}
                </h3>
                <div className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                  {formatValue(metric.value, metric.unit)}
                </div>
                <p className="text-gray-400 text-xs mt-1">
                  {metric.description}
                </p>
              </div>
              {showTrends && (
                <div className={`text-lg ${getTrendColor(metric.trend)}`}>
                  {getTrendIcon(metric.trend)}
                </div>
              )}
            </div>

            {/* Status Indicator */}
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusBgColor(metric.status)} ${getStatusColor(metric.status)}`}>
                {metric.status.toUpperCase()}
              </span>
              <span className="text-gray-400 text-xs">
                Threshold: {formatValue(metric.threshold.warning, metric.unit)}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  metric.status === 'excellent' ? 'bg-gradient-to-r from-green-400 to-teal-400' :
                  metric.status === 'good' ? 'bg-gradient-to-r from-blue-400 to-cyan-400' :
                  metric.status === 'warning' ? 'bg-gradient-to-r from-yellow-400 to-orange-400' :
                  'bg-gradient-to-r from-red-400 to-pink-400'
                }`}
                style={{
                  width: `${Math.min((metric.value / metric.threshold.critical) * 100, 100)}%`
                }}
              />
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
          <p className="text-gray-400 mt-2">Monitoring performance...</p>
        </div>
      )}

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={fetchPerformanceMetrics}
          disabled={isLoading}
          className="px-6 py-2 bg-gradient-to-r from-amber-400 to-teal-500 text-white rounded-lg hover:from-amber-500 hover:to-teal-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Monitoring...' : 'Refresh Metrics'}
        </button>
      </div>
    </div>
  );
};

// Specialized performance monitors
export const WebVitalsMonitor: React.FC<Omit<PerformanceMonitorProps, 'maxMetrics'>> = (props) => {
  return <PerformanceMonitor maxMetrics={5} {...props} />;
};

export const SystemPerformanceMonitor: React.FC<Omit<PerformanceMonitorProps, 'maxMetrics'>> = (props) => {
  return <PerformanceMonitor maxMetrics={6} {...props} />;
};

export const ErrorRateMonitor: React.FC<Omit<PerformanceMonitorProps, 'maxMetrics'>> = (props) => {
  return <PerformanceMonitor maxMetrics={3} {...props} />;
}; 