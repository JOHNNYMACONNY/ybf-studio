import React, { useState } from 'react';
import { X, Download, Clock, Shield } from 'lucide-react';
import type { Beat } from '../../types/beat';
import { BEAT_LICENSES } from '../../lib/pricing-config';
import type { BeatLicense } from '../../lib/pricing-config';

interface LicenseSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  beat: Beat | null;
  licenses?: BeatLicense[];
  onPurchase: (licenseType: 'mp3' | 'wav' | 'premium' | 'exclusive') => void;
}

const LicenseSelectModal: React.FC<LicenseSelectModalProps> = ({
  isOpen,
  onClose,
  beat,
  licenses = BEAT_LICENSES,
  onPurchase
}) => {
  const [selectedLicense, setSelectedLicense] = useState<'mp3' | 'wav' | 'premium' | 'exclusive'>('mp3');

  if (!isOpen || !beat) return null;

  const getLicenseIcon = (licenseId: string) => {
    switch (licenseId) {
      case 'exclusive':
        return Shield;
      default:
        return Download;
    }
  };

  const handlePurchase = () => {
    onPurchase(selectedLicense);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-neutral-900 border border-neutral-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">Choose License</h2>
            <p className="text-neutral-400">{beat.title} by {beat.artist}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-800 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-neutral-400" />
          </button>
        </div>

        {/* License Options */}
        <div className="space-y-4 mb-6">
          {licenses.map((license) => {
            const Icon = getLicenseIcon(license.id);
            const isSelected = selectedLicense === license.id;
            const price = beat.licenseTypes?.[license.id as keyof typeof beat.licenseTypes] || license.price;
            
            return (
              <div
                key={license.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-amber-500 bg-amber-500/10' 
                    : 'border-neutral-700 hover:border-neutral-600'
                }`}
                onClick={() => setSelectedLicense(license.id as 'mp3' | 'wav' | 'premium' | 'exclusive')}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      isSelected ? 'bg-amber-500' : 'bg-neutral-700'
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        isSelected ? 'text-white' : 'text-neutral-400'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{license.name}</h3>
                      <p className="text-sm text-neutral-400 mb-2">{license.description}</p>
                      <ul className="space-y-1">
                        {license.features.map((feature, index) => (
                          <li key={index} className="text-sm text-neutral-300 flex items-center gap-2">
                            <div className="w-1 h-1 bg-neutral-500 rounded-full" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-amber-500">
                      ${price}
                    </div>
                    {isSelected && (
                      <div className="text-xs text-amber-400 mt-1">Selected</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Purchase Button */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
          <div className="text-sm text-neutral-400">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Download link expires in 24 hours
            </div>
          </div>
          <button
            onClick={handlePurchase}
            className="btn-primary px-8 py-3"
          >
            Purchase ${beat.licenseTypes?.[selectedLicense] || 0} License
          </button>
        </div>
      </div>
    </div>
  );
};

export default LicenseSelectModal;
