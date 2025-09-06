import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../lib/supabaseAdmin';

// Available beat cover art images
const BEAT_COVER_IMAGES = [
  '/assets/beatCovers/beat_cover_1.png',
  '/assets/beatCovers/beat_cover_2.png',
  '/assets/beatCovers/beat_cover_3.png',
  '/assets/beatCovers/beat_cover_4.png'
];

// Get random cover art image
const getRandomCoverArt = () => {
  const randomIndex = Math.floor(Math.random() * BEAT_COVER_IMAGES.length);
  return BEAT_COVER_IMAGES[randomIndex];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('beats')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    const beats = (data || []).map((b: {
      id: string;
      title: string;
      artist: string;
      genre: string;
      bpm: number;
      license_types?: Record<string, number>;
      cover_art?: string;
      audio_url?: string;
      preview_url?: string;
      full_track_url?: string;
      duration?: string;
      preview_duration?: string;
      description?: string;
    }) => ({
      id: b.id,
      title: b.title,
      artist: b.artist,
      genre: b.genre,
      bpm: b.bpm,
      // Derive a base price from mp3 license if present, else 0
      price: typeof b.license_types?.mp3 === 'number' ? b.license_types.mp3 : 0,
      coverArt: b.cover_art || getRandomCoverArt(),
      audioUrl: b.audio_url || '',
      previewUrl: b.preview_url || '',
      fullTrackUrl: b.full_track_url || '',
      duration: b.duration || '',
      previewDuration: b.preview_duration || '',
      description: b.description || '',
      licenseTypes: b.license_types || { mp3: 0, wav: 0, premium: 0, exclusive: 0 },
    }));

    return res.status(200).json(beats);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return res.status(500).json({ error: msg });
  }
}
