import React from 'react';
import { SERVICE_PACKAGES } from '../../lib/pricing-config';
import Card from '../ui/Card';
import { getDiscountPercentage } from '../../lib/pricing-utils';

const ServiceComparison: React.FC = () => {
  return (
    <div className="overflow-x-auto">
      <Card className="p-6">
        <h3 className="text-xl font-bold text-white mb-6 bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">Service Comparison</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-700">
              <th className="text-left py-3 text-neutral-300">Feature</th>
              {SERVICE_PACKAGES.map((pkg) => (
                <th key={pkg.id} className="text-center py-3 text-neutral-300">
                  {pkg.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-neutral-800">
              <td className="py-3 text-neutral-300">Price</td>
              {SERVICE_PACKAGES.map((pkg) => (
                <td key={pkg.id} className="text-center py-3">
                  <div className="font-bold text-white">${pkg.price}</div>
                  {pkg.originalPrice && (
                    <div className="text-xs text-neutral-500 line-through">
                      ${pkg.originalPrice}
                    </div>
                  )}
                </td>
              ))}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 text-neutral-300">Turnaround</td>
              {SERVICE_PACKAGES.map((pkg) => (
                <td key={pkg.id} className="text-center py-3 text-neutral-300">
                  {pkg.turnaround}
                </td>
              ))}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 text-neutral-300">Revisions</td>
              {SERVICE_PACKAGES.map((pkg) => (
                <td key={pkg.id} className="text-center py-3 text-neutral-300">
                  {pkg.features.find(f => f.includes('revision')) || 'N/A'}
                </td>
              ))}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 text-neutral-300">Vocal Tuning</td>
              {SERVICE_PACKAGES.map((pkg) => (
                <td key={pkg.id} className="text-center py-3">
                  {pkg.features.find(f => f.includes('vocal tuning')) ? (
                    <span className="text-emerald-500">✓</span>
                  ) : (
                    <span className="text-neutral-500">✗</span>
                  )}
                </td>
              ))}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 text-neutral-300">Stem Delivery</td>
              {SERVICE_PACKAGES.map((pkg) => (
                <td key={pkg.id} className="text-center py-3">
                  {pkg.features.find(f => f.includes('stem')) ? (
                    <span className="text-emerald-500">✓</span>
                  ) : (
                    <span className="text-neutral-500">✗</span>
                  )}
                </td>
              ))}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 text-neutral-300">Reference Analysis</td>
              {SERVICE_PACKAGES.map((pkg) => (
                <td key={pkg.id} className="text-center py-3">
                  {pkg.features.find(f => f.includes('reference')) ? (
                    <span className="text-emerald-500">✓</span>
                  ) : (
                    <span className="text-neutral-500">✗</span>
                  )}
                </td>
              ))}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 text-neutral-300">Mastering Included</td>
              {SERVICE_PACKAGES.map((pkg) => (
                <td key={pkg.id} className="text-center py-3">
                  {pkg.features.find(f => f.includes('mastering')) ? (
                    <span className="text-emerald-500">✓</span>
                  ) : (
                    <span className="text-neutral-500">✗</span>
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 text-neutral-300">Best For</td>
              {SERVICE_PACKAGES.map((pkg) => (
                <td key={pkg.id} className="text-center py-3 text-neutral-300">
                  {pkg.id === 'basic-mix' && 'Demos & Simple Projects'}
                  {pkg.id === 'advanced-mix' && 'Professional Releases'}
                  {pkg.id === 'stereo-master' && 'Final Polish'}
                  {pkg.id === 'mix-master-bundle' && 'Complete Production'}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default ServiceComparison; 