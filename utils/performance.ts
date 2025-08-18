// Performance monitoring utilities for Phase 4 testing and optimization

export interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
  memoryUsage?: number;
  animationFrameRate: number;
}

export interface PerformanceThresholds {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
  animationFrameRate: number;
}

// Default performance thresholds (Web Vitals standards)
export const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  loadTime: 3000, // 3 seconds
  firstContentfulPaint: 1800, // 1.8 seconds
  largestContentfulPaint: 2500, // 2.5 seconds
  cumulativeLayoutShift: 0.1, // 0.1
  firstInputDelay: 100, // 100ms
  timeToInteractive: 3800, // 3.8 seconds
  animationFrameRate: 55, // 55 FPS minimum
};

export class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private observers: PerformanceObserver[] = [];
  private thresholds: PerformanceThresholds;

  constructor(thresholds: PerformanceThresholds = DEFAULT_THRESHOLDS) {
    this.thresholds = thresholds;
  }

  // Start monitoring all performance metrics
  startMonitoring(): void {
    if (typeof window === 'undefined') return;

    this.observeWebVitals();
    this.observeAnimationPerformance();
    this.observeMemoryUsage();
  }

  // Stop monitoring and cleanup
  stopMonitoring(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }

  // Get current performance metrics
  getCurrentMetrics(): PerformanceMetrics | null {
    if (typeof window === 'undefined') return null;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (!navigation) return null;

    return {
      loadTime: navigation.loadEventEnd - navigation.loadEventStart,
      firstContentfulPaint: this.getFirstContentfulPaint(),
      largestContentfulPaint: this.getLargestContentfulPaint(),
      cumulativeLayoutShift: this.getCumulativeLayoutShift(),
      firstInputDelay: this.getFirstInputDelay(),
      timeToInteractive: navigation.domInteractive - navigation.fetchStart,
      memoryUsage: this.getMemoryUsage(),
      animationFrameRate: this.getAnimationFrameRate(),
    };
  }

  // Get all recorded metrics
  getAllMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  // Check if current performance meets thresholds
  checkPerformance(): { passed: boolean; issues: string[] } {
    const current = this.getCurrentMetrics();
    if (!current) return { passed: false, issues: ['Unable to measure performance'] };

    const issues: string[] = [];

    if (current.loadTime > this.thresholds.loadTime) {
      issues.push(`Load time (${current.loadTime}ms) exceeds threshold (${this.thresholds.loadTime}ms)`);
    }

    if (current.firstContentfulPaint > this.thresholds.firstContentfulPaint) {
      issues.push(`FCP (${current.firstContentfulPaint}ms) exceeds threshold (${this.thresholds.firstContentfulPaint}ms)`);
    }

    if (current.largestContentfulPaint > this.thresholds.largestContentfulPaint) {
      issues.push(`LCP (${current.largestContentfulPaint}ms) exceeds threshold (${this.thresholds.largestContentfulPaint}ms)`);
    }

    if (current.cumulativeLayoutShift > this.thresholds.cumulativeLayoutShift) {
      issues.push(`CLS (${current.cumulativeLayoutShift}) exceeds threshold (${this.thresholds.cumulativeLayoutShift})`);
    }

    if (current.firstInputDelay > this.thresholds.firstInputDelay) {
      issues.push(`FID (${current.firstInputDelay}ms) exceeds threshold (${this.thresholds.firstInputDelay}ms)`);
    }

    if (current.timeToInteractive > this.thresholds.timeToInteractive) {
      issues.push(`TTI (${current.timeToInteractive}ms) exceeds threshold (${this.thresholds.timeToInteractive}ms)`);
    }

    if (current.animationFrameRate < this.thresholds.animationFrameRate) {
      issues.push(`Animation FPS (${current.animationFrameRate}) below threshold (${this.thresholds.animationFrameRate})`);
    }

    return {
      passed: issues.length === 0,
      issues
    };
  }

  // Observe Web Vitals
  private observeWebVitals(): void {
    if (typeof window === 'undefined') return;

    // First Contentful Paint
    if ('PerformanceObserver' in window) {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcp = entries[entries.length - 1];
        this.metrics.push({
          ...this.getCurrentMetrics()!,
          firstContentfulPaint: fcp.startTime
        });
      });
      fcpObserver.observe({ entryTypes: ['paint'] });
      this.observers.push(fcpObserver);
    }

    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lcp = entries[entries.length - 1];
        this.metrics.push({
          ...this.getCurrentMetrics()!,
          largestContentfulPaint: lcp.startTime
        });
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);
    }

    // Cumulative Layout Shift
    if ('PerformanceObserver' in window) {
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        this.metrics.push({
          ...this.getCurrentMetrics()!,
          cumulativeLayoutShift: clsValue
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    }

    // First Input Delay
    if ('PerformanceObserver' in window) {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fid = entries[entries.length - 1];
        this.metrics.push({
          ...this.getCurrentMetrics()!,
          firstInputDelay: (fid as any).processingStart - fid.startTime
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);
    }
  }

  // Observe animation performance
  private observeAnimationPerformance(): void {
    if (typeof window === 'undefined') return;

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
        
        this.metrics.push({
          ...this.getCurrentMetrics()!,
          animationFrameRate: fps
        });
      }
      
      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);
  }

  // Observe memory usage (if available)
  private observeMemoryUsage(): void {
    if (typeof window === 'undefined' || !('memory' in performance)) return;

    const memoryObserver = new PerformanceObserver(() => {
      const memory = (performance as any).memory;
      if (memory) {
        this.metrics.push({
          ...this.getCurrentMetrics()!,
          memoryUsage: memory.usedJSHeapSize
        });
      }
    });

    // Monitor memory usage every 5 seconds
    setInterval(() => {
      const memory = (performance as any).memory;
      if (memory) {
        this.metrics.push({
          ...this.getCurrentMetrics()!,
          memoryUsage: memory.usedJSHeapSize
        });
      }
    }, 5000);
  }

  // Helper methods to get specific metrics
  private getFirstContentfulPaint(): number {
    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return fcpEntry ? fcpEntry.startTime : 0;
  }

  private getLargestContentfulPaint(): number {
    const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
    const lcpEntry = lcpEntries[lcpEntries.length - 1];
    return lcpEntry ? lcpEntry.startTime : 0;
  }

  private getCumulativeLayoutShift(): number {
    let clsValue = 0;
    const clsEntries = performance.getEntriesByType('layout-shift');
    
    for (const entry of clsEntries) {
      if (!(entry as any).hadRecentInput) {
        clsValue += (entry as any).value;
      }
    }
    
    return clsValue;
  }

  private getFirstInputDelay(): number {
    const fidEntries = performance.getEntriesByType('first-input');
    const fidEntry = fidEntries[fidEntries.length - 1];
    return fidEntry ? (fidEntry as any).processingStart - fidEntry.startTime : 0;
  }

  private getMemoryUsage(): number | undefined {
    if (typeof window === 'undefined' || !('memory' in performance)) return undefined;
    return (performance as any).memory?.usedJSHeapSize;
  }

  private getAnimationFrameRate(): number {
    // Return the last measured FPS or default to 60
    const lastMetric = this.metrics[this.metrics.length - 1];
    return lastMetric?.animationFrameRate || 60;
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Utility functions for easy access
export const startPerformanceMonitoring = () => performanceMonitor.startMonitoring();
export const stopPerformanceMonitoring = () => performanceMonitor.stopMonitoring();
export const getPerformanceMetrics = () => performanceMonitor.getCurrentMetrics();
export const checkPerformance = () => performanceMonitor.checkPerformance();
export const getAllPerformanceMetrics = () => performanceMonitor.getAllMetrics(); 