import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';

type BeatRow = {
  id: string;
  title: string;
  artist: string;
  genre: string;
  bpm: number;
  cover_art?: string;
  audio_url?: string;
  preview_url?: string;
  full_track_url?: string;
  duration?: string;
  preview_duration?: string;
  description?: string;
  license_types?: Record<string, number>;
  status?: string;
};

const ensureAdmin = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  const isAdmin = Boolean((session?.user as { isAdmin?: boolean })?.isAdmin === true);
  if (!isAdmin) {
    res.status(403).json({ error: 'Forbidden' });
    return false;
  }
  return true;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!(await ensureAdmin(req, res))) return;

  try {
    console.log(`[BEATS API] ${req.method} request received`);
    console.log(`[BEATS API] Request body:`, JSON.stringify(req.body, null, 2));

    if (req.method === 'POST') {
      const body = (req.body || {}) as {
        id?: string;
        title?: string;
        artist?: string;
        genre?: string;
        bpm?: number;
        price?: number;
        cover_art?: string; coverArt?: string;
        audio_url?: string; audioUrl?: string;
        preview_url?: string; previewUrl?: string;
        full_track_url?: string; fullTrackUrl?: string;
        duration?: string;
        preview_duration?: string; previewDuration?: string;
        description?: string;
        license_types?: Record<string, number>; licenseTypes?: Record<string, number>;
        status?: string;
      };
      const id = body.id || `beat_${Date.now()}`;
      const price = typeof body.price === 'number' ? body.price : 29;
      const licenseTypes = body.license_types || body.licenseTypes || { mp3: price, wav: price, premium: price, exclusive: price };

      // Minimal working row - only include columns that definitely exist
      const row = {
        id,
        title: body.title || '',
        artist: body.artist || '',
        genre: body.genre || 'Hip-Hop',
        bpm: body.bpm || 140,
        price: licenseTypes.mp3 || price, // Use mp3 price as main price
        cover_art: body.cover_art || body.coverArt || '',
        audio_url: body.audio_url || body.audioUrl || '',
        // Re-enable URL fields and other columns
        preview_url: body.preview_url || body.previewUrl || '',
        full_track_url: body.full_track_url || body.fullTrackUrl || '',
        duration: body.duration || '3:00',
        preview_duration: body.preview_duration || body.previewDuration || '0:30',
        description: body.description || '',
        license_types: licenseTypes,
        status: body.status || 'published',
      } as const;

      console.log(`[BEATS API] Upserting row:`, row);
      const { data, error } = await supabaseAdmin
        .from('beats')
        .upsert(row)
        .select('*')
        .single();

      if (error) {
        console.error(`[BEATS API] Database error:`, error);
        return res.status(500).json({ error: error.message });
      }

      console.log(`[BEATS API] Database response:`, data);
      const beat = data || row;
      console.log(`[BEATS API] Returning beat data:`, beat);

      return res.status(200).json({ beat: {
        id: beat.id,
        title: beat.title,
        artist: beat.artist,
        genre: beat.genre,
        bpm: beat.bpm,
        price: beat.price || price,
        cover_art: beat.cover_art,
        audio_url: beat.audio_url,
        // Re-enable URL fields in response
        preview_url: beat.preview_url,
        full_track_url: beat.full_track_url,
        duration: beat.duration,
        preview_duration: beat.preview_duration,
        description: beat.description,
        license_types: licenseTypes, // Return the license types from input
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
        price: body.price, // Update main price
        cover_art: body.cover_art || body.coverArt,
        audio_url: body.audio_url || body.audioUrl,
        // Re-enable URL fields
        preview_url: body.preview_url || body.previewUrl,
        full_track_url: body.full_track_url || body.fullTrackUrl,
        duration: body.duration,
        preview_duration: body.preview_duration || body.previewDuration,
        description: body.description,
        license_types: body.license_types || body.licenseTypes,
        status: body.status,
      } as Record<string, unknown>;

      console.log(`[BEATS API] Updating beat ${id} with:`, updates);
      const { data, error } = await supabaseAdmin
        .from('beats')
        .update(updates)
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        console.error(`[BEATS API] Update error:`, error);
        return res.status(500).json({ error: error.message });
      }

      console.log(`[BEATS API] Update successful:`, data);
      const beat = data as BeatRow | null;
      return res.status(200).json({ beat: beat ? {
        id: beat.id,
        title: beat.title,
        artist: beat.artist,
        genre: beat.genre,
        bpm: beat.bpm,
        price: beat.price || 0,
        cover_art: beat.cover_art,
        audio_url: beat.audio_url,
        // Re-enable URL fields in PUT response
        preview_url: beat.preview_url,
        full_track_url: beat.full_track_url,
        duration: beat.duration,
        preview_duration: beat.preview_duration,
        description: beat.description,
        license_types: { mp3: beat.price || 0, wav: 0, premium: 0, exclusive: 0 }, // Mock license types
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

