# Vercel Setup Guide (Production)

## 1. Create Vercel Project
- Import repository into Vercel
- Framework preset: Next.js

## 2. Set Environment Variables (Project → Settings → Environment Variables)
Set all of these for Production (and Preview if needed):

- NEXTAUTH_URL = https://yourdomain.com
- NEXTAUTH_SECRET = <generate a strong secret>
- NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
- NEXT_PUBLIC_SUPABASE_ANON_KEY = <supabase anon key>
- SUPABASE_SERVICE_ROLE_KEY = <supabase service role>
- SENDGRID_API_KEY = <sendgrid key>
- FROM_EMAIL = noreply@yourdomain.com
- SEND_STATUS_UPDATE_EMAIL = false (set true to enable emails)
- STRIPE_SECRET_KEY = <stripe secret>
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = <stripe publishable>
- STRIPE_WEBHOOK_SECRET = <stripe webhook secret>
- ADMIN_EMAILS = admin@yourdomain.com,other@yourdomain.com
- (optional) NEXT_PUBLIC_GA_ID, NEXT_PUBLIC_SENTRY_DSN, ANALYZE

## 3. Domains
- Add custom domain(s) in Vercel → Domains
- Point DNS (A/CNAME) as instructed by Vercel
- Ensure SSL is active

## 4. Build & Routing
- Build Command: next build (default)
- Output: .next (default)
- Node version: 18 or latest LTS
- Keep default Vercel Next.js settings unless custom needs

## 5. Security Headers
`next.config.js` already includes strict security headers and CSP allowing Spline frames only. No X-Frame-Options ALLOWALL.

## 6. Post-Deploy Checklist
- Open Production URL
- Run smoke tests: basic navigation works, admin pages SSR-auth redirect for non-admins
- Verify API endpoints respond
- Check Stripe checkout on test mode or switch to live keys
- If enabling emails: set SEND_STATUS_UPDATE_EMAIL=true and verify SendGrid delivers

## 7. Monitoring
- Enable Vercel Analytics and Core Web Vitals
- Add error tracking (Sentry) if configured

## 8. Rollback
- Use Vercel’s “Promote previous deployment” if needed
- Keep environment variables versioned in Vercel’s history


