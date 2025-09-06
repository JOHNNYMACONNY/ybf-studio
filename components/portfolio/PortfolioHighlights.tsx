import React, { useState, useRef } from 'react';
import Button from '../ui/Button';
import { Pause, Play } from 'lucide-react';
import { Icon } from '../ui/Icon';
import Card from '../ui/Card';
import AnimatedSection from '../ui/AnimatedSection';
import Image from 'next/image';

interface PortfolioProject {
  id: string;
  title: string;
  artist: string;
  genre: string;
  coverImage: string;
  audioUrl: string;
  description: string;
}

const featuredProjects: PortfolioProject[] = [
  {
    id: '1',
    title: 'Midnight Dreams',
    artist: 'Luna & The Stars',
    genre: 'R&B/Soul',
    coverImage: '/assets/beat_cover_1.png',
    audioUrl: '/audio/midnight-dreams.mp3',
    description: 'Smooth R&B track with soulful vocals and atmospheric production'
  },
  {
    id: '2',
    title: 'Urban Flow',
    artist: 'MC Flow',
    genre: 'Hip-Hop',
    coverImage: '/assets/beat_cover_2.png',
    audioUrl: '/audio/urban-flow.mp3',
    description: 'Hard-hitting hip-hop beat with trap influences and heavy bass'
  },
  {
    id: '3',
    title: 'Electric Nights',
    artist: 'Neon Pulse',
    genre: 'Electronic',
    coverImage: '/assets/beat_cover_3.png',
    audioUrl: '/audio/electric-nights.mp3',
    description: 'High-energy electronic track with synth leads and driving rhythm'
  },
  {
    id: '4',
    title: 'Acoustic Soul',
    artist: 'The Wanderers',
    genre: 'Folk/Acoustic',
    coverImage: '/assets/beat_cover_4.png',
    audioUrl: '/audio/acoustic-soul.mp3',
    description: 'Intimate acoustic performance with warm, organic production'
  }
];

const PortfolioHighlights: React.FC = () => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});

  const handlePlay = (projectId: string) => {
    const audioRef = audioRefs.current[projectId];
    
    // Stop all other audio
    Object.keys(audioRefs.current).forEach(id => {
      if (id !== projectId && audioRefs.current[id]) {
        audioRefs.current[id]?.pause();
        audioRefs.current[id]!.currentTime = 0;
      }
    });

    if (audioRef) {
      if (playingId === projectId) {
        audioRef.pause();
        setPlayingId(null);
      } else {
        audioRef.play();
        setPlayingId(projectId);
      }
    }
  };

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4 max-w-7xl">
        <AnimatedSection delay={150}>
                      <h2 className="font-display text-section lg:text-display-small font-bold text-white text-center mb-4">
              Featured Projects
            </h2>
        </AnimatedSection>
        <AnimatedSection delay={250}>
          <p className="text-body text-neutral-300 text-center mb-12 max-w-2xl mx-auto">
            Check out some of our recent work and hear the quality of our production
          </p>
        </AnimatedSection>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredProjects.map((project, index) => (
            <AnimatedSection key={project.id} delay={350 + (index * 100)}>
              <Card className="group cursor-pointer">
                {/* Cover Image */}
                <div className="relative mb-4 overflow-hidden rounded-lg">
                  <Image 
                    src={project.coverImage} 
                    alt={project.title}
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                {/* Project Info */}
                <div className="space-y-2">
                  <h3 className="text-card-title font-bold text-white">{project.title}</h3>
                  <p className="text-sm text-neutral-400">{project.artist}</p>
                  <p className="text-xs text-amber uppercase tracking-wide">{project.genre}</p>
                  <p className="text-sm text-neutral-300 line-clamp-2">{project.description}</p>
                </div>
                
                {/* Audio Player */}
                <div className="mt-4">
                  <Button
                    variant={playingId === project.id ? 'primary' : 'secondary'}
                    onClick={() => handlePlay(project.id)}
                    className="w-full"
                  >
                    <span className="inline-flex items-center gap-2">
                      {playingId === project.id ? (
                        <Icon as={Pause} className="h-4 w-4" />
                      ) : (
                        <Icon as={Play} className="h-4 w-4" />
                      )}
                      {playingId === project.id ? 'Pause' : 'Play'}
                    </span>
                  </Button>
                </div>
                
                {/* Hidden Audio Element */}
                <audio
                  ref={(el) => { audioRefs.current[project.id] = el; }}
                  src={project.audioUrl}
                  onEnded={() => setPlayingId(null)}
                />
              </Card>
            </AnimatedSection>
          ))}
        </div>
        
        {/* View Full Portfolio CTA */}
        <AnimatedSection delay={750}>
          <div className="text-center">
            <Button variant="primary" className="px-8 py-3 text-base">
              View Full Portfolio
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default PortfolioHighlights; 