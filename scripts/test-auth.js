const https = require('https');
const http = require('http');

async function testEndpoint(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    }).on('error', reject);
  });
}

async function runTests() {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  
  console.log('🔍 Testing Authentication Setup...\n');
  
  try {
    // Test 1: Debug endpoint
    console.log('1. Testing auth debug endpoint...');
    const debugResult = await testEndpoint(`${baseUrl}/api/auth/debug`);
    console.log('   Status:', debugResult.status);
    console.log('   Environment check:', debugResult.data.environment);
    
    // Test 2: NextAuth endpoint
    console.log('\n2. Testing NextAuth endpoint...');
    const authResult = await testEndpoint(`${baseUrl}/api/auth/providers`);
    console.log('   Status:', authResult.status);
    
    // Test 3: Admin login page
    console.log('\n3. Testing admin login page...');
    const loginResult = await testEndpoint(`${baseUrl}/admin/login`);
    console.log('   Status:', loginResult.status);
    
    console.log('\n✅ Authentication tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

runTests();
