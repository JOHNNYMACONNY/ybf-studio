import React, { createContext, useState, useContext, ReactNode, useRef } from 'react';
import type { Beat } from '../../types/beat';

interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  coverImage?: string;
}

interface UnifiedAudioContextType {
  currentTrack: AudioTrack | null;
  currentBeat: Beat | null;
  isPlaying: boolean;
  playTrack: (track: AudioTrack) => void;
  playBeat: (beat: Beat) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  stopTrack: () => void;
  togglePlayPause: () => void;
  closePlayer: () => void;
  queue: AudioTrack[];
  addToQueue: (track: AudioTrack) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;
}

const UnifiedAudioContext = createContext<UnifiedAudioContextType | undefined>(undefined);

export const UnifiedAudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [currentBeat, setCurrentBeat] = useState<Beat | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<AudioTrack[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playTrack = (track: AudioTrack) => {
    setCurrentTrack(track);
    setCurrentBeat(null);
    setIsPlaying(true);
    
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.addEventListener('ended', handleTrackEnd);
    }
    
    audioRef.current.src = track.url;
    audioRef.current.play().catch(error => {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    });
  };

  const playBeat = (beat: Beat) => {
    if (currentBeat?.title === beat.title) {
      togglePlayPause();
    } else {
      setCurrentBeat(beat);
      setCurrentTrack(null);
      setIsPlaying(true);
      
      if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.addEventListener('ended', handleTrackEnd);
      }
      
      // Use previewUrl for snippet system, fallback to audioUrl for legacy support
      const audioSource = beat.previewUrl || beat.audioUrl;
      audioRef.current.src = audioSource;
      audioRef.current.play().catch(error => {
        console.error('Error playing beat:', error);
        setIsPlaying(false);
      });
    }
  };

  const pauseTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resumeTrack = () => {
    if (audioRef.current && (currentTrack || currentBeat)) {
      audioRef.current.play().catch(error => {
        console.error('Error resuming audio:', error);
      });
      setIsPlaying(true);
    }
  };

  const stopTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (currentTrack || currentBeat) {
      if (isPlaying) {
        pauseTrack();
      } else {
        resumeTrack();
      }
    }
  };

  const closePlayer = () => {
    setCurrentBeat(null);
    setCurrentTrack(null);
    setIsPlaying(false);
  };

  const handleTrackEnd = () => {
    setIsPlaying(false);
    nextTrack();
  };

  const nextTrack = () => {
    if (queue.length > 0 && currentIndex < queue.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      playTrack(queue[nextIndex]);
    } else {
      setCurrentTrack(null);
      setCurrentBeat(null);
      setIsPlaying(false);
      setCurrentIndex(-1);
    }
  };

  const addToQueue = (track: AudioTrack) => {
    setQueue(prevQueue => [...prevQueue, track]);
  };

  const removeFromQueue = (trackId: string) => {
    setQueue(prevQueue => prevQueue.filter(track => track.id !== trackId));
  };

  const clearQueue = () => {
    setQueue([]);
    setCurrentIndex(-1);
  };

  return (
    <UnifiedAudioContext.Provider value={{
      currentTrack,
      currentBeat,
      isPlaying,
      playTrack,
      playBeat,
      pauseTrack,
      resumeTrack,
      stopTrack,
      togglePlayPause,
      closePlayer,
      queue,
      addToQueue,
      removeFromQueue,
      clearQueue
    }}>
      {children}
    </UnifiedAudioContext.Provider>
  );
};

export const useUnifiedAudio = (): UnifiedAudioContextType => {
  const context = useContext(UnifiedAudioContext);
  if (context === undefined) {
    throw new Error('useUnifiedAudio must be used within a UnifiedAudioProvider');
  }
  return context;
}; 