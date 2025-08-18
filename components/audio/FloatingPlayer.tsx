import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';

// Simple icon components (you can replace with your preferred icon library)
const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const FloatingPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180); // 3 minutes demo

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <GlassCard className="w-80 p-4" variant="elevated">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-semibold text-white">Demo Track</h4>
            <p className="text-gray-400 text-sm">AudioServiceApp</p>
          </div>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? (
              <PauseIcon className="w-5 h-5 text-white" />
            ) : (
              <PlayIcon className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
        
        <div className="space-y-2">
          <div className="w-full bg-gray-700 rounded-full h-1">
            <div 
              className="bg-gradient-to-r from-teal-400 to-blue-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}; 