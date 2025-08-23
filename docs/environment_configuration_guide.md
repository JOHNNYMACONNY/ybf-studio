# Environment Configuration Guide

> **Configuration Note:** This guide provides complete environment variable setup, security best practices, and configuration procedures for the consultation system. Follow these steps exactly to ensure secure and proper system configuration.

**Related Docs:** [Google Calendar API Integration Guide](./google_calendar_api_integration_guide.md) | [Consultation System Implementation Plan](./consultation_system_implementation_plan.md) | [Database Schema](./database/)

---

## Purpose
This guide provides comprehensive environment variable configuration, security best practices, and setup procedures for the consultation system, ensuring secure and proper system operation.

---

## Table of Contents
- [Environment Variable Overview](#environment-variable-overview)
- [Development Environment Setup](#development-environment-setup)
- [Production Environment Setup](#production-environment-setup)
- [Security Best Practices](#security-best-practices)
- [Environment Variable Validation](#environment-variable-validation)
- [Configuration Testing](#configuration-testing)
- [Troubleshooting](#troubleshooting)
- [Migration Procedures](#migration-procedures)

---

## Environment Variable Overview

### **Required Environment Variables**

The consultation system requires the following environment variables to function properly:

#### **Google Calendar API Configuration**
```bash
# OAuth2 Credentials
GOOGLE_CLIENT_ID=your_oauth2_client_id
GOOGLE_CLIENT_SECRET=your_oauth2_client_secret
GOOGLE_REDIRECT_URI=your_redirect_uri
GOOGLE_CALENDAR_ID=your_calendar_id

# API Scopes
GOOGLE_CALENDAR_SCOPE=https://www.googleapis.com/auth/calendar
GOOGLE_CALENDAR_EVENTS_SCOPE=https://www.googleapis.com/auth/calendar.events
```

#### **Application Configuration**
```bash
# Next.js Configuration
NEXT_PUBLIC_APP_URL=your_app_url
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=your_nextauth_url

# Application Settings
NODE_ENV=development_or_production
NEXT_PUBLIC_APP_NAME=AudioServiceApp
NEXT_PUBLIC_APP_VERSION=1.0.0
```

#### **Database Configuration (Supabase)**
```bash
# Supabase Connection
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database Settings
SUPABASE_DB_HOST=your_database_host
SUPABASE_DB_PORT=5432
SUPABASE_DB_NAME=postgres
```

#### **Email Configuration (SendGrid)**
```bash
# SendGrid API
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_from_email_address
SENDGRID_FROM_NAME=your_from_name

# Email Templates
SENDGRID_CONSULTATION_CONFIRMATION_TEMPLATE=your_template_id
SENDGRID_CALENDAR_INVITE_TEMPLATE=your_template_id
SENDGRID_REMINDER_TEMPLATE=your_template_id
SENDGRID_FOLLOWUP_TEMPLATE=your_template_id
```

#### **Authentication Configuration (NextAuth.js)**
```bash
# NextAuth.js Settings
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=your_nextauth_url

# Google OAuth (if using Google login)
GOOGLE_ID=your_google_oauth_client_id
GOOGLE_SECRET=your_google_oauth_client_secret
```

#### **Security Configuration**
```bash
# Security Settings
JWT_SECRET=your_jwt_secret_key
ENCRYPTION_KEY=your_encryption_key
RATE_LIMIT_SECRET=your_rate_limit_secret

# CORS Configuration
NEXT_PUBLIC_CORS_ORIGIN=your_cors_origin
```

---

## Development Environment Setup

### **Step 1: Create Environment File**

1. **Navigate to Project Root**
   ```bash
   cd /path/to/your/AudioServiceApp
   ```

2. **Create .env.local File**
   ```bash
   touch .env.local
   ```

3. **Add Environment Variables**
   ```bash
   # Copy the following content to .env.local
   # Google Calendar API Configuration
   GOOGLE_CLIENT_ID=your_development_client_id
   GOOGLE_CLIENT_SECRET=your_development_client_secret
   GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
   GOOGLE_CALENDAR_ID=your_development_calendar_id

   # Google Calendar API Scopes
   GOOGLE_CALENDAR_SCOPE=https://www.googleapis.com/auth/calendar
   GOOGLE_CALENDAR_EVENTS_SCOPE=https://www.googleapis.com/auth/calendar.events

   # Application Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_development_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   NODE_ENV=development

   # Application Settings
   NEXT_PUBLIC_APP_NAME=AudioServiceApp
   NEXT_PUBLIC_APP_VERSION=1.0.0

   # Database Configuration (Supabase)
   SUPABASE_URL=your_development_supabase_url
   SUPABASE_ANON_KEY=your_development_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_development_supabase_service_role_key

   # Email Configuration (SendGrid)
   SENDGRID_API_KEY=your_development_sendgrid_api_key
   SENDGRID_FROM_EMAIL=your_development_from_email
   SENDGRID_FROM_NAME=AudioServiceApp Development

   # Email Templates (Development)
   SENDGRID_CONSULTATION_CONFIRMATION_TEMPLATE=your_dev_template_id
   SENDGRID_CALENDAR_INVITE_TEMPLATE=your_dev_template_id
   SENDGRID_REMINDER_TEMPLATE=your_dev_template_id
   SENDGRID_FOLLOWUP_TEMPLATE=your_dev_template_id

   # Security Configuration
   JWT_SECRET=your_development_jwt_secret
   ENCRYPTION_KEY=your_development_encryption_key
   RATE_LIMIT_SECRET=your_development_rate_limit_secret

   # CORS Configuration
   NEXT_PUBLIC_CORS_ORIGIN=http://localhost:3000
   ```

### **Step 2: Update .gitignore**

Ensure `.env.local` is in your `.gitignore` file:

```bash
# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Local environment
.env.local
.env.*.local
```

### **Step 3: Install Environment Validation**

```bash
npm install joi dotenv
# or
yarn add joi dotenv
```

### **Step 4: Create Environment Validation Script**

Create `scripts/validate-env.js`:

```javascript
const { config } = require('dotenv');
const Joi = require('joi');

// Load environment variables
config({ path: '.env.local' });

// Environment variable schema
const envSchema = Joi.object({
  // Google Calendar API
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_REDIRECT_URI: Joi.string().uri().required(),
  GOOGLE_CALENDAR_ID: Joi.string().required(),

  // Application Configuration
  NEXT_PUBLIC_APP_URL: Joi.string().uri().required(),
  NEXTAUTH_SECRET: Joi.string().min(32).required(),
  NEXTAUTH_URL: Joi.string().uri().required(),
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),

  // Database Configuration
  SUPABASE_URL: Joi.string().uri().required(),
  SUPABASE_ANON_KEY: Joi.string().required(),
  SUPABASE_SERVICE_ROLE_KEY: Joi.string().required(),

  // Email Configuration
  SENDGRID_API_KEY: Joi.string().required(),
  SENDGRID_FROM_EMAIL: Joi.string().email().required(),
  SENDGRID_FROM_NAME: Joi.string().required(),

  // Security Configuration
  JWT_SECRET: Joi.string().min(32).required(),
  ENCRYPTION_KEY: Joi.string().min(32).required(),
  RATE_LIMIT_SECRET: Joi.string().min(32).required(),
});

// Validate environment variables
function validateEnv() {
  const { error, value } = envSchema.validate(process.env, { allowUnknown: true });

  if (error) {
    console.error('❌ Environment validation failed:');
    error.details.forEach(detail => {
      console.error(`   ${detail.message}`);
    });
    process.exit(1);
  }

  console.log('✅ Environment validation passed');
  console.log('📋 Environment summary:');
  console.log(`   NODE_ENV: ${value.NODE_ENV}`);
  console.log(`   APP_URL: ${value.NEXT_PUBLIC_APP_URL}`);
  console.log(`   Database: ${value.SUPABASE_URL ? 'Configured' : 'Missing'}`);
  console.log(`   Google Calendar: ${value.GOOGLE_CLIENT_ID ? 'Configured' : 'Missing'}`);
  console.log(`   SendGrid: ${value.SENDGRID_API_KEY ? 'Configured' : 'Missing'}`);
}

// Run validation
validateEnv();
```

### **Step 5: Add Validation to Package.json**

```json
{
  "scripts": {
    "validate-env": "node scripts/validate-env.js",
    "dev": "npm run validate-env && next dev",
    "build": "npm run validate-env && next build"
  }
}
```

---

## Production Environment Setup

### **Step 1: Vercel Environment Variables**

1. **Navigate to Vercel Dashboard**
   - Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your project

2. **Environment Variables Section**
   - Go to "Settings" → "Environment Variables"
   - Click "Add New"

3. **Add Production Variables**
   ```bash
   # Google Calendar API Configuration
   GOOGLE_CLIENT_ID=your_production_client_id
   GOOGLE_CLIENT_SECRET=your_production_client_secret
   GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/google/callback
   GOOGLE_CALENDAR_ID=your_production_calendar_id

   # Google Calendar API Scopes
   GOOGLE_CALENDAR_SCOPE=https://www.googleapis.com/auth/calendar
   GOOGLE_CALENDAR_EVENTS_SCOPE=https://www.googleapis.com/auth/calendar.events

   # Application Configuration
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   NEXTAUTH_SECRET=your_production_nextauth_secret
   NEXTAUTH_URL=https://yourdomain.com
   NODE_ENV=production

   # Application Settings
   NEXT_PUBLIC_APP_NAME=AudioServiceApp
   NEXT_PUBLIC_APP_VERSION=1.0.0

   # Database Configuration (Supabase)
   SUPABASE_URL=your_production_supabase_url
   SUPABASE_ANON_KEY=your_production_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_production_supabase_service_role_key

   # Email Configuration (SendGrid)
   SENDGRID_API_KEY=your_production_sendgrid_api_key
   SENDGRID_FROM_EMAIL=your_production_from_email
   SENDGRID_FROM_NAME=AudioServiceApp

   # Email Templates (Production)
   SENDGRID_CONSULTATION_CONFIRMATION_TEMPLATE=your_prod_template_id
   SENDGRID_CALENDAR_INVITE_TEMPLATE=your_prod_template_id
   SENDGRID_REMINDER_TEMPLATE=your_prod_template_id
   SENDGRID_FOLLOWUP_TEMPLATE=your_prod_template_id

   # Security Configuration
   JWT_SECRET=your_production_jwt_secret
   ENCRYPTION_KEY=your_production_encryption_key
   RATE_LIMIT_SECRET=your_production_rate_limit_secret

   # CORS Configuration
   NEXT_PUBLIC_CORS_ORIGIN=https://yourdomain.com
   ```

### **Step 2: Environment Variable Security**

1. **Generate Secure Secrets**
   ```bash
   # Generate NextAuth secret
   openssl rand -base64 32

   # Generate JWT secret
   openssl rand -base64 32

   # Generate encryption key
   openssl rand -base64 32

   # Generate rate limit secret
   openssl rand -base64 32
   ```

2. **Set Production Secrets**
   - Use the generated secrets in your Vercel environment variables
   - Never use development secrets in production
   - Rotate secrets regularly

### **Step 3: Production OAuth2 Configuration**

1. **Update Google Cloud Console**
   - Change OAuth consent screen to "Production"
   - Add production domain to authorized domains
   - Update redirect URIs to production URLs

2. **Verify Domain Ownership**
   - Complete domain verification in Google Cloud Console
   - Ensure HTTPS is properly configured

---

## Security Best Practices

### **Environment Variable Security**

1. **Never Commit Secrets**
   ```bash
   # ❌ Wrong - Never do this
   git add .env.local
   git commit -m "Add environment variables"

   # ✅ Correct - Use .gitignore
   echo ".env.local" >> .gitignore
   git add .gitignore
   git commit -m "Add environment files to gitignore"
   ```

2. **Use Different Credentials**
   - Development and production should use different API keys
   - Never share production credentials
   - Use environment-specific OAuth2 applications

3. **Secret Rotation**
   - Rotate secrets regularly (every 90 days)
   - Monitor for unauthorized access
   - Use secure secret management systems

### **Access Control**

1. **API Key Permissions**
   - Use least privilege principle
   - Limit API key scopes to minimum required
   - Monitor API key usage

2. **Database Access**
   - Use read-only keys where possible
   - Limit service role key access
   - Monitor database access patterns

### **Network Security**

1. **HTTPS Only**
   - Force HTTPS in production
   - Use secure cookies
   - Implement HSTS headers

2. **CORS Configuration**
   ```typescript
   // next.config.js
   module.exports = {
     async headers() {
       return [
         {
           source: '/api/:path*',
           headers: [
             {
               key: 'Access-Control-Allow-Origin',
               value: process.env.NEXT_PUBLIC_CORS_ORIGIN || 'https://yourdomain.com'
             },
             {
               key: 'Access-Control-Allow-Methods',
               value: 'GET, POST, PUT, DELETE, OPTIONS'
             },
             {
               key: 'Access-Control-Allow-Headers',
               value: 'Content-Type, Authorization'
             }
           ]
         }
       ];
     }
   };
   ```

---

## Environment Variable Validation

### **Runtime Validation**

Create `lib/env.ts`:

```typescript
import { z } from 'zod';

// Environment variable schema
const envSchema = z.object({
  // Google Calendar API
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GOOGLE_REDIRECT_URI: z.string().url(),
  GOOGLE_CALENDAR_ID: z.string().min(1),

  // Application Configuration
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Database Configuration
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // Email Configuration
  SENDGRID_API_KEY: z.string().min(1),
  SENDGRID_FROM_EMAIL: z.string().email(),
  SENDGRID_FROM_NAME: z.string().min(1),

  // Security Configuration
  JWT_SECRET: z.string().min(32),
  ENCRYPTION_KEY: z.string().min(32),
  RATE_LIMIT_SECRET: z.string().min(32),
});

// Parse and validate environment variables
function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment validation failed:');
      error.errors.forEach(err => {
        console.error(`   ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
}

// Export validated environment variables
export const env = validateEnv();

// Type-safe environment variables
export type Env = z.infer<typeof envSchema>;
```

### **Build-Time Validation**

Update `next.config.js`:

```javascript
const { env } = require('./lib/env');

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_APP_URL: env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_NAME: env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_VERSION: env.NEXT_PUBLIC_APP_VERSION,
  },
  
  // Environment variable validation
  onDemandEntries: {
    // Validate environment variables during build
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

module.exports = nextConfig;
```

---

## Configuration Testing

### **Environment Variable Test**

Create `__tests__/env.test.ts`:

```typescript
import { env } from '../lib/env';

describe('Environment Variables', () => {
  it('should have all required environment variables', () => {
    // Google Calendar API
    expect(env.GOOGLE_CLIENT_ID).toBeDefined();
    expect(env.GOOGLE_CLIENT_SECRET).toBeDefined();
    expect(env.GOOGLE_REDIRECT_URI).toBeDefined();
    expect(env.GOOGLE_CALENDAR_ID).toBeDefined();

    // Application Configuration
    expect(env.NEXT_PUBLIC_APP_URL).toBeDefined();
    expect(env.NEXTAUTH_SECRET).toBeDefined();
    expect(env.NEXTAUTH_URL).toBeDefined();
    expect(env.NODE_ENV).toBeDefined();

    // Database Configuration
    expect(env.SUPABASE_URL).toBeDefined();
    expect(env.SUPABASE_ANON_KEY).toBeDefined();
    expect(env.SUPABASE_SERVICE_ROLE_KEY).toBeDefined();

    // Email Configuration
    expect(env.SENDGRID_API_KEY).toBeDefined();
    expect(env.SENDGRID_FROM_EMAIL).toBeDefined();
    expect(env.SENDGRID_FROM_NAME).toBeDefined();

    // Security Configuration
    expect(env.JWT_SECRET).toBeDefined();
    expect(env.ENCRYPTION_KEY).toBeDefined();
    expect(env.RATE_LIMIT_SECRET).toBeDefined();
  });

  it('should have valid URLs', () => {
    expect(env.NEXT_PUBLIC_APP_URL).toMatch(/^https?:\/\/.+/);
    expect(env.NEXTAUTH_URL).toMatch(/^https?:\/\/.+/);
    expect(env.SUPABASE_URL).toMatch(/^https?:\/\/.+/);
    expect(env.GOOGLE_REDIRECT_URI).toMatch(/^https?:\/\/.+/);
  });

  it('should have valid email addresses', () => {
    expect(env.SENDGRID_FROM_EMAIL).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  it('should have secure secrets', () => {
    expect(env.NEXTAUTH_SECRET.length).toBeGreaterThanOrEqual(32);
    expect(env.JWT_SECRET.length).toBeGreaterThanOrEqual(32);
    expect(env.ENCRYPTION_KEY.length).toBeGreaterThanOrEqual(32);
    expect(env.RATE_LIMIT_SECRET.length).toBeGreaterThanOrEqual(32);
  });
});
```

### **Configuration Validation Script**

Create `scripts/check-config.js`:

```javascript
const { env } = require('../lib/env');

function checkConfiguration() {
  console.log('🔍 Checking configuration...\n');

  // Check Google Calendar API
  console.log('📅 Google Calendar API:');
  console.log(`   Client ID: ${env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing'}`);
  console.log(`   Client Secret: ${env.GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ Missing'}`);
  console.log(`   Redirect URI: ${env.GOOGLE_REDIRECT_URI ? '✅ Set' : '❌ Missing'}`);
  console.log(`   Calendar ID: ${env.GOOGLE_CALENDAR_ID ? '✅ Set' : '❌ Missing'}\n`);

  // Check Application Configuration
  console.log('🚀 Application Configuration:');
  console.log(`   App URL: ${env.NEXT_PUBLIC_APP_URL ? '✅ Set' : '❌ Missing'}`);
  console.log(`   NextAuth Secret: ${env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Missing'}`);
  console.log(`   NextAuth URL: ${env.NEXTAUTH_URL ? '✅ Set' : '❌ Missing'}`);
  console.log(`   Node Environment: ${env.NODE_ENV}\n`);

  // Check Database Configuration
  console.log('🗄️ Database Configuration:');
  console.log(`   Supabase URL: ${env.SUPABASE_URL ? '✅ Set' : '❌ Missing'}`);
  console.log(`   Anon Key: ${env.SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`   Service Role Key: ${env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing'}\n`);

  // Check Email Configuration
  console.log('📧 Email Configuration:');
  console.log(`   SendGrid API Key: ${env.SENDGRID_API_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`   From Email: ${env.SENDGRID_FROM_EMAIL ? '✅ Set' : '❌ Missing'}`);
  console.log(`   From Name: ${env.SENDGRID_FROM_NAME ? '✅ Set' : '❌ Missing'}\n`);

  // Check Security Configuration
  console.log('🔒 Security Configuration:');
  console.log(`   JWT Secret: ${env.JWT_SECRET ? '✅ Set' : '❌ Missing'}`);
  console.log(`   Encryption Key: ${env.ENCRYPTION_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`   Rate Limit Secret: ${env.RATE_LIMIT_SECRET ? '✅ Set' : '❌ Missing'}\n`);

  // Overall status
  const allSet = [
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    env.GOOGLE_REDIRECT_URI,
    env.GOOGLE_CALENDAR_ID,
    env.NEXT_PUBLIC_APP_URL,
    env.NEXTAUTH_SECRET,
    env.NEXTAUTH_URL,
    env.SUPABASE_URL,
    env.SUPABASE_ANON_KEY,
    env.SUPABASE_SERVICE_ROLE_KEY,
    env.SENDGRID_API_KEY,
    env.SENDGRID_FROM_EMAIL,
    env.SENDGRID_FROM_NAME,
    env.JWT_SECRET,
    env.ENCRYPTION_KEY,
    env.RATE_LIMIT_SECRET,
  ].every(Boolean);

  if (allSet) {
    console.log('🎉 All environment variables are configured!');
  } else {
    console.log('⚠️ Some environment variables are missing. Please check the configuration.');
    process.exit(1);
  }
}

// Run configuration check
checkConfiguration();
```

---

## Troubleshooting

### **Common Issues**

1. **Environment Variables Not Loading**
   ```bash
   # Check if .env.local exists
   ls -la .env.local

   # Verify file permissions
   chmod 600 .env.local

   # Check for syntax errors
   cat .env.local
   ```

2. **Build Errors**
   ```bash
   # Clear Next.js cache
   rm -rf .next

   # Reinstall dependencies
   rm -rf node_modules package-lock.json
   npm install

   # Validate environment
   npm run validate-env
   ```

3. **Production Deployment Issues**
   - Verify Vercel environment variables are set
   - Check for typos in variable names
   - Ensure production OAuth2 credentials are configured

### **Debug Mode**

Enable debug logging:

```bash
# Next.js debug
DEBUG=next:*

# Environment debug
DEBUG=env:*

# API debug
DEBUG=api:*
```

---

## Migration Procedures

### **Development to Production**

1. **Update OAuth2 Configuration**
   - Create new OAuth2 application for production
   - Update redirect URIs
   - Change consent screen to production

2. **Update Environment Variables**
   - Set production environment variables in Vercel
   - Use production API keys and secrets
   - Update domain references

3. **Test Production Configuration**
   - Deploy to staging environment first
   - Test all functionality
   - Verify email delivery

### **Environment Variable Updates**

1. **Add New Variables**
   - Add to development `.env.local`
   - Add to production Vercel dashboard
   - Update validation schemas

2. **Remove Deprecated Variables**
   - Remove from all environments
   - Update code references
   - Clean up validation schemas

---

## Conclusion

This environment configuration guide provides comprehensive setup and security best practices for the consultation system. Follow these steps carefully to ensure secure and proper system operation.

**Key Success Factors**:
1. **Secure Configuration**: Never commit secrets to version control
2. **Environment Separation**: Use different credentials for development and production
3. **Validation**: Implement comprehensive environment variable validation
4. **Security**: Follow security best practices for all sensitive data
5. **Testing**: Thoroughly test configuration before deployment

**Next Steps**:
1. Set up development environment variables
2. Configure production environment in Vercel
3. Implement environment validation
4. Test configuration thoroughly
5. Deploy with confidence

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Next Review**: [After Implementation]  
**Implementation Status**: [Ready for Development]
