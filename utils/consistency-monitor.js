// Consistency monitoring system (JavaScript version)
// Validates pricing and contact information consistency across the application

const { SERVICE_PACKAGES, BEAT_LICENSES } = require('../lib/pricing-config.js');
const { CONTACT_INFO, SOCIAL_MEDIA } = require('../lib/contact-config.js');

class ConsistencyMonitor {
  static checkPricingConsistency() {
    const issues = [];
    
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
  
  static checkContactConsistency() {
    const issues = [];
    
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
        severity: 'medium',
        message: `Invalid email format: ${CONTACT_INFO.email}`,
        location: 'lib/contact-config.ts',
        suggestion: 'Use a valid email format (e.g., contact@example.com)'
      });
    }
    
    return issues;
  }
  
  static checkContentConsistency() {
    const issues = [];
    
    // Check for consistent service naming
    const serviceNames = SERVICE_PACKAGES.map(pkg => pkg.name.toLowerCase());
    const uniqueNames = new Set(serviceNames);
    
    if (serviceNames.length !== uniqueNames.size) {
      issues.push({
        type: 'content',
        severity: 'medium',
        message: 'Duplicate service names found',
        location: 'lib/pricing-config.ts',
        suggestion: 'Ensure each service has a unique name to avoid confusion'
      });
    }
    
    return issues;
  }
  
  static runFullCheck() {
    return [
      ...this.checkPricingConsistency(),
      ...this.checkContactConsistency(),
      ...this.checkContentConsistency()
    ];
  }
  
  static generateReport() {
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
  
  static validateConfiguration() {
    const issues = this.runFullCheck();
    const criticalIssues = issues.filter(i => i.severity === 'high');
    return criticalIssues.length === 0;
  }
  
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// Export convenience functions
module.exports = {
  ConsistencyMonitor,
  checkConsistency: () => ConsistencyMonitor.runFullCheck(),
  generateConsistencyReport: () => ConsistencyMonitor.generateReport(),
  validateConfiguration: () => ConsistencyMonitor.validateConfiguration()
}; 