# Design System Summary

## Overview
Our design system is inspired by the sophisticated, modern aesthetic of PulseSync, featuring a dark theme with sophisticated typography, smooth animations, and a professional color palette.

## Color Palette

### Primary Colors
- **Amber**: `#FCA311` - Primary brand color for CTAs and highlights
- **Emerald**: `#10B981` - Success states and positive actions
- **Neutral**: `#171717` to `#F5F5F5` - Text and backgrounds

### Extended Palette
- **Amber variants**: 400, 500, 600, 700, 950
- **Emerald variants**: 100, 300, 500, 600, 700, 900, 950
- **Neutral variants**: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950

## Typography

### Font Families
- **Primary**: Inter (sans-serif) - Body text and UI elements
- **Display**: Instrument Serif (serif) - Headlines and hero text
- **Mono**: Geist Mono (monospace) - Code and technical content
- **Additional**: Bricolage Grotesque, Plus Jakarta Sans, Manrope, Space Grotesk

### Type Scale
- **Hero**: 3.75rem (60px) - Main headlines
- **Headline**: 2.25rem (36px) - Section headers
- **Title**: 1.5rem (24px) - Card titles
- **Subtitle**: 1.125rem (18px) - Subheadings
- **Body**: 1rem (16px) - Body text
- **Caption**: 0.875rem (14px) - Small text
- **Small**: 0.75rem (12px) - Micro text

## Components

### Button
- **Variants**: primary, secondary, ghost, success, warning
- **Sizes**: sm, md, lg, xl
- **Features**: Icon support, hover effects, focus states
- **Style**: Rounded-full with smooth transitions

### Card
- **Variants**: default, elevated, glass, gradient
- **Padding**: sm, md, lg, xl
- **Features**: Background images, hover effects, ring styling
- **Style**: Rounded-xl with subtle shadows

### Badge
- **Variants**: primary, secondary, success, warning, neutral, outline
- **Sizes**: sm, md, lg
- **Features**: Ring styling, hover effects
- **Style**: Rounded-full with colored backgrounds

### AnimatedSection
- **Animations**: fadeUp, fadeDown, fadeLeft, fadeRight
- **Features**: Intersection Observer, staggered delays
- **Delays**: 150ms, 250ms, 350ms, 450ms, 550ms, 650ms, 750ms, 850ms

### StatCard
- **Features**: Trend indicators, icons, variants
- **Style**: Card-based with large typography
- **Use**: Statistics and metrics display

## Layout

### Grid System
- **Responsive**: 1-4 columns based on screen size
- **Gap**: 8 (2rem) default spacing
- **Breakpoints**: sm, md, lg, xl, 2xl

### Spacing
- **Container**: Responsive padding with max-widths
- **Sections**: py-16 to py-32 for vertical spacing
- **Components**: Consistent 4-8 spacing scale

## Animations

### Keyframes
- **fadeUp**: Slide up with opacity
- **fadeDown**: Slide down with opacity
- **fadeLeft**: Slide left with opacity
- **fadeRight**: Slide right with opacity
- **pulse**: Subtle pulsing effect
- **shimmer**: Loading shimmer effect

### Transitions
- **Duration**: 200ms for interactions, 500ms for hover effects
- **Easing**: ease-out for animations, ease-in-out for transitions
- **Scale**: 1.05x on hover for cards and buttons

## Effects

### Shadows
- **sm**: Subtle shadow for cards
- **elevated**: Enhanced shadow for elevated elements
- **glow**: Colored glow effects for interactive elements

### Backdrop Blur
- **xs**: 2px blur
- **sm**: 4px blur
- **md**: 8px blur
- **lg**: 12px blur
- **xl**: 16px blur
- **2xl**: 24px blur
- **3xl**: 40px blur

### Gradients
- **gradient-hero**: Dark to emerald gradient
- **gradient-card**: Black to dark gradient
- **gradient-overlay**: White overlay for images

## Utilities

### Text Utilities
- **text-balance**: Balanced text wrapping
- **text-pretty**: Pretty text wrapping
- **font-instrument-serif**: Display font class
- **font-bricolage**: Alternative sans-serif

### Layout Utilities
- **grid-responsive**: Responsive grid system
- **space-y-responsive**: Responsive vertical spacing
- **gap-responsive**: Responsive gap spacing

### Animation Utilities
- **animate-fadeUp-delay-***: Staggered animation delays
- **hover-scale**: Scale effect on hover
- **hover-glow**: Glow effect on hover

## Best Practices

### Typography
- Use Instrument Serif for headlines and hero text
- Use Inter for body text and UI elements
- Maintain proper contrast ratios
- Use text-balance for better readability

### Animations
- Use staggered delays for list items
- Keep animations subtle and purposeful
- Use intersection observer for performance
- Avoid excessive motion

### Color Usage
- Use amber for primary actions
- Use emerald for success states
- Use neutral colors for text hierarchy
- Maintain accessibility standards

### Component Usage
- Use Card variants appropriately
- Apply consistent spacing
- Use Badge for status indicators
- Leverage StatCard for metrics

## Accessibility

### Focus States
- Visible focus rings on all interactive elements
- Proper color contrast ratios
- Keyboard navigation support

### Motion
- Respect user's motion preferences
- Provide reduced motion alternatives
- Use meaningful animations

### Screen Readers
- Proper ARIA labels
- Semantic HTML structure
- Descriptive alt text for images 