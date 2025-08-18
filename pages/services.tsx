import React, { useState } from 'react';
import Image from 'next/image';
import { GetServerSideProps } from 'next';
import FaqAccordion from '../components/shared/FaqAccordion';
import Button from '../components/ui/Button';
import Link from 'next/link';
import ServiceBookingModal from '../components/ServiceBookingModal';
import AnimatedSection from '../components/ui/AnimatedSection';
import { getDiscountPercentage } from '../lib/pricing-utils';
import ServiceComparison from '../components/services/ServiceComparison';
import { getHeroImage } from '../lib/hero-config';
import { supabase } from '../lib/supabase';
import { Service } from '../types/service';

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
    console.log('handleBookClick called with service:', service);
    setSelectedService(service);
    setIsModalOpen(true);
    console.log('Modal state set to open, selectedService:', service, 'isModalOpen:', true);
  };

  return (
    <>
      {/* Hero Section */}
      <div className="card-3d-spline rounded-2xl p-8 mb-12 hero-background-enhanced hero-card-enhanced">
        {/* Background Image with configurable opacity */}
        <div className="hero-background-image" style={{ opacity: (heroImage.opacity || 60) / 100 }}>
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
      <div className="mb-12">
        <AnimatedSection animation="fadeIn" delay={100}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.length > 0 ? (
              services.map((service, index) => (
                <AnimatedSection key={service.id} animation="slideUp" delay={200 + index * 150}>
                  <div className="card-3d-spline rounded-xl p-6">
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-3d-spline-primary to-3d-spline-accent rounded-full flex items-center justify-center mx-auto">
                        <span className="text-2xl">🎚️</span>
                      </div>
                      <div className="text-center space-y-3">
                        <h3 className="text-xl font-semibold text-3d-spline-text-primary">{service.name}</h3>
                        <p className="text-3d-spline-text-muted text-sm">{service.short_description}</p>
                        <div className="text-2xl font-bold text-3d-spline-primary">${service.price}</div>
                        {service.original_price && (
                          <div className="text-sm text-3d-spline-text-muted">
                            <span className="line-through">${service.original_price}</span>
                            <span className="ml-2 text-3d-spline-accent">
                              Save {getDiscountPercentage(service.original_price, service.price)}%
                            </span>
                          </div>
                        )}
                        <p className="text-xs text-3d-spline-text-muted">Turnaround: {service.turnaround_time}</p>
                        <Button 
                          variant="primary" 
                          size="sm" 
                          onClick={() => handleBookClick(service)}
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))
            ) : (
              <div className="col-span-full text-center text-3d-spline-text-muted py-12">
                <p>No services are available at this time. Please check back later.</p>
              </div>
            )}
          </div>
        </AnimatedSection>
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
          
          <ServiceComparison />
        </AnimatedSection>
      </div>

      {/* FAQ Section */}
      {faqs.length > 0 && (
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
              <FaqAccordion items={faqs} />
            </div>
          </AnimatedSection>
        </div>
      )}

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
                >
                  Get Started
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button 
                  variant="secondary"
                  size="lg"
                >
                  View Portfolio
                </Button>
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* Service Booking Modal */}
      <ServiceBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={selectedService}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Fetch active services from the 'active_services' view you created
  const { data: services, error: servicesError } = await supabase
    .from('active_services')
    .select('*');

  // Fetch active FAQs from the 'active_faqs' view
  const { data: faqs, error: faqsError } = await supabase
    .from('active_faqs')
    .select('question, answer');

  if (servicesError || faqsError) {
    console.error('Error fetching data:', servicesError || faqsError);
    // You might want to handle this error more gracefully
  }

  return {
    props: {
      services: services || [],
      faqs: faqs || [],
      use3DSplineBackground: true,
    },
  };
};

export default Services;
