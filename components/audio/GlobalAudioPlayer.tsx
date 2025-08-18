import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useUnifiedAudio } from './UnifiedAudioContext';
import Image from 'next/image';

const GlobalAudioPlayer: React.FC = () => {
  const { 
    currentTrack, 
    currentBeat,
    isPlaying, 
    togglePlayPause
  } = useUnifiedAudio();
  
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const previousVolume = useRef(volume);

  // Get current audio item (track or beat)
  const currentAudio = currentTrack || currentBeat;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    togglePlayPause();
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(previousVolume.current);
    } else {
      previousVolume.current = volume;
      setIsMuted(true);
      setVolume(0);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Get cover image based on audio type
  const getCoverImage = () => {
    if (currentTrack && 'coverImage' in currentTrack) {
      return currentTrack.coverImage;
    }
    if (currentBeat && 'coverArt' in currentBeat) {
      return currentBeat.coverArt;
    }
    return null;
  };

  if (!currentAudio) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-neutral-800 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Track Info */}
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className="w-12 h-12 bg-neutral-800 rounded-lg overflow-hidden flex-shrink-0">
              {getCoverImage() ? (
                <Image 
                  src={getCoverImage()!} 
                  alt={currentAudio.title}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-amber-500 to-emerald-500 flex items-center justify-center">
                  <span className="text-black font-bold text-card-title">
                    {currentAudio.title.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-medium text-white truncate">
                {currentAudio.title}
              </h4>
              <p className="text-xs text-neutral-400 truncate">
                {currentAudio.artist}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePlay}
              className="w-10 h-10 bg-amber-500 hover:bg-amber-600 rounded-full flex items-center justify-center transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-black" />
              ) : (
                <Play className="w-5 h-5 text-black ml-0.5" />
              )}
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex-1 mx-4">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-neutral-400 w-8">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="text-xs text-neutral-400 w-8">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMute}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-16 h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalAudioPlayer; 