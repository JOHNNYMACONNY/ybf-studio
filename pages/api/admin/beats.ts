import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';

const ensureAdmin = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  const isAdmin = (session?.user as any)?.isAdmin === true;
  if (!isAdmin) {
    res.status(403).json({ error: 'Forbidden' });
    return false;
  }
  return true;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!(await ensureAdmin(req, res))) return;

  try {
    if (req.method === 'POST') {
      const body = req.body || {};
      const id = body.id || `beat_${Date.now()}`;
      const price = typeof body.price === 'number' ? body.price : 29;
      const licenseTypes = body.license_types || body.licenseTypes || { mp3: price, wav: price, premium: price, exclusive: price };

      // Use camelCase columns per current schema (see migration 2025-08-23_create_beats_table.sql)
      const row = {
        id,
        title: body.title || '',
        artist: body.artist || '',
        genre: body.genre || 'Hip-Hop',
        bpm: body.bpm || 140,
        coverArt: body.cover_art || body.coverArt || '',
        audioUrl: body.audio_url || body.audioUrl || '',
        previewUrl: body.preview_url || body.previewUrl || '',
        fullTrackUrl: body.full_track_url || body.fullTrackUrl || '',
        duration: body.duration || '3:00',
        previewDuration: body.preview_duration || body.previewDuration || '0:30',
        description: body.description || '',
        licenseTypes: licenseTypes,
        status: body.status || 'published',
      } as any;

      const { data, error } = await supabaseAdmin
        .from('beats')
        .upsert(row)
        .select('*')
        .single();
      if (error) return res.status(500).json({ error: error.message });
      const beat = data || row;
      return res.status(200).json({ beat: {
        id: beat.id,
        title: beat.title,
        artist: beat.artist,
        genre: beat.genre,
        bpm: beat.bpm,
        price,
        cover_art: beat.coverArt || beat.cover_art,
        audio_url: beat.audioUrl || beat.audio_url,
        preview_url: beat.previewUrl || beat.preview_url,
        full_track_url: beat.fullTrackUrl || beat.full_track_url,
        duration: beat.duration,
        preview_duration: beat.previewDuration || beat.preview_duration,
        description: beat.description,
        license_types: beat.licenseTypes || beat.license_types,
      }});
    }

    if (req.method === 'PUT') {
      const id = (req.query.id as string) || req.body?.id;
      if (!id) return res.status(400).json({ error: 'Missing id' });
      const body = req.body || {};
      const updates = {
        title: body.title,
        artist: body.artist,
        genre: body.genre,
        bpm: body.bpm,
        coverArt: body.cover_art || body.coverArt,
        audioUrl: body.audio_url || body.audioUrl,
        previewUrl: body.preview_url || body.previewUrl,
        fullTrackUrl: body.full_track_url || body.fullTrackUrl,
        duration: body.duration,
        previewDuration: body.preview_duration || body.previewDuration,
        description: body.description,
        licenseTypes: body.license_types || body.licenseTypes,
        status: body.status,
      } as any;
      const { data, error } = await supabaseAdmin
        .from('beats')
        .update(updates)
        .eq('id', id)
        .select('*')
        .single();
      if (error) return res.status(500).json({ error: error.message });
      const beat = data;
      return res.status(200).json({ beat: beat ? {
        id: beat.id,
        title: beat.title,
        artist: beat.artist,
        genre: beat.genre,
        bpm: beat.bpm,
        price: updates.price ?? 0,
        cover_art: beat.coverArt,
        audio_url: beat.audioUrl,
        preview_url: beat.previewUrl,
        full_track_url: beat.fullTrackUrl,
        duration: beat.duration,
        preview_duration: beat.previewDuration,
        description: beat.description,
        license_types: beat.licenseTypes,
      } : null });
    }

    if (req.method === 'DELETE') {
      const id = req.query.id as string;
      if (!id) return res.status(400).json({ error: 'Missing id' });
      const { error } = await supabaseAdmin.from('beats').delete().eq('id', id);
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', 'POST,PUT,DELETE');
    return res.status(405).end('Method Not Allowed');
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return res.status(500).json({ error: msg });
  }
}

