/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './layout/**/*.{js,ts,jsx,tsx,mdx}',
    './ui/**/*.{js,ts,jsx,tsx,mdx}',
    './*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    extend: {
      // Semantic z-index scale for consistent layering
      zIndex: {
        overlay: '900',
        modal: '1000',
      },
      colors: {
        // 3D Spline Professional Color Palette - Phase 12E
        '3d-spline': {
          // Primary 3D Spline Colors
          primary: {
            emerald: '#10B981',      // Primary brand color
            amber: '#F59E0B',        // Accent color
            orange: '#F97316',       // Energy color
            emeraldDark: '#059669',  // Secondary emerald
          },
          // Background colors for 3D Spline
          background: {
            primary: '#0A0A0A',      // Deep black for 3D effect
            secondary: '#171717',    // Slightly lighter black
            tertiary: '#262626',     // Card backgrounds
            overlay: 'rgba(0, 0, 0, 0.8)', // 3D overlay
          },
          // Text colors optimized for 3D backgrounds
          text: {
            primary: '#FFFFFF',      // Pure white for contrast
            secondary: '#E5E5E5',    // Light gray
            muted: '#A3A3A3',        // Muted text
            accent: '#10B981',       // Emerald accent text
          },
          // 3D Spline specific gradients
          gradient: {
            primary: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            secondary: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            background: 'linear-gradient(135deg, #0A0A0A 0%, #171717 100%)',
          }
        },
        // Professional Brand Colors - Mathematically Harmonious
        brand: {
          primary: 'hsl(210, 60%, 50%)',      // #3B5BDB - Main brand color
          secondary: 'hsl(210, 60%, 40%)',    // #2F4F8F - Darker blue
          accent: 'hsl(210, 60%, 60%)',       // #5B7BDB - Lighter blue
        },
        accent: {
          warm: 'hsl(30, 60%, 50%)',          // #DB8F3B - Warm amber
          cool: 'hsl(180, 60%, 50%)',         // #3BDBDB - Cool teal
          neutral: 'hsl(270, 40%, 50%)',      // #8F7FDB - Muted purple
        },
        background: {
          primary: 'hsl(220, 15%, 25%)',      // #2A2B2F - Main background (increased visibility)
          secondary: 'hsl(220, 15%, 35%)',    // #3A3B3F - Card backgrounds (increased visibility)
          tertiary: 'hsl(220, 15%, 45%)',     // #4A4B4F - Elevated elements (increased visibility)
        },
        text: {
          primary: 'hsl(0, 0%, 98%)',         // #FAFAFA - Main text (brighter)
          secondary: 'hsl(0, 0%, 85%)',       // #D9D9D9 - Secondary text (brighter)
          muted: 'hsl(0, 0%, 70%)',           // #B3B3B3 - Muted text (brighter)
        },
        // Mathematical Harmony - Triadic Colors (120° apart)
        triadic: {
          blue: 'hsl(210, 60%, 50%)',         // #3B5BDB
          magenta: 'hsl(330, 60%, 50%)',      // #DB3B8F
          green: 'hsl(90, 60%, 50%)',         // #8FDB3B
        },
        // Legacy colors for backward compatibility
        amber: {
          400: '#FBBF24',
          500: '#FCA311',
          600: '#D97706',
          700: '#B45309',
          950: '#451A03',
        },
        emerald: {
          100: '#D1FAE5',
          300: '#6EE7B7',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          900: '#064e3b',
          950: '#022c22',
        },
        teal: {
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
        },
        blue: {
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
        },
        // Bridge colors for smooth transitions
        'amber-light': '#F59E0B',
        'emerald-light': '#6EE7B7',
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0A0A0A',
        },
        // Legacy brand colors
        navy: '#14213D',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Instrument Serif"', 'serif'],
        mono: ['"Geist Mono"', 'monospace'],
        'instrument-serif': ['"Instrument Serif"', 'serif'],
        'bricolage': ['"Bricolage Grotesque"', 'sans-serif'],
        'jakarta': ['"Plus Jakarta Sans"', 'sans-serif'],
        'manrope': ['"Manrope"', 'sans-serif'],
        'space-grotesk': ['"Space Grotesk"', 'sans-serif'],
        // Premium typography additions
        'geist': ['Geist', 'sans-serif'],
        'playfair': ['Playfair Display', 'serif'],
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeDown: {
          '0%': { opacity: '0', transform: 'translateY(-24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeLeft: {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeRight: {
          '0%': { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        // Phase 9: Netchill-inspired animations
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInBlur: {
          '0%': { opacity: '0', filter: 'blur(4px)' },
          '100%': { opacity: '1', filter: 'blur(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        rotateIn: {
          '0%': { opacity: '0', transform: 'rotate(12deg)' },
          '100%': { opacity: '1', transform: 'rotate(0deg)' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.75)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        // PulseSync-inspired animations
        'fade-up-stagger': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(16, 185, 129, 0.6)' },
        },
        'glow-pulse-amber': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(252, 163, 17, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(252, 163, 17, 0.6)' },
        },
        // Enhanced animations for mathematical harmony
        'fadeInUp': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fadeInBlur': {
          '0%': { opacity: '0', filter: 'blur(4px)' },
          '100%': { opacity: '1', filter: 'blur(0)' },
        },
        'glowPulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(20, 184, 166, 0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(20, 184, 166, 0.4)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.8s ease-out forwards',
        fadeDown: 'fadeDown 0.8s ease-out forwards',
        fadeLeft: 'fadeLeft 0.8s ease-out forwards',
        fadeRight: 'fadeRight 0.8s ease-out forwards',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s linear infinite',
        // Enhanced animations
        'fade-up-stagger': 'fade-up-stagger 0.8s ease-out forwards',
        'scale-in': 'scale-in 0.6s ease-out forwards',
        'slide-up': 'slide-up 0.5s ease-out forwards',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'glow-pulse-amber': 'glow-pulse-amber 2s ease-in-out infinite',
        // New harmonious animations
        'fade-in': 'fadeInUp 0.8s ease-out forwards',
        'fade-in-blur': 'fadeInBlur 0.8s ease-out forwards',
        'glow-pulse-harmonious': 'glowPulse 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          lg: '2rem',
          xl: '2.5rem',
          '2xl': '3rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1536px',
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'card': '0 1px 3px rgba(0,0,0,.2)',
        'elevated': '0 4px 6px rgba(0,0,0,.1)',
        'glow': '0 0 20px rgba(16, 185, 129, 0.3)',
        'glow-amber': '0 0 20px rgba(252, 163, 17, 0.3)',
        // PulseSync-inspired shadows
        'card-hover': '0 4px 12px rgba(0,0,0,.3)',
        'modal': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'inner-glow': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        // Enhanced shadow system for mathematical harmony
        'macos': '0 2.8px 2.2px rgba(0, 0, 0, 0.034), 0 6.7px 5.3px rgba(0, 0, 0, 0.048), 0 12.5px 10px rgba(0, 0, 0, 0.06), 0 22.3px 17.9px rgba(0, 0, 0, 0.072), 0 41.8px 33.4px rgba(0, 0, 0, 0.086), 0 100px 80px rgba(0, 0, 0, 0.12)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 20px 40px rgba(0, 0, 0, 0.15), 0 10px 20px rgba(0, 0, 0, 0.1)',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '40px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-hero': 'linear-gradient(135deg, #171717 0%, #023535 100%)',
        'gradient-card': 'linear-gradient(135deg, #000000 0%, #171717 100%)',
        // PulseSync-inspired gradients
        'gradient-emerald': 'linear-gradient(135deg, #064e3b 0%, #059669 50%, #10b981 100%)',
        'gradient-amber': 'linear-gradient(135deg, #451a03 0%, #b45309 50%, #fbbf24 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(23,23,23,0.8) 100%)',
        'gradient-emerald-amber': 'linear-gradient(135deg, #10b981 0%, #fbbf24 100%)',
        'gradient-orange': 'linear-gradient(135deg, #9a3412 0%, #ea580c 50%, #f97316 100%)',
        'gradient-emerald-orange': 'linear-gradient(135deg, #10b981 0%, #f97316 100%)',
        // Mathematical harmony gradients
        'gradient-hybrid': 'linear-gradient(135deg, #FCA311 0%, #F59E0B 20%, #10B981 40%, #14b8a6 60%, #3b82f6 100%)',
        'gradient-complementary': 'linear-gradient(135deg, #FCA311 0%, #3b82f6 100%)',
        'gradient-teal-blue': 'linear-gradient(135deg, #14b8a6 0%, #3b82f6 100%)',
        'gradient-amber-emerald': 'linear-gradient(135deg, #FCA311 0%, #10B981 100%)',
        'gradient-harmonious': 'linear-gradient(135deg, #FCA311 0%, #14B8A6 100%)',
        'gradient-warm': 'linear-gradient(135deg, #FBBF24 0%, #D97706 100%)',
        'gradient-cool': 'linear-gradient(135deg, #5EEAD4 0%, #0D9488 100%)',
        // Premium gradients
        'gradient-premium': 'linear-gradient(135deg, hsl(220, 15%, 12%) 0%, hsl(220, 15%, 18%) 50%, hsl(220, 15%, 12%) 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 50%, rgba(255, 255, 255, 0.01) 100%)',
        'gradient-overlay': 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.55) 50%, transparent 100%)',
        'gradient-accent': 'radial-gradient(ellipse at 80% 0%, rgba(20, 184, 166, 0.07) 0%, transparent 70%)',
        // Phase 9: Netchill-inspired gradients
        'gradient-netchill': 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        'gradient-netchill-card': 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 50%, rgba(255, 255, 255, 0.01) 100%)',
        'gradient-netchill-overlay': 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 50%, transparent 100%)',
        'gradient-netchill-accent': 'radial-gradient(ellipse at 80% 0%, rgba(20, 184, 166, 0.1) 0%, transparent 70%)',
        'gradient-grid': 'linear-gradient(rgba(20,184,166,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.1) 1px, transparent 1px)',
        'gradient-dots': 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
        'gradient-pattern-grid': 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
        'gradient-waves': 'radial-gradient(ellipse at center, rgba(20,184,166,0.1) 0%, transparent 70%)',
        'gradient-circles': 'radial-gradient(circle at 50% 50%, rgba(20,184,166,0.1) 0%, transparent 50%)',
        // Professional Gradient System
        'gradient-professional': 'linear-gradient(135deg, hsl(220, 15%, 25%) 0%, hsl(220, 15%, 35%) 50%, hsl(220, 15%, 25%) 100%)',
        'gradient-brand': 'linear-gradient(135deg, hsl(210, 60%, 50%) 0%, hsl(180, 60%, 50%) 100%)',
        'gradient-warm': 'linear-gradient(135deg, hsl(30, 60%, 50%) 0%, hsl(210, 60%, 50%) 100%)',
        'gradient-cool': 'linear-gradient(135deg, hsl(180, 60%, 50%) 0%, hsl(210, 60%, 50%) 100%)',
        'gradient-pulse': 'linear-gradient(135deg, hsl(210, 60%, 50%) 0%, hsl(180, 60%, 50%) 25%, hsl(30, 60%, 50%) 50%, hsl(270, 40%, 50%) 75%, hsl(210, 60%, 50%) 100%)',
        'gradient-overlay-subtle': 'linear-gradient(135deg, hsl(220, 15%, 12%) 0%, transparent 50%, hsl(220, 15%, 12%) 100%)',
        'gradient-testimonial': 'linear-gradient(135deg, #0D0D0D 0%, #023535 100%)',
      },
      backgroundSize: {
        'grid': '50px 50px',
        'dots': '20px 20px',
        'pattern-grid': '40px 40px',
        'grid-small': '30px 30px',
        'grid-medium': '50px 50px',
        'grid-large': '80px 80px',
      },
      fontSize: {
        'hero': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'headline': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'title': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'subtitle': ['1.125rem', { lineHeight: '1.4' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'caption': ['0.875rem', { lineHeight: '1.5' }],
        'small': ['0.75rem', { lineHeight: '1.4' }],
        // PulseSync-inspired typography
        'display-large': ['4.5rem', { lineHeight: '0.9', letterSpacing: '-0.03em' }],
        'display-medium': ['3.5rem', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        'display-small': ['2.75rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'section': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'card-title': ['1.25rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'ui-text': ['0.875rem', { lineHeight: '1.4' }],
        'micro': ['0.75rem', { lineHeight: '1.3' }],
        // Phase 9: Netchill-inspired typography
        'font-display-premium': ['Inter', 'sans-serif'],
        'font-heading-premium': ['Inter', 'sans-serif'],
        'font-body-premium': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};