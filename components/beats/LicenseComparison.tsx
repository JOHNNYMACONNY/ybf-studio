import React from 'react';
import { BEAT_LICENSES } from '../../lib/pricing-config';
import Card from '../ui/Card';

const LicenseComparison: React.FC = () => {
  return (
    <Card className="p-6">
              <h3 className="text-xl font-bold text-white mb-6 bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">License Comparison</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {BEAT_LICENSES.map((license) => (
          <div key={license.id} className="border border-neutral-700 rounded-lg p-4">
            <div className="text-center mb-4">
              <h4 className="font-bold text-white mb-2">{license.name}</h4>
              <div className="text-2xl font-bold text-teal-400">${license.price}</div>
              <p className="text-sm text-neutral-400 mt-1">{license.description}</p>
            </div>
            
            <div className="space-y-3">
              <div>
                <h5 className="text-sm font-semibold text-neutral-300 mb-2">Includes:</h5>
                <ul className="space-y-1 text-xs text-neutral-400">
                  {license.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-emerald-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h5 className="text-sm font-semibold text-neutral-300 mb-2">Restrictions:</h5>
                <ul className="space-y-1 text-xs text-neutral-400">
                  {license.restrictions.map((restriction, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-red-400 mr-2">✗</span>
                      {restriction}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default LicenseComparison; 