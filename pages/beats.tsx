import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
// import BeatCard from '../components/BeatCard';
// import StickySearchBar from '../components/beats/StickySearchBar';
// import { Music2, Filter } from 'lucide-react';
import type { Beat } from '../types/beat';
// import { useUnifiedAudio } from '../components/audio/UnifiedAudioContext';
// import { useCart } from '../components/ui/CartContext';
import AnimatedSection from '../components/ui/AnimatedSection';
import Button from '../components/ui/Button';
import LicenseComparison from '../components/beats/LicenseComparison';
// import { Icon } from '../components/ui/Icon';
import { getHeroImage } from '../lib/hero-config';
import { supabase } from '../lib/supabase';



interface BeatsPageProps {
  allBeats: Beat[];
}

const Beats: React.FC<BeatsPageProps> = ({ /* allBeats */ }) => {
  /* TEMPORARILY COMMENTED OUT UNTIL BEATS ARE UPLOADED
  const [searchQuery, setSearchQuery] = useState('');
  const [genre, setGenre] = useState('All');
  const [bpmRange, setBpmRange] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [beatsPerPage] = useState(20);

  const { playBeat } = useUnifiedAudio();
  const { addToCart } = useCart();

  const genres = ['All', ...Array.from(new Set((allBeats || []).map(beat => beat.genre)))];

  const bpmRanges = useMemo(() => {
    const bpms = (allBeats || []).map(b => b.bpm).filter(bpm => bpm > 0);
    if (bpms.length === 0) return ['All'];
    const min = Math.min(...bpms);
    const max = Math.max(...bpms);
    const ranges = ['All'];
    // Generate ranges: 60-80, 80-100, etc. in increments of 20
    for (let i = Math.floor(min / 20) * 20; i < max; i += 20) {
      ranges.push(`${i}-${i + 20}`);
    }
    // Add final range for max BPM
    const finalRangeStart = Math.floor(max / 20) * 20;
    if (finalRangeStart < max) {
      ranges.push(`${finalRangeStart}+`);
    }
    return ranges;
  }, [allBeats]);

  const filteredBeats = useMemo(() => {
    const normalize = (value: string) =>
      (value || '').toLowerCase().replace(/[\s-]/g, '');

    const normalizedQuery = normalize(searchQuery);
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/44a02008-2149-42a3-b009-7395498eb1e7', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'beats.tsx:59', message: 'Search normalization', data: { originalQuery: searchQuery, normalizedQuery, queryLength: normalizedQuery.length }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'D' }) }).catch(() => { });
    // #endregion

    return (allBeats || []).filter(beat => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        normalize(beat.title).includes(normalizedQuery) ||
        normalize(beat.artist).includes(normalizedQuery);
      // #region agent log
      if (normalizedQuery.length > 0) {
        fetch('http://127.0.0.1:7242/ingest/44a02008-2149-42a3-b009-7395498eb1e7', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'beats.tsx:66', message: 'Beat search match check', data: { beatId: beat.id, title: beat.title, artist: beat.artist, matchesSearch, normalizedTitle: normalize(beat.title), normalizedArtist: normalize(beat.artist) }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'D' }) }).catch(() => { });
      }
      // #endregion
      const matchesGenre = genre === 'All' || beat.genre === genre;
      const matchesBpm = bpmRange === 'All' || (() => {
        // If beat has no valid BPM, exclude it from BPM-filtered results
        if (typeof beat.bpm !== 'number' || isNaN(beat.bpm) || beat.bpm <= 0) {
          return false;
        }
        if (bpmRange.endsWith('+')) {
          const min = parseInt(bpmRange, 10);
          if (isNaN(min)) return true; // If parsing fails, include the beat
          return beat.bpm >= min;
        }
        const parts = bpmRange.split('-');
        if (parts.length !== 2) return true; // If format is invalid, include the beat
        const min = Number(parts[0]);
        const max = Number(parts[1]);
        if (isNaN(min) || isNaN(max)) return true; // If parsing fails, include the beat
        return beat.bpm >= min && beat.bpm <= max;
      })();

      return matchesSearch && matchesGenre && matchesBpm;
    });
  }, [allBeats, searchQuery, genre, bpmRange]);

  const paginatedBeats = useMemo(() => {
    const startIndex = (currentPage - 1) * beatsPerPage;
    return filteredBeats.slice(startIndex, startIndex + beatsPerPage);
  }, [filteredBeats, currentPage, beatsPerPage]);

  const totalPages = Math.ceil(filteredBeats.length / beatsPerPage);
  const hasMore = currentPage < totalPages;

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, genre, bpmRange]);

  const handlePlayPreview = (beat: Beat) => {
    playBeat(beat);
  };

  const handleAddToCart = (beat: Beat) => {
    addToCart({
      beat,
      license: 'mp3' // Default to mp3 license, can be enhanced with license selection
    });
  };
  */
  const [isLicenseComparisonOpen, setIsLicenseComparisonOpen] = useState(false);

  const heroImage = getHeroImage('beats');

  return (
    <>
      <Head>
        <title>Beat Store | YBF Studio</title>
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
          <div className="text-center space-y-12">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold text-3d-spline-text-primary text-balance">
                Professional <span className="text-3d-spline-accent">Beats</span> for Your Next Release
              </h1>
              <p className="text-lg md:text-xl text-3d-spline-text-secondary max-w-3xl mx-auto leading-relaxed">
                Discover premium beats across all genres. Each track is crafted for maximum impact and ready for your next hit. Preview, purchase, and download instantly.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* License Comparison Section */}
      <div className="card-3d-spline rounded-2xl p-8 mb-12">
        <AnimatedSection animation="fadeIn" delay={100}>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-3d-spline-text-primary mb-6">
              License <span className="text-3d-spline-accent">Comparison</span>
            </h2>
            <p className="text-xl text-3d-spline-text-secondary max-w-2xl mx-auto leading-relaxed mb-6">
              Understand the differences between license types to choose the right option for your project.
            </p>
            <Button
              variant="spline-secondary"
              onClick={() => setIsLicenseComparisonOpen(!isLicenseComparisonOpen)}
              aria-label={isLicenseComparisonOpen ? 'Hide license comparison information' : 'Show license comparison information'}
              aria-expanded={isLicenseComparisonOpen}
            >
              {isLicenseComparisonOpen ? 'Hide License Info' : 'Learn About Licenses'}
            </Button>
          </div>

          {isLicenseComparisonOpen && (
            <div className="max-w-6xl mx-auto">
              <LicenseComparison />
            </div>
          )}
        </AnimatedSection>
      </div>

      {/* BEATS GRID SECTION - TEMPORARILY HIDDEN UNTIL BEATS ARE UPLOADED */}
      {/* 
      <StickySearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        genre={genre}
        setGenre={setGenre}
        genres={genres}
        bpmRange={bpmRange}
        setBpmRange={setBpmRange}
        bpmRanges={bpmRanges}
      />

      <div className="card-3d-spline rounded-2xl p-8 mb-12 mt-8">
        <AnimatedSection animation="fadeIn" delay={200}>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-3d-spline-text-primary mb-6">
              {filteredBeats.length} <span className="text-3d-spline-accent">Beats</span> Found
            </h2>
            <p className="text-xl text-3d-spline-text-secondary max-w-2xl mx-auto leading-relaxed">
              {paginatedBeats.length < filteredBeats.length 
                ? `Showing ${paginatedBeats.length} of ${filteredBeats.length} beats`
                : searchQuery || genre !== 'All' 
                  ? 'Filtered results based on your search criteria' 
                  : 'Browse our complete collection of professional beats'}
            </p>
          </div>
          
          {filteredBeats.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedBeats.map((beat) => (
                <BeatCard
                  key={beat.id}
                  beat={beat}
                  onPlayPreview={handlePlayPreview}
                  onAddToCart={handleAddToCart}
                  variant="glass"
                />
                ))}
              </div>
              {hasMore && (
                <div className="text-center mt-8">
                  <Button
                    variant="spline-secondary"
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    size="lg"
                    aria-label={`Load more beats (showing page ${currentPage} of ${totalPages})`}
                  >
                    Load More Beats
                  </Button>
                </div>
              )}
            </>
          ) : (
            <AnimatedSection animation="fadeIn" delay={100}>
              <div className="text-center py-12 md:py-16">
                <div className="mb-6">
                  <Icon 
                    as={Music2} 
                    className="w-16 h-16 md:w-20 md:h-20 text-3d-spline-accent mx-auto mb-4"
                    title="No beats found"
                  />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-3d-spline-text-primary mb-3">
                  No Beats Found
                </h3>
                <p className="text-lg text-3d-spline-text-secondary mb-6 max-w-md mx-auto">
                  {(searchQuery || genre !== 'All' || bpmRange !== 'All')
                    ? "We couldn't find any beats matching your current filters. Try adjusting your search criteria."
                    : "No beats are currently available. Check back soon for new releases!"
                  }
                </p>
                
                {(searchQuery || genre !== 'All' || bpmRange !== 'All') && (
                  <div className="bg-neutral-900/50 rounded-xl p-6 mb-6 max-w-lg mx-auto">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Icon as={Filter} className="h-5 w-5 text-3d-spline-accent" />
                      <h4 className="text-sm font-semibold text-3d-spline-text-primary">Try These Suggestions</h4>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {genre !== 'All' && (
                        <span className="text-xs text-3d-spline-text-secondary">
                          Current genre: <span className="text-3d-spline-accent font-medium">{genre}</span>
                        </span>
                      )}
                      {bpmRange !== 'All' && (
                        <span className="text-xs text-3d-spline-text-secondary">
                          BPM range: <span className="text-3d-spline-accent font-medium">{bpmRange}</span>
                        </span>
                      )}
                      {searchQuery && (
                        <span className="text-xs text-3d-spline-text-secondary">
                          Search: <span className="text-3d-spline-accent font-medium">"{searchQuery}"</span>
                        </span>
                      )}
                    </div>
                    {genres.length > 1 && (
                      <p className="text-sm text-3d-spline-text-muted mt-4">
                        Available genres: {genres.filter(g => g !== 'All').join(', ')}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => {
                      setSearchQuery('');
                      setGenre('All');
                      setBpmRange('All');
                    }}
                    variant="spline-primary"
                    size="lg"
                    className="btn-3d-spline"
                    aria-label="Clear all search filters and show all beats"
                  >
                    Clear Filters
                  </Button>
                  {(searchQuery || genre !== 'All' || bpmRange !== 'All') && (
                    <Button
                      onClick={() => {
                        setSearchQuery('');
                        setGenre('All');
                        setBpmRange('All');
                      }}
                      variant="spline-secondary"
                      size="lg"
                      aria-label="View all available beats"
                    >
                      View All Beats
                    </Button>
                  )}
                </div>
              </div>
            </AnimatedSection>
          )}
        </AnimatedSection>
      </div>
      */}

    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  // Fetch all published beats from the 'beats' table
  const { error } = await supabase
    .from('beats')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching beats:', error);
  }

  // Normalize DB data (snake_case) to Beat interface (camelCase)
  // Prefer normalized beats via internal API to unify fallbacks and shapes
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  let allBeats: Beat[] = [];
  try {
    const res = await fetch(`${baseUrl}/api/beats`);
    if (res.ok) {
      const data = await res.json();
      allBeats = Array.isArray(data) ? data : [];
    }
  } catch (e) {
    console.error('Error fetching beats from API:', e);
  }

  return {
    props: {
      allBeats: allBeats || [],
      use3DSplineBackground: true,
    },
  };
};

export default Beats;
