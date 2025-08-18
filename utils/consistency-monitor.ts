// Consistency monitoring system
// Validates pricing and contact information consistency across the application

import { SERVICE_PACKAGES, BEAT_LICENSES } from '../lib/pricing-config';
import { CONTACT_INFO, SOCIAL_MEDIA } from '../lib/contact-config';

export interface ConsistencyIssue {
  type: 'pricing' | 'contact' | 'content';
  severity: 'low' | 'medium' | 'high';
  message: string;
  location: string;
  suggestion?: string;
}

export interface ConsistencyReport {
  timestamp: string;
  totalIssues: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
  issues: ConsistencyIssue[];
  summary: string;
}

export class ConsistencyMonitor {
  static checkPricingConsistency(): ConsistencyIssue[] {
    const issues: ConsistencyIssue[] = [];
    
    // Check for duplicate service IDs
    const serviceIds = SERVICE_PACKAGES.map(pkg => pkg.id);
    const duplicateServiceIds = serviceIds.filter((id, index) => serviceIds.indexOf(id) !== index);
    
    if (duplicateServiceIds.length > 0) {
      issues.push({
        type: 'pricing',
        severity: 'high',
        message: `Duplicate service IDs found: ${duplicateServiceIds.join(', ')}`,
        location: 'lib/pricing-config.ts',
        suggestion: 'Ensure each service package has a unique ID'
      });
    }
    
    // Check for duplicate license IDs
    const licenseIds = BEAT_LICENSES.map(license => license.id);
    const duplicateLicenseIds = licenseIds.filter((id, index) => licenseIds.indexOf(id) !== index);
    
    if (duplicateLicenseIds.length > 0) {
      issues.push({
        type: 'pricing',
        severity: 'high',
        message: `Duplicate license IDs found: ${duplicateLicenseIds.join(', ')}`,
        location: 'lib/pricing-config.ts',
        suggestion: 'Ensure each beat license has a unique ID'
      });
    }
    
    // Check for missing required fields in service packages
    SERVICE_PACKAGES.forEach((pkg, index) => {
      if (!pkg.price || pkg.price <= 0) {
        issues.push({
          type: 'pricing',
          severity: 'high',
          message: `Service package ${pkg.name} has invalid price`,
          location: `lib/pricing-config.ts (index ${index})`,
          suggestion: 'Set a valid price greater than 0'
        });
      }
      
      if (!pkg.features || pkg.features.length === 0) {
        issues.push({
          type: 'pricing',
          severity: 'medium',
          message: `Service package ${pkg.name} has no features listed`,
          location: `lib/pricing-config.ts (index ${index})`,
          suggestion: 'Add features to help customers understand what\'s included'
        });
      }
    });
    
    // Check for missing required fields in beat licenses
    BEAT_LICENSES.forEach((license, index) => {
      if (!license.price || license.price <= 0) {
        issues.push({
          type: 'pricing',
          severity: 'high',
          message: `Beat license ${license.name} has invalid price`,
          location: `lib/pricing-config.ts (index ${index})`,
          suggestion: 'Set a valid price greater than 0'
        });
      }
      
      if (!license.features || license.features.length === 0) {
        issues.push({
          type: 'pricing',
          severity: 'medium',
          message: `Beat license ${license.name} has no features listed`,
          location: `lib/pricing-config.ts (index ${index})`,
          suggestion: 'Add features to help customers understand what\'s included'
        });
      }
    });
    
    return issues;
  }
  
  static checkContactConsistency(): ConsistencyIssue[] {
    const issues: ConsistencyIssue[] = [];
    
    // Check for inactive social media links
    const inactiveSocial = SOCIAL_MEDIA.filter(social => !social.active);
    if (inactiveSocial.length > 0) {
      issues.push({
        type: 'contact',
        severity: 'medium',
        message: `Inactive social media accounts: ${inactiveSocial.map(s => s.platform).join(', ')}`,
        location: 'lib/contact-config.ts',
        suggestion: 'Either activate these accounts or remove them from the configuration'
      });
    }
    
    // Check for missing contact information
    if (!CONTACT_INFO.email) {
      issues.push({
        type: 'contact',
        severity: 'high',
        message: 'Missing contact email',
        location: 'lib/contact-config.ts',
        suggestion: 'Add a valid contact email address'
      });
    }
    
    // Check for invalid email format
    if (CONTACT_INFO.email && !this.isValidEmail(CONTACT_INFO.email)) {
      issues.push({
        type: 'contact',
        severity: 'high',
        message: `Invalid email format: ${CONTACT_INFO.email}`,
        location: 'lib/contact-config.ts',
        suggestion: 'Fix the email format'
      });
    }
    
    return issues;
  }
  
  static checkContentConsistency(): ConsistencyIssue[] {
    const issues: ConsistencyIssue[] = [];
    
    // Check for consistent pricing terminology
    const priceTerms = ['price', 'cost', 'rate', 'fee'];
    const serviceNames = SERVICE_PACKAGES.map(pkg => pkg.name.toLowerCase());
    
    // Check for inconsistent service naming
    const mixingServices = serviceNames.filter(name => name.includes('mix'));
    if (mixingServices.length > 1) {
      issues.push({
        type: 'content',
        severity: 'medium',
        message: 'Multiple mixing service names detected',
        location: 'lib/pricing-config.ts',
        suggestion: 'Standardize mixing service naming conventions'
      });
    }
    
    return issues;
  }
  
  static runFullCheck(): ConsistencyIssue[] {
    return [
      ...this.checkPricingConsistency(),
      ...this.checkContactConsistency(),
      ...this.checkContentConsistency()
    ];
  }
  
  static generateReport(): ConsistencyReport {
    const issues = this.runFullCheck();
    const highIssues = issues.filter(i => i.severity === 'high');
    const mediumIssues = issues.filter(i => i.severity === 'medium');
    const lowIssues = issues.filter(i => i.severity === 'low');
    
    const summary = issues.length === 0 
      ? '✅ All consistency checks passed! No issues found.'
      : `⚠️ Found ${issues.length} consistency issues (${highIssues.length} high, ${mediumIssues.length} medium, ${lowIssues.length} low priority)`;
    
    return {
      timestamp: new Date().toISOString(),
      totalIssues: issues.length,
      highPriority: highIssues.length,
      mediumPriority: mediumIssues.length,
      lowPriority: lowIssues.length,
      issues,
      summary
    };
  }
  
  static validateConfiguration(): boolean {
    const issues = this.runFullCheck();
    const criticalIssues = issues.filter(i => i.severity === 'high');
    return criticalIssues.length === 0;
  }
  
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  static getValidationSummary(): string {
    const report = this.generateReport();
    return `
# Information Consistency Report

## Summary
${report.summary}

## Timestamp
${new Date(report.timestamp).toLocaleString()}

## Issue Breakdown
- Total Issues: ${report.totalIssues}
- High Priority: ${report.highPriority}
- Medium Priority: ${report.mediumPriority}
- Low Priority: ${report.lowPriority}

## High Priority Issues
${report.issues.filter(i => i.severity === 'high').map(issue => 
  `- ${issue.message} (${issue.location})${issue.suggestion ? `\n  Suggestion: ${issue.suggestion}` : ''}`
).join('\n')}

## Medium Priority Issues
${report.issues.filter(i => i.severity === 'medium').map(issue => 
  `- ${issue.message} (${issue.location})${issue.suggestion ? `\n  Suggestion: ${issue.suggestion}` : ''}`
).join('\n')}

## Low Priority Issues
${report.issues.filter(i => i.severity === 'low').map(issue => 
  `- ${issue.message} (${issue.location})${issue.suggestion ? `\n  Suggestion: ${issue.suggestion}` : ''}`
).join('\n')}

## Configuration Status
${this.validateConfiguration() ? '✅ Configuration is valid' : '❌ Configuration has critical issues'}
    `.trim();
  }
}

// Export convenience functions
export const checkConsistency = () => ConsistencyMonitor.runFullCheck();
export const generateConsistencyReport = () => ConsistencyMonitor.generateReport();
export const validateConfiguration = () => ConsistencyMonitor.validateConfiguration();
export const getValidationSummary = () => ConsistencyMonitor.getValidationSummary(); 