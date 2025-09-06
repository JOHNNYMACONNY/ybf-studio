import React, { useState, useEffect } from 'react';
import { Zap, Accessibility, Globe, Smartphone } from 'lucide-react';
import { Icon } from '../ui/Icon';
import { startPerformanceMonitoring, stopPerformanceMonitoring, getPerformanceMetrics, checkPerformance, PerformanceMetrics } from '../../utils/performance';
import { runAccessibilityTests, AccessibilityReport } from '../../utils/accessibility';
import { runBrowserTests, getBrowserInfo, BrowserInfo, BrowserTestResult } from '../../utils/browserTesting';
import { runMobileTests, getDeviceInfo, MobileDeviceInfo, MobileTestResult } from '../../utils/mobileTesting';
import { GlassCard } from '../ui/GlassCard';
import { GradientText } from '../ui/GradientText';
import { AdvancedButton } from '../ui/AdvancedButton';
import { PremiumContainer } from '../ui/PremiumContainer';

interface TestingDashboardProps {
  className?: string;
}

export const TestingDashboard: React.FC<TestingDashboardProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState<'performance' | 'accessibility' | 'browser' | 'mobile'>('performance');
  const [isRunning, setIsRunning] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Performance monitoring state
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [performanceIssues, setPerformanceIssues] = useState<string[]>([]);

  // Accessibility testing state
  const [accessibilityReport, setAccessibilityReport] = useState<AccessibilityReport | null>(null);

  // Browser testing state
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo | null>(null);
  const [browserResults, setBrowserResults] = useState<BrowserTestResult | null>(null);

  // Mobile testing state
  const [deviceInfo, setDeviceInfo] = useState<MobileDeviceInfo | null>(null);
  const [mobileResults, setMobileResults] = useState<MobileTestResult | null>(null);

  // Start performance monitoring
  useEffect(() => {
    if (typeof window !== 'undefined') {
      startPerformanceMonitoring();
      
      // Get initial metrics
      const metrics = getPerformanceMetrics();
      const performance = checkPerformance();
      
      setPerformanceMetrics(metrics);
      setPerformanceIssues(performance.issues);

      return () => {
        stopPerformanceMonitoring();
      };
    }
    
    // Return empty cleanup function for server-side rendering
    return () => {};
  }, []);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      runAllTests();
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Run all tests
  const runAllTests = async () => {
    setIsRunning(true);
    
    try {
      // Performance tests
      const perfMetrics = getPerformanceMetrics();
      const perfCheck = checkPerformance();
      setPerformanceMetrics(perfMetrics);
      setPerformanceIssues(perfCheck.issues);

      // Accessibility tests
      const a11yReport = runAccessibilityTests();
      setAccessibilityReport(a11yReport);

      // Browser tests
      const browserInfo = getBrowserInfo();
      const browserTestResults = runBrowserTests();
      setBrowserInfo(browserInfo);
      setBrowserResults(browserTestResults);

      // Mobile tests
      const deviceInfo = getDeviceInfo();
      const mobileTestResults = runMobileTests();
      setDeviceInfo(deviceInfo);
      setMobileResults(mobileTestResults);

      // Results are stored in individual state variables
    } catch (error) {
      console.error('Testing error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  // Run specific test
  const runTest = (testType: 'performance' | 'accessibility' | 'browser' | 'mobile') => {
    setIsRunning(true);
    
    try {
      switch (testType) {
        case 'performance':
          const perfMetrics = getPerformanceMetrics();
          const perfCheck = checkPerformance();
          setPerformanceMetrics(perfMetrics);
          setPerformanceIssues(perfCheck.issues);
          break;
        case 'accessibility':
          const a11yReport = runAccessibilityTests();
          setAccessibilityReport(a11yReport);
          break;
        case 'browser':
          const browserInfo = getBrowserInfo();
          const browserTestResults = runBrowserTests();
          setBrowserInfo(browserInfo);
          setBrowserResults(browserTestResults);
          break;
        case 'mobile':
          const deviceInfo = getDeviceInfo();
          const mobileTestResults = runMobileTests();
          setDeviceInfo(deviceInfo);
          setMobileResults(mobileTestResults);
          break;
        default:
          console.warn(`Unknown test type: ${testType}`);
          break;
      }
    } catch (error) {
      console.error(`${testType} test error:`, error);
    } finally {
      setIsRunning(false);
    }
  };

  const tabs = [
    { id: 'performance', label: 'Performance', icon: Zap },
    { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
    { id: 'browser', label: 'Browser', icon: Globe },
    { id: 'mobile', label: 'Mobile', icon: Smartphone }
  ] as const;

  return (
    <div className={`min-h-screen bg-gradient-premium ${className}`}>
      <PremiumContainer variant="wide" background="none" padding="xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            <GradientText gradient="teal-blue">Phase 4</GradientText> Testing Dashboard
          </h1>
          <p className="text-gray-300 text-lg">
            Comprehensive testing and optimization for production readiness
          </p>
        </div>

        {/* Control Panel */}
        <GlassCard className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {tabs.map(tab => (
                <AdvancedButton
                  key={tab.id}
                  variant={activeTab === tab.id ? 'gradient' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  glow={activeTab === tab.id}
                >
                  <Icon as={tab.icon} className="mr-2 h-4 w-4" />
                  {tab.label}
                </AdvancedButton>
              ))}
            </div>
            
            <div className="flex items-center gap-4">
              <AdvancedButton
                variant="primary"
                onClick={runAllTests}
                loading={isRunning}
                disabled={isRunning}
                glow
              >
                {isRunning ? 'Running Tests...' : 'Run All Tests'}
              </AdvancedButton>
              
              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="w-4 h-4 text-teal-400 bg-gray-700 border-gray-600 rounded focus:ring-teal-400 focus:ring-2"
                />
                <span className="text-sm">Auto-refresh</span>
              </label>
            </div>
          </div>
        </GlassCard>

        {/* Test Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Performance Testing */}
          {activeTab === 'performance' && (
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <Icon as={Zap} className="mr-2 h-5 w-5" />
                  Performance Testing
                </h3>
                <AdvancedButton
                  variant="teal"
                  size="sm"
                  onClick={() => runTest('performance')}
                  loading={isRunning}
                  disabled={isRunning}
                >
                  Test
                </AdvancedButton>
              </div>

              {performanceMetrics && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <div className="text-sm text-gray-400">Load Time</div>
                      <div className="text-lg font-semibold text-white">
                        {performanceMetrics.loadTime?.toFixed(0) || 'N/A'}ms
                      </div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <div className="text-sm text-gray-400">FCP</div>
                      <div className="text-lg font-semibold text-white">
                        {performanceMetrics.firstContentfulPaint?.toFixed(0) || 'N/A'}ms
                      </div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <div className="text-sm text-gray-400">LCP</div>
                      <div className="text-lg font-semibold text-white">
                        {performanceMetrics.largestContentfulPaint?.toFixed(0) || 'N/A'}ms
                      </div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <div className="text-sm text-gray-400">CLS</div>
                      <div className="text-lg font-semibold text-white">
                        {performanceMetrics.cumulativeLayoutShift?.toFixed(3) || 'N/A'}
                      </div>
                    </div>
                  </div>

                  {performanceIssues.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-red-400 mb-3">Issues Found</h4>
                      <div className="space-y-2">
                        {performanceIssues.map((issue, index) => (
                          <div key={index} className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                            <div className="text-red-300 text-sm">{issue}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </GlassCard>
          )}

          {/* Accessibility Testing */}
          {activeTab === 'accessibility' && (
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <Icon as={Accessibility} className="mr-2 h-5 w-5" />
                  Accessibility Testing
                </h3>
                <AdvancedButton
                  variant="teal"
                  size="sm"
                  onClick={() => runTest('accessibility')}
                  loading={isRunning}
                  disabled={isRunning}
                >
                  Test
                </AdvancedButton>
              </div>

              {accessibilityReport && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-white">
                      Score: {accessibilityReport.score}/100
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      accessibilityReport.passed 
                        ? 'bg-green-900/30 text-green-300 border border-green-500/30' 
                        : 'bg-red-900/30 text-red-300 border border-red-500/30'
                    }`}>
                      {accessibilityReport.passed ? 'PASSED' : 'FAILED'}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-red-400">{accessibilityReport.summary.errors}</div>
                      <div className="text-sm text-red-300">Errors</div>
                    </div>
                    <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-yellow-400">{accessibilityReport.summary.warnings}</div>
                      <div className="text-sm text-yellow-300">Warnings</div>
                    </div>
                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-blue-400">{accessibilityReport.summary.info}</div>
                      <div className="text-sm text-blue-300">Info</div>
                    </div>
                  </div>

                  {accessibilityReport.issues.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-white mb-3">Issues Found</h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {accessibilityReport.issues.map((issue, index: number) => (
                          <div key={index} className={`border rounded-lg p-3 ${
                            issue.type === 'error' ? 'bg-red-900/20 border-red-500/30' :
                            issue.type === 'warning' ? 'bg-yellow-900/20 border-yellow-500/30' :
                            'bg-blue-900/20 border-blue-500/30'
                          }`}>
                            <div className="font-medium text-white">{issue.element}</div>
                            <div className="text-sm text-gray-300">{issue.message}</div>
                            {issue.fix && (
                              <div className="text-xs text-gray-400 mt-1">Fix: {issue.fix}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </GlassCard>
          )}

          {/* Browser Testing */}
          {activeTab === 'browser' && (
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <Icon as={Globe} className="mr-2 h-5 w-5" />
                  Browser Compatibility
                </h3>
                <AdvancedButton
                  variant="teal"
                  size="sm"
                  onClick={() => runTest('browser')}
                  loading={isRunning}
                  disabled={isRunning}
                >
                  Test
                </AdvancedButton>
              </div>

              {browserInfo && browserResults && (
                <div className="space-y-4">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400">Current Browser</div>
                    <div className="text-lg font-semibold text-white">
                      {browserInfo.name} {browserInfo.version}
                    </div>
                    <div className="text-sm text-gray-300">
                      {browserInfo.isMobile ? 'Mobile' : browserInfo.isTablet ? 'Tablet' : 'Desktop'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-white">
                      Score: {browserResults.score}/100
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      browserResults.passed 
                        ? 'bg-green-900/30 text-green-300 border border-green-500/30' 
                        : 'bg-red-900/30 text-red-300 border border-red-500/30'
                    }`}>
                      {browserResults.passed ? 'COMPATIBLE' : 'ISSUES'}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(browserResults.features).map(([feature, supported]) => (
                      <div key={feature} className={`rounded-lg p-3 border ${
                        supported 
                          ? 'bg-green-900/20 border-green-500/30' 
                          : 'bg-red-900/20 border-red-500/30'
                      }`}>
                        <div className="text-sm font-medium text-white capitalize">
                          {feature.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className={`text-xs ${
                          supported ? 'text-green-300' : 'text-red-300'
                        }`}>
                          {supported ? 'Supported' : 'Not Supported'}
                        </div>
                      </div>
                    ))}
                  </div>

                  {browserResults.issues.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-white mb-3">Compatibility Issues</h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {browserResults.issues.map((issue, index: number) => (
                          <div key={index} className={`border rounded-lg p-3 ${
                            issue.severity === 'critical' ? 'bg-red-900/20 border-red-500/30' :
                            issue.severity === 'warning' ? 'bg-yellow-900/20 border-yellow-500/30' :
                            'bg-blue-900/20 border-blue-500/30'
                          }`}>
                            <div className="font-medium text-white">{issue.feature}</div>
                            <div className="text-sm text-gray-300">{issue.issue}</div>
                            {issue.workaround && (
                              <div className="text-xs text-gray-400 mt-1">Workaround: {issue.workaround}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </GlassCard>
          )}

          {/* Mobile Testing */}
          {activeTab === 'mobile' && (
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <Icon as={Smartphone} className="mr-2 h-5 w-5" />
                  Mobile Testing
                </h3>
                <AdvancedButton
                  variant="teal"
                  size="sm"
                  onClick={() => runTest('mobile')}
                  loading={isRunning}
                  disabled={isRunning}
                >
                  Test
                </AdvancedButton>
              </div>

              {deviceInfo && mobileResults && (
                <div className="space-y-4">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400">Device Information</div>
                    <div className="text-lg font-semibold text-white">
                      {deviceInfo.isMobile ? 'Mobile' : deviceInfo.isTablet ? 'Tablet' : 'Desktop'}
                    </div>
                    <div className="text-sm text-gray-300">
                      {deviceInfo.viewportWidth} × {deviceInfo.viewportHeight}px
                    </div>
                    <div className="text-sm text-gray-300">
                      {deviceInfo.orientation} • {deviceInfo.pixelRatio}x
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-white">
                      Score: {mobileResults.score}/100
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      mobileResults.passed 
                        ? 'bg-green-900/30 text-green-300 border border-green-500/30' 
                        : 'bg-red-900/30 text-red-300 border border-red-500/30'
                    }`}>
                      {mobileResults.passed ? 'OPTIMIZED' : 'NEEDS WORK'}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(mobileResults.tests).map(([test, passed]) => (
                      <div key={test} className={`rounded-lg p-3 border ${
                        passed 
                          ? 'bg-green-900/20 border-green-500/30' 
                          : 'bg-red-900/20 border-red-500/30'
                      }`}>
                        <div className="text-sm font-medium text-white capitalize">
                          {test.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className={`text-xs ${
                          passed ? 'text-green-300' : 'text-red-300'
                        }`}>
                          {passed ? 'Passed' : 'Failed'}
                        </div>
                      </div>
                    ))}
                  </div>

                  {mobileResults.issues.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-white mb-3">Mobile Issues</h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {mobileResults.issues.map((issue, index: number) => (
                          <div key={index} className={`border rounded-lg p-3 ${
                            issue.severity === 'critical' ? 'bg-red-900/20 border-red-500/30' :
                            issue.severity === 'warning' ? 'bg-yellow-900/20 border-yellow-500/30' :
                            'bg-blue-900/20 border-blue-500/30'
                          }`}>
                            <div className="font-medium text-white">{issue.test}</div>
                            <div className="text-sm text-gray-300">{issue.issue}</div>
                            {issue.fix && (
                              <div className="text-xs text-gray-400 mt-1">Fix: {issue.fix}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </GlassCard>
          )}
        </div>

        {/* Summary */}
        <GlassCard className="mt-8">
          <h3 className="text-xl font-semibold text-white mb-4">Testing Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <div className="flex justify-center">
                <Icon as={Zap} className="h-6 w-6 text-blue-400" />
              </div>
              <div className="text-sm text-gray-300">Performance</div>
              <div className="text-lg font-semibold text-white">
                {performanceMetrics ? 'Monitoring' : 'Not Started'}
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <div className="flex justify-center">
                <Icon as={Accessibility} className="h-6 w-6 text-green-400" />
              </div>
              <div className="text-sm text-gray-300">Accessibility</div>
              <div className="text-lg font-semibold text-white">
                {accessibilityReport ? `${accessibilityReport.score}/100` : 'Not Tested'}
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <div className="flex justify-center">
                <Icon as={Globe} className="h-6 w-6 text-purple-400" />
              </div>
              <div className="text-sm text-gray-300">Browser</div>
              <div className="text-lg font-semibold text-white">
                {browserResults ? `${browserResults.score}/100` : 'Not Tested'}
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <div className="flex justify-center">
                <Icon as={Smartphone} className="h-6 w-6 text-orange-400" />
              </div>
              <div className="text-sm text-gray-300">Mobile</div>
              <div className="text-lg font-semibold text-white">
                {mobileResults ? `${mobileResults.score}/100` : 'Not Tested'}
              </div>
            </div>
          </div>
        </GlassCard>
      </PremiumContainer>
    </div>
  );
}; 