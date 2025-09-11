# YBF Studio Snippet System - Maintenance Guide

## 🔧 **Overview**

This maintenance guide provides comprehensive procedures for maintaining the YBF Studio snippet system in production, including monitoring, backups, updates, and troubleshooting.

## 📊 **Daily Monitoring Tasks**

### **1. System Health Check**
```bash
# Check QA Dashboard
curl -s https://yourdomain.com/qa | grep -o "Success Rate.*%"

# Check API Endpoints
curl -s https://yourdomain.com/api/beats | jq '.length'
curl -s https://yourdomain.com/api/test | jq '.success'
```

### **2. Performance Monitoring**
- **Page Load Times**: Target <3 seconds
- **API Response Times**: Target <1 second
- **Audio Load Times**: Target <2 seconds
- **Success Rate**: Target 80%+

### **3. Error Monitoring**
- Check Vercel function logs for errors
- Monitor SendGrid delivery reports
- Review Stripe payment failures
- Check Google Drive API errors

### **4. User Activity**
- Monitor beat preview counts
- Track purchase conversion rates
- Check email delivery success rates
- Review download link usage

## 🔄 **Weekly Maintenance Tasks**

### **1. Performance Review**
```bash
# Run comprehensive tests
curl -s https://yourdomain.com/api/test

# Check bundle size
npm run build
# Review .next/analyze/ for bundle analysis
```

### **2. Security Audit**
- Review Vercel security logs
- Check for unauthorized access attempts
- Verify SSL certificate status
- Review API rate limiting

### **3. Backup Verification**
- Verify environment variables are backed up
- Check configuration files are version controlled
- Ensure database backups are working (if applicable)
- Test restore procedures

### **4. Analytics Review**
- Review Google Analytics data
- Check conversion funnel performance
- Analyze user behavior patterns
- Review error tracking reports

## 📅 **Monthly Maintenance Tasks**

### **1. System Updates**
```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Update Next.js if needed
npm install next@latest
```

### **2. Performance Optimization**
- Review and optimize images
- Analyze and optimize bundle size
- Check and update caching strategies
- Review CDN performance

### **3. Security Updates**
- Update security headers if needed
- Review and rotate API keys
- Check for new security vulnerabilities
- Update SSL certificates if needed

### **4. Documentation Updates**
- Update user guide with new features
- Review and update troubleshooting guides
- Update deployment procedures
- Review and update maintenance procedures

## 🚨 **Emergency Procedures**

### **1. System Down**
```bash
# 1. Check Vercel status
curl -s https://yourdomain.com/api/beats

# 2. Check environment variables
vercel env ls

# 3. Check function logs
vercel logs

# 4. Restart deployment if needed
vercel --prod
```

### **2. Payment System Issues**
1. **Check Stripe Dashboard**: Verify API keys and webhooks
2. **Check Purchase API**: Test `/api/purchase` endpoint
3. **Review Error Logs**: Check for payment processing errors
4. **Contact Stripe Support**: If issues persist

### **3. Email System Issues**
1. **Check SendGrid Dashboard**: Verify API key and delivery status
2. **Test Email API**: Test `/api/send-email` endpoint
3. **Check Email Templates**: Verify template syntax
4. **Review Delivery Reports**: Check for bounced emails

### **4. Audio System Issues**
1. **Check SoundCloud**: Verify snippet URLs are accessible
2. **Check Google Drive**: Verify full track URLs are accessible
3. **Test Audio Player**: Check browser console for errors
4. **Review Audio Context**: Check UnifiedAudioContext logs and state
5. **SoundCloud Widget**: Ensure `https://w.soundcloud.com/player/api.js` loads and the track allows embedding. Verify the iframe is present in the global player. For private tracks, ensure the embed uses `https://api.soundcloud.com/tracks/TRACK_ID?secret_token=s-XXXX` and that embedding is permitted.
6. **Compact Player**: Compact widget (height 20, `visual=false`) is the default. Change in `components/audio/GlobalAudioPlayer.tsx` if needed.
6. **Cover Art System**: Verify cover art images exist in `/public/assets/beatCovers/`. Check that beats without custom cover art display randomized fallback images.

## 🔧 **Troubleshooting Workflows**

### **1. Performance Issues**

#### **Slow Page Loads**
```bash
# Check bundle size
npm run build
# Review .next/analyze/ for large packages

# Check image optimization
# Verify images are using Next.js Image component

# Check caching
# Verify proper cache headers are set
```

#### **Slow API Responses**
```bash
# Check function logs
vercel logs

# Test API endpoints
curl -w "@curl-format.txt" -o /dev/null -s https://yourdomain.com/api/beats

# Check database performance (if applicable)
# Review query performance and indexes
```

### **2. Audio Issues**

#### **Snippets Not Playing**
1. **Check SoundCloud URLs**: Verify URLs are accessible
2. **Check Browser Console**: Look for JavaScript errors
3. **Test Audio Context**: Check UnifiedAudioContext state
4. **Check Network**: Verify audio files are loading

#### **Full Tracks Not Downloading**
1. **Check Google Drive URLs**: Verify URLs are accessible
2. **Check Download Links**: Test link generation
3. **Check Expiration**: Verify links haven't expired
4. **Check Permissions**: Verify Google Drive permissions

### **3. Email Issues**

#### **Emails Not Sending**
```bash
# Test email API
curl -X POST https://yourdomain.com/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"type":"test","customerEmail":"jmaconny@ybfstudio.com"}'

# Check SendGrid API key
# Verify API key is valid and has proper permissions

# Check email templates
# Verify template syntax and variables
```

#### **Emails Not Delivered**
1. **Check SendGrid Dashboard**: Review delivery reports
2. **Check Spam Filters**: Verify emails aren't being blocked
3. **Check Email Addresses**: Verify email addresses are valid
4. **Check SendGrid Limits**: Verify not exceeding rate limits

### **4. Payment Issues**

#### **Purchases Not Processing**
```bash
# Test purchase API
curl -X POST https://yourdomain.com/api/purchase \
  -H "Content-Type: application/json" \
  -d '{"beatId":"1","licenseType":"mp3","customerEmail":"jmaconny@ybfstudio.com","customerName":"Test User"}'

# Check Stripe API keys
# Verify keys are correct and have proper permissions

# Check webhook configuration
# Verify webhooks are properly configured
```

#### **Payment Failures**
1. **Check Stripe Dashboard**: Review failed payments
2. **Check Error Logs**: Review payment processing errors
3. **Check Card Details**: Verify test card details
4. **Check Stripe Limits**: Verify not exceeding rate limits

## 📈 **Performance Optimization**

### **1. Bundle Optimization**
```bash
# Analyze bundle size
ANALYZE=true npm run build

# Review large packages
# Consider code splitting for large components

# Optimize images
# Use Next.js Image component with proper sizing
```

### **2. Caching Strategy**
```javascript
// Verify caching headers in next.config.js
{
  source: '/assets/:path*',
  headers: [
    {
      key: 'Cache-Control',
      value: 'public, max-age=31536000, immutable',
    },
  ],
}
```

### **3. API Optimization**
```javascript
// Implement proper error handling
// Add request validation
// Implement rate limiting
// Add response caching where appropriate
```

## 🔒 **Security Maintenance**

### **1. API Key Rotation**
```bash
# Generate new API keys
# Update environment variables
vercel env add SENDGRID_API_KEY
vercel env add STRIPE_SECRET_KEY

# Test with new keys
curl -s https://yourdomain.com/api/test
```

### **2. Security Headers**
```javascript
// Verify security headers in next.config.js
{
  key: 'Strict-Transport-Security',
  value: 'max-age=63072000; includeSubDomains; preload'
}
```

### **3. CORS Configuration**
```javascript
// Verify CORS settings in vercel.json
{
  "key": "Access-Control-Allow-Origin",
  "value": "https://yourdomain.com"
}
```

## 📊 **Monitoring Setup**

### **1. Vercel Analytics**
- Enable in Vercel Dashboard
- Monitor Core Web Vitals
- Track performance metrics
- Set up alerts for performance issues

### **2. Error Tracking**
```bash
# Install Sentry (optional)
npm install @sentry/nextjs

# Configure in next.config.js
const { withSentryConfig } = require('@sentry/nextjs');
```

### **3. Custom Monitoring**
```javascript
// Add custom performance monitoring
// Track API response times
// Monitor user interactions
// Track conversion rates
```

## 🔄 **Backup Procedures**

### **1. Environment Variables**
```bash
# Export environment variables
vercel env ls > env-backup.txt

# Backup to secure location
# Store in password manager or secure vault
```

### **2. Configuration Files**
```bash
# Backup configuration files
cp next.config.js next.config.js.backup
cp vercel.json vercel.json.backup
cp package.json package.json.backup
```

### **3. Database Backups**
```bash
# If using Supabase or other database
# Set up automated backups
# Test restore procedures regularly
```

## 📞 **Support Procedures**

### **1. Issue Escalation**
1. **Level 1**: Check documentation and troubleshooting guides
2. **Level 2**: Review logs and run diagnostic tests
3. **Level 3**: Contact service providers (Stripe, SendGrid, etc.)
4. **Level 4**: Engage development team for code fixes

### **2. Emergency Contacts**
- **Vercel Support**: https://vercel.com/support
- **Stripe Support**: https://support.stripe.com
- **SendGrid Support**: https://support.sendgrid.com
- **Supabase Support**: https://supabase.com/support

### **3. Communication Plan**
- **Internal**: Slack/Teams for immediate issues
- **External**: Email for non-urgent issues
- **Status Page**: Public status page for users
- **Social Media**: Updates for major issues

## 📋 **Maintenance Checklist**

### **Daily**
- [ ] Check QA Dashboard
- [ ] Monitor error logs
- [ ] Check API response times
- [ ] Verify email delivery

### **Weekly**
- [ ] Run comprehensive tests
- [ ] Review performance metrics
- [ ] Check security logs
- [ ] Verify backups

### **Monthly**
- [ ] Update dependencies
- [ ] Review security settings
- [ ] Optimize performance
- [ ] Update documentation

### **Quarterly**
- [ ] Security audit
- [ ] Performance review
- [ ] User feedback analysis
- [ ] System architecture review

---

**Version**: 1.0.0
**Last Updated**: January 2025
**Status**: Production Ready 