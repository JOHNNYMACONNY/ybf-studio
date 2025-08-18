import React from 'react';
import { runBasicSecurityAudit, SecurityAuditResult } from '../../utils/security-audit';
import { checkOWASPCompliance, ComplianceCheckResult } from '../../utils/security-compliance';

export const SecurityMonitor: React.FC = () => {
  // In production, fetch real audit/compliance results
  const audit: SecurityAuditResult = runBasicSecurityAudit();
  const compliance: ComplianceCheckResult = checkOWASPCompliance();

  return (
    <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-teal-400 mb-4">Security Monitor</h2>
      <div className="mb-4">
        <h3 className="font-semibold text-lg text-white mb-2">Security Audit</h3>
        <p className={audit.passed ? 'text-green-400' : 'text-red-400'}>
          {audit.summary}
        </p>
        {audit.issues.length > 0 && (
          <ul className="text-red-400 mt-2 list-disc list-inside">
            {audit.issues.map((issue, idx) => (
              <li key={idx}>{issue}</li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h3 className="font-semibold text-lg text-white mb-2">OWASP Compliance</h3>
        <p className={compliance.compliant ? 'text-green-400' : 'text-red-400'}>
          {compliance.summary}
        </p>
        {compliance.issues.length > 0 && (
          <ul className="text-red-400 mt-2 list-disc list-inside">
            {compliance.issues.map((issue, idx) => (
              <li key={idx}>{issue}</li>
            ))}
          </ul>
        )}
      </div>
      {/* Future: Add GDPR, rate limiting, input sanitization, and more */}
    </div>
  );
};