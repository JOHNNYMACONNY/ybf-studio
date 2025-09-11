import React, { useState } from 'react';
import AnimatedSection from '../ui/AnimatedSection';
import { GlassCard } from '../ui/GlassCard';
import { GradientText } from '../ui/GradientText';
import { BeatCard } from './BeatCard';

// Mock data for demonstration
const mockBeats = [
  {
    id: '1',
    title: 'Midnight Dreams',
    artist: 'YBF Studio',
    genre: 'hip-hop',
    price: 29,
    cover: '/assets/beat_cover_1.png',
    audioUrl: '/audio/midnight-dreams.mp3',
    duration: '3:45',
    bpm: 140,
    key: 'C#'
  },
  {
    id: '2',
    title: 'Urban Flow',
    artist: 'YBF Studio',
    genre: 'trap',
    price: 35,
    cover: '/assets/beat_cover_2.png',
    audioUrl: '/audio/urban-flow.mp3',
    duration: '4:12',
    bpm: 150,
    key: 'F#'
  },
  {
    id: '3',
    title: 'Electric Nights',
    artist: 'YBF Studio',
    genre: 'electronic',
    price: 42,
    cover: '/assets/beat_cover_3.png',
    audioUrl: '/audio/electric-nights.mp3',
    duration: '3:58',
    bpm: 128,
    key: 'A'
  }
];

export const BeatGrid: React.FC = () => {
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedBpm, setSelectedBpm] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const genres = ['all', 'hip-hop', 'trap', 'r&b', 'pop', 'electronic'];
  const bpmRanges = ['all', '60-80', '80-100', '100-120', '120-140', '140+'];

  const handlePreview = (beat: typeof mockBeats[0]) => {
    console.log('Preview beat:', beat.title);
    // Implement audio preview functionality
  };

  const handlePurchase = (beat: typeof mockBeats[0]) => {
    console.log('Purchase beat:', beat.title);
    // Implement purchase functionality
  };

  const filteredBeats = mockBeats.filter(beat => {
    const matchesGenre = selectedGenre === 'all' || beat.genre === selectedGenre;
    const matchesSearch = beat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         beat.artist.toLowerCase().includes(searchQuery.toLowerCase());
    
    // BPM filtering logic
    let matchesBpm = true;
    if (selectedBpm !== 'all') {
      const [min, max] = selectedBpm.split('-').map(Number);
      if (selectedBpm === '140+') {
        matchesBpm = beat.bpm >= 140;
      } else {
        matchesBpm = beat.bpm >= min && beat.bpm <= max;
      }
    }

    return matchesGenre && matchesSearch && matchesBpm;
  });

  return (
    <section className="py-20 bg-gradient-premium">
      <div className="container mx-auto px-4">
        <AnimatedSection animation="fadeIn">
          <h2 className="text-4xl font-display font-medium text-center mb-16 text-white">
            Discover <GradientText gradient="teal-blue">Beats</GradientText>
          </h2>
        </AnimatedSection>

        {/* Filters */}
        <div className="mb-12">
          <GlassCard className="p-6" variant="elevated">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search beats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-teal-400 focus:outline-none"
                />
              </div>

              {/* Genre Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Genre
                </label>
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-teal-400 focus:outline-none"
                >
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre === 'all' ? 'All Genres' : genre.charAt(0).toUpperCase() + genre.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* BPM Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  BPM
                </label>
                <select
                  value={selectedBpm}
                  onChange={(e) => setSelectedBpm(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-teal-400 focus:outline-none"
                >
                  {bpmRanges.map((bpm) => (
                    <option key={bpm} value={bpm}>
                      {bpm === 'all' ? 'All BPM' : bpm}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSelectedGenre('all');
                    setSelectedBpm('all');
                    setSearchQuery('');
                  }}
                  className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Beat Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBeats.map((beat, index) => (
            <BeatCard
              key={beat.id}
              beat={beat}
              index={index}
              onPreview={handlePreview}
              onPurchase={handlePurchase}
            />
          ))}
        </div>

        {filteredBeats.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No beats found matching your criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
}; 