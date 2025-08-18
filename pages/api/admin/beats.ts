import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

type UserWithAdmin = {
  email?: string;
  isAdmin?: boolean;
  [key: string]: unknown;
};

// Helper function to check admin access
const checkAdminAccess = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  const user = session?.user as UserWithAdmin | undefined;

  if (!session || !user?.isAdmin) {
    res.status(403).json({ error: 'Forbidden: Admin access required' });
    return false;
  }
  return true;
};

// Main API handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check admin access for all operations
  if (!(await checkAdminAccess(req, res))) {
    return;
  }

  try {
    switch (req.method) {
      case 'GET':
        await handleGetBeats(req, res);
        break;
      case 'POST':
        await handleCreateBeat(req, res);
        break;
      case 'PUT':
        await handleUpdateBeat(req, res);
        break;
      case 'DELETE':
        await handleDeleteBeat(req, res);
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Admin beats API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// GET - Fetch all beats with pagination
async function handleGetBeats(req: NextApiRequest, res: NextApiResponse) {
  const { page = 1, limit = 20, search, genre } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  try {
    let query = supabase
      .from('beats')
      .select('*', { count: 'exact' })
      .eq('deleted_at', null) // Soft delete filter
      .order('created_at', { ascending: false });

    // Apply search filter
    if (search && typeof search === 'string') {
      query = query.or(`title.ilike.%${search}%,artist.ilike.%${search}%`);
    }

    // Apply genre filter
    if (genre && typeof genre === 'string' && genre !== 'All') {
      query = query.eq('genre', genre);
    }

    // Apply pagination
    query = query.range(offset, offset + Number(limit) - 1);

    const { data: beats, error, count } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(200).json({
      beats: beats || [],
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count || 0,
        totalPages: Math.ceil((count || 0) / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get beats error:', error);
    res.status(500).json({ error: 'Failed to fetch beats' });
  }
}

// POST - Create new beat
async function handleCreateBeat(req: NextApiRequest, res: NextApiResponse) {
  const {
    title,
    artist,
    genre,
    bpm,
    price,
    description,
    previewUrl,
    fullTrackUrl,
    coverArt,
    duration,
    previewDuration,
    licenseTypes
  } = req.body;

  // Validate required fields
  if (!title || !artist || !genre || !bpm || !price) {
    return res.status(400).json({
      error: 'Missing required fields: title, artist, genre, bpm, price'
    });
  }

  // Validate data types
  if (typeof bpm !== 'number' || bpm < 60 || bpm > 200) {
    return res.status(400).json({
      error: 'BPM must be a number between 60 and 200'
    });
  }

  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({
      error: 'Price must be a positive number'
    });
  }

  try {
    const { data: beat, error } = await supabase
      .from('beats')
      .insert({
        title: title.trim(),
        artist: artist.trim(),
        genre,
        bpm,
        price,
        description: description?.trim() || null,
        preview_url: previewUrl?.trim() || null,
        full_track_url: fullTrackUrl?.trim() || null,
        cover_art: coverArt || '/images/default-cover.jpg',
        duration: duration || '3:00',
        preview_duration: previewDuration || '0:30',
        license_types: licenseTypes || {
          mp3: price,
          wav: price * 1.5,
          exclusive: price * 10
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Failed to create beat' });
    }

    res.status(201).json({ beat });
  } catch (error) {
    console.error('Create beat error:', error);
    res.status(500).json({ error: 'Failed to create beat' });
  }
}

// PUT - Update existing beat
async function handleUpdateBeat(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const {
    title,
    artist,
    genre,
    bpm,
    price,
    description,
    previewUrl,
    fullTrackUrl,
    coverArt,
    duration,
    previewDuration,
    licenseTypes
  } = req.body;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Beat ID is required' });
  }

  // Validate required fields
  if (!title || !artist || !genre || !bpm || !price) {
    return res.status(400).json({
      error: 'Missing required fields: title, artist, genre, bpm, price'
    });
  }

  try {
    const { data: beat, error } = await supabase
      .from('beats')
      .update({
        title: title.trim(),
        artist: artist.trim(),
        genre,
        bpm,
        price,
        description: description?.trim() || null,
        preview_url: previewUrl?.trim() || null,
        full_track_url: fullTrackUrl?.trim() || null,
        cover_art: coverArt || '/images/default-cover.jpg',
        duration: duration || '3:00',
        preview_duration: previewDuration || '0:30',
        license_types: licenseTypes || {
          mp3: price,
          wav: price * 1.5,
          exclusive: price * 10
        },
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('deleted_at', null) // Ensure not soft deleted
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return res.status(500).json({ error: 'Failed to update beat' });
    }

    if (!beat) {
      return res.status(404).json({ error: 'Beat not found' });
    }

    res.status(200).json({ beat });
  } catch (error) {
    console.error('Update beat error:', error);
    res.status(500).json({ error: 'Failed to update beat' });
  }
}

// DELETE - Soft delete beat
async function handleDeleteBeat(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Beat ID is required' });
  }

  try {
    const { data: beat, error } = await supabase
      .from('beats')
      .update({
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('deleted_at', null) // Ensure not already deleted
      .select()
      .single();

    if (error) {
      console.error('Supabase delete error:', error);
      return res.status(500).json({ error: 'Failed to delete beat' });
    }

    if (!beat) {
      return res.status(404).json({ error: 'Beat not found' });
    }

    res.status(200).json({ message: 'Beat deleted successfully' });
  } catch (error) {
    console.error('Delete beat error:', error);
    res.status(500).json({ error: 'Failed to delete beat' });
  }
}
