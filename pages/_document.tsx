import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="YBF Studio - Beats, Mixing & Mastering Services" />
        <link rel="icon" href="/assets/logo/main-logo.png" />
        
        {/* Font Preconnect for Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Font Preloading for Critical Fonts */}
        <link 
          rel="preload" 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" 
          as="style" 
          onLoad={() => {
            const link = document.querySelector('link[href*="Inter"]');
            if (link) {
              link.setAttribute('rel', 'stylesheet');
            }
          }}
        />
        <link 
          rel="preload" 
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:wght@400;500&display=swap" 
          as="style" 
          onLoad={() => {
            const link = document.querySelector('link[href*="Instrument+Serif"]');
            if (link) {
              link.setAttribute('rel', 'stylesheet');
            }
          }}
        />
      </Head>
      <body className="bg-neutral-900 text-neutral-100">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
