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
async function checkAdminAccess(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const user = session?.user as UserWithAdmin | undefined;

  if (!session || !user?.isAdmin) {
    res.status(403).json({ error: 'Forbidden: Admin access required' });
    return false;
  }
  return true;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Check admin access
      const hasAccess = await checkAdminAccess(req, res);
      if (!hasAccess) return;

      // Fetch all active categories
      const { data: categories, error } = await supabase
        .from('blog_categories')
        .select('*')
        .is('deleted_at', null)
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
        return res.status(500).json({ error: 'Failed to fetch categories' });
      }

      res.status(200).json({ categories: categories || [] });
    } catch (error) {
      console.error('Error in categories GET:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      // Check admin access
      const hasAccess = await checkAdminAccess(req, res);
      if (!hasAccess) return;

      const { name, description, color } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Category name is required' });
      }

      // Generate slug from name
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

      // Create new category
      const { data: category, error } = await supabase
        .from('blog_categories')
        .insert({
          name,
          slug,
          description: description || null,
          color: color || '#3B82F6'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating category:', error);
        return res.status(500).json({ error: 'Failed to create category' });
      }

      res.status(201).json({ category });
    } catch (error) {
      console.error('Error in categories POST:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: 'Method not allowed' });
  }
}
