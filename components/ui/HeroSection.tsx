import React from 'react';
import AnimatedSection from './AnimatedSection';
import { GlassCard } from './GlassCard';
import { GradientText } from './GradientText';
import Image from 'next/image';

export const HeroSection: React.FC = () => {
  return (
    <section className="min-h-screen flex items-center justify-center py-20 bg-gradient-premium">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          
          {/* Left Column - Feature Cards */}
          <div className="space-y-8">
            <AnimatedSection delay={100} animation="fadeIn">
              <GlassCard gradient variant="cool">
                <div className="text-3xl mb-3">
                  <GradientText gradient="teal-blue">01</GradientText>
                </div>
                <p className="text-lg text-gray-300 font-medium">
                  Professional Audio Mastering
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Industry-standard mastering for your tracks
                </p>
              </GlassCard>
            </AnimatedSection>

            <AnimatedSection delay={300} animation="fadeIn">
              <GlassCard gradient variant="cool">
                <div className="text-3xl mb-3">
                  <GradientText gradient="teal-blue">03</GradientText>
                </div>
                <p className="text-lg text-gray-300 font-medium">
                  Beat Production
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Custom beats tailored to your style
                </p>
              </GlassCard>
            </AnimatedSection>
          </div>

          {/* Center Column - Hero Image */}
          <AnimatedSection delay={200} animation="scaleIn">
            <div className="flex justify-center">
              <div className="relative">
                <Image 
                  src="/assets/hero_images/A_digital_photograph_captures_a_close-up_of_a_prof.png" 
                  alt="Professional Audio Studio"
                  width={400}
                  height={400}
                  className="w-full max-w-md rounded-3xl shadow-2xl object-cover"
                />
                <div className="absolute -inset-1 bg-gradient-to-r from-teal-400 to-blue-500 rounded-3xl blur opacity-20"></div>
              </div>
            </div>
          </AnimatedSection>

          {/* Right Column - Main Headline */}
          <div className="space-y-8">
            <AnimatedSection delay={100} animation="fadeIn">
              <h1 className="text-5xl md:text-6xl font-display font-medium leading-tight text-white">
                Transform Your{' '}
                <GradientText gradient="amber-teal">Sound</GradientText>
              </h1>
              <p className="text-xl text-gray-300 mt-6 leading-relaxed">
                Professional audio services that elevate your music to the next level
              </p>
            </AnimatedSection>

            <AnimatedSection delay={200} animation="fadeIn">
              <GlassCard gradient variant="cool">
                <div className="text-3xl mb-3">
                  <GradientText gradient="teal-blue">02</GradientText>
                </div>
                <p className="text-lg text-gray-300 font-medium">
                  Vocal Production
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Professional vocal recording and mixing
                </p>
              </GlassCard>
            </AnimatedSection>

            <AnimatedSection delay={400} animation="fadeIn">
              <GlassCard gradient variant="cool">
                <div className="text-3xl mb-3">
                  <GradientText gradient="teal-blue">04</GradientText>
                </div>
                <p className="text-lg text-gray-300 font-medium">
                  Mixing & Engineering
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Expert mixing for balanced, professional sound
                </p>
              </GlassCard>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}; 