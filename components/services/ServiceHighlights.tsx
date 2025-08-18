import React from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import AnimatedSection from '../ui/AnimatedSection';
import { SERVICE_PACKAGES } from '../../lib/pricing-config';
import { getDiscountPercentage } from '../../lib/pricing-utils';

const ServiceHighlights: React.FC = () => {
  const packages = SERVICE_PACKAGES;

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4 max-w-7xl">
        <AnimatedSection delay={150}>
          <h2 className="text-section lg:text-display-small font-bold text-white text-center mb-4">
            Mixing & Mastering Services
          </h2>
        </AnimatedSection>
        <AnimatedSection delay={250}>
          <p className="text-body text-neutral-300 text-center mb-12 max-w-2xl mx-auto">
            Professional mixing and mastering services to take your music to the next level
          </p>
        </AnimatedSection>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {packages.map((pkg, index) => (
            <AnimatedSection key={pkg.id} delay={350 + (index * 100)}>
              <Card className={`relative ${pkg.popular ? 'ring-2 ring-amber-500' : ''}`}>
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge variant="primary">Most Popular</Badge>
                  </div>
                )}
                
                <div className="text-center">
                  <h3 className="text-card-title font-bold text-white mb-2">{pkg.name}</h3>
                  <div className="mb-2">
                    <div className="text-display-small font-bold text-amber-500">
                      ${pkg.price}
                    </div>
                    {pkg.originalPrice && (
                      <div className="text-sm text-neutral-500">
                        <span className="line-through">${pkg.originalPrice}</span>
                        <span className="ml-2 text-emerald-500">
                          Save {getDiscountPercentage(pkg.originalPrice, pkg.price)}%
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-neutral-400 mb-4">{pkg.description}</p>
                  <p className="text-xs text-neutral-500 mb-6">Turnaround: {pkg.turnaround}</p>
                  
                  <ul className="space-y-3 mb-8 text-left">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-neutral-300">
                        <svg className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    variant={pkg.popular ? 'primary' : 'secondary'} 
                    className="w-full"
                  >
                    Get Your Mix
                  </Button>
                </div>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceHighlights; 