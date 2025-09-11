import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';

import BlogCard from '../../components/blog/BlogCard';
import Button from '../../components/ui/Button';
import AnimatedSection from '../../components/ui/AnimatedSection';
import { supabase } from '../../lib/supabase';
import { generateTableOfContents, addHeadingIds, estimateReadingTime } from '../../utils/tableOfContents';

interface PostPageProps {
  post: {
    title: string;
    excerpt: string;
    slug: string;
    imageUrl: string;
    category: string;
    date: string;
    author: string;
    authorAvatar: string;
    content: string;
  } | null;
  relatedPosts: Array<{
    title: string;
    excerpt: string;
    slug: string;
    imageUrl: string;
    category: string;
  }>;
}

const PostPage: React.FC<PostPageProps> = ({ post, relatedPosts }) => {
  const [tocItems, setTocItems] = useState<Array<{id: string, text: string, level: number}>>([]);
  const [processedContent, setProcessedContent] = useState('');
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    if (post?.content) {
      // Add IDs to headings for anchor linking first
      const processed = addHeadingIds(post.content);
      setProcessedContent(processed);
      
      // Generate table of contents from processed content with IDs
      const toc = generateTableOfContents(processed);
      setTocItems(toc);
      
      // Calculate reading time
      const time = estimateReadingTime(post.content);
      setReadingTime(time);
    }
  }, [post?.content]);

  if (!post) return <p>Post not found.</p>;

  return (
    <>
      <Head>
        <title>{post.title} | YBF Studio</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.imageUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://audioservice.app/blog/${post.slug}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={post.imageUrl} />
        <link rel="canonical" href={`https://audioservice.app/blog/${post.slug}`} />
      </Head>
      <div className="animate-fade-up-stagger animate-delay-1">
      <article>
        {/* Hero Section - Following App Pattern */}
        <div className="card-3d-spline rounded-2xl p-8 mb-12 hero-background-enhanced hero-card-enhanced">
          {/* Background Image with configurable opacity */}
          <div className="hero-background-image" style={{ opacity: 0.6 }}>
            <Image 
              src={post.imageUrl} 
              alt={post.title}
              fill 
              className="object-cover"
              priority
              quality={95}
              sizes="100vw"
            />
          </div>
          
          {/* Content in foreground */}
          <AnimatedSection animation="fadeIn" className="relative z-10">
            <div className="text-center space-y-8">
              <div className="inline-block px-4 py-2 bg-gradient-to-r from-3d-spline-accent/20 to-3d-spline-primary/20 rounded-full border border-3d-spline-accent/40 mb-6 backdrop-blur-sm">
                <p className="text-sm font-bold uppercase tracking-widest text-3d-spline-accent">{post.category}</p>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-3d-spline-text-primary leading-tight">
                {post.title}
              </h1>
              <div className="flex items-center justify-center gap-4 sm:gap-6">
                <Image src={post.authorAvatar} alt={post.author} width={56} height={56} className="rounded-full border-2 border-3d-spline-accent/50 shadow-xl" />
                <div className="text-center sm:text-left">
                  <p className="font-semibold text-3d-spline-text-primary text-lg sm:text-xl">{post.author}</p>
                  <div className="flex items-center justify-center sm:justify-start gap-3 text-sm sm:text-base text-3d-spline-text-secondary">
                    <span>{new Date(post.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                    <span className="w-1 h-1 bg-3d-spline-text-muted rounded-full"></span>
                    <span>{readingTime || 5} min read</span>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>


        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 relative z-20 space-y-8">
          {/* Table of Contents */}
          {tocItems.length > 0 && (
            <div className="mb-12 p-8 bg-gradient-to-r from-neutral-900/90 to-neutral-800/90 rounded-2xl border border-neutral-600/50 backdrop-blur-md shadow-2xl">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                Table of Contents
              </h3>
              <ul className="space-y-3 text-sm text-neutral-300">
                {tocItems.map((item) => (
                  <li key={item.id} className={item.level > 2 ? 'ml-4' : ''}>
                    <a 
                      href={`#${item.id}`} 
                      className="hover:text-amber-400 transition-colors duration-300 flex items-center gap-3 group"
                    >
                      <div className="w-1 h-1 bg-neutral-500 rounded-full group-hover:bg-amber-400 transition-colors"></div>
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="relative bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-8 border border-neutral-700/50 shadow-xl">
            <div 
              className="prose prose-invert prose-lg max-w-none prose-h2:text-2xl prose-h2:font-bold prose-h2:text-white prose-h2:mt-12 prose-h2:mb-6 prose-h3:font-display prose-h3:text-amber prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4 prose-p:text-neutral-300 prose-p:leading-relaxed prose-p:mb-6 prose-a:text-amber prose-a:no-underline hover:prose-a:text-amber/90 hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: processedContent || post.content }} 
            />
          </div>
          
          {/* Social Sharing */}
          <div className="mt-8 pt-8 border-t border-neutral-700/50">
            <div className="bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-8 border border-neutral-700/50 shadow-xl">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-white mb-2">Share this article</h3>
                <p className="text-neutral-400 text-sm">Help others discover this content</p>
              </div>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://audioservice.app/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 text-blue-400 hover:text-blue-300 rounded-xl border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                </svg>
                <span className="font-medium">Twitter</span>
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://audioservice.app/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600/20 to-blue-700/20 hover:from-blue-600/30 hover:to-blue-700/30 text-blue-400 hover:text-blue-300 rounded-xl border border-blue-600/30 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-600/25"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="font-medium">Facebook</span>
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://audioservice.app/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-700/20 to-blue-800/20 hover:from-blue-700/30 hover:to-blue-800/30 text-blue-400 hover:text-blue-300 rounded-xl border border-blue-700/30 hover:border-blue-600/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-700/25"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span className="font-medium">LinkedIn</span>
              </a>
            </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles Section - Following App Pattern */}
      <div className="card-3d-spline rounded-2xl p-8 mb-12">
        <AnimatedSection animation="fadeIn" delay={100}>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-3d-spline-text-primary mb-4">
              Related <span className="text-3d-spline-accent">Articles</span>
            </h2>
            <p className="text-3d-spline-text-secondary text-lg max-w-2xl mx-auto">
              Continue your music journey with these handpicked articles
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((relatedPost, index) => (
              <AnimatedSection key={relatedPost.slug} animation="slideUp" delay={200 + index * 150}>
                <div className="card-3d-spline rounded-xl p-6 h-full flex flex-col hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                  <BlogCard post={relatedPost} />
                </div>
              </AnimatedSection>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/blog" passHref>
              <Button 
                variant="primary"
                size="lg"
                className="group hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-3d-spline-accent/25"
              >
                <span className="group-hover:text-3d-spline-accent transition-colors duration-300">
                  View All Articles
                </span>
              </Button>
            </Link>
          </div>
        </AnimatedSection>
      </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = params?.slug as string;

  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .is('deleted_at', null)
    .limit(1);

  if (error || !posts || posts.length === 0) {
    return { notFound: true };
  }

  const postRow = posts[0] as {
    title: string;
    excerpt: string | null;
    slug: string;
    featured_image: string | null;
    published_at: string | null;
    created_at: string;
    author_id: string | null;
    content: string | null;
    categories?: string[];
  };

  // Get author information if available
  let author = 'YBF Studio';
  let authorAvatar = '/assets/logo/main-logo.png';
  
  if (postRow.author_id) {
    // Try to get author details from auth.users table
    const { data: authorData } = await supabase
      .from('auth.users')
      .select('email, user_metadata')
      .eq('id', postRow.author_id)
      .single();
    
    if (authorData) {
      author = authorData.user_metadata?.full_name || authorData.email || 'YBF Studio';
      authorAvatar = authorData.user_metadata?.avatar_url || '/assets/logo/main-logo.png';
    }
  }

  const post = {
    title: postRow.title,
    excerpt: postRow.excerpt || '',
    slug: postRow.slug,
    imageUrl: (postRow.featured_image && String(postRow.featured_image).trim()) ? postRow.featured_image : '/assets/blog-beat-selection.jpg',
    category: postRow.categories?.[0] || 'General',
    date: postRow.published_at || postRow.created_at,
    author,
    authorAvatar,
    content: postRow.content || ''
  };

  // Fetch related posts (exclude current post)
  const { data: relatedPostsData } = await supabase
    .from('blog_posts')
    .select('title, excerpt, slug, featured_image, category')
    .neq('slug', slug)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(4);

  const relatedPosts = (relatedPostsData || []).map((relatedPost: {
    title: string;
    excerpt: string | null;
    slug: string;
    featured_image: string | null;
    category?: string;
  }) => ({
    title: relatedPost.title,
    excerpt: relatedPost.excerpt || '',
    slug: relatedPost.slug,
    imageUrl: (relatedPost.featured_image && String(relatedPost.featured_image).trim()) 
      ? relatedPost.featured_image 
      : '/assets/blog-beat-selection.jpg',
    category: relatedPost.category || 'General'
  }));

  return { props: { post, relatedPosts, use3DSplineBackground: true, skipDefaultHead: true } };
};

export default PostPage;


