// Centralized contact configuration system (JavaScript version)
// Single source of truth for all contact information

const CONTACT_INFO = {
  email: 'jmaconny@ybfstudio.com',
  businessHours: 'Monday - Friday, 9 AM - 6 PM EST',
  responseTime: 'Within 24 hours'
};

const SOCIAL_MEDIA = [
  {
    platform: 'Instagram',
    url: 'https://instagram.com/audioserviceapp',
    icon: 'Instagram',
    handle: '@audioserviceapp',
    active: true
  },
  {
    platform: 'YouTube',
    url: 'https://youtube.com/@audioserviceapp',
    icon: 'Youtube',
    handle: '@audioserviceapp',
    active: true
  },
  {
    platform: 'Twitter',
    url: 'https://twitter.com/audioserviceapp',
    icon: 'Twitter',
    handle: '@audioserviceapp',
    active: false // Set to false if not active
  }
];

module.exports = {
  CONTACT_INFO,
  SOCIAL_MEDIA
}; 