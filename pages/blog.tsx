import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { GetServerSideProps } from 'next';

import Section from '../components/shared/Section';
import BlogCard from '../components/blog/BlogCard';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import AnimatedSection from '../components/ui/AnimatedSection';
import { getHeroImage } from '../lib/hero-config';

// Placeholder Data
const allPosts = [
  { title: '5 Common Mistakes to Avoid When Mixing Vocals', excerpt: 'Learn how to get clean, professional-sounding vocals by avoiding these simple but critical errors.', slug: 'mixing-vocals-mistakes', imageUrl: '/images/blog1.jpg', category: 'Mixing Tips' },
  { title: 'How to Choose the Right Beat for Your Song', excerpt: 'Your beat selection can make or break a track. Here’s our guide to finding the perfect instrumental.', slug: 'choosing-the-right-beat', imageUrl: '/images/blog2.jpg', category: 'Beat Making' },
  { title: 'The Ultimate Guide to Compression in Music Production', excerpt: 'Understand the ins and outs of compression and how to use it to add punch and clarity to your tracks.', slug: 'guide-to-compression', imageUrl: '/images/blog3.jpg', category: 'Mixing Tips' },
  { title: 'Music Licensing Explained: What Artists Need to Know', excerpt: 'Navigating the world of music licensing can be confusing. We break down the essentials for you.', slug: 'music-licensing-explained', imageUrl: '/images/blog4.jpg', category: 'Music Business' },
  { title: 'Creating a Hit: The Art of Song Arrangement', excerpt: 'Learn how to structure your song to keep listeners engaged from the first beat to the final fade-out.', slug: 'song-arrangement', imageUrl: '/images/blog5.jpg', category: 'Beat Making' },
  { title: 'Marketing Your Music on a Budget', excerpt: 'You don\'t need a massive budget to get your music heard. Here are some effective strategies for indie artists.', slug: 'music-marketing-budget', imageUrl: '/images/blog6.jpg', category: 'Music Business' },
];

const categories = ['All', 'Mixing Tips', 'Beat Making', 'Music Business'];

const Blog: React.FC = () => {
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredPosts = useMemo(() => {
    if (categoryFilter === 'All') {
      return allPosts;
    }
    return allPosts.filter(post => post.category === categoryFilter);
  }, [categoryFilter]);

  const heroImage = getHeroImage('blog');

  return (
    <>
      <Head>
        <title>Blog | AudioService</title>
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
            <div className="mb-12 flex justify-center">
              <div className="w-full max-w-xs">
                <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                  {categories.map(c => <option key={c} value={c}>Filter by Category: {c}</option>)}
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <BlogCard key={post.title} post={post} />
              ))}
            </div>
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
  return {
    props: {
      use3DSplineBackground: true,
    },
  };
};

export default Blog;