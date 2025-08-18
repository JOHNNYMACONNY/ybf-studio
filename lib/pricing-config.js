// Centralized pricing configuration system (JavaScript version)
// Single source of truth for all pricing information

const SERVICE_PACKAGES = [
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

const BEAT_LICENSES = [
  {
    id: 'mp3',
    name: 'MP3 License',
    description: 'Standard MP3 lease for personal projects',
    price: 29,
    features: [
      'Tagged MP3 file',
      'Personal use only',
      '2,500 streams',
      'Non-commercial use'
    ],
    restrictions: [
      'No commercial use',
      'No resale',
      'No remixing',
      'Streaming limit applies'
    ]
  },
  {
    id: 'wav',
    name: 'WAV License',
    description: 'High-quality WAV lease for commercial projects',
    price: 79,
    features: [
      'High-quality WAV file',
      'Commercial use allowed',
      '10,000 streams',
      'Radio play allowed'
    ],
    restrictions: [
      'No resale',
      'No remixing',
      'Streaming limit applies',
      'Credit required'
    ]
  },
  {
    id: 'premium',
    name: 'Premium License',
    description: 'Full trackouts for professional production',
    price: 149,
    features: [
      'Full trackouts (stems)',
      'Commercial use allowed',
      '50,000 streams',
      'Unlimited radio play',
      'Remix rights'
    ],
    restrictions: [
      'No resale',
      'Credit required',
      'Streaming limit applies'
    ]
  },
  {
    id: 'exclusive',
    name: 'Exclusive Rights',
    description: 'Full ownership transfer of the beat',
    price: 299,
    features: [
      'Full ownership transfer',
      'Unlimited commercial use',
      'Unlimited streams',
      'Full trackouts',
      'Remix and resale rights',
      'No credit required'
    ],
    restrictions: [
      'One-time purchase only',
      'Beat removed from store'
    ]
  }
];

module.exports = {
  SERVICE_PACKAGES,
  BEAT_LICENSES
}; 