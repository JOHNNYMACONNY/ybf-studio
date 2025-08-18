// Centralized pricing configuration system
// Single source of truth for all pricing information

export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  features: string[];
  turnaround: string;
  popular?: boolean;
  category: 'mixing' | 'mastering' | 'bundle';
}

export interface BeatLicense {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  restrictions: string[];
}

export const SERVICE_PACKAGES: ServicePackage[] = [
  {
    id: 'basic-mix',
    name: 'Basic Mix',
    description: 'Professional mixing for up to 16 stems',
    price: 99,
    features: [
      'Professional mixing',
      'Up to 16 stems',
      '2 revision rounds',
      'Stem delivery',
      'Reference track analysis'
    ],
    turnaround: '3-5 business days',
    category: 'mixing'
  },
  {
    id: 'advanced-mix',
    name: 'Advanced Mix',
    description: 'Professional mixing with unlimited stems',
    price: 199,
    features: [
      'Professional mixing',
      'Unlimited stems',
      'Unlimited revisions',
      'Stem delivery',
      'Reference track analysis',
      'Vocal tuning included'
    ],
    turnaround: '1-3 business days',
    category: 'mixing',
    popular: true
  },
  {
    id: 'stereo-master',
    name: 'Stereo Master',
    description: 'Industry-standard mastering',
    price: 50,
    features: [
      'Industry-standard mastering',
      'Loudness optimization',
      'Frequency balancing',
      'Stereo enhancement',
      '1 revision round'
    ],
    turnaround: '1-2 business days',
    category: 'mastering'
  },
  {
    id: 'mix-master-bundle',
    name: 'Mix & Master Bundle',
    description: 'Complete mixing and mastering package',
    price: 180,
    originalPrice: 249,
    features: [
      'Professional mixing',
      'Industry-standard mastering',
      'Unlimited stems',
      'Unlimited revisions',
      'Stem + mastered delivery',
      'Reference track analysis'
    ],
    turnaround: '3-5 business days',
    category: 'bundle'
  }
];

export const BEAT_LICENSES: BeatLicense[] = [
  {
    id: 'mp3',
    name: 'MP3 License',
    description: 'Standard MP3 lease for personal projects',
    price: 29,
    features: [
      'Tagged MP3 file',
      'Personal use only',
      'Up to 2,500 streams',
      'Credit required'
    ],
    restrictions: [
      'No commercial use',
      'No radio/TV broadcast',
      'No resale rights'
    ]
  },
  {
    id: 'wav',
    name: 'WAV License',
    description: 'High-quality WAV lease for commercial use',
    price: 79,
    features: [
      'Untagged WAV file',
      'Commercial use allowed',
      'Up to 10,000 streams',
      'Credit required',
      'One commercial project'
    ],
    restrictions: [
      'No resale rights',
      'No exclusive rights'
    ]
  },
  {
    id: 'premium',
    name: 'Premium License',
    description: 'Full trackouts with extended rights',
    price: 149,
    features: [
      'Full trackouts (stems)',
      'Commercial use allowed',
      'Up to 50,000 streams',
      'No credit required',
      'Multiple projects'
    ],
    restrictions: [
      'No exclusive rights',
      'No resale of stems'
    ]
  },
  {
    id: 'exclusive',
    name: 'Exclusive Rights',
    description: 'Full ownership transfer',
    price: 299,
    features: [
      'Full ownership transfer',
      'Beat removed from store',
      'Unlimited commercial use',
      'Unlimited streams',
      'No credit required',
      'Resale rights included'
    ],
    restrictions: [
      'Non-refundable',
      'Beat becomes unavailable to others'
    ]
  }
];

// Utility functions for pricing
export const getServicePackage = (id: string): ServicePackage | undefined => {
  return SERVICE_PACKAGES.find(pkg => pkg.id === id);
};

// Removed getPricingTier function since PricingTier interface doesn't exist

export const getBeatLicense = (id: string): BeatLicense | undefined => {
  return BEAT_LICENSES.find(license => license.id === id);
};

export const formatPrice = (price: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(price);
};

export const calculateDiscount = (originalPrice: number, currentPrice: number): number => {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

// Removed getPopularTiers and getRecommendedTiers functions since PricingTier interface doesn't exist 