# PulseSync Style Reference Guide

Quick reference for implementing PulseSync-inspired design patterns in your audio service site.

## 🎨 **Typography Classes**

### Display Text (Instrument Serif)
```css
text-display-large    /* 4.5rem - Hero headlines */
text-display-medium   /* 3.5rem - Large sections */
text-display-small    /* 2.75rem - Medium sections */
text-section          /* 2rem - Section headlines */
text-card-title       /* 1.25rem - Card titles */
```

### Body Text (Inter)
```css
text-body             /* 1rem - Body text */
text-ui               /* 0.875rem - UI elements */
text-micro            /* 0.75rem - Small text */
```

### Text Utilities
```css
text-display          /* Instrument Serif + tracking-tight */
text-body             /* Inter + neutral-400 + leading-relaxed */
text-muted            /* neutral-500 + text-sm */
text-success          /* emerald-300 */
text-accent           /* amber-400 */
text-balance          /* text-wrap: balance */
text-pretty           /* text-wrap: pretty */
```

## 🃏 **Card Styles**

```css
.card-base            /* Black bg + subtle border + padding */
.card-interactive     /* Base + hover effects + cursor pointer */
.card-glass           /* Glass morphism effect */
.card-elevated        /* Stronger shadow */
```

## 🔘 **Button Styles**

```css
.btn-primary          /* Amber background + black text */
.btn-secondary        /* Glass effect + white text */
.btn-ghost            /* Minimal styling + hover effects */
.btn-success          /* Emerald background + white text */
```

## 🏷️ **Badge Styles**

```css
.badge-success        /* Emerald theme */
.badge-accent         /* Amber theme */
.badge-neutral        /* Gray theme */
.badge-new            /* Emerald background + black text */
```

## 📝 **Input Styles**

```css
.input-base           /* Black bg + amber focus ring */
.input-success        /* Emerald border + focus ring */
.input-error          /* Red border + focus ring */
```

## ✨ **Animation Classes**

### Staggered Animations
```css
animate-fade-up-stagger    /* Base animation */
animate-delay-1           /* 0.15s delay */
animate-delay-2           /* 0.25s delay */
animate-delay-3           /* 0.35s delay */
animate-delay-4           /* 0.45s delay */
animate-delay-5           /* 0.55s delay */
animate-delay-6           /* 0.65s delay */
animate-delay-7           /* 0.75s delay */
animate-delay-8           /* 0.85s delay */
```

### Other Animations
```css
animate-scale-in          /* Scale in animation */
animate-slide-up          /* Slide up animation */
animate-glow-pulse        /* Emerald glow pulse */
animate-glow-pulse-amber  /* Amber glow pulse */
```

## 🎭 **Hover Effects**

```css
.hover-lift              /* Scale + shadow on hover */
.hover-glow              /* Emerald glow on hover */
.hover-glow-amber        /* Amber glow on hover */
```

## 🔮 **Glass Effects**

```css
.glass-light             /* Light glass effect */
.glass-dark              /* Dark glass effect */
```

## 🌈 **Gradient Text**

```css
.gradient-text           /* Amber to emerald */
.gradient-text-amber     /* Amber gradient */
.gradient-text-emerald   /* Emerald gradient */
```

## 📱 **Modal Styles**

```css
.modal-overlay           /* Full screen overlay */
.modal-content           /* Modal container */
```

## ⏳ **Loading States**

```css
.loading-shimmer         /* Shimmer loading effect */
```

## 🎯 **Common Patterns**

### Hero Section
```tsx
<section className="bg-gradient-hero py-20 lg:py-32">
  <h1 className="text-display-large text-display text-balance">
    Your Headline
  </h1>
  <p className="text-body max-w-2xl mx-auto">
    Your description
  </p>
  <div className="flex gap-4">
    <button className="btn-primary">Primary Action</button>
    <button className="btn-secondary">Secondary Action</button>
  </div>
</section>
```

### Interactive Card
```tsx
<div className="card-interactive animate-fade-up-stagger animate-delay-1">
  <h3 className="text-card-title text-display">Card Title</h3>
  <p className="text-body">Card content</p>
  <span className="badge-accent">Badge</span>
</div>
```

### Staggered Grid
```tsx
<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
  <div className="card-interactive animate-fade-up-stagger animate-delay-1">
    Item 1
  </div>
  <div className="card-interactive animate-fade-up-stagger animate-delay-2">
    Item 2
  </div>
  <div className="card-interactive animate-fade-up-stagger animate-delay-3">
    Item 3
  </div>
</div>
```

### Button with Hover Effect
```tsx
<button className="btn-primary hover-glow-amber">
  <span className="text-ui">Button Text</span>
</button>
```

## 🎨 **Color Palette**

### Primary Colors
- `amber-500` (#FCA311) - Primary CTAs
- `amber-400` (#FBBF24) - Hover states
- `amber-950` (#451A03) - Badge backgrounds

### Success Colors
- `emerald-300` (#6EE7B7) - Success text
- `emerald-500` (#10B981) - Success actions
- `emerald-600` (#059669) - Success backgrounds
- `emerald-900` (#064e3b) - Success badges

### Neutral Colors
- `neutral-100` (#F5F5F5) - Primary text
- `neutral-400` (#A3A3A3) - Secondary text
- `neutral-500` (#737373) - Muted text
- `neutral-800` (#262626) - Borders
- `neutral-900` (#171717) - Background
- `black` (#000000) - Card backgrounds

## 📐 **Spacing Scale**

- `gap-4` - Compact spacing
- `gap-8` - Standard spacing
- `p-4` - Compact padding
- `p-6` - Standard padding
- `py-10` - Section padding (mobile)
- `lg:py-16` - Section padding (desktop)

## 🔧 **Implementation Tips**

1. **Start with component classes** - Use `.card-base`, `.btn-primary`, etc.
2. **Add animations gradually** - Start with `animate-fade-up-stagger`
3. **Use staggered delays** - `animate-delay-1` through `animate-delay-8`
4. **Maintain hierarchy** - Use appropriate text sizes
5. **Be consistent** - Use the same patterns throughout
6. **Test on mobile** - Ensure responsive behavior
7. **Check accessibility** - Verify contrast ratios
8. **Performance first** - Use CSS transforms for animations 