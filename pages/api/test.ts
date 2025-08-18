import type { NextApiRequest, NextApiResponse } from 'next';
import { runComprehensiveTests as runAllTests, generateTestReport } from '../../utils/testing';

interface TestResponse {
  success: boolean;
  report?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TestResponse>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
    return;
  }

  try {
    // Run all tests
    const testSuite = await runAllTests();
    
    // Generate test report
    const report = generateTestReport(testSuite);
    
    // Log test results
    console.log('Test Suite Results:', {
      name: testSuite.name,
      totalTests: testSuite.totalTests,
      passedTests: testSuite.passedTests,
      failedTests: testSuite.failedTests,
      successRate: Math.round((testSuite.passedTests / testSuite.totalTests) * 100)
    });
    
    res.status(200).json({
      success: true,
      report
    });

  } catch (error) {
    console.error('Test API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during testing'
    });
  }
} 