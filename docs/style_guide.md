# PulseSync-Inspired Style Guide & Design Tokens

This guide is based on the modern design patterns from PulseSync, featuring refined typography, sophisticated color usage, and enhanced user experience with a focus on professional audio services.

---

## 1 Typography

| Token            | Font Stack                                       | Usage                                |
| ---------------- | ------------------------------------------------ | ------------------------------------ |
| **font-sans**    | `Inter`, system‑ui, sans‑serif                   | Body text, UI elements, buttons      |
| **font-display** | `"Instrument Serif"`, serif                      | Large headlines, hero copy           |
| **font-mono**    | `"Geist Mono"`, monospace                        | Code snippets, technical text        |

*Sizing scale* (rem): 
- `display-large 4.5` (72px) - Hero headlines
- `display-medium 3.5` (56px) - Large section headlines
- `display-small 2.75` (44px) - Medium section headlines
- `section 2` (32px) - Section headlines  
- `card-title 1.25` (20px) - Card headlines
- `body 1` (16px) - Body text
- `ui-text 0.875` (14px) - UI elements, buttons
- `micro 0.75` (12px) - Small text, captions

*Letter‑spacing:* 
- `tracking-tight` (-0.02em) for display fonts
- `tracking-normal` for body text
- `tracking-widest` for small caps labels

---

## 2 Colour Palette

| Role                      | Hex                           | Tailwind Token                     | Usage                                |
| ------------------------- | ----------------------------- | ---------------------------------- | ------------------------------------ |
| **Primary Accent**        | `#FCA311`                     | `amber-500`                        | CTAs, highlights, primary actions    |
| **Primary Accent Light**  | `#FBBF24`                     | `amber-400`                        | Hover states, secondary actions      |
| **Primary Accent Dark**   | `#451A03`                     | `amber-950`                        | Badge backgrounds, time counters     |
| **Secondary Accent**      | `#6EE7B7`                     | `emerald-300`                      | Success states, positive indicators  |
| **Secondary Accent Dark** | `#059669`                     | `emerald-600`                      | Success backgrounds, badges          |
| **Success**               | `#10B981`                     | `emerald-500`                      | Success states, charts              |
| **UI Surface Dark**       | `#171717`                     | `neutral-900`                      | Main background                     |
| **Card Bg**               | `#000000`                     | `bg-black`                         | Card backgrounds                    |
| **Card Border**           | `rgba(38,38,38,0.6)`          | `ring-neutral-800/60`              | Card borders, subtle separation      |
| **Text Primary**          | `#F5F5F5`                     | `text-neutral-100`                 | Primary text                        |
| **Text Muted**            | `rgba(245,245,245,0.6)`       | `text-neutral-500`                 | Secondary text, metadata            |
| **Error**                 | `#EF4444`                     | `red-500`                          | Error states                        |
| **Badge Success Bg**      | `#064e3b`                     | `bg-emerald-900`                   | Success badges                      |
| **Badge Success Text**    | `#D1FAE5`                     | `text-emerald-100`                 | Success badge text                  |

> **Gradient sample:** `bg-[linear-gradient(135deg,#171717_0%,#023535_100%)]` (hero backgrounds)
> **Glass effect:** `backdrop-blur bg-black/90` (overlay buttons)

---

## 3 Spacing & Sizing

* Base unit = **4px** (`1 = 0.25rem`)
* **Container max‑width:** `1280px` (`max-w-7xl`)
* **Container padding:** `px-4` (mobile), `lg:px-8` (desktop)
* **Section spacing:** `py-10` (mobile), `lg:py-16` (desktop)
* **Card padding:** `p-6` (standard), `p-4` (compact)
* **Radius:** `rounded-xl` (`0.75rem`) for cards, `rounded-full` for buttons
* **Shadow:** `shadow-sm` on cards, `shadow-modal` on modals

---

## 4 Enhanced Tailwind Configuration

```ts
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Primary brand colors inspired by PulseSync
        amber: {
          400: '#FBBF24',
          500: '#FCA311',
          950: '#451A03',
        },
        emerald: {
          100: '#D1FAE5',
          300: '#6EE7B7',
          500: '#10B981',
          600: '#059669',
          900: '#064e3b',
          950: '#022c22',
        },
        neutral: {
          100: '#F5F5F5',
          200: '#E5E5E5',
          400: '#A3A3A3',
          500: '#737373',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Instrument Serif"', 'serif'],
        'instrument-serif': ['"Instrument Serif"', 'serif'],
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
      boxShadow: {
        'card-hover': '0 4px 12px rgba(0,0,0,.3)',
        'modal': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 20px rgba(16, 185, 129, 0.3)',
        'glow-amber': '0 0 20px rgba(252, 163, 17, 0.3)',
      },
    },
  },
};
```

---

## 5 Component Classes

### Card Styles
```css
.card-base          /* Base card with black bg and subtle border */
.card-interactive   /* Interactive card with hover effects */
.card-glass         /* Glass morphism effect */
.card-elevated      /* Elevated card with stronger shadow */
```

### Button Styles
```css
.btn-primary        /* Primary CTA - amber background */
.btn-secondary      /* Secondary - glass effect */
.btn-ghost          /* Ghost button - minimal styling */
.btn-success        /* Success button - emerald background */
/* Brand 3D Spline buttons */
.btn-3d-spline      /* Emerald gradient primary CTA */
.btn-3d-spline-accent /* Amber gradient secondary CTA */
```

### Text Styles
```css
.text-display       /* Display text - Instrument Serif */
.text-body          /* Body text - Inter */
.text-muted         /* Muted text - neutral-500 */
.text-success       /* Success text - emerald-300 */
.text-accent        /* Accent text - amber-400 */
.text-ui            /* UI text - smaller size */
```

### Badge Styles
```css
.badge-success      /* Success badge - emerald theme */
.badge-accent       /* Accent badge - amber theme */
.badge-neutral      /* Neutral badge - gray theme */
.badge-new          /* New badge - emerald background */
```

### Input Styles
```css
.input-base         /* Base input styling */
.input-success      /* Success state input */
.input-error        /* Error state input */
```

### Animation Utilities
```css
.animate-delay-1    /* Animation delay: 0.15s */
.animate-delay-2    /* Animation delay: 0.25s */
.animate-delay-3    /* Animation delay: 0.35s */
/* ... up to animate-delay-8 */
```

### Hover Effects
```css
.hover-lift         /* Scale and shadow on hover */
.hover-glow         /* Emerald glow on hover */
.hover-glow-amber   /* Amber glow on hover */
```

### Glass Effects
```css
.glass-light        /* Light glass effect */
.glass-dark         /* Dark glass effect */
```

### Gradient Text
```css
.gradient-text      /* Amber to emerald gradient */
.gradient-text-amber /* Amber gradient */
.gradient-text-emerald /* Emerald gradient */
```

---

## 6 Usage Examples

### Hero Section
```tsx
<section className="bg-gradient-hero py-20 lg:py-32">
  <h1 className="text-display-large text-display text-balance">
    Level Up Your Sound
  </h1>
  <p className="text-body max-w-2xl mx-auto">
    Industry-level beats, mixing, and mastering services.
  </p>
  <div className="flex gap-4">
    <button className="btn-primary">Shop Beats</button>
    <button className="btn-secondary">Book Services</button>
  </div>
</section>
```

### Card Component
```tsx
<div className="card-interactive animate-fade-up-stagger animate-delay-1">
  <h3 className="text-card-title text-display">Beat Title</h3>
  <p className="text-body">Description text here.</p>
  <span className="badge-accent">Hip Hop</span>
</div>
```

### Interactive Button
```tsx
<button className="btn-primary hover-glow-amber">
  <span className="text-ui">Purchase Beat</span>
</button>
```

---

## 7 Animation System

### Staggered Animations
Use `animate-fade-up-stagger` with delay classes for staggered reveals:
```tsx
<div className="grid gap-8">
  <div className="animate-fade-up-stagger animate-delay-1">Item 1</div>
  <div className="animate-fade-up-stagger animate-delay-2">Item 2</div>
  <div className="animate-fade-up-stagger animate-delay-3">Item 3</div>
</div>
```

### Hero Section Animations
The hero section uses a combination of background elements and staggered animations:
```tsx
<section className="relative bg-gradient-hero py-20 lg:py-32">
  {/* Background Pattern */}
  <div className="absolute inset-0 opacity-10">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1)_0%,transparent_50%)]" />
  </div>
  
  {/* Background Image */}
  <div 
    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
    style={{ 
      backgroundImage: `url('/assets/A_digital_photograph_showcases_a_music_production_.png')` 
    }}
  />
  
  {/* Content with staggered animations */}
  <div className="animate-fade-up-stagger animate-delay-1">
    <h1 className="text-display-large text-display text-balance">
      Level Up Your Sound
    </h1>
  </div>
</section>
```

### Animation Classes
- **animate-fade-up-stagger**: Base fade-up animation (0.8s ease-out)
- **animate-delay-1 through animate-delay-8**: Staggered delays (0.15s to 0.85s)
- **bg-gradient-hero**: Gradient background (dark gray to dark teal)

### Hover Animations
```tsx
<div className="card-interactive hover-lift">
  {/* Content */}
</div>
```

### Loading States
```tsx
<div className="loading-shimmer h-32 rounded-xl">
  {/* Loading content */}
</div>
```

---

## 8 Best Practices

1. **Consistent Spacing**: Use the defined spacing scale
2. **Typography Hierarchy**: Follow the font size scale
3. **Color Usage**: Use colors semantically (success, accent, etc.)
4. **Animation Timing**: Use staggered delays for smooth reveals
5. **Accessibility**: Ensure proper contrast ratios
6. **Mobile First**: Design for mobile, enhance for desktop
7. **Performance**: Use CSS transforms for animations
8. **Consistency**: Use component classes for repeated patterns