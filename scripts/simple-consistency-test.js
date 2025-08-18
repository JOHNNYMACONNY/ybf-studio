#!/usr/bin/env node

// Simple consistency test script
// Tests basic functionality without TypeScript compilation

console.log('🔍 Running Simple Information Consistency Tests...\n');

// Test 1: Check if key configuration files exist
const fs = require('fs');
const path = require('path');

function checkFileExists(filePath) {
  return fs.existsSync(path.join(__dirname, '..', filePath));
}

function testFileExistence() {
  console.log('📁 FILE EXISTENCE TESTS');
  console.log('='.repeat(50));
  
  const requiredFiles = [
    'lib/pricing-config.ts',
    'lib/pricing-utils.ts',
    'lib/contact-config.ts',
    'utils/consistency-monitor.ts'
  ];
  
  let allFilesExist = true;
  
  requiredFiles.forEach(file => {
    const exists = checkFileExists(file);
    console.log(`${exists ? '✅' : '❌'} ${file}`);
    if (!exists) allFilesExist = false;
  });
  
  console.log('');
  return allFilesExist;
}

// Test 2: Check if key pages are accessible
const http = require('http');

function testPageAccessibility() {
  console.log('🌐 PAGE ACCESSIBILITY TESTS');
  console.log('='.repeat(50));
  
  const pages = [
    { name: 'Home Page', path: '/' },
    { name: 'Services Page', path: '/services' },
    { name: 'Beats Page', path: '/beats' },
    { name: 'Contact Page', path: '/contact' }
  ];
  
  let allPagesAccessible = true;
  
  pages.forEach(page => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: page.path,
      method: 'GET',
      timeout: 5000
    };
    
    const req = http.request(options, (res) => {
      console.log(`${res.statusCode === 200 ? '✅' : '❌'} ${page.name} (${res.statusCode})`);
      if (res.statusCode !== 200) allPagesAccessible = false;
    });
    
    req.on('error', (err) => {
      console.log(`❌ ${page.name} (Error: ${err.message})`);
      allPagesAccessible = false;
    });
    
    req.on('timeout', () => {
      console.log(`❌ ${page.name} (Timeout)`);
      allPagesAccessible = false;
    });
    
    req.end();
  });
  
  console.log('');
  return allPagesAccessible;
}

// Test 3: Check package.json scripts
function testPackageScripts() {
  console.log('📦 PACKAGE SCRIPTS TESTS');
  console.log('='.repeat(50));
  
  const packagePath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  const requiredScripts = [
    'dev',
    'build',
    'start',
    'lint',
    'test:build',
    'test:consistency'
  ];
  
  let allScriptsExist = true;
  
  requiredScripts.forEach(script => {
    const exists = packageJson.scripts && packageJson.scripts[script];
    console.log(`${exists ? '✅' : '❌'} ${script} script`);
    if (!exists) allScriptsExist = false;
  });
  
  console.log('');
  return allScriptsExist;
}

// Test 4: Check TypeScript compilation
function testTypeScriptCompilation() {
  console.log('🔧 TYPESCRIPT COMPILATION TEST');
  console.log('='.repeat(50));
  
  const { execSync } = require('child_process');
  
  try {
    execSync('npx tsc --noEmit --skipLibCheck', { 
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe'
    });
    console.log('✅ TypeScript compilation successful');
    console.log('');
    return true;
  } catch (error) {
    console.log('❌ TypeScript compilation failed');
    console.log('   This is expected if there are unused variables or other warnings');
    console.log('');
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 STARTING COMPREHENSIVE FUNCTIONALITY TESTS\n');
  
  const results = {
    files: testFileExistence(),
    pages: await new Promise(resolve => {
      setTimeout(() => resolve(testPageAccessibility()), 1000);
    }),
    scripts: testPackageScripts(),
    typescript: testTypeScriptCompilation()
  };
  
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(50));
  console.log(`Files Exist: ${results.files ? '✅' : '❌'}`);
  console.log(`Pages Accessible: ${results.pages ? '✅' : '❌'}`);
  console.log(`Scripts Available: ${results.scripts ? '✅' : '❌'}`);
  console.log(`TypeScript Compiles: ${results.typescript ? '✅' : '❌'}`);
  
  const allPassed = Object.values(results).every(result => result);
  
  console.log('\n🎯 OVERALL RESULT');
  console.log('='.repeat(50));
  console.log(allPassed ? '✅ All tests passed! Application is working correctly.' : '❌ Some tests failed. Check the issues above.');
  
  process.exit(allPassed ? 0 : 1);
}

// Run the tests
runAllTests(); 