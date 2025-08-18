import React from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import AnimatedSection from '../ui/AnimatedSection';
import Image from 'next/image';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  readTime: string;
  category: string;
  thumbnail: string;
  date: string;
  slug: string;
}

const recentPosts: BlogPost[] = [
  {
    id: '1',
    title: '5 Essential Mixing Techniques for Better Vocals',
    excerpt: 'Learn the fundamental mixing techniques that will make your vocals stand out in the mix and sound professional.',
    readTime: '5 min read',
    category: 'Mixing Tips',
    thumbnail: '/assets/blog-vocals.jpg',
    date: '2024-01-15',
    slug: 'essential-mixing-techniques-vocals'
  },
  {
    id: '2',
    title: 'How to Choose the Right Beat for Your Song',
    excerpt: 'A comprehensive guide to selecting beats that complement your style and enhance your creative vision.',
    readTime: '7 min read',
    category: 'Production',
    thumbnail: '/assets/blog-beat-selection.jpg',
    date: '2024-01-10',
    slug: 'choose-right-beat-song'
  },
  {
    id: '3',
    title: 'Mastering Your Track: What You Need to Know',
    excerpt: 'Everything you need to know about the mastering process and how it can transform your final mix.',
    readTime: '8 min read',
    category: 'Mastering',
    thumbnail: '/assets/blog-mastering.jpg',
    date: '2024-01-05',
    slug: 'mastering-track-guide'
  }
];

const BlogTeasers: React.FC = () => {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4 max-w-7xl">
        <AnimatedSection delay={150}>
          <h2 className="text-section lg:text-display-small font-bold text-white text-center mb-4">
            Latest from Our Blog
          </h2>
        </AnimatedSection>
        <AnimatedSection delay={250}>
          <p className="text-body text-neutral-300 text-center mb-12 max-w-2xl mx-auto">
            Tips, tutorials, and insights to help you improve your music production skills
          </p>
        </AnimatedSection>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {recentPosts.map((post, index) => (
            <AnimatedSection key={post.id} delay={350 + (index * 100)}>
              <Card className="group cursor-pointer h-full flex flex-col">
                {/* Thumbnail */}
                <div className="relative mb-4 overflow-hidden rounded-lg">
                  <Image 
                    src={post.thumbnail} 
                    alt={post.title}
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-amber text-black px-2 py-1 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-neutral-400">{post.date}</span>
                    <span className="text-xs text-neutral-400">{post.readTime}</span>
                  </div>
                  
                  <h3 className="text-card-title font-bold text-white mb-3 group-hover:text-amber transition-colors duration-200">
                    {post.title}
                  </h3>
                  
                  <p className="text-sm text-neutral-300 mb-4 flex-1">
                    {post.excerpt}
                  </p>
                  
                  <Button 
                    variant="secondary" 
                    className="w-full mt-auto"
                    onClick={() => window.location.href = `/blog/${post.slug}`}
                  >
                    Read More
                  </Button>
                </div>
              </Card>
            </AnimatedSection>
          ))}
        </div>
        
        {/* View All Posts CTA */}
        <AnimatedSection delay={650}>
          <div className="text-center">
            <Button variant="primary" className="px-8 py-3 text-base">
              View All Posts
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default BlogTeasers; 