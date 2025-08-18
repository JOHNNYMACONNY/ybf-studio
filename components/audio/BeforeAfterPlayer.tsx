import React, { useState } from 'react';
import AnimatedSection from '../ui/AnimatedSection';
import { GlassCard } from '../ui/GlassCard';
import { GradientText } from '../ui/GradientText';

const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

export const BeforeAfterPlayer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'before' | 'after'>('before');

  return (
    <section className="py-20 bg-gradient-premium">
      <div className="container mx-auto px-4">
        <AnimatedSection animation="fadeIn">
          <h2 className="text-4xl font-display font-medium text-center mb-16 text-white">
            Hear the <GradientText gradient="teal-blue">Difference</GradientText>
          </h2>
        </AnimatedSection>

        <div className="max-w-4xl mx-auto">
          <GlassCard className="p-8" variant="elevated">
            {/* Tab Navigation */}
            <div className="flex mb-8 border-b border-gray-700">
              <button
                onClick={() => setActiveTab('before')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'before'
                    ? 'text-teal-400 border-b-2 border-teal-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Before
              </button>
              <button
                onClick={() => setActiveTab('after')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'after'
                    ? 'text-teal-400 border-b-2 border-teal-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                After
              </button>
            </div>

            {/* Audio Player */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white">
                    {activeTab === 'before' ? 'Original Track' : 'Mastered Track'}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {activeTab === 'before' ? 'Before mastering' : 'After professional mastering'}
                  </p>
                </div>
                <button className="w-12 h-12 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform">
                  <PlayIcon className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Waveform Visualization */}
              <div className="w-full h-16 bg-gray-800 rounded-lg flex items-center px-4">
                <div className="w-full h-8 flex items-end space-x-1">
                  {Array.from({ length: 50 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-t from-teal-400 to-blue-500 rounded-sm transition-all duration-300"
                      style={{
                        height: `${Math.random() * 100}%`,
                        width: '2px'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}; 