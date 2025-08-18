import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientText } from '../components/ui/GradientText';
import { PremiumContainer } from '../components/ui/PremiumContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import AnimatedSection from '../components/ui/AnimatedSection';

export default function Phase1Demo() {
  return (
    <div className="min-h-screen bg-gradient-premium">
      <PremiumContainer variant="hero" background="none" padding="lg">
        <AnimatedSection animation="fadeIn">
          <h1 className="text-5xl font-bold text-white text-center mb-4">
            Phase 1: <GradientText gradient="teal-blue">Component Enhancement</GradientText>
          </h1>
          <p className="text-xl text-gray-300 text-center mb-12">
            Mathematical Color Harmony & Premium Components
          </p>
        </AnimatedSection>
      </PremiumContainer>

      {/* Enhanced Card Component Showcase */}
      <PremiumContainer variant="section" background="none" padding="lg">
        <AnimatedSection animation="fadeIn" delay={100}>
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Enhanced <GradientText gradient="amber-teal">Card</GradientText> Component
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatedSection animation="fadeIn" delay={200}>
            <Card variant="warm" hover scale>
              <h3 className="text-xl font-semibold mb-3 text-white">Warm Variant</h3>
              <p className="text-gray-300 mb-4">Amber tones with glass morphism</p>
              <Button variant="amber" size="sm">Learn More</Button>
            </Card>
          </AnimatedSection>

          <AnimatedSection animation="fadeIn" delay={300}>
            <Card variant="cool" hover scale>
              <h3 className="text-xl font-semibold mb-3 text-white">Cool Variant</h3>
              <p className="text-gray-300 mb-4">Teal tones with glass morphism</p>
              <Button variant="teal" size="sm">Learn More</Button>
            </Card>
          </AnimatedSection>

          <AnimatedSection animation="fadeIn" delay={400}>
            <Card variant="premium" hover scale>
              <h3 className="text-xl font-semibold mb-3 text-white">Premium Variant</h3>
              <p className="text-gray-300 mb-4">Sophisticated premium styling</p>
              <Button variant="premium" size="sm">Learn More</Button>
            </Card>
          </AnimatedSection>

          <AnimatedSection animation="fadeIn" delay={500}>
            <Card variant="elevated" hover scale>
              <h3 className="text-xl font-semibold mb-3 text-white">Elevated Variant</h3>
              <p className="text-gray-300 mb-4">Enhanced shadows and depth</p>
              <Button variant="gradient" size="sm">Learn More</Button>
            </Card>
          </AnimatedSection>

          <AnimatedSection animation="fadeIn" delay={600}>
            <Card variant="glass" hover scale>
              <h3 className="text-xl font-semibold mb-3 text-white">Glass Variant</h3>
              <p className="text-gray-300 mb-4">Backdrop blur effects</p>
              <Button variant="secondary" size="sm">Learn More</Button>
            </Card>
          </AnimatedSection>

          <AnimatedSection animation="fadeIn" delay={700}>
            <Card variant="gradient" hover scale>
              <h3 className="text-xl font-semibold mb-3 text-white">Gradient Variant</h3>
              <p className="text-gray-300 mb-4">Gradient background styling</p>
              <Button variant="primary" size="sm">Learn More</Button>
            </Card>
          </AnimatedSection>
        </div>
      </PremiumContainer>

      {/* Enhanced Button Component Showcase */}
      <PremiumContainer variant="section" background="glass" padding="lg">
        <AnimatedSection animation="fadeIn" delay={100}>
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Enhanced <GradientText gradient="teal-blue">Button</GradientText> Component
          </h2>
        </AnimatedSection>

        <div className="space-y-8">
          {/* Gradient Buttons */}
          <AnimatedSection animation="fadeIn" delay={200}>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-4">Gradient Variants</h3>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="gradient" size="lg">Gradient Button</Button>
                <Button variant="premium" size="lg">Premium Button</Button>
                <Button variant="teal" size="lg">Teal Button</Button>
                <Button variant="amber" size="lg">Amber Button</Button>
              </div>
            </div>
          </AnimatedSection>

          {/* Glow Buttons */}
          <AnimatedSection animation="fadeIn" delay={300}>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-4">Glow Effects</h3>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="gradient" size="md" glow>Glow Gradient</Button>
                <Button variant="teal" size="md" glow>Glow Teal</Button>
                <Button variant="amber" size="md" glow>Glow Amber</Button>
              </div>
            </div>
          </AnimatedSection>

          {/* Size Variants */}
          <AnimatedSection animation="fadeIn" delay={400}>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-4">Size Variants</h3>
              <div className="flex flex-wrap justify-center items-center gap-4">
                <Button variant="gradient" size="sm">Small</Button>
                <Button variant="gradient" size="md">Medium</Button>
                <Button variant="gradient" size="lg">Large</Button>
                <Button variant="gradient" size="xl">Extra Large</Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </PremiumContainer>

      {/* PremiumContainer Showcase */}
      <PremiumContainer variant="section" background="premium" padding="lg">
        <AnimatedSection animation="fadeIn" delay={100}>
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            <GradientText gradient="teal-blue">PremiumContainer</GradientText> Component
          </h2>
        </AnimatedSection>

        <div className="space-y-8">
          <AnimatedSection animation="fadeIn" delay={200}>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-4">Container Variants</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-white mb-2">Narrow Container</h4>
                  <p className="text-gray-300 text-sm">Max width: 4xl (896px)</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-white mb-2">Wide Container</h4>
                  <p className="text-gray-300 text-sm">Max width: 7xl (1344px)</p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeIn" delay={300}>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-4">Background Variants</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-premium rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-white mb-2">Premium</h4>
                  <p className="text-gray-300 text-sm">Gradient premium background</p>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-white mb-2">Glass</h4>
                  <p className="text-gray-300 text-sm">Glass morphism effect</p>
                </div>
                <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-white mb-2">Gradient</h4>
                  <p className="text-gray-300 text-sm">Dark gradient background</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </PremiumContainer>

      {/* GlassCard vs Enhanced Card Comparison */}
      <PremiumContainer variant="section" background="none" padding="lg">
        <AnimatedSection animation="fadeIn" delay={100}>
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            <GradientText gradient="amber-teal">GlassCard</GradientText> vs Enhanced Card
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatedSection animation="fadeIn" delay={200}>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-4">GlassCard Component</h3>
              <GlassCard variant="warm" className="mb-4">
                <h4 className="text-lg font-semibold text-white mb-2">Warm Variant</h4>
                <p className="text-gray-300 text-sm">Specialized glass morphism</p>
              </GlassCard>
              <GlassCard variant="cool" className="mb-4">
                <h4 className="text-lg font-semibold text-white mb-2">Cool Variant</h4>
                <p className="text-gray-300 text-sm">Teal glass effects</p>
              </GlassCard>
              <GlassCard variant="elevated">
                <h4 className="text-lg font-semibold text-white mb-2">Elevated Variant</h4>
                <p className="text-gray-300 text-sm">Enhanced shadows</p>
              </GlassCard>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeIn" delay={300}>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-4">Enhanced Card Component</h3>
              <Card variant="warm" className="mb-4">
                <h4 className="text-lg font-semibold text-white mb-2">Warm Variant</h4>
                <p className="text-gray-300 text-sm">Enhanced with new variants</p>
              </Card>
              <Card variant="cool" className="mb-4">
                <h4 className="text-lg font-semibold text-white mb-2">Cool Variant</h4>
                <p className="text-gray-300 text-sm">Mathematical harmony</p>
              </Card>
              <Card variant="premium">
                <h4 className="text-lg font-semibold text-white mb-2">Premium Variant</h4>
                <p className="text-gray-300 text-sm">Sophisticated styling</p>
              </Card>
            </div>
          </AnimatedSection>
        </div>
      </PremiumContainer>

      {/* Mathematical Color Harmony Showcase */}
      <PremiumContainer variant="section" background="glass" padding="lg">
        <AnimatedSection animation="fadeIn" delay={100}>
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Mathematical <GradientText gradient="teal-blue">Color Harmony</GradientText>
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatedSection animation="fadeIn" delay={200}>
            <div className="text-center p-6 bg-gradient-to-br from-amber-500/10 to-amber-300/5 rounded-xl border border-amber-500/20">
              <h3 className="text-xl font-semibold text-white mb-2">Amber (38°)</h3>
              <p className="text-gray-300 text-sm mb-4">Warm accent color</p>
              <Button variant="amber" size="sm">Amber Button</Button>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeIn" delay={300}>
            <div className="text-center p-6 bg-gradient-to-br from-teal-500/10 to-teal-300/5 rounded-xl border border-teal-500/20">
              <h3 className="text-xl font-semibold text-white mb-2">Teal (165°)</h3>
              <p className="text-gray-300 text-sm mb-4">Primary brand color</p>
              <Button variant="teal" size="sm">Teal Button</Button>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeIn" delay={400}>
            <div className="text-center p-6 bg-gradient-to-br from-blue-500/10 to-blue-300/5 rounded-xl border border-blue-500/20">
              <h3 className="text-xl font-semibold text-white mb-2">Blue (217°)</h3>
              <p className="text-gray-300 text-sm mb-4">Secondary accent</p>
              <Button variant="gradient" size="sm">Gradient Button</Button>
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection animation="fadeIn" delay={500}>
          <div className="text-center mt-8">
            <h3 className="text-xl font-semibold text-white mb-4">Harmonious Gradients</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-gradient-to-r from-amber-400 to-teal-400 rounded-lg px-6 py-3">
                <span className="text-white font-semibold">Amber → Teal</span>
              </div>
              <div className="bg-gradient-to-r from-teal-400 to-blue-500 rounded-lg px-6 py-3">
                <span className="text-white font-semibold">Teal → Blue</span>
              </div>
              <div className="bg-gradient-to-r from-amber-400 to-blue-500 rounded-lg px-6 py-3">
                <span className="text-white font-semibold">Amber → Blue</span>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </PremiumContainer>
    </div>
  );
} 