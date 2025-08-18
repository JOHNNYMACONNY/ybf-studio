import React, { useState } from 'react';
import AnimatedSection from '../ui/AnimatedSection';
import { GlassCard } from '../ui/GlassCard';
import Image from 'next/image';

const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

interface Beat {
  id: string;
  title: string;
  artist: string;
  genre: string;
  price: number;
  cover: string;
  audioUrl: string;
  duration: string;
  bpm: number;
  key: string;
}

interface BeatCardProps {
  beat: Beat;
  index: number;
  onPreview: (beat: Beat) => void;
  onPurchase: (beat: Beat) => void;
}

export const BeatCard: React.FC<BeatCardProps> = ({ 
  beat, 
  index, 
  onPreview, 
  onPurchase 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <AnimatedSection delay={index * 50} animation="fadeIn">
      <div
        className="group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <GlassCard className="overflow-hidden hover:scale-105 transition-all duration-300">
          {/* Cover Image */}
          <div className="relative overflow-hidden rounded-lg mb-4">
            <Image 
              src={beat.cover} 
              alt={beat.title}
              width={400}
              height={192}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
            />
            
            {/* Overlay with Play Button */}
            <div className={`
              absolute inset-0 bg-gradient-to-t from-black/60 to-transparent 
              flex items-center justify-center transition-opacity duration-300
              ${isHovered ? 'opacity-100' : 'opacity-0'}
            `}>
              <button
                onClick={() => onPreview(beat)}
                className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <PlayIcon className="w-8 h-8 text-white" />
              </button>
            </div>

            {/* Beat Info Badge */}
            <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="text-xs text-white font-medium">{beat.duration}</span>
            </div>
          </div>

          {/* Beat Details */}
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-white mb-1">{beat.title}</h3>
              <p className="text-gray-400 text-sm">{beat.artist}</p>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>{beat.genre}</span>
              <span>{beat.bpm} BPM</span>
              <span>{beat.key}</span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-700">
              <span className="text-2xl font-bold text-teal-400">
                ${beat.price}
              </span>
              <button
                onClick={() => onPurchase(beat)}
                className="px-6 py-2 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full text-sm font-semibold hover:scale-105 transition-transform"
              >
                Purchase
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    </AnimatedSection>
  );
}; 