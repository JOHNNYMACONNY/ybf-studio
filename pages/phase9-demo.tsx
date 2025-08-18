import React, { useState } from 'react';
import { PremiumCard } from '../components/ui/PremiumCard';
import { PremiumTypography, PremiumHeading, PremiumDisplay, PremiumBody, PremiumCaption } from '../components/ui/PremiumTypography';
import { PremiumHeroBackground, PremiumCardBackground, PremiumAccentBackground, PremiumPatternBackground } from '../components/ui/PremiumBackground';
import { FadeInUp, FadeInBlur, SlideInLeft, SlideInRight, ScaleIn, RotateIn, BounceIn, StaggeredContainer } from '../components/ui/PremiumAnimations';
import { AdvancedButton } from '../components/ui/AdvancedButton';
import { AnimatedBackground } from '../components/ui/AnimatedBackground';

export default function Phase9Demo() {
  const [activeCard, setActiveCard] = useState<string>('default');
  const [animationTrigger, setAnimationTrigger] = useState<'onMount' | 'onScroll' | 'onHover' | 'onClick'>('onMount');

  const cardVariants = [
    { id: 'default', name: 'Default', variant: 'default' as const },
    { id: 'elevated', name: 'Elevated', variant: 'elevated' as const },
    { id: 'glass', name: 'Glass', variant: 'glass' as const },
    { id: 'overlay', name: 'Overlay', variant: 'overlay' as const },
    { id: 'premium', name: 'Premium', variant: 'premium' as const },
    { id: 'minimal', name: 'Minimal', variant: 'minimal' as const },
  ];

  const typographyVariants = [
    { id: 'display', name: 'Display', variant: 'display' as const },
    { id: 'h1', name: 'Heading 1', variant: 'h1' as const },
    { id: 'h2', name: 'Heading 2', variant: 'h2' as const },
    { id: 'body', name: 'Body', variant: 'body' as const },
    { id: 'caption', name: 'Caption', variant: 'caption' as const },
  ];

  const gradientVariants = [
    { id: 'premium', name: 'Premium', gradient: 'premium' as const },
    { id: 'glow', name: 'Glow', gradient: 'glow' as const },
    { id: 'brand', name: 'Brand', gradient: 'brand' as const },
    { id: 'teal-blue', name: 'Teal-Blue', gradient: 'teal-blue' as const },
    { id: 'amber-teal', name: 'Amber-Teal', gradient: 'amber-teal' as const },
  ];

  return (
    <PremiumHeroBackground>
      {/* Animated Background */}
      <AnimatedBackground variant="premium" intensity="medium" />
      
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Header */}
          <FadeInUp delay={200}>
            <div className="text-center">
              <PremiumDisplay gradient="premium" glow={true} className="mb-6">
                Phase 9: Aesthetic Design Enhancements
              </PremiumDisplay>
              <PremiumBody className="text-xl text-gray-300 max-w-3xl mx-auto">
                Netchill-inspired sophisticated design system with enhanced visual effects, 
                premium typography, and advanced animation system
              </PremiumBody>
            </div>
          </FadeInUp>

          {/* Premium Card System */}
          <section className="space-y-8">
            <FadeInUp delay={400}>
              <PremiumHeading level={2} gradient="teal-blue" className="text-center mb-8">
                Premium Card System
              </PremiumHeading>
            </FadeInUp>

            {/* Card Variants */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cardVariants.map((card, index) => (
                <FadeInUp key={card.id} delay={600 + index * 100}>
                  <PremiumCard
                    variant={card.variant}
                    hover={true}
                    scale={true}
                    glow={card.id === 'premium'}
                    className="cursor-pointer"
                    onClick={() => setActiveCard(card.id)}
                  >
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-teal-400/20 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-2xl">✨</span>
                      </div>
                      <PremiumHeading level={3} className="text-white">
                        {card.name}
                      </PremiumHeading>
                      <PremiumBody className="text-gray-300">
                        Sophisticated {card.name.toLowerCase()} card variant with premium styling
                      </PremiumBody>
                      {activeCard === card.id && (
                        <div className="w-full h-1 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full" />
                      )}
                    </div>
                  </PremiumCard>
                </FadeInUp>
              ))}
            </div>
          </section>

          {/* Premium Typography System */}
          <section className="space-y-8">
            <FadeInUp delay={800}>
              <PremiumHeading level={2} gradient="amber-teal" className="text-center mb-8">
                Premium Typography System
              </PremiumHeading>
            </FadeInUp>

            {/* Typography Variants */}
            <div className="space-y-6">
              {typographyVariants.map((typography, index) => (
                <FadeInUp key={typography.id} delay={1000 + index * 150}>
                  <PremiumCard variant="glass" className="p-8">
                    <div className="space-y-2">
                      <PremiumCaption className="text-teal-400">
                        {typography.name} Variant
                      </PremiumCaption>
                      <PremiumTypography variant={typography.variant} gradient="premium" glow={true}>
                        The quick brown fox jumps over the lazy dog
                      </PremiumTypography>
                    </div>
                  </PremiumCard>
                </FadeInUp>
              ))}
            </div>

            {/* Gradient Text Examples */}
            <FadeInUp delay={1200}>
              <PremiumCard variant="premium" glow={true} className="p-8">
                <PremiumHeading level={3} className="text-center mb-6">
                  Gradient Text Variants
                </PremiumHeading>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {gradientVariants.map((gradient) => (
                    <div key={gradient.id} className="text-center">
                      <PremiumCaption className="text-gray-400 mb-2">
                        {gradient.name}
                      </PremiumCaption>
                      <PremiumHeading level={4} gradient={gradient.gradient} glow={gradient.id === 'glow'}>
                        Gradient Text
                      </PremiumHeading>
                    </div>
                  ))}
                </div>
              </PremiumCard>
            </FadeInUp>
          </section>

          {/* Premium Background System */}
          <section className="space-y-8">
            <FadeInUp delay={1400}>
              <PremiumHeading level={2} gradient="brand" className="text-center mb-8">
                Premium Background System
              </PremiumHeading>
            </FadeInUp>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FadeInUp delay={1600}>
                <PremiumCardBackground className="rounded-2xl p-8">
                  <PremiumHeading level={3} className="mb-4">
                    Card Background
                  </PremiumHeading>
                  <PremiumBody>
                    Sophisticated card background with subtle gradients and transparency effects
                  </PremiumBody>
                </PremiumCardBackground>
              </FadeInUp>

              <FadeInUp delay={1700}>
                <PremiumAccentBackground className="rounded-2xl p-8">
                  <PremiumHeading level={3} className="mb-4">
                    Accent Background
                  </PremiumHeading>
                  <PremiumBody>
                    Radial gradient accent background with mathematical harmony colors
                  </PremiumBody>
                </PremiumAccentBackground>
              </FadeInUp>
            </div>

            <FadeInUp delay={1800}>
              <PremiumPatternBackground pattern="dots" className="rounded-2xl p-8">
                <PremiumHeading level={3} className="mb-4">
                  Pattern Background
                </PremiumHeading>
                <PremiumBody>
                  Sophisticated pattern background with subtle dot overlay and premium gradients
                </PremiumBody>
              </PremiumPatternBackground>
            </FadeInUp>
          </section>

          {/* Advanced Animation System */}
          <section className="space-y-8">
            <FadeInUp delay={2000}>
              <PremiumHeading level={2} gradient="glow" className="text-center mb-8">
                Advanced Animation System
              </PremiumHeading>
            </FadeInUp>

            {/* Animation Triggers */}
            <FadeInUp delay={2200}>
              <PremiumCard variant="elevated" className="p-6">
                <div className="flex flex-wrap gap-4 justify-center">
                  {(['onMount', 'onScroll', 'onHover', 'onClick'] as const).map((trigger) => (
                    <AdvancedButton
                      key={trigger}
                      variant={animationTrigger === trigger ? 'gradient' : 'ghost'}
                      onClick={() => setAnimationTrigger(trigger)}
                    >
                      {trigger}
                    </AdvancedButton>
                  ))}
                </div>
              </PremiumCard>
            </FadeInUp>

            {/* Animation Examples */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FadeInBlur trigger={animationTrigger} delay={2400}>
                <PremiumCard variant="glass" className="text-center p-6">
                  <div className="w-12 h-12 bg-blue-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl">✨</span>
                  </div>
                  <PremiumHeading level={4}>Fade In Blur</PremiumHeading>
                </PremiumCard>
              </FadeInBlur>

              <SlideInLeft trigger={animationTrigger} delay={2500}>
                <PremiumCard variant="glass" className="text-center p-6">
                  <div className="w-12 h-12 bg-teal-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl">←</span>
                  </div>
                  <PremiumHeading level={4}>Slide In Left</PremiumHeading>
                </PremiumCard>
              </SlideInLeft>

              <SlideInRight trigger={animationTrigger} delay={2600}>
                <PremiumCard variant="glass" className="text-center p-6">
                  <div className="w-12 h-12 bg-amber-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl">→</span>
                  </div>
                  <PremiumHeading level={4}>Slide In Right</PremiumHeading>
                </PremiumCard>
              </SlideInRight>

              <ScaleIn trigger={animationTrigger} delay={2700}>
                <PremiumCard variant="glass" className="text-center p-6">
                  <div className="w-12 h-12 bg-purple-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl">⚡</span>
                  </div>
                  <PremiumHeading level={4}>Scale In</PremiumHeading>
                </PremiumCard>
              </ScaleIn>

              <RotateIn trigger={animationTrigger} delay={2800}>
                <PremiumCard variant="glass" className="text-center p-6">
                  <div className="w-12 h-12 bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl">🔄</span>
                  </div>
                  <PremiumHeading level={4}>Rotate In</PremiumHeading>
                </PremiumCard>
              </RotateIn>

              <BounceIn trigger={animationTrigger} delay={2900}>
                <PremiumCard variant="glass" className="text-center p-6">
                  <div className="w-12 h-12 bg-red-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl">🎯</span>
                  </div>
                  <PremiumHeading level={4}>Bounce In</PremiumHeading>
                </PremiumCard>
              </BounceIn>
            </div>

            {/* Staggered Animation */}
            <FadeInUp delay={3000}>
              <PremiumCard variant="premium" glow={true} className="p-8">
                <PremiumHeading level={3} className="text-center mb-6">
                  Staggered Animation Container
                </PremiumHeading>
                <StaggeredContainer stagger={200} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <PremiumCard variant="minimal" className="p-4 text-center">
                    <span className="text-2xl">🎨</span>
                    <PremiumBody className="mt-2">Design</PremiumBody>
                  </PremiumCard>
                  <PremiumCard variant="minimal" className="p-4 text-center">
                    <span className="text-2xl">✨</span>
                    <PremiumBody className="mt-2">Premium</PremiumBody>
                  </PremiumCard>
                  <PremiumCard variant="minimal" className="p-4 text-center">
                    <span className="text-2xl">🚀</span>
                    <PremiumBody className="mt-2">Enhanced</PremiumBody>
                  </PremiumCard>
                </StaggeredContainer>
              </PremiumCard>
            </FadeInUp>
          </section>

          {/* Phase 9 Summary */}
          <section className="space-y-8">
            <FadeInUp delay={3200}>
              <PremiumCard variant="elevated" glow={true} className="p-8">
                <div className="text-center space-y-6">
                  <PremiumDisplay gradient="brand" glow={true}>
                    Phase 9 Complete!
                  </PremiumDisplay>
                  <PremiumBody className="text-lg">
                    Netchill-inspired aesthetic design enhancements with sophisticated visual effects, 
                    premium typography system, and advanced animation capabilities
                  </PremiumBody>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-teal-400 mb-2">4</div>
                      <PremiumCaption>New Components</PremiumCaption>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400 mb-2">6</div>
                      <PremiumCaption>Card Variants</PremiumCaption>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-amber-400 mb-2">7</div>
                      <PremiumCaption>Animation Types</PremiumCaption>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-400 mb-2">5</div>
                      <PremiumCaption>Gradient Text</PremiumCaption>
                    </div>
                  </div>
                </div>
              </PremiumCard>
            </FadeInUp>
          </section>
        </div>
      </div>
    </PremiumHeroBackground>
  );
} 