import React, { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Icon } from '../components/ui/Icon';
import Image from 'next/image';
import FaqAccordion from '../components/shared/FaqAccordion';
import Button from '../components/ui/Button';
import Link from 'next/link';
import ServiceBookingModal from '../components/ServiceBookingModal';
import AnimatedSection from '../components/ui/AnimatedSection';
import { getDiscountPercentage } from '../lib/pricing-utils';
import { getHeroImage } from '../lib/hero-config';
import { getActiveServices, getActiveFaqs } from '../lib/services';
import { Service } from '../types/service';
import ServiceComparison from '../components/services/ServiceComparison';
import ErrorBoundary from '../components/ui/ErrorBoundary';
import ErrorFallback from '../components/ui/ErrorFallback';
import { SkeletonCard } from '../components/ui/SkeletonCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const processSteps = [
  { title: '1. Place Your Order', description: 'Choose your service and upload your files through our secure portal.' },
  { title: '2. We Get to Work', description: 'Our engineers mix and/or master your track using top-tier tools and techniques.' },
  { title: '3. Review & Revise', description: 'You receive the first version. We include free revisions to ensure you\'re 100% happy.' },
  { title: '4. Final Delivery', description: 'Receive your high-quality, release-ready audio files.' },
];

// This will now be fetched from the database
// const faqs = [
//   { question: 'What file formats should I send?', answer: 'Please send 24-bit WAV files with no processing on the master bus. Ensure all tracks are exported from the same start point.' },
//   { question: 'What is the turnaround time?', answer: 'Standard turnaround is 3-5 business days for mixing and 1-2 business days for mastering. Rush delivery options are available.' },
//   { question: 'How many revisions are included?', answer: 'Our mixing packages include 2 free revisions, and mastering includes 1 free revision. Additional revisions can be purchased.' },
//   { question: 'What if I\'m not happy with the result?', answer: 'We strive for 100% satisfaction. We\'ll work with you through the revision process to get the sound you&apos;re looking for.' },
// ];

interface FaqItem { question: string; answer: string }
const Services: React.FC<{ services: Service[]; faqs: FaqItem[] }> = ({ services, faqs }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const heroImage = getHeroImage('services');

  const handleBookClick = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-3d-spline-primary text-white px-4 py-2 rounded-lg z-50"
      >
        Skip to main content
      </a>
      
      {/* Hero Section */}
      <div className="card-3d-spline rounded-2xl p-8 mb-12 hero-background-enhanced hero-card-enhanced">
        {/* Background Image with configurable opacity */}
        <div className="hero-background-image relative" style={{ opacity: (heroImage.opacity || 60) / 100 }}>
          <Image 
            src={heroImage.path} 
            alt={heroImage.alt}
            fill 
            className="object-cover"
            priority
          />
        </div>
        
        {/* Content in foreground */}
        <AnimatedSection animation="fadeIn" className="relative z-10">
          <div className="text-center space-y-8">
            <h1 className="text-5xl font-bold text-3d-spline-text-primary">
              Professional <span className="text-3d-spline-accent">Audio Services</span>
            </h1>
            <p className="text-xl text-3d-spline-text-secondary max-w-3xl mx-auto">
              From raw recordings to release-ready hits. We provide the mixing and mastering services you need to stand out in today&apos;s competitive music landscape.
            </p>
          </div>
        </AnimatedSection>
      </div>

      {/* Services Section */}
      <div id="main-content" className="panel-3d-surface rounded-2xl p-6 md:p-8 mb-12">
        <ErrorBoundary
          fallback={
            <ErrorFallback
              variant="card"
              message="Unable to load services. Please try refreshing the page."
              onRetry={() => window.location.reload()}
            />
          }
        >
          <AnimatedSection animation="fadeIn" delay={100}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
              {services.length > 0 ? (
                services.map((service, index) => (
                  <AnimatedSection key={service.id} animation="slideUp" delay={200 + index * 150}>
                    <div className="card-3d-spline rounded-xl p-6 h-full flex flex-col">
                      {/* Icon */}
                      <div className="w-16 h-16 bg-gradient-to-br from-3d-spline-primary to-3d-spline-accent rounded-full flex items-center justify-center mx-auto">
                        <Icon as={SlidersHorizontal} className="h-6 w-6 text-white" />
                      </div>

                      {/* Content */}
                      <div className="mt-4 text-center space-y-3 flex-1 flex flex-col items-center">
                        <h3 className="text-xl font-semibold text-3d-spline-text-primary">{service.name}</h3>
                        <p className="text-3d-spline-text-muted text-sm">{service.short_description}</p>
                        <div className="text-2xl font-bold text-3d-spline-primary">${service.price}</div>
                        <div className="text-sm text-3d-spline-text-muted min-h-[24px]">
                          {service.original_price && (
                            <>
                              <span className="line-through">${service.original_price}</span>
                              <span className="ml-2 text-3d-spline-accent">
                                Save {getDiscountPercentage(service.original_price, service.price)}%
                              </span>
                            </>
                          )}
                        </div>
                        <p className="text-xs text-3d-spline-text-muted">Turnaround: {service.turnaround_time}</p>
                      </div>

                      {/* CTA */}
                      <div className="pt-4">
                      <Button 
                        variant="primary" 
                        size="sm" 
                        onClick={() => handleBookClick(service)}
                        className="w-full"
                        aria-label={`Book ${service.name} service for $${service.price}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleBookClick(service);
                          }
                        }}
                      >
                        Book Now
                      </Button>
                      </div>
                    </div>
                  </AnimatedSection>
                ))
              ) : (
                <div className="col-span-full">
                  {/* Loading skeleton for services */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <SkeletonCard 
                        key={index} 
                        variant="service" 
                        className="h-full"
                      />
                    ))}
                  </div>
                  <div className="text-center mt-8">
                    <LoadingSpinner size="lg" variant="pulse" color="teal" />
                    <p className="text-3d-spline-text-muted mt-4">
                      Loading services...
                    </p>
                  </div>
                </div>
              )}
            </div>
          </AnimatedSection>
        </ErrorBoundary>
      </div>

      {/* Process Section */}
      <div className="card-3d-spline rounded-2xl p-8 mb-12">
        <AnimatedSection animation="fadeIn" delay={200}>
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-3d-spline-text-primary mb-4">
              Our <span className="text-3d-spline-accent">Process</span>
            </h2>
            <p className="text-3d-spline-text-secondary text-lg">
              Simple, transparent, and professional workflow
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-3d-spline-primary to-3d-spline-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">{index + 1}</span>
                </div>
                <h3 className="text-lg font-semibold text-3d-spline-text-primary mb-2">
                  {step.title}
                </h3>
                <p className="text-3d-spline-text-secondary text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>

      {/* Service Comparison */}
      <div className="card-3d-spline rounded-2xl p-8 mb-12">
        <AnimatedSection animation="fadeIn" delay={300}>
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-3d-spline-text-primary mb-4">
              Service <span className="text-3d-spline-accent">Comparison</span>
            </h2>
            <p className="text-3d-spline-text-secondary text-lg">
              Choose the right service for your needs
            </p>
          </div>
          
          <ErrorBoundary
            fallback={
              <ErrorFallback
                variant="card"
                message="Unable to load service comparison. Please try refreshing the page."
                onRetry={() => window.location.reload()}
              />
            }
          >
            {services.length > 0 ? (
              <ServiceComparison services={services} />
            ) : (
              <div className="text-center py-12">
                <LoadingSpinner size="lg" variant="pulse" color="teal" />
                <p className="text-3d-spline-text-muted mt-4">
                  Loading service comparison...
                </p>
              </div>
            )}
          </ErrorBoundary>
        </AnimatedSection>
      </div>

      {/* FAQ Section */}
      <div className="card-3d-spline rounded-2xl p-8 mb-12">
        <AnimatedSection animation="fadeIn" delay={400}>
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-3d-spline-text-primary mb-4">
              Frequently Asked <span className="text-3d-spline-accent">Questions</span>
            </h2>
            <p className="text-3d-spline-text-secondary text-lg">
              Everything you need to know about our services
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <ErrorBoundary
              fallback={
                <ErrorFallback
                  variant="inline"
                  message="Unable to load FAQ section. Please try refreshing the page."
                  onRetry={() => window.location.reload()}
                />
              }
            >
              {faqs.length > 0 ? (
                <FaqAccordion items={faqs} />
              ) : (
                <div className="text-center py-8">
                  <LoadingSpinner size="md" variant="pulse" color="teal" />
                  <p className="text-3d-spline-text-muted mt-4">
                    Loading FAQ section...
                  </p>
                </div>
              )}
            </ErrorBoundary>
          </div>
        </AnimatedSection>
      </div>

      {/* CTA Section */}
      <div className="card-3d-spline rounded-2xl p-8 mb-12">
        <AnimatedSection animation="fadeIn" delay={500}>
          <div className="text-center">
            <h2 className="text-4xl font-bold text-3d-spline-text-primary mb-4">
              Ready to Transform Your Sound?
            </h2>
            <p className="text-xl text-3d-spline-text-secondary mb-8 max-w-2xl mx-auto">
              Join hundreds of artists who trust us with their music. Get started today and hear the difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button 
                  variant="primary"
                  size="lg"
                  aria-label="Get started with our audio services"
                >
                  Get Started
                </Button>
              </Link>
              <Link href="/consultation">
                <Button 
                  variant="primary"
                  size="lg"
                  aria-label="Book a consultation to discuss your project"
                >
                  Book Consultation
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button 
                  variant="secondary"
                  size="lg"
                  aria-label="View our portfolio of completed projects"
                >
                  View Portfolio
                </Button>
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* Service Booking Modal */}
      <ErrorBoundary
        fallback={
          <ErrorFallback
            variant="inline"
            message="Unable to load booking modal. Please try again."
            onRetry={() => setIsModalOpen(false)}
          />
        }
      >
        <ServiceBookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          service={selectedService}
        />
      </ErrorBoundary>
    </>
  );
};

export async function getStaticProps() {
  try {
    const [services, faqs] = await Promise.all([
      getActiveServices(),
      getActiveFaqs(),
    ]);

    return {
      props: {
        services: services || [],
        faqs: faqs || [],
        use3DSplineBackground: true,
      },
      revalidate: 300,
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    
    // Return fallback data to prevent build failure
    return {
      props: {
        services: [],
        faqs: [
          {
            question: 'What file formats should I send?',
            answer: 'For mixing: Send individual stems as WAV files (24-bit, 44.1kHz or higher). For mastering: Send your final mix as a WAV file (24-bit, 44.1kHz or higher). Avoid MP3 files for the best quality.'
          },
          {
            question: 'What is the turnaround time?',
            answer: 'Standard turnaround is 3-5 business days for mixing and 1-2 business days for mastering. Rush delivery options are available for an additional fee.'
          },
          {
            question: 'How many revisions are included?',
            answer: 'Our mixing packages include 2 free revisions, and mastering includes 1 free revision. Additional revisions can be purchased if needed.'
          }
        ],
        use3DSplineBackground: true,
      },
      revalidate: 300,
    };
  }
}

export default Services;
