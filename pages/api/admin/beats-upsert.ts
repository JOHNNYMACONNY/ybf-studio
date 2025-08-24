import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const session = await getServerSession(req, res, authOptions);
  const isAdmin = (session?.user as any)?.isAdmin === true;
  if (!isAdmin) return res.status(403).json({ error: 'Forbidden' });

  try {
    const beat = req.body;
    if (!beat?.id || !beat?.title || !beat?.artist) {
      return res.status(400).json({ error: 'Missing required fields (id, title, artist)' });
    }
    // Merge external_downloads with existing to avoid overwriting other licenses
    if (beat.external_downloads) {
      const { data: existingRows, error: fetchErr } = await supabaseAdmin
        .from('beats')
        .select('external_downloads')
        .eq('id', beat.id)
        .limit(1);
      if (fetchErr) return res.status(500).json({ error: fetchErr.message });
      const existing = existingRows && existingRows[0]?.external_downloads ? existingRows[0].external_downloads : {};
      beat.external_downloads = { ...(existing || {}), ...(beat.external_downloads || {}) };
    }

    const { error } = await supabaseAdmin.from('beats').upsert(beat, { onConflict: 'id' });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return res.status(500).json({ error: msg });
  }
}


