
# Tech Stack & Minimal Styles

> **UI/UX Note:** All UI/UX, visual, and style-related tech stack decisions must reference the [Style Guide](./style_guide.md) for tokens, patterns, and future/planned features.

**Related Docs:** [README](./README.md) | [Checklists](./checklists.md) | [Wireframes](./wireframes.md) | [Component Map](./component_map.md) | [Best Practices](./best_practices.md)

---

## Purpose
Document the core technologies, libraries, and minimal style/layout plan for the Audio Service App MVP.

---

## Table of Contents
- [Core Tech Stack](#core-tech-stack)
- [Starter Components](#starter-components)
- [Page Containers](#page-containers)
- [Tailwind Setup](#tailwind-setup)
- [UX Considerations](#ux-considerations)
- [Future Enhancements](#future-enhancements)

---

## Core Tech Stack
- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS
- **Type Safety:** TypeScript
- **UI Libraries:** Headless UI, Framer Motion
- **Audio:** Wavesurfer.js
- **Payments:** Stripe SDK
- **Auth:** NextAuth.js (Google OAuth)
- **Email:** SendGrid
- **Database:** Supabase/Postgres or MongoDB
- **File Storage:** AWS S3 or Cloudinary
- **Testing:** Jest, Playwright/Cypress
- **CI/CD:** GitHub Actions, Vercel
- **Development Tools:** Model Context Protocol (MCP) with Context7 integration

---

## Starter Components
- **Button Component:** Minimal styles with Tailwind utility classes. Variants: Primary (CTA) and Secondary.
- **Card Component:** Used for beats, blog posts, or portfolio items. Responsive grid support.
- **AudioPlayer Component:** Minimal Wavesurfer.js integration for beat previews. Sticky at bottom of the page.

---

## Page Containers
- **Home Page:** Hero section, featured beats grid, contact CTA banner.
- **Beat Store:** Grid layout, minimal filtering bar, add to cart button.
- **Contact:** Minimal contact form, placeholder API route.

---

## Tailwind Setup (v4)

### Current Configuration
The project uses Tailwind CSS v4 with modern configuration that provides enhanced performance and features.

#### PostCSS Configuration
```js
// postcss.config.js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

#### CSS Import Syntax
```css
/* styles/globals.css */
@import "tailwindcss";
```

#### Configuration File
```js
// tailwind.config.js
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
      colors: {
        // Enhanced brand colors inspired by PulseSync
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
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
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
      },
      animation: {
        fadeUp: 'fadeUp 0.8s ease-out forwards',
        'fade-up-stagger': 'fade-up-stagger 0.8s ease-out forwards',
        'scale-in': 'scale-in 0.6s ease-out forwards',
        'slide-up': 'slide-up 0.5s ease-out forwards',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'glow-pulse-amber': 'glow-pulse-amber 2s ease-in-out infinite',
      },
      fontSize: {
        'hero': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'headline': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'title': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'subtitle': ['1.125rem', { lineHeight: '1.4' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'caption': ['0.875rem', { lineHeight: '1.5' }],
        'small': ['0.75rem', { lineHeight: '1.4' }],
        'display-large': ['4.5rem', { lineHeight: '0.9', letterSpacing: '-0.03em' }],
        'display-medium': ['3.5rem', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        'display-small': ['2.75rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'section': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'card-title': ['1.25rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'ui-text': ['0.875rem', { lineHeight: '1.4' }],
        'micro': ['0.75rem', { lineHeight: '1.3' }],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    // Custom plugin for PulseSync-inspired utilities
    function({ addUtilities, theme }) {
      const newUtilities = {
        '.animate-fade-up-stagger': { 
          animation: 'fadeUp 0.8s ease-out forwards' 
        },
        '.animate-delay-1': { animationDelay: '0.15s' },
        '.animate-delay-2': { animationDelay: '0.25s' },
        '.animate-delay-3': { animationDelay: '0.35s' },
        '.animate-delay-4': { animationDelay: '0.45s' },
        '.animate-delay-5': { animationDelay: '0.55s' },
        '.animate-delay-6': { animationDelay: '0.65s' },
        '.animate-delay-7': { animationDelay: '0.75s' },
        '.animate-delay-8': { animationDelay: '0.85s' },
        '.text-balance': { textWrap: 'balance' },
        '.text-pretty': { textWrap: 'pretty' },
      }
      addUtilities(newUtilities)
    }
  ],
}
```

#### Dependencies
```json
{
  "tailwindcss": "^4.1.11",
  "@tailwindcss/postcss": "^4.1.11",
  "@tailwindcss/typography": "^0.5.16",
  "@tailwindcss/aspect-ratio": "^0.4.2",
  "autoprefixer": "^10.4.21",
  "postcss": "^8.5.6"
}
```

### Migration Notes
- **Modern v4 Setup**: Using latest Tailwind CSS v4 for enhanced performance
- **Simplified Syntax**: Using `@import "tailwindcss"` and `@tailwindcss/postcss` plugin
- **Enhanced Features**: Custom animations, typography scale, and PulseSync-inspired design tokens
- **Full Compatibility**: All custom styles, animations, and theme extensions work perfectly
- **Future Ready**: Built on the latest Tailwind architecture for long-term maintainability

---

## UX Considerations
- Keep buttons and interactive elements large enough for mobile users.
- Use Tailwind’s `hover:` and `focus:` states for minimal interactivity.
- Plan for progressive enhancement (animations, advanced UX) later.

---

## Development Tools

### Model Context Protocol (MCP) Setup
The project includes MCP integration for enhanced AI development capabilities:

#### Context7 MCP Server
- **Package:** `@upstash/context7-mcp`
- **Configuration:** Located in `~/.cursor/mcp.json`
- **Transport:** stdio (default)
- **Usage:** Provides context-aware development assistance through Cursor

#### MCP Configuration
```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["@upstash/context7-mcp"],
      "env": {}
    }
  }
}
```

#### Installation Notes
- Installed locally via npm: `npm install @upstash/context7-mcp`
- Configured for Cursor IDE integration
- Supports stdio transport for seamless communication
- No additional environment variables required for basic setup

---

## Future Enhancements
- Replace placeholder styles with a custom design system.
- Add Framer Motion animations for page transitions and hover effects.
- Enhance Beat Store filters with live search and tag-based filtering.
