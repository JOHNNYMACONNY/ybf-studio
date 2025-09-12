import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

type UserWithAdmin = {
  email?: string;
  isAdmin?: boolean;
  [key: string]: unknown;
};

// Helper to get a random image from public/assets/blogImages
const getRandomBlogImage = (): string => {
  try {
    const imagesDir = path.join(process.cwd(), 'public', 'assets', 'blogImages');
    const entries = fs.readdirSync(imagesDir, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile())
      .map((e) => e.name)
      .filter((name) => /\.(png|jpe?g|webp|gif|svg)$/i.test(name));
    if (files.length > 0) {
      const idx = Math.floor(Math.random() * files.length);
      return `/assets/blogImages/${files[idx]}`;
    }
  } catch (e) {
    // ignore and use fallback below
  }
  return '/assets/blog-beat-selection.jpg';
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
  console.log('🔐 CHECKING ADMIN ACCESS');
  const session = await getServerSession(req, res, authOptions);
  console.log('Session found:', !!session);
  console.log('Session user:', session?.user);
  const user = session?.user as UserWithAdmin | undefined;
  console.log('User isAdmin:', user?.isAdmin);
  console.log('User email:', user?.email);

  if (!session || !user?.isAdmin) {
    console.log('❌ ADMIN ACCESS DENIED');
    res.status(403).json({ error: 'Forbidden: Admin access required' });
    return false;
  }
  console.log('✅ ADMIN ACCESS GRANTED');
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
  try {
    switch (req.method) {
      case 'GET':
        // Allow GET requests without authentication for reading
        await handleGetBlogPosts(req, res);
        break;
      case 'POST':
      case 'PUT':
      case 'DELETE':
        // Check admin access for write operations
        if (!(await checkAdminAccess(req, res))) {
          return;
        }
        if (req.method === 'POST') await handleCreateBlogPost(req, res);
        else if (req.method === 'PUT') await handleUpdateBlogPost(req, res);
        else if (req.method === 'DELETE') await handleDeleteBlogPost(req, res);
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
    // First, try a simple query to check if the table exists
    const { data: simpleTest, error: simpleError } = await supabase
      .from('blog_posts')
      .select('*')
      .limit(1);

    if (simpleError) {
      console.error('Simple query error:', simpleError);
      if (simpleError.message?.includes('does not exist') || simpleError.code === '42P01' || simpleError.code === 'PGRST116') {
        console.log('Blog posts table does not exist, returning empty data');
        return res.status(200).json({
          posts: [],
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total: 0,
            totalPages: 0
          }
        });
      }
      return res.status(500).json({ error: 'Database error' });
    }

    // Get posts first
    let postsQuery = supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    // Apply search filter
    if (search && typeof search === 'string') {
      postsQuery = postsQuery.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }

    // Apply status filter
    if (status && typeof status === 'string' && status !== 'all') {
      postsQuery = postsQuery.eq('status', status);
    }

    // Apply pagination
    postsQuery = postsQuery.range(offset, offset + Number(limit) - 1);

    const { data: posts, error: postsError, count } = await postsQuery;

    if (postsError) {
      console.error('Supabase error:', postsError);
      console.error('Error code:', postsError.code);
      console.error('Error message:', postsError.message);
      console.error('Error details:', postsError.details);

      // Return empty data if tables don't exist yet
      if (postsError.message?.includes('does not exist') || postsError.code === '42P01' || postsError.code === 'PGRST116') {
        console.log('Tables do not exist, returning empty data');
        return res.status(200).json({
          posts: [],
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total: 0,
            totalPages: 0
          }
        });
      }
      return res.status(500).json({ error: 'Database error' });
    }

    // If we have posts and need category filtering, filter them
    let filteredPosts = posts || [];
    if (category && typeof category === 'string' && category !== 'all' && posts && posts.length > 0) {
      // Get post IDs to fetch their categories
      const postIds = posts.map(post => post.id);

      const { data: postCategories, error: catError } = await supabase
        .from('blog_post_categories')
        .select(`
          post_id,
          blog_categories!inner(slug)
        `)
        .in('post_id', postIds);

      if (!catError && postCategories) {
        // Filter posts that have the specified category
        const categoryPostIds = postCategories
          .filter(pc => pc.blog_categories?.some((cat: { slug: string }) => cat.slug === category))
          .map(pc => pc.post_id);

        filteredPosts = posts.filter(post => categoryPostIds.includes(post.id));
      }
    }

    // Fetch categories for all posts and ensure every post has a categories field
    let transformedPosts = filteredPosts.map(post => ({
      ...post,
      categories: post.categories || [] // Ensure categories field exists
    }));

    if (filteredPosts.length > 0) {
      const postIds = filteredPosts.map(post => post.id);

      try {
        const { data: postCategories, error: catError } = await supabase
          .from('blog_post_categories')
          .select(`
            post_id,
            blog_categories(name, slug)
          `)
          .in('post_id', postIds);

        if (!catError && postCategories && postCategories.length > 0) {
          // Group categories by post_id
          const categoriesByPostId = postCategories.reduce((acc: Record<string, string[]>, pc: { post_id: string; blog_categories: { name: string; slug: string }[] }) => {
            if (!acc[pc.post_id]) acc[pc.post_id] = [];
            if (pc.blog_categories && pc.blog_categories.length > 0) {
              pc.blog_categories.forEach(category => {
                acc[pc.post_id].push(category.name);
              });
            }
            return acc;
          }, {});

          // Update posts with their categories
          transformedPosts = transformedPosts.map(post => ({
            ...post,
            categories: categoriesByPostId[post.id] || []
          }));
        }
        // If there's an error or no categories, posts already have empty categories array
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Posts already have empty categories array as fallback
      }
    }

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

    // Prepare the data object for insertion
    const postData: {
      title: string;
      slug: string;
      content: string;
      excerpt?: string;
      meta_title?: string;
      meta_description?: string;
      status: string;
      published_at: string | null;
      author_id: string | null;
      featured_image?: string;
    } = {
      title,
      slug,
      content,
      excerpt,
      meta_title,
      meta_description,
      status,
      published_at: status === 'published' ? published_at || new Date().toISOString() : null,
      author_id: req.body.author_id || null
    };

    // Featured image: use provided, otherwise random from assets/blogImages
    if (featured_image && featured_image.trim() !== '') {
      postData.featured_image = featured_image;
    } else {
      postData.featured_image = getRandomBlogImage();
    }

    // Create the blog post
    const { data: post, error: postError } = await supabase
      .from('blog_posts')
      .insert(postData)
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
    console.log('🔍 BLOG UPDATE START');
    console.log('Request query:', req.query);
    console.log('Request body:', req.body);

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

    console.log('Extracted status:', status);
    console.log('All extracted fields:', { title, content, excerpt, featured_image, meta_title, meta_description, status, published_at, categories });

    // Handle case where id might be an array
    const postId = Array.isArray(id) ? id[0] : id;

    if (!postId || typeof postId !== 'string') {
      return res.status(400).json({ error: 'Post ID is required' });
    }

    // Check if post exists
    const { data: existingPosts, error: fetchError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', postId);

    if (fetchError) {
      return res.status(500).json({ error: 'Database error during post lookup' });
    }

    if (!existingPosts || existingPosts.length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    const existingPost = existingPosts[0];

    // Check if post is deleted
    if (existingPost.deleted_at !== null) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    // Generate new slug if title changed
    const slug = title !== existingPost.title ? generateSlug(title) : existingPost.slug;

    // Prepare the data object for update
    const updateData: {
      title: string;
      slug: string;
      content: string;
      excerpt?: string;
      meta_title?: string;
      meta_description?: string;
      status: string;
      published_at: string | null;
      featured_image?: string;
    } = {
      title,
      slug,
      content,
      excerpt,
      meta_title,
      meta_description,
      status,
      published_at: status === 'published' ? published_at || new Date().toISOString() : null
    };

    // Only include featured_image if it's provided and not empty
    if (featured_image && featured_image.trim() !== '') {
      updateData.featured_image = featured_image;
    }
    // If empty, let the database use its default value or keep existing

    // Update the blog post
    const { data: post, error: updateError } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', postId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating blog post:', updateError);
      return res.status(500).json({ error: 'Failed to update blog post' });
    }

    // Update categories
    if (categories.length >= 0) {
      // Remove existing categories
      const { error: deleteError } = await supabase
        .from('blog_post_categories')
        .delete()
        .eq('post_id', postId);

      if (deleteError) {
        console.error('Error deleting existing categories:', deleteError);
        // Don't fail the entire update, just log the error
      }

      // Add new categories
      if (categories.length > 0) {
        const categoryIds = await getCategoryIds(categories);
        if (categoryIds.length > 0) {
          const categoryMappings = categoryIds.map(categoryId => ({
            post_id: postId,
            category_id: categoryId
          }));

          const { error: categoryError } = await supabase
            .from('blog_post_categories')
            .insert(categoryMappings);

          if (categoryError) {
            console.error('Error adding categories:', categoryError);
            // Don't fail the entire update, just log the error
          }
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
    .is('deleted_at', null);

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return categories?.map(cat => cat.id) || [];
} 