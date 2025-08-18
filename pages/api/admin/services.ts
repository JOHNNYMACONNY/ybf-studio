import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check authentication
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Check admin status
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
  if (!session.user.email || !adminEmails.includes(session.user.email)) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        return await handleGet(req, res);
      case 'POST':
        return await handlePost(req, res);
      case 'PUT':
        return await handlePut(req, res);
      case 'DELETE':
        return await handleDelete(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('Service API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// GET - Fetch all services with pagination and filters
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { page = 1, limit = 10, status, category, search } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  let query = supabase
    .from('services')
    .select('*', { count: 'exact' })
    .is('deleted_at', null)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  // Apply filters
  if (status) {
    query = query.eq('status', status);
  }
  if (category) {
    query = query.eq('category', category);
  }
  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  }

  // Apply pagination
  query = query.range(offset, offset + Number(limit) - 1);

  const { data: services, error, count } = await query;

  if (error) {
    console.error('Error fetching services:', error);
    return res.status(500).json({ error: 'Failed to fetch services' });
  }

  return res.status(200).json({
    services,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: count || 0,
      totalPages: Math.ceil((count || 0) / Number(limit))
    }
  });
}

// POST - Create new service
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const {
    name,
    slug,
    description,
    short_description,
    price,
    original_price,
    features,
    turnaround_time,
    category,
    status,
    featured_image,
    before_audio_url,
    after_audio_url,
    sort_order
  } = req.body;

  // Validate required fields
  if (!name || !slug || !price) {
    return res.status(400).json({ error: 'Name, slug, and price are required' });
  }

  // Check if slug already exists
  const { data: existingService } = await supabase
    .from('services')
    .select('id')
    .eq('slug', slug)
    .is('deleted_at', null)
    .single();

  if (existingService) {
    return res.status(400).json({ error: 'Service with this slug already exists' });
  }

  // Create service
  const { data: service, error } = await supabase
    .from('services')
    .insert({
      name,
      slug,
      description,
      short_description,
      price: Number(price),
      original_price: original_price ? Number(original_price) : null,
      features: features || [],
      turnaround_time,
      category: category || 'mixing',
      status: status || 'active',
      featured_image,
      before_audio_url,
      after_audio_url,
      sort_order: sort_order || 0
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating service:', error);
    return res.status(500).json({ error: 'Failed to create service' });
  }

  return res.status(201).json({ service });
}

// PUT - Update existing service
async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const {
    name,
    slug,
    description,
    short_description,
    price,
    original_price,
    features,
    turnaround_time,
    category,
    status,
    featured_image,
    before_audio_url,
    after_audio_url,
    sort_order
  } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Service ID is required' });
  }

  // Check if service exists
  const { data: existingService } = await supabase
    .from('services')
    .select('id')
    .eq('id', id)
    .is('deleted_at', null)
    .single();

  if (!existingService) {
    return res.status(404).json({ error: 'Service not found' });
  }

  // Check if slug already exists (if changed)
  if (slug) {
    const { data: slugExists } = await supabase
      .from('services')
      .select('id')
      .eq('slug', slug)
      .neq('id', id)
      .is('deleted_at', null)
      .single();

    if (slugExists) {
      return res.status(400).json({ error: 'Service with this slug already exists' });
    }
  }

  // Update service
  const updateData: {
    name?: string;
    slug?: string;
    description?: string;
    short_description?: string;
    price?: number;
    original_price?: number | null;
    features?: string[];
    turnaround_time?: string;
    category?: string;
    status?: string;
    featured_image?: string;
    before_audio_url?: string;
    after_audio_url?: string;
    sort_order?: number;
  } = {};
  if (name !== undefined) updateData.name = name;
  if (slug !== undefined) updateData.slug = slug;
  if (description !== undefined) updateData.description = description;
  if (short_description !== undefined) updateData.short_description = short_description;
  if (price !== undefined) updateData.price = Number(price);
  if (original_price !== undefined) updateData.original_price = original_price ? Number(original_price) : null;
  if (features !== undefined) updateData.features = features;
  if (turnaround_time !== undefined) updateData.turnaround_time = turnaround_time;
  if (category !== undefined) updateData.category = category;
  if (status !== undefined) updateData.status = status;
  if (featured_image !== undefined) updateData.featured_image = featured_image;
  if (before_audio_url !== undefined) updateData.before_audio_url = before_audio_url;
  if (after_audio_url !== undefined) updateData.after_audio_url = after_audio_url;
  if (sort_order !== undefined) updateData.sort_order = sort_order;

  const { data: service, error } = await supabase
    .from('services')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating service:', error);
    return res.status(500).json({ error: 'Failed to update service' });
  }

  return res.status(200).json({ service });
}

// DELETE - Soft delete service
async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Service ID is required' });
  }

  // Check if service exists
  const { data: existingService } = await supabase
    .from('services')
    .select('id')
    .eq('id', id)
    .is('deleted_at', null)
    .single();

  if (!existingService) {
    return res.status(404).json({ error: 'Service not found' });
  }

  // Soft delete
  const { error } = await supabase
    .from('services')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Error deleting service:', error);
    return res.status(500).json({ error: 'Failed to delete service' });
  }

  return res.status(200).json({ message: 'Service deleted successfully' });
} 