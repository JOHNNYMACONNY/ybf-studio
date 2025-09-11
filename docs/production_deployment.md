# Production Deployment Guide

## 🚀 **Phase 7: Production Deployment**

### **Overview**
This guide covers the complete production deployment process for the YBF Studio snippet system, including environment configuration, deployment pipeline setup, and monitoring configuration.

### **📋 Pre-Deployment Checklist**

#### **Environment Variables Setup**
- [ ] **SendGrid API Key**: Configure for email delivery
- [ ] **Stripe API Keys**: Configure for payment processing
- [ ] **Supabase Configuration**: Database and authentication
- [ ] **Google Drive API**: For download link generation
- [ ] **NextAuth Configuration**: Authentication and session management

#### **Domain & SSL Setup**
- [ ] **Custom Domain**: Configure domain for production
- [ ] **SSL Certificate**: Ensure HTTPS is enabled
- [ ] **DNS Configuration**: Point domain to Vercel

#### **Performance Optimization**
- [ ] **Image Optimization**: Configure Next.js image optimization
- [ ] **Bundle Analysis**: Optimize JavaScript bundle size
- [ ] **Caching Strategy**: Implement proper caching headers
- [ ] **CDN Configuration**: Configure Vercel CDN settings

### **🔧 Environment Configuration**

#### **Required Environment Variables**

```bash
# Authentication
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-secret-key

# Database (Supabase)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Email (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=jmaconny@ybfstudio.com

# Payment Processing (Stripe)
STRIPE_SECRET_KEY=your-stripe-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Google Drive (Download Links)
GOOGLE_DRIVE_API_KEY=your-google-drive-api-key
GOOGLE_DRIVE_CLIENT_ID=your-google-drive-client-id
GOOGLE_DRIVE_CLIENT_SECRET=your-google-drive-client-secret

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

#### **Environment Variable Setup Steps**

1. **Create Production Environment File**
   ```bash
   # Create .env.production.local
   cp .env.local .env.production.local
   ```

2. **Update Production Values**
   - Replace all development URLs with production URLs
   - Update API keys with production keys
   - Configure proper email addresses

3. **Vercel Environment Variables**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add all required environment variables
   - Set environment to "Production"

### **🚀 Deployment Pipeline**

#### **Vercel Deployment Setup**

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login to Vercel
   vercel login

   # Deploy to Vercel
   vercel --prod
   ```

2. **Configure Build Settings**
   ```json
   // vercel.json
   {
     "buildCommand": "npm run build",
     "outputDirectory": ".next",
     "installCommand": "npm install",
     "framework": "nextjs"
   }
   ```

3. **Domain Configuration**
   - Add custom domain in Vercel Dashboard
   - Configure DNS records
   - Enable automatic SSL certificate

#### **Deployment Commands**

```bash
# Build for production
npm run build

# Test production build locally
npm start

# Deploy to Vercel
vercel --prod

# Check deployment status
vercel ls
```

### **🔍 Production Testing**

#### **Pre-Launch Testing Checklist**

- [ ] **Homepage**: Loads correctly and displays all sections
- [ ] **Beats Page**: All beats display with correct data
- [ ] **Audio Preview**: Snippets play correctly
- [ ] **Purchase Flow**: License selection and Stripe integration
- [ ] **Email System**: Download confirmation emails sent
- [ ] **Download Links**: Google Drive links work correctly
- [ ] **Mobile Responsiveness**: Works on all device sizes
- [ ] **Performance**: Page load times under 3 seconds
- [ ] **SEO**: Meta tags and structured data correct

#### **Automated Testing**

```bash
# Run all tests
npm run test

# Run production build test
npm run build && npm start

# Test API endpoints
curl https://yourdomain.com/api/beats
curl https://yourdomain.com/api/test
```

### **📊 Monitoring & Analytics**

#### **Error Monitoring Setup**

1. **Vercel Analytics**
   - Enable in Vercel Dashboard
   - Monitor Core Web Vitals
   - Track performance metrics

2. **Error Tracking (Optional)**
   ```bash
   # Install Sentry
   npm install @sentry/nextjs

   # Configure in next.config.js
   const { withSentryConfig } = require('@sentry/nextjs');
   ```

#### **Performance Monitoring**

1. **Core Web Vitals**
   - Largest Contentful Paint (LCP) < 2.5s
   - First Input Delay (FID) < 100ms
   - Cumulative Layout Shift (CLS) < 0.1

2. **Custom Metrics**
   - Audio loading time
   - Purchase flow completion rate
   - Email delivery success rate

#### **Analytics Setup**

1. **Google Analytics**
   ```javascript
   // pages/_app.tsx
   import { useEffect } from 'react';
   import { useRouter } from 'next/router';

   export default function App({ Component, pageProps }) {
     const router = useRouter();

     useEffect(() => {
       const handleRouteChange = (url) => {
         gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
           page_path: url,
         });
       };

       router.events.on('routeChangeComplete', handleRouteChange);
       return () => {
         router.events.off('routeChangeComplete', handleRouteChange);
       };
     }, [router.events]);

     return <Component {...pageProps} />;
   }
   ```

### **🔒 Security Configuration**

#### **Security Headers**

```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};
```

#### **CORS Configuration**

```javascript
// pages/api/[...].js
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://yourdomain.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Your API logic here
}
```

### **📈 Post-Launch Monitoring**

#### **Daily Monitoring Tasks**

- [ ] **Check Error Logs**: Review Vercel function logs
- [ ] **Monitor Performance**: Check Core Web Vitals
- [ ] **Verify Email Delivery**: Check SendGrid delivery reports
- [ ] **Test Purchase Flow**: Verify Stripe payments working
- [ ] **Check Download Links**: Verify Google Drive links active

#### **Weekly Monitoring Tasks**

- [ ] **Performance Review**: Analyze page load times
- [ ] **User Analytics**: Review user behavior and conversion rates
- [ ] **Security Scan**: Check for vulnerabilities
- [ ] **Backup Verification**: Ensure data backups are working
- [ ] **Cost Monitoring**: Review API usage and costs

### **🚨 Troubleshooting Guide**

#### **Common Issues**

1. **Build Failures**
   ```bash
   # Clear cache and rebuild
   rm -rf .next
   npm run build
   ```

2. **Environment Variables**
   - Verify all variables are set in Vercel
   - Check for typos in variable names
   - Ensure proper environment selection

3. **API Errors**
   - Check API key configuration
   - Verify endpoint URLs
   - Review error logs in Vercel

4. **Performance Issues**
   - Optimize images and assets
   - Implement proper caching
   - Review bundle size

### **✅ Success Criteria**

- [ ] **Deployment**: Successfully deployed to Vercel
- [ ] **Domain**: Custom domain configured with SSL
- [ ] **Performance**: All pages load under 3 seconds
- [ ] **Functionality**: All features working in production
- [ ] **Monitoring**: Error tracking and analytics configured
- [ ] **Security**: Security headers and CORS configured
- [ ] **Testing**: All tests passing in production environment

### **📞 Support & Maintenance**

#### **Emergency Contacts**
- **Vercel Support**: https://vercel.com/support
- **Stripe Support**: https://support.stripe.com
- **SendGrid Support**: https://support.sendgrid.com
- **Supabase Support**: https://supabase.com/support

#### **Maintenance Schedule**
- **Daily**: Check error logs and performance
- **Weekly**: Review analytics and user feedback
- **Monthly**: Security updates and performance optimization
- **Quarterly**: Feature updates and system improvements

---

**Status**: Ready for Production Deployment
**Next Phase**: Phase 8 - Documentation & Monitoring 