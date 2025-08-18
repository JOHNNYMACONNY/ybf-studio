// Mocks must be defined before importing the handler
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(),
}));

// Mock the NextAuth default export to avoid executing real handler init
jest.mock('next-auth', () => ({
  __esModule: true,
  default: jest.fn(() => {
    return function mockAuthHandler(req: any, res: any) {
      res.statusCode = 200;
      return res;
    };
  }),
}));

jest.mock('../utils/email', () => ({
  sendBookingConfirmationEmail: jest.fn(async () => ({ success: true })),
  sendBookingInternalEmail: jest.fn(async () => ({ success: true })),
}));

// Mock supabase admin client used by the API route
jest.mock('../lib/supabaseAdmin', () => {
  const insertMock = jest.fn();
  const makeChain = () => {
    const chain: any = {};
    chain.eq = jest.fn(() => chain);
    chain.is = jest.fn(() => chain);
    chain.maybeSingle = jest.fn(async () => ({ data: { id: '11111111-1111-4111-8111-111111111111' }, error: null }));
    chain.select = jest.fn(() => chain);
    chain.single = jest.fn(async () => ({ data: { id: 'req-1' }, error: null }));
    return chain;
  };

  const from = jest.fn((table: string) => {
    if (table === 'services') {
      return { select: () => makeChain() } as any;
    }
    if (table === 'service_requests') {
      return {
        insert: (rows: any[]) => {
          insertMock(rows);
          return {
            select: () => ({
              single: async () => ({ data: { id: 'req-1', ...rows[0] }, error: null }),
            }),
          } as any;
        },
      } as any;
    }
    return {} as any;
  });

  return { supabaseAdmin: { from } };
});

import handler from '../pages/api/service-requests';

function mockReqRes(method: string, body: any = {}, headers: Record<string, string> = {}) {
  const req: any = { method, body, headers, socket: { remoteAddress: '127.0.0.1' } };
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

describe('Public API /api/service-requests (booking)', () => {
  const { getServerSession } = require('next-auth/next');
  beforeEach(() => {
    jest.clearAllMocks();
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: 'user-1', email: 'u@example.com' } });
  });

  test('creates a booking with valid payload', async () => {
    const { req, res } = mockReqRes('POST', {
      service_id: '11111111-1111-4111-8111-111111111111',
      customer_name: 'Alice',
      customer_email: 'alice@example.com',
      project_name: 'My Track',
      project_description: 'Need mastering',
      special_instructions: 'Loud but clean',
      price_paid: 50,
    });

    await handler(req, res);
    expect(res.statusCode).toBe(201);
    expect(res.body?.message).toMatch(/created/i);
    expect(res.body?.request?.customer_email).toBe('alice@example.com');
  });

  test('rejects invalid email', async () => {
    const { req, res } = mockReqRes('POST', {
      service_id: '11111111-1111-4111-8111-111111111111',
      customer_name: 'Al',
      customer_email: 'not-an-email',
      price_paid: 10,
    });

    await handler(req, res);
    expect(res.statusCode).toBe(400);
    expect(String(res.body?.error || '')).toMatch(/valid email/i);
  });
});


