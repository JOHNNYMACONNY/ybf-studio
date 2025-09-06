import React, { useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useUnifiedAudio } from './UnifiedAudioContext';
import Image from 'next/image';
import Script from 'next/script';

const GlobalAudioPlayer: React.FC = () => {
  const { 
    currentTrack,
    currentBeat,
    isPlaying,
    togglePlayPause,
    currentTime,
    duration,
    volume,
    isMuted,
    seekTo,
    setVolume,
    toggleMute,
    registerSoundCloudIframe
  } = useUnifiedAudio();
  
  const scIframeRef = useRef<HTMLIFrameElement | null>(null);

  // Get current audio item (track or beat)
  const currentAudio = currentTrack || currentBeat;
  const isSoundCloud = !!currentBeat?.previewUrl && currentBeat.previewUrl.includes('soundcloud.com');

  useEffect(() => {
    if (scIframeRef.current) {
      registerSoundCloudIframe(scIframeRef.current);
    }
  }, [scIframeRef.current]);

  const togglePlay = () => togglePlayPause();

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => seekTo(parseFloat(e.target.value));
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => setVolume(parseFloat(e.target.value));

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

        {isSoundCloud && currentBeat?.previewUrl && (
          <div className="mt-3 bg-black rounded-lg overflow-hidden">
            <Script src="https://w.soundcloud.com/player/api.js" strategy="afterInteractive" onLoad={() => {
              if (scIframeRef.current) {
                registerSoundCloudIframe(scIframeRef.current);
              }
            }} />
            <iframe
              ref={scIframeRef}
              width="100%"
              height="20"
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
              className="bg-black"
              src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(currentBeat.previewUrl)}&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&visual=false&color=f59e0b&show_artwork=false&show_playcount=false&buying=false&sharing=false&liking=false`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalAudioPlayer; 