#!/usr/bin/env node

/**
 * AudioServiceApp Monitoring & Analytics Setup
 * Configures post-launch monitoring and analytics
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

console.log('📊 AudioServiceApp Monitoring & Analytics Setup\n');

async function setupMonitoring() {
  try {
    console.log('🔍 Checking current configuration...\n');

    // Check existing configuration
    const nextConfigPath = path.join(__dirname, '../next.config.js');
    const appPath = path.join(__dirname, '../pages/_app.tsx');

    let nextConfig = '';
    let appContent = '';

    if (fs.existsSync(nextConfigPath)) {
      nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
    }

    if (fs.existsSync(appPath)) {
      appContent = fs.readFileSync(appPath, 'utf8');
    }

    console.log('📋 Monitoring Configuration Options:\n');

    // Sentry Error Tracking
    const useSentry = await question('Configure Sentry error tracking? (y/N): ');
    if (useSentry.toLowerCase() === 'y') {
      await setupSentry();
    }

    // Google Analytics
    const useGA = await question('Configure Google Analytics 4? (y/N): ');
    if (useGA.toLowerCase() === 'y') {
      await setupGoogleAnalytics();
    }

    // Web Vitals
    const useWebVitals = await question('Configure Web Vitals monitoring? (y/N): ');
    if (useWebVitals.toLowerCase() === 'y') {
      setupWebVitals();
    }

    // Performance Monitoring
    const usePerformance = await question('Configure performance monitoring? (y/N): ');
    if (usePerformance.toLowerCase() === 'y') {
      setupPerformanceMonitoring();
    }

    console.log('\n✅ Monitoring setup completed!');
    console.log('\n📋 Next Steps:');
    console.log('1. Update your environment variables');
    console.log('2. Deploy to production');
    console.log('3. Test monitoring in production');

  } catch (error) {
    console.error('❌ Monitoring setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

async function setupSentry() {
  console.log('\n🔧 Setting up Sentry error tracking...\n');

  const sentryDSN = await question('Sentry DSN (https://...@sentry.io/...): ');
  const sentryOrg = await question('Sentry Organization: ');
  const sentryProject = await question('Sentry Project: ');

  // Install Sentry
  console.log('📦 Installing Sentry...');
  try {
    require('child_process').execSync('npm install @sentry/nextjs', {
      stdio: 'pipe',
      cwd: path.join(__dirname, '..')
    });
  } catch (error) {
    console.warn('⚠️  Sentry installation failed, please run: npm install @sentry/nextjs');
  }

  // Update next.config.js
  const sentryConfig = `
// Sentry Configuration
import { withSentryConfig } from '@sentry/nextjs';

const moduleExports = {
  // ... existing config
};

export default withSentryConfig(moduleExports, {
  silent: true,
  org: '${sentryOrg}',
  project: '${sentryProject}',
}, {
  silent: true,
  org: '${sentryOrg}',
  project: '${sentryProject}',
});
`;

  const nextConfigPath = path.join(__dirname, '../next.config.js');
  let nextConfig = fs.readFileSync(nextConfigPath, 'utf8');

  // Remove existing Sentry config if present
  nextConfig = nextConfig.replace(/import { withSentryConfig }[\s\S]*?}\);?\s*export default/, '');

  // Add Sentry config
  nextConfig = nextConfig.replace(
    /export default\s+[^;]+;/,
    sentryConfig.trim()
  );

  fs.writeFileSync(nextConfigPath, nextConfig);

  // Create Sentry client configuration
  const sentryClientPath = path.join(__dirname, '../lib/sentry.client.js');
  const sentryClientConfig = `import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});
`;

  fs.writeFileSync(sentryClientPath, sentryClientConfig);

  // Create Sentry server configuration
  const sentryServerPath = path.join(__dirname, '../lib/sentry.server.js');
  const sentryServerConfig = `import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
`;

  fs.writeFileSync(sentryServerPath, sentryServerConfig);

  console.log('✅ Sentry configured successfully!');
  console.log('📝 Add to your environment variables:');
  console.log(`NEXT_PUBLIC_SENTRY_DSN=${sentryDSN}`);
  console.log(`SENTRY_DSN=${sentryDSN}`);
}

async function setupGoogleAnalytics() {
  console.log('\n📊 Setting up Google Analytics 4...\n');

  const gaId = await question('Google Analytics 4 ID (G-XXXXXXXXXX): ');

  // Update _app.tsx with GA
  const appPath = path.join(__dirname, '../pages/_app.tsx');
  let appContent = fs.readFileSync(appPath, 'utf8');

  // Add GA script
  const gaScript = `
  {/* Google Analytics */}
  <Script
    src={\`https://www.googletagmanager.com/gtag/js?id=\${process.env.NEXT_PUBLIC_GA_ID}\`}
    strategy="afterInteractive"
  />
  <Script id="google-analytics" strategy="afterInteractive">
    {\`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '\${process.env.NEXT_PUBLIC_GA_ID}');
    \`}
  </Script>
`;

  // Add imports
  if (!appContent.includes("import Script from 'next/script'")) {
    appContent = appContent.replace(
      "import React",
      "import React\nimport Script from 'next/script'"
    );
  }

  // Add GA script to head
  if (appContent.includes('<Head>')) {
    appContent = appContent.replace(
      /<Head>/,
      `<Head>${gaScript}`
    );
  } else {
    // Add after opening component
    appContent = appContent.replace(
      /return\s*\(/,
      `return (\n${gaScript}`
    );
  }

  fs.writeFileSync(appPath, appContent);

  console.log('✅ Google Analytics configured successfully!');
  console.log('📝 Add to your environment variables:');
  console.log(`NEXT_PUBLIC_GA_ID=${gaId}`);
}

function setupWebVitals() {
  console.log('\n⚡ Setting up Web Vitals monitoring...\n');

  const webVitalsPath = path.join(__dirname, '../lib/web-vitals.js');
  const webVitalsConfig = `import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export function reportWebVitals(metric) {
  // Send to Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.value),
      non_interaction: true,
    });
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vitals:', metric);
  }

  // Send to monitoring service (optional)
  // You can add Sentry, LogRocket, etc. here
}

export function trackWebVitals() {
  if (typeof window !== 'undefined') {
    getCLS(reportWebVitals);
    getFID(reportWebVitals);
    getFCP(reportWebVitals);
    getLCP(reportWebVitals);
    getTTFB(reportWebVitals);
  }
}
`;

  fs.writeFileSync(webVitalsPath, webVitalsConfig);

  // Update _app.tsx to use Web Vitals
  const appPath = path.join(__dirname, '../pages/_app.tsx');
  let appContent = fs.readFileSync(appPath, 'utf8');

  if (!appContent.includes('reportWebVitals')) {
    // Add Web Vitals import
    appContent = appContent.replace(
      "import React",
      "import React\nimport { reportWebVitals } from '../lib/web-vitals'"
    );

    // Add Web Vitals export
    if (appContent.includes('export default')) {
      appContent = appContent.replace(
        'export default',
        'export { reportWebVitals }\n\nexport default'
      );
    }
  }

  fs.writeFileSync(appPath, appContent);

  console.log('✅ Web Vitals configured successfully!');
}

function setupPerformanceMonitoring() {
  console.log('\n🚀 Setting up performance monitoring...\n');

  const performancePath = path.join(__dirname, '../lib/performance.js');
  const performanceConfig = `// Performance monitoring utilities

export function measurePerformance(name, fn) {
  const start = performance.now();
  const result = fn();
  const end = performance.now();

  const duration = end - start;

  // Log performance metrics
  if (process.env.NODE_ENV === 'development') {
    console.log(\`Performance: \${name} took \${duration.toFixed(2)}ms\`);
  }

  // Send to monitoring service
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'performance_metric', {
      event_category: 'Performance',
      event_label: name,
      value: Math.round(duration),
      non_interaction: true,
    });
  }

  return result;
}

export function trackPageLoad() {
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      console.log(\`Page load time: \${loadTime.toFixed(2)}ms\`);

      if (window.gtag) {
        window.gtag('event', 'page_load_time', {
          event_category: 'Performance',
          value: Math.round(loadTime),
          non_interaction: true,
        });
      }
    });
  }
}

export function monitorResourceLoading() {
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 1000) { // Log slow resources
            console.warn('Slow resource:', entry.name, entry.duration + 'ms');
          }
        }
      });

      observer.observe({ entryTypes: ['resource'] });
    } catch (error) {
      console.warn('Performance monitoring not supported');
    }
  }
}
`;

  fs.writeFileSync(performancePath, performanceConfig);

  console.log('✅ Performance monitoring configured successfully!');
}

setupMonitoring();


