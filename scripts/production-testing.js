#!/usr/bin/env node

/**
 * Production Testing Script
 * Comprehensive testing suite for Phase 5 production deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Test results storage
const testResults = {
  performance: { passed: 0, failed: 0, total: 0 },
  accessibility: { passed: 0, failed: 0, total: 0 },
  browser: { passed: 0, failed: 0, total: 0 },
  mobile: { passed: 0, failed: 0, total: 0 },
  security: { passed: 0, failed: 0, total: 0 },
  build: { passed: 0, failed: 0, total: 0 }
};

// Utility functions
const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const logSection = (title) => {
  console.log('\n' + '='.repeat(60));
  log(`🧪 ${title}`, 'cyan');
  console.log('='.repeat(60));
};

const logTest = (testName, status, details = '') => {
  const statusColor = status === 'PASS' ? 'green' : 'red';
  const statusIcon = status === 'PASS' ? '✅' : '❌';
  log(`${statusIcon} ${testName}: ${status}`, statusColor);
  if (details) {
    log(`   ${details}`, 'yellow');
  }
};

const runCommand = (command, description) => {
  try {
    log(`Running: ${description}`, 'blue');
    const result = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    logTest(description, 'PASS');
    return { success: true, output: result };
  } catch (error) {
    logTest(description, 'FAIL', error.message);
    return { success: false, output: error.message };
  }
};

// Test functions
const runBuildTests = () => {
  logSection('BUILD TESTS');
  
  // TypeScript compilation
  const tsResult = runCommand('npx tsc --noEmit --skipLibCheck', 'TypeScript Compilation');
  testResults.build.total++;
  if (tsResult.success) testResults.build.passed++; else testResults.build.failed++;
  
  // Next.js build
  const buildResult = runCommand('npm run build', 'Next.js Build');
  testResults.build.total++;
  if (buildResult.success) testResults.build.passed++; else testResults.build.failed++;
  
  // Bundle analysis
  const bundleResult = runCommand('npx @next/bundle-analyzer', 'Bundle Analysis');
  testResults.build.total++;
  if (bundleResult.success) testResults.build.passed++; else testResults.build.failed++;
};

const runPerformanceTests = () => {
  logSection('PERFORMANCE TESTS');
  
  // Lighthouse audit
  const lighthouseResult = runCommand(
    'npx lighthouse http://localhost:3000 --output=json --output-path=./lighthouse-report.json',
    'Lighthouse Audit'
  );
  testResults.performance.total++;
  if (lighthouseResult.success) {
    testResults.performance.passed++;
    // Parse lighthouse results
    try {
      const report = JSON.parse(fs.readFileSync('./lighthouse-report.json', 'utf8'));
      const scores = report.lhr.categories;
      log(`   Performance Score: ${Math.round(scores.performance.score * 100)}`, 'green');
      log(`   Accessibility Score: ${Math.round(scores.accessibility.score * 100)}`, 'green');
      log(`   Best Practices Score: ${Math.round(scores['best-practices'].score * 100)}`, 'green');
      log(`   SEO Score: ${Math.round(scores.seo.score * 100)}`, 'green');
    } catch (e) {
      log('   Could not parse Lighthouse report', 'yellow');
    }
  } else {
    testResults.performance.failed++;
  }
  
  // Web Vitals check
  const webVitalsResult = runCommand('npm run test:web-vitals', 'Web Vitals Check');
  testResults.performance.total++;
  if (webVitalsResult.success) testResults.performance.passed++; else testResults.performance.failed++;
  
  // Bundle size check
  const bundleSizeResult = runCommand('npm run analyze', 'Bundle Size Analysis');
  testResults.performance.total++;
  if (bundleSizeResult.success) testResults.performance.passed++; else testResults.performance.failed++;
};

const runSecurityTests = () => {
  logSection('SECURITY TESTS');
  
  // Dependency vulnerability scan
  const auditResult = runCommand('npm audit --audit-level=moderate', 'Dependency Security Audit');
  testResults.security.total++;
  if (auditResult.success) testResults.security.passed++; else testResults.security.failed++;
  
  // OWASP ZAP scan (if available)
  const zapResult = runCommand('npx zaproxy --auto -t http://localhost:3000', 'OWASP ZAP Security Scan');
  testResults.security.total++;
  if (zapResult.success) testResults.security.passed++; else testResults.security.failed++;
  
  // SSL/TLS check
  const sslResult = runCommand('npx ssl-checker https://localhost:3000', 'SSL/TLS Configuration');
  testResults.security.total++;
  if (sslResult.success) testResults.security.passed++; else testResults.security.failed++;
};

const runAccessibilityTests = () => {
  logSection('ACCESSIBILITY TESTS');
  
  // WCAG compliance check
  const wcagResult = runCommand('npx axe-core --exit --dir http://localhost:3000', 'WCAG Compliance Check');
  testResults.accessibility.total++;
  if (wcagResult.success) testResults.accessibility.passed++; else testResults.accessibility.failed++;
  
  // Color contrast check
  const contrastResult = runCommand('npx pa11y http://localhost:3000', 'Color Contrast Analysis');
  testResults.accessibility.total++;
  if (contrastResult.success) testResults.accessibility.passed++; else testResults.accessibility.failed++;
  
  // Screen reader compatibility
  const screenReaderResult = runCommand('npx axe-core --exit --rules=screenreader http://localhost:3000', 'Screen Reader Compatibility');
  testResults.accessibility.total++;
  if (screenReaderResult.success) testResults.accessibility.passed++; else testResults.accessibility.failed++;
};

const runBrowserTests = () => {
  logSection('BROWSER COMPATIBILITY TESTS');
  
  // Cross-browser testing with Playwright
  const playwrightResult = runCommand('npx playwright test --browser=chromium,firefox,webkit', 'Cross-Browser Testing');
  testResults.browser.total++;
  if (playwrightResult.success) testResults.browser.passed++; else testResults.browser.failed++;
  
  // Feature detection
  const featureResult = runCommand('npm run test:features', 'Feature Detection Test');
  testResults.browser.total++;
  if (featureResult.success) testResults.browser.passed++; else testResults.browser.failed++;
  
  // Responsive design test
  const responsiveResult = runCommand('npx playwright test --grep="responsive"', 'Responsive Design Test');
  testResults.browser.total++;
  if (responsiveResult.success) testResults.browser.passed++; else testResults.browser.failed++;
};

const runMobileTests = () => {
  logSection('MOBILE TESTS');
  
  // Mobile device testing
  const mobileResult = runCommand('npx playwright test --device="iPhone 12"', 'Mobile Device Testing');
  testResults.mobile.total++;
  if (mobileResult.success) testResults.mobile.passed++; else testResults.mobile.failed++;
  
  // Touch interaction testing
  const touchResult = runCommand('npx playwright test --grep="touch"', 'Touch Interaction Test');
  testResults.mobile.total++;
  if (touchResult.success) testResults.mobile.passed++; else testResults.mobile.failed++;
  
  // Mobile performance test
  const mobilePerfResult = runCommand('npx lighthouse http://localhost:3000 --preset=mobile', 'Mobile Performance Test');
  testResults.mobile.total++;
  if (mobilePerfResult.success) testResults.mobile.passed++; else testResults.mobile.failed++;
};

const runIntegrationTests = () => {
  logSection('INTEGRATION TESTS');
  
  // API endpoint testing
  const apiResult = runCommand('npm run test:api', 'API Endpoint Testing');
  
  // Database connection test
  const dbResult = runCommand('npm run test:database', 'Database Connection Test');
  
  // Payment integration test
  const paymentResult = runCommand('npm run test:payment', 'Payment Integration Test');
  
  // Email service test
  const emailResult = runCommand('npm run test:email', 'Email Service Test');
  
  // Authentication test
  const authResult = runCommand('npm run test:auth', 'Authentication Test');
};

const generateReport = () => {
  logSection('TEST RESULTS SUMMARY');
  
  const totalTests = Object.values(testResults).reduce((sum, category) => sum + category.total, 0);
  const totalPassed = Object.values(testResults).reduce((sum, category) => sum + category.passed, 0);
  const totalFailed = Object.values(testResults).reduce((sum, category) => sum + category.failed, 0);
  
  log(`Total Tests: ${totalTests}`, 'bright');
  log(`Passed: ${totalPassed}`, 'green');
  log(`Failed: ${totalFailed}`, 'red');
  log(`Success Rate: ${((totalPassed / totalTests) * 100).toFixed(1)}%`, 'cyan');
  
  console.log('\nDetailed Results:');
  Object.entries(testResults).forEach(([category, results]) => {
    const successRate = results.total > 0 ? ((results.passed / results.total) * 100).toFixed(1) : 0;
    const color = successRate >= 80 ? 'green' : successRate >= 60 ? 'yellow' : 'red';
    log(`${category.toUpperCase()}: ${results.passed}/${results.total} (${successRate}%)`, color);
  });
  
  // Generate JSON report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: totalTests,
      passed: totalPassed,
      failed: totalFailed,
      successRate: ((totalPassed / totalTests) * 100).toFixed(1)
    },
    categories: testResults
  };
  
  fs.writeFileSync('./test-report.json', JSON.stringify(report, null, 2));
  log('\n📊 Test report saved to test-report.json', 'cyan');
  
  return totalFailed === 0;
};

// Main execution
const main = async () => {
  log('🚀 Starting Production Testing Suite', 'bright');
  log('Phase 5: Production Deployment - Task 1: Final Testing & Validation', 'cyan');
  
  // Check if development server is running
  try {
    execSync('curl -s -o /dev/null -w "%{http_code}" http://localhost:3000', { stdio: 'pipe' });
    log('✅ Development server is running', 'green');
  } catch (error) {
    log('❌ Development server is not running. Please start with: npm run dev', 'red');
    process.exit(1);
  }
  
  // Run all test suites
  runBuildTests();
  runPerformanceTests();
  runSecurityTests();
  runAccessibilityTests();
  runBrowserTests();
  runMobileTests();
  runIntegrationTests();
  
  // Generate final report
  const allTestsPassed = generateReport();
  
  if (allTestsPassed) {
    log('\n🎉 All tests passed! Ready for production deployment.', 'green');
    process.exit(0);
  } else {
    log('\n⚠️  Some tests failed. Please review and fix issues before deployment.', 'yellow');
    process.exit(1);
  }
};

// Handle script execution
if (require.main === module) {
  main().catch(error => {
    log(`❌ Testing script failed: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { runCommand, log, logSection, logTest }; 