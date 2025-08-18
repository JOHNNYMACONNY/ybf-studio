jest.mock('next-auth/next', () => ({ getServerSession: jest.fn() }));
jest.mock('next-auth', () => ({ __esModule: true, default: jest.fn(() => (req: any, res: any) => res) }));

// Mock Supabase admin for request lookup
jest.mock('../lib/supabaseAdmin', () => {
  const from = jest.fn((table: string) => {
    if (table === 'service_requests') {
      return {
        select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: { id: 'req-1', customer_email: 'a@ex.com', service_id: 'svc-1', payment_status: 'pending', services: { name: 'Stereo Master', price: 50 } }, error: null }) }) }),
      } as any;
    }
    return {} as any;
  });
  return { supabaseAdmin: { from } };
});

// Mock Stripe
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    checkout: {
      sessions: {
        create: jest.fn(async () => ({ id: 'cs_test_123' })),
      },
    },
    webhooks: { constructEvent: jest.fn() },
  }));
});

import handler from '../pages/api/service-checkout';

function mockReqRes(method: string, body: any = {}) {
  const req: any = { method, body, headers: {} };
  const chunks: any[] = [];
  const res: any = {
    statusCode: 200,
    headers: {} as Record<string, string>,
    setHeader(key: string, val: string) { this.headers[key] = val; },
    status(code: number) { this.statusCode = code; return this; },
    json(payload: any) { chunks.push(payload); return this; },
    get body() { return chunks[0]; },
  };
  return { req, res };
}

describe('API /api/service-checkout', () => {
  test('creates a checkout session for pending request', async () => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_123';
    const { req, res } = mockReqRes('POST', { requestId: 'req-1' });
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body?.success).toBe(true);
    expect(res.body?.sessionId).toBe('cs_test_123');
  });
});


