
# Coding Best Practices

> **UI/UX Note:** All UI/UX, visual, and style-related best practices must reference the [Style Guide](./style_guide.md) for tokens, patterns, and future/planned features.

**Related Docs:** [README](./README.md) | [Checklists](./checklists.md) | [Wireframes](./wireframes.md) | [Component Map](./component_map.md) | [Roadmap](./roadmap.md)

---

## Purpose
Ensure the Audio Service App is built with clean, maintainable, and scalable code, following industry standards.

---

## Table of Contents
- [Project Structure](#project-structure)
- [Code Quality & Standards](#code-quality--standards)
- [Version Control & Git](#version-control--git)
- [Component Design](#component-design)
- [Performance Optimization](#performance-optimization)
- [Security & Privacy](#security--privacy)
- [Testing](#testing)
- [CI/CD Workflow](#cicd-workflow)
- [Documentation](#documentation)
- [Tailwind CSS v4 Best Practices](#tailwind-css-v4-best-practices)
- [Future Scalability](#future-scalability)

---

## Project Structure
- Use a clear, modular folder structure:
  ```
  /components    # Reusable UI components
  /pages         # Next.js pages
  /styles        # Tailwind CSS and global styles
  /lib           # Utility functions, API clients
  /public        # Static assets
  /api           # API routes (if applicable)
  ```
- Maintain separate configuration files for environment variables, constants, and settings.

---

## Code Quality & Standards
- Use ESLint and Prettier for consistent formatting and code style.
- Adopt TypeScript for type safety and reduced runtime errors.
- Follow the DRY (Don’t Repeat Yourself) principle by creating reusable components (e.g., buttons, cards, modals).
- Use descriptive variable and function names.

---

## Version Control & Git
- Use feature branches with clear naming (e.g., `feature/beat-store`, `fix/cart-bug`).
- Write meaningful commit messages (e.g., "Add waveform preview to Beat Store").
- Use pull requests and code reviews for quality checks.

---

## Component Design
- Implement atomic design principles where components are built from smaller units:
  - **Atoms:** Buttons, icons, input fields.
  - **Molecules:** Card components, form groups.
  - **Organisms:** Beat store grid, navigation bar.
- Ensure components are responsive and tested for accessibility (ARIA labels, keyboard navigation).

---

## Performance Optimization
- Use Next.js Image component for optimized image loading.
- Implement lazy-loading for audio previews, blog posts, and portfolio items.
- Minimize bundle size with tree-shaking and code splitting.
- Cache frequently accessed data (e.g., beats list) using SWR or React Query.

---

## Security & Privacy
- Validate all API inputs and sanitize outputs.
- Use HTTPS everywhere (Vercel auto-enforces SSL).
- Avoid storing sensitive keys on the client side; store them in environment variables.
- Follow OWASP best practices to prevent vulnerabilities like XSS or CSRF.

---

## Testing
- Write unit tests for critical components (e.g., checkout flow, audio player).
- Use integration tests with Playwright or Cypress for end-to-end workflows.
- Set up test environments using Stripe sandbox mode and mock APIs.

---

## CI/CD Workflow
- Use GitHub Actions or Vercel CI/CD pipelines for automated deployment.
- Run linting and tests on every pull request before merging.
- Enable preview deployments for testing new features.

---

## Documentation
- Document all components with JSDoc or TypeScript docstrings.
- Maintain a `README.md` for setup instructions, environment variables, and build commands.
- Keep a changelog for tracking features, bug fixes, and updates.

## Tailwind CSS v4 Best Practices

### **Core Configuration**
- **CSS Imports**: Use `@import "tailwindcss";` directive (v4 syntax)
- **PostCSS Plugin**: Use `@tailwindcss/postcss: {}` in PostCSS configuration
- **Plugin Imports**: Use `require('@tailwindcss/plugin')` for plugin imports
- **Configuration**: Use `module.exports` with proper TypeScript annotations
- **File Organization**: Keep all Tailwind-related styles in `styles/globals.css`
- **Component Styles**: Use separate `styles/components.css` file for custom component styles
- **Theme Extensions**: Extend the theme object for custom colors, fonts, and animations

### **v4-Specific Patterns**

#### **CSS Import Structure**
```css
/* styles/globals.css */
@import "tailwindcss";
@import "./components.css";

/* styles/components.css */
/* Custom component styles with regular CSS properties */
.btn-primary {
  background-color: theme('colors.amber.500');
  color: theme('colors.white');
  padding: theme('spacing.3') theme('spacing.6');
  border-radius: theme('borderRadius.lg');
  font-weight: theme('fontWeight.medium');
  transition: all 0.2s ease-in-out;
}

.btn-primary:hover {
  background-color: theme('colors.amber.600');
  transform: translateY(-1px);
  box-shadow: theme('boxShadow.lg');
}
```

#### **PostCSS Configuration**
```js
// postcss.config.js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

#### **Enhanced Theme Configuration**
```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './layout/**/*.{js,ts,jsx,tsx,mdx}',
    './ui/**/*.{js,ts,jsx,tsx,mdx}',
    './*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Enhanced brand colors
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
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Instrument Serif"', 'serif'],
        mono: ['"Geist Mono"', 'monospace'],
      },
      fontSize: {
        'display-large': ['4.5rem', { lineHeight: '0.9', letterSpacing: '-0.03em' }],
        'display-medium': ['3.5rem', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        'display-small': ['2.75rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'section': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'card-title': ['1.25rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'ui-text': ['0.875rem', { lineHeight: '1.4' }],
        'micro': ['0.75rem', { lineHeight: '1.3' }],
      },
      animation: {
        'fade-up-stagger': 'fade-up-stagger 0.8s ease-out forwards',
        'scale-in': 'scale-in 0.6s ease-out forwards',
        'slide-up': 'slide-up 0.5s ease-out forwards',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'glow-pulse-amber': 'glow-pulse-amber 2s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    // Custom plugin for enhanced utilities
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
};
```

### **v4 Performance Optimizations**
- **Simplified CSS**: v4 generates more efficient CSS with fewer unused styles
- **Better Tree Shaking**: Improved removal of unused utility classes
- **Faster Build Times**: Optimized compilation process
- **Reduced Bundle Size**: More efficient CSS output

### **v4 Component Patterns**

#### **Custom Component Classes**
```css
/* styles/components.css */
/* Button Components */
.btn-primary {
  @apply bg-amber-500 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200;
}

.btn-primary:hover {
  @apply bg-amber-600 transform -translate-y-0.5 shadow-lg;
}

.btn-secondary {
  @apply bg-neutral-800 text-neutral-100 px-6 py-3 rounded-lg font-medium transition-all duration-200;
}

.btn-secondary:hover {
  @apply bg-neutral-700 transform -translate-y-0.5 shadow-lg;
}

/* Card Components */
.card-base {
  @apply bg-black rounded-xl ring-1 ring-neutral-800/60 p-6;
}

.card-interactive {
  @apply bg-black rounded-xl ring-1 ring-neutral-800/60 p-6 transition-all duration-300 hover:ring-neutral-700/60 hover:shadow-card-hover;
}

.card-glass {
  @apply bg-black/90 backdrop-blur-sm rounded-xl ring-1 ring-neutral-800/60 p-6;
}

.card-elevated {
  @apply bg-black rounded-xl ring-1 ring-neutral-800/60 p-6 shadow-elevated;
}

/* Text Components */
.text-display {
  @apply font-display text-display-medium text-neutral-100;
}

.text-success {
  @apply text-emerald-500;
}

.text-accent {
  @apply text-amber-500;
}

.text-ui {
  @apply text-ui-text text-neutral-400;
}

/* Badge Components */
.badge-success {
  @apply bg-emerald-900 text-emerald-100 px-2 py-1 rounded text-micro font-medium;
}

.badge-accent {
  @apply bg-amber-950 text-amber-100 px-2 py-1 rounded text-micro font-medium;
}

.badge-neutral {
  @apply bg-neutral-800 text-neutral-300 px-2 py-1 rounded text-micro font-medium;
}

.badge-new {
  @apply bg-emerald-500 text-white px-2 py-1 rounded text-micro font-medium;
}

/* Input Components */
.input-base {
  @apply bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-neutral-100 placeholder-neutral-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors;
}

.input-success {
  @apply bg-neutral-900 border border-emerald-600 rounded-lg px-4 py-3 text-neutral-100 placeholder-neutral-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors;
}

.input-error {
  @apply bg-neutral-900 border border-red-600 rounded-lg px-4 py-3 text-neutral-100 placeholder-neutral-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors;
}

/* Hover Effects */
.hover-lift {
  @apply transition-transform duration-200 hover:-translate-y-1;
}

.hover-glow {
  @apply transition-all duration-200 hover:shadow-glow;
}

.hover-glow-amber {
  @apply transition-all duration-200 hover:shadow-glow-amber;
}

/* Glass Effects */
.glass-light {
  @apply bg-white/10 backdrop-blur-sm border border-white/20;
}

.glass-dark {
  @apply bg-black/50 backdrop-blur-sm border border-neutral-800/60;
}

/* Gradient Text */
.gradient-text {
  @apply bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent;
}

.gradient-text-amber {
  @apply bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent;
}

.gradient-text-emerald {
  @apply bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent;
}
```

### **v4 Animation Patterns**

#### **Staggered Animations**
```tsx
// Component with staggered animations
const StaggeredGrid = ({ items }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, index) => (
        <div 
          key={item.id}
          className={`animate-fade-up-stagger animate-delay-${Math.min(index + 1, 8)}`}
        >
          <CardComponent item={item} />
        </div>
      ))}
    </div>
  );
};
```

#### **Interactive Animations**
```tsx
// Component with interactive animations
const InteractiveCard = ({ children }) => {
  return (
    <div className="card-interactive hover-lift hover-glow group">
      <div className="group-hover:scale-105 transition-transform duration-300">
        {children}
      </div>
    </div>
  );
};
```

### **v4 Responsive Patterns**

#### **Mobile-First Typography**
```tsx
// Responsive typography with v4 custom classes
const HeroSection = () => {
  return (
    <section className="py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-display-small sm:text-display-medium lg:text-display-large text-balance">
          Your Next Hit Starts Here
        </h1>
        <p className="text-body sm:text-subtitle lg:text-section text-neutral-400 mt-4">
          Exclusive beats and pro mixing services tailored to artists like you.
        </p>
      </div>
    </section>
  );
};
```

### **v4 Best Practices Summary**

#### **Do's** ✅
- Use `@import "tailwindcss";` for CSS imports
- Use `@tailwindcss/postcss` plugin in PostCSS config
- Keep custom styles in separate `components.css` file
- Use `theme()` function for accessing design tokens in CSS
- Leverage custom animation delays for staggered effects
- Use semantic class names for better maintainability
- Implement mobile-first responsive design
- Use custom typography scale for consistent text sizing

#### **Don'ts** ❌
- Don't use old `@tailwind` directives (v3 syntax)
- Don't use `tailwindcss: {}` in PostCSS config
- Don't mix v3 and v4 syntax in the same project
- Don't inline complex styles when custom classes exist
- Don't forget to test animations on mobile devices
- Don't use hardcoded values when design tokens exist

---

## Future Scalability
- Use a modular API design (REST or GraphQL) for clean data management.
- Prepare for future integrations (e.g., AI features) by keeping services decoupled.
- Maintain a `config` directory for scaling settings like pricing tiers or filters.
