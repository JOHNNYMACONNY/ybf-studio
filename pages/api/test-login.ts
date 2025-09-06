import type { NextApiRequest, NextApiResponse } from 'next';
// import { getServerSession } from 'next-auth';
// import { authOptions } from './auth/[...nextauth]';
import { encode } from 'next-auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.E2E_TEST_MODE !== 'true') {
    return res.status(404).json({ error: 'Not found' });
  }

  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  try {
    const { email } = (req.body || {}) as { email?: string };
    if (!email) return res.status(400).json({ error: 'Missing email' });

    const token = await encode({
      token: { email, isAdmin: true } as { email: string; isAdmin: boolean },
      secret: process.env.NEXTAUTH_SECRET!,
      maxAge: 60 * 60,
    });

    const cookies: string[] = [];
    cookies.push(`next-auth.session-token=${token}; Path=/; HttpOnly; SameSite=Lax`);
    cookies.push(`__Secure-next-auth.session-token=${token}; Path=/; HttpOnly; SameSite=Lax; Secure`);
    res.setHeader('Set-Cookie', cookies);

    return res.status(200).json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return res.status(500).json({ error: msg });
  }
}


