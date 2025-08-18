import React from 'react';
import AnimatedSection from '../ui/AnimatedSection';
import { GlassCard } from '../ui/GlassCard';
import { GradientText } from '../ui/GradientText';

// Simple icon components
const MusicIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
  </svg>
);

const MixerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const DrumIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
}

const services: Service[] = [
  {
    id: 'mastering',
    title: 'Audio Mastering',
    description: 'Professional mastering to make your tracks radio-ready',
    icon: MusicIcon,
    features: ['Loudness optimization', 'Frequency balancing', 'Stereo enhancement']
  },
  {
    id: 'mixing',
    title: 'Mixing & Engineering',
    description: 'Expert mixing for balanced, professional sound',
    icon: MixerIcon,
    features: ['Level balancing', 'EQ & compression', 'Spatial placement']
  },
  {
    id: 'production',
    title: 'Beat Production',
    description: 'Custom beats tailored to your style and vision',
    icon: DrumIcon,
    features: ['Custom composition', 'Multiple genres', 'Stem delivery']
  }
];

export const ServiceGrid: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-premium">
      <div className="container mx-auto px-4">
        <AnimatedSection animation="fadeIn">
          <h2 className="text-4xl font-display font-medium text-center mb-16 text-white">
            Our <GradientText gradient="teal-blue">Services</GradientText>
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <AnimatedSection 
              key={service.id}
              delay={index * 100}
              animation="fadeIn"
            >
              <GlassCard gradient className="text-center hover:scale-105 transition-transform duration-300">
                <service.icon className="w-12 h-12 text-teal-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-white">
                  {service.title}
                </h3>
                <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-2 text-sm text-gray-400">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center justify-center">
                      <CheckIcon className="w-4 h-4 text-teal-400 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}; 