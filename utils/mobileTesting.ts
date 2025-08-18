// Mobile testing utilities for Phase 4 testing and optimization

export interface MobileDeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  pixelRatio: number;
  orientation: 'portrait' | 'landscape';
  touchSupport: boolean;
  maxTouchPoints: number;
  userAgent: string;
  platform: string;
}

export interface MobileTestResult {
  device: MobileDeviceInfo;
  passed: boolean;
  score: number;
  issues: MobileIssue[];
  tests: {
    [key: string]: boolean;
  };
}

export interface MobileIssue {
  test: string;
  issue: string;
  severity: 'critical' | 'warning' | 'info';
  impact: string;
  fix?: string;
}

export interface TouchTargetTest {
  element: string;
  width: number;
  height: number;
  minSize: number;
  passed: boolean;
}

export class MobileTester {
  private deviceInfo: MobileDeviceInfo | null = null;
  private issues: MobileIssue[] = [];

  // Get current device information
  getDeviceInfo(): MobileDeviceInfo | null {
    if (typeof window === 'undefined') return null;
    if (this.deviceInfo) return this.deviceInfo;

    const userAgent = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(userAgent);
    const isDesktop = !isMobile && !isTablet;

    this.deviceInfo = {
      isMobile,
      isTablet,
      isDesktop,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      pixelRatio: window.devicePixelRatio || 1,
      orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
      touchSupport: 'ontouchstart' in window,
      maxTouchPoints: navigator.maxTouchPoints || 0,
      userAgent,
      platform: navigator.platform
    };

    return this.deviceInfo;
  }

  // Run comprehensive mobile tests
  runMobileTests(): MobileTestResult {
    this.issues = [];
    const deviceInfo = this.getDeviceInfo();
    
    if (!deviceInfo) {
      return {
        device: {
          isMobile: false,
          isTablet: false,
          isDesktop: true,
          screenWidth: 0,
          screenHeight: 0,
          viewportWidth: 0,
          viewportHeight: 0,
          pixelRatio: 1,
          orientation: 'portrait',
          touchSupport: false,
          maxTouchPoints: 0,
          userAgent: 'Unknown',
          platform: 'Unknown'
        },
        passed: false,
        score: 0,
        issues: [],
        tests: {}
      };
    }

    const tests = {
      responsiveDesign: this.testResponsiveDesign(deviceInfo),
      touchTargets: this.testTouchTargets(deviceInfo),
      touchInteractions: this.testTouchInteractions(deviceInfo),
      performance: this.testMobilePerformance(deviceInfo),
      accessibility: this.testMobileAccessibility(deviceInfo),
      orientation: this.testOrientationSupport(deviceInfo),
      viewport: this.testViewportConfiguration(deviceInfo),
      gestures: this.testGestureSupport(deviceInfo),
      loading: this.testLoadingPerformance(deviceInfo),
      navigation: this.testMobileNavigation(deviceInfo)
    };

    const score = this.calculateScore();
    const passed = this.issues.filter(issue => issue.severity === 'critical').length === 0;

    return {
      device: deviceInfo,
      passed,
      score,
      issues: this.issues,
      tests
    };
  }

  // Test responsive design
  private testResponsiveDesign(deviceInfo: MobileDeviceInfo): boolean {
    const passed = true;
    
    // Check if viewport meta tag is present
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      this.issues.push({
        test: 'Responsive Design',
        issue: 'Viewport meta tag missing',
        severity: 'critical',
        impact: 'Page may not render correctly on mobile devices',
        fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">'
      });
      return false;
    }

    // Check for responsive breakpoints
    const hasResponsiveCSS = this.checkResponsiveCSS();
    if (!hasResponsiveCSS) {
      this.issues.push({
        test: 'Responsive Design',
        issue: 'Responsive CSS breakpoints not detected',
        severity: 'warning',
        impact: 'Layout may not adapt to different screen sizes',
        fix: 'Add responsive CSS breakpoints for mobile devices'
      });
      return false;
    }

    return passed;
  }

  // Test touch targets
  private testTouchTargets(deviceInfo: MobileDeviceInfo): boolean {
    if (!deviceInfo.isMobile && !deviceInfo.isTablet) return true;

    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [role="button"]');
    const minSize = 44; // 44px minimum touch target size
    let allPassed = true;

    interactiveElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      if (width < minSize || height < minSize) {
        this.issues.push({
          test: 'Touch Targets',
          issue: `${element.tagName.toLowerCase()} touch target too small: ${width}x${height}px (minimum ${minSize}x${minSize}px)`,
          severity: 'warning',
          impact: 'Difficult to tap on mobile devices',
          fix: 'Increase touch target size to at least 44x44px'
        });
        allPassed = false;
      }
    });

    return allPassed;
  }

  // Test touch interactions
  private testTouchInteractions(deviceInfo: MobileDeviceInfo): boolean {
    if (!deviceInfo.touchSupport) return true;

    const passed = true;
    
    // Check for touch event handlers
    const hasTouchEvents = this.checkTouchEventSupport();
    if (!hasTouchEvents) {
      this.issues.push({
        test: 'Touch Interactions',
        issue: 'Touch event handlers not implemented',
        severity: 'warning',
        impact: 'Touch interactions may not work properly',
        fix: 'Implement touch event handlers for mobile interactions'
      });
      return false;
    }

    return passed;
  }

  // Test mobile performance
  private testMobilePerformance(deviceInfo: MobileDeviceInfo): boolean {
    const passed = true;
    
    // Check for heavy animations
    const heavyAnimations = this.checkHeavyAnimations();
    if (heavyAnimations) {
      this.issues.push({
        test: 'Mobile Performance',
        issue: 'Heavy animations detected that may impact mobile performance',
        severity: 'warning',
        impact: 'May cause poor performance on mobile devices',
        fix: 'Optimize animations for mobile or provide reduced motion alternatives'
      });
      return false;
    }

    // Check for large images
    const largeImages = this.checkLargeImages();
    if (largeImages) {
      this.issues.push({
        test: 'Mobile Performance',
        issue: 'Large images detected that may impact loading performance',
        severity: 'warning',
        impact: 'Slow loading on mobile networks',
        fix: 'Use responsive images with appropriate sizes for mobile'
      });
      return false;
    }

    return passed;
  }

  // Test mobile accessibility
  private testMobileAccessibility(deviceInfo: MobileDeviceInfo): boolean {
    const passed = true;
    
    // Check for proper focus management on mobile
    const focusManagement = this.checkMobileFocusManagement();
    if (!focusManagement) {
      this.issues.push({
        test: 'Mobile Accessibility',
        issue: 'Focus management not optimized for mobile',
        severity: 'warning',
        impact: 'Poor accessibility experience on mobile devices',
        fix: 'Implement proper focus management for mobile interactions'
      });
      return false;
    }

    // Check for screen reader compatibility
    const screenReaderSupport = this.checkScreenReaderSupport();
    if (!screenReaderSupport) {
      this.issues.push({
        test: 'Mobile Accessibility',
        issue: 'Screen reader support not fully implemented',
        severity: 'warning',
        impact: 'Poor accessibility for users with visual impairments',
        fix: 'Add proper ARIA labels and semantic HTML'
      });
      return false;
    }

    return passed;
  }

  // Test orientation support
  private testOrientationSupport(deviceInfo: MobileDeviceInfo): boolean {
    if (!deviceInfo.isMobile && !deviceInfo.isTablet) return true;

    const passed = true;
    
    // Check if layout adapts to orientation changes
    const orientationSupport = this.checkOrientationSupport();
    if (!orientationSupport) {
      this.issues.push({
        test: 'Orientation Support',
        issue: 'Layout may not adapt properly to orientation changes',
        severity: 'info',
        impact: 'Poor user experience when rotating device',
        fix: 'Implement responsive design that works in both orientations'
      });
      return false;
    }

    return passed;
  }

  // Test viewport configuration
  private testViewportConfiguration(deviceInfo: MobileDeviceInfo): boolean {
    const passed = true;
    
    // Check viewport meta tag configuration
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      const content = viewportMeta.getAttribute('content');
      if (!content?.includes('width=device-width')) {
        this.issues.push({
          test: 'Viewport Configuration',
          issue: 'Viewport meta tag not properly configured',
          severity: 'critical',
          impact: 'Page may not render correctly on mobile devices',
          fix: 'Use <meta name="viewport" content="width=device-width, initial-scale=1">'
        });
        return false;
      }
    }

    return passed;
  }

  // Test gesture support
  private testGestureSupport(deviceInfo: MobileDeviceInfo): boolean {
    if (!deviceInfo.touchSupport) return true;

    const passed = true;
    
    // Check for gesture support
    const gestureSupport = this.checkGestureSupport();
    if (!gestureSupport) {
      this.issues.push({
        test: 'Gesture Support',
        issue: 'Touch gestures not implemented',
        severity: 'info',
        impact: 'Limited interaction options on mobile',
        fix: 'Implement touch gesture handlers for better mobile UX'
      });
      return false;
    }

    return passed;
  }

  // Test loading performance
  private testLoadingPerformance(deviceInfo: MobileDeviceInfo): boolean {
    const passed = true;
    
    // Check for optimized loading
    const loadingOptimization = this.checkLoadingOptimization();
    if (!loadingOptimization) {
      this.issues.push({
        test: 'Loading Performance',
        issue: 'Loading not optimized for mobile networks',
        severity: 'warning',
        impact: 'Slow loading on mobile networks',
        fix: 'Implement lazy loading, code splitting, and resource optimization'
      });
      return false;
    }

    return passed;
  }

  // Test mobile navigation
  private testMobileNavigation(deviceInfo: MobileDeviceInfo): boolean {
    if (!deviceInfo.isMobile && !deviceInfo.isTablet) return true;

    const passed = true;
    
    // Check for mobile-friendly navigation
    const mobileNavigation = this.checkMobileNavigation();
    if (!mobileNavigation) {
      this.issues.push({
        test: 'Mobile Navigation',
        issue: 'Navigation not optimized for mobile devices',
        severity: 'warning',
        impact: 'Poor navigation experience on mobile',
        fix: 'Implement mobile-friendly navigation (hamburger menu, etc.)'
      });
      return false;
    }

    return passed;
  }

  // Helper methods for testing
  private checkResponsiveCSS(): boolean {
    // Check for media queries in stylesheets
    const styleSheets = Array.from(document.styleSheets);
    let hasResponsiveCSS = false;

    styleSheets.forEach(sheet => {
      try {
        const rules = Array.from(sheet.cssRules || sheet.rules);
        rules.forEach(rule => {
          if (rule instanceof CSSMediaRule) {
            const mediaText = rule.conditionText;
            if (mediaText.includes('max-width') || mediaText.includes('min-width')) {
              hasResponsiveCSS = true;
            }
          }
        });
      } catch (e) {
        // CORS error, skip external stylesheets
      }
    });

    return hasResponsiveCSS;
  }

  private checkTouchEventSupport(): boolean {
    // Check if touch events are being used
    const scripts = document.querySelectorAll('script');
    let hasTouchEvents = false;

    scripts.forEach(script => {
      const content = script.textContent || '';
      if (content.includes('touchstart') || content.includes('touchmove') || content.includes('touchend')) {
        hasTouchEvents = true;
      }
    });

    return hasTouchEvents;
  }

  private checkHeavyAnimations(): boolean {
    // Check for potentially heavy animations
    const elements = document.querySelectorAll('*');
    let hasHeavyAnimations = false;

    elements.forEach(element => {
      const style = window.getComputedStyle(element);
      const animation = style.animation;
      const transition = style.transition;

      if (animation && animation !== 'none') {
        // Check for complex animations
        if (animation.includes('transform') && animation.includes('scale')) {
          hasHeavyAnimations = true;
        }
      }
    });

    return hasHeavyAnimations;
  }

  private checkLargeImages(): boolean {
    // Check for large images
    const images = document.querySelectorAll('img');
    let hasLargeImages = false;

    images.forEach(img => {
      const src = img.getAttribute('src');
      if (src && (src.includes('large') || src.includes('high-res'))) {
        hasLargeImages = true;
      }
    });

    return hasLargeImages;
  }

  private checkMobileFocusManagement(): boolean {
    // Check for focus management
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
    let hasFocusManagement = false;

    interactiveElements.forEach(element => {
      if ((element as any).onfocus || (element as any).onblur) {
        hasFocusManagement = true;
      }
    });

    return hasFocusManagement;
  }

  private checkScreenReaderSupport(): boolean {
    // Check for ARIA labels and semantic HTML
    const elements = document.querySelectorAll('*');
    let hasScreenReaderSupport = false;

    elements.forEach(element => {
      const ariaLabel = element.getAttribute('aria-label');
      const ariaLabelledby = element.getAttribute('aria-labelledby');
      const role = element.getAttribute('role');

      if (ariaLabel || ariaLabelledby || role) {
        hasScreenReaderSupport = true;
      }
    });

    return hasScreenReaderSupport;
  }

  private checkOrientationSupport(): boolean {
    // Check for orientation-specific CSS
    const styleSheets = Array.from(document.styleSheets);
    let hasOrientationSupport = false;

    styleSheets.forEach(sheet => {
      try {
        const rules = Array.from(sheet.cssRules || sheet.rules);
        rules.forEach(rule => {
          if (rule instanceof CSSMediaRule) {
            const mediaText = rule.conditionText;
            if (mediaText.includes('orientation')) {
              hasOrientationSupport = true;
            }
          }
        });
      } catch (e) {
        // CORS error, skip external stylesheets
      }
    });

    return hasOrientationSupport;
  }

  private checkGestureSupport(): boolean {
    // Check for gesture support
    const scripts = document.querySelectorAll('script');
    let hasGestureSupport = false;

    scripts.forEach(script => {
      const content = script.textContent || '';
      if (content.includes('swipe') || content.includes('pinch') || content.includes('gesture')) {
        hasGestureSupport = true;
      }
    });

    return hasGestureSupport;
  }

  private checkLoadingOptimization(): boolean {
    // Check for loading optimization
    const scripts = document.querySelectorAll('script');
    let hasLoadingOptimization = false;

    scripts.forEach(script => {
      const async = script.hasAttribute('async');
      const defer = script.hasAttribute('defer');
      if (async || defer) {
        hasLoadingOptimization = true;
      }
    });

    return hasLoadingOptimization;
  }

  private checkMobileNavigation(): boolean {
    // Check for mobile navigation
    const nav = document.querySelector('nav');
    const hasMobileNav = nav && (
      nav.classList.contains('mobile-nav') ||
      nav.querySelector('.hamburger') ||
      nav.querySelector('.mobile-menu')
    );

    return !!hasMobileNav;
  }

  // Calculate mobile test score
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
}

// Global mobile tester instance
export const mobileTester = new MobileTester();

// Utility functions for easy access
export const getDeviceInfo = () => mobileTester.getDeviceInfo();
export const runMobileTests = () => mobileTester.runMobileTests();
export const checkMobileCompatibility = () => mobileTester.runMobileTests(); 