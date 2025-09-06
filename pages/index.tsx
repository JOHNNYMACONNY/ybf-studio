import React from 'react';
import { Music2, Check } from 'lucide-react';
import { Icon } from '../components/ui/Icon';
import Link from 'next/link';
import Image from 'next/image';
import { GetServerSideProps } from 'next';
import BeatPreviewPlayer from '../components/beats/BeatPreviewPlayer';
import BeatCard from '../components/BeatCard';
import { useUnifiedAudio } from '../components/audio/UnifiedAudioContext';
import { useCart } from '../components/ui/CartContext';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import AnimatedSection from '../components/ui/AnimatedSection';
import StatCard from '../components/ui/StatCard';
import ServiceHighlights from '../components/services/ServiceHighlights';
import BeforeAfterPlayer from '../components/BeforeAfterPlayer';
import PortfolioHighlights from '../components/portfolio/PortfolioHighlights';
import TestimonialsCarousel from '../components/testimonials/TestimonialsCarousel';
import BlogTeasers from '../components/blog/BlogTeasers';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientText } from '../components/ui/GradientText';
import { PremiumContainer } from '../components/ui/PremiumContainer';
import Card from '../components/ui/Card';
import { getHeroImage } from '../lib/hero-config';
import { supabase } from '../lib/supabase';
import { Service } from '../types/service';
import { Beat } from '../types/beat';

// Sample data
const stats = [
  { value: '500+', title: 'Beats Produced', subtitle: 'Professional quality tracks' },
  { value: '200+', title: 'Happy Clients', subtitle: 'Artists worldwide' },
  { value: '50+', title: 'Genres Covered', subtitle: 'From hip-hop to EDM' },
];

const testimonials = [
  {
    name: 'Alex Johnson',
    role: 'Independent Artist',
    quote: 'The quality of their beats is incredible. I\'ve been using them for my latest EP and the response has been amazing.'
  },
  {
    name: 'Sarah Chen',
    role: 'Music Producer',
    quote: 'Professional service from start to finish. The mixing and mastering brought my tracks to life.'
  },
  {
    name: 'Mike Rodriguez',
    role: 'Record Label Owner',
    quote: 'We\'ve been working with AudioService for months now. Consistent quality and reliable delivery every time.'
  }
];

const blogPosts = [
  {
    title: 'How to Choose the Right Beat for Your Song',
    excerpt: 'Learn the key factors to consider when selecting a beat that matches your artistic vision.',
    category: 'Production Tips',
    readTime: '5 min read'
  },
  {
    title: 'The Art of Mixing: A Beginner\'s Guide',
    excerpt: 'Essential mixing techniques that every producer should know to create professional-sounding tracks.',
    category: 'Tutorials',
    readTime: '8 min read'
  },
  {
    title: 'Mastering Your Music: What You Need to Know',
    excerpt: 'Understanding the mastering process and how it can make or break your final product.',
    category: 'Education',
    readTime: '6 min read'
  }
];

interface HomeProps {
  beats: Beat[];
  services: Service[];
}
const Home: React.FC<HomeProps> = ({ beats, services }) => {
  const heroImage = getHeroImage('home');
  const { playBeat } = useUnifiedAudio();
  const { addToCart } = useCart();
  
  return (
    <>
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
            <div className="space-y-6">
              <h1 className="text-6xl font-bold text-3d-spline-text-primary text-balance">
                What Your <span className="text-3d-spline-accent">Sound</span> Deserves
              </h1>
              <p className="text-xl leading-relaxed font-sans max-w-3xl mx-auto text-3d-spline-text-secondary">
                Industry-level beats, mixing, and mastering services designed for artists who want to stand out.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/beats">
                <Button 
                  variant="primary" 
                  size="lg"
                >
                  Browse Beats
                </Button>
              </Link>
              <Link href="/services">
                <Button 
                  variant="secondary" 
                  size="lg"
                >
                  View Services
                </Button>
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, index) => (
          <div key={index} className="card-3d-spline rounded-xl p-6">
            <div className="text-center">
              <div className="text-3d-spline-text-primary text-3xl font-bold mb-2">
                {stat.value}
              </div>
              <div className="text-3d-spline-text-secondary font-semibold mb-1">
                {stat.title}
              </div>
              <div className="text-3d-spline-text-muted text-sm">
                {stat.subtitle}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Beats Section */}
      <div className="card-3d-spline rounded-2xl p-8 mb-12">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-3d-spline-text-primary mb-4">
            Featured Beats
          </h2>
          <p className="text-3d-spline-text-secondary text-lg">
            Latest releases from our premium collection
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {beats.map((beat) => (
            <BeatCard
              key={beat.id}
              beat={beat}
              variant="glass"
              onPlayPreview={playBeat}
              onAddToCart={(b) => addToCart({ beat: b, license: 'mp3' })}
            />
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Link href="/beats">
            <Button variant="primary" size="lg">
              View All Beats
            </Button>
          </Link>
        </div>
      </div>

      {/* Services Section */}
      <div className="card-3d-spline rounded-2xl p-8 mb-12">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-3d-spline-text-primary mb-4">
            Our Services
          </h2>
          <p className="text-3d-spline-text-secondary text-lg">
            Professional audio services to elevate your music
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="card-3d-spline rounded-xl p-6">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-3d-spline-text-primary mb-2">
                  {service.name}
                </h3>
                <p className="text-3d-spline-text-secondary mb-4 h-12">
                  {service.short_description || service.description}
                </p>
                <div className="text-3d-spline-accent text-3xl font-bold mb-4">
                  ${service.price}
                </div>
              </div>
              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-3d-spline-text-secondary">
                    <Icon as={Check} className="h-4 w-4 text-3d-spline-accent mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Link href={`/services#${service.slug}`} passHref>
                  <Button 
                    variant="primary"
                    className="w-full"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="card-3d-spline rounded-2xl p-8 mb-12">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-3d-spline-text-primary mb-4">
            What Our Clients Say
          </h2>
          <p className="text-3d-spline-text-secondary text-lg">
            Real feedback from artists who have worked with us
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="card-3d-spline rounded-xl p-6">
              <p className="text-3d-spline-text-secondary italic mb-4">
                &quot;{testimonial.quote}&quot;
              </p>
              <div>
                <p className="font-semibold text-3d-spline-text-primary">
                  {testimonial.name}
                </p>
                <p className="text-sm text-3d-spline-text-muted">
                  {testimonial.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blog Section */}
      <div className="card-3d-spline rounded-2xl p-8 mb-12">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-3d-spline-text-primary mb-4">
            Latest from Our Blog
          </h2>
          <p className="text-3d-spline-text-secondary text-lg">
            Tips, tutorials, and insights for your music journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post, index) => (
            <div key={index} className="card-3d-spline rounded-xl p-6">
              <div className="mb-4">
                <span className="text-3d-spline-accent text-sm font-semibold">
                  {post.category}
                </span>
                <span className="text-3d-spline-text-muted text-sm ml-2">
                  {post.readTime}
                </span>
              </div>
              <h3 className="text-xl font-bold text-3d-spline-text-primary mb-2">
                {post.title}
              </h3>
              <p className="text-3d-spline-text-secondary mb-4">
                {post.excerpt}
              </p>
              <Button 
                variant="secondary"
                className="btn-3d-spline-accent text-white font-semibold px-6 py-2 rounded-lg"
              >
                Read More
              </Button>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Link href="/blog">
            <Button variant="primary" size="lg">
              View All Posts
            </Button>
          </Link>
        </div>
      </div>

      {/* CTA Section */}
      <div className="card-3d-spline rounded-2xl p-8 mb-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-3d-spline-text-primary mb-4">
            Ready to Level Up Your Sound?
          </h2>
          <p className="text-xl text-3d-spline-text-secondary mb-8 max-w-2xl mx-auto">
            Join hundreds of artists who have transformed their music with our professional services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button 
                variant="primary"
                size="lg"
              >
                Get Started Today
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button 
                variant="secondary"
                size="lg"
              >
                View Our Work
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Fetch featured beats via internal API to reuse normalization and fallbacks
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  let beats: Beat[] = [];
  try {
    const res = await fetch(`${baseUrl}/api/beats`);
    if (res.ok) {
      const data = await res.json();
      beats = Array.isArray(data) ? (data as Beat[]).slice(0, 4) : [];
    }
  } catch (e) {
    console.error('Error fetching featured beats:', e);
  }

  // Fetch featured services (e.g., the 3 with the lowest sort_order)
  const { data: services, error: servicesError } = await supabase
    .from('active_services')
    .select('*')
    .order('sort_order', { ascending: true })
    .limit(3);

  if (servicesError) {
    console.error('Error fetching home page services:', servicesError);
  }

  return {
    props: {
      beats: beats || [],
      services: services || [],
      use3DSplineBackground: true,
    },
  };
};

export default Home;
