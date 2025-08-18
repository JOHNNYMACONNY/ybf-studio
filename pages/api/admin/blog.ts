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

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string;
  meta_title: string;
  meta_description: string;
  status: 'draft' | 'published' | 'archived';
  published_at: string | null;
  author_id: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  categories?: string[];
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

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

// Helper function to generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .replace(/^-|-$/g, '') + '-' + Date.now();
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
        await handleGetBlogPosts(req, res);
        break;
      case 'POST':
        await handleCreateBlogPost(req, res);
        break;
      case 'PUT':
        await handleUpdateBlogPost(req, res);
        break;
      case 'DELETE':
        await handleDeleteBlogPost(req, res);
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Admin blog API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// GET - Fetch all blog posts with pagination and search
async function handleGetBlogPosts(req: NextApiRequest, res: NextApiResponse) {
  const { page = 1, limit = 20, search, status, category } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  try {
    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        blog_post_categories!inner(
          category_id,
          blog_categories!inner(name, slug)
        )
      `, { count: 'exact' })
      .eq('deleted_at', null)
      .order('created_at', { ascending: false });

    // Apply search filter
    if (search && typeof search === 'string') {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }

    // Apply status filter
    if (status && typeof status === 'string' && status !== 'all') {
      query = query.eq('status', status);
    }

    // Apply category filter
    if (category && typeof category === 'string' && category !== 'all') {
      query = query.eq('blog_post_categories.blog_categories.slug', category);
    }

    // Apply pagination
    query = query.range(offset, offset + Number(limit) - 1);

    const { data: posts, error, count } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    // Transform the data to include categories as an array
    const transformedPosts = posts?.map(post => ({
      ...post,
      categories: post.blog_post_categories?.map((pc: { blog_categories: { name: string } }) => pc.blog_categories.name) || []
    })) || [];

    res.status(200).json({
      posts: transformedPosts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count || 0,
        totalPages: Math.ceil((count || 0) / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
}

// POST - Create new blog post
async function handleCreateBlogPost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      title,
      content,
      excerpt,
      featured_image,
      meta_title,
      meta_description,
      status = 'draft',
      published_at,
      categories = []
    } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    // Generate slug from title
    const slug = generateSlug(title);

    // Create the blog post
    const { data: post, error: postError } = await supabase
      .from('blog_posts')
      .insert({
        title,
        slug,
        content,
        excerpt,
        featured_image,
        meta_title,
        meta_description,
        status,
        published_at: status === 'published' ? published_at || new Date().toISOString() : null,
        author_id: req.body.author_id || null
      })
      .select()
      .single();

    if (postError) {
      console.error('Error creating blog post:', postError);
      return res.status(500).json({ error: 'Failed to create blog post' });
    }

    // Add categories if provided
    if (categories.length > 0) {
      const categoryIds = await getCategoryIds(categories);
      if (categoryIds.length > 0) {
        const categoryMappings = categoryIds.map(categoryId => ({
          post_id: post.id,
          category_id: categoryId
        }));

        const { error: categoryError } = await supabase
          .from('blog_post_categories')
          .insert(categoryMappings);

        if (categoryError) {
          console.error('Error adding categories:', categoryError);
        }
      }
    }

    res.status(201).json({ post });
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ error: 'Failed to create blog post' });
  }
}

// PUT - Update existing blog post
async function handleUpdateBlogPost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const {
      title,
      content,
      excerpt,
      featured_image,
      meta_title,
      meta_description,
      status,
      published_at,
      categories = []
    } = req.body;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Post ID is required' });
    }

    // Check if post exists
    const { data: existingPost, error: fetchError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .eq('deleted_at', null)
      .single();

    if (fetchError || !existingPost) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    // Generate new slug if title changed
    const slug = title !== existingPost.title ? generateSlug(title) : existingPost.slug;

    // Update the blog post
    const { data: post, error: updateError } = await supabase
      .from('blog_posts')
      .update({
        title,
        slug,
        content,
        excerpt,
        featured_image,
        meta_title,
        meta_description,
        status,
        published_at: status === 'published' ? published_at || new Date().toISOString() : null
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating blog post:', updateError);
      return res.status(500).json({ error: 'Failed to update blog post' });
    }

    // Update categories
    if (categories.length >= 0) {
      // Remove existing categories
      await supabase
        .from('blog_post_categories')
        .delete()
        .eq('post_id', id);

      // Add new categories
      if (categories.length > 0) {
        const categoryIds = await getCategoryIds(categories);
        if (categoryIds.length > 0) {
          const categoryMappings = categoryIds.map(categoryId => ({
            post_id: id,
            category_id: categoryId
          }));

          await supabase
            .from('blog_post_categories')
            .insert(categoryMappings);
        }
      }
    }

    res.status(200).json({ post });
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ error: 'Failed to update blog post' });
  }
}

// DELETE - Soft delete blog post
async function handleDeleteBlogPost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Post ID is required' });
    }

    // Soft delete the blog post
    const { error } = await supabase
      .from('blog_posts')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error deleting blog post:', error);
      return res.status(500).json({ error: 'Failed to delete blog post' });
    }

    res.status(200).json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
}

// Helper function to get category IDs from category names
async function getCategoryIds(categoryNames: string[]): Promise<string[]> {
  const { data: categories, error } = await supabase
    .from('blog_categories')
    .select('id')
    .in('name', categoryNames)
    .eq('deleted_at', null);

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return categories?.map(cat => cat.id) || [];
} 