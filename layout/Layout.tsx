import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import { Spline3DBackground } from '../components/ui/Spline3DBackground';

interface LayoutProps {
  children: React.ReactNode;
  use3DSplineBackground?: boolean;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  use3DSplineBackground = false,
  className = ""
}) => {
  const [is3DBackground, setIs3DBackground] = useState(false);

  useEffect(() => {
    // Check if we're on a page with 3D background
    const has3DBackground = use3DSplineBackground || 
                           document.body.getAttribute('data-3d-background') === 'true' ||
                           document.documentElement.getAttribute('data-3d-background') === 'true';
    
    setIs3DBackground(has3DBackground);
    
    // Set data attributes for CSS styling
    if (has3DBackground) {
      document.body.setAttribute('data-3d-background', 'true');
      document.documentElement.setAttribute('data-3d-background', 'true');
    } else {
      document.body.removeAttribute('data-3d-background');
      document.documentElement.removeAttribute('data-3d-background');
    }

    return () => {
      // Cleanup on unmount
      document.body.removeAttribute('data-3d-background');
      document.documentElement.removeAttribute('data-3d-background');
    };
  }, [use3DSplineBackground]);

  return (
    <>
      <Head>
        <title>Audio Service App</title>
        <meta name="description" content="Music production, beats, and services" />
      </Head>
      
      {is3DBackground ? (
        // 3D Spline Background Layout
        <Spline3DBackground>
          <div className="bg-3d-spline-container">
            <Header />
            <main className={`bg-3d-spline-content mx-auto max-w-7xl px-4 py-10 lg:py-16 flex-1 ${className}`}>
              {children}
            </main>
            <Footer />
          </div>
        </Spline3DBackground>
      ) : (
        // Standard Layout
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className={`mx-auto max-w-7xl px-4 py-10 lg:py-16 flex-1 ${className}`}>
            {children}
          </main>
          <Footer />
        </div>
      )}
    </>
  );
};

export default Layout;
