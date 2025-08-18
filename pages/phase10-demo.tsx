import React, { useState } from 'react';
import Head from 'next/head';
import { RealTimeMetrics, UserMetrics, RevenueMetrics, PerformanceMetrics } from '../components/analytics/RealTimeMetrics';
import { PerformanceMonitor, WebVitalsMonitor, SystemPerformanceMonitor, ErrorRateMonitor } from '../components/analytics/PerformanceMonitor';
import { UserBehaviorAnalytics, EngagementAnalytics, ConversionAnalytics, RetentionAnalytics, SatisfactionAnalytics } from '../components/analytics/UserBehaviorAnalytics';
import { RevenueAnalytics, DailyRevenueAnalytics, WeeklyRevenueAnalytics, MonthlyRevenueAnalytics, YearlyRevenueAnalytics } from '../components/analytics/RevenueAnalytics';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientText } from '../components/ui/GradientText';
import { PremiumTypography } from '../components/ui/PremiumTypography';
import { AnimatedBackground } from '../components/ui/AnimatedBackground';

export default function Phase10Demo() {
  const [activeSection, setActiveSection] = useState<'metrics' | 'performance' | 'behavior' | 'revenue'>('metrics');
  const [refreshInterval, setRefreshInterval] = useState(30000);

  const sections = [
    { id: 'metrics', label: 'Real-Time Metrics', icon: '📊' },
    { id: 'performance', label: 'Performance Monitor', icon: '⚡' },
    { id: 'behavior', label: 'User Behavior', icon: '👥' },
    { id: 'revenue', label: 'Revenue Analytics', icon: '💰' }
  ];

  return (
    <>
      <Head>
        <title>Phase 10 Demo - Advanced Analytics & Performance Monitoring</title>
        <meta name="description" content="Phase 10: Advanced Analytics & Performance Monitoring - Real-time metrics, performance monitoring, user behavior analytics, and revenue tracking" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Animated Background */}
        <AnimatedBackground variant="premium" intensity="medium" />
        
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <PremiumTypography variant="display" gradient="teal-blue" glow={true} className="mb-6">
              Phase 10: Advanced Analytics & Performance Monitoring
            </PremiumTypography>
            <PremiumTypography variant="body" className="text-xl text-gray-300 max-w-4xl mx-auto">
              Comprehensive real-time analytics dashboard with performance monitoring, user behavior tracking, 
              and revenue analytics for data-driven decision making
            </PremiumTypography>
          </div>

          {/* Navigation */}
          <div className="flex justify-center space-x-4 mb-8">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as 'metrics' | 'performance' | 'behavior' | 'revenue')}
                className={`px-6 py-3 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                  activeSection === section.id
                    ? 'bg-gradient-to-r from-teal-400 to-blue-500 text-white shadow-lg'
                    : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700/50'
                }`}
              >
                <span>{section.icon}</span>
                <span>{section.label}</span>
              </button>
            ))}
          </div>

          {/* Refresh Interval Control */}
          <div className="text-center mb-8">
            <GlassCard variant="default" className="inline-block p-4">
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">Refresh Interval:</span>
                <select
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(Number(e.target.value))}
                  className="bg-slate-700 text-white px-3 py-1 rounded border border-slate-600"
                >
                  <option value={10000}>10 seconds</option>
                  <option value={30000}>30 seconds</option>
                  <option value={60000}>1 minute</option>
                  <option value={300000}>5 minutes</option>
                </select>
                <span className="text-gray-400 text-sm">
                  ({refreshInterval / 1000}s)
                </span>
              </div>
            </GlassCard>
          </div>

          {/* Content Sections */}
          <div className="space-y-12">
            {/* Real-Time Metrics */}
            {activeSection === 'metrics' && (
              <div>
                <div className="text-center mb-8">
                  <PremiumTypography variant="h2" gradient="amber-teal" className="mb-4">
                    Real-Time Metrics Dashboard
                  </PremiumTypography>
                  <p className="text-gray-400">
                    Live data visualization with customizable refresh intervals and trend analysis
                  </p>
                </div>

                <RealTimeMetrics 
                  refreshInterval={refreshInterval}
                  showTrends={true}
                  showPercentages={true}
                  maxMetrics={6}
                />

                {/* Specialized Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-center">
                      <GradientText gradient="teal-blue">User Metrics</GradientText>
                    </h3>
                    <UserMetrics refreshInterval={refreshInterval} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-center">
                      <GradientText gradient="amber-teal">Revenue Metrics</GradientText>
                    </h3>
                    <RevenueMetrics refreshInterval={refreshInterval} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-center">
                                               <GradientText gradient="teal-blue">Performance Metrics</GradientText>
                    </h3>
                    <PerformanceMetrics refreshInterval={refreshInterval} />
                  </div>
                </div>
              </div>
            )}

            {/* Performance Monitor */}
            {activeSection === 'performance' && (
              <div>
                <div className="text-center mb-8">
                  <PremiumTypography variant="h2" gradient="amber-teal" className="mb-4">
                    Performance Monitoring System
                  </PremiumTypography>
                  <p className="text-gray-400">
                    Comprehensive system performance tracking with alerts and threshold monitoring
                  </p>
                </div>

                <PerformanceMonitor 
                  refreshInterval={refreshInterval}
                  showAlerts={true}
                  showTrends={true}
                  maxMetrics={8}
                />

                {/* Specialized Performance Monitors */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-center">
                      <GradientText gradient="teal-blue">Web Vitals</GradientText>
                    </h3>
                    <WebVitalsMonitor refreshInterval={refreshInterval} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-center">
                      <GradientText gradient="amber-teal">System Performance</GradientText>
                    </h3>
                    <SystemPerformanceMonitor refreshInterval={refreshInterval} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-center">
                                               <GradientText gradient="teal-blue">Error Rate</GradientText>
                    </h3>
                    <ErrorRateMonitor refreshInterval={refreshInterval} />
                  </div>
                </div>
              </div>
            )}

            {/* User Behavior Analytics */}
            {activeSection === 'behavior' && (
              <div>
                <div className="text-center mb-8">
                  <PremiumTypography variant="h2" gradient="teal-blue" className="mb-4">
                    User Behavior Analytics
                  </PremiumTypography>
                  <p className="text-gray-400">
                    Deep insights into user engagement, conversion patterns, and satisfaction metrics
                  </p>
                </div>

                <UserBehaviorAnalytics 
                  refreshInterval={refreshInterval}
                  showTrends={true}
                  showPercentages={true}
                  category="all"
                />

                {/* Specialized Behavior Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-center">
                      <GradientText gradient="teal-blue">Engagement Analytics</GradientText>
                    </h3>
                    <EngagementAnalytics refreshInterval={refreshInterval} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-center">
                                             <GradientText gradient="amber-teal">Conversion Analytics</GradientText>
                    </h3>
                    <ConversionAnalytics refreshInterval={refreshInterval} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-center">
                                             <GradientText gradient="teal-blue">Retention Analytics</GradientText>
                    </h3>
                    <RetentionAnalytics refreshInterval={refreshInterval} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-center">
                                             <GradientText gradient="amber-teal">Satisfaction Analytics</GradientText>
                    </h3>
                    <SatisfactionAnalytics refreshInterval={refreshInterval} />
                  </div>
                </div>
              </div>
            )}

            {/* Revenue Analytics */}
            {activeSection === 'revenue' && (
              <div>
                <div className="text-center mb-8">
                                     <PremiumTypography variant="h2" gradient="teal-blue" className="mb-4">
                    Revenue Analytics Dashboard
                  </PremiumTypography>
                  <p className="text-gray-400">
                    Comprehensive revenue tracking with multiple time periods and detailed breakdowns
                  </p>
                </div>

                <RevenueAnalytics 
                  refreshInterval={refreshInterval}
                  showTrends={true}
                  showPercentages={true}
                  period="monthly"
                  category="all"
                />

                {/* Specialized Revenue Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-center">
                      <GradientText gradient="teal-blue">Daily Revenue</GradientText>
                    </h3>
                    <DailyRevenueAnalytics refreshInterval={refreshInterval} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-center">
                      <GradientText gradient="amber-teal">Weekly Revenue</GradientText>
                    </h3>
                    <WeeklyRevenueAnalytics refreshInterval={refreshInterval} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-center">
                                               <GradientText gradient="teal-blue">Monthly Revenue</GradientText>
                    </h3>
                    <MonthlyRevenueAnalytics refreshInterval={refreshInterval} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-center">
                                               <GradientText gradient="amber-teal">Yearly Revenue</GradientText>
                    </h3>
                    <YearlyRevenueAnalytics refreshInterval={refreshInterval} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Phase Summary */}
          <GlassCard variant="cool" className="p-8 mt-12">
            <PremiumTypography variant="h3" gradient="teal-blue" className="text-center mb-6">
              Phase 10 Implementation Summary
            </PremiumTypography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-300 mb-3">✅ Completed Features:</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Real-time metrics dashboard with live updates</li>
                  <li>• Performance monitoring with alerts and thresholds</li>
                  <li>• User behavior analytics with 4 categories</li>
                  <li>• Revenue analytics with multiple time periods</li>
                  <li>• Customizable refresh intervals</li>
                  <li>• Trend analysis and percentage changes</li>
                  <li>• Mathematical harmony design integration</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-300 mb-3">🎯 Benefits:</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Data-driven decision making</li>
                  <li>• Real-time performance monitoring</li>
                  <li>• User behavior insights</li>
                  <li>• Revenue tracking and analysis</li>
                  <li>• Proactive issue detection</li>
                  <li>• Business intelligence capabilities</li>
                  <li>• Scalable analytics infrastructure</li>
                </ul>
              </div>
            </div>

            {/* Technical Details */}
            <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
              <h4 className="font-semibold text-gray-300 mb-2">🔧 Technical Implementation:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
                <div>
                  <strong>Components Created:</strong> 4 main analytics components
                </div>
                <div>
                  <strong>Specialized Variants:</strong> 12 specialized analytics components
                </div>
                <div>
                  <strong>Update Intervals:</strong> 10s - 5min configurable
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </>
  );
} 