import React, { useState } from 'react';

import { GlassCard } from '../components/ui/GlassCard';
import { GradientText } from '../components/ui/GradientText';
import { AdvancedButton } from '../components/ui/AdvancedButton';
import { AnimatedBackground } from '../components/ui/AnimatedBackground';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { TouchFriendlyButton } from '../components/ui/TouchFriendlyButton';
import { SwipeableCard } from '../components/ui/SwipeableCard';
import { MobileOptimizedLayout } from '../components/ui/MobileOptimizedLayout';

export default function Phase7Demo() {
  const [swipeCount, setSwipeCount] = useState({ left: 0, right: 0, up: 0, down: 0 });
  const [refreshCount, setRefreshCount] = useState(0);
  const [loadingButton, setLoadingButton] = useState(false);

  const handleSwipe = (direction: 'left' | 'right' | 'up' | 'down') => {
    setSwipeCount(prev => ({
      ...prev,
      [direction]: prev[direction] + 1
    }));
  };

  const handlePullToRefresh = () => {
    setRefreshCount(prev => prev + 1);
  };

  const handleLoadingButton = () => {
    setLoadingButton(true);
    setTimeout(() => setLoadingButton(false), 2000);
  };

  return (
    <MobileOptimizedLayout 
      showMobileIndicator={true}
      enablePullToRefresh={true}
      onPullToRefresh={handlePullToRefresh}
    >
      {/* Animated Background */}
      <AnimatedBackground variant="premium" intensity="medium" />
      
      {/* Header */}
      <div className="text-center mb-12">
        <GradientText className="text-4xl md:text-6xl font-bold mb-6">
          Phase 7: Mobile Optimization
        </GradientText>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
          Advanced mobile optimization components with touch-friendly interactions, 
          swipe gestures, and mobile-specific enhancements
        </p>
      </div>

      {/* Touch-Friendly Buttons Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-4">Touch-Friendly Buttons</h3>
          <div className="space-y-4">
            <TouchFriendlyButton
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => alert('Primary button clicked!')}
            >
              Primary Button
            </TouchFriendlyButton>
            
            <TouchFriendlyButton
              variant="gradient"
              size="lg"
              fullWidth
              loading={loadingButton}
              onClick={handleLoadingButton}
            >
              Loading Button
            </TouchFriendlyButton>
            
            <TouchFriendlyButton
              variant="secondary"
              size="md"
              fullWidth
              icon="🎵"
              iconPosition="left"
            >
              With Icon
            </TouchFriendlyButton>
            
            <TouchFriendlyButton
              variant="ghost"
              size="sm"
              fullWidth
              icon="📱"
              iconPosition="right"
            >
              Ghost Button
            </TouchFriendlyButton>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-4">Button Features</h3>
          <div className="space-y-4 text-sm text-gray-300">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-teal-400 rounded-full" />
              <span>44px minimum touch target</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full" />
              <span>Haptic feedback simulation</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-amber-400 rounded-full" />
              <span>Loading states</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full" />
              <span>Icon support</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full" />
              <span>Multiple variants</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full" />
              <span>Accessibility features</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Swipeable Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-4">Swipeable Cards</h3>
          <p className="text-gray-300 mb-4">
            Try swiping these cards in different directions to see the interactions.
          </p>
          
          <div className="space-y-4">
            <SwipeableCard
              onSwipeLeft={() => handleSwipe('left')}
              onSwipeRight={() => handleSwipe('right')}
            >
              <div className="p-4">
                <h4 className="text-white font-semibold mb-2">Swipe Me!</h4>
                <p className="text-gray-300 text-sm">
                  Swipe in any direction to see the interaction. The card will snap back after swiping.
                </p>
              </div>
            </SwipeableCard>
            
            <SwipeableCard
              onSwipeLeft={() => handleSwipe('left')}
              onSwipeRight={() => handleSwipe('right')}
            >
              <div className="p-4">
                <h4 className="text-white font-semibold mb-2">With Indicators</h4>
                <p className="text-gray-300 text-sm">
                  This card shows visual indicators while swiping.
                </p>
              </div>
            </SwipeableCard>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-4">Swipe Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Left Swipes:</span>
              <span className="text-red-400 font-bold">{swipeCount.left}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Right Swipes:</span>
              <span className="text-green-400 font-bold">{swipeCount.right}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Up Swipes:</span>
              <span className="text-blue-400 font-bold">{swipeCount.up}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Down Swipes:</span>
              <span className="text-yellow-400 font-bold">{swipeCount.down}</span>
            </div>
            <div className="pt-3 border-t border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Total Swipes:</span>
                <span className="text-white font-bold">
                  {swipeCount.left + swipeCount.right + swipeCount.up + swipeCount.down}
                </span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Mobile Layout Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-4">Mobile Layout Features</h3>
          <div className="space-y-4 text-sm text-gray-300">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-teal-400 rounded-full" />
              <span>Responsive design with touch-friendly spacing</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full" />
              <span>Pull-to-refresh functionality</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-amber-400 rounded-full" />
              <span>Device detection (mobile/tablet/desktop)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full" />
              <span>Optimized scrolling and animations</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full" />
              <span>Touch-friendly minimum sizes (44px)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full" />
              <span>Reduced motion support</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-4">Pull to Refresh</h3>
          <div className="text-center">
            <div className="mb-4">
              <LoadingSpinner variant="default" size="lg" />
            </div>
            <p className="text-gray-300 mb-4">
              Pull down from the top of the page to refresh. This page has been refreshed:
            </p>
            <div className="text-3xl font-bold text-teal-400 mb-4">
              {refreshCount} times
            </div>
            <p className="text-sm text-gray-400">
              Try pulling down from the top of the page to see the pull-to-refresh indicator.
            </p>
          </div>
        </GlassCard>
      </div>

      {/* Mobile Performance Features */}
      <GlassCard className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Mobile Performance Optimizations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-teal-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">⚡</span>
            </div>
            <h4 className="text-white font-semibold mb-2">Touch Optimization</h4>
            <p className="text-gray-300 text-sm">
              Optimized touch targets and interactions for mobile devices
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🎯</span>
            </div>
            <h4 className="text-white font-semibold mb-2">Gesture Support</h4>
            <p className="text-gray-300 text-sm">
              Swipe gestures and touch interactions for enhanced UX
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-amber-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">📱</span>
            </div>
            <h4 className="text-white font-semibold mb-2">Responsive Design</h4>
            <p className="text-gray-300 text-sm">
              Adaptive layouts and spacing for all device sizes
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Footer */}
      <div className="text-center">
        <GradientText className="text-2xl font-bold mb-4">
          Phase 7 Mobile Optimization Complete!
        </GradientText>
        <p className="text-gray-300 mb-6">
          Advanced mobile optimization components with touch-friendly interactions, 
          swipe gestures, and mobile-specific enhancements have been successfully implemented.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <AdvancedButton variant="gradient" size="lg">
            View All Phases
          </AdvancedButton>
          <AdvancedButton variant="ghost" size="lg">
            Continue to Phase 8
          </AdvancedButton>
        </div>
      </div>
    </MobileOptimizedLayout>
  );
} 