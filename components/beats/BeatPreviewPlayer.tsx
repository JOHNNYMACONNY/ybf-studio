import React, { useState, useRef, useEffect } from 'react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface BeatPreviewPlayerProps {
  beat: {
    id: string;
    title: string;
    artist: string;
    audioUrl: string;
    duration: string;
    genre: string;
    price: string;
    isNew?: boolean;
  };
}

const BeatPreviewPlayer: React.FC<BeatPreviewPlayerProps> = ({ beat }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Generate deterministic waveform heights based on beat ID
  const generateWaveformHeights = (id: string) => {
    const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return Array.from({ length: 20 }, (_, i) => {
      const pseudoRandom = Math.sin(seed + i) * 0.5 + 0.5;
      return Math.floor(pseudoRandom * 60 + 20);
    });
  };

  const waveformHeights = generateWaveformHeights(beat.id);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="rounded-xl bg-black ring-1 ring-neutral-800/60 shadow-sm p-6 transition-all duration-200 hover:ring-neutral-700 hover:scale-105">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-card-title font-medium tracking-tight font-sans text-neutral-100">{beat.title}</h3>
            {beat.isNew && <Badge variant="primary">New</Badge>}
          </div>
          <p className="text-sm text-neutral-500 font-sans">{beat.artist}</p>
          <p className="text-xs text-neutral-400 font-sans">{beat.genre}</p>
        </div>
        <div className="text-right">
          <div className="text-section font-semibold text-amber-500">{beat.price}</div>
          <div className="text-xs text-neutral-500 font-sans">{beat.duration}</div>
        </div>
      </div>

      {/* Simple Waveform Visualization */}
      <div className="mb-4">
        <div className="h-12 bg-neutral-900 rounded-lg p-2 flex items-end gap-1">
          {waveformHeights.map((height, i) => (
            <div
              key={i}
              className={`flex-1 rounded-sm transition-all duration-300 ${
                isPlaying && i < Math.floor(progress / 5)
                  ? 'bg-amber-500'
                  : 'bg-neutral-700'
              }`}
              style={{
                height: `${height}%`,
                animationDelay: isClient ? `${i * 50}ms` : '0ms'
              }}
            />
          ))}
        </div>
      </div>

      {/* Audio Controls */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-500/90 flex items-center justify-center transition-all duration-200 active:scale-95 focus-visible:ring focus-visible:ring-amber-400"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        
        <div className="flex-1">
          <div className="flex justify-between text-xs text-neutral-500 mb-1 font-sans">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="w-full bg-neutral-800 rounded-full h-1">
            <div
              className="bg-amber-500 h-1 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button variant="primary" className="flex-1">
          Add to Cart
        </Button>
        <Button variant="secondary" className="px-4">
          Preview
        </Button>
      </div>

      <audio ref={audioRef} src={beat.audioUrl} preload="metadata" />
    </div>
  );
};

export default BeatPreviewPlayer; 