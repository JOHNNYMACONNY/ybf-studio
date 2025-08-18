export interface HeroImage {
  path: string;
  alt: string;
  description: string;
  opacity?: number; // Default 60% opacity
}

export const HERO_IMAGES: Record<string, HeroImage> = {
  home: {
    path: '/assets/hero/hero-home.png',
    alt: 'Professional music production studio setup',
    description: 'Home page hero - Music production studio environment',
    opacity: 60
  },
  beats: {
    path: '/assets/hero/hero-beats.png',
    alt: 'Sampler and beat production equipment',
    description: 'Beats page hero - musis and beat production gear',
    opacity: 60
  },
  services: {
    path: '/assets/hero/hero-services.png',
    alt: 'Professional audio mixing and mastering equipment',
    description: 'Services page hero - Audio engineering equipment',
    opacity: 60
  },
  portfolio: {
    path: '/assets/hero/hero-portfolio.png',
    alt: 'Portfolio showcase of music production work',
    description: 'Portfolio page hero - Production work showcase',
    opacity: 60
  },
  blog: {
    path: '/assets/hero/hero-blog.png',
    alt: 'Studio desk with laptop and production software',
    description: 'Blog page hero - Studio desk with DAW',
    opacity: 60
  },
  contact: {
    path: '/assets/hero/hero-contact.png',
    alt: 'Studio environment for collaboration',
    description: 'Contact page hero - Studio collaboration space',
    opacity: 60
  }
};

// Helper function to get hero image for a specific page
export const getHeroImage = (page: string): HeroImage => {
  return HERO_IMAGES[page] || HERO_IMAGES.home;
};

// Helper function to get all hero images
export const getAllHeroImages = (): HeroImage[] => {
  return Object.values(HERO_IMAGES);
};
