import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import Section from '../components/shared/Section';
import BeatCard from '../components/BeatCard';
import Input from '../components/Input';
import Select from '../components/ui/Select';
import { Search } from 'lucide-react';
import type { Beat } from '../types/beat';
import { useUnifiedAudio } from '../components/audio/UnifiedAudioContext';
import { useCart } from '../components/ui/CartContext';
import Card from '../components/ui/Card';
import AnimatedSection from '../components/ui/AnimatedSection';
import Button from '../components/ui/Button';
import LicenseComparison from '../components/beats/LicenseComparison';
import { getHeroImage } from '../lib/hero-config';
import { supabase } from '../lib/supabase';

// Available beat cover art images
const BEAT_COVER_IMAGES = [
  '/assets/beatCovers/beat_cover_1.png',
  '/assets/beatCovers/beat_cover_2.png',
  '/assets/beatCovers/beat_cover_3.png',
  '/assets/beatCovers/beat_cover_4.png'
];

// Get random cover art image
const getRandomCoverArt = () => {
  const randomIndex = Math.floor(Math.random() * BEAT_COVER_IMAGES.length);
  return BEAT_COVER_IMAGES[randomIndex];
};

interface BeatsPageProps {
  allBeats: Beat[];
}

type BeatRow = {
  id: string;
  title: string;
  artist: string;
  genre: string;
  bpm: number;
  price: number;
  cover_art: string;
  audio_url?: string | null;
  preview_url?: string | null;
  full_track_url?: string | null;
  duration?: string | null;
  preview_duration?: string | null;
  description?: string | null;
  license_types?: {
    mp3: number;
    wav: number;
    premium: number;
    exclusive: number;
  } | null;
};

const Beats: React.FC<BeatsPageProps> = ({ allBeats }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [genre, setGenre] = useState('All');
  const [mood, setMood] = useState('All');
  const [bpm, setBpm] = useState('');

  const { playBeat } = useUnifiedAudio();
  const { addToCart } = useCart();

  const genres = ['All', ...Array.from(new Set(allBeats.map(beat => beat.genre)))];
  const moods = ['All', 'Energetic', 'Chill', 'Dark', 'Uplifting', 'Melodic'];

  const filteredBeats = useMemo(() => {
    return allBeats.filter(beat => {
      const matchesSearch = beat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           beat.artist.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = genre === 'All' || beat.genre === genre;
      const matchesBpm = !bpm || beat.bpm.toString().includes(bpm);
      
      return matchesSearch && matchesGenre && matchesBpm;
    });
  }, [allBeats, searchQuery, genre, bpm]);

  const handlePlayPreview = (beat: Beat) => {
    playBeat(beat);
  };

  const handleAddToCart = (beat: Beat) => {
    addToCart({
      beat,
      license: 'mp3' // Default to mp3 license, can be enhanced with license selection
    });
  };

  const heroImage = getHeroImage('beats');

  return (
    <>
      <Head>
        <title>Beat Store | AudioService</title>
        <meta name="description" content="Browse our collection of professional beats across multiple genres." />
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
              Beat <span className="text-3d-spline-accent">Store</span>
            </h1>
            <p className="text-xl text-3d-spline-text-secondary max-w-3xl mx-auto">
              Discover professional beats across all genres. Each track is crafted for maximum impact and ready for your next hit.
            </p>
          </div>
        </AnimatedSection>
      </div>

      {/* License Comparison Section */}
      <div className="card-3d-spline rounded-2xl p-8 mb-12">
        <AnimatedSection animation="fadeIn" delay={100}>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-3d-spline-text-primary mb-4">
              License <span className="text-3d-spline-accent">Comparison</span>
            </h2>
            <p className="text-3d-spline-text-secondary max-w-2xl mx-auto">
              Understand the differences between license types to choose the right option for your project.
            </p>
          </div>
        </AnimatedSection>

        <div className="max-w-6xl mx-auto">
          <LicenseComparison />
        </div>
      </div>

      {/* Filters Section */}
      <div className="card-3d-spline rounded-2xl p-8 mb-12">
        <AnimatedSection animation="fadeIn" delay={100}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-3d-spline-text-secondary mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-3d-spline-text-muted" />
                <Input
                  type="text"
                  placeholder="Search beats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-3d-spline-text-secondary mb-2">
                Genre
              </label>
              <Select value={genre} onChange={(e) => setGenre(e.target.value)}>
                {genres.map(g => <option key={g} value={g}>{g}</option>)}
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-3d-spline-text-secondary mb-2">
                Mood
              </label>
              <Select value={mood} onChange={(e) => setMood(e.target.value)}>
                {moods.map(m => <option key={m} value={m}>{m}</option>)}
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-3d-spline-text-secondary mb-2">
                BPM
              </label>
              <Input
                type="text"
                placeholder="e.g., 140"
                value={bpm}
                onChange={(e) => setBpm(e.target.value)}
              />
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* Beats Grid */}
      <div className="card-3d-spline rounded-2xl p-8 mb-12">
        <AnimatedSection animation="fadeIn" delay={200}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-3d-spline-text-primary mb-2">
              {filteredBeats.length} Beats Found
            </h2>
            <p className="text-3d-spline-text-secondary">
              {searchQuery || genre !== 'All' || bpm ? 'Filtered results' : 'All available beats'}
            </p>
          </div>
          
          {filteredBeats.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBeats.map((beat) => (
                <BeatCard
                  key={beat.id}
                  beat={beat}
                  onPlayPreview={handlePlayPreview}
                  onAddToCart={handleAddToCart}
                  variant="glass"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-3d-spline-text-secondary text-lg mb-4">
                No beats found matching your criteria.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setGenre('All');
                  setMood('All');
                  setBpm('');
                }}
                className="btn-3d-spline text-white font-semibold px-6 py-3 rounded-lg"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </AnimatedSection>
      </div>

      {/* CTA Section */}
      <div className="card-3d-spline rounded-2xl p-8 mb-12">
        <AnimatedSection animation="fadeIn" delay={300}>
          <div className="text-center">
            <h2 className="text-4xl font-bold text-3d-spline-text-primary mb-4">
              Need Something Custom?
            </h2>
            <p className="text-xl text-3d-spline-text-secondary mb-8 max-w-2xl mx-auto">
              Can&apos;t find exactly what you&apos;re looking for? We offer custom beat production services tailored to your specific needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="btn-3d-spline text-white font-semibold px-8 py-4 rounded-lg"
              >
                Request Custom Beat
              </Button>
              <Button
                variant="secondary"
                className="btn-3d-spline-accent text-white font-semibold px-8 py-4 rounded-lg"
              >
                View Production Services
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Fetch all published beats from the 'beats' table
  const { data: rows, error } = await supabase
    .from('beats')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching beats:', error);
  }

  // Normalize DB rows (snake_case) to Beat interface (camelCase)
  // Prefer normalized beats via internal API to unify fallbacks and shapes
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  let allBeats: Beat[] = [];
  try {
    const res = await fetch(`${baseUrl}/api/beats`);
    if (res.ok) {
      allBeats = await res.json();
    }
  } catch (e) {
    console.error('Error fetching beats from API:', e);
  }

  return {
    props: {
      allBeats,
      use3DSplineBackground: true,
    },
  };
};

export default Beats;
