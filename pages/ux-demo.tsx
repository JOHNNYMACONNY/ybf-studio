import React from 'react';
import { HeroSection } from '../components/ui/HeroSection';
import { ServiceGrid } from '../components/services/ServiceGrid';
import { BeforeAfterPlayer } from '../components/audio/BeforeAfterPlayer';
import { BeatGrid } from '../components/beats/BeatGrid';
import { FloatingPlayer } from '../components/audio/FloatingPlayer';
import { AnimatedBackground } from '../components/ui/AnimatedBackground';
import { ProgressSteps } from '../components/checkout/ProgressSteps';
import { LicenseSelection } from '../components/checkout/LicenseSelection';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientText } from '../components/ui/GradientText';
import AnimatedSection from '../components/ui/AnimatedSection';

export default function UXDemo() {
  return (
    <div className="min-h-screen bg-gradient-premium">
      <AnimatedBackground />
      
      {/* Header area (demo-only) without injecting nav, rely on app header */}
      <header className="relative z-10 bg-gray-900/50 backdrop-blur-sm border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-white">
              <GradientText gradient="teal-blue">YBF Studio</GradientText>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection />

      {/* Service Grid */}
      <ServiceGrid />

      {/* Before/After Player */}
      <BeforeAfterPlayer />

      {/* Beat Grid */}
      <BeatGrid />

      {/* Checkout Demo Section */}
      <section className="py-20 bg-gradient-premium">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fadeIn">
            <h2 className="text-4xl font-display font-medium text-center mb-16 text-white">
              Checkout <GradientText gradient="teal-blue">Experience</GradientText>
            </h2>
          </AnimatedSection>

          <div className="max-w-4xl mx-auto">
            <GlassCard className="p-8" variant="elevated">
              <ProgressSteps 
                currentStep={2} 
                steps={['Cart', 'License', 'Payment', 'Complete']} 
              />
              
              <div className="mt-8">
                <LicenseSelection />
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Loading Demo Section */}
      <section className="py-20 bg-gradient-premium">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fadeIn">
            <h2 className="text-4xl font-display font-medium text-center mb-16 text-white">
              Loading <GradientText gradient="teal-blue">States</GradientText>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <LoadingSpinner size="sm" className="mb-4" />
              <p className="text-gray-300">Small Spinner</p>
            </div>
            <div className="text-center">
              <LoadingSpinner size="md" className="mb-4" />
              <p className="text-gray-300">Medium Spinner</p>
            </div>
            <div className="text-center">
              <LoadingSpinner size="lg" className="mb-4" />
              <p className="text-gray-300">Large Spinner</p>
            </div>
          </div>
        </div>
      </section>

      {/* Component Showcase */}
      <section className="py-20 bg-gradient-premium">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fadeIn">
            <h2 className="text-4xl font-display font-medium text-center mb-16 text-white">
              Component <GradientText gradient="teal-blue">Showcase</GradientText>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatedSection delay={100} animation="fadeIn">
              <GlassCard variant="warm">
                <h3 className="text-xl font-semibold mb-3 text-white">Warm Variant</h3>
                <p className="text-gray-300">Glass card with warm amber tones</p>
              </GlassCard>
            </AnimatedSection>

            <AnimatedSection delay={200} animation="fadeIn">
              <GlassCard variant="cool">
                <h3 className="text-xl font-semibold mb-3 text-white">Cool Variant</h3>
                <p className="text-gray-300">Glass card with cool teal tones</p>
              </GlassCard>
            </AnimatedSection>

            <AnimatedSection delay={300} animation="fadeIn">
              <GlassCard variant="elevated">
                <h3 className="text-xl font-semibold mb-3 text-white">Elevated Variant</h3>
                <p className="text-gray-300">Glass card with elevated styling</p>
              </GlassCard>
            </AnimatedSection>

            <AnimatedSection delay={400} animation="fadeIn">
              <GlassCard gradient>
                <h3 className="text-xl font-semibold mb-3 text-white">Gradient Variant</h3>
                <p className="text-gray-300">Glass card with gradient background</p>
              </GlassCard>
            </AnimatedSection>

            <AnimatedSection delay={500} animation="fadeIn">
              <div className="text-center p-6">
                <h3 className="text-xl font-semibold mb-3 text-white">Gradient Text</h3>
                <p className="text-2xl">
                  <GradientText gradient="amber-teal">Amber to Teal</GradientText>
                </p>
                <p className="text-2xl mt-2">
                  <GradientText gradient="teal-emerald">Teal to Emerald</GradientText>
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={600} animation="fadeIn">
              <div className="text-center p-6">
                <h3 className="text-xl font-semibold mb-3 text-white">Premium Gradients</h3>
                <p className="text-2xl">
                  <GradientText gradient="teal-blue">Teal to Blue</GradientText>
                </p>
                <p className="text-2xl mt-2">
                  <GradientText gradient="purple-pink">Purple to Pink</GradientText>
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Floating Player */}
      <FloatingPlayer />
    </div>
  );
} 