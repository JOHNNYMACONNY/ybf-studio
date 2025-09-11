// Mocks must be declared before importing the handler under test
jest.mock('next-auth/next', () => ({
	getServerSession: jest.fn(),
}));

jest.mock('next-auth', () => ({
	__esModule: true,
	default: jest.fn(() => {
		return function mockAuthHandler(req: any, res: any) {
			res.statusCode = 200;
			return res;
		};
	}),
}));

jest.mock('@sendgrid/mail', () => ({
	setApiKey: jest.fn(),
	send: jest.fn(async () => [{}]),
}));

jest.mock('@supabase/supabase-js', () => {
	const supabaseMock = {
		from: jest.fn((table: string) => {
			if (table === 'service_requests') {
				return {
					select: jest.fn(() => ({
						eq: () => ({
							maybeSingle: async () => ({ data: { id: 'req-1', customer_name: 'Alice', customer_email: 'alice@example.com', status: 'pending' }, error: null }),
						}),
					})),
					update: jest.fn((update: Record<string, unknown>) => ({
						eq: () => ({
							select: () => ({
								maybeSingle: async () => ({ data: { id: 'req-1', customer_name: 'Alice', customer_email: 'alice@example.com', status: update.status || 'pending', services: { name: 'Stereo Mix' } }, error: null }),
							}),
						}),
					})),
				};
			}
			return {} as any;
		}),
	} as any;
	return { createClient: jest.fn(() => supabaseMock) };
});

import handler from '../pages/api/admin/service-requests';

// Utilities to mock req/res
function mockReqRes(method: string, { query = {}, body = {}, headers = {} }: { query?: any; body?: any; headers?: any } = {}) {
	const req: any = { method, query, body, headers, socket: { remoteAddress: '127.0.0.1' } };
	const resBody: any[] = [];
	const res: any = {
		statusCode: 200,
		headers: {} as Record<string, string>,
		setHeader(key: string, val: string) { this.headers[key] = val; },
		status(code: number) { this.statusCode = code; return this; },
		json(payload: any) { resBody.push(payload); return this; },
		get body() { return resBody[0]; },
	};
	return { req, res };
}

describe('API /api/admin/service-requests', () => {
	const { getServerSession } = require('next-auth/next');

	beforeEach(() => {
		jest.clearAllMocks();
		process.env.ADMIN_EMAILS = 'jmaconny@ybfstudio.com';
		(getServerSession as jest.Mock).mockResolvedValue({ user: { email: 'jmaconny@ybfstudio.com' } });
	});

	test('GET returns request when authorized', async () => {
		const { req, res } = mockReqRes('GET', { query: { id: 'req-1' } });
		await handler(req, res);
		expect(res.statusCode).toBe(200);
		expect(res.body?.success).toBe(true);
		expect(res.body?.data?.id).toBe('req-1');
	});

	test('GET forbids non-admin', async () => {
		const { req, res } = mockReqRes('GET', { query: { id: 'req-1' } });
		(getServerSession as jest.Mock).mockResolvedValue({ user: { email: 'user@example.com' } });
		await handler(req, res);
		expect(res.statusCode).toBe(403);
		expect(res.body?.success).toBe(false);
	});

	test('PUT updates request and returns joined service name', async () => {
		const { req, res } = mockReqRes('PUT', { query: { id: 'req-1' }, body: { status: 'in_progress' } });
		await handler(req, res);
		expect(res.statusCode).toBe(200);
		expect(res.body?.success).toBe(true);
		expect(res.body?.data?.status).toBe('in_progress');
		expect(res.body?.data?.services?.name).toBe('Stereo Mix');
	});
});


