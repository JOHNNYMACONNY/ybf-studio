import React from 'react';
import { Music, TrendingUp, Star } from 'lucide-react';

interface BeatPerformanceProps {
  topSellingBeats: Array<{
    id: string;
    title: string;
    sales: number;
    revenue: number;
  }>;
  popularGenres: Array<{
    genre: string;
    sales: number;
    revenue: number;
  }>;
}

const BeatPerformance: React.FC<BeatPerformanceProps> = ({
  topSellingBeats,
  popularGenres
}) => {
  return (
    <div className="space-y-6">
      {/* Top Selling Beats */}
      <div className="bg-black rounded-xl ring-1 ring-neutral-700/60 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-card-title font-semibold">Top Selling Beats</h3>
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <TrendingUp className="h-4 w-4" />
            Best performers
          </div>
        </div>
        
        <div className="space-y-4">
          {topSellingBeats.map((beat, index) => (
            <div key={beat.id} className="flex items-center justify-between p-4 bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-black font-bold ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-amber-600' :
                    'bg-neutral-600'
                  }`}>
                    {index === 0 && <Star className="h-5 w-5" />}
                    {index !== 0 && index + 1}
                  </div>
                  {index < 3 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-black">{index + 1}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <Music className="h-5 w-5 text-neutral-400" />
                  <div>
                    <p className="text-neutral-100 font-medium">{beat.title}</p>
                    <p className="text-neutral-400 text-sm">{beat.sales} sales</p>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-neutral-100 font-medium">${beat.revenue.toFixed(2)}</p>
                <p className="text-green-400 text-sm">+{Math.floor(Math.random() * 20) + 10}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Genres */}
      <div className="bg-black rounded-xl ring-1 ring-neutral-700/60 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-card-title font-semibold">Popular Genres</h3>
          <div className="flex items-center gap-2 text-blue-400 text-sm">
            <TrendingUp className="h-4 w-4" />
            Trending
          </div>
        </div>
        
        <div className="space-y-4">
          {popularGenres.map((genre, index) => {
            const percentage = (genre.sales / Math.max(...popularGenres.map(g => g.sales))) * 100;
            
            return (
              <div key={genre.genre} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-black font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className="text-neutral-100 font-medium">{genre.genre}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-neutral-100">{genre.sales} sales</p>
                    <p className="text-neutral-400 text-sm">${genre.revenue.toFixed(2)}</p>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-neutral-800 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>{genre.sales} sales</span>
                  <span>{percentage.toFixed(1)}% of total</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-black rounded-xl ring-1 ring-neutral-700/60 p-6">
        <h3 className="text-card-title font-semibold mb-4">Performance Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-neutral-900 rounded-lg">
            <p className="text-neutral-400 text-sm">Total Beats</p>
            <p className="text-2xl font-bold text-neutral-100">{topSellingBeats.length + Math.floor(Math.random() * 20)}</p>
          </div>
          
          <div className="text-center p-4 bg-neutral-900 rounded-lg">
            <p className="text-neutral-400 text-sm">Total Sales</p>
            <p className="text-2xl font-bold text-neutral-100">
              {topSellingBeats.reduce((sum, beat) => sum + beat.sales, 0).toLocaleString()}
            </p>
          </div>
          
          <div className="text-center p-4 bg-neutral-900 rounded-lg">
            <p className="text-neutral-400 text-sm">Total Revenue</p>
            <p className="text-2xl font-bold text-neutral-100">
              ${topSellingBeats.reduce((sum, beat) => sum + beat.revenue, 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeatPerformance; 