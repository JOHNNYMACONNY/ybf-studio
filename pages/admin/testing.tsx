import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw, 
  AlertTriangle,
  Database,
  Shield,
  Zap,
  Monitor,
  FileText,
  Eye,
  Download,
  Settings
} from 'lucide-react';
import { 
  runComprehensiveTests, 
  generateTestReport,
  TestSuite
} from '../../utils/testing';

const AdminTestingPage: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestSuite | null>(null);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [testReport, setTestReport] = useState<string>('');
  const [activeTab, setActiveTab] = useState('overview');

  const runTests = async () => {
    setIsRunning(true);
    setCurrentTest('Initializing test suite...');
    
    try {
      const results = await runComprehensiveTests();
      setTestResults(results);
      
      // Generate test report
      const report = generateTestReport(results);
      setTestReport(report);
      
      setCurrentTest('Tests completed!');
    } catch (error) {
      console.error('Test execution failed:', error);
      setCurrentTest('Test execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  const downloadReport = () => {
    if (!testReport) return;
    
    const blob = new Blob([testReport], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-report-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PASS': return 'text-green-500';
      case 'FAIL': return 'text-red-500';
      case 'SKIP': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PASS': return <CheckCircle className="h-4 w-4" />;
      case 'FAIL': return <XCircle className="h-4 w-4" />;
      case 'SKIP': return <Clock className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Monitor },
    { id: 'results', name: 'Test Results', icon: FileText },
    { id: 'report', name: 'Test Report', icon: Download },
    { id: 'ui', name: 'UI Testing', icon: Eye },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Testing & Quality Assurance</h1>
          <div className="flex gap-3">
            <button
              onClick={runTests}
              disabled={isRunning}
              className="btn-primary flex items-center gap-2"
            >
              {isRunning ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {isRunning ? 'Running Tests...' : 'Run All Tests'}
            </button>
            {testReport && (
              <button
                onClick={downloadReport}
                className="btn-secondary flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Report
              </button>
            )}
          </div>
        </div>

        {/* Current Test Status */}
        {isRunning && (
          <div className="card-base">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-5 w-5 animate-spin text-amber" />
              <div>
                <p className="font-medium">Running Tests</p>
                <p className="text-sm text-neutral-400">{currentTest}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-neutral-700">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-amber text-amber'
                      : 'border-transparent text-neutral-400 hover:text-neutral-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card-base">
                  <div className="flex items-center gap-3">
                    <Database className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-sm text-neutral-400">Database Tests</p>
                      <p className="text-2xl font-bold">
                        {testResults ? testResults.tests.filter(t => t.testName.includes('Database')).length : 0}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="card-base">
                  <div className="flex items-center gap-3">
                    <Shield className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-sm text-neutral-400">Security Tests</p>
                      <p className="text-2xl font-bold">
                        {testResults ? testResults.tests.filter(t => t.testName.includes('Authentication')).length : 0}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="card-base">
                  <div className="flex items-center gap-3">
                    <Zap className="h-8 w-8 text-amber" />
                    <div>
                      <p className="text-sm text-neutral-400">Performance Tests</p>
                      <p className="text-2xl font-bold">
                        {testResults ? testResults.tests.filter(t => t.testName.includes('Performance')).length : 0}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="card-base">
                  <div className="flex items-center gap-3">
                    <Monitor className="h-8 w-8 text-purple-500" />
                    <div>
                      <p className="text-sm text-neutral-400">API Tests</p>
                      <p className="text-2xl font-bold">
                        {testResults ? testResults.tests.filter(t => t.testName.includes('GET') || t.testName.includes('POST')).length : 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Test Summary */}
              {testResults && (
                <div className="card-base">
                  <h3 className="text-lg font-medium mb-4">Test Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-500">{testResults.passedTests}</p>
                      <p className="text-sm text-neutral-400">Passed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-red-500">{testResults.failedTests}</p>
                      <p className="text-sm text-neutral-400">Failed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-yellow-500">{testResults.skippedTests}</p>
                      <p className="text-sm text-neutral-400">Skipped</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-500">{testResults.duration}ms</p>
                      <p className="text-sm text-neutral-400">Duration</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Test Categories */}
              <div className="card-base">
                <h3 className="text-lg font-medium mb-4">Quick Test Categories</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">Automated Tests</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Database connection and operations
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        API endpoint functionality
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Authentication and authorization
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Performance and response times
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Error handling and edge cases
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">Manual Tests</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        Responsive design across devices
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        Accessibility compliance
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        User interface usability
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        Cross-browser compatibility
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        End-to-end user workflows
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Test Results Tab */}
          {activeTab === 'results' && testResults && (
            <div className="space-y-6">
              <div className="card-base">
                <h3 className="text-lg font-medium mb-4">Detailed Test Results</h3>
                <div className="space-y-3">
                  {testResults.tests.map((test, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={getStatusColor(test.status)}>
                          {getStatusIcon(test.status)}
                        </div>
                        <div>
                          <p className="font-medium">{test.testName}</p>
                          <p className="text-sm text-neutral-400">{test.message}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {test.duration && (
                          <p className="text-sm text-neutral-400">{test.duration}ms</p>
                        )}
                        <p className={`text-sm ${getStatusColor(test.status)}`}>
                          {test.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Test Report Tab */}
          {activeTab === 'report' && testReport && (
            <div className="space-y-6">
              <div className="card-base">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Test Report</h3>
                  <button
                    onClick={downloadReport}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Report
                  </button>
                </div>
                <div className="bg-neutral-900 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <pre className="text-sm whitespace-pre-wrap">{testReport}</pre>
                </div>
              </div>
            </div>
          )}

          {/* UI Testing Tab */}
          {activeTab === 'ui' && (
            <div className="space-y-6">
              <div className="card-base">
                <h3 className="text-lg font-medium mb-4">UI/UX Testing Checklist</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Responsive Design</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        Mobile layout (375px width)
                      </li>
                      <li className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        Tablet layout (768px width)
                      </li>
                      <li className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        Desktop layout (1024px width)
                      </li>
                      <li className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        Large desktop (1440px width)
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Accessibility</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        Color contrast ratios
                      </li>
                      <li className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        Keyboard navigation
                      </li>
                      <li className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        Screen reader compatibility
                      </li>
                      <li className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        Focus indicators
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="card-base">
                <h3 className="text-lg font-medium mb-4">User Experience Testing</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Loading States</h4>
                    <ul className="space-y-1 text-sm text-neutral-400">
                      <li>• All pages show loading indicators</li>
                      <li>• Forms display loading states during submission</li>
                      <li>• Data tables show skeleton loaders</li>
                      <li>• Modal dialogs have proper loading states</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Error Handling</h4>
                    <ul className="space-y-1 text-sm text-neutral-400">
                      <li>• Form validation errors are clear and helpful</li>
                      <li>• API errors display user-friendly messages</li>
                      <li>• Network errors show retry options</li>
                      <li>• 404 and 500 pages are properly styled</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Success Feedback</h4>
                    <ul className="space-y-1 text-sm text-neutral-400">
                      <li>• Success messages appear after actions</li>
                      <li>• Toast notifications are properly positioned</li>
                      <li>• Form submissions show confirmation</li>
                      <li>• Data updates reflect immediately</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="card-base">
                <h3 className="text-lg font-medium mb-4">Cross-Browser Testing</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['Chrome', 'Firefox', 'Safari', 'Edge'].map((browser) => (
                    <div key={browser} className="text-center">
                      <div className="w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Settings className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-medium">{browser}</p>
                      <p className="text-xs text-neutral-400">Test manually</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminTestingPage; 