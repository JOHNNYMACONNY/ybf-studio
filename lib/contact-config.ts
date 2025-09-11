// Centralized contact configuration system
// Single source of truth for all contact information

export interface ContactInfo {
  email: string;
  phone?: string;
  businessHours: string;
  responseTime: string;
}

export interface SocialMedia {
  platform: string;
  url: string;
  icon: string;
  handle: string;
  active: boolean;
}

export const CONTACT_INFO: ContactInfo = {
  email: 'jmaconny@ybfstudio.com',
  businessHours: 'Monday - Friday, 9 AM - 6 PM EST',
  responseTime: 'Within 24 hours'
};

export const SOCIAL_MEDIA: SocialMedia[] = [
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

export const getActiveSocialMedia = () => {
  return SOCIAL_MEDIA.filter(social => social.active);
};

export const getContactEmail = () => {
  return CONTACT_INFO.email;
};

export const getBusinessHours = () => {
  return CONTACT_INFO.businessHours;
};

export const getResponseTime = () => {
  return CONTACT_INFO.responseTime;
};

export const getContactInfo = () => {
  return CONTACT_INFO;
};

export const getSocialMediaByPlatform = (platform: string) => {
  return SOCIAL_MEDIA.find(social => social.platform.toLowerCase() === platform.toLowerCase());
};

export const isSocialMediaActive = (platform: string) => {
  const social = getSocialMediaByPlatform(platform);
  return social?.active || false;
}; 