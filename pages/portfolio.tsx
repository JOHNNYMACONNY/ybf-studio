import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { GetServerSideProps } from 'next';

import Section from '../components/shared/Section';
import PortfolioCard from '../components/PortfolioCard';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import AnimatedSection from '../components/ui/AnimatedSection';
import { getHeroImage } from '../lib/hero-config';

// Placeholder Data
const allProjects = [
  { title: 'Faded', artist: 'Artist A', genre: 'R&B', imageUrl: '/images/portfolio1.jpg', url: '#' },
  { title: 'Echoes', artist: 'Artist B', genre: 'Hip-Hop', imageUrl: '/images/portfolio2.jpg', url: '#' },
  { title: 'Visions', artist: 'Artist C', genre: 'Pop', imageUrl: '/images/portfolio3.jpg', url: '#' },
  { title: 'Nightfall', artist: 'Artist D', genre: 'Trap', imageUrl: '/images/portfolio4.jpg', url: '#' },
  { title: 'Daybreak', artist: 'Artist E', genre: 'Lo-fi', imageUrl: '/images/portfolio5.jpg', url: '#' },
  { title: 'Momentum', artist: 'Artist F', genre: 'Hip-Hop', imageUrl: '/images/portfolio6.jpg', url: '#' },
];

const testimonials = [
  { name: 'Alex R.', quote: 'The mix was incredible! Took my track from a demo to a radio-ready hit. Will definitely be back for more.', role: 'Independent Artist' },
  { name: 'Jenna M.', quote: 'Found the perfect beat for my EP. The quality is top-notch and the instant delivery was a lifesaver.', role: 'Singer/Songwriter' },
  { name: 'Mike P.', quote: 'The mastering service is second to none. My track sounds huge on every system. 10/10 would recommend.', role: 'Producer' },
];

const genres = ['All', 'R&B', 'Hip-Hop', 'Pop', 'Trap', 'Lo-fi'];

const Portfolio: React.FC = () => {
  const [genreFilter, setGenreFilter] = useState('All');

  const filteredProjects = useMemo(() => {
    if (genreFilter === 'All') {
      return allProjects;
    }
    return allProjects.filter(project => project.genre === genreFilter);
  }, [genreFilter]);

  const heroImage = getHeroImage('portfolio');

  return (
    <>
      <Head>
        <title>Portfolio | YBF Studio</title>
        <meta name="description" content="Explore our portfolio of music production work and client projects." />
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
              Our <span className="text-3d-spline-accent">Work</span>
            </h1>
            <p className="text-xl text-3d-spline-text-secondary max-w-3xl mx-auto">
              Explore our portfolio of music production work, featuring collaborations with artists across various genres and styles.
            </p>
          </div>
        </AnimatedSection>
      </div>

        {/* Portfolio Projects Section */}
        <div className="card-3d-spline rounded-2xl p-8 mb-12">
          <AnimatedSection animation="fadeIn" delay={100}>
            <div className="mb-12 flex justify-center">
              <div className="w-full max-w-xs">
                <Select value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)}>
                  {genres.map(g => <option key={g} value={g}>Filter by Genre: {g}</option>)}
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <PortfolioCard key={project.title} project={project} />
              ))}
            </div>
          </AnimatedSection>
        </div>

        {/* Testimonials Section */}
        <div className="card-3d-spline rounded-2xl p-8 mb-12">
          <AnimatedSection animation="fadeIn" delay={200}>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-3d-spline-primary mb-4">
                What Our <span className="text-3d-spline-accent">Clients</span> Say
              </h2>
              <p className="text-3d-spline-text-secondary max-w-2xl mx-auto">
                Real feedback from artists who have worked with us.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div key={testimonial.name} className="card-3d-spline rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-3d-spline-accent" fill="currentColor" />)}
                  </div>
                  <p className="text-3d-spline-text-secondary italic">&quot;{testimonial.quote}&quot;</p>
                  <p className="mt-4 font-semibold text-3d-spline-text-primary">{testimonial.name}</p>
                  <p className="text-sm text-3d-spline-text-muted">{testimonial.role}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>

        {/* CTA Section */}
        <div className="card-3d-spline rounded-2xl p-8 mb-12">
          <AnimatedSection animation="fadeIn" delay={300}>
            <div className="text-center">
              <h2 className="text-4xl font-bold text-3d-spline-primary mb-4">Want Your Project to Sound This Good?</h2>
              <p className="text-xl text-3d-spline-text-secondary mb-8">Let&apos;s work together to bring your vision to life.</p>
              <div className="mt-8">
                <Link href="/contact" passHref>
                  <Button variant="primary" size="lg">
                    Get in Touch
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

export default Portfolio;