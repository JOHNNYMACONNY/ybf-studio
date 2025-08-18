import React, { useEffect, useState } from 'react';
import { SPLINE_CONFIG } from '../../utils/splineBackgroundSystem';

interface Spline3DBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

export const Spline3DBackground: React.FC<Spline3DBackgroundProps> = ({
  className = '',
  children
}) => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    console.log('Spline3DBackground: Iframe loaded:', iframeLoaded, 'Has error:', hasError);
    
    // Check if iframe is blocked by CSP or CORS
    const checkIframeSupport = () => {
      try {
        const testIframe = document.createElement('iframe');
        testIframe.style.display = 'none';
        testIframe.src = 'about:blank';
        document.body.appendChild(testIframe);
        document.body.removeChild(testIframe);
        console.log('Iframe support: OK');
        return true;
      } catch (error) {
        console.error('Iframe support: BLOCKED', error);
        return false;
      }
    };

    if (!checkIframeSupport()) {
      console.error('Iframe is blocked by browser policy');
      setHasError(true);
      return;
    }
  }, [iframeLoaded, hasError]);

  const handleIframeLoad = () => {
    console.log('Spline iframe loaded successfully');
    setIframeLoaded(true);
    setHasError(false);
  };

  const handleIframeError = () => {
    console.error('Spline iframe failed to load');
    setHasError(true);
    setIframeLoaded(false);
  };

  const handleIframeLoadStart = () => {
    console.log('Spline iframe load started');
  };

  return (
    <div className={`relative min-h-screen w-full ${className}`}>
      {/* Fixed black background */}
      <div className="fixed top-0 left-0 w-full h-screen bg-black" style={{ zIndex: -20 }} />
      
      {/* Spline 3D Background with Orange Filter */}
      {!hasError && (
        <div className="fixed top-0 left-0 w-full h-screen" style={{ zIndex: -10 }}>
          <iframe
            src={SPLINE_CONFIG.IFRAME_URL}
            frameBorder="0"
            width="100%"
            height="100%"
            title="3D Animated Background"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            onLoadStart={handleIframeLoadStart}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              background: 'transparent',
              backgroundColor: 'transparent',
              border: 'none',
              filter: SPLINE_CONFIG.COLOR_FILTER
            }}
          />
        </div>
      )}
      
      {/* CSS Fallback Background (shows immediately if iframe fails or while loading) */}
      {hasError && (
        <div className="fixed inset-0 -z-5">
          <div className="absolute inset-0 bg-black" />
          
          {/* Enhanced Floating Geometric Shapes with Professional Colors */}
          {Array.from({ length: 25 }).map((_, i) => (
            <div
              key={i}
              className={`absolute animate-float shadow-lg ${
                i % 6 === 0 ? 'bg-emerald-300/40 w-12 h-12 rounded-lg' :
                i % 6 === 1 ? 'bg-amber-400/40 w-8 h-8 rounded-full' :
                i % 6 === 2 ? 'bg-orange-500/40 w-6 h-6 rotate-45' :
                i % 6 === 3 ? 'bg-emerald-600/40 w-10 h-10 rounded-xl' :
                i % 6 === 4 ? 'bg-amber-700/40 w-14 h-14 rounded-2xl' :
                'bg-orange-700/40 w-16 h-16 rounded-3xl'
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${10 + Math.random() * 15}s`,
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            />
          ))}
          
          {/* Enhanced Animated Grid Lines with Professional Colors */}
          <div className="absolute inset-0 opacity-15">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-300/30 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-400/30 to-transparent animate-pulse" style={{ animationDelay: '2s' }} />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-orange-500/25 to-transparent animate-pulse" style={{ animationDelay: '3s' }} />
            <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-emerald-600/20 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          
          {/* Enhanced Radial Gradients for Depth with Professional Colors */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-emerald-300/15 via-transparent to-transparent animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-amber-400/15 via-transparent to-transparent animate-pulse" style={{ animationDelay: '3s' }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-radial from-orange-500/15 via-transparent to-transparent animate-pulse" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-3/4 left-1/3 w-80 h-80 bg-gradient-radial from-emerald-600/12 via-transparent to-transparent animate-pulse" style={{ animationDelay: '4s' }} />
          <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-gradient-radial from-amber-700/12 via-transparent to-transparent animate-pulse" style={{ animationDelay: '2.5s' }} />
        </div>
      )}
      
      {/* Content overlay */}
      {children && (
        <div className="relative min-h-screen w-full" style={{ zIndex: 10 }}>
          {children}
        </div>
      )}
    </div>
  );
};

// Alternative: CSS-based 3D animation (no external dependencies)
export const CSS3DBackground: React.FC<Spline3DBackgroundProps> = ({ 
  className = '',
  children
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`relative min-h-screen overflow-hidden ${className}`}>
      {/* Black background that fills the entire screen */}
      <div className="fixed top-0 left-0 w-full h-screen bg-black -z-20" />
      
      {/* CSS-based 3D Animation Background */}
      <div className="absolute inset-0 bg-black -z-10" />
      
      {/* Animated 3D Elements */}
      <div className="absolute inset-0 -z-5">
        {/* Enhanced Floating Geometric Shapes with Professional Colors */}
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className={`absolute animate-float shadow-lg ${
              i % 6 === 0 ? 'bg-emerald-300/40 w-12 h-12 rounded-lg' :
              i % 6 === 1 ? 'bg-amber-400/40 w-8 h-8 rounded-full' :
              i % 6 === 2 ? 'bg-orange-500/40 w-6 h-6 rotate-45' :
              i % 6 === 3 ? 'bg-emerald-600/40 w-10 h-10 rounded-xl' :
              i % 6 === 4 ? 'bg-amber-700/40 w-14 h-14 rounded-2xl' :
              'bg-orange-700/40 w-16 h-16 rounded-3xl'
            }`}
            style={{
              left: mounted ? `${Math.random() * 100}%` : `${(i * 4) % 100}%`,
              top: mounted ? `${Math.random() * 100}%` : `${(i * 6) % 100}%`,
              animationDelay: mounted ? `${Math.random() * 6}s` : `${i * 0.3}s`,
              animationDuration: mounted ? `${10 + Math.random() * 15}s` : `${10 + i * 0.6}s`,
              transform: mounted ? `rotate(${Math.random() * 360}deg)` : `rotate(${i * 15}deg)`
            }}
          />
        ))}
        
        {/* Enhanced Animated Grid Lines with Professional Colors */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-300/30 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-400/30 to-transparent animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-orange-500/25 to-transparent animate-pulse" style={{ animationDelay: '3s' }} />
          <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-emerald-600/20 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
        
        {/* Enhanced Radial Gradients for Depth with Professional Colors */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-emerald-300/15 via-transparent to-transparent animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-amber-400/15 via-transparent to-transparent animate-pulse" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-radial from-orange-500/15 via-transparent to-transparent animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-3/4 left-1/3 w-80 h-80 bg-gradient-radial from-emerald-600/12 via-transparent to-transparent animate-pulse" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-gradient-radial from-amber-700/12 via-transparent to-transparent animate-pulse" style={{ animationDelay: '2.5s' }} />
      </div>

      {/* Content Overlay */}
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
};

// Hybrid Background (combines both approaches)
export const Hybrid3DBackground: React.FC<Spline3DBackgroundProps> = ({ 
  className = '',
  children
}) => {
  const [mounted, setMounted] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`relative min-h-screen ${className}`}>
      {/* Black background that fills the entire screen */}
      <div className="fixed top-0 left-0 w-full h-screen bg-black -z-20" />
      
      {/* Try Spline iframe first */}
      <div 
        className="spline-container fixed top-0 w-full h-screen -z-10"
        style={{ 
          background: 'transparent',
          backgroundColor: 'transparent'
        }}
      >
        <iframe 
          src="https://my.spline.design/retrofuturismbganimation-Lb3VtL1bNaYUnirKNzn0FvaW" 
          frameBorder="0" 
          width="100%" 
          height="100%"
          title="3D Animated Background"
          style={{ 
            background: 'transparent',
            backgroundColor: 'transparent',
            border: 'none',
            // CSS filters to transform blue to professional colors
            filter: 'hue-rotate(140deg) saturate(1.3) brightness(1.1) contrast(1.2)'
          }}
          onLoad={() => setIframeLoaded(true)}
          onError={() => setIframeLoaded(false)}
        />
      </div>

      {/* CSS fallback if iframe fails */}
      {!iframeLoaded && (
        <div className="absolute inset-0 -z-5">
          <div className="absolute inset-0 bg-black" />
          
          {/* Enhanced Animated 3D Elements with Professional Colors */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className={`absolute animate-float shadow-lg ${
                i % 5 === 0 ? 'bg-emerald-300/40 w-10 h-10 rounded-lg' :
                i % 5 === 1 ? 'bg-amber-400/40 w-8 h-8 rounded-full' :
                i % 5 === 2 ? 'bg-orange-500/40 w-6 h-6 rotate-45' :
                i % 5 === 3 ? 'bg-emerald-600/40 w-12 h-12 rounded-xl' :
                'bg-amber-700/40 w-14 h-14 rounded-2xl'
              }`}
              style={{
                left: mounted ? `${Math.random() * 100}%` : `${(i * 5) % 100}%`,
                top: mounted ? `${Math.random() * 100}%` : `${(i * 7) % 100}%`,
                animationDelay: mounted ? `${Math.random() * 5}s` : `${i * 0.4}s`,
                animationDuration: mounted ? `${8 + Math.random() * 12}s` : `${8 + i * 0.5}s`,
                transform: mounted ? `rotate(${Math.random() * 360}deg)` : `rotate(${i * 20}deg)`
              }}
            />
          ))}
          
          {/* Enhanced Grid Effects with Professional Colors */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-300/35 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-400/35 to-transparent animate-pulse" style={{ animationDelay: '1.5s' }} />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-orange-500/25 to-transparent animate-pulse" style={{ animationDelay: '2.5s' }} />
            <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-emerald-600/20 to-transparent animate-pulse" style={{ animationDelay: '3.5s' }} />
          </div>
          
          {/* Enhanced Radial Gradients for Depth */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-emerald-300/15 via-transparent to-transparent animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-amber-400/15 via-transparent to-transparent animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-radial from-orange-500/15 via-transparent to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-3/4 left-1/3 w-80 h-80 bg-gradient-radial from-emerald-600/12 via-transparent to-transparent animate-pulse" style={{ animationDelay: '3s' }} />
        </div>
      )}

      {/* Content Overlay */}
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
}; 

// Professional 3D Background (CSS-first with Spline fallback)
export const Professional3DBackground: React.FC<Spline3DBackgroundProps> = ({ 
  className = '',
  children
}) => {
  const [mounted, setMounted] = useState(false);
  const [useSpline, setUseSpline] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Optionally enable Spline if needed (set to false to always use CSS)
    setUseSpline(false);
  }, []);

  return (
    <div className={`relative min-h-screen overflow-hidden ${className}`}>
      {/* Black background that fills the entire screen */}
      <div className="fixed top-0 left-0 w-full h-screen bg-black -z-20" />
      
      {/* Professional CSS Animation (Primary) */}
      {!useSpline && (
        <div className="absolute inset-0 -z-5">
          <div className="absolute inset-0 bg-black" />
          
          {/* Enhanced Floating Geometric Shapes with Professional Colors */}
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className={`absolute animate-float shadow-lg ${
                i % 7 === 0 ? 'bg-emerald-300/45 w-14 h-14 rounded-lg' :
                i % 7 === 1 ? 'bg-amber-400/45 w-10 h-10 rounded-full' :
                i % 7 === 2 ? 'bg-orange-500/45 w-8 h-8 rotate-45' :
                i % 7 === 3 ? 'bg-emerald-600/45 w-12 h-12 rounded-xl' :
                i % 7 === 4 ? 'bg-amber-700/45 w-16 h-16 rounded-2xl' :
                i % 7 === 5 ? 'bg-orange-700/45 w-18 h-18 rounded-3xl' :
                'bg-emerald-900/40 w-20 h-20 rounded-full'
              }`}
              style={{
                left: mounted ? `${Math.random() * 100}%` : `${(i * 3.5) % 100}%`,
                top: mounted ? `${Math.random() * 100}%` : `${(i * 5.5) % 100}%`,
                animationDelay: mounted ? `${Math.random() * 7}s` : `${i * 0.25}s`,
                animationDuration: mounted ? `${12 + Math.random() * 18}s` : `${12 + i * 0.5}s`,
                transform: mounted ? `rotate(${Math.random() * 360}deg)` : `rotate(${i * 12}deg)`
              }}
            />
          ))}
          
          {/* Enhanced Animated Grid Lines with Professional Colors */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-400/40 to-transparent animate-pulse" style={{ animationDelay: '2s' }} />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-orange-500/30 to-transparent animate-pulse" style={{ animationDelay: '3s' }} />
            <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-emerald-600/25 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-amber-700/20 to-transparent animate-pulse" style={{ animationDelay: '4s' }} />
          </div>
          
          {/* Enhanced Radial Gradients for Depth with Professional Colors */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-emerald-300/20 via-transparent to-transparent animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-amber-400/20 via-transparent to-transparent animate-pulse" style={{ animationDelay: '3s' }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-radial from-orange-500/20 via-transparent to-transparent animate-pulse" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-3/4 left-1/3 w-80 h-80 bg-gradient-radial from-emerald-600/15 via-transparent to-transparent animate-pulse" style={{ animationDelay: '4s' }} />
          <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-gradient-radial from-amber-700/15 via-transparent to-transparent animate-pulse" style={{ animationDelay: '2.5s' }} />
          <div className="absolute top-1/3 right-1/4 w-88 h-88 bg-gradient-radial from-orange-700/15 via-transparent to-transparent animate-pulse" style={{ animationDelay: '5s' }} />
        </div>
      )}
      
      {/* Spline Fallback (if enabled) */}
      {useSpline && (
        <div 
          className="spline-container fixed top-0 w-full h-screen -z-10"
          style={{ 
            background: 'transparent',
            backgroundColor: 'transparent'
          }}
        >
          <iframe 
            src="https://my.spline.design/retrofuturismbganimation-Lb3VtL1bNaYUnirKNzn0FvaW" 
            frameBorder="0" 
            width="100%" 
            height="100%"
            title="3D Animated Background"
            style={{ 
              background: 'transparent',
              backgroundColor: 'transparent',
              border: 'none',
              // CSS filters to transform blue to professional colors
              filter: 'hue-rotate(140deg) saturate(1.3) brightness(1.1) contrast(1.2)'
            }}
          />
        </div>
      )}

      {/* Content Overlay */}
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
}; 