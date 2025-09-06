import React, { useState, useEffect } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { PremiumTypography } from '../ui/PremiumTypography';
import { Clock4, FileText, CornerUpLeft, Ruler, Target, ShoppingCart, CheckCircle2, RefreshCw, CalendarDays, TrendingDown, Star, Smile, Ticket, TrendingUp, ArrowRight } from 'lucide-react';
import { Icon } from '../ui/Icon';

interface UserBehavior {
  id: string;
  metric: string;
  value: number;
  previousValue: number;
  change: number;
  changePercentage: number;
  trend: 'up' | 'down' | 'stable';
  category: 'engagement' | 'conversion' | 'retention' | 'satisfaction';
  description: string;
  icon: string;
}

interface UserBehaviorAnalyticsProps {
  className?: string;
  refreshInterval?: number;
  showTrends?: boolean;
  showPercentages?: boolean;
  category?: 'all' | 'engagement' | 'conversion' | 'retention' | 'satisfaction';
}

export const UserBehaviorAnalytics: React.FC<UserBehaviorAnalyticsProps> = ({
  className = '',
  refreshInterval = 60000, // 1 minute
  showTrends = true,
  showPercentages = true,
  category = 'all'
}) => {
  const [behaviors, setBehaviors] = useState<UserBehavior[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Mock user behavior data
  const generateUserBehaviorData = (): UserBehavior[] => {
    const mockBehaviors: UserBehavior[] = [
      // Engagement Metrics
      {
        id: 'session-duration',
        metric: 'Average Session Duration',
        value: Math.random() * 300 + 120, // 2-7 minutes
        previousValue: Math.random() * 300 + 120,
        change: Math.random() * 60 + 10,
        changePercentage: Math.random() * 30 + 5,
        trend: Math.random() > 0.5 ? 'up' : 'down',
        category: 'engagement',
        description: 'Average time users spend on the site',
        icon: 'clock'
      },
      {
        id: 'pages-per-session',
        metric: 'Pages per Session',
        value: Math.random() * 5 + 3, // 3-8 pages
        previousValue: Math.random() * 5 + 3,
        change: Math.random() * 2 + 0.5,
        changePercentage: Math.random() * 25 + 8,
        trend: Math.random() > 0.5 ? 'up' : 'down',
        category: 'engagement',
        description: 'Average number of pages viewed per session',
        icon: 'file'
      },
      {
        id: 'bounce-rate',
        metric: 'Bounce Rate',
        value: Math.random() * 40 + 20, // 20-60%
        previousValue: Math.random() * 40 + 20,
        change: Math.random() * 10 + 2,
        changePercentage: Math.random() * 20 + 5,
        trend: Math.random() > 0.5 ? 'down' : 'up', // Lower is better
        category: 'engagement',
        description: 'Percentage of single-page sessions',
        icon: 'back'
      },
      {
        id: 'scroll-depth',
        metric: 'Average Scroll Depth',
        value: Math.random() * 40 + 40, // 40-80%
        previousValue: Math.random() * 40 + 40,
        change: Math.random() * 15 + 5,
        changePercentage: Math.random() * 20 + 8,
        trend: Math.random() > 0.5 ? 'up' : 'down',
        category: 'engagement',
        description: 'Average scroll depth percentage',
        icon: 'ruler'
      },

      // Conversion Metrics
      {
        id: 'conversion-rate',
        metric: 'Conversion Rate',
        value: Math.random() * 8 + 2, // 2-10%
        previousValue: Math.random() * 8 + 2,
        change: Math.random() * 2 + 0.5,
        changePercentage: Math.random() * 30 + 10,
        trend: Math.random() > 0.5 ? 'up' : 'down',
        category: 'conversion',
        description: 'Percentage of visitors who convert',
        icon: 'target'
      },
      {
        id: 'cart-abandonment',
        metric: 'Cart Abandonment Rate',
        value: Math.random() * 30 + 40, // 40-70%
        previousValue: Math.random() * 30 + 40,
        change: Math.random() * 10 + 2,
        changePercentage: Math.random() * 15 + 5,
        trend: Math.random() > 0.5 ? 'down' : 'up', // Lower is better
        category: 'conversion',
        description: 'Percentage of abandoned shopping carts',
        icon: 'cart'
      },
      {
        id: 'checkout-completion',
        metric: 'Checkout Completion Rate',
        value: Math.random() * 20 + 60, // 60-80%
        previousValue: Math.random() * 20 + 60,
        change: Math.random() * 8 + 2,
        changePercentage: Math.random() * 15 + 5,
        trend: Math.random() > 0.5 ? 'up' : 'down',
        category: 'conversion',
        description: 'Percentage of completed checkouts',
        icon: 'check'
      },

      // Retention Metrics
      {
        id: 'return-visitors',
        metric: 'Return Visitor Rate',
        value: Math.random() * 30 + 20, // 20-50%
        previousValue: Math.random() * 30 + 20,
        change: Math.random() * 10 + 2,
        changePercentage: Math.random() * 25 + 8,
        trend: Math.random() > 0.5 ? 'up' : 'down',
        category: 'retention',
        description: 'Percentage of returning visitors',
        icon: 'refresh'
      },
      {
        id: 'user-lifetime',
        metric: 'Average User Lifetime',
        value: Math.random() * 180 + 90, // 90-270 days
        previousValue: Math.random() * 180 + 90,
        change: Math.random() * 30 + 10,
        changePercentage: Math.random() * 20 + 5,
        trend: Math.random() > 0.5 ? 'up' : 'down',
        category: 'retention',
        description: 'Average days users remain active',
        icon: 'calendar'
      },
      {
        id: 'churn-rate',
        metric: 'Churn Rate',
        value: Math.random() * 15 + 5, // 5-20%
        previousValue: Math.random() * 15 + 5,
        change: Math.random() * 5 + 1,
        changePercentage: Math.random() * 20 + 5,
        trend: Math.random() > 0.5 ? 'down' : 'up', // Lower is better
        category: 'retention',
        description: 'Percentage of users who stop using the service',
        icon: 'trending-down'
      },

      // Satisfaction Metrics
      {
        id: 'nps-score',
        metric: 'Net Promoter Score',
        value: Math.random() * 40 + 30, // 30-70
        previousValue: Math.random() * 40 + 30,
        change: Math.random() * 10 + 2,
        changePercentage: Math.random() * 20 + 5,
        trend: Math.random() > 0.5 ? 'up' : 'down',
        category: 'satisfaction',
        description: 'Net Promoter Score (-100 to 100)',
        icon: 'star'
      },
      {
        id: 'satisfaction-score',
        metric: 'Customer Satisfaction',
        value: Math.random() * 2 + 3, // 3-5 stars
        previousValue: Math.random() * 2 + 3,
        change: Math.random() * 0.5 + 0.1,
        changePercentage: Math.random() * 15 + 5,
        trend: Math.random() > 0.5 ? 'up' : 'down',
        category: 'satisfaction',
        description: 'Average customer satisfaction rating',
        icon: 'smile'
      },
      {
        id: 'support-tickets',
        metric: 'Support Tickets per User',
        value: Math.random() * 2 + 0.5, // 0.5-2.5 tickets
        previousValue: Math.random() * 2 + 0.5,
        change: Math.random() * 0.5 + 0.1,
        changePercentage: Math.random() * 20 + 5,
        trend: Math.random() > 0.5 ? 'down' : 'up', // Lower is better
        category: 'satisfaction',
        description: 'Average support tickets per user',
        icon: 'ticket'
      }
    ];

    if (category === 'all') {
      return mockBehaviors;
    }
    return mockBehaviors.filter(behavior => behavior.category === category);
  };

  const fetchUserBehaviorData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      const newBehaviors = generateUserBehaviorData();
      setBehaviors(newBehaviors);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching user behavior data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBehaviorData();
    const interval = setInterval(fetchUserBehaviorData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, category]);

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'text-green-400';
    if (trend === 'down') return 'text-red-400';
    return 'text-gray-400';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return 'up';
    if (trend === 'down') return 'down';
    return 'right';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'engagement': return 'text-blue-400';
      case 'conversion': return 'text-green-400';
      case 'retention': return 'text-purple-400';
      case 'satisfaction': return 'text-amber-400';
      default: return 'text-gray-400';
    }
  };

  const getCategoryBgColor = (category: string) => {
    switch (category) {
      case 'engagement': return 'bg-blue-400/20';
      case 'conversion': return 'bg-green-400/20';
      case 'retention': return 'bg-purple-400/20';
      case 'satisfaction': return 'bg-amber-400/20';
      default: return 'bg-gray-400/20';
    }
  };

  const formatValue = (value: number, metric: string) => {
    if (metric.includes('Duration') || metric.includes('Lifetime')) {
      return `${Math.round(value)} days`;
    }
    if (metric.includes('Rate') || metric.includes('Score') || metric.includes('Satisfaction')) {
      return `${value.toFixed(1)}%`;
    }
    if (metric.includes('Pages')) {
      return `${value.toFixed(1)} pages`;
    }
    if (metric.includes('Tickets')) {
      return `${value.toFixed(1)} tickets`;
    }
    if (metric.includes('NPS')) {
      return `${Math.round(value)}`;
    }
    return `${value.toFixed(1)}`;
  };

  const getCategoryTitle = () => {
    switch (category) {
      case 'engagement': return 'User Engagement Analytics';
      case 'conversion': return 'Conversion Analytics';
      case 'retention': return 'Retention Analytics';
      case 'satisfaction': return 'Satisfaction Analytics';
      default: return 'User Behavior Analytics';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <PremiumTypography variant="h3" gradient="teal-blue" className="mb-2">
            {getCategoryTitle()}
          </PremiumTypography>
          <p className="text-gray-400 text-sm">
            User behavior insights and patterns
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Last Updated</div>
          <div className="text-white font-medium">
            {lastUpdated.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Behavior Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {behaviors.map((behavior) => (
          <GlassCard
            key={behavior.id}
            variant="elevated"
            className={`p-6 hover:scale-105 transition-transform duration-300 ${getCategoryBgColor(behavior.category)}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">
                  {behavior.icon === 'clock' && <Icon as={Clock4} className="h-6 w-6" />}
                  {behavior.icon === 'file' && <Icon as={FileText} className="h-6 w-6" />}
                  {behavior.icon === 'back' && <Icon as={CornerUpLeft} className="h-6 w-6" />}
                  {behavior.icon === 'ruler' && <Icon as={Ruler} className="h-6 w-6" />}
                  {behavior.icon === 'target' && <Icon as={Target} className="h-6 w-6" />}
                  {behavior.icon === 'cart' && <Icon as={ShoppingCart} className="h-6 w-6" />}
                  {behavior.icon === 'check' && <Icon as={CheckCircle2} className="h-6 w-6" />}
                  {behavior.icon === 'refresh' && <Icon as={RefreshCw} className="h-6 w-6" />}
                  {behavior.icon === 'calendar' && <Icon as={CalendarDays} className="h-6 w-6" />}
                  {behavior.icon === 'trending-down' && <Icon as={TrendingDown} className="h-6 w-6" />}
                  {behavior.icon === 'star' && <Icon as={Star} className="h-6 w-6" />}
                  {behavior.icon === 'smile' && <Icon as={Smile} className="h-6 w-6" />}
                  {behavior.icon === 'ticket' && <Icon as={Ticket} className="h-6 w-6" />}
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-300 text-sm font-medium mb-1">
                    {behavior.metric}
                  </h3>
                  <div className="text-2xl font-bold text-white">
                    {formatValue(behavior.value, behavior.metric)}
                  </div>
                </div>
              </div>
              {showTrends && (
                <div className={`text-lg ${getTrendColor(behavior.trend)}`}>
                  {getTrendIcon(behavior.trend) === 'up' && <Icon as={TrendingUp} className="h-5 w-5" />}
                  {getTrendIcon(behavior.trend) === 'down' && <Icon as={TrendingDown} className="h-5 w-5" />}
                  {getTrendIcon(behavior.trend) === 'right' && <Icon as={ArrowRight} className="h-5 w-5" />}
                </div>
              )}
            </div>

            <p className="text-gray-400 text-xs mb-3">
              {behavior.description}
            </p>

            {showPercentages && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${getTrendColor(behavior.trend)}`}>
                    {behavior.trend === 'up' ? '+' : behavior.trend === 'down' ? '-' : ''}
                    {behavior.changePercentage.toFixed(1)}%
                  </span>
                  <span className="text-gray-400 text-xs">
                    vs previous period
                  </span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getCategoryBgColor(behavior.category)} ${getCategoryColor(behavior.category)}`}>
                  {behavior.category.toUpperCase()}
                </span>
              </div>
            )}

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    behavior.trend === 'up' ? 'bg-gradient-to-r from-green-400 to-teal-400' :
                    behavior.trend === 'down' ? 'bg-gradient-to-r from-red-400 to-pink-400' :
                    'bg-gradient-to-r from-gray-400 to-slate-400'
                  }`}
                  style={{
                    width: `${Math.min((behavior.value / (behavior.previousValue * 1.5)) * 100, 100)}%`
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
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
          <p className="text-gray-400 mt-2">Analyzing user behavior...</p>
        </div>
      )}

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={fetchUserBehaviorData}
          disabled={isLoading}
          className="px-6 py-2 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-lg hover:from-purple-500 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Analyzing...' : 'Refresh Analytics'}
        </button>
      </div>
    </div>
  );
};

// Specialized analytics components
export const EngagementAnalytics: React.FC<Omit<UserBehaviorAnalyticsProps, 'category'>> = (props) => {
  return <UserBehaviorAnalytics category="engagement" {...props} />;
};

export const ConversionAnalytics: React.FC<Omit<UserBehaviorAnalyticsProps, 'category'>> = (props) => {
  return <UserBehaviorAnalytics category="conversion" {...props} />;
};

export const RetentionAnalytics: React.FC<Omit<UserBehaviorAnalyticsProps, 'category'>> = (props) => {
  return <UserBehaviorAnalytics category="retention" {...props} />;
};

export const SatisfactionAnalytics: React.FC<Omit<UserBehaviorAnalyticsProps, 'category'>> = (props) => {
  return <UserBehaviorAnalytics category="satisfaction" {...props} />;
}; 