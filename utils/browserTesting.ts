// Cross-browser testing utilities for Phase 4 testing and optimization

export interface BrowserInfo {
  name: string;
  version: string;
  userAgent: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  supportsWebGL: boolean;
  supportsIntersectionObserver: boolean;
  supportsPerformanceObserver: boolean;
  supportsCSSGrid: boolean;
  supportsFlexbox: boolean;
  supportsCSSVariables: boolean;
  supportsES6: boolean;
  supportsAsyncAwait: boolean;
  supportsFetch: boolean;
  supportsServiceWorkers: boolean;
  supportsPWA: boolean;
}

export interface BrowserCompatibilityIssue {
  browser: string;
  version: string;
  feature: string;
  issue: string;
  severity: 'critical' | 'warning' | 'info';
  impact: string;
  workaround?: string;
}

export interface BrowserTestResult {
  browser: BrowserInfo;
  passed: boolean;
  score: number;
  issues: BrowserCompatibilityIssue[];
  features: {
    [key: string]: boolean;
  };
}

export class BrowserTester {
  private browserInfo: BrowserInfo | null = null;
  private issues: BrowserCompatibilityIssue[] = [];

  // Get current browser information
  getBrowserInfo(): BrowserInfo | null {
    if (typeof window === 'undefined') return null;
    if (this.browserInfo) return this.browserInfo;

    const userAgent = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(userAgent);
    const isDesktop = !isMobile && !isTablet;

    // Detect browser and version
    let browserName = 'Unknown';
    let browserVersion = 'Unknown';

    if (userAgent.includes('Chrome')) {
      browserName = 'Chrome';
      browserVersion = this.extractVersion(userAgent, 'Chrome');
    } else if (userAgent.includes('Firefox')) {
      browserName = 'Firefox';
      browserVersion = this.extractVersion(userAgent, 'Firefox');
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      browserName = 'Safari';
      browserVersion = this.extractVersion(userAgent, 'Version');
    } else if (userAgent.includes('Edge')) {
      browserName = 'Edge';
      browserVersion = this.extractVersion(userAgent, 'Edge');
    } else if (userAgent.includes('MSIE') || userAgent.includes('Trident')) {
      browserName = 'Internet Explorer';
      browserVersion = this.extractVersion(userAgent, 'MSIE') || this.extractVersion(userAgent, 'rv');
    }

    this.browserInfo = {
      name: browserName,
      version: browserVersion,
      userAgent,
      isMobile,
      isTablet,
      isDesktop,
      supportsWebGL: this.testWebGL(),
      supportsIntersectionObserver: 'IntersectionObserver' in window,
      supportsPerformanceObserver: 'PerformanceObserver' in window,
      supportsCSSGrid: this.testCSSGrid(),
      supportsFlexbox: this.testFlexbox(),
      supportsCSSVariables: this.testCSSVariables(),
      supportsES6: this.testES6(),
      supportsAsyncAwait: this.testAsyncAwait(),
      supportsFetch: 'fetch' in window,
      supportsServiceWorkers: 'serviceWorker' in navigator,
      supportsPWA: this.testPWA(),
    };

    return this.browserInfo;
  }

  // Run comprehensive browser compatibility tests
  runCompatibilityTests(): BrowserTestResult {
    this.issues = [];
    const browserInfo = this.getBrowserInfo();
    
    if (!browserInfo) {
      return {
        browser: {
          name: 'Unknown',
          version: 'Unknown',
          userAgent: 'Unknown',
          isMobile: false,
          isTablet: false,
          isDesktop: false,
          supportsWebGL: false,
          supportsIntersectionObserver: false,
          supportsPerformanceObserver: false,
          supportsCSSGrid: false,
          supportsFlexbox: false,
          supportsCSSVariables: false,
          supportsES6: false,
          supportsAsyncAwait: false,
          supportsFetch: false,
          supportsServiceWorkers: false,
          supportsPWA: false,
        },
        passed: false,
        score: 0,
        issues: [],
        features: {}
      };
    }

    const features = {
      webgl: browserInfo.supportsWebGL,
      intersectionObserver: browserInfo.supportsIntersectionObserver,
      performanceObserver: browserInfo.supportsPerformanceObserver,
      cssGrid: browserInfo.supportsCSSGrid,
      flexbox: browserInfo.supportsFlexbox,
      cssVariables: browserInfo.supportsCSSVariables,
      es6: browserInfo.supportsES6,
      asyncAwait: browserInfo.supportsAsyncAwait,
      fetch: browserInfo.supportsFetch,
      serviceWorkers: browserInfo.supportsServiceWorkers,
      pwa: browserInfo.supportsPWA,
    };

    // Test critical features
    this.testCriticalFeatures(browserInfo);
    
    // Test animation performance
    this.testAnimationPerformance(browserInfo);
    
    // Test CSS feature support
    this.testCSSFeatures(browserInfo);
    
    // Test JavaScript features
    this.testJavaScriptFeatures(browserInfo);
    
    // Test PWA features
    this.testPWAFeatures(browserInfo);

    const score = this.calculateScore();
    const passed = this.issues.filter(issue => issue.severity === 'critical').length === 0;

    return {
      browser: browserInfo,
      passed,
      score,
      issues: this.issues,
      features
    };
  }

  // Test critical features for the application
  private testCriticalFeatures(browserInfo: BrowserInfo): void {
    // Test Intersection Observer (used for animations)
    if (!browserInfo.supportsIntersectionObserver) {
      this.issues.push({
        browser: browserInfo.name,
        version: browserInfo.version,
        feature: 'IntersectionObserver',
        issue: 'IntersectionObserver not supported',
        severity: 'critical',
        impact: 'Scroll-based animations will not work',
        workaround: 'Use polyfill or fallback to CSS animations'
      });
    }

    // Test Performance Observer (used for performance monitoring)
    if (!browserInfo.supportsPerformanceObserver) {
      this.issues.push({
        browser: browserInfo.name,
        version: browserInfo.version,
        feature: 'PerformanceObserver',
        issue: 'PerformanceObserver not supported',
        severity: 'warning',
        impact: 'Performance monitoring will be limited',
        workaround: 'Use alternative performance APIs'
      });
    }

    // Test CSS Grid (used for layouts)
    if (!browserInfo.supportsCSSGrid) {
      this.issues.push({
        browser: browserInfo.name,
        version: browserInfo.version,
        feature: 'CSS Grid',
        issue: 'CSS Grid not supported',
        severity: 'warning',
        impact: 'Layout may not render correctly',
        workaround: 'Use Flexbox fallbacks'
      });
    }

    // Test CSS Variables (used for theming)
    if (!browserInfo.supportsCSSVariables) {
      this.issues.push({
        browser: browserInfo.name,
        version: browserInfo.version,
        feature: 'CSS Variables',
        issue: 'CSS Variables not supported',
        severity: 'warning',
        impact: 'Theme system may not work properly',
        workaround: 'Use CSS custom properties polyfill'
      });
    }
  }

  // Test animation performance
  private testAnimationPerformance(browserInfo: BrowserInfo): void {
    // Test requestAnimationFrame performance
    const testAnimationPerformance = () => {
      let frameCount = 0;
      let lastTime = performance.now();
      let fps = 60;

      const measureFPS = () => {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) {
          fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
          frameCount = 0;
          lastTime = currentTime;
          
          if (fps < 30) {
            this.issues.push({
              browser: browserInfo.name,
              version: browserInfo.version,
              feature: 'Animation Performance',
              issue: `Low animation frame rate: ${fps} FPS`,
              severity: 'warning',
              impact: 'Animations may appear choppy',
              workaround: 'Reduce animation complexity or disable animations'
            });
          }
        }
        
        requestAnimationFrame(measureFPS);
      };

      requestAnimationFrame(measureFPS);
    };

    if (typeof window !== 'undefined') {
      testAnimationPerformance();
    }
  }

  // Test CSS features
  private testCSSFeatures(browserInfo: BrowserInfo): void {
    // Test backdrop-filter support
    const testBackdropFilter = () => {
      const element = document.createElement('div');
      element.style.backdropFilter = 'blur(10px)';
      const supportsBackdropFilter = element.style.backdropFilter !== '';
      
      if (!supportsBackdropFilter) {
        this.issues.push({
          browser: browserInfo.name,
          version: browserInfo.version,
          feature: 'backdrop-filter',
          issue: 'backdrop-filter not supported',
          severity: 'info',
          impact: 'Glass morphism effects may not render',
          workaround: 'Use background blur alternatives'
        });
      }
    };

    // Test CSS transforms support
    const testCSSTransforms = () => {
      const element = document.createElement('div');
      element.style.transform = 'translate3d(0, 0, 0)';
      const supportsTransforms = element.style.transform !== '';
      
      if (!supportsTransforms) {
        this.issues.push({
          browser: browserInfo.name,
          version: browserInfo.version,
          feature: 'CSS Transforms',
          issue: 'CSS Transforms not supported',
          severity: 'warning',
          impact: 'Animations and transitions may not work',
          workaround: 'Use alternative animation methods'
        });
      }
    };

    if (typeof window !== 'undefined') {
      testBackdropFilter();
      testCSSTransforms();
    }
  }

  // Test JavaScript features
  private testJavaScriptFeatures(browserInfo: BrowserInfo): void {
    // Test ES6 features
    if (!browserInfo.supportsES6) {
      this.issues.push({
        browser: browserInfo.name,
        version: browserInfo.version,
        feature: 'ES6',
        issue: 'ES6 features not supported',
        severity: 'critical',
        impact: 'Application may not function properly',
        workaround: 'Use Babel transpilation'
      });
    }

    // Test async/await
    if (!browserInfo.supportsAsyncAwait) {
      this.issues.push({
        browser: browserInfo.name,
        version: browserInfo.version,
        feature: 'async/await',
        issue: 'async/await not supported',
        severity: 'warning',
        impact: 'Some asynchronous operations may fail',
        workaround: 'Use Promise-based alternatives'
      });
    }

    // Test Fetch API
    if (!browserInfo.supportsFetch) {
      this.issues.push({
        browser: browserInfo.name,
        version: browserInfo.version,
        feature: 'Fetch API',
        issue: 'Fetch API not supported',
        severity: 'warning',
        impact: 'API calls may not work',
        workaround: 'Use XMLHttpRequest or polyfill'
      });
    }
  }

  // Test PWA features
  private testPWAFeatures(browserInfo: BrowserInfo): void {
    if (!browserInfo.supportsServiceWorkers) {
      this.issues.push({
        browser: browserInfo.name,
        version: browserInfo.version,
        feature: 'Service Workers',
        issue: 'Service Workers not supported',
        severity: 'info',
        impact: 'Offline functionality will not work',
        workaround: 'Implement alternative caching strategies'
      });
    }

    if (!browserInfo.supportsPWA) {
      this.issues.push({
        browser: browserInfo.name,
        version: browserInfo.version,
        feature: 'PWA',
        issue: 'PWA features not fully supported',
        severity: 'info',
        impact: 'Progressive Web App features limited',
        workaround: 'Use native app alternatives'
      });
    }
  }

  // Calculate compatibility score
  private calculateScore(): number {
    let score = 100;
    
    this.issues.forEach(issue => {
      switch (issue.severity) {
        case 'critical':
          score -= 20;
          break;
        case 'warning':
          score -= 10;
          break;
        case 'info':
          score -= 5;
          break;
      }
    });
    
    return Math.max(0, score);
  }

  // Helper methods for feature detection
  private extractVersion(userAgent: string, browserName: string): string {
    const regex = new RegExp(`${browserName}\\/(\\d+(\\.\\d+)*)`);
    const match = userAgent.match(regex);
    return match ? match[1] : 'Unknown';
  }

  private testWebGL(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && 
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch {
      return false;
    }
  }

  private testCSSGrid(): boolean {
    if (typeof window === 'undefined') return false;
    
    const element = document.createElement('div');
    element.style.display = 'grid';
    return element.style.display === 'grid';
  }

  private testFlexbox(): boolean {
    if (typeof window === 'undefined') return false;
    
    const element = document.createElement('div');
    element.style.display = 'flex';
    return element.style.display === 'flex';
  }

  private testCSSVariables(): boolean {
    if (typeof window === 'undefined') return false;
    
    const element = document.createElement('div');
    element.style.setProperty('--test', 'value');
    return element.style.getPropertyValue('--test') === 'value';
  }

  private testES6(): boolean {
    try {
      // Test various ES6 features
      const testArrowFunction = () => {};
      const testDestructuring = ({ test }: { test: string }) => test;
      const testTemplateLiteral = `test`;
      const testLet = true;
      const testConst = true;
      
      return true;
    } catch {
      return false;
    }
  }

  private testAsyncAwait(): boolean {
    try {
      // Test async/await support
      const testAsync = async () => {
        await Promise.resolve();
        return true;
      };
      return true;
    } catch {
      return false;
    }
  }

  private testPWA(): boolean {
    if (typeof window === 'undefined') return false;
    
    return 'serviceWorker' in navigator && 
           'PushManager' in window && 
           'Notification' in window;
  }
}

// Global browser tester instance
export const browserTester = new BrowserTester();

// Utility functions for easy access
export const getBrowserInfo = () => browserTester.getBrowserInfo();
export const runBrowserTests = () => browserTester.runCompatibilityTests();
export const checkBrowserCompatibility = () => browserTester.runCompatibilityTests(); 