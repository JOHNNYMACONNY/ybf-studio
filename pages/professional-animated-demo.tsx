import React, { useState, useEffect } from 'react';
import { Wrench } from 'lucide-react';
import { Icon } from '../components/ui/Icon';
import { 
  ProfessionalAnimatedBackground, 
  ProfessionalHeroBackground,
  ProfessionalBrandBackground,
  ProfessionalWarmBackground,
  ProfessionalCoolBackground,
  ProfessionalPulseBackground
} from '../components/ui/ProfessionalAnimatedBackground';
import { Hybrid3DBackground, CSS3DBackground, Professional3DBackground } from '../components/ui/Spline3DBackground';

// Type definitions
type BackgroundType = 'professional' | '3d-spline' | '3d-css' | '3d-professional';
type VariantType = 'premium' | 'brand' | 'warm' | 'cool' | 'pulse';
type IntensityType = 'low' | 'medium' | 'high';

export default function ProfessionalAnimatedDemo() {
  const [currentVariant, setCurrentVariant] = useState<VariantType>('premium');
  const [currentIntensity, setCurrentIntensity] = useState<IntensityType>('medium');
  const [debugMode, setDebugMode] = useState(false);
  const [backgroundType, setBackgroundType] = useState<BackgroundType>('3d-professional');

  // Set data attribute for 3D background styling
  useEffect(() => {
    const is3DBackground = backgroundType === '3d-spline' || backgroundType === '3d-css' || backgroundType === '3d-professional';
    document.body.setAttribute('data-3d-background', is3DBackground.toString());
    document.documentElement.setAttribute('data-3d-background', is3DBackground.toString());
    
    return () => {
      document.body.removeAttribute('data-3d-background');
      document.documentElement.removeAttribute('data-3d-background');
    };
  }, [backgroundType]);

  const variants = [
    { key: 'premium' as VariantType, name: 'Premium', description: 'Sophisticated professional background' },
    { key: 'brand' as VariantType, name: 'Brand', description: 'Brand-focused animated elements' },
    { key: 'warm' as VariantType, name: 'Warm', description: 'Warm, inviting color scheme' },
    { key: 'cool' as VariantType, name: 'Cool', description: 'Cool, calming color scheme' },
    { key: 'pulse' as VariantType, name: 'Pulse', description: 'Mathematical harmony pulse' }
  ];

  const intensities = [
    { key: 'low' as IntensityType, name: 'Low', description: 'Subtle effects' },
    { key: 'medium' as IntensityType, name: 'Medium', description: 'Balanced visibility' },
    { key: 'high' as IntensityType, name: 'High', description: 'Prominent effects' }
  ];

  const backgroundTypes = [
    { key: '3d-spline' as BackgroundType, name: '3D Spline', description: 'External 3D animation' },
    { key: '3d-css' as BackgroundType, name: '3D CSS', description: 'CSS-based 3D effects' },
    { key: '3d-professional' as BackgroundType, name: 'Professional 3D', description: 'Mathematical harmony with 3D elements' },
    { key: 'professional' as BackgroundType, name: 'Professional', description: 'Mathematical harmony' }
  ];

  const renderBackground = () => {
    switch (backgroundType) {
      case '3d-spline':
        return (
          <Hybrid3DBackground>
            <div className="container mx-auto px-4 py-20">
              {renderContent()}
            </div>
          </Hybrid3DBackground>
        );
      case '3d-css':
        return (
          <CSS3DBackground>
            <div className="container mx-auto px-4 py-20">
              {renderContent()}
            </div>
          </CSS3DBackground>
        );
      case '3d-professional':
        return (
          <Professional3DBackground>
            <div className="container mx-auto px-4 py-20">
              {renderContent()}
            </div>
          </Professional3DBackground>
        );
      default:
        return (
          <ProfessionalAnimatedBackground 
            variant={currentVariant} 
            intensity={currentIntensity}
            debug={debugMode}
          >
            <div className="container mx-auto px-4 py-20">
              {renderContent()}
            </div>
          </ProfessionalAnimatedBackground>
        );
    }
  };

  const renderContent = () => (
    <>
      <h1 className="text-6xl font-bold text-white mb-8 text-center">
        Professional Animated Background Demo
      </h1>
      <p className="text-xl text-neutral-200 text-center mb-12 max-w-4xl mx-auto">
        Hotel Explorer-inspired animated background with mathematically harmonious colors, 
        sophisticated animations, and professional design principles.
      </p>

      {/* Controls */}
      <div className={`rounded-lg p-6 border border-neutral-700 mb-12 ${
        backgroundType === '3d-spline' || backgroundType === '3d-css' || backgroundType === '3d-professional'
          ? 'bg-black/80 backdrop-blur-sm' 
          : 'bg-neutral-900/90 backdrop-blur-sm'
      }`}>
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Background Controls</h2>
        
        {/* Background Type Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Background Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {backgroundTypes.map((type) => (
              <button
                key={type.key}
                onClick={() => setBackgroundType(type.key)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  backgroundType === type.key
                    ? 'border-emerald-400 bg-emerald-400/10 text-emerald-400'
                    : 'border-neutral-600 bg-neutral-800/50 text-neutral-200 hover:border-neutral-500 hover:bg-neutral-800/70'
                }`}
              >
                <div className="font-semibold mb-1">{type.name}</div>
                <div className="text-sm opacity-90">{type.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Debug Mode Toggle */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={debugMode}
                onChange={(e) => setDebugMode(e.target.checked)}
                className="w-4 h-4 text-emerald-400 bg-neutral-800/50 border-neutral-600 rounded focus:ring-emerald-400/40"
              />
              <span className="text-white font-semibold">Debug Mode (Full Opacity)</span>
            </label>
          </div>
          {debugMode && (
            <p className="text-emerald-400 text-center mt-2 text-sm flex items-center gap-2 justify-center">
              <Icon as={Wrench} className="h-4 w-4" /> Debug mode enabled - All effects at full opacity for maximum visibility
            </p>
          )}
        </div>

        {/* Variant Selection (only for professional background) */}
        {backgroundType === 'professional' && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Background Variant</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {variants.map((variant) => (
                <button
                  key={variant.key}
                  onClick={() => setCurrentVariant(variant.key)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    currentVariant === variant.key
                      ? 'border-emerald-400 bg-emerald-400/10 text-emerald-400'
                      : 'border-neutral-600 bg-neutral-800/50 text-neutral-200 hover:border-neutral-500 hover:bg-neutral-800/70'
                  }`}
                >
                  <div className="font-semibold mb-1">{variant.name}</div>
                  <div className="text-sm opacity-90">{variant.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Intensity Selection (only for professional background) */}
        {backgroundType === 'professional' && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Animation Intensity</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {intensities.map((intensity) => (
                <button
                  key={intensity.key}
                  onClick={() => setCurrentIntensity(intensity.key)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    currentIntensity === intensity.key
                      ? 'border-amber-400 bg-amber-400/10 text-amber-400'
                      : 'border-neutral-600 bg-neutral-800/50 text-neutral-200 hover:border-neutral-500 hover:bg-neutral-800/70'
                  }`}
                >
                  <div className="font-semibold mb-1">{intensity.name}</div>
                  <div className="text-sm opacity-90">{intensity.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Current Background Info */}
      <div className={`rounded-lg p-6 border border-neutral-700 mb-12 ${
        backgroundType === '3d-spline' || backgroundType === '3d-css' || backgroundType === '3d-professional'
          ? 'bg-black/80 backdrop-blur-sm' 
          : 'bg-neutral-900/90 backdrop-blur-sm'
      }`}>
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Current Background</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Active Type: {backgroundType === '3d-spline' ? '3D Spline Animation' : 
                           backgroundType === '3d-css' ? '3D CSS Animation' : 
                           backgroundType === '3d-professional' ? 'Professional 3D' :
                           `Professional ${variants.find(v => v.key === currentVariant)?.name}`}
            </h3>
            <p className="text-neutral-200 mb-4">
              {backgroundType === '3d-spline' ? 'External Spline 3D animation with CSS fallback' :
               backgroundType === '3d-css' ? 'Pure CSS-based 3D animated elements' :
               backgroundType === '3d-professional' ? 'Mathematical harmony with 3D elements' :
               variants.find(v => v.key === currentVariant)?.description}
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-emerald-400 rounded"></div>
                <span className="text-neutral-200">Emerald Primary</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-amber-400 rounded"></div>
                <span className="text-neutral-200">Amber Accent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-400 rounded"></div>
                <span className="text-neutral-200">Orange Energy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-emerald-600 rounded"></div>
                <span className="text-neutral-200">Emerald Secondary</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Features</h3>
            <ul className="text-neutral-200 space-y-2">
              <li>• <strong>3D Animation:</strong> Floating geometric shapes and elements</li>
              <li>• <strong>Gradient Effects:</strong> Dynamic color transitions</li>
              <li>• <strong>Grid Patterns:</strong> Animated overlay textures</li>
              <li>• <strong>Radial Effects:</strong> Depth and focal points</li>
              <li>• <strong>Staggered Animations:</strong> Organic movement timing</li>
              <li>• <strong>Responsive Design:</strong> Works on all devices</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Hotel Explorer Style Content */}
      <div className={`rounded-lg p-8 border border-neutral-700 ${
        backgroundType === '3d-spline' || backgroundType === '3d-css' || backgroundType === '3d-professional'
          ? 'bg-black/80 backdrop-blur-sm' 
          : 'bg-neutral-900/90 backdrop-blur-sm'
      }`}>
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Hotel Explorer Style Interface</h2>
        
        {/* Search Bar */}
        <div className={`rounded-lg p-6 mb-8 ${
          backgroundType === '3d-spline' || backgroundType === '3d-css' || backgroundType === '3d-professional'
            ? 'bg-neutral-800/50' 
            : 'bg-neutral-800/70'
        }`}>
          <div className="flex items-center gap-4 max-w-4xl mx-auto">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-200 mb-2">Destination</label>
                <input 
                  type="text" 
                  placeholder="Barcelona" 
                  className={`w-full rounded-lg border border-neutral-600 text-white py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 bg-neutral-800/50`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-200 mb-2">Dates</label>
                <input 
                  type="text" 
                  placeholder="May 10-24" 
                  className={`w-full rounded-lg border border-neutral-600 text-white py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 bg-neutral-800/50`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-200 mb-2">Guests</label>
                <input 
                  type="text" 
                  placeholder="3 guests" 
                  className={`w-full rounded-lg border border-neutral-600 text-white py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 bg-neutral-800/50`}
                />
              </div>
              <div className="flex items-end">
                <button className="w-full bg-gradient-to-r from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`rounded-lg p-6 border border-neutral-600 hover:border-emerald-400/40 transition-colors ${
              backgroundType === '3d-spline' || backgroundType === '3d-css' || backgroundType === '3d-professional'
                ? 'bg-neutral-800/50' 
                : 'bg-neutral-800/70'
            }`}>
              <div className="w-full h-32 bg-gradient-to-r from-emerald-400/20 to-amber-400/20 rounded-lg mb-4"></div>
              <h3 className="text-lg font-semibold text-white mb-2">Professional Background {i}</h3>
              <p className="text-neutral-200 text-sm mb-4">
                This demonstrates the sophisticated animated background with mathematical harmony and professional aesthetics.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-amber-400 font-semibold">Premium</span>
                <button className="bg-gradient-to-r from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mathematical Harmony Explanation */}
      <div className={`rounded-lg p-8 border border-neutral-700 mt-12 ${
        backgroundType === '3d-spline' || backgroundType === '3d-css' || backgroundType === '3d-professional'
          ? 'bg-black/80 backdrop-blur-sm' 
          : 'bg-neutral-900/90 backdrop-blur-sm'
      }`}>
        <h2 className="text-3xl font-bold text-white mb-8 text-center">3D Animation in Action</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Animation Features</h3>
            <ul className="text-neutral-200 space-y-3">
              <li>• <strong>Floating Elements:</strong> Geometric shapes with rotation and movement</li>
              <li>• <strong>Gradient Overlays:</strong> Dynamic color transitions and effects</li>
              <li>• <strong>Grid Patterns:</strong> Animated overlay textures for depth</li>
              <li>• <strong>Radial Effects:</strong> Depth and focal points for 3D feel</li>
              <li>• <strong>Staggered Timing:</strong> Random delays create organic movement</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Technical Implementation</h3>
            <ul className="text-neutral-200 space-y-3">
              <li>• <strong>Spline Integration:</strong> External 3D animation with fallback</li>
              <li>• <strong>CSS Animations:</strong> Pure CSS-based 3D effects</li>
              <li>• <strong>Responsive Design:</strong> Works on all screen sizes</li>
              <li>• <strong>Performance Optimized:</strong> Efficient animation rendering</li>
              <li>• <strong>Cross-browser Compatible:</strong> Works in all modern browsers</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center mt-12">
        <p className="text-neutral-200 text-lg">
          This 3D animated background combines external Spline animations with CSS fallbacks 
          to create a premium, hotel explorer-inspired experience for the AudioServiceApp.
        </p>
      </div>
    </>
  );

  return (
    <div className="min-h-screen" style={{ background: 'transparent' }}>
      {renderBackground()}
    </div>
  );
}