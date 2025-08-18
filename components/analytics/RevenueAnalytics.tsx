import React, { useState, useEffect } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { PremiumTypography } from '../ui/PremiumTypography';

interface RevenueMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  change: number;
  changePercentage: number;
  trend: 'up' | 'down' | 'stable';
  category: 'revenue' | 'sales' | 'profit' | 'growth';
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  description: string;
  icon: string;
}

interface RevenueAnalyticsProps {
  className?: string;
  refreshInterval?: number;
  showTrends?: boolean;
  showPercentages?: boolean;
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  category?: 'all' | 'revenue' | 'sales' | 'profit' | 'growth';
}

export const RevenueAnalytics: React.FC<RevenueAnalyticsProps> = ({
  className = '',
  refreshInterval = 45000, // 45 seconds
  showTrends = true,
  showPercentages = true,
  period = 'monthly',
  category = 'all'
}) => {
  const [metrics, setMetrics] = useState<RevenueMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Mock revenue data
  const generateRevenueData = (): RevenueMetric[] => {
    const mockMetrics: RevenueMetric[] = [
      // Revenue Metrics
      {
        id: 'total-revenue',
        name: 'Total Revenue',
        value: Math.random() * 50000 + 25000, // $25k-$75k
        previousValue: Math.random() * 50000 + 25000,
        change: Math.random() * 5000 + 1000,
        changePercentage: Math.random() * 25 + 8,
        trend: Math.random() > 0.5 ? 'up' : 'down',
        category: 'revenue',
        period,
        description: 'Total revenue generated',
        icon: '💰'
      },
      {
        id: 'recurring-revenue',
        name: 'Recurring Revenue',
        value: Math.random() * 30000 + 15000, // $15k-$45k
        previousValue: Math.random() * 30000 + 15000,
        change: Math.random() * 3000 + 800,
        changePercentage: Math.random() * 20 + 5,
        trend: Math.random() > 0.5 ? 'up' : 'down',
        category: 'revenue',
        period,
        description: 'Monthly recurring revenue',
        icon: '🔄'
      },
      {
        id: 'average-order-value',
        name: 'Average Order Value',
        value: Math.random() * 200 + 100, // $100-$300
        previousValue: Math.random() * 200 + 100,
        change: Math.random() * 30 + 10,
        changePercentage: Math.random() * 15 + 5,
        trend: Math.random() > 0.5 ? 'up' : 'down',
        category: 'revenue',
        period,
        description: 'Average value per order',
        icon: '📊'
      },

      // Sales Metrics
      {
        id: 'total-orders',
        name: 'Total Orders',
        value: Math.random() * 500 + 200, // 200-700 orders
        previousValue: Math.random() * 500 + 200,
        change: Math.random() * 50 + 15,
        changePercentage: Math.random() * 20 + 8,
        trend: Math.random() > 0.5 ? 'up' : 'down',
        category: 'sales',
        period,
        description: 'Total number of orders',
        icon: '📦'
      },
      {
        id: 'conversion-rate',
        name: 'Conversion Rate',
        value: Math.random() * 8 + 2, // 2-10%
        previousValue: Math.random() * 8 + 2,
        change: Math.random() * 2 + 0.5,
        changePercentage: Math.random() * 25 + 10,
        trend: Math.random() > 0.5 ? 'up' : 'down',
        category: 'sales',
        period,
        description: 'Visitor to customer conversion rate',
        icon: '🎯'
      },
      {
        id: 'customer-acquisition-cost',
        name: 'Customer Acquisition Cost',
        value: Math.random() * 50 + 20, // $20-$70
        previousValue: Math.random() * 50 + 20,
        change: Math.random() * 10 + 2,
        changePercentage: Math.random() * 20 + 5,
        trend: Math.random() > 0.5 ? 'down' : 'up', // Lower is better
        category: 'sales',
        period,
        description: 'Cost to acquire a new customer',
        icon: '💸'
      },

      // Profit Metrics
      {
        id: 'gross-profit',
        name: 'Gross Profit',
        value: Math.random() * 30000 + 15000, // $15k-$45k
        previousValue: Math.random() * 30000 + 15000,
        change: Math.random() * 3000 + 800,
        changePercentage: Math.random() * 20 + 5,
        trend: Math.random() > 0.5 ? 'up' : 'down',
        category: 'profit',
        period,
        description: 'Gross profit margin',
        icon: '📈'
      },
      {
        id: 'profit-margin',
        name: 'Profit Margin',
        value: Math.random() * 30 + 40, // 40-70%
        previousValue: Math.random() * 30 + 40,
        change: Math.random() * 5 + 1,
        changePercentage: Math.random() * 15 + 5,
        trend: Math.random() > 0.5 ? 'up' : 'down',
        category: 'profit',
        period,
        description: 'Net profit margin percentage',
        icon: '📊'
      },
      {
        id: 'operating-expenses',
        name: 'Operating Expenses',
        value: Math.random() * 20000 + 10000, // $10k-$30k
        previousValue: Math.random() * 20000 + 10000,
        change: Math.random() * 2000 + 500,
        changePercentage: Math.random() * 15 + 5,
        trend: Math.random() > 0.5 ? 'down' : 'up', // Lower is better
        category: 'profit',
        period,
        description: 'Total operating expenses',
        icon: '💼'
      },

      // Growth Metrics
      {
        id: 'revenue-growth',
        name: 'Revenue Growth',
        value: Math.random() * 40 + 10, // 10-50%
        previousValue: Math.random() * 40 + 10,
        change: Math.random() * 10 + 2,
        changePercentage: Math.random() * 20 + 5,
        trend: Math.random() > 0.5 ? 'up' : 'down',
        category: 'growth',
        period,
        description: 'Month-over-month revenue growth',
        icon: '🚀'
      },
      {
        id: 'customer-growth',
        name: 'Customer Growth',
        value: Math.random() * 30 + 15, // 15-45%
        previousValue: Math.random() * 30 + 15,
        change: Math.random() * 8 + 2,
        changePercentage: Math.random() * 25 + 8,
        trend: Math.random() > 0.5 ? 'up' : 'down',
        category: 'growth',
        period,
        description: 'New customer acquisition rate',
        icon: '👥'
      },
      {
        id: 'lifetime-value',
        name: 'Customer Lifetime Value',
        value: Math.random() * 500 + 300, // $300-$800
        previousValue: Math.random() * 500 + 300,
        change: Math.random() * 50 + 15,
        changePercentage: Math.random() * 15 + 5,
        trend: Math.random() > 0.5 ? 'up' : 'down',
        category: 'growth',
        period,
        description: 'Average customer lifetime value',
        icon: '💎'
      }
    ];

    let filteredMetrics = mockMetrics;
    
    if (category !== 'all') {
      filteredMetrics = mockMetrics.filter(metric => metric.category === category);
    }
    
    if (period !== 'monthly') {
      filteredMetrics = filteredMetrics.map(metric => ({
        ...metric,
        period,
        value: metric.value * (period === 'daily' ? 0.03 : period === 'weekly' ? 0.25 : period === 'yearly' ? 12 : 1),
        previousValue: metric.previousValue * (period === 'daily' ? 0.03 : period === 'weekly' ? 0.25 : period === 'yearly' ? 12 : 1)
      }));
    }

    return filteredMetrics;
  };

  const fetchRevenueData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newMetrics = generateRevenueData();
      setMetrics(newMetrics);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueData();
    const interval = setInterval(fetchRevenueData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, period, category]);

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'text-green-400';
    if (trend === 'down') return 'text-red-400';
    return 'text-gray-400';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return '↗️';
    if (trend === 'down') return '↘️';
    return '→';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'revenue': return 'text-green-400';
      case 'sales': return 'text-blue-400';
      case 'profit': return 'text-purple-400';
      case 'growth': return 'text-amber-400';
      default: return 'text-gray-400';
    }
  };

  const getCategoryBgColor = (category: string) => {
    switch (category) {
      case 'revenue': return 'bg-green-400/20';
      case 'sales': return 'bg-blue-400/20';
      case 'profit': return 'bg-purple-400/20';
      case 'growth': return 'bg-amber-400/20';
      default: return 'bg-gray-400/20';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const formatValue = (value: number, metric: string) => {
    if (metric.includes('Rate') || metric.includes('Margin') || metric.includes('Growth')) {
      return formatPercentage(value);
    }
    if (metric.includes('Orders') || metric.includes('Customers')) {
      return Math.round(value).toLocaleString();
    }
    return formatCurrency(value);
  };

  const getPeriodTitle = () => {
    switch (period) {
      case 'daily': return 'Daily Revenue Analytics';
      case 'weekly': return 'Weekly Revenue Analytics';
      case 'monthly': return 'Monthly Revenue Analytics';
      case 'yearly': return 'Yearly Revenue Analytics';
      default: return 'Revenue Analytics';
    }
  };

  const getCategoryTitle = () => {
    switch (category) {
      case 'revenue': return 'Revenue Metrics';
      case 'sales': return 'Sales Metrics';
      case 'profit': return 'Profit Metrics';
      case 'growth': return 'Growth Metrics';
      default: return 'Revenue Analytics';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <PremiumTypography variant="h3" gradient="teal-blue" className="mb-2">
            {getPeriodTitle()}
          </PremiumTypography>
          <p className="text-gray-400 text-sm">
            Comprehensive revenue tracking and analysis
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Last Updated</div>
          <div className="text-white font-medium">
            {lastUpdated.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Revenue Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.slice(0, 3).map((metric) => (
          <GlassCard
            key={metric.id}
            variant="elevated"
            className="p-6 text-center"
          >
            <div className="text-3xl mb-2">{metric.icon}</div>
            <h3 className="text-gray-300 text-sm font-medium mb-2">
              {metric.name}
            </h3>
            <div className="text-3xl font-bold text-white mb-2">
              {formatValue(metric.value, metric.name)}
            </div>
            <div className={`text-sm ${getTrendColor(metric.trend)}`}>
              {metric.trend === 'up' ? '+' : metric.trend === 'down' ? '-' : ''}
              {metric.changePercentage.toFixed(1)}% vs previous {period}
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Detailed Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.slice(3).map((metric) => (
          <GlassCard
            key={metric.id}
            variant="elevated"
            className={`p-6 hover:scale-105 transition-transform duration-300 ${getCategoryBgColor(metric.category)}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{metric.icon}</div>
                <div className="flex-1">
                  <h3 className="text-gray-300 text-sm font-medium mb-1">
                    {metric.name}
                  </h3>
                  <div className="text-2xl font-bold text-white">
                    {formatValue(metric.value, metric.name)}
                  </div>
                </div>
              </div>
              {showTrends && (
                <div className={`text-lg ${getTrendColor(metric.trend)}`}>
                  {getTrendIcon(metric.trend)}
                </div>
              )}
            </div>

            <p className="text-gray-400 text-xs mb-3">
              {metric.description}
            </p>

            {showPercentages && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${getTrendColor(metric.trend)}`}>
                    {metric.trend === 'up' ? '+' : metric.trend === 'down' ? '-' : ''}
                    {metric.changePercentage.toFixed(1)}%
                  </span>
                  <span className="text-gray-400 text-xs">
                    vs previous {period}
                  </span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getCategoryBgColor(metric.category)} ${getCategoryColor(metric.category)}`}>
                  {metric.category.toUpperCase()}
                </span>
              </div>
            )}

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    metric.trend === 'up' ? 'bg-gradient-to-r from-green-400 to-emerald-400' :
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
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
          <p className="text-gray-400 mt-2">Calculating revenue metrics...</p>
        </div>
      )}

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={fetchRevenueData}
          disabled={isLoading}
          className="px-6 py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-lg hover:from-green-500 hover:to-emerald-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Calculating...' : 'Refresh Revenue Data'}
        </button>
      </div>
    </div>
  );
};

// Specialized revenue analytics components
export const DailyRevenueAnalytics: React.FC<Omit<RevenueAnalyticsProps, 'period'>> = (props) => {
  return <RevenueAnalytics period="daily" {...props} />;
};

export const WeeklyRevenueAnalytics: React.FC<Omit<RevenueAnalyticsProps, 'period'>> = (props) => {
  return <RevenueAnalytics period="weekly" {...props} />;
};

export const MonthlyRevenueAnalytics: React.FC<Omit<RevenueAnalyticsProps, 'period'>> = (props) => {
  return <RevenueAnalytics period="monthly" {...props} />;
};

export const YearlyRevenueAnalytics: React.FC<Omit<RevenueAnalyticsProps, 'period'>> = (props) => {
  return <RevenueAnalytics period="yearly" {...props} />;
}; 