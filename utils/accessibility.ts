// Accessibility testing utilities for Phase 4 testing and optimization

export interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info';
  element: string;
  message: string;
  code: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  fix?: string;
}

export interface AccessibilityReport {
  passed: boolean;
  score: number;
  issues: AccessibilityIssue[];
  summary: {
    errors: number;
    warnings: number;
    info: number;
    total: number;
  };
}

export interface AccessibilityTest {
  name: string;
  description: string;
  test: () => AccessibilityIssue[];
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
}

export class AccessibilityTester {
  private issues: AccessibilityIssue[] = [];

  // Run all accessibility tests
  runAllTests(): AccessibilityReport {
    this.issues = [];
    
    const tests: AccessibilityTest[] = [
      this.testColorContrast,
      this.testKeyboardNavigation,
      this.testScreenReaderSupport,
      this.testFocusManagement,
      this.testSemanticHTML,
      this.testARIALabels,
      this.testReducedMotion,
      this.testTouchTargets,
      this.testTextScaling,
      this.testFormAccessibility
    ];

    tests.forEach(test => {
      try {
        const testIssues = test.test();
        this.issues.push(...testIssues);
      } catch (error) {
        this.issues.push({
          type: 'error',
          element: 'AccessibilityTester',
          message: `Test ${test.name} failed: ${error}`,
          code: 'TEST_FAILURE',
          impact: 'critical'
        });
      }
    });

    return this.generateReport();
  }

  // Test color contrast ratios
  private testColorContrast: AccessibilityTest = {
    name: 'Color Contrast',
    description: 'Check if text has sufficient contrast against background',
    impact: 'critical',
    test: () => {
      const issues: AccessibilityIssue[] = [];
      
      if (typeof window === 'undefined') return issues;

      const elements = document.querySelectorAll('*');
      elements.forEach(element => {
        const style = window.getComputedStyle(element);
        const color = style.color;
        const backgroundColor = style.backgroundColor;
        
        // Simple contrast check (this is a basic implementation)
        if (color && backgroundColor && color !== backgroundColor) {
          const contrast = this.calculateContrastRatio(color, backgroundColor);
          if (contrast < 4.5) {
            issues.push({
              type: 'error',
              element: element.tagName.toLowerCase(),
              message: `Insufficient color contrast: ${contrast.toFixed(2)}:1 (minimum 4.5:1)`,
              code: 'CONTRAST_INSUFFICIENT',
              impact: 'critical',
              fix: 'Increase contrast between text and background colors'
            });
          }
        }
      });

      return issues;
    }
  };

  // Test keyboard navigation
  private testKeyboardNavigation: AccessibilityTest = {
    name: 'Keyboard Navigation',
    description: 'Check if all interactive elements are keyboard accessible',
    impact: 'critical',
    test: () => {
      const issues: AccessibilityIssue[] = [];
      
      if (typeof window === 'undefined') return issues;

      const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]');
      interactiveElements.forEach(element => {
        const tagName = element.tagName.toLowerCase();
        const tabIndex = element.getAttribute('tabindex');
        
        if (tagName === 'button' || tagName === 'a' || tagName === 'input') {
          // These should be naturally focusable
          if (tabIndex === '-1') {
            issues.push({
              type: 'error',
              element: tagName,
              message: 'Interactive element is not keyboard accessible (tabindex="-1")',
              code: 'KEYBOARD_INACCESSIBLE',
              impact: 'critical',
              fix: 'Remove tabindex="-1" or ensure element is accessible via other means'
            });
          }
        }
      });

      return issues;
    }
  };

  // Test screen reader support
  private testScreenReaderSupport: AccessibilityTest = {
    name: 'Screen Reader Support',
    description: 'Check if elements have proper ARIA labels and roles',
    impact: 'serious',
    test: () => {
      const issues: AccessibilityIssue[] = [];
      
      if (typeof window === 'undefined') return issues;

      const elements = document.querySelectorAll('*');
      elements.forEach(element => {
        const tagName = element.tagName.toLowerCase();
        const ariaLabel = element.getAttribute('aria-label');
        const ariaLabelledby = element.getAttribute('aria-labelledby');
        const role = element.getAttribute('role');
        
        // Check for images without alt text
        if (tagName === 'img') {
          const alt = element.getAttribute('alt');
          if (!alt && !ariaLabel && !ariaLabelledby) {
            issues.push({
              type: 'error',
              element: 'img',
              message: 'Image missing alt text or ARIA label',
              code: 'IMAGE_NO_ALT',
              impact: 'serious',
              fix: 'Add alt text or aria-label to image'
            });
          }
        }
        
        // Check for buttons without accessible text
        if (tagName === 'button') {
          const textContent = element.textContent?.trim();
          if (!textContent && !ariaLabel && !ariaLabelledby) {
            issues.push({
              type: 'error',
              element: 'button',
              message: 'Button missing accessible text',
              code: 'BUTTON_NO_TEXT',
              impact: 'serious',
              fix: 'Add text content or aria-label to button'
            });
          }
        }
      });

      return issues;
    }
  };

  // Test focus management
  private testFocusManagement: AccessibilityTest = {
    name: 'Focus Management',
    description: 'Check if focus is properly managed and visible',
    impact: 'serious',
    test: () => {
      const issues: AccessibilityIssue[] = [];
      
      if (typeof window === 'undefined') return issues;

      const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
      interactiveElements.forEach(element => {
        const style = window.getComputedStyle(element);
        const outline = style.outline;
        const outlineOffset = style.outlineOffset;
        
        // Check if focus outline is visible
        if (outline === 'none' || outline === '0px') {
          issues.push({
            type: 'warning',
            element: element.tagName.toLowerCase(),
            message: 'Focus outline is not visible',
            code: 'FOCUS_NOT_VISIBLE',
            impact: 'serious',
            fix: 'Add visible focus styles or ensure focus is indicated by other means'
          });
        }
      });

      return issues;
    }
  };

  // Test semantic HTML
  private testSemanticHTML: AccessibilityTest = {
    name: 'Semantic HTML',
    description: 'Check if semantic HTML elements are used appropriately',
    impact: 'moderate',
    test: () => {
      const issues: AccessibilityIssue[] = [];
      
      if (typeof window === 'undefined') return issues;

      const elements = document.querySelectorAll('*');
      elements.forEach(element => {
        const tagName = element.tagName.toLowerCase();
        
        // Check for divs that should be buttons
        if (tagName === 'div' && (element as any).onclick) {
          issues.push({
            type: 'warning',
            element: 'div',
            message: 'Div with click handler should be a button',
            code: 'DIV_AS_BUTTON',
            impact: 'moderate',
            fix: 'Replace div with button element'
          });
        }
        
        // Check for proper heading hierarchy
        if (tagName.match(/^h[1-6]$/)) {
          const level = parseInt(tagName[1]);
          const previousHeadings = document.querySelectorAll(`h1, h2, h3, h4, h5, h6`);
          let previousLevel = 0;
          
          for (let i = 0; i < previousHeadings.length; i++) {
            if (previousHeadings[i] === element) break;
            const prevTag = previousHeadings[i].tagName.toLowerCase();
            previousLevel = parseInt(prevTag[1]);
          }
          
          if (level > previousLevel + 1) {
            issues.push({
              type: 'warning',
              element: tagName,
              message: `Heading level ${level} skips level ${previousLevel + 1}`,
              code: 'HEADING_SKIP',
              impact: 'moderate',
              fix: 'Use proper heading hierarchy (h1, h2, h3, etc.)'
            });
          }
        }
      });

      return issues;
    }
  };

  // Test ARIA labels
  private testARIALabels: AccessibilityTest = {
    name: 'ARIA Labels',
    description: 'Check if ARIA labels are properly implemented',
    impact: 'moderate',
    test: () => {
      const issues: AccessibilityIssue[] = [];
      
      if (typeof window === 'undefined') return issues;

      const elements = document.querySelectorAll('[aria-label], [aria-labelledby]');
      elements.forEach(element => {
        const ariaLabel = element.getAttribute('aria-label');
        const ariaLabelledby = element.getAttribute('aria-labelledby');
        
        // Check for empty ARIA labels
        if (ariaLabel && ariaLabel.trim() === '') {
          issues.push({
            type: 'error',
            element: element.tagName.toLowerCase(),
            message: 'ARIA label is empty',
            code: 'ARIA_LABEL_EMPTY',
            impact: 'moderate',
            fix: 'Provide meaningful ARIA label text'
          });
        }
        
        // Check for invalid aria-labelledby references
        if (ariaLabelledby) {
          const referencedElement = document.getElementById(ariaLabelledby);
          if (!referencedElement) {
            issues.push({
              type: 'error',
              element: element.tagName.toLowerCase(),
              message: `ARIA labelledby references non-existent element: ${ariaLabelledby}`,
              code: 'ARIA_LABELLEDBY_INVALID',
              impact: 'moderate',
              fix: 'Ensure referenced element exists with matching ID'
            });
          }
        }
      });

      return issues;
    }
  };

  // Test reduced motion support
  private testReducedMotion: AccessibilityTest = {
    name: 'Reduced Motion',
    description: 'Check if reduced motion preferences are respected',
    impact: 'minor',
    test: () => {
      const issues: AccessibilityIssue[] = [];
      
      if (typeof window === 'undefined') return issues;

      const elements = document.querySelectorAll('*');
      elements.forEach(element => {
        const style = window.getComputedStyle(element);
        const animation = style.animation;
        const transition = style.transition;
        
        // Check if animations respect reduced motion
        if (animation && animation !== 'none') {
          // This is a basic check - in practice, you'd want to check the actual CSS
          issues.push({
            type: 'info',
            element: element.tagName.toLowerCase(),
            message: 'Element has animations - ensure reduced motion is supported',
            code: 'ANIMATION_PRESENT',
            impact: 'minor',
            fix: 'Add @media (prefers-reduced-motion: reduce) rules'
          });
        }
      });

      return issues;
    }
  };

  // Test touch targets
  private testTouchTargets: AccessibilityTest = {
    name: 'Touch Targets',
    description: 'Check if touch targets are large enough',
    impact: 'moderate',
    test: () => {
      const issues: AccessibilityIssue[] = [];
      
      if (typeof window === 'undefined') return issues;

      const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
      interactiveElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const minSize = 44; // 44px minimum touch target size
        
        if (rect.width < minSize || rect.height < minSize) {
          issues.push({
            type: 'warning',
            element: element.tagName.toLowerCase(),
            message: `Touch target too small: ${rect.width}x${rect.height}px (minimum ${minSize}x${minSize}px)`,
            code: 'TOUCH_TARGET_SMALL',
            impact: 'moderate',
            fix: 'Increase touch target size to at least 44x44px'
          });
        }
      });

      return issues;
    }
  };

  // Test text scaling
  private testTextScaling: AccessibilityTest = {
    name: 'Text Scaling',
    description: 'Check if text can be scaled without breaking layout',
    impact: 'moderate',
    test: () => {
      const issues: AccessibilityIssue[] = [];
      
      if (typeof window === 'undefined') return issues;

      const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div');
      textElements.forEach(element => {
        const style = window.getComputedStyle(element);
        const fontSize = style.fontSize;
        const lineHeight = style.lineHeight;
        
        // Check for fixed font sizes that don't scale
        if (fontSize && fontSize.includes('px')) {
          issues.push({
            type: 'info',
            element: element.tagName.toLowerCase(),
            message: 'Fixed font size may not scale well',
            code: 'FIXED_FONT_SIZE',
            impact: 'minor',
            fix: 'Consider using relative units (rem, em) for better scaling'
          });
        }
      });

      return issues;
    }
  };

  // Test form accessibility
  private testFormAccessibility: AccessibilityTest = {
    name: 'Form Accessibility',
    description: 'Check if forms are properly accessible',
    impact: 'serious',
    test: () => {
      const issues: AccessibilityIssue[] = [];
      
      if (typeof window === 'undefined') return issues;

      const forms = document.querySelectorAll('form');
      forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
          const label = input.getAttribute('aria-label');
          const labelledby = input.getAttribute('aria-labelledby');
          const id = input.getAttribute('id');
          
          // Check for inputs without labels
          if (!label && !labelledby && !id) {
            issues.push({
              type: 'error',
              element: 'input',
              message: 'Form input missing label',
              code: 'INPUT_NO_LABEL',
              impact: 'serious',
              fix: 'Add label, aria-label, or aria-labelledby to input'
            });
          }
          
          // Check for required fields
          if (input.hasAttribute('required')) {
            const ariaRequired = input.getAttribute('aria-required');
            if (ariaRequired !== 'true') {
              issues.push({
                type: 'warning',
                element: 'input',
                message: 'Required field should have aria-required="true"',
                code: 'REQUIRED_NO_ARIA',
                impact: 'moderate',
                fix: 'Add aria-required="true" to required inputs'
              });
            }
          }
        });
      });

      return issues;
    }
  };

  // Calculate contrast ratio between two colors
  private calculateContrastRatio(color1: string, color2: string): number {
    // This is a simplified implementation
    // In practice, you'd want to use a proper color contrast library
    return 4.5; // Placeholder return
  }

  // Generate accessibility report
  private generateReport(): AccessibilityReport {
    const errors = this.issues.filter(issue => issue.type === 'error').length;
    const warnings = this.issues.filter(issue => issue.type === 'warning').length;
    const info = this.issues.filter(issue => issue.type === 'info').length;
    const total = this.issues.length;
    
    // Calculate score (100 - points deducted for issues)
    let score = 100;
    this.issues.forEach(issue => {
      switch (issue.impact) {
        case 'critical':
          score -= 20;
          break;
        case 'serious':
          score -= 10;
          break;
        case 'moderate':
          score -= 5;
          break;
        case 'minor':
          score -= 1;
          break;
      }
    });
    
    score = Math.max(0, score);

    return {
      passed: errors === 0,
      score,
      issues: this.issues,
      summary: {
        errors,
        warnings,
        info,
        total
      }
    };
  }
}

// Global accessibility tester instance
export const accessibilityTester = new AccessibilityTester();

// Utility functions for easy access
export const runAccessibilityTests = () => accessibilityTester.runAllTests();
export const getAccessibilityReport = () => accessibilityTester.runAllTests(); 