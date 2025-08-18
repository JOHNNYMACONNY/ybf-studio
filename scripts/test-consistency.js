#!/usr/bin/env node

// Test script for information consistency
// Runs the consistency monitoring system and reports results

console.log('🔍 Running Information Consistency Tests...\n');

async function runConsistencyTests() {
  try {
    // Import the consistency monitor dynamically
    const { ConsistencyMonitor } = await import('../utils/consistency-monitor.js');
    
    // Run full consistency check
    const report = ConsistencyMonitor.generateReport();
    
    console.log('📊 CONSISTENCY REPORT');
    console.log('='.repeat(50));
    console.log(report.summary);
    console.log('');
    
    if (report.totalIssues > 0) {
      console.log('📋 DETAILED ISSUES');
      console.log('='.repeat(50));
      
      if (report.highPriority > 0) {
        console.log('\n🚨 HIGH PRIORITY ISSUES:');
        report.issues
          .filter(i => i.severity === 'high')
          .forEach((issue, index) => {
            console.log(`${index + 1}. ${issue.message}`);
            console.log(`   Location: ${issue.location}`);
            if (issue.suggestion) {
              console.log(`   Suggestion: ${issue.suggestion}`);
            }
            console.log('');
          });
      }
      
      if (report.mediumPriority > 0) {
        console.log('\n⚠️ MEDIUM PRIORITY ISSUES:');
        report.issues
          .filter(i => i.severity === 'medium')
          .forEach((issue, index) => {
            console.log(`${index + 1}. ${issue.message}`);
            console.log(`   Location: ${issue.location}`);
            if (issue.suggestion) {
              console.log(`   Suggestion: ${issue.suggestion}`);
            }
            console.log('');
          });
      }
      
      if (report.lowPriority > 0) {
        console.log('\nℹ️ LOW PRIORITY ISSUES:');
        report.issues
          .filter(i => i.severity === 'low')
          .forEach((issue, index) => {
            console.log(`${index + 1}. ${issue.message}`);
            console.log(`   Location: ${issue.location}`);
            if (issue.suggestion) {
              console.log(`   Suggestion: ${issue.suggestion}`);
            }
            console.log('');
          });
      }
    }
    
    // Configuration validation
    const isValid = ConsistencyMonitor.validateConfiguration();
    console.log('✅ CONFIGURATION STATUS');
    console.log('='.repeat(50));
    console.log(isValid ? '✅ Configuration is valid' : '❌ Configuration has critical issues');
    
    // Exit with appropriate code
    process.exit(isValid ? 0 : 1);
    
  } catch (error) {
    console.error('❌ Error running consistency tests:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the tests
runConsistencyTests(); 