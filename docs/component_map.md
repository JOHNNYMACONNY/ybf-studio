
# Component Map

> **UI/UX Note:** For all component visuals, tokens, and future/planned UI features, refer to the [Style Guide](./style_guide.md) as the source of truth. All design and style changes must align with it.

**Related Docs:** [README](./README.md) | [Checklists](./checklists.md) | [Wireframes](./wireframes.md) | [Roadmap](./roadmap.md) | [Best Practices](./best_practices.md)

---

## Purpose
List all React components for the MVP, with descriptions and cross-references to wireframes and content blueprints.

---

## Current Status: 95% Complete

The component library is **95% complete** with all core components implemented and placeholder components replaced with fully functional versions. The remaining 5% consists of final optimizations and minor integrations.

---

## Table of Contents
- [Layout & Navigation Components](#layout--navigation-components)
- [Beat Store Components](#beat-store-components)
- [Services Components](#services-components)
- [Portfolio Components](#portfolio-components)
- [Blog Components](#blog-components)
- [Contact & Booking Components](#contact--booking-components)
- [Utility Components](#utility-components)
- [Missing Integrations](#missing-integrations)
- [Future/Optional Components](#futureoptional-components)

---

## Layout & Navigation Components ✅ **COMPLETED**
- **Layout.tsx** ✅  
  Wraps all pages, includes `<Header />` and `<Footer />`, and defines main content structure.
- **Header.tsx** 🔄 **85% Complete**  
  Contains logo, navigation links (Home, Beat Store, Services, Portfolio, Blog, Contact), cart icon, and login button.
  - **❌ Missing**: Mobile menu dropdown implementation (button exists but no dropdown)
  - **❌ Missing**: Cart context integration (shows hardcoded "0")
- **Footer.tsx** ✅  
  Displays quick links, social icons, newsletter signup, and legal links.
- **MobileMenu.tsx** ❌ **Not Implemented**  
  Responsive dropdown/hamburger menu for mobile navigation (Headless UI Disclosure).

---

## Beat Store Components ✅ **COMPLETED**
- **BeatCard.tsx** ✅  
  Displays beat title, price, cover image, and play button. Includes "Add to Cart" button. The play button calls `useUnifiedAudio().playBeat(beat)` which autoloads SoundCloud previews into the global player and autoplays.
  
### Admin Variants
- **components/admin/BeatAdminCard.tsx** ✅  
  Compact admin-only card used on `/admin/beats`. Optimized for dense grids with consistent sizing, clamped titles, and inline price chips.
- **components/audio/GlobalAudioPlayer.tsx** ✅  
  Global audio preview player. Sticky at the bottom. Renders the compact SoundCloud widget (height 20, `visual=false`) when a beat has a SoundCloud `previewUrl`. Footer controls (play/pause/seek) are wired to the SoundCloud widget via `UnifiedAudioContext`.
- **Cart.tsx** ✅  
  Slide-out panel or modal displaying selected beats, prices, and checkout CTA.
- **CheckoutForm.tsx** ✅  
  Stripe integration for beat purchases, including licensing options (MP3/WAV/Exclusive).
- **LicenseInfoModal.tsx** ✅ **RECENTLY IMPLEMENTED**
  Modal popup explaining beat licensing tiers with comprehensive pricing, file format details, delivery information, and legal terms.

---

## Services Components ✅ **COMPLETED**
- **ServiceCard.tsx** ✅  
  Card for mixing/mastering packages (Basic, Advanced, Pro).
- **BeforeAfterPlayer.tsx** ✅  
  Audio comparison widget for mixing/mastering demos.
- **UploadForm.tsx** ✅ **RECENTLY IMPLEMENTED**
  Advanced file upload component with drag-and-drop interface, multi-format support (audio, video, images, documents), validation, progress tracking, and professional UI design.

---

## Portfolio Components ✅ **COMPLETED**
- **PortfolioCard.tsx** ✅  
  Showcases past projects with audio or video previews, artist name, and links.
- **FilterBar.tsx** ✅  
  Allows filtering portfolio items by genre or year.

---

## Blog Components ✅ **COMPLETED**
- **BlogCard.tsx** ✅  
  Displays blog post image, title, and excerpt.
- **CategoryFilter.tsx** ✅  
  Filter blog posts by category or tag.
- **Pagination.tsx** ✅  
  Handles navigation between blog pages.

---

## Contact & Booking Components ✅ **COMPLETED**
- **ContactForm.tsx** ✅  
  Fields for name, email, inquiry type, and message. Sends data via API route.
- **BookingCalendar.tsx** ✅  
  Embedded Calendly (or similar) for booking consultations.
 - **ConsultationBookingForm.tsx** ✅  
  Modal-based booking form using shared UI (`Modal`, `Input`, `Select`, `Textarea`, `Button`). Aligned with premium dark theme and 3D-spline styles; supports package selection, preferred time, and project details with toast feedback.

---

## Utility Components ✅ **COMPLETED**
- **Button.tsx** ✅  
  Reusable button with variants (primary, secondary, ghost, success).
- **Modal.tsx** ✅  
  Generic modal component for license info, cart, etc.
- **Loader.tsx** ✅  
  Loading spinner for async operations (file uploads, payments).
- **Toast.tsx** ✅  
  Small pop-up notifications for success/failure (e.g., "Added to Cart").

---

## Missing Integrations ❌ **NOT IMPLEMENTED**

### **Cart Integration**
- **CartProvider** ✅ - Properly implemented in `_app.tsx`
- **Cart Context** ✅ - Fully functional with useCart hook
- **Cart Integration** ❌ - Cart context not connected to header cart icon (shows hardcoded "0")
- **Cart Persistence** ❌ - Cart state not persisted across sessions

### **User Authentication**
- **NextAuth.js** ✅ - Fully configured with Google OAuth in `pages/api/auth/[...nextauth].ts`
- **Login/Signup Pages** ❌ - No user authentication forms
- **Protected Routes** ❌ - No route protection for authenticated users
- **User Context** ❌ - No user state management

### **Database Integration**
- **Supabase Connection** ✅ - Connected in `lib/supabase.ts` and used in `pages/stripe.ts`
- **User Data Storage** ❌ - No user profiles or preferences storage
- **Order Persistence** ✅ - Basic order storage implemented
- **Beat Data Management** ❌ - No CRUD operations for beats

### **Email Functionality**
- **SendGrid Integration** ❌ - Installed but only placeholder comment in `pages/stripe.ts`
- **Order Confirmations** ❌ - No automated email for successful orders
- **Contact Form Emails** ❌ - No email notifications for contact form submissions
- **Email Templates** ❌ - No professional email templates

---

## Future/Optional Components
- **UserDashboard.tsx** (Phase 2) ❌  
  Client dashboard for beat downloads and project tracking.
- **RecommendationCarousel.tsx** (Phase 2) ❌  
  Personalized beat recommendations.

---

## Critical Fixes Needed

### **Cart Integration Fix (2 hours)**
```tsx
// In layout/Header.tsx - Connect useCart hook
import { useCart } from '../components/ui/CartContext';

const Header: React.FC = () => {
  const { cartCount, toggleCart } = useCart();
  
  // Update cart button to use actual cart count
  <button onClick={toggleCart} className="...">
    <ShoppingCart className="h-5 w-5 text-neutral-400" />
    {cartCount > 0 && (
      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
        {cartCount}
      </span>
    )}
  </button>
```

### **Mobile Navigation Implementation (4 hours)**
```tsx
// In layout/Header.tsx - Add mobile menu dropdown
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

// Add mobile menu dropdown component with proper animations
```

---

## Animation System (Updated 2024) ✅ **COMPLETED**
- **animate-fade-up-stagger** ✅  
  Base animation class for fade-up effects with staggered delays (0.15s to 0.85s).
- **animate-delay-1 through animate-delay-8** ✅  
  Delay utility classes for staggered animations.
- **bg-gradient-hero** ✅  
  Gradient background class for hero sections (dark gray to dark teal).
- **Background Elements** ✅  
  Hero section includes subtle background pattern and music production studio image overlay.
- **Scroll Cue** ✅  
  Animated scroll indicator at the bottom of the hero section.

---

## Component Dependencies

### **Required Context Providers**
- **AudioProvider** ✅ - Manages global audio state
- **CartProvider** ✅ - Properly implemented in `_app.tsx`
- **AudioPlayerContext** ❌ - Duplicate (replaced by `UnifiedAudioContext`)

### **External Dependencies**
- **Stripe** ✅ - Payment processing
- **Headless UI** ✅ - Modal and dropdown components
- **Lucide React** ✅ - Icon library
- **NextAuth.js** ❌ - Authentication (not implemented)
- **Supabase** ❌ - Database (not connected)
- **SendGrid** ❌ - Email service (not configured)

---

## Next Steps

1. **Fix Cart Integration** - Connect useCart hook to Header component
2. **Add Mobile Navigation** - Implement mobile menu dropdown
3. **Consolidate Audio System** - Merge multiple audio contexts
4. **Add User Authentication** - Implement NextAuth.js UI components
5. **Connect Database** - Set up Supabase integration
6. **Add Email Functionality** - Configure SendGrid

---

## Component Status Summary

- **Layout & Navigation**: 85% Complete 🔄 (missing mobile dropdown and cart integration)
- **Beat Store**: 100% Complete ✅
- **Services**: 100% Complete ✅
- **Portfolio**: 100% Complete ✅
- **Blog**: 100% Complete ✅
- **Contact & Booking**: 100% Complete ✅
- **Utility Components**: 100% Complete ✅
- **Missing Integrations**: 0% Complete ❌

**Overall Progress**: 85% Complete - Ready for launch after critical fixes
