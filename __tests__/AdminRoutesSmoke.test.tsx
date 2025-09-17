import React from 'react';
import { render, screen } from '@testing-library/react';

// Provide a stable auth context for pages/components that call useSession
jest.mock('next-auth/react', () => ({
  __esModule: true,
  useSession: () => ({ data: { user: { email: 'jmaconny@ybfstudio.com', isAdmin: true } }, status: 'authenticated' }),
  SessionProvider: ({ children }: any) => <>{children}</>,
}));

// Mock auth/server modules to avoid ESM issues during import of pages
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(),
}));

// Mock supabase admin client used in getServerSideProps so import doesn't initialize real client
jest.mock('../lib/supabaseAdmin', () => ({
  supabaseAdmin: { from: jest.fn() },
}));

// Mock Next.js components used in pages
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: any) => <a href={href}>{children}</a>,
}));

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() }),
}));

// Smoke test admin list/detail pages
import ServiceRequestsPage from '../pages/admin/service-requests';
import ServiceRequestDetailPage from '../pages/admin/service-requests/[id]';

// Mock NextAuth default export used by authOptions import chain
jest.mock('next-auth', () => ({
  __esModule: true,
  default: jest.fn(() => (req: any, res: any) => res),
}));

describe('Admin UI routes smoke tests', () => {
  test('renders Service Requests list page without crashing', () => {
    render(
      <ServiceRequestsPage
        initialData={[]}
        page={1}
        totalPages={1}
        q=""
        status=""
        payment=""
      />
    );
    expect(screen.getByRole('heading', { name: /Service Requests/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Export CSV/i })).toBeInTheDocument();
  });

  test('renders Service Request detail page without crashing', () => {
    render(
      <ServiceRequestDetailPage
        request={{
          id: 'req-123',
          customer_name: 'John Doe',
          customer_email: 'john@example.com',
          status: 'pending',
          payment_status: 'pending',
          price_paid: 0,
          created_at: '2025-01-01T00:00:00.000Z',
          updated_at: '2025-01-01T00:00:00.000Z',
          services: { name: 'Stereo Mix' },
        } as any}
      />
    );
    expect(screen.getByRole('heading', { name: /Service Request/i })).toBeInTheDocument();
    expect(screen.getByText(/ID: req-123/i)).toBeInTheDocument();
  });

  test('handles error states gracefully', () => {
    // Test that components render without crashing even with empty data
    render(
      <ServiceRequestsPage
        initialData={[]}
        page={1}
        totalPages={1}
        q=""
        status=""
        payment=""
      />
    );
    expect(screen.getByRole('heading', { name: /Service Requests/i })).toBeInTheDocument();
  });
});


