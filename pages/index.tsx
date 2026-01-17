import React from 'react';
import { Check } from 'lucide-react';
import { Icon } from '../components/ui/Icon';
import Link from 'next/link';
import Image from 'next/image';
import { GetServerSideProps } from 'next';
// import BeatCard from '../components/BeatCard';
// import { useUnifiedAudio } from '../components/audio/UnifiedAudioContext';
// import { useCart } from '../components/ui/CartContext';
import Button from '../components/ui/Button';
import GlowBorderButton from '../components/ui/GlowBorderButton';
import AnimatedSection from '../components/ui/AnimatedSection';
import { getHeroImage } from '../lib/hero-config';
import { supabase } from '../lib/supabase';
import { Service } from '../types/service';
import { Beat } from '../types/beat';

interface HomeProps {
  beats: Beat[];
  services: Service[];
}
const Home: React.FC<HomeProps> = ({ /* beats, */ services }) => {
  const heroImage = getHeroImage('home');
  // const { playBeat } = useUnifiedAudio();
  // const { addToCart } = useCart();

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
          <div className="text-center space-y-12">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold text-3d-spline-text-primary text-balance">
                Professional <span className="text-3d-spline-accent">Audio Services</span> for Serious Artists
              </h1>
              <p className="text-lg md:text-xl leading-relaxed font-sans max-w-3xl mx-auto text-3d-spline-text-secondary">
                Industry-level beats, mixing, and mastering services. Transform your music from demo to release-ready.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/beats">
                <GlowBorderButton>
                  Browse Beats
                </GlowBorderButton>
              </Link>
              <Link href="/services">
                <Button
                  variant="spline-secondary"
                  size="lg"
                >
                  View Services
                </Button>
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* Featured Beats Section - TEMPORARILY HIDDEN UNTIL BEATS ARE UPLOADED */}
      {/* 
      <div className="card-3d-spline rounded-2xl p-8 mb-12">
        <AnimatedSection animation="fadeIn" delay={100}>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-3d-spline-text-primary mb-6">
              Featured <span className="text-3d-spline-accent">Beats</span>
            </h2>
            <p className="text-xl text-3d-spline-text-secondary max-w-2xl mx-auto leading-relaxed">
              Latest releases from our premium collection. Preview, add to cart, or purchase directly.
            </p>
          </div>
        </AnimatedSection>
        
        <AnimatedSection animation="fadeIn" delay={200}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(beats || []).map((beat, index) => (
              <AnimatedSection 
                key={beat.id} 
                animation="slideUp" 
                delay={300 + index * 100}
              >
                <BeatCard
                  beat={beat}
                  variant="glass"
                  onPlayPreview={playBeat}
                  onAddToCart={(b) => addToCart({ beat: b, license: 'mp3' })}
                />
              </AnimatedSection>
            ))}
          </div>
        </AnimatedSection>
        
        <AnimatedSection animation="fadeIn" delay={600}>
            <div className="text-center mt-8">
              <Link href="/beats">
                <Button variant="spline-primary" size="lg" className="btn-3d-spline">
                  View All Beats
                </Button>
              </Link>
            </div>
        </AnimatedSection>
      </div>
      */}

      {/* Services Section */}
      <div className="card-3d-spline rounded-2xl p-8 mb-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-3d-spline-text-primary mb-6">
            Our <span className="text-3d-spline-accent">Services</span>
          </h2>
          <p className="text-xl text-3d-spline-text-secondary max-w-2xl mx-auto leading-relaxed">
            Professional audio services to elevate your music. From mixing and mastering to custom production.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(services || []).map((service) => (
            <div key={service.id} className="card-3d-spline rounded-xl p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-3d-spline-text-primary mb-4">
                  {service.name}
                </h3>
                <p className="text-3d-spline-text-secondary mb-6 h-12">
                  {service.short_description || service.description}
                </p>
                <div className="text-3d-spline-accent text-3xl font-bold mb-6">
                  ${service.price}
                </div>
              </div>
              <ul className="space-y-3">
                {(service.features || []).slice(0, 6).map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-3d-spline-text-secondary">
                    <Icon as={Check} className="h-4 w-4 text-3d-spline-accent mr-2" />
                    {feature}
                  </li>
                ))}
                {service.features && service.features.length > 6 && (
                  <li className="text-xs text-3d-spline-text-muted italic pl-6">
                    + {service.features.length - 6} more details on the services page
                  </li>
                )}
              </ul>
              <div className="mt-8">
                <Link href={`/services#${service.slug}`} passHref>
                  <Button
                    variant="spline-primary"
                    className="w-full btn-3d-spline"
                  >
                    View Service Details
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="card-3d-spline rounded-2xl p-8 mb-12">
        <div className="text-center space-y-8">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-3d-spline-text-primary">
              Ready to Level Up Your <span className="text-3d-spline-accent">Sound</span>?
            </h2>
            <p className="text-xl text-3d-spline-text-secondary max-w-2xl mx-auto leading-relaxed">
              Join hundreds of artists who have transformed their music with our professional services.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button
                variant="spline-primary"
                size="lg"
                className="btn-3d-spline animate-glow-3d"
              >
                Get Started Today
              </Button>
            </Link>
            <Link href="/services">
              <Button
                variant="spline-secondary"
                size="lg"
              >
                View Services
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Fetch featured beats via internal API to reuse normalization and fallbacks
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  let beats: Beat[] = [];
  try {
    const res = await fetch(`${baseUrl}/api/beats`);
    if (res.ok) {
      const data = await res.json();
      beats = Array.isArray(data) ? (data as Beat[]).slice(0, 4) : [];
    }
  } catch (e) {
    console.error('Error fetching featured beats:', e);
  }

  // Fetch featured services (e.g., the 3 with the lowest sort_order)
  const { data: services, error: servicesError } = await supabase
    .from('active_services')
    .select('*')
    .order('sort_order', { ascending: true })
    .limit(3);

  if (servicesError) {
    console.error('Error fetching home page services:', servicesError);
  }

  return {
    props: {
      beats: beats || [],
      services: services || [],
      use3DSplineBackground: true,
    },
  };
};

export default Home;
