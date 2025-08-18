import React from 'react';
import Link from 'next/link';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientText } from '../components/ui/GradientText';
import { PremiumContainer } from '../components/ui/PremiumContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import AnimatedSection from '../components/ui/AnimatedSection';

export default function Phase2Demo() {
  return (
    <div className="min-h-screen bg-gradient-premium">
      <PremiumContainer variant="hero" background="none" padding="lg">
        <AnimatedSection animation="fadeIn">
          <h1 className="text-5xl font-bold text-white text-center mb-4">
            Phase 2: <GradientText gradient="teal-blue">Integration</GradientText>
          </h1>
          <p className="text-xl text-gray-300 text-center mb-12">
            Mathematical Color Harmony Applied Across All Pages
          </p>
        </AnimatedSection>
      </PremiumContainer>

      {/* Integration Overview */}
      <PremiumContainer variant="section" background="glass" padding="lg">
        <AnimatedSection animation="fadeIn" delay={100}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Enhanced <GradientText gradient="amber-teal">Pages</GradientText>
            </h2>
            <p className="text-gray-300 max-w-3xl mx-auto">
              All main pages have been enhanced with Phase 1 components and mathematical color harmony
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimatedSection animation="slideUp" delay={200}>
            <Card variant="warm" hover scale>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">🏠</span>
                </div>
                <h3 className="text-xl font-semibold text-white">Home Page</h3>
                <p className="text-gray-300 text-sm">Enhanced with PremiumContainer, GlassCard, and mathematical harmony</p>
                <Button variant="amber" size="sm">
                  <Link href="/" className="text-white">View Home</Link>
                </Button>
              </div>
            </Card>
          </AnimatedSection>

          <AnimatedSection animation="slideUp" delay={300}>
            <Card variant="cool" hover scale>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">🎚️</span>
                </div>
                <h3 className="text-xl font-semibold text-white">Services Page</h3>
                <p className="text-gray-300 text-sm">Professional audio services with enhanced UI components</p>
                <Button variant="teal" size="sm">
                  <Link href="/services" className="text-white">View Services</Link>
                </Button>
              </div>
            </Card>
          </AnimatedSection>

          <AnimatedSection animation="slideUp" delay={400}>
            <Card variant="premium" hover scale>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">🎵</span>
                </div>
                <h3 className="text-xl font-semibold text-white">Beats Page</h3>
                <p className="text-gray-300 text-sm">Beat store with enhanced filtering and card components</p>
                <Button variant="gradient" size="sm">
                  <Link href="/beats" className="text-white">View Beats</Link>
                </Button>
              </div>
            </Card>
          </AnimatedSection>
        </div>
      </PremiumContainer>

      {/* Mathematical Color Harmony Showcase */}
      <PremiumContainer variant="section" background="premium" padding="lg">
        <AnimatedSection animation="fadeIn" delay={100}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Mathematical <GradientText gradient="teal-blue">Color Harmony</GradientText>
            </h2>
            <p className="text-gray-300 max-w-3xl mx-auto">
              Perfect color relationships applied consistently across all components and pages
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatedSection animation="scaleIn" delay={200}>
            <GlassCard variant="warm" className="text-center">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Amber (38°)</h3>
                <div className="w-full h-8 bg-gradient-to-r from-amber-400 to-amber-600 rounded"></div>
                <p className="text-gray-300 text-sm">Warm accent color for CTAs and highlights</p>
                <Button variant="amber" size="sm">Amber Button</Button>
              </div>
            </GlassCard>
          </AnimatedSection>

          <AnimatedSection animation="scaleIn" delay={300}>
            <GlassCard variant="cool" className="text-center">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Teal (165°)</h3>
                <div className="w-full h-8 bg-gradient-to-r from-teal-400 to-teal-600 rounded"></div>
                <p className="text-gray-300 text-sm">Primary brand color for main elements</p>
                <Button variant="teal" size="sm">Teal Button</Button>
              </div>
            </GlassCard>
          </AnimatedSection>

          <AnimatedSection animation="scaleIn" delay={400}>
            <GlassCard variant="elevated" className="text-center">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Blue (217°)</h3>
                <div className="w-full h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded"></div>
                <p className="text-gray-300 text-sm">Secondary accent for gradients and depth</p>
                <Button variant="gradient" size="sm">Gradient Button</Button>
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>

        <AnimatedSection animation="fadeIn" delay={500}>
          <div className="text-center mt-12">
            <h3 className="text-2xl font-semibold text-white mb-6">Harmonious Combinations</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-amber-400 to-teal-400 rounded-lg p-4">
                <span className="text-white font-semibold">Amber → Teal</span>
              </div>
              <div className="bg-gradient-to-r from-teal-400 to-blue-500 rounded-lg p-4">
                <span className="text-white font-semibold">Teal → Blue</span>
              </div>
              <div className="bg-gradient-to-r from-amber-400 to-blue-500 rounded-lg p-4">
                <span className="text-white font-semibold">Amber → Blue</span>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </PremiumContainer>

      {/* Component Integration Examples */}
      <PremiumContainer variant="section" background="glass" padding="lg">
        <AnimatedSection animation="fadeIn" delay={100}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Component <GradientText gradient="amber-teal">Integration</GradientText>
            </h2>
            <p className="text-gray-300 max-w-3xl mx-auto">
              Phase 1 components seamlessly integrated across all pages
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatedSection animation="slideUp" delay={200}>
            <Card variant="warm" className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Enhanced Cards</h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-amber-500/10 to-amber-300/5 rounded-lg p-3">
                  <p className="text-gray-300 text-sm">Warm variant with amber tones</p>
                </div>
                <div className="bg-gradient-to-br from-teal-500/10 to-teal-300/5 rounded-lg p-3">
                  <p className="text-gray-300 text-sm">Cool variant with teal tones</p>
                </div>
                <div className="bg-gradient-premium rounded-lg p-3">
                  <p className="text-gray-300 text-sm">Premium variant with sophisticated styling</p>
                </div>
              </div>
            </Card>
          </AnimatedSection>

          <AnimatedSection animation="slideUp" delay={300}>
            <Card variant="cool" className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Enhanced Buttons</h3>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button variant="gradient" size="sm">Gradient</Button>
                  <Button variant="premium" size="sm">Premium</Button>
                  <Button variant="teal" size="sm">Teal</Button>
                  <Button variant="amber" size="sm">Amber</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="gradient" size="sm" glow>Glow</Button>
                  <Button variant="teal" size="sm" glow>Glow</Button>
                </div>
              </div>
            </Card>
          </AnimatedSection>
        </div>
      </PremiumContainer>

      {/* Performance & Accessibility */}
      <PremiumContainer variant="section" background="premium" padding="lg">
        <AnimatedSection animation="fadeIn" delay={100}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Performance & <GradientText gradient="teal-blue">Accessibility</GradientText>
            </h2>
            <p className="text-gray-300 max-w-3xl mx-auto">
              Optimized animations and WCAG compliant design
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatedSection animation="scaleIn" delay={200}>
            <Card variant="cool" className="text-center">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-lg">⚡</span>
                </div>
                <h3 className="text-lg font-semibold text-white">GPU Accelerated</h3>
                <p className="text-gray-300 text-sm">60fps animations using transform and opacity</p>
              </div>
            </Card>
          </AnimatedSection>

          <AnimatedSection animation="scaleIn" delay={300}>
            <Card variant="warm" className="text-center">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-lg">♿</span>
                </div>
                <h3 className="text-lg font-semibold text-white">WCAG Compliant</h3>
                <p className="text-gray-300 text-sm">High contrast ratios and keyboard navigation</p>
              </div>
            </Card>
          </AnimatedSection>

          <AnimatedSection animation="scaleIn" delay={400}>
            <Card variant="premium" className="text-center">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-lg">🎯</span>
                </div>
                <h3 className="text-lg font-semibold text-white">Reduced Motion</h3>
                <p className="text-gray-300 text-sm">Respects user preferences for motion</p>
              </div>
            </Card>
          </AnimatedSection>

          <AnimatedSection animation="scaleIn" delay={500}>
            <Card variant="cool" className="text-center">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-lg">📱</span>
                </div>
                <h3 className="text-lg font-semibold text-white">Mobile Optimized</h3>
                <p className="text-gray-300 text-sm">Responsive design across all devices</p>
              </div>
            </Card>
          </AnimatedSection>
        </div>
      </PremiumContainer>

      {/* Integration Success */}
      <PremiumContainer variant="section" background="glass" padding="lg">
        <AnimatedSection animation="fadeIn" delay={100}>
          <div className="text-center space-y-8">
            <h2 className="text-4xl font-bold text-white">
              Phase 2 <GradientText gradient="teal-blue">Integration Complete</GradientText>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              All main pages have been successfully enhanced with mathematical color harmony and Phase 1 components. 
              The design system is now consistently applied across the entire AudioServiceApp.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="gradient" size="xl" glow>
                <Link href="/" className="text-white">View Home Page</Link>
              </Button>
              <Button variant="premium" size="xl">
                                  <Link href="/services" className="text-white">View Services</Link>
              </Button>
              <Button variant="teal" size="xl">
                                  <Link href="/beats" className="text-white">View Beats</Link>
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </PremiumContainer>
    </div>
  );
} 