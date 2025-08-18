# Debugging Guide & Error Resolution

> **UI/UX Note:** When debugging UI issues, always reference the [Style Guide](./style_guide.md) to ensure consistency with design patterns.

**Related Docs:** [README](./README.md) | [Current Issues](./current_issues.md) | [Roadmap](./roadmap.md) | [Best Practices](./best_practices.md)

---

## Purpose
Comprehensive guide for debugging common issues and resolving errors in the AudioServiceApp development process.

---

## Table of Contents
- [Common Error Messages](#common-error-messages)
- [Debugging Workflows](#debugging-workflows)
- [Environment Issues](#environment-issues)
- [Component Issues](#component-issues)
- [API Issues](#api-issues)
- [Performance Issues](#performance-issues)
- [Deployment Issues](#deployment-issues)

---

## Common Error Messages

### **TypeScript Errors**

#### **"Cannot find module"**
```bash
# Error: Cannot find module '../components/ui/CartContext'
# Solution: Check import path and file existence
```
**Resolution:**
1. Verify file exists at the specified path
2. Check for typos in import statement
3. Ensure file has proper export
4. Restart TypeScript server: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

#### **"Property does not exist on type"**
```bash
# Error: Property 'cartCount' does not exist on type 'CartContextType'
# Solution: Check interface definition
```
**Resolution:**
1. Check the interface definition in the context file
2. Ensure the property is properly exported
3. Verify the context provider includes the property
4. Check for TypeScript compilation errors

#### **"Module has no exported member"**
```bash
# Error: Module has no exported member 'useCart'
# Solution: Check export statement
```
**Resolution:**
1. Verify the function/component is properly exported
2. Check for default vs named exports
3. Ensure the export statement is correct
4. Restart development server

### **Tailwind v4 Animation Issues**

#### **"Animation classes not working"**
```bash
# Issue: Animation classes (animate-fade-up-stagger, animate-delay-1, etc.) not being applied
# Symptoms: Elements remain at opacity: 0, no animations visible
# Root Cause: Tailwind v4 syntax incompatibilities
```

**Resolution Steps:**
1. **Check CSS Import Order** - In Tailwind v4, import order matters:
   ```css
   /* CORRECT ORDER FOR TAILWIND V4 */
   @import "./components.css";  /* Must come first */
   @import "tailwindcss";       /* Must come second */
   ```

2. **Move Animation Classes to Config** - Custom utilities must be in `tailwind.config.js`:
   ```javascript
   plugins: [
     function({ addUtilities }) {
       const newUtilities = {
         '.animate-fade-up-stagger': { 
           opacity: '0',
           animation: 'fadeUp 0.8s ease-out forwards' 
         },
         '.animate-fade-up-stagger.animate-delay-1': {
           opacity: '0',
           animation: 'fadeUp 0.8s ease-out 0.15s forwards'
         }
       }
       addUtilities(newUtilities)
     }
   ]
   ```

3. **Add Keyframe Definition** - Ensure `@keyframes fadeUp` is in `components.css`:
   ```css
   @keyframes fadeUp {
     0% {
       opacity: 0;
       transform: translateY(30px);
     }
     100% {
       opacity: 1;
       transform: translateY(0);
     }
   }
   ```

4. **Fix Animation Duration Conflicts** - Remove individual delay classes that override duration:
   ```javascript
   // ❌ REMOVE THESE - they cause conflicts
   '.animate-delay-1': { animationDelay: '0.15s' },
   '.animate-delay-2': { animationDelay: '0.25s' },
   
   // ✅ KEEP THESE - they have full animation definition
   '.animate-fade-up-stagger.animate-delay-1': {
     opacity: '0',
     animation: 'fadeUp 0.8s ease-out 0.15s forwards'
   }
   ```

5. **Clear Cache and Rebuild**:
   ```bash
   pkill -f "next dev"
   rm -rf .next
   npm run dev
   ```

**Verification:**
- Check for `animation-duration:800ms` in HTML output
- Ensure no `opacity: 0` inline styles are blocking animations
- Verify animation classes are present in HTML
- Test that elements fade in with proper timing

### **React Errors**

#### **"Hooks can only be called inside React function components"**
```bash
# Error: Invalid hook call. Hooks can only be called inside React function components
# Solution: Check component structure
```
**Resolution:**
1. Ensure hook is called inside a React component
2. Check for proper component function declaration
3. Verify component is not inside a regular function
4. Check for conditional hook calls

#### **"Maximum update depth exceeded"**
```bash
# Error: Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentDidUpdate or useEffect
# Solution: Check for infinite loops
```
**Resolution:**
1. Check useEffect dependencies
2. Look for setState calls in render
3. Verify event handlers are not causing loops
4. Add proper dependency arrays to useEffect

#### **"Cannot read property of undefined"**
```bash
# Error: Cannot read property 'cartCount' of undefined
# Solution: Check context usage
```
**Resolution:**
1. Ensure component is wrapped in context provider
2. Check context import path
3. Verify context is properly initialized
4. Add null checks for context values

### **Next.js Errors**

#### **"Module not found"**
```bash
# Error: Module not found: Can't resolve '../components/ui/CartContext'
# Solution: Check file structure
```
**Resolution:**
1. Verify file exists in the correct location
2. Check for case sensitivity in file names
3. Ensure proper file extensions
4. Clear Next.js cache: `rm -rf .next`

#### **"getStaticProps/getServerSideProps error"**
```bash
# Error: getStaticProps should return an object with a props key
# Solution: Check return structure
```
**Resolution:**
1. Ensure function returns `{ props: { ... } }`
2. Check for proper error handling
3. Verify data fetching logic
4. Add proper TypeScript types

---

## Debugging Workflows

### **Systematic Debugging Process**

#### **Step 1: Identify the Error**
1. **Check browser console** for JavaScript errors
2. **Check terminal** for build/compilation errors
3. **Check network tab** for API errors
4. **Check React DevTools** for component issues

#### **Step 2: Isolate the Problem**
1. **Comment out recent changes** to identify the source
2. **Check git diff** to see what changed
3. **Test in isolation** - create minimal reproduction
4. **Check dependencies** - ensure all imports are correct

#### **Step 3: Apply Fix**
1. **Follow the error resolution steps** below
2. **Test the fix** thoroughly
3. **Check for regressions** in other parts of the app
4. **Update documentation** if needed

#### **Step 4: Verify Solution**
1. **Test the specific functionality** that was broken
2. **Run the full test suite** if available
3. **Check different browsers/devices**
4. **Verify in production build**

### **Debugging Tools**

#### **Browser DevTools**
```javascript
// Console debugging
console.log('Debug value:', value);
console.error('Error occurred:', error);
console.table(arrayData);

// Breakpoint debugging
debugger; // Add this line to pause execution
```

#### **React DevTools**
- Install React DevTools browser extension
- Use Components tab to inspect component tree
- Use Profiler tab to identify performance issues
- Check props and state values

#### **Next.js Debugging**
```bash
# Enable Next.js debugging
DEBUG=* npm run dev

# Check build output
npm run build

# Analyze bundle size
npm run analyze
```

---

## Environment Issues

### **Environment Variables Not Working**

#### **Issue: Variables undefined**
```bash
# Error: process.env.NEXTAUTH_SECRET is undefined
```
**Resolution:**
1. Check `.env.local` file exists
2. Verify variable names are correct
3. Restart development server
4. Check for typos in variable names

#### **Issue: Variables not loading**
```bash
# Error: API key not found
```
**Resolution:**
1. Ensure `.env.local` is in project root
2. Check file permissions
3. Verify no spaces around `=` in `.env.local`
4. Restart the development server

### **Port Conflicts**

#### **Issue: Port 3000 already in use**
```bash
# Error: listen EADDRINUSE: address already in use :::3000
```
**Resolution:**
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)

# Or use different port
npm run dev -- -p 3001
```

---

## Component Issues

### **Cart Integration Issues**

#### **Issue: Cart count not updating**
**Debugging Steps:**
1. Check if `useCart` hook is imported
2. Verify `CartProvider` wraps the component
3. Check browser console for errors
4. Verify cart state is being updated

**Common Fixes:**
```tsx
// Ensure proper import
import { useCart } from '../components/ui/CartContext';

// Ensure proper usage
const { cartCount, toggleCart } = useCart();

// Add error boundary
if (!cartCount) return <span>0</span>;
```

#### **Issue: Cart drawer not opening**
**Debugging Steps:**
1. Check if `toggleCart` is connected to button
2. Verify `isCartOpen` state is working
3. Check for CSS conflicts
4. Verify cart drawer component exists

### **Mobile Navigation Issues**

#### **Issue: Mobile menu not working**
**Debugging Steps:**
1. Check if `useState` is imported
2. Verify mobile menu state is initialized
3. Check for CSS conflicts
4. Test on actual mobile device

**Common Fixes:**
```tsx
// Ensure proper state management
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

// Ensure proper event handling
onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
```

### **Audio System Issues**

#### **Issue: Audio not playing**
**Debugging Steps:**
1. Check if audio files exist
2. Verify audio context is initialized
3. Check browser console for CORS errors
4. Test with different audio formats

**Common Fixes:**
```tsx
// Add error handling to audio play
audio.play().catch(error => {
  console.error('Audio play failed:', error);
});

// Check audio element exists
if (!audioRef.current) {
  audioRef.current = new Audio();
}
```

---

## API Issues

### **Stripe Webhook Issues**

#### **Issue: Webhook not receiving events**
**Debugging Steps:**
1. Check webhook forwarding is running
2. Verify webhook secret matches
3. Check Stripe dashboard for webhook status
4. Test with Stripe CLI

**Resolution:**
```bash
# Start webhook forwarding
stripe listen --forward-to localhost:3000/api/stripe

# Check webhook secret
echo $STRIPE_WEBHOOK_SECRET
```

#### **Issue: Payment processing fails**
**Debugging Steps:**
1. Check Stripe keys are correct
2. Verify environment variables
3. Check browser console for errors
4. Test with Stripe test mode

### **Supabase Issues**

#### **Issue: Database connection fails**
**Debugging Steps:**
1. Check Supabase URL and keys
2. Verify database is online
3. Check network connectivity
4. Test with Supabase dashboard

**Resolution:**
```typescript
// Add error handling to Supabase calls
const { data, error } = await supabase.from('table').select('*');
if (error) {
  console.error('Supabase error:', error);
  return;
}
```

---

## Performance Issues

### **Slow Page Loads**

#### **Issue: Large bundle size**
**Debugging Steps:**
1. Run bundle analyzer
2. Check for large dependencies
3. Implement code splitting
4. Optimize images

**Resolution:**
```bash
# Analyze bundle
npm run build
npm run analyze

# Check for large packages
npm ls --depth=0
```

#### **Issue: Slow API calls**
**Debugging Steps:**
1. Check API response times
2. Implement caching
3. Optimize database queries
4. Add loading states

### **Memory Leaks**

#### **Issue: Audio context not cleaned up**
**Resolution:**
```tsx
// Clean up audio context on unmount
useEffect(() => {
  return () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };
}, []);
```

---

## Deployment Issues

### **Vercel Deployment Issues**

#### **Issue: Build fails on Vercel**
**Debugging Steps:**
1. Check build logs in Vercel dashboard
2. Verify environment variables are set
3. Check for TypeScript errors
4. Test build locally

**Resolution:**
```bash
# Test build locally
npm run build

# Check for TypeScript errors
npx tsc --noEmit
```

#### **Issue: Environment variables not working in production**
**Resolution:**
1. Set variables in Vercel dashboard
2. Check variable names match exactly
3. Redeploy after setting variables
4. Test production environment

### **Domain Issues**

#### **Issue: Custom domain not working**
**Resolution:**
1. Check DNS settings
2. Verify domain is added to Vercel
3. Wait for DNS propagation
4. Check SSL certificate

---

## Quick Reference

### **Common Commands**
```bash
# Clear caches
rm -rf .next
rm -rf node_modules/.cache

# Restart development
npm run dev

# Check for issues
npm run lint
npm run build

# Debug specific issues
DEBUG=* npm run dev
```

### **Error Patterns**
- **TypeScript errors**: Check imports and types
- **React errors**: Check component structure and hooks
- **API errors**: Check endpoints and authentication
- **Build errors**: Check dependencies and configuration

### **When to Ask for Help**
1. **After trying all debugging steps** in this guide
2. **When error is not documented** here
3. **When fix causes new issues**
4. **When performance is severely impacted**

---

**Note:** This debugging guide covers the most common issues. For specific problems, refer to the [Current Issues](./current_issues.md) document or create a new issue in the project repository. 