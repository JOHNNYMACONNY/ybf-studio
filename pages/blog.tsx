import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { GetServerSideProps } from 'next';

import BlogCard from '../components/blog/BlogCard';
import Button from '../components/ui/Button';
import AnimatedSection from '../components/ui/AnimatedSection';
import { getHeroImage } from '../lib/hero-config';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  featured_image: string;
  published_at: string;
  categories: string[];
}

interface BlogPageProps {
  posts: BlogPost[];
  categories: string[];
}

// Categories will be fetched from the database in getServerSideProps

const Blog: React.FC<BlogPageProps> = ({ posts, categories = [] }) => {
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredPosts = useMemo(() => {
    // Transform database posts to match BlogCard interface
    const transformedPosts = posts.map(post => ({
      title: post.title,
      excerpt: post.excerpt,
      slug: post.slug,
      imageUrl: (post.featured_image && String(post.featured_image).trim()) ? post.featured_image : '/assets/blog-beat-selection.jpg',
      category: (post.categories && post.categories.length > 0 && post.categories[0]) || 'General'
    }));

    if (categoryFilter === 'All') {
      return transformedPosts;
    }
    return transformedPosts.filter(post => post.category === categoryFilter);
  }, [categoryFilter, posts]);

  const heroImage = getHeroImage('blog');

  return (
    <>
      <Head>
        <title>Blog | YBF Studio</title>
        <meta name="description" content="Tips, tutorials, and insights to help you on your music journey." />
      </Head>

      {/* Hero Section */}
      <div className="card-3d-spline rounded-2xl p-8 mb-12 hero-background-enhanced hero-card-enhanced">
        {/* Background Image with configurable opacity */}
        <div className="hero-background-image" style={{ opacity: (heroImage.opacity || 60) / 100 }}>
          <Image 
            src={heroImage.path} 
            alt={heroImage.alt}
            fill 
            className="object-cover"
            priority
          />
        </div>
        
        {/* Content in foreground */}
        <AnimatedSection animation="fadeIn" className="relative z-10">
          <div className="text-center space-y-8">
            <h1 className="text-5xl font-bold text-3d-spline-text-primary">
              Music <span className="text-3d-spline-accent">Blog</span>
            </h1>
            <p className="text-xl text-3d-spline-text-secondary max-w-3xl mx-auto">
              Tips, tutorials, and insights to help you on your music journey. From production techniques to industry advice.
            </p>
          </div>
        </AnimatedSection>
      </div>

        {/* Blog Posts Section */}
        <div className="card-3d-spline rounded-2xl p-8 mb-12">
          <AnimatedSection animation="fadeIn" delay={100}>
            <div className="mb-12 flex flex-col items-center gap-6">
              {/* 3D Spline Filter Container */}
              <div className="w-full max-w-md">
                <div className="card-3d-spline rounded-2xl p-6" style={{
                  background: 'linear-gradient(135deg, rgba(38, 38, 38, 0.4) 0%, rgba(16, 185, 129, 0.05) 50%, rgba(38, 38, 38, 0.3) 100%)'
                }}>
                  <div className="space-y-4">
                    {/* Filter Label */}
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-3d-spline-text-primary mb-1">
                        Filter by Category
                      </h3>
                      <p className="text-sm text-3d-spline-text-muted">
                        {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} found
                      </p>
                    </div>
                    
                    {/* 3D Spline Select */}
                    <div className="relative">
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full appearance-none rounded-xl bg-black/40 border border-emerald-500/30 px-4 py-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/60 transition-all duration-300 backdrop-blur-sm hover:border-emerald-400/40"
                        style={{
                          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(16, 185, 129, 0.05) 100%)',
                          boxShadow: '0 4px 15px rgba(16, 185, 129, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                        }}
                      >
                        {(categories || []).map(c => (
                          <option key={c} value={c} className="bg-neutral-800 text-white">
                            {c}
                          </option>
                        ))}
                      </select>
                      
                      {/* Custom Chevron Icon */}
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg 
                          className="w-5 h-5 text-emerald-400 transition-transform duration-200" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Clear Filter Button */}
                    {categoryFilter !== 'All' && (
                      <div className="text-center">
                        <button
                          onClick={() => setCategoryFilter('All')}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-400/50 rounded-lg transition-all duration-300 backdrop-blur-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Clear Filter
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.map((post) => (
                  <BlogCard key={post.title} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-white mb-2">No posts found</h3>
                <p className="text-neutral-400 mb-4">
                  {categoryFilter !== 'All' 
                    ? `No posts found in the "${categoryFilter}" category.` 
                    : 'No blog posts available at the moment.'
                  }
                </p>
                {categoryFilter !== 'All' && (
                  <button
                    onClick={() => setCategoryFilter('All')}
                    className="text-emerald-400 hover:text-emerald-300 underline transition-colors duration-200"
                  >
                    View all posts
                  </button>
                )}
              </div>
            )}
          </AnimatedSection>
        </div>

        {/* CTA Section */}
        <div className="card-3d-spline rounded-2xl p-8 mb-12">
          <AnimatedSection animation="fadeIn" delay={200}>
            <div className="text-center">
              <h2 className="text-4xl font-bold text-3d-spline-primary mb-4">Ready to Apply What You&apos;ve Learned?</h2>
              <p className="text-xl text-3d-spline-text-secondary mb-8">Browse our beat store or book a service to get started.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/beats" passHref>
                  <Button 
                    variant="primary" 
                    className="btn-3d-spline text-white font-semibold px-8 py-4 rounded-lg"
                  >
                    Browse Beats
                  </Button>
                </Link>
                <Link href="/services" passHref>
                  <Button 
                    variant="secondary" 
                    className="btn-3d-spline-accent text-white font-semibold px-8 py-4 rounded-lg"
                  >
                    View Services
                  </Button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const baseUrl = process.env.NODE_ENV === 'production'
      ? 'https://your-domain.com'
      : 'http://localhost:3000';

    // Fetch posts
    const response = await fetch(`${baseUrl}/api/admin/blog?status=published&page=1&limit=50`);
    const data = response.ok ? await response.json() : { posts: [] };

    // Fetch categories from database
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: categoriesData } = await supabase
      .from('blog_categories')
      .select('name')
      .is('deleted_at', null)
      .order('name');

    const categories = ['All', ...(categoriesData?.map(cat => cat.name) || [])];

    return {
      props: {
        posts: data.posts || [],
        categories,
        use3DSplineBackground: true
      }
    };
  } catch (e) {
    console.error('Error fetching blog data:', e);
    return {
      props: {
        posts: [],
        categories: ['All'],
        use3DSplineBackground: true
      }
    };
  }
};

export default Blog;