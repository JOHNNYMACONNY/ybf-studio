import React, { useState, useRef } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { Pause, Play } from 'lucide-react';
import { Icon } from '../ui/Icon';

interface BeforeAfterPlayerProps {
  beforeAudioUrl?: string;
  afterAudioUrl?: string;
}

const BeforeAfterPlayer: React.FC<BeforeAfterPlayerProps> = ({ 
  beforeAudioUrl = '/audio/before-demo.mp3',
  afterAudioUrl = '/audio/after-demo.mp3'
}) => {
  const [isPlaying, setIsPlaying] = useState<'before' | 'after' | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const beforeAudioRef = useRef<HTMLAudioElement>(null);
  const afterAudioRef = useRef<HTMLAudioElement>(null);

  const handlePlay = (type: 'before' | 'after') => {
    const audioRef = type === 'before' ? beforeAudioRef : afterAudioRef;
    const otherRef = type === 'before' ? afterAudioRef : beforeAudioRef;
    
    // Stop other audio
    if (otherRef.current) {
      otherRef.current.pause();
      otherRef.current.currentTime = 0;
    }
    
    if (audioRef.current) {
      if (isPlaying === type) {
        audioRef.current.pause();
        setIsPlaying(null);
      } else {
        audioRef.current.play();
        setIsPlaying(type);
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="p-8">
      <div className="text-center mb-8">
        <h3 className="text-section font-bold text-white mb-2">Before & After Demo</h3>
        <p className="text-neutral-300">Hear the difference professional mixing makes</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Before Audio */}
        <div className="space-y-4">
          <div className="text-center">
            <h4 className="text-card-title font-semibold text-white mb-2">Before Mix</h4>
            <Button
              variant="secondary"
              onClick={() => handlePlay('before')}
              className="w-full"
            >
              <span className="inline-flex items-center gap-2">
                {isPlaying === 'before' ? (
                  <Icon as={Pause} className="h-4 w-4" />
                ) : (
                  <Icon as={Play} className="h-4 w-4" />
                )}
                {isPlaying === 'before' ? 'Pause' : 'Play Before'}
              </span>
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-neutral-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div className="w-full bg-neutral-800 rounded-full h-2">
              <div 
                className="bg-amber h-2 rounded-full transition-all duration-100"
                style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* After Audio */}
        <div className="space-y-4">
          <div className="text-center">
            <h4 className="text-card-title font-semibold text-white mb-2">After Mix</h4>
            <Button
              variant="primary"
              onClick={() => handlePlay('after')}
              className="w-full"
            >
              <span className="inline-flex items-center gap-2">
                {isPlaying === 'after' ? (
                  <Icon as={Pause} className="h-4 w-4" />
                ) : (
                  <Icon as={Play} className="h-4 w-4" />
                )}
                {isPlaying === 'after' ? 'Pause' : 'Play After'}
              </span>
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-neutral-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div className="w-full bg-neutral-800 rounded-full h-2">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all duration-100"
                style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Audio Elements */}
      <audio
        ref={beforeAudioRef}
        src={beforeAudioUrl}
        onTimeUpdate={(e) => {
          if (isPlaying === 'before') {
            setCurrentTime(e.currentTarget.currentTime);
            setDuration(e.currentTarget.duration);
          }
        }}
        onEnded={() => setIsPlaying(null)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />
      <audio
        ref={afterAudioRef}
        src={afterAudioUrl}
        onTimeUpdate={(e) => {
          if (isPlaying === 'after') {
            setCurrentTime(e.currentTarget.currentTime);
            setDuration(e.currentTarget.duration);
          }
        }}
        onEnded={() => setIsPlaying(null)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />
    </Card>
  );
};

export default BeforeAfterPlayer; 