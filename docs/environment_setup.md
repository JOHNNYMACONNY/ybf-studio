# Environment Setup & Configuration

> **Security Note:** Never commit API keys or secrets to version control. This file contains sensitive information for development purposes only.

**Related Docs:** [Roadmap](./roadmap.md) | [Current Issues](./current_issues.md) | [Tech Stack](./tech_stack.md) | [Checklists](./checklists.md)

---

## Purpose
Complete guide for setting up environment variables and configuring all external services for the AudioServiceApp.

---

## Environment Variables

### **Required .env.local File**

Create a `.env.local` file in the project root with the following variables:

```env
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=ej4Fv7VDGrwry6oXV8syLt5MFsJkHlP8KGdYaqFF2C0=

# Google OAuth (ljkeoni@gmail.com account)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# SendGrid Email Service
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@your-domain.com
ADMIN_NOTIFICATIONS_EMAIL=admin@your-domain.com

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://tfcmvmnkncgyjfpykdia.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_6UhmR6D5dNxNnqcHhE1LTw_ZxMPtnGt
SUPABASE_SERVICE_ROLE_KEY=sb_secret_2ZJ6dcREvtKLZAobXjKmqA_JOM5zQ7A

# Stripe Payment Processing
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_bBFE2kFBKmk6GfUiPoh5m9lfrjL1fAFY

# Admin Configuration
ADMIN_EMAILS=ljkeoni@gmail.com

# Production URLs (update for deployment)
NEXTAUTH_URL=https://your-domain.com
```

---

## Service Configuration

### **1. NextAuth.js Setup**

#### **Current Status**: ✅ **CONFIGURED**
- **OAuth Account**: ljkeoni@gmail.com Google account
- **Client ID**: `your-google-client-id`
- **Client Secret**: `your-google-client-secret`

#### **Missing Configuration**:
- **NEXTAUTH_SECRET**: ✅ **GENERATED** - `ej4Fv7VDGrwry6oXV8syLt5MFsJkHlP8KGdYaqFF2C0=`

```bash
# Option 1: Using openssl (recommended)
openssl rand -base64 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 3: Online generator (less secure)
# Use https://generate-secret.vercel.app/32
```

#### **NEXTAUTH_URL Setup**:
- **Development**: Set to `http://localhost:3000`
- **Production**: Set to `https://your-domain.com`
- **Current Status**: ❌ **NEEDS TO BE SET**

**Step-by-Step Setup**:
1. **For Development**: Add to your `.env.local`:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   ```

2. **For Production**: Update to your actual domain:
   ```env
   NEXTAUTH_URL=https://www.ybfstudio.com
   ```

3. **Google OAuth Redirect URIs**: Make sure these match your NEXTAUTH_URL:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://www.ybfstudio.com/api/auth/callback/google`

#### **Google OAuth Setup**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project or create new one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://your-domain.com/api/auth/callback/google` (production)

### **2. SendGrid Configuration**

#### **Current Status**: ✅ **CONFIGURED**
- **API Key**: `your-sendgrid-api-key`

#### **Setup Steps**:
1. **Verify Sender Email**:
   - Go to [SendGrid Settings](https://app.sendgrid.com/settings/sender_auth)
   - Verify your sender email address
   - Recommended: Use ljkeoni@gmail.com as verified sender

2. **Create Email Templates**:
   - Order confirmation template
   - Welcome email template
   - Contact form notification template

3. **Test Email Delivery**:
   ```typescript
   // Test email sending
   import sgMail from '@sendgrid/mail';
   sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
   
   const msg = {
     to: 'test@example.com',
     from: 'ljkeoni@gmail.com',
     subject: 'Test Email',
     text: 'This is a test email',
     html: '<p>This is a test email</p>',
   };
   
   sgMail.send(msg);
   ```

### **3. Supabase Database Setup**

#### **Current Status**: ✅ **CONFIGURED**
- **Project URL**: `https://tfcmvmnkncgyjfpykdia.supabase.co`
- **Publishable Key**: `sb_publishable_6UhmR6D5dNxNnqcHhE1LTw_ZxMPtnGt`
- **Service Role Key**: `sb_secret_2ZJ6dcREvtKLZAobXjKmqA_JOM5zQ7A`

#### **Setup Steps**:
1. **✅ Supabase Project Created**:
   - Project URL: https://tfcmvmnkncgyjfpykdia.supabase.co
   - API keys configured and ready

2. **Database Schema**:
   ```sql
   -- Users table (extends NextAuth users)
   CREATE TABLE users (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     email TEXT UNIQUE NOT NULL,
     name TEXT,
     created_at TIMESTAMP DEFAULT NOW()
   );
   
   -- Orders table
   CREATE TABLE orders (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES users(id),
     stripe_session_id TEXT,
     total_amount INTEGER,
     status TEXT DEFAULT 'pending',
     created_at TIMESTAMP DEFAULT NOW()
   );
   
   -- Order items table
   CREATE TABLE order_items (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     order_id UUID REFERENCES orders(id),
     beat_id TEXT,
     license_type TEXT,
     price INTEGER
   );
   
   -- Beats table
   CREATE TABLE beats (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     title TEXT NOT NULL,
     artist TEXT,
     genre TEXT,
     bpm INTEGER,
     price INTEGER,
     cover_art TEXT,
     preview_url TEXT,
     full_track_url TEXT,
     preview_duration TEXT,
     full_duration TEXT,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

3. **Get API Keys**:
   - Go to Project Settings > API
   - Copy `anon public` key for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy `service_role` key for `SUPABASE_SERVICE_ROLE_KEY`
   - Copy project URL for `NEXT_PUBLIC_SUPABASE_URL`

### **4. Stripe Payment Setup**

#### **Current Status**: ✅ **CONFIGURED**
- **Publishable Key**: `your-stripe-publishable-key`
- **Secret Key**: `your-stripe-secret-key`
- **Environment**: Live (Production)

#### **Setup Steps**:
1. **✅ Stripe Account Created**:
   - Live keys configured for production
   - Account ready for real payments

3. **Configure Webhooks**:
   - Go to Developers > Webhooks
   - Add endpoint: `https://your-domain.com/api/stripe`
   - Select events: `checkout.session.completed`
   - Copy webhook signing secret for `STRIPE_WEBHOOK_SECRET`

### **Production Webhook Configuration**
- **Destination ID**: `we_1RrVPnIRpNzNUgYjPLVYqdl9`
- **Endpoint URL**: `https://www.ybfstudio.com/api/stripe`
- **Signing Secret**: `whsec_bBFE2kFBKmk6GfUiPoh5m9lfrjL1fAFY`
- **Status**: ✅ **CONFIGURED**
- **Events**: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`

4. **Create Products**:
   - Go to Products > Add Product
   - Create beat products with different license tiers
   - Set up pricing for MP3, WAV, and Exclusive licenses

---

## Security Best Practices

### **Environment Variables**
- ✅ Never commit `.env.local` to version control
- ✅ Use different keys for development and production
- ✅ Rotate API keys regularly
- ✅ Monitor API usage and costs

### **API Key Management**
- ✅ Store keys in environment variables only
- ✅ Use `.env.example` for documentation (without real keys)
- ✅ Validate environment variables on app startup
- ✅ Implement rate limiting for API calls

### **Production Deployment**
- ✅ Use Vercel environment variables for production
- ✅ Enable HTTPS for all external API calls
- ✅ Implement proper CORS policies
- ✅ Set up monitoring and alerting

---

## Troubleshooting

### **Common Issues**

#### **NextAuth.js Issues**
```bash
# Error: Invalid OAuth redirect URI
# Solution: Add correct redirect URI to Google OAuth settings
http://localhost:3000/api/auth/callback/google

# Error: Missing NEXTAUTH_SECRET
# Solution: Generate secret using openssl rand -base64 32
```

#### **SendGrid Issues**
```bash
# Error: Unauthorized
# Solution: Verify API key and sender email address

# Error: Email not delivered
# Solution: Check spam folder and verify sender domain
```

#### **Supabase Issues**
```bash
# Error: Invalid API key
# Solution: Check project URL and API keys in Supabase dashboard

# Error: Table not found
# Solution: Run database schema creation scripts
```

#### **Stripe Issues**
```bash
# Error: Invalid publishable key
# Solution: Use correct test/live keys for environment

# Error: Webhook signature verification failed
# Solution: Check webhook secret and endpoint URL
```

---

## Development Workflow

### **Local Development**
1. Copy `.env.example` to `.env.local`
2. Fill in all required environment variables
3. Start development server: `npm run dev`
4. **Start webhook forwarding** (in separate terminal): `stripe listen --forward-to localhost:3000/api/stripe`
5. Test all integrations locally

### **Testing Integrations**
```bash
# Test NextAuth.js
curl http://localhost:3000/api/auth/signin

# Test SendGrid
npm run test:email

# Test Supabase
npm run test:database

# Test Stripe
npm run test:stripe
```

### **Development Webhook Setup (Stripe CLI)**

#### **Install Stripe CLI**
```bash
# macOS (using Homebrew)
brew install stripe/stripe-cli/stripe

# Or download from https://github.com/stripe/stripe-cli/releases
```

#### **Login to Stripe CLI**
```bash
stripe login
# This will open your browser to authenticate with your Stripe account
```

#### **Forward Webhooks to Local Development**
```bash
# Forward production webhooks to local development
stripe listen --forward-to localhost:3000/api/stripe

# Or forward specific webhook
stripe listen --forward-to localhost:3000/api/stripe --events checkout.session.completed,payment_intent.succeeded,payment_intent.payment_failed
```

#### **Development Webhook Secret**
When you run `stripe listen`, it will output a webhook signing secret like:
```
> Ready! Your webhook signing secret is whsec_1234567890abcdef...
```

Use this secret in your `.env.local` for development:
```env
STRIPE_WEBHOOK_SECRET=whsec_011d60589b58fc494e7eb0acc300cf158de399a74ee6c95a08aea00f9a6357b7
```

**Current Development Webhook Secret**: `whsec_011d60589b58fc494e7eb0acc300cf158de399a74ee6c95a08aea00f9a6357b7`

#### **✅ Development Webhook Status**
- **Status**: ✅ **ACTIVE AND WORKING**
- **Command**: `stripe listen --forward-to localhost:3000/api/stripe`
- **Output**: `> Ready! You are using Stripe API Version [2025-03-31.basil]. Your webhook signing secret is whsec_011d60589b58fc494e7eb0acc300cf158de399a74ee6c95a08aea00f9a6357b7`
- **Usage**: Run this command in a separate terminal while developing

### **Production Deployment**
1. Set up Vercel project
2. Add environment variables in Vercel dashboard
3. Deploy and test all integrations
4. Monitor logs and performance

---

## Next Steps

### **Immediate Actions**
1. ✅ Generate NEXTAUTH_SECRET
2. ✅ Set up Supabase project and get API keys
3. ✅ Configure Stripe account and get API keys
4. ✅ Configure Stripe webhook endpoint and get signing secret
5. ✅ Set up Stripe CLI for development webhook testing
6. ✅ Test webhook forwarding (confirmed working)
7. ❌ Set NEXTAUTH_URL in .env.local
8. ❌ Test complete payment flow locally

### **Before Launch**
1. ❌ Set up production environment variables
2. ❌ Configure production webhooks
3. ❌ Test all integrations in production
4. ❌ Set up monitoring and alerting

---

**Note**: This documentation contains sensitive API keys for development purposes. In production, use environment-specific keys and never expose them in client-side code. 