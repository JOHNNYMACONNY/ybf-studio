// Pricing utility functions
// Helper functions for pricing calculations, comparisons, and formatting

import { SERVICE_PACKAGES, BEAT_LICENSES } from './pricing-config';

export const getServicePackage = (id: string) => {
  return SERVICE_PACKAGES.find(pkg => pkg.id === id);
};

export const getBeatLicense = (id: string) => {
  return BEAT_LICENSES.find(license => license.id === id);
};

export const formatPrice = (price: number) => {
  return `$${price}`;
};

export const getDiscountPercentage = (originalPrice: number, currentPrice: number) => {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

export const getServicePackagesByCategory = (category: string) => {
  return SERVICE_PACKAGES.filter(pkg => pkg.category === category);
};

export const getPopularPackages = () => {
  return SERVICE_PACKAGES.filter(pkg => pkg.popular);
};

export const getMixingPackages = () => {
  return getServicePackagesByCategory('mixing');
};

export const getMasteringPackages = () => {
  return getServicePackagesByCategory('mastering');
};

export const getBundlePackages = () => {
  return getServicePackagesByCategory('bundle');
};

export const calculateBundleSavings = (packageIds: string[]) => {
  const packages = packageIds.map(id => getServicePackage(id)).filter(Boolean);
  const totalIndividualPrice = packages.reduce((sum, pkg) => sum + (pkg?.price || 0), 0);
  const bundlePrice = packages.reduce((sum, pkg) => sum + (pkg?.price || 0), 0);
  
  return {
    individualTotal: totalIndividualPrice,
    bundlePrice,
    savings: totalIndividualPrice - bundlePrice,
    savingsPercentage: Math.round(((totalIndividualPrice - bundlePrice) / totalIndividualPrice) * 100)
  };
};

export const getLicensePrice = (licenseId: string, basePrice: number = 0) => {
  const license = getBeatLicense(licenseId);
  if (!license) return basePrice;
  
  // For exclusive licenses, return the license price directly
  if (licenseId === 'exclusive') {
    return license.price;
  }
  
  // For other licenses, add to base price
  return basePrice + license.price;
};

export const getLicenseFeatures = (licenseId: string) => {
  const license = getBeatLicense(licenseId);
  return license?.features || [];
};

export const getLicenseRestrictions = (licenseId: string) => {
  const license = getBeatLicense(licenseId);
  return license?.restrictions || [];
};

export const isCommercialLicense = (licenseId: string) => {
  const license = getBeatLicense(licenseId);
  return license?.features.some(feature => feature.includes('commercial')) || false;
};

export const isExclusiveLicense = (licenseId: string) => {
  return licenseId === 'exclusive';
};

export const getTurnaroundTime = (packageId: string) => {
  const pkg = getServicePackage(packageId);
  return pkg?.turnaround || 'Contact for details';
};

export const getPackageFeatures = (packageId: string) => {
  const pkg = getServicePackage(packageId);
  return pkg?.features || [];
};

export const formatTurnaround = (turnaround: string) => {
  return turnaround.replace('business days', 'business days');
};

export const getPackageCategory = (packageId: string) => {
  const pkg = getServicePackage(packageId);
  return pkg?.category || 'mixing';
};

export const isPopularPackage = (packageId: string) => {
  const pkg = getServicePackage(packageId);
  return pkg?.popular || false;
};

export const hasDiscount = (packageId: string) => {
  const pkg = getServicePackage(packageId);
  return pkg?.originalPrice && pkg.originalPrice > pkg.price;
};

export const getPackageDiscount = (packageId: string) => {
  const pkg = getServicePackage(packageId);
  if (!pkg?.originalPrice) return null;
  
  return {
    originalPrice: pkg.originalPrice,
    currentPrice: pkg.price,
    savings: pkg.originalPrice - pkg.price,
    percentage: getDiscountPercentage(pkg.originalPrice, pkg.price)
  };
}; 