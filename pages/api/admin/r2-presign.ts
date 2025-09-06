import type { NextApiRequest, NextApiResponse } from 'next';
import { createR2SignedPutUrl, isR2Configured } from '../../../lib/r2';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const session = await getServerSession(req, res, authOptions);
  const isAdmin = Boolean((session?.user as { isAdmin?: boolean })?.isAdmin === true);
  if (!isAdmin) return res.status(403).json({ error: 'Forbidden' });

  if (!isR2Configured()) return res.status(400).json({ error: 'R2 not configured' });

  try {
    const { key, contentType } = req.body || {};
    if (!key) return res.status(400).json({ error: 'Missing key' });
    const url = await createR2SignedPutUrl(key, contentType);
    return res.status(200).json({ url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return res.status(500).json({ error: msg });
  }
}


