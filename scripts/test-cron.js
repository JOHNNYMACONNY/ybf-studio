#!/usr/bin/env node

/**
 * Test script for the 24-hour reminder cron job
 * Run this to verify the endpoint works before deploying
 */

const https = require('https');
const http = require('http');

// Configuration
const CRON_SECRET = 'K8mN2pQ9vX7wR4tY1uI6oP3aZ5sD8fG2hJ4kL9mN';
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'; // Change to your production URL
const ENDPOINT = '/api/cron/24h-reminders';

function makeRequest(url, options) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.request(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: jsonData
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.write(options.body || '');
    req.end();
  });
}

async function testCronJob() {
  console.log('🧪 Testing 24-hour reminder cron job...\n');
  
  const url = `${BASE_URL}${ENDPOINT}`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CRON_SECRET}`,
      'User-Agent': 'CronTest/1.0'
    }
  };
  
  try {
    console.log(`📍 Testing endpoint: ${url}`);
    console.log(`🔑 Using secret: ${CRON_SECRET.substring(0, 8)}...`);
    console.log('');
    
    const response = await makeRequest(url, options);
    
    console.log('📊 Response:');
    console.log(`   Status: ${response.statusCode}`);
    console.log(`   Headers:`, response.headers);
    console.log(`   Data:`, JSON.stringify(response.data, null, 2));
    
    if (response.statusCode === 200) {
      console.log('\n✅ SUCCESS: Cron job endpoint is working correctly!');
      console.log(`   Emails sent: ${response.data.emailsSent || 0}`);
      console.log(`   Errors: ${response.data.errors || 0}`);
      console.log(`   Total processed: ${response.data.totalProcessed || 0}`);
    } else {
      console.log('\n❌ FAILED: Cron job endpoint returned an error status');
    }
    
  } catch (error) {
    console.error('\n💥 ERROR: Failed to test cron job endpoint');
    console.error('   Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 TIP: Make sure your server is running');
      console.log('   For local testing: npm run dev');
      console.log('   For production: Check your deployment');
    }
  }
}

// Run the test
if (require.main === module) {
  testCronJob();
}

module.exports = { testCronJob };


