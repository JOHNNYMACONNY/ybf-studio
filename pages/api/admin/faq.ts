import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
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
  const { data: user } = await supabase
    .from('users')
    .select('isAdmin')
    .eq('id', session.user?.email)
    .single();

  if (!user?.isAdmin) {
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
    console.error('FAQ API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// GET - Fetch all FAQs with pagination and filters
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { page = 1, limit = 10, category, status, search } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  let query = supabase
    .from('faqs')
    .select('*', { count: 'exact' })
    .order('category', { ascending: true })
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
    query = query.or(`question.ilike.%${search}%,answer.ilike.%${search}%`);
  }

  // Apply pagination
  query = query.range(offset, offset + Number(limit) - 1);

  const { data: faqs, error, count } = await query;

  if (error) {
    console.error('Error fetching FAQs:', error);
    return res.status(500).json({ error: 'Failed to fetch FAQs' });
  }

  return res.status(200).json({
    faqs,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: count || 0,
      totalPages: Math.ceil((count || 0) / Number(limit))
    }
  });
}

// POST - Create new FAQ
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const {
    question,
    answer,
    category,
    sort_order,
    status
  } = req.body;

  // Validate required fields
  if (!question || !answer) {
    return res.status(400).json({ error: 'Question and answer are required' });
  }

  // Create FAQ
  const { data: faq, error } = await supabase
    .from('faqs')
    .insert({
      question,
      answer,
      category: category || 'general',
      sort_order: sort_order || 0,
      status: status || 'active'
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating FAQ:', error);
    return res.status(500).json({ error: 'Failed to create FAQ' });
  }

  return res.status(201).json({ faq });
}

// PUT - Update existing FAQ
async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const {
    question,
    answer,
    category,
    sort_order,
    status
  } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'FAQ ID is required' });
  }

  // Check if FAQ exists
  const { data: existingFaq } = await supabase
    .from('faqs')
    .select('id')
    .eq('id', id)
    .single();

  if (!existingFaq) {
    return res.status(404).json({ error: 'FAQ not found' });
  }

  // Update FAQ
  const updateData: {
    question?: string;
    answer?: string;
    category?: string;
    sort_order?: number;
    status?: string;
  } = {};
  if (question !== undefined) updateData.question = question;
  if (answer !== undefined) updateData.answer = answer;
  if (category !== undefined) updateData.category = category;
  if (sort_order !== undefined) updateData.sort_order = sort_order;
  if (status !== undefined) updateData.status = status;

  const { data: faq, error } = await supabase
    .from('faqs')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating FAQ:', error);
    return res.status(500).json({ error: 'Failed to update FAQ' });
  }

  return res.status(200).json({ faq });
}

// DELETE - Delete FAQ
async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'FAQ ID is required' });
  }

  // Check if FAQ exists
  const { data: existingFaq } = await supabase
    .from('faqs')
    .select('id')
    .eq('id', id)
    .single();

  if (!existingFaq) {
    return res.status(404).json({ error: 'FAQ not found' });
  }

  // Delete FAQ
  const { error } = await supabase
    .from('faqs')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting FAQ:', error);
    return res.status(500).json({ error: 'Failed to delete FAQ' });
  }

  return res.status(200).json({ message: 'FAQ deleted successfully' });
} 