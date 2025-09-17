import React from 'react';
import { Check, X } from 'lucide-react';
import { Icon } from '../ui/Icon';
import Card from '../ui/Card';
import Tooltip from '../ui/Tooltip';
import { Service } from '../../types/service';

interface ServiceComparisonProps {
  services: Service[];
}

const featureIncludes = (service: Service, needles: string[]): boolean => {
  const lower = service.features.map(f => f.toLowerCase());
  return lower.some(f => needles.some(n => f.includes(n)));
};

const getStemsSupported = (service: Service): string => {
  const match = service.features.find(f => /stems?/i.test(f));
  return match || '—';
};

const ServiceComparison: React.FC<ServiceComparisonProps> = ({ services }) => {
  return (
    <div className="overflow-x-auto">
      <Card className="p-3 sm:p-6 hover:shadow-lg hover:translate-y-0" hover={false} scale={false}>
        <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">Service Comparison</h3>
        <table 
          className="w-full text-xs sm:text-sm min-w-[600px]"
          role="table"
          aria-label="Service comparison table"
        >
          <thead>
            <tr className="border-b border-neutral-700" role="row">
              <th 
                className="text-left py-2 sm:py-3 text-neutral-300 text-xs sm:text-sm font-medium"
                role="columnheader"
                scope="col"
                aria-label="Feature name"
              >
                Feature
              </th>
              {services.map((service) => (
                <th 
                  key={service.id} 
                  className="text-center py-2 sm:py-3 text-neutral-300 text-xs sm:text-sm font-medium px-1 sm:px-2"
                  role="columnheader"
                  scope="col"
                  aria-label={`${service.name} service details`}
                >
                  <div className="break-words max-w-[80px] sm:max-w-none">
                    {service.name}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-neutral-800" role="row">
              <td 
                className="py-2 sm:py-3 text-neutral-300 text-xs sm:text-sm"
                role="rowheader"
                scope="row"
                aria-label="Price feature"
              >
                <Tooltip content="Current package price (before discounts if shown)" side="top">
                  <span>Price</span>
                </Tooltip>
              </td>
              {services.map((service) => (
                <td 
                  key={service.id} 
                  className="text-center py-2 sm:py-3 px-1 sm:px-2"
                  role="cell"
                  aria-label={`${service.name} price: $${service.price}${service.original_price ? `, originally $${service.original_price}` : ''}`}
                >
                  <div className="font-bold text-white text-xs sm:text-sm">${service.price}</div>
                  {service.original_price && (
                    <div className="text-xs text-neutral-500 line-through">
                      ${service.original_price}
                    </div>
                  )}
                </td>
              ))}
            </tr>
            <tr className="border-b border-neutral-800" role="row">
              <td 
                className="py-2 sm:py-3 text-neutral-300 text-xs sm:text-sm"
                role="rowheader"
                scope="row"
                aria-label="Stems supported feature"
              >
                <Tooltip content={"Maximum number of individual tracks (stems) included in the mix"} side="top">
                  <span>Stems Supported</span>
                </Tooltip>
              </td>
              {services.map((service) => (
                <td 
                  key={service.id} 
                  className="text-center py-2 sm:py-3 text-neutral-300 text-xs sm:text-sm px-1 sm:px-2"
                  role="cell"
                  aria-label={`${service.name} stems supported: ${getStemsSupported(service)}`}
                >
                  {getStemsSupported(service)}
                </td>
              ))}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-2 sm:py-3 text-neutral-300 text-xs sm:text-sm">
                <Tooltip content="Estimated delivery window for first version" side="top">
                  <span>Turnaround</span>
                </Tooltip>
              </td>
              {services.map((service) => (
                <td key={service.id} className="text-center py-2 sm:py-3 text-neutral-300 text-xs sm:text-sm px-1 sm:px-2">
                  {service.turnaround_time || 'Contact for details'}
                </td>
              ))}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-2 sm:py-3 text-neutral-300 text-xs sm:text-sm">
                <Tooltip content="Number of included revision rounds (mix changes after first delivery)" side="top">
                  <span>Revisions</span>
                </Tooltip>
              </td>
              {services.map((service) => (
                <td key={service.id} className="text-center py-2 sm:py-3 text-neutral-300 text-xs sm:text-sm px-1 sm:px-2">
                  {service.features.find(f => f.toLowerCase().includes('revision')) || 'N/A'}
                </td>
              ))}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-2 sm:py-3 text-neutral-300 text-xs sm:text-sm">
                <Tooltip content="Pitch correction/comping for vocal tracks where applicable" side="top">
                  <span>Vocal Tuning</span>
                </Tooltip>
              </td>
              {services.map((service) => (
                <td key={service.id} className="text-center py-2 sm:py-3 px-1 sm:px-2">
                  {featureIncludes(service, ['vocal tuning']) ? (
                    <Icon as={Check} className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 inline" />
                  ) : (
                    <Icon as={X} className="h-3 w-3 sm:h-4 sm:w-4 text-neutral-500 inline" />
                  )}
                </td>
              ))}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-2 sm:py-3 text-neutral-300 text-xs sm:text-sm">
                <Tooltip content="Delivery format included: individual stems and/or mastered stereo file" side="top">
                  <span>Stem Delivery</span>
                </Tooltip>
              </td>
              {services.map((service) => (
                <td key={service.id} className="text-center py-2 sm:py-3 px-1 sm:px-2">
                  {featureIncludes(service, ['stem delivery', 'stem + mastered', 'stems']) ? (
                    <Icon as={Check} className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 inline" />
                  ) : (
                    <Icon as={X} className="h-3 w-3 sm:h-4 sm:w-4 text-neutral-500 inline" />
                  )}
                </td>
              ))}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-2 sm:py-3 text-neutral-300 text-xs sm:text-sm">
                <Tooltip content="We compare against your reference tracks to match tone and balance" side="top">
                  <span>Reference Analysis</span>
                </Tooltip>
              </td>
              {services.map((service) => (
                <td key={service.id} className="text-center py-2 sm:py-3 px-1 sm:px-2">
                  {featureIncludes(service, ['reference']) ? (
                    <Icon as={Check} className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 inline" />
                  ) : (
                    <Icon as={X} className="h-3 w-3 sm:h-4 sm:w-4 text-neutral-500 inline" />
                  )}
                </td>
              ))}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="py-2 sm:py-3 text-neutral-300 text-xs sm:text-sm">
                <Tooltip content="Professional mastering service included with this package" side="top">
                  <span>Mastering Included</span>
                </Tooltip>
              </td>
              {services.map((service) => (
                <td key={service.id} className="text-center py-2 sm:py-3 px-1 sm:px-2">
                  {service.category === 'mastering' || featureIncludes(service, ['mastering']) ? (
                    <Icon as={Check} className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 inline" />
                  ) : (
                    <Icon as={X} className="h-3 w-3 sm:h-4 sm:w-4 text-neutral-500 inline" />
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2 sm:py-3 text-neutral-300 text-xs sm:text-sm">
                <Tooltip content="Quick guidance on which package fits best" side="top">
                  <span>Best For</span>
                </Tooltip>
              </td>
              {services.map((service) => (
                <td key={service.id} className="text-center py-2 sm:py-3 text-neutral-300 text-xs sm:text-sm px-1 sm:px-2">
                  <div className="break-words">
                    {service.category === 'mixing' && service.price < 150 && 'Demos & Simple Projects'}
                    {service.category === 'mixing' && service.price >= 150 && 'Professional Releases'}
                    {service.category === 'mastering' && 'Final Polish'}
                    {service.category === 'bundle' && 'Complete Production'}
                  </div>
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