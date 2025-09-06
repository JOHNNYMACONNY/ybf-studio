import React, { createContext, useState, useContext, ReactNode, useRef, useEffect } from 'react';
import type { Beat } from '../../types/beat';

type SoundCloudWidget = {
  load: (url: string, options?: Record<string, unknown>) => void;
  play: () => void;
  pause: () => void;
  seekTo?: (ms: number) => void;
  setVolume?: (vol: number) => void;
  bind?: (event: string, listener: (e?: { currentPosition?: number }) => void) => void;
  getDuration?: (cb: (ms: number) => void) => void;
};

declare global {
  interface Window {
    SC?: {
      Widget: {
        (iframe: HTMLIFrameElement): SoundCloudWidget;
        Events: {
          READY: string;
          PLAY: string;
          PAUSE: string;
          FINISH: string;
          PLAY_PROGRESS: string;
        };
      };
    };
  }
}

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
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playTrack: (track: AudioTrack) => void;
  playBeat: (beat: Beat) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  stopTrack: () => void;
  togglePlayPause: () => void;
  closePlayer: () => void;
  seekTo: (timeSeconds: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  queue: AudioTrack[];
  addToQueue: (track: AudioTrack) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;
  registerSoundCloudIframe: (iframe: HTMLIFrameElement | null) => void;
}

const UnifiedAudioContext = createContext<UnifiedAudioContextType | undefined>(undefined);

export const UnifiedAudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [currentBeat, setCurrentBeat] = useState<Beat | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<AudioTrack[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  
  // Simple no-op function for now to avoid SSR issues
  const addToast = () => {};
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scWidgetRef = useRef<SoundCloudWidget | null>(null);
  const scIframeRef = useRef<HTMLIFrameElement | null>(null);
  const pendingScUrlRef = useRef<string | null>(null);

  // Sync HTML5 audio events to context state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMeta = () => setDuration(audio.duration || 0);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMeta);
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMeta);
    };
  }, [audioRef]);

  // Apply volume/mute to HTML5 audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
    if (scWidgetRef.current && scWidgetRef.current.setVolume) {
      // SoundCloud expects 0-100
      scWidgetRef.current.setVolume(isMuted ? 0 : Math.round(volume * 100));
    }
  }, [volume, isMuted]);

  const playTrack = (track: AudioTrack) => {
    setCurrentTrack(track);
    setCurrentBeat(null);
    setCurrentTime(0);
    setDuration(0);
    
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.addEventListener('ended', handleTrackEnd);
    }
    
    audioRef.current.src = track.url;
    audioRef.current.play()
      .then(() => setIsPlaying(true))
      .catch(error => {
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
      setCurrentTime(0);
      setDuration(0);
      
      // Resolve best playable source
      const preview = (beat.previewUrl || '').trim();
      const audio = (beat.audioUrl || '').trim();
      const full = (beat.fullTrackUrl || '').trim?.() || '';

      const isSc = !!preview && preview.includes('soundcloud.com');
      const directSrc = preview || audio || full;

      if (isSc) {
        // SoundCloud path: load via widget if available, else defer until READY
        console.log('SoundCloud URL detected. Attempting to load via widget:', preview);
        pendingScUrlRef.current = preview;
        if (scWidgetRef.current) {
          loadSoundCloudUrl(preview, true);
        }
        return;
      }

      if (!audioRef.current) {
        console.log('Creating new Audio element');
        audioRef.current = new Audio();
        audioRef.current.addEventListener('ended', handleTrackEnd);
        audioRef.current.addEventListener('error', (e) => {
          console.error('Audio element error event:', e);
        });
        audioRef.current.addEventListener('loadstart', () => {
          console.log('Audio loadstart event');
        });
        audioRef.current.addEventListener('canplay', () => {
          console.log('Audio canplay event');
        });
      }

      // Fallback to bundled demo preview if no direct source present
      const resolved = directSrc && directSrc !== 'undefined' && directSrc !== 'null' ? directSrc : '/audio/demo-preview.mp3';
      if (!directSrc) {
        console.info('No previewUrl/audioUrl provided for beat; using fallback preview:', beat.title);
        // TODO: Add toast notification when SSR issues are resolved
        // addToast({
        //   type: 'info',
        //   message: `Playing demo preview for "${beat.title}" - Preview URL not available`,
        //   duration: 4000
        // });
      }

      // Check if this is a SoundCloud URL that might be private
      const isScUrl = resolved.includes('soundcloud.com');
      if (isScUrl) {
        console.log('Detected SoundCloud URL, this will likely fail if track is private');
        // For private SoundCloud tracks, we should use the widget instead
        // But since the widget isn't rendered, let's try a different approach
      }

      console.log('Playing beat:', beat.title, 'with source:', resolved);
      audioRef.current.src = resolved;
      audioRef.current.play()
        .then(() => {
          console.log('Successfully playing:', resolved);
          setIsPlaying(true);
        })
        .catch(error => {
          console.error('Error playing beat:', error);
          console.error('Failed source URL:', resolved);
          console.error('Audio element state:', {
            readyState: audioRef.current.readyState,
            networkState: audioRef.current.networkState,
            error: audioRef.current.error
          });

          // If the local file fails, try to generate a simple beep tone
          if (!isScUrl) {
            console.log('Local audio failed, trying to generate beep tone...');
            generateBeepTone();
          } else {
          setIsPlaying(false);
          }
        });
    }
  };

  const pauseTrack = () => {
    const isSoundCloud = !!currentBeat?.previewUrl && currentBeat.previewUrl.includes('soundcloud.com');
    if (isSoundCloud) {
      // Control SoundCloud widget if available
      if (scWidgetRef.current && scWidgetRef.current.pause) {
        scWidgetRef.current.pause();
      }
      setIsPlaying(false);
      return;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resumeTrack = () => {
    const isSoundCloud = !!currentBeat?.previewUrl && currentBeat.previewUrl.includes('soundcloud.com');
    if (isSoundCloud) {
      // Control SoundCloud widget if available
      if (scWidgetRef.current && scWidgetRef.current.play) {
        scWidgetRef.current.play();
      }
      setIsPlaying(true);
      return;
    }
    if (audioRef.current && (currentTrack || currentBeat)) {
      audioRef.current.play().catch(error => {
        console.error('Error resuming audio:', error);
      });
      setIsPlaying(true);
    }
  };

  const stopTrack = () => {
    const isSoundCloud = !!currentBeat?.previewUrl && currentBeat.previewUrl.includes('soundcloud.com');
    if (isSoundCloud) {
      // Pause and reset position on SoundCloud widget if available
      try {
        if (scWidgetRef.current) {
          if (scWidgetRef.current.pause) scWidgetRef.current.pause();
          if (scWidgetRef.current.seekTo) scWidgetRef.current.seekTo(0);
        }
      } catch {}
      setIsPlaying(false);
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (currentTrack || currentBeat) {
      const isSoundCloud = !!currentBeat?.previewUrl && currentBeat.previewUrl.includes('soundcloud.com');
      if (isSoundCloud) {
        // Toggle via widget if available
        if (scWidgetRef.current) {
          if (isPlaying) {
            pauseTrack();
          } else {
            resumeTrack();
          }
        }
        return;
      }
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
    setCurrentTime(0);
    setDuration(0);
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

  const seekTo = (timeSeconds: number) => {
    const isSoundCloud = !!currentBeat?.previewUrl && currentBeat.previewUrl.includes('soundcloud.com');
    if (isSoundCloud) {
      // Seek via SoundCloud widget if available
      if (scWidgetRef.current && scWidgetRef.current.seekTo) {
        scWidgetRef.current.seekTo(timeSeconds * 1000);
      }
      setCurrentTime(timeSeconds);
      return;
    }
    if (audioRef.current) {
      audioRef.current.currentTime = timeSeconds;
      setCurrentTime(timeSeconds);
    }
  };

  const setVolume = (vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolumeState(clamped);
    setIsMuted(clamped === 0);
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const registerSoundCloudIframe = (iframe: HTMLIFrameElement | null) => {
    scIframeRef.current = iframe;
    if (!iframe) {
      scWidgetRef.current = null;
      return;
    }
    try {
      const SC = window.SC;
      if (SC && SC.Widget) {
        scWidgetRef.current = SC.Widget(iframe);
        attachSoundCloudEvents();
        // Apply initial volume
        if (scWidgetRef.current.setVolume) scWidgetRef.current.setVolume(isMuted ? 0 : Math.round(volume * 100));
        // If a URL is pending, load it now
        if (pendingScUrlRef.current) {
          const url = pendingScUrlRef.current;
          pendingScUrlRef.current = null;
          loadSoundCloudUrl(url, true);
        }
      }
    } catch (e) {
      // Widget not ready yet; will be retried when script loads in player
    }
  };

  const attachSoundCloudEvents = () => {
    if (!scWidgetRef.current) return;
    try {
      const SC = window.SC;
      const Events = SC?.Widget?.Events;
      if (!Events) return;
      if (scWidgetRef.current.bind) {
        scWidgetRef.current.bind(Events.READY, () => {
          if (scWidgetRef.current && scWidgetRef.current.setVolume) {
            scWidgetRef.current.setVolume(isMuted ? 0 : Math.round(volume * 100));
          }
          if (pendingScUrlRef.current) {
            const url = pendingScUrlRef.current;
            pendingScUrlRef.current = null;
            loadSoundCloudUrl(url, true);
          }
        });
        scWidgetRef.current.bind(Events.PLAY, () => setIsPlaying(true));
        scWidgetRef.current.bind(Events.PAUSE, () => setIsPlaying(false));
        scWidgetRef.current.bind(Events.FINISH, () => {
          setIsPlaying(false);
          handleTrackEnd();
        });
        scWidgetRef.current.bind(Events.PLAY_PROGRESS, (e?: { currentPosition?: number }) => {
          if (e && typeof e.currentPosition === 'number') {
            setCurrentTime(e.currentPosition / 1000);
          }
        });
      }
      if (scWidgetRef.current.getDuration) {
        scWidgetRef.current.getDuration((ms: number) => setDuration((ms || 0) / 1000));
      }
    } catch (e) {
      // ignore
    }
  };

  const loadSoundCloudUrl = (url: string, autoPlay: boolean) => {
    if (!scWidgetRef.current || !scWidgetRef.current.load) return;
    scWidgetRef.current.load(url, {
      auto_play: autoPlay,
      hide_related: true,
      show_comments: false,
      show_user: false,
      show_reposts: false,
      visual: false,
      buying: false,
      sharing: false,
      liking: false,
    });
    // Refresh duration once loaded
    try {
      if (scWidgetRef.current.getDuration) {
        scWidgetRef.current.getDuration((ms: number) => setDuration((ms || 0) / 1000));
      }
    } catch {}
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

  // Generate a simple beep tone as ultimate fallback
  const generateBeepTone = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 440; // A4 note
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);

      setIsPlaying(true);
      console.log('Generated beep tone as fallback');

      // Stop playing after the beep
      setTimeout(() => {
        setIsPlaying(false);
      }, 500);
    } catch (error) {
      console.error('Failed to generate beep tone:', error);
      setIsPlaying(false);
    }
  };

  return (
    <UnifiedAudioContext.Provider value={{
      currentTrack,
      currentBeat,
      isPlaying,
      currentTime,
      duration,
      volume,
      isMuted,
      playTrack,
      playBeat,
      pauseTrack,
      resumeTrack,
      stopTrack,
      togglePlayPause,
      closePlayer,
      seekTo,
      setVolume,
      toggleMute,
      queue,
      addToQueue,
      removeFromQueue,
      clearQueue,
      registerSoundCloudIframe
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