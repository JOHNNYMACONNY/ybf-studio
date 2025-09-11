# YBF Studio Testing Checklist - Quick Reference

## 🎯 **Quick Testing Checklist**

### **Phase 1: Core Navigation** 🔥 **HIGH PRIORITY**

#### **Core Navigation**
- [ ] Header navigation works
- [ ] Footer navigation works
- [ ] Layout component works
- [ ] LegalPageLayout component works

#### **Header Navigation**
- [ ] Logo click → Home page
- [ ] All nav links work (Home, Beats, Services, Portfolio, Blog, Contact)
- [ ] Mobile menu opens/closes
- [ ] Cart icon displays and updates count

#### **Footer Navigation**
- [ ] All footer links work
- [ ] Legal links work (Terms, Privacy)
- [ ] Social media links work
- [ ] Copyright year is 2025

### **Phase 2: Beat Store** 🔥 **HIGH PRIORITY**

#### **BeatCard Component**
- [ ] Play button starts audio preview
- [ ] Preview duration badge shows (0:30, 0:45, 0:60)
- [ ] Beat info displays (title, artist, genre, BPM, duration)
- [ ] License prices display (MP3, WAV, Exclusive)
- [ ] Cover art displays (custom or randomized fallback)
- [ ] Cover art images load without errors
- [ ] Different beats show different random cover art
- [ ] "Buy License" opens modal
- [ ] "Add to Cart" adds item

#### **LicenseSelectModal**
- [ ] Modal opens when "Buy License" clicked
- [ ] License selection works (MP3, WAV, Exclusive)
- [ ] Price updates when license changes
- [ ] Feature lists display correctly
- [ ] "Purchase" button works
- [ ] Modal closes with X, backdrop, or ESC

#### **Search & Filter**
- [ ] Search by beat name works
- [ ] Search by artist name works
- [ ] Genre filter works
- [ ] BPM filter works
- [ ] Filter combinations work

### **Phase 3: Audio System** 🔥 **HIGH PRIORITY**

#### **Global Audio Player**
- [ ] Player appears when audio plays
- [ ] Play/pause controls work
- [ ] Track info displays (title, artist, cover)
- [ ] Cover art displays correctly in player
- [ ] Volume control works
- [ ] Player persists across navigation
- [ ] Seek bar updates and allows seeking
- [ ] Duration/time display is accurate

#### **Audio Context**
- [ ] Clicking play updates audio context
- [ ] Switching beats works
- [ ] Audio stops when navigating away
- [ ] Error handling works for invalid URLs
- [ ] Volume/mute reflect in UI and actual playback
- [ ] SoundCloud previews controlled via global player

#### **Advanced Audio Components**
- [ ] BeatPreviewPlayer works correctly
- [ ] BeforeAfterPlayer comparison works
- [ ] Audio components responsive design
- [ ] Audio components accessibility

### **Phase 4: Cart System** 🔥 **HIGH PRIORITY**

#### **Cart Functionality**
- [ ] Add to cart increases count
- [ ] Cart displays items correctly
- [ ] Remove items works
- [ ] Cart persists on refresh
- [ ] Cart icon shows correct count

#### **CartDrawer Component**
- [ ] Cart drawer opens/closes with animation
- [ ] Drawer displays items correctly
- [ ] Remove items from drawer works
- [ ] Checkout flow from drawer works
- [ ] Drawer responsive design works
- [ ] Drawer accessibility works

### **Phase 5: Page Navigation** 🔥 **HIGH PRIORITY**

#### **Main Pages**
- [ ] Home page loads and works
- [ ] Beats page loads and works
- [ ] Services page loads and works
- [ ] Portfolio page loads and works
- [ ] Blog page loads and works
- [ ] Contact page loads and works

#### **Special Pages**
- [ ] QA Dashboard (/qa) works
- [ ] Admin Dashboard (/admin) works
- [ ] Admin Beats e2e (CRUD)
- [ ] SalesChart component renders correctly
- [ ] StatCard component renders correctly
- [ ] Order Management (/orders) works
- [ ] Payment Success (/success) works
- [ ] Payment Cancel (/cancel) works
- [ ] Terms of Service (/terms) works
- [ ] Privacy Policy (/privacy) works
- [ ] Dynamic Blog Posts (/[slug]) work
- [ ] Test API (/api/test) works
- [ ] 404 page handles errors
- [ ] Admin authentication works
- [ ] Admin-only access control works

### **Phase 6: UI Components** 🔥 **HIGH PRIORITY**

#### **HeroSection Component**
- [ ] Hero section displays correctly
- [ ] Hero animations work
- [ ] Hero stats display correctly
- [ ] Hero call-to-action buttons work
- [ ] Hero responsive design works

#### **Content Components**
- [ ] HeroSection component works
- [ ] TestimonialsCarousel component works
- [ ] BlogTeasers component works
- [ ] BlogCard component works
- [ ] PortfolioHighlights component works
- [ ] ServiceHighlights component works
- [ ] PortfolioCard component works
- [ ] ServiceCard component works
- [ ] All content components responsive

#### **Shared Components**
- [ ] Section component works
- [ ] FaqAccordion component works
- [ ] Loader component works
- [ ] Modal component works
- [ ] Toast component works
- [ ] AnimatedSection component works
- [ ] Badge component works
- [ ] Select component works
- [ ] Card component works

#### **Form Components**
- [ ] ContactForm validation works
- [ ] ContactForm submission works
- [ ] ContactForm loading states work
- [ ] ContactForm success/error states work
- [ ] ContactForm responsive design works

#### **Email Components**
- [ ] ServiceStatusUpdateEmail renders correctly
- [ ] Email templates display properly

#### **Forms & Inputs**
- [ ] Text inputs work and validate
- [ ] Select dropdowns work
- [ ] Number inputs work (BPM filter)
- [ ] Search input works with debouncing
- [ ] Textarea inputs work correctly

#### **Button Components**
- [ ] Primary buttons work and style correctly
- [ ] Secondary buttons work and style correctly
- [ ] Icon buttons work
- [ ] Disabled states work

### **Phase 7: Responsive Design** 🔥 **HIGH PRIORITY**

#### **Mobile**
- [ ] Mobile menu works
- [ ] Touch interactions work
- [ ] Layout adapts to mobile
- [ ] Audio works on mobile

#### **Tablet**
- [ ] Layout works on tablet
- [ ] Touch interactions work
- [ ] Orientation changes work

### **Phase 8: Performance** 🔥 **HIGH PRIORITY**

#### **Loading Performance**
- [ ] Page load times < 3 seconds
- [ ] Images load correctly
- [ ] Audio loads < 2 seconds
- [ ] API responses < 1 second

#### **Interaction Performance**
- [ ] Button clicks respond quickly
- [ ] Search responds quickly
- [ ] Audio starts/stops quickly
- [ ] Modals open/close quickly

### **Phase 9: Error Handling** 🔥 **HIGH PRIORITY**

#### **User Errors**
- [ ] Search with no results shows message
- [ ] Network errors show message
- [ ] Audio errors show message
- [ ] Form validation shows errors

#### **System Errors**
- [ ] API failures handled gracefully
- [ ] 404 pages work
- [ ] 500 errors handled
- [ ] Loading states work

### **Phase 10: Cross-Browser** 🔥 **HIGH PRIORITY**

#### **Browser Compatibility**
- [ ] Chrome - all functionality works
- [ ] Firefox - all functionality works
- [ ] Safari - all functionality works
- [ ] Edge - all functionality works

### **Phase 11: Accessibility** 🔥 **HIGH PRIORITY**

#### **Keyboard Navigation**
- [ ] Tab navigation works
- [ ] Enter key works on buttons
- [ ] Space key works on buttons
- [ ] Escape key closes modals

#### **Screen Reader**
- [ ] All images have alt text
- [ ] ARIA labels work
- [ ] Focus indicators visible
- [ ] Semantic HTML structure

### **Phase 12: Integration** 🔥 **HIGH PRIORITY**

#### **API Integration**
- [ ] `/api/beats` works
- [ ] `/api/purchase` works
- [ ] `/api/send-email` works
- [ ] `/api/contact` works (if implemented)
- [ ] `/api/service-requests/[id]` works
- [ ] `/api/auth/[...nextauth]` works
- [ ] `/api/checkout_sessions` works
- [ ] `/api/stripe` webhook works
- [ ] `/charts` admin endpoint works
- [ ] `/stats` admin endpoint works
- [ ] `/api/test` works

#### **External Services**
- [ ] Stripe integration works (test mode)
- [ ] SendGrid integration works (test mode)
- [ ] SoundCloud audio works
- [ ] Google Drive downloads work
- [ ] Google OAuth works
- [ ] Supabase database works

## 🚀 **Quick Test Commands**

### **Start Testing Environment**
```bash
npm run dev
```

### **Test API Endpoints**
```bash
# Test beats API
curl http://localhost:3000/api/beats

# Test test API
curl http://localhost:3000/api/test

# Test email API
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"type":"test","customerEmail":"jmaconny@ybfstudio.com"}'
```

### **Test Pages**
```bash
# Test main pages
curl http://localhost:3000/
curl http://localhost:3000/beats
curl http://localhost:3000/services
curl http://localhost:3000/portfolio
curl http://localhost:3000/blog
curl http://localhost:3000/contact

# Test special pages
curl http://localhost:3000/qa
curl http://localhost:3000/admin
curl http://localhost:3000/orders
curl http://localhost:3000/success
curl http://localhost:3000/cancel
curl http://localhost:3000/terms
curl http://localhost:3000/privacy
```

### **Test Components**
```bash
# Test CartDrawer functionality
# Open browser and click cart icon

# Test HeroSection functionality
# Navigate to home page and verify hero section

# Test advanced audio components
# Navigate to beats page and test BeatPreviewPlayer
# Navigate to services page and test BeforeAfterPlayer

# Test FaqAccordion functionality
# Navigate to contact or services page and test accordion

# Test ContactForm functionality
# Navigate to contact page and test form submission

# Test Section component
# Navigate to any page and verify section wrappers work
```

### **Test API Endpoints**
```bash
# Test authentication
curl http://localhost:3000/api/auth/signin

# Test service requests (requires admin auth)
curl -X PUT http://localhost:3000/api/service-requests/123 \
  -H "Content-Type: application/json" \
  -d '{"status":"completed"}'

# Test contact form (if implemented)
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"jmaconny@ybfstudio.com","message":"Test message"}'

# Test checkout sessions
curl -X POST http://localhost:3000/api/checkout_sessions \
  -H "Content-Type: application/json" \
  -d '{"items":[{"beat":{"id":"1","title":"Test Beat","price":29.99,"coverArt":"/test.jpg","genre":"Hip Hop","bpm":140},"license":"MP3"}]}'

# Test Stripe webhook (requires webhook forwarding)
# Use Stripe CLI: stripe listen --forward-to localhost:3000/api/stripe
```

# Test admin endpoints (requires admin auth)
curl http://localhost:3000/charts
curl http://localhost:3000/stats

## 📊 **Test Results Summary**

### **Test Execution**
- **Date**: _______________
- **Tester**: _______________
- **Environment**: _______________

### **Results**
- **Total Tests**: _______________
- **Passed**: _______________
- **Failed**: _______________
- **Skipped**: _______________
- **Success Rate**: _______________%

### **Issues Found**
1. _______________
2. _______________
3. _______________

### **Recommendations**
1. _______________
2. _______________
3. _______________

## ✅ **Success Criteria Checklist**

### **Functional Requirements**
- [ ] All navigation links work
- [ ] All buttons respond to clicks
- [ ] Audio system functions
- [ ] Cart system works (including CartDrawer)
- [ ] Forms validate correctly
- [ ] Search and filter work
- [ ] Modals open/close properly
- [ ] Admin dashboard functions
- [ ] Content components display properly
- [ ] Shared components work (Section, FaqAccordion)
- [ ] Contact form works correctly
- [ ] Authentication system works
- [ ] Email templates render properly
- [ ] Stripe checkout works
- [ ] Webhook processing works

### **Performance Requirements**
- [ ] Page loads < 3 seconds
- [ ] API responses < 1 second
- [ ] Audio loads < 2 seconds
- [ ] Smooth animations
- [ ] No memory leaks

### **Accessibility Requirements**
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Focus management works
- [ ] Color contrast meets WCAG
- [ ] Alt text for images

### **Cross-Browser Requirements**
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge
- [ ] No console errors

### **Mobile Requirements**
- [ ] Touch-friendly interface
- [ ] Responsive design
- [ ] Mobile optimizations
- [ ] Touch gesture support

---

**Last Updated**: January 2025
**Version**: 1.9.0
**Status**: Complete and Ready for Execution 