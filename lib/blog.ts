import { supabaseAdmin } from './supabaseAdmin';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string;
  meta_title?: string;
  meta_description?: string;
  status: 'draft' | 'published' | 'archived';
  published_at: string | null;
  created_at: string;
  updated_at: string;
  categories: string[];
  read_time?: string;
}

export interface BlogPostCard {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  readTime: string;
  publishedAt: string;
}

export const getFeaturedBlogPosts = async (limit: number = 3): Promise<BlogPostCard[]> => {
  try {
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        featured_image,
        published_at,
        created_at,
        blog_post_categories(
          blog_categories(name)
        )
      `)
      .eq('status', 'published')
      .is('deleted_at', null)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }

    return (data || []).map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      imageUrl: post.featured_image || '/assets/blog-beat-selection.jpg',
      category: post.blog_post_categories?.[0]?.blog_categories?.[0]?.name || 'General',
      readTime: '5 min read', // TODO: Calculate from content
      publishedAt: post.published_at || post.created_at,
    }));
  } catch (error) {
    console.error('Error fetching featured blog posts:', error);
    return [];
  }
};

export const getAllBlogPosts = async (page: number = 1, limit: number = 20): Promise<{
  posts: BlogPostCard[];
  total: number;
  totalPages: number;
}> => {
  try {
    const offset = (page - 1) * limit;
    
    const { data, error, count } = await supabaseAdmin
      .from('blog_posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        featured_image,
        published_at,
        created_at,
        blog_post_categories(
          blog_categories(name)
        )
      `, { count: 'exact' })
      .eq('status', 'published')
      .is('deleted_at', null)
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching blog posts:', error);
      return { posts: [], total: 0, totalPages: 0 };
    }

    const posts = (data || []).map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      imageUrl: post.featured_image || '/assets/blog-beat-selection.jpg',
      category: post.blog_post_categories?.[0]?.blog_categories?.[0]?.name || 'General',
      readTime: '5 min read',
      publishedAt: post.published_at || post.created_at,
    }));

    return {
      posts,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit)
    };
  } catch (error) {
    console.error('Error fetching all blog posts:', error);
    return { posts: [], total: 0, totalPages: 0 };
  }
};

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .select(`
        *,
        blog_post_categories(
          blog_categories(name, slug)
        )
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .is('deleted_at', null)
      .single();

    if (error) {
      console.error('Error fetching blog post:', error);
      return null;
    }

    return {
      ...data,
      categories: data.blog_post_categories?.map((pc: any) => pc.blog_categories?.name).filter(Boolean) || []
    };
  } catch (error) {
    console.error('Error fetching blog post by slug:', error);
    return null;
  }
};
