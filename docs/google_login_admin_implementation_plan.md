# Google Login Admin Implementation Plan

## Overview
This document outlines a comprehensive plan to get Google login working properly for admin functionality. The current setup has NextAuth.js configured but is missing critical environment variables and proper error handling.

## Current Status Analysis

### ✅ What's Already Working
- NextAuth.js is installed and configured
- Google OAuth provider is set up in `pages/api/auth/[...nextauth].ts`
- SessionProvider is configured in `pages/_app.tsx`
- Admin layout with authentication checks exists
- Admin email configuration is set up

### ❌ What's Missing/Broken
- Environment variables are not properly set up
- No `.env.local` file exists
- Google OAuth credentials may be invalid or expired
- Missing proper error handling and user feedback
- No dedicated admin login page
- Missing proper redirect handling

## Implementation Plan

### Phase 1: Environment Setup (Critical - 30 minutes)

#### 1.1 Create Environment File
**File**: `.env.local`
```env
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Admin Configuration
ADMIN_EMAILS=your-admin-email@example.com

# Other existing variables...
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
SENDGRID_API_KEY=your-sendgrid-api-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

#### 1.2 Verify Google OAuth Setup
**Steps**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services > Credentials
3. Find the OAuth 2.0 Client ID: `your-google-client-id`
4. Verify authorized redirect URIs include:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://your-domain.com/api/auth/callback/google` (production)
5. If credentials are invalid, create new ones and update environment variables

### Phase 2: Enhanced Authentication Components (1 hour)

#### 2.1 Create Admin Login Page
**File**: `pages/admin/login.tsx`
```tsx
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Button from '../../components/ui/Button';

export default function AdminLogin() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.isAdmin) {
      router.push('/admin');
    }
  }, [session, router]);

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-neutral-900">
      <div className="w-full max-w-md p-8 bg-neutral-800 rounded-xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
          <p className="text-neutral-400">Sign in to access the admin dashboard</p>
        </div>
        
        {session ? (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-white mb-4">
                Signed in as: <span className="font-semibold">{session.user?.email}</span>
              </p>
              {session.user?.isAdmin ? (
                <div className="space-y-3">
                  <p className="text-emerald-400">✅ Admin access granted</p>
                  <Button onClick={() => router.push('/admin')} className="w-full">
                    Go to Admin Dashboard
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-red-400">❌ Admin access denied</p>
                  <p className="text-sm text-neutral-400">
                    Contact the system administrator to get admin privileges.
                  </p>
                  <Button onClick={() => signOut()} variant="outline" className="w-full">
                    Sign Out
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Button 
              onClick={() => signIn('google')} 
              className="w-full bg-white text-black hover:bg-gray-100"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-neutral-400">
                Only authorized admin accounts can access this area.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

#### 2.2 Create Authentication Hook
**File**: `hooks/useAuth.ts`
```tsx
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

type UserWithAdmin = {
  isAdmin?: boolean;
  [key: string]: unknown;
};

export function useAuth(requireAdmin = false, redirectTo = '/admin/login') {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const user = session?.user as UserWithAdmin | undefined;
  const isAdmin = user?.isAdmin;
  const isLoading = status === 'loading';
  const isAuthenticated = !!session;

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(redirectTo);
      } else if (requireAdmin && !isAdmin) {
        router.push('/admin/login');
      }
    }
  }, [isLoading, isAuthenticated, isAdmin, requireAdmin, router, redirectTo]);

  return {
    session,
    user,
    isAdmin,
    isLoading,
    isAuthenticated,
  };
}
```

#### 2.3 Enhanced AdminLayout Component
**File**: `components/AdminLayout.tsx` (Update existing)
```tsx
import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { LayoutDashboard, Music, ShoppingCart, FileText, Settings, BarChart3, Monitor, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navLinks = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, implemented: true },
  { name: 'Beats', href: '/admin/beats', icon: Music, implemented: true },
  { name: 'Blog', href: '/admin/blog', icon: FileText, implemented: true },
  { name: 'Services', href: '/admin/services', icon: Settings, implemented: true },
  { name: 'FAQ', href: '/admin/faq', icon: FileText, implemented: true },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart, implemented: true },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3, implemented: true },
  { name: 'Settings', href: '/admin/settings', icon: Settings, implemented: true },
  { name: 'Testing', href: '/admin/testing', icon: Monitor, implemented: true },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { session, user, isAdmin, isLoading } = useAuth(true, '/admin/login');

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-900">
        <div className="text-white">Loading admin panel...</div>
      </div>
    );
  }

  if (!session || !isAdmin) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-neutral-900 text-white">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="mb-6 text-neutral-400">You must be an admin to view this page.</p>
        <Link href="/admin/login" className="rounded-md bg-amber px-4 py-2 text-black hover:bg-amber/90">
          Go to Admin Login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-neutral-800 text-neutral-100">
      <aside className="w-64 flex-shrink-0 bg-black p-6">
        <div className="flex items-center gap-2 mb-6">
          <img 
            src="/assets/logo/main-logo.png" 
            alt="AudioService Logo" 
            className="h-6 w-auto"
          />
          <span className="font-semibold text-white">Admin Panel</span>
        </div>

        <nav className="space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors"
            >
              <link.icon className="h-5 w-5" />
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-neutral-700">
          <div className="flex items-center gap-3 mb-4">
            {user?.image && (
              <img 
                src={user.image} 
                alt="Profile" 
                className="w-8 h-8 rounded-full"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name || 'Admin User'}
              </p>
              <p className="text-xs text-neutral-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-700 hover:text-white rounded-md transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
```

### Phase 3: Error Handling & Debugging (30 minutes)

#### 3.1 Enhanced NextAuth Configuration
**File**: `pages/api/auth/[...nextauth].ts` (Update existing)
```tsx
import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];

type UserWithAdmin = {
  email?: string;
  isAdmin?: boolean;
  [key: string]: unknown;
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Log sign-in attempts for debugging
      console.log('Sign-in attempt:', {
        email: user.email,
        provider: account?.provider,
        isAdminEmail: adminEmails.includes(user.email || ''),
      });
      
      return true;
    },
    async session({ session, token }) {
      // Add isAdmin property to session
      const user = session?.user as UserWithAdmin | undefined;
      if (user?.email && adminEmails.includes(user.email)) {
        user.isAdmin = true;
        console.log('Admin session created for:', user.email);
      } else if (user) {
        user.isAdmin = false;
        console.log('Regular user session created for:', user.email);
      }
      return session;
    },
    async jwt({ token, user, account }) {
      // Add admin status to JWT token
      if (user?.email && adminEmails.includes(user.email)) {
        token.isAdmin = true;
      }
      return token;
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);
```

#### 3.2 Create Debug API Endpoint
**File**: `pages/api/auth/debug.ts`
```tsx
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    return res.status(200).json({
      session: session ? {
        user: {
          name: session.user?.name,
          email: session.user?.email,
          image: session.user?.image,
          isAdmin: (session.user as any)?.isAdmin,
        },
        expires: session.expires,
      } : null,
      environment: {
        hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
        hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
        adminEmails: process.env.ADMIN_EMAILS?.split(','),
        nodeEnv: process.env.NODE_ENV,
      },
    });
  } catch (error) {
    console.error('Auth debug error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

### Phase 4: Testing & Validation (30 minutes)

#### 4.1 Test Script
**File**: `scripts/test-auth.js`
```javascript
const https = require('https');
const http = require('http');

async function testEndpoint(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    }).on('error', reject);
  });
}

async function runTests() {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  
  console.log('🔍 Testing Authentication Setup...\n');
  
  try {
    // Test 1: Debug endpoint
    console.log('1. Testing auth debug endpoint...');
    const debugResult = await testEndpoint(`${baseUrl}/api/auth/debug`);
    console.log('   Status:', debugResult.status);
    console.log('   Environment check:', debugResult.data.environment);
    
    // Test 2: NextAuth endpoint
    console.log('\n2. Testing NextAuth endpoint...');
    const authResult = await testEndpoint(`${baseUrl}/api/auth/providers`);
    console.log('   Status:', authResult.status);
    
    // Test 3: Admin login page
    console.log('\n3. Testing admin login page...');
    const loginResult = await testEndpoint(`${baseUrl}/admin/login`);
    console.log('   Status:', loginResult.status);
    
    console.log('\n✅ Authentication tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

runTests();
```

#### 4.2 Manual Testing Checklist
```markdown
## Manual Testing Checklist

### Environment Setup
- [ ] `.env.local` file exists with all required variables
- [ ] `NEXTAUTH_URL` is set to `http://localhost:3000`
- [ ] `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are valid
- [ ] `ADMIN_EMAILS` contains the correct admin email

### Google OAuth Setup
- [ ] Google Cloud Console credentials are active
- [ ] Redirect URIs include `http://localhost:3000/api/auth/callback/google`
- [ ] OAuth consent screen is configured
- [ ] Google+ API is enabled

### Application Testing
- [ ] Visit `/admin/login` - should show login page
- [ ] Click "Sign in with Google" - should redirect to Google
- [ ] After Google sign-in - should redirect back to admin dashboard
- [ ] Check browser console for any errors
- [ ] Test `/api/auth/debug` endpoint for debugging info

### Admin Access Testing
- [ ] Sign in with admin email - should have admin access
- [ ] Sign in with non-admin email - should be denied access
- [ ] Test admin navigation - all links should work
- [ ] Test sign out functionality
```

### Phase 5: Production Deployment (15 minutes)

#### 5.1 Production Environment Variables
**File**: `.env.production` (for deployment)
```env
# Production NextAuth Configuration
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret-key

# Google OAuth (same credentials, different redirect URIs)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Admin Configuration
ADMIN_EMAILS=ljkeoni@gmail.com

# Add production redirect URI to Google Cloud Console:
# https://your-domain.com/api/auth/callback/google
```

#### 5.2 Vercel Deployment Configuration
**File**: `vercel.json` (Update existing)
```json
{
  "env": {
    "NEXTAUTH_URL": "@nextauth_url",
    "NEXTAUTH_SECRET": "@nextauth_secret",
    "GOOGLE_CLIENT_ID": "@google_client_id",
    "GOOGLE_CLIENT_SECRET": "@google_client_secret",
    "ADMIN_EMAILS": "@admin_emails"
  }
}
```

## Implementation Timeline

### Immediate (30 minutes)
1. Create `.env.local` file with all environment variables
2. Verify Google OAuth credentials in Google Cloud Console
3. Test basic authentication flow

### Short Term (1 hour)
1. Create enhanced admin login page
2. Implement authentication hook
3. Update AdminLayout component
4. Add error handling and debugging

### Medium Term (30 minutes)
1. Create test scripts
2. Manual testing and validation
3. Fix any issues found during testing

### Long Term (15 minutes)
1. Production environment setup
2. Deploy and test in production
3. Monitor for any issues

## Troubleshooting Guide

### Common Issues

#### 1. "Invalid Client" Error
**Cause**: Google OAuth credentials are invalid or expired
**Solution**: 
- Check Google Cloud Console for active credentials
- Verify client ID and secret match
- Ensure redirect URIs are correct

#### 2. "NEXTAUTH_SECRET is undefined"
**Cause**: Missing environment variable
**Solution**: Add `NEXTAUTH_SECRET` to `.env.local`

#### 3. "Callback URL mismatch"
**Cause**: Redirect URI doesn't match Google OAuth settings
**Solution**: Add correct redirect URI to Google Cloud Console

#### 4. "Admin access denied"
**Cause**: Email not in `ADMIN_EMAILS` list
**Solution**: Add email to `ADMIN_EMAILS` environment variable

#### 5. "Session not persisting"
**Cause**: Cookie issues or domain mismatch
**Solution**: Check `NEXTAUTH_URL` matches your domain

### Debug Commands
```bash
# Test environment variables
node -e "console.log('NEXTAUTH_SECRET:', !!process.env.NEXTAUTH_SECRET)"
node -e "console.log('GOOGLE_CLIENT_ID:', !!process.env.GOOGLE_CLIENT_ID)"

# Test auth endpoint
curl http://localhost:3000/api/auth/debug

# Run test script
node scripts/test-auth.js
```

## Success Criteria

- [ ] Admin can sign in with Google account
- [ ] Admin access is properly restricted to authorized emails
- [ ] Admin dashboard loads correctly after authentication
- [ ] Sign out functionality works properly
- [ ] Error handling provides clear feedback
- [ ] Production deployment works without issues
- [ ] All admin pages are accessible to authorized users
- [ ] Non-admin users are properly denied access

## Next Steps After Implementation

1. **User Management**: Add ability to manage admin users through admin panel
2. **Role-Based Access**: Implement different admin roles (super admin, content admin, etc.)
3. **Audit Logging**: Track admin actions for security
4. **Two-Factor Authentication**: Add 2FA for additional security
5. **Session Management**: Implement session timeout and refresh policies

## References

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth 2.0 Setup](https://developers.google.com/identity/protocols/oauth2)
- [NextAuth.js Google Provider](https://next-auth.js.org/providers/google)
- [Environment Variables in Next.js](https://nextjs.org/docs/basic-features/environment-variables)
