import React from 'react';
import { X, Download, Music, FileAudio, Headphones, Shield, CheckCircle } from 'lucide-react';
import { BEAT_LICENSES } from '../../lib/pricing-config';
import type { BeatLicense } from '../../lib/pricing-config';

interface LicenseInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLicense?: 'mp3' | 'wav' | 'premium' | 'exclusive';
  beatTitle?: string;
}

const LicenseInfoModal: React.FC<LicenseInfoModalProps> = ({
  isOpen,
  onClose,
  selectedLicense = 'mp3',
  beatTitle = 'Beat'
}) => {
  if (!isOpen) return null;

  const selectedLicenseData = BEAT_LICENSES.find(license => license.id === selectedLicense);

  const getLicenseIcon = (licenseId: string) => {
    switch (licenseId) {
      case 'mp3':
        return Music;
      case 'wav':
        return FileAudio;
      case 'premium':
        return Headphones;
      case 'exclusive':
        return Shield;
      default:
        return Download;
    }
  };

  const getLicenseFeatures = (licenseId: string) => {
    const commonFeatures = [
      'Commercial use rights',
      'Personal use rights',
      'Unlimited streams',
      'Social media use',
      'YouTube & TikTok monetization'
    ];

    switch (licenseId) {
      case 'mp3':
        return [
          ...commonFeatures,
          'MP3 format delivery',
          'Standard quality (320kbps)',
          'Non-exclusive rights'
        ];
      case 'wav':
        return [
          ...commonFeatures,
          'WAV format delivery',
          'High quality (24-bit)',
          'Non-exclusive rights',
          'Mastering ready'
        ];
      case 'premium':
        return [
          ...commonFeatures,
          'WAV + MP3 delivery',
          'High quality (24-bit)',
          'Non-exclusive rights',
          'Mastering ready',
          'Stem files included'
        ];
      case 'exclusive':
        return [
          'Full commercial use rights',
          'Personal use rights',
          'Unlimited streams',
          'Social media use',
          'YouTube & TikTok monetization',
          'WAV + MP3 + Stems delivery',
          'High quality (24-bit)',
          'EXCLUSIVE rights (beat removed from store)',
          'Mastering ready',
          'Publishing rights included',
          'Royalty-free for life'
        ];
      default:
        return commonFeatures;
    }
  };

  const features = getLicenseFeatures(selectedLicense);
  const LicenseIcon = getLicenseIcon(selectedLicense);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <LicenseIcon className="w-6 h-6 text-amber-500" />
            <div>
              <h2 className="text-xl font-semibold text-white">
                {selectedLicenseData?.name || 'License'} Details
              </h2>
              <p className="text-sm text-neutral-400">
                {beatTitle} • {selectedLicenseData?.description || 'License information'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Price */}
          <div className="mb-6">
            <div className="text-3xl font-bold text-amber-500 mb-2">
              ${selectedLicenseData?.price || '0.00'}
            </div>
            <p className="text-neutral-400 text-sm">
              One-time payment • Instant download
            </p>
          </div>

          {/* What's Included */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">What&apos;s Included</h3>
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-neutral-300 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* File Formats */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">File Formats</h3>
            <div className="flex flex-wrap gap-2">
              {selectedLicense === 'mp3' && (
                <span className="px-3 py-1 bg-neutral-800 text-neutral-300 rounded-full text-sm">
                  MP3 (320kbps)
                </span>
              )}
              {(selectedLicense === 'wav' || selectedLicense === 'premium' || selectedLicense === 'exclusive') && (
                <span className="px-3 py-1 bg-neutral-800 text-neutral-300 rounded-full text-sm">
                  WAV (24-bit)
                </span>
              )}
              {(selectedLicense === 'premium' || selectedLicense === 'exclusive') && (
                <span className="px-3 py-1 bg-neutral-800 text-neutral-300 rounded-full text-sm">
                  MP3 (320kbps)
                </span>
              )}
              {(selectedLicense === 'premium' || selectedLicense === 'exclusive') && (
                <span className="px-3 py-1 bg-neutral-800 text-neutral-300 rounded-full text-sm">
                  Stem Files
                </span>
              )}
            </div>
          </div>

          {/* Delivery */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Delivery</h3>
            <div className="bg-neutral-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-emerald-400 mb-2">
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Instant Download</span>
              </div>
              <p className="text-neutral-400 text-sm">
                Download links sent immediately after purchase. Links remain active for 24 hours.
              </p>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
            <h4 className="text-amber-400 font-medium mb-2">Important Notes</h4>
            <ul className="text-amber-200/80 text-sm space-y-1">
              <li>• All sales are final - no refunds</li>
              <li>• License is non-transferable</li>
              <li>• Beat must be credited in all uses</li>
              {selectedLicense === 'exclusive' && (
                <li>• Exclusive rights mean beat is removed from sale</li>
              )}
              <li>• By purchasing, you agree to our terms of service</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LicenseInfoModal;