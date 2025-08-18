import React, { useState } from 'react';
import { PremiumContainer } from '../components/ui/PremiumContainer';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientText } from '../components/ui/GradientText';
import { AdvancedButton } from '../components/ui/AdvancedButton';
import { AnimatedBackground } from '../components/ui/AnimatedBackground';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ParticleSystem } from '../components/ui/ParticleSystem';
import { VisualEffects, GlowEffect } from '../components/ui/VisualEffects';
import { AnimatedGrid, GridOverlay } from '../components/ui/AnimatedGrid';

export default function Phase6Demo() {
  const [activeBackground, setActiveBackground] = useState<'default' | 'premium' | 'minimal' | 'particles' | 'gradient'>('premium');
  const [activeSpinner, setActiveSpinner] = useState<'default' | 'ring' | 'pulse' | 'dots' | 'bars'>('default');
  const [activeParticles, setActiveParticles] = useState<'default' | 'premium' | 'minimal' | 'stars' | 'music'>('premium');

  return (
    <div className="min-h-screen bg-gradient-premium">
      {/* Animated Background */}
      <AnimatedBackground variant={activeBackground} intensity="medium" />
      
      <PremiumContainer variant="wide" background="none" padding="xl">
        {/* Header */}
        <div className="text-center mb-16">
          <GradientText className="text-6xl font-bold mb-6">
            Phase 6: Visual Enhancements
          </GradientText>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Advanced visual enhancement components with mathematical harmony colors, 
            sophisticated animations, and premium visual effects
          </p>
        </div>

        {/* Background Controls */}
        <GlassCard className="mb-12">
          <h3 className="text-lg font-semibold text-white mb-4">Animated Background Controls</h3>
          <div className="flex flex-wrap gap-3">
            {(['default', 'premium', 'minimal', 'particles', 'gradient'] as const).map((variant) => (
              <AdvancedButton
                key={variant}
                variant={activeBackground === variant ? 'gradient' : 'ghost'}
                size="sm"
                onClick={() => setActiveBackground(variant)}
              >
                {variant.charAt(0).toUpperCase() + variant.slice(1)}
              </AdvancedButton>
            ))}
          </div>
        </GlassCard>

        {/* Loading Spinners Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <GlassCard>
            <h3 className="text-lg font-semibold text-white mb-4">Loading Spinners</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Default:</span>
                <LoadingSpinner variant="default" size="md" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Ring:</span>
                <LoadingSpinner variant="ring" size="md" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Pulse:</span>
                <LoadingSpinner variant="pulse" size="md" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Dots:</span>
                <LoadingSpinner variant="dots" size="md" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Bars:</span>
                <LoadingSpinner variant="bars" size="md" />
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-lg font-semibold text-white mb-4">Spinner Controls</h3>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {(['default', 'ring', 'pulse', 'dots', 'bars'] as const).map((variant) => (
                  <AdvancedButton
                    key={variant}
                    variant={activeSpinner === variant ? 'gradient' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveSpinner(variant)}
                  >
                    {variant.charAt(0).toUpperCase() + variant.slice(1)}
                  </AdvancedButton>
                ))}
              </div>
              <div className="flex justify-center p-8">
                <LoadingSpinner variant={activeSpinner} size="lg" />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Particle System Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <GlassCard>
            <h3 className="text-lg font-semibold text-white mb-4">Particle System</h3>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {(['default', 'premium', 'minimal', 'stars', 'music'] as const).map((variant) => (
                  <AdvancedButton
                    key={variant}
                    variant={activeParticles === variant ? 'gradient' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveParticles(variant)}
                  >
                    {variant.charAt(0).toUpperCase() + variant.slice(1)}
                  </AdvancedButton>
                ))}
              </div>
              <div className="relative h-64 bg-slate-800/50 rounded-lg overflow-hidden">
                <ParticleSystem 
                  variant={activeParticles} 
                  particleCount={30} 
                  intensity="medium"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-white/60 text-sm">Particle System Demo</p>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-lg font-semibold text-white mb-4">Visual Effects</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <VisualEffects variant="glow" size="md" className="mx-auto mb-2">
                  <div className="w-6 h-6 bg-white rounded-full" />
                </VisualEffects>
                <span className="text-gray-300 text-sm">Glow</span>
              </div>
              <div className="text-center">
                <VisualEffects variant="gradient" size="md" className="mx-auto mb-2">
                  <div className="w-6 h-6 bg-white rounded-full" />
                </VisualEffects>
                <span className="text-gray-300 text-sm">Gradient</span>
              </div>
              <div className="text-center">
                <VisualEffects variant="shimmer" size="md" className="mx-auto mb-2">
                  <div className="w-6 h-6 bg-white rounded-full" />
                </VisualEffects>
                <span className="text-gray-300 text-sm">Shimmer</span>
              </div>
              <div className="text-center">
                <VisualEffects variant="wave" size="md" className="mx-auto mb-2">
                  <div className="w-6 h-6 bg-white rounded-full" />
                </VisualEffects>
                <span className="text-gray-300 text-sm">Wave</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Animated Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <GlassCard>
            <h3 className="text-lg font-semibold text-white mb-4">Animated Grid</h3>
            <div className="space-y-4">
              <div className="relative h-48 bg-slate-800/50 rounded-lg overflow-hidden">
                <AnimatedGrid variant="premium" color="harmony" size="md" animated={true} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-white/60 text-sm">Premium Grid Pattern</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <AdvancedButton variant="ghost" size="sm">Default</AdvancedButton>
                <AdvancedButton variant="gradient" size="sm">Premium</AdvancedButton>
                <AdvancedButton variant="ghost" size="sm">Minimal</AdvancedButton>
                <AdvancedButton variant="ghost" size="sm">Dots</AdvancedButton>
                <AdvancedButton variant="ghost" size="sm">Lines</AdvancedButton>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-lg font-semibold text-white mb-4">Grid Overlay</h3>
            <div className="relative h-48 bg-slate-800/50 rounded-lg overflow-hidden">
              <GridOverlay variant="default" color="harmony" size="md" animated={true}>
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-white text-lg font-semibold mb-2">Content Over Grid</p>
                    <p className="text-gray-300 text-sm">Grid pattern behind content</p>
                  </div>
                </div>
              </GridOverlay>
            </div>
          </GlassCard>
        </div>

        {/* Glow Effects Section */}
        <GlassCard className="mb-12">
          <h3 className="text-lg font-semibold text-white mb-6">Glow Effects</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlowEffect color="teal" intensity="medium" className="p-6 rounded-xl bg-slate-800/50">
              <div className="text-center">
                <div className="w-12 h-12 bg-teal-400 rounded-full mx-auto mb-3" />
                <p className="text-white font-semibold">Teal Glow</p>
                <p className="text-gray-300 text-sm">Medium intensity</p>
              </div>
            </GlowEffect>
            
            <GlowEffect color="blue" intensity="high" className="p-6 rounded-xl bg-slate-800/50">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-400 rounded-full mx-auto mb-3" />
                <p className="text-white font-semibold">Blue Glow</p>
                <p className="text-gray-300 text-sm">High intensity</p>
              </div>
            </GlowEffect>
            
            <GlowEffect color="harmony" intensity="low" className="p-6 rounded-xl bg-slate-800/50">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full mx-auto mb-3" />
                <p className="text-white font-semibold">Harmony Glow</p>
                <p className="text-gray-300 text-sm">Low intensity</p>
              </div>
            </GlowEffect>
          </div>
        </GlassCard>

        {/* Size Variations */}
        <GlassCard className="mb-12">
          <h3 className="text-lg font-semibold text-white mb-6">Size Variations</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <LoadingSpinner size="sm" className="mx-auto mb-2" />
              <span className="text-gray-300 text-sm">Small</span>
            </div>
            <div className="text-center">
              <LoadingSpinner size="md" className="mx-auto mb-2" />
              <span className="text-gray-300 text-sm">Medium</span>
            </div>
            <div className="text-center">
              <LoadingSpinner size="lg" className="mx-auto mb-2" />
              <span className="text-gray-300 text-sm">Large</span>
            </div>
            <div className="text-center">
              <LoadingSpinner size="xl" className="mx-auto mb-2" />
              <span className="text-gray-300 text-sm">Extra Large</span>
            </div>
          </div>
        </GlassCard>

        {/* Color Variations */}
        <GlassCard className="mb-12">
          <h3 className="text-lg font-semibold text-white mb-6">Color Variations</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <LoadingSpinner color="teal" className="mx-auto mb-2" />
              <span className="text-gray-300 text-sm">Teal</span>
            </div>
            <div className="text-center">
              <LoadingSpinner color="amber" className="mx-auto mb-2" />
              <span className="text-gray-300 text-sm">Amber</span>
            </div>
            <div className="text-center">
              <LoadingSpinner color="white" className="mx-auto mb-2" />
              <span className="text-gray-300 text-sm">White</span>
            </div>
            <div className="text-center">
              <LoadingSpinner color="default" className="mx-auto mb-2" />
              <span className="text-gray-300 text-sm">Default</span>
            </div>
          </div>
        </GlassCard>

        {/* Footer */}
        <div className="text-center">
          <GradientText className="text-2xl font-bold mb-4">
            Phase 6 Visual Enhancements Complete!
          </GradientText>
          <p className="text-gray-300 mb-6">
            Advanced visual enhancement components with mathematical harmony colors, 
            sophisticated animations, and premium visual effects have been successfully implemented.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <AdvancedButton variant="gradient" size="lg">
              View All Phases
            </AdvancedButton>
            <AdvancedButton variant="ghost" size="lg">
              Continue to Phase 7
            </AdvancedButton>
          </div>
        </div>
      </PremiumContainer>
    </div>
  );
} 