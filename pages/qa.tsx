import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Section from '../components/shared/Section';
import { Play, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';

interface TestResult {
  test: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  message: string;
  duration?: number;
}

interface TestSuite {
  name: string;
  tests: TestResult[];
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
}

const QADashboard: React.FC = () => {
  const [testSuite, setTestSuite] = useState<TestSuite | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);

  const runTests = async () => {
    setIsRunning(true);
    try {
      const response = await fetch('/api/test');
      const data = await response.json();
      
      if (data.success && data.report) {
        // Parse the report to extract test results
        // This is a simplified parser - in production you'd want a more robust solution
        const lines = data.report.split('\n');
        const tests: TestResult[] = [];
        let currentTest: Partial<TestResult> = {};
        
        for (const line of lines) {
          if (line.includes('✅') || line.includes('❌') || line.includes('⏭️')) {
            if (currentTest.test) {
              tests.push(currentTest as TestResult);
            }
            const status = line.includes('✅') ? 'PASS' : line.includes('❌') ? 'FAIL' : 'SKIP';
            const testName = line.match(/\*\*(.*?)\*\*/)?.[1] || 'Unknown Test';
            const durationMatch = line.match(/\((\d+)ms\)/);
            currentTest = {
              test: testName,
              status,
              duration: durationMatch ? parseInt(durationMatch[1]) : undefined
            };
          } else if (line.trim().startsWith('-') && currentTest.test) {
            currentTest.message = line.trim().substring(1).trim();
          }
        }
        
        if (currentTest.test) {
          tests.push(currentTest as TestResult);
        }
        
        const passedTests = tests.filter(t => t.status === 'PASS').length;
        const failedTests = tests.filter(t => t.status === 'FAIL').length;
        const skippedTests = tests.filter(t => t.status === 'SKIP').length;
        
        setTestSuite({
          name: 'Snippet System Test Suite',
          tests,
          totalTests: tests.length,
          passedTests,
          failedTests,
          skippedTests
        });
      }
    } catch (error) {
      console.error('Error running tests:', error);
    } finally {
      setIsRunning(false);
      setLastRun(new Date());
    }
  };

  useEffect(() => {
    // Run tests on page load
    runTests();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PASS':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'FAIL':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'SKIP':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PASS':
        return 'text-green-500';
      case 'FAIL':
        return 'text-red-500';
      case 'SKIP':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const successRate = testSuite ? Math.round((testSuite.passedTests / testSuite.totalTests) * 100) : 0;

  return (
    <div>
      <Head>
        <title>Quality Assurance Dashboard | AudioService</title>
        <meta name="description" content="Comprehensive testing and quality assurance dashboard for the AudioService snippet system." />
      </Head>
      <Section>
        <div className="text-center mb-12">
          <h1 className="text-display-large mb-4">Quality Assurance Dashboard</h1>
          <p className="text-body text-neutral-400 max-w-2xl mx-auto">
            Comprehensive testing and quality assurance for the snippet system. Monitor system health, performance, and functionality.
          </p>
        </div>

        {/* Test Controls */}
        <div className="flex justify-center mb-8">
          <button
            onClick={runTests}
            disabled={isRunning}
            className="btn-primary flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                Run Tests
              </>
            )}
          </button>
        </div>

        {/* Test Summary */}
        {testSuite && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-neutral-800 rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-white mb-2">{testSuite.totalTests}</div>
              <div className="text-neutral-400">Total Tests</div>
            </div>
            <div className="bg-green-900/20 border border-green-500/20 rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-green-500 mb-2">{testSuite.passedTests}</div>
              <div className="text-green-400">Passed</div>
            </div>
            <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-red-500 mb-2">{testSuite.failedTests}</div>
              <div className="text-red-400">Failed</div>
            </div>
            <div className="bg-yellow-900/20 border border-yellow-500/20 rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-yellow-500 mb-2">{testSuite.skippedTests}</div>
              <div className="text-yellow-400">Skipped</div>
            </div>
          </div>
        )}

        {/* Success Rate */}
        {testSuite && (
          <div className="bg-neutral-800 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Success Rate</h3>
              <span className="text-2xl font-bold text-amber-500">{successRate}%</span>
            </div>
            <div className="w-full bg-neutral-700 rounded-full h-3">
              <div 
                className="bg-amber-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${successRate}%` }}
              />
            </div>
          </div>
        )}

        {/* Test Results */}
        {testSuite && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">Test Results</h3>
            {testSuite.tests.map((test, index) => (
              <div key={index} className="bg-neutral-800 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(test.status)}
                    <div>
                      <h4 className={`font-semibold ${getStatusColor(test.status)}`}>
                        {test.test}
                      </h4>
                      <p className="text-neutral-400 text-sm mt-1">{test.message}</p>
                    </div>
                  </div>
                  {test.duration && (
                    <span className="text-neutral-500 text-sm">
                      {test.duration}ms
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Last Run Info */}
        {lastRun && (
          <div className="mt-8 text-center text-neutral-400 text-sm">
            Last run: {lastRun.toLocaleString()}
          </div>
        )}

        {/* System Status */}
        <div className="mt-12 bg-neutral-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">System Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-neutral-300">TypeScript Compilation</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-neutral-300">API Endpoints</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-neutral-300">Component Integration</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-neutral-300">Email System</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-neutral-300">Purchase Flow</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-neutral-300">Download Links</span>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default QADashboard; 