import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientText } from '../components/ui/GradientText';

export default function TestUX() {
  return (
    <div className="min-h-screen bg-gradient-premium p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">
          UX Components <GradientText gradient="teal-blue">Test</GradientText>
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <GlassCard variant="warm">
            <h2 className="text-xl font-semibold mb-3 text-white">Warm Variant</h2>
            <p className="text-gray-300">Glass card with warm amber tones</p>
          </GlassCard>
          
          <GlassCard variant="cool">
            <h2 className="text-xl font-semibold mb-3 text-white">Cool Variant</h2>
            <p className="text-gray-300">Glass card with cool teal tones</p>
          </GlassCard>
          
          <GlassCard variant="elevated">
            <h2 className="text-xl font-semibold mb-3 text-white">Elevated Variant</h2>
            <p className="text-gray-300">Glass card with elevated styling</p>
          </GlassCard>
          
          <GlassCard gradient>
            <h2 className="text-xl font-semibold mb-3 text-white">Gradient Variant</h2>
            <p className="text-gray-300">Glass card with gradient background</p>
          </GlassCard>
        </div>
        
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Gradient Text Examples</h2>
          <div className="space-y-4">
            <p className="text-3xl">
              <GradientText gradient="teal-blue">Teal to Blue</GradientText>
            </p>
            <p className="text-3xl">
              <GradientText gradient="amber-teal">Amber to Teal</GradientText>
            </p>
            <p className="text-3xl">
              <GradientText gradient="teal-emerald">Teal to Emerald</GradientText>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 