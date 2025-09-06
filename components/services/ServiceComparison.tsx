import React from 'react';
import { Check, X } from 'lucide-react';
import { Icon } from '../ui/Icon';
import { SERVICE_PACKAGES, ServicePackage } from '../../lib/pricing-config';
import Card from '../ui/Card';
import Tooltip from '../ui/Tooltip';

const featureIncludes = (pkg: ServicePackage, needles: string[]): boolean => {
  const lower = pkg.features.map(f => f.toLowerCase());
  return lower.some(f => needles.some(n => f.includes(n)));
};

const getStemsSupported = (pkg: ServicePackage): string => {
  const match = pkg.features.find(f => /stems?/i.test(f));
  return match || '—';
};

const ServiceComparison: React.FC = () => {
  return (
    <div className="overflow-x-auto">
      <Card className="p-6 hover:shadow-lg hover:translate-y-0" hover={false} scale={false}>
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
              <td className="py-3 text-neutral-300">
                <Tooltip content="Current package price (before discounts if shown)" side="top">
                  <span>Price</span>
                </Tooltip>
              </td>
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
              <td className="py-3 text-neutral-300">
                <Tooltip content={"Maximum number of individual tracks (stems) included in the mix"} side="top">
                  <span>Stems Supported</span>
                </Tooltip>
              </td>
              {SERVICE_PACKAGES.map((pkg) => (
                <td key={pkg.id} className="text-center py-3 text-neutral-300">
                  {getStemsSupported(pkg)}
                </td>
              ))}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 text-neutral-300">
                <Tooltip content="Estimated delivery window for first version" side="top">
                  <span>Turnaround</span>
                </Tooltip>
              </td>
              {SERVICE_PACKAGES.map((pkg) => (
                <td key={pkg.id} className="text-center py-3 text-neutral-300">
                  {pkg.turnaround}
                </td>
              ))}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 text-neutral-300">
                <Tooltip content="Number of included revision rounds (mix changes after first delivery)" side="top">
                  <span>Revisions</span>
                </Tooltip>
              </td>
              {SERVICE_PACKAGES.map((pkg) => (
                <td key={pkg.id} className="text-center py-3 text-neutral-300">
                  {pkg.features.find(f => f.toLowerCase().includes('revision')) || 'N/A'}
                </td>
              ))}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 text-neutral-300">
                <Tooltip content="Pitch correction/comping for vocal tracks where applicable" side="top">
                  <span>Vocal Tuning</span>
                </Tooltip>
              </td>
              {SERVICE_PACKAGES.map((pkg) => (
                <td key={pkg.id} className="text-center py-3">
                  {featureIncludes(pkg, ['vocal tuning']) ? (
                    <Icon as={Check} className="h-4 w-4 text-emerald-500 inline" />
                  ) : (
                    <Icon as={X} className="h-4 w-4 text-neutral-500 inline" />
                  )}
                </td>
              ))}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 text-neutral-300">
                <Tooltip content="Delivery format included: individual stems and/or mastered stereo file" side="top">
                  <span>Stem Delivery</span>
                </Tooltip>
              </td>
              {SERVICE_PACKAGES.map((pkg) => (
                <td key={pkg.id} className="text-center py-3">
                  {featureIncludes(pkg, ['stem delivery', 'stem + mastered', 'stems']) ? (
                    <Icon as={Check} className="h-4 w-4 text-emerald-500 inline" />
                  ) : (
                    <Icon as={X} className="h-4 w-4 text-neutral-500 inline" />
                  )}
                </td>
              ))}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 text-neutral-300">
                <Tooltip content="We compare against your reference tracks to match tone and balance" side="top">
                  <span>Reference Analysis</span>
                </Tooltip>
              </td>
              {SERVICE_PACKAGES.map((pkg) => (
                <td key={pkg.id} className="text-center py-3">
                  {featureIncludes(pkg, ['reference']) ? (
                    <Icon as={Check} className="h-4 w-4 text-emerald-500 inline" />
                  ) : (
                    <Icon as={X} className="h-4 w-4 text-neutral-500 inline" />
                  )}
                </td>
              ))}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-3 text-neutral-300">
                <Tooltip content="Professional mastering service included with this package" side="top">
                  <span>Mastering Included</span>
                </Tooltip>
              </td>
              {SERVICE_PACKAGES.map((pkg) => (
                <td key={pkg.id} className="text-center py-3">
                  {pkg.category === 'mastering' || featureIncludes(pkg, ['mastering']) ? (
                    <Icon as={Check} className="h-4 w-4 text-emerald-500 inline" />
                  ) : (
                    <Icon as={X} className="h-4 w-4 text-neutral-500 inline" />
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 text-neutral-300">
                <Tooltip content="Quick guidance on which package fits best" side="top">
                  <span>Best For</span>
                </Tooltip>
              </td>
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