import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import Button from './ui/Button';

interface BeforeAfterPlayerProps {
  beforeSrc: string;
  afterSrc: string;
}

const BeforeAfterPlayer: React.FC<BeforeAfterPlayerProps> = ({ beforeSrc, afterSrc }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAfter, setShowAfter] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const beforeAudioRef = useRef<HTMLAudioElement>(null);
  const afterAudioRef = useRef<HTMLAudioElement>(null);
  const activeAudioRef = showAfter ? afterAudioRef : beforeAudioRef;

  const togglePlayPause = () => {
    if (isPlaying) {
      activeAudioRef.current?.pause();
    } else {
      beforeAudioRef.current?.pause();
      afterAudioRef.current?.pause();
      activeAudioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSwitch = (isAfter: boolean) => {
    const wasPlaying = isPlaying;
    const currentTime = activeAudioRef.current?.currentTime || 0;

    beforeAudioRef.current?.pause();
    afterAudioRef.current?.pause();
    setIsPlaying(false);

    setShowAfter(isAfter);

    setTimeout(() => {
      const newActiveAudioRef = isAfter ? afterAudioRef.current : beforeAudioRef.current;
      if (newActiveAudioRef) {
        newActiveAudioRef.currentTime = currentTime;
        if (wasPlaying) {
          newActiveAudioRef.play();
          setIsPlaying(true);
        }
      }
    }, 0);
  };
  
  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const audio = activeAudioRef.current;
    if (!audio) return;

    const setAudioData = () => setDuration(audio.duration);
    const setAudioTime = () => setProgress(audio.currentTime);

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    }
  }, [activeAudioRef]);

  return (
    <div className="rounded-xl bg-black ring-1 ring-neutral-800/60 shadow-sm p-6 w-full max-w-md mx-auto">
      <audio ref={beforeAudioRef} src={beforeSrc} preload="metadata" />
      <audio ref={afterAudioRef} src={afterSrc} preload="metadata" />
      
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-card-title">Hear the Difference</h3>
        <div className="flex items-center gap-2 rounded-full bg-neutral-800 p-1">
          <button 
            onClick={() => handleSwitch(false)}
            className={`px-3 py-1 text-sm rounded-full transition ${!showAfter ? 'bg-amber text-black font-semibold' : 'text-neutral-300'}`}
          >
            Before
          </button>
          <button 
            onClick={() => handleSwitch(true)}
            className={`px-3 py-1 text-sm rounded-full transition ${showAfter ? 'bg-amber text-black font-semibold' : 'text-neutral-300'}`}
          >
            After
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button onClick={togglePlayPause} variant="secondary" className="p-3 rounded-full">
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </Button>
        <div className="flex-grow flex items-center gap-2">
          <span className="text-xs text-neutral-400">{formatTime(progress)}</span>
          <div className="w-full bg-neutral-700 rounded-full h-1.5 cursor-pointer">
            <div 
              className="bg-amber h-1.5 rounded-full" 
              style={{ width: `${(progress / duration) * 100 || 0}%` }}
            ></div>
          </div>
          <span className="text-xs text-neutral-400">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterPlayer;