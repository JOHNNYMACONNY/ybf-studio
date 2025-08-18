import React, { useState } from 'react';
import { InteractiveCard } from '../components/ui/InteractiveCard';
import { AdvancedButton } from '../components/ui/AdvancedButton';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { useAnimation, useStaggeredAnimation, useMountAnimation } from '../components/hooks/useAnimation';
import { useInteraction } from '../components/hooks/useInteraction';
import { useTheme } from '../components/hooks/useTheme';
import { PremiumContainer } from '../components/ui/PremiumContainer';
import { GradientText } from '../components/ui/GradientText';
import { GlassCard } from '../components/ui/GlassCard';

// Sample data for demonstrations
const sampleItems = [
  { id: 1, title: 'Interactive Card 1', description: 'Enhanced hover states and micro-interactions' },
  { id: 2, title: 'Interactive Card 2', description: 'Ripple effects and glow animations' },
  { id: 3, title: 'Interactive Card 3', description: 'Staggered animations with mathematical harmony' },
  { id: 4, title: 'Interactive Card 4', description: 'Advanced focus and press states' },
];

const AdvancedFeaturesDemo: React.FC = () => {
  const { isDark, isLight, mode, variant, setMode, setVariant } = useTheme();
  const [loadingState, setLoadingState] = useState(false);
  const [pulseState, setPulseState] = useState(false);

  // Custom hook demonstrations
  const { isVisible: heroVisible } = useMountAnimation();
  const { isHovered: demoHovered, interactionProps: demoProps } = useInteraction();

  const handleLoadingDemo = () => {
    setLoadingState(true);
    setTimeout(() => setLoadingState(false), 3000);
  };

  const handlePulseDemo = () => {
    setPulseState(true);
    setTimeout(() => setPulseState(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-premium">
      {/* Header with Theme Toggle */}
      <header className="sticky top-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">
              Phase 3: <GradientText gradient="teal-blue">Advanced Features</GradientText>
            </h1>
            <div className="flex items-center gap-4">
              <ThemeToggle size="md" showLabel variant="premium" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <PremiumContainer variant="hero" background="none" padding="xl">
        <div className={`text-center space-y-8 transition-all duration-500 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-5xl font-bold text-white">
            Advanced <GradientText gradient="amber-teal">Interactions</GradientText>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience enhanced hover states, micro-interactions, custom hooks, and a complete theme system with mathematical color harmony.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <AdvancedButton 
              variant="gradient" 
              size="lg" 
              glow 
              ripple 
              icon="🎨"
              onClick={handleLoadingDemo}
              loading={loadingState}
            >
              Loading Demo
            </AdvancedButton>
            
            <AdvancedButton 
              variant="amber" 
              size="lg" 
              pulse={pulseState}
              icon="✨"
              onClick={handlePulseDemo}
            >
              Pulse Demo
            </AdvancedButton>
          </div>
        </div>
      </PremiumContainer>

      {/* Interactive Cards Section */}
      <PremiumContainer variant="section" background="glass" padding="lg">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Interactive <GradientText gradient="teal-blue">Cards</GradientText>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Enhanced cards with advanced hover states, ripple effects, and staggered animations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleItems.map((item, index) => (
            <InteractiveCard
              key={item.id}
              variant={index % 2 === 0 ? 'elevated' : 'premium'}
              hoverEffect="all"
              interactive={true}

              onClick={() => console.log(`Clicked ${item.title}`)}
              className="p-6"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🎵</span>
                </div>
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="text-gray-300 text-sm">{item.description}</p>
              </div>
            </InteractiveCard>
          ))}
        </div>
      </PremiumContainer>

      {/* Advanced Buttons Section */}
      <PremiumContainer variant="section" background="none" padding="lg">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Advanced <GradientText gradient="amber-teal">Buttons</GradientText>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Buttons with enhanced interactions, loading states, and micro-animations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white text-center">Primary Variants</h3>
            <div className="flex flex-col gap-3">
              <AdvancedButton variant="primary" glow ripple>
                Primary Glow
              </AdvancedButton>
              <AdvancedButton variant="gradient" glow ripple>
                Gradient Glow
              </AdvancedButton>
              <AdvancedButton variant="premium" glow ripple>
                Premium Glow
              </AdvancedButton>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white text-center">Color Variants</h3>
            <div className="flex flex-col gap-3">
              <AdvancedButton variant="teal" glow ripple>
                Teal Variant
              </AdvancedButton>
              <AdvancedButton variant="amber" glow ripple>
                Amber Variant
              </AdvancedButton>
              <AdvancedButton variant="ghost" glow ripple>
                Ghost Variant
              </AdvancedButton>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white text-center">Interactive States</h3>
            <div className="flex flex-col gap-3">
              <AdvancedButton 
                variant="gradient" 
                loading={loadingState}
                onClick={handleLoadingDemo}
              >
                Loading State
              </AdvancedButton>
              <AdvancedButton 
                variant="amber" 
                pulse={pulseState}
                onClick={handlePulseDemo}
              >
                Pulse Effect
              </AdvancedButton>
              <AdvancedButton variant="secondary" disabled>
                Disabled State
              </AdvancedButton>
            </div>
          </div>
        </div>
      </PremiumContainer>

      {/* Theme System Section */}
      <PremiumContainer variant="section" background="premium" padding="lg">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Theme <GradientText gradient="teal-blue">System</GradientText>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Complete theme system with light/dark modes and mathematical harmony variants
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlassCard variant="elevated" className="p-6 text-center">
            <h3 className="text-lg font-semibold text-white mb-4">Current Theme</h3>
            <div className="space-y-2">
              <p className="text-gray-300">Mode: <span className="text-white font-medium">{mode}</span></p>
              <p className="text-gray-300">Effective: <span className="text-white font-medium">{isDark ? 'Dark' : 'Light'}</span></p>
              <p className="text-gray-300">Variant: <span className="text-white font-medium">{variant}</span></p>
            </div>
          </GlassCard>

          <GlassCard variant="warm" className="p-6 text-center">
            <h3 className="text-lg font-semibold text-white mb-4">Theme Controls</h3>
            <div className="space-y-3">
              <AdvancedButton 
                variant="amber" 
                size="sm" 
                onClick={() => setMode('light')}
                disabled={mode === 'light'}
              >
                Light Mode
              </AdvancedButton>
              <AdvancedButton 
                variant="teal" 
                size="sm" 
                onClick={() => setMode('dark')}
                disabled={mode === 'dark'}
              >
                Dark Mode
              </AdvancedButton>
              <AdvancedButton 
                variant="ghost" 
                size="sm" 
                onClick={() => setMode('auto')}
                disabled={mode === 'auto'}
              >
                Auto Mode
              </AdvancedButton>
            </div>
          </GlassCard>

          <GlassCard variant="cool" className="p-6 text-center">
            <h3 className="text-lg font-semibold text-white mb-4">Color Variants</h3>
            <div className="space-y-3">
              <AdvancedButton 
                variant="teal" 
                size="sm" 
                onClick={() => setVariant('default')}
                disabled={variant === 'default'}
              >
                Default
              </AdvancedButton>
              <AdvancedButton 
                variant="amber" 
                size="sm" 
                onClick={() => setVariant('warm')}
                disabled={variant === 'warm'}
              >
                Warm
              </AdvancedButton>
              <AdvancedButton 
                variant="teal" 
                size="sm" 
                onClick={() => setVariant('cool')}
                disabled={variant === 'cool'}
              >
                Cool
              </AdvancedButton>
            </div>
          </GlassCard>

          <GlassCard variant="elevated" className="p-6 text-center">
            <h3 className="text-lg font-semibold text-white mb-4">Theme Toggle</h3>
            <div className="flex justify-center">
              <ThemeToggle size="lg" showLabel variant="premium" />
            </div>
          </GlassCard>
        </div>
      </PremiumContainer>

      {/* Custom Hooks Demo */}
      <PremiumContainer variant="section" background="glass" padding="lg">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Custom <GradientText gradient="amber-teal">Hooks</GradientText>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Reusable animation and interaction hooks with mathematical harmony timing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <GlassCard variant="warm" className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4">useAnimation Hook</h3>
            <div className="space-y-4">
              <p className="text-gray-300">
                Advanced animation hook with scroll triggers, staggered timing, and performance optimization.
              </p>
              <div className="space-y-2">
                <div className="h-4 bg-gradient-to-r from-amber-400 to-amber-600 rounded animate-pulse"></div>
                <div className="h-4 bg-gradient-to-r from-teal-400 to-blue-500 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="h-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </GlassCard>

          <GlassCard variant="cool" className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4">useInteraction Hook</h3>
            <div className="space-y-4">
              <p className="text-gray-300">
                Comprehensive interaction hook with hover, press, focus, and touch states.
              </p>
              <div 
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  demoHovered 
                    ? 'border-teal-400 bg-teal-400/10' 
                    : 'border-gray-600 bg-gray-800/20'
                }`}
                {...demoProps}
              >
                <p className="text-center text-white">
                  {demoHovered ? 'Hovered! 🎉' : 'Hover over me'}
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </PremiumContainer>

      {/* Mathematical Harmony Showcase */}
      <PremiumContainer variant="section" background="premium" padding="lg">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Mathematical <GradientText gradient="teal-blue">Harmony</GradientText>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Advanced features maintain perfect mathematical color harmony across all interactions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full mx-auto flex items-center justify-center">
              <span className="text-2xl">🎨</span>
            </div>
            <h3 className="text-lg font-semibold text-white">Warm Accents</h3>
            <p className="text-gray-300 text-sm">Amber (38°) for CTAs and highlights</p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full mx-auto flex items-center justify-center">
              <span className="text-2xl">🎵</span>
            </div>
            <h3 className="text-lg font-semibold text-white">Primary Brand</h3>
            <p className="text-gray-300 text-sm">Teal (165°) for main elements</p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto flex items-center justify-center">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="text-lg font-semibold text-white">Secondary Accent</h3>
            <p className="text-gray-300 text-sm">Blue (217°) for gradients and depth</p>
          </div>
        </div>
      </PremiumContainer>

      {/* CTA Section */}
      <PremiumContainer variant="section" background="glass" padding="lg">
        <div className="text-center space-y-8">
          <h2 className="text-4xl font-bold text-white">
            Phase 3 <GradientText gradient="amber-teal">Complete</GradientText>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Advanced features with enhanced interactions, custom hooks, and a complete theme system are now ready for production use.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <AdvancedButton variant="gradient" size="xl" glow ripple>
              Explore Features
            </AdvancedButton>
            <AdvancedButton variant="ghost" size="xl">
              View Documentation
            </AdvancedButton>
          </div>
        </div>
      </PremiumContainer>
    </div>
  );
};

export default AdvancedFeaturesDemo; 