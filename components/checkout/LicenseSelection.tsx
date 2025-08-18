import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { GradientText } from '../ui/GradientText';

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

interface License {
  id: string;
  name: string;
  price: number;
  features: string[];
  description: string;
}

const licenses: License[] = [
  {
    id: 'basic',
    name: 'Basic License',
    price: 29,
    features: [
      'Personal use only',
      'Up to 10,000 streams',
      'Credit required',
      'No commercial use'
    ],
    description: 'Perfect for personal projects and demos'
  },
  {
    id: 'commercial',
    name: 'Commercial License',
    price: 99,
    features: [
      'Commercial use allowed',
      'Up to 100,000 streams',
      'Credit required',
      'One commercial project'
    ],
    description: 'Ideal for commercial releases and projects'
  },
  {
    id: 'unlimited',
    name: 'Unlimited License',
    price: 299,
    features: [
      'Unlimited commercial use',
      'Unlimited streams',
      'No credit required',
      'Multiple projects'
    ],
    description: 'Complete freedom for all your projects'
  }
];

export const LicenseSelection: React.FC = () => {
  const [selectedLicense, setSelectedLicense] = useState<string>('');

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-display font-medium mb-6 text-white">
        Choose Your <GradientText gradient="teal-blue">License</GradientText>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {licenses.map((license) => (
          <div
            key={license.id}
            className={`
              cursor-pointer transition-all duration-300
              ${selectedLicense === license.id
                ? 'ring-2 ring-teal-400 scale-105'
                : 'hover:ring-1 ring-teal-400/50 hover:scale-102'
              }
            `}
            onClick={() => setSelectedLicense(license.id)}
          >
            <GlassCard className="h-full" variant="elevated">
              <div className="text-center mb-6">
                <h4 className="text-xl font-semibold mb-2 text-white">
                  {license.name}
                </h4>
                <p className="text-gray-400 text-sm mb-4">
                  {license.description}
                </p>
                <div className="text-3xl font-bold text-teal-400">
                  ${license.price}
                </div>
              </div>
              
              <ul className="space-y-3">
                {license.features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm">
                    <CheckIcon className="w-4 h-4 text-teal-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>
        ))}
      </div>
    </div>
  );
}; 