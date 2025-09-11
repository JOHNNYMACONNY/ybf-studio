# 🛠️ YBF Studio Developer Guide

## 📋 **Table of Contents**

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Getting Started](#getting-started)
4. [Project Structure](#project-structure)
5. [Development Workflow](#development-workflow)
6. [Component Architecture](#component-architecture)
7. [Styling System](#styling-system)
8. [State Management](#state-management)
9. [API Integration](#api-integration)
10. [Testing](#testing)
11. [Deployment](#deployment)
12. [Performance Optimization](#performance-optimization)
13. [Security](#security)
14. [Troubleshooting](#troubleshooting)

---

## 🎯 **Project Overview**

YBF Studio is a comprehensive audio production platform built with Next.js, featuring professional audio services, beat store, and content management capabilities.

### **Key Features**
- **Professional Audio Services**: Beat production, vocal recording, mixing & mastering
- **Beat Store**: Licensed beat library with secure purchasing
- **Admin Dashboard**: Content management and analytics
- **User Authentication**: Secure user accounts and profiles
- **Payment Processing**: Stripe integration for secure transactions
- **Responsive Design**: Mobile-first approach with premium UX

---

## 🛠️ **Technology Stack**

### **Frontend**
- **Next.js 15.4.5**: React framework with SSR/SSG
- **React 18**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Tailwind CSS v4**: Utility-first CSS framework
- **Framer Motion**: Animation library

### **Backend & Services**
- **Next.js API Routes**: Serverless API endpoints
- **Supabase**: Database and authentication
- **Stripe**: Payment processing
- **NextAuth.js**: Authentication provider
- **SendGrid**: Email services

### **Development Tools**
- **ESLint**: Code linting and formatting
- **TypeScript**: Static type checking
- **Playwright**: End-to-end testing
- **Lighthouse**: Performance auditing
- **Bundle Analyzer**: Bundle size optimization

---

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Git
- Supabase account
- Stripe account (for payments)

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/your-org/audioserviceapp.git
cd audioserviceapp
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment setup**
```bash
cp .env.local.example .env.local
```

4. **Configure environment variables**
```env
# Database
DATABASE_URL=your-supabase-database-url
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Authentication
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# Payments
STRIPE_SECRET_KEY=your-stripe-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

# Email
SENDGRID_API_KEY=your-sendgrid-api-key
```

5. **Start development server**
```bash
npm run dev
```

6. **Open your browser**
Navigate to `http://localhost:3000`

---

## 📁 **Project Structure**

```
YBF Studio/
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── admin/           # Admin-specific components
│   ├── audio/           # Audio-related components
│   ├── beats/           # Beat store components
│   ├── blog/            # Blog components
│   ├── hooks/           # Custom React hooks
│   ├── layout/          # Layout components
│   ├── navigation/      # Navigation components
│   ├── portfolio/       # Portfolio components
│   ├── services/        # Service components
│   ├── shared/          # Shared components
│   ├── testimonials/    # Testimonial components
│   └── testing/         # Testing components
├── docs/                # Documentation
├── lib/                 # Utility libraries
├── pages/               # Next.js pages
│   ├── api/             # API routes
│   ├── admin/           # Admin pages
│   └── [slug].tsx       # Dynamic pages
├── public/              # Static assets
│   ├── assets/          # Images and media
│   └── audio/           # Audio files
├── scripts/             # Build and deployment scripts
├── styles/              # Global styles
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── next.config.js       # Next.js configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── package.json         # Dependencies and scripts
```

---

## 🔄 **Development Workflow**

### **Branch Strategy**
- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: Feature development
- `hotfix/*`: Critical bug fixes

### **Commit Convention**
```
type(scope): description

feat: new feature
fix: bug fix
docs: documentation
style: formatting
refactor: code refactoring
test: testing
chore: maintenance
```

### **Development Commands**
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Run tests
npm run test:all

# Run specific tests
npm run test:performance
npm run test:accessibility
npm run test:browser
npm run test:mobile
```

---

## 🧩 **Component Architecture**

### **Component Hierarchy**
```
Layout/
├── Header/
├── Navigation/
├── Main Content/
│   ├── Page Components/
│   ├── Feature Components/
│   └── UI Components/
└── Footer/
```

### **Component Patterns**

#### **UI Components**
```typescript
// components/ui/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false
}) => {
  // Component implementation
};
```

#### **Page Components**
```typescript
// pages/index.tsx
import { NextPage } from 'next';
import { Layout } from '../components/layout/Layout';
import { HeroSection } from '../components/ui/HeroSection';

const HomePage: NextPage = () => {
  return (
    <Layout>
      <HeroSection />
      {/* Other page content */}
    </Layout>
  );
};

export default HomePage;
```

---

## 🎨 **Styling System**

### **Tailwind CSS Configuration**
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Mathematical harmony color palette
        teal: {
          400: '#14b8a6',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
        },
        blue: {
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        }
      },
      backgroundImage: {
        'gradient-premium': 'linear-gradient(135deg, #14b8a6 0%, #3b82f6 100%)',
        'gradient-warm': 'linear-gradient(135deg, #f59e0b 0%, #14b8a6 100%)',
        'gradient-cool': 'linear-gradient(135deg, #14b8a6 0%, #3b82f6 100%)',
      }
    }
  },
  plugins: []
};
```

### **CSS Custom Properties**
```css
/* styles/globals.css */
:root {
  --color-primary: #14b8a6;
  --color-secondary: #3b82f6;
  --color-accent: #f59e0b;
  --color-background: #0f172a;
  --color-surface: #1e293b;
  --color-text: #f8fafc;
}

/* Dark mode variables */
[data-theme="dark"] {
  --color-background: #0f172a;
  --color-surface: #1e293b;
  --color-text: #f8fafc;
}
```

---

## 🔄 **State Management**

### **React Hooks**
```typescript
// Custom hooks for state management
import { useState, useEffect } from 'react';

// useLocalStorage hook
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
};
```

### **Context API**
```typescript
// Context for global state
import { createContext, useContext, useReducer } from 'react';

interface AppState {
  theme: 'light' | 'dark' | 'auto';
  user: User | null;
  cart: CartItem[];
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
```

---

## 🔌 **API Integration**

### **API Routes**
```typescript
// pages/api/beats.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('beats')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch beats' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
```

### **Supabase Integration**
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Beat {
  id: string;
  title: string;
  genre: string;
  price: number;
  audio_url: string;
  cover_url: string;
  created_at: string;
}
```

---

## 🧪 **Testing**

### **Testing Strategy**
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API and database integration
- **E2E Tests**: User workflow testing
- **Performance Tests**: Lighthouse and Web Vitals
- **Accessibility Tests**: WCAG compliance

### **Test Commands**
```bash
# Run all tests
npm run test:all

# Run specific test suites
npm run test:performance
npm run test:accessibility
npm run test:browser
npm run test:mobile

# Run production testing suite
npm run test:production
```

### **Testing Utilities**
```typescript
// utils/testing.ts
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../components/context/ThemeContext';

export const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {ui}
    </ThemeProvider>
  );
};

export const mockSupabase = {
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      order: jest.fn(() => Promise.resolve({ data: [], error: null }))
    }))
  }))
};
```

---

## 🚀 **Deployment**

### **Vercel Deployment**
1. **Connect repository** to Vercel
2. **Configure environment variables**
3. **Set build settings**
4. **Deploy automatically** on push to main

### **Environment Configuration**
```bash
# Production environment variables
NEXT_PUBLIC_APP_URL=https://your-domain.com
DATABASE_URL=your-production-database-url
STRIPE_SECRET_KEY=your-stripe-secret-key
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://your-domain.com
```

### **Build Optimization**
```javascript
// next.config.js
module.exports = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@heroicons/react', 'framer-motion'],
  },
  images: {
    domains: ['your-domain.com'],
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
};
```

---

## ⚡ **Performance Optimization**

### **Code Splitting**
```typescript
// Dynamic imports for code splitting
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});
```

### **Image Optimization**
```typescript
// Next.js Image component
import Image from 'next/image';

<Image
  src="/path/to/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority={true}
  placeholder="blur"
/>
```

### **Bundle Analysis**
```bash
# Analyze bundle size
npm run analyze

# Check Web Vitals
npm run test:web-vitals
```

---

## 🔒 **Security**

### **Security Headers**
```javascript
// next.config.js
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
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
      ],
    },
  ];
}
```

### **Authentication**
```typescript
// NextAuth configuration
import NextAuth from 'next-auth';
import { SupabaseAdapter } from '@next-auth/supabase-adapter';

export default NextAuth({
  providers: [
    // Configure providers
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  callbacks: {
    session: async ({ session, token }) => {
      // Custom session handling
      return session;
    },
  },
});
```

---

## 🐛 **Troubleshooting**

### **Common Issues**

#### **Build Errors**
```bash
# Clear Next.js cache
rm -rf .next
npm run build

# Check TypeScript errors
npx tsc --noEmit --skipLibCheck
```

#### **Development Server Issues**
```bash
# Kill existing processes
pkill -f "next dev"

# Restart with clean cache
npm run dev:clean
```

#### **Database Connection Issues**
```bash
# Check environment variables
echo $DATABASE_URL

# Test Supabase connection
npx supabase status
```

### **Debug Mode**
```bash
# Enable debug logging
DEBUG=* npm run dev

# Check bundle size
npm run analyze
```

---

## 📚 **Additional Resources**

### **Documentation**
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### **Tools & Services**
- [Supabase Dashboard](https://app.supabase.com)
- [Stripe Dashboard](https://dashboard.stripe.com)
- [Vercel Dashboard](https://vercel.com/dashboard)

### **Community**
- [GitHub Issues](https://github.com/your-org/audioserviceapp/issues)
- [Discord Community](https://discord.gg/your-community)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/audioserviceapp)

---

## 🤝 **Contributing**

### **Development Guidelines**
1. **Follow the coding standards** defined in ESLint
2. **Write tests** for new features
3. **Update documentation** for API changes
4. **Use conventional commits** for commit messages
5. **Create feature branches** for new development

### **Code Review Process**
1. **Create pull request** with detailed description
2. **Ensure all tests pass**
3. **Request review** from team members
4. **Address feedback** and make necessary changes
5. **Merge after approval**

---

*Last updated: December 2024*  
*Version: 1.0* 