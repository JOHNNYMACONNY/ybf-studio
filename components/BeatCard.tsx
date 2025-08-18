import React, { useState } from 'react';
import Image from 'next/image';
import { PlayCircle, ShoppingCart, Clock, CreditCard, Info } from 'lucide-react';
import type { Beat } from '../types/beat';
import { BEAT_LICENSES } from '../lib/pricing-config';
import LicenseSelectModal from './ui/LicenseSelectModal';

interface BeatCardProps {
  beat: Beat;
  onPlayPreview?: (beat: Beat) => void;
  onAddToCart?: (beat: Beat) => void;
}

const BeatCard: React.FC<BeatCardProps> = ({ beat, onPlayPreview, onAddToCart }) => {
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [showLicenseInfo, setShowLicenseInfo] = useState(false);

  const handlePlayPreview = () => {
    if (onPlayPreview) {
      onPlayPreview(beat);
    }
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(beat);
    }
  };

  const handlePurchase = async (licenseType: 'mp3' | 'wav' | 'premium' | 'exclusive') => {
    try {
      // For demo purposes, we'll show an alert
      // In production, this would redirect to Stripe checkout
      const license = BEAT_LICENSES.find(l => l.id === licenseType);
      const price = beat.licenseTypes[licenseType as keyof typeof beat.licenseTypes];
      alert(`Redirecting to checkout for ${beat.title} - ${license?.name} ($${price})`);
      
      // TODO: Implement actual purchase flow
      // const response = await fetch('/api/purchase', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     beatId: beat.id,
      //     licenseType,
      //     customerEmail: 'customer@example.com', // Get from user input
      //     customerName: 'Customer Name' // Get from user input
      //   })
      // });
      // const data = await response.json();
      // if (data.success && data.sessionId) {
      //   // Redirect to Stripe checkout
      //   window.location.href = `https://checkout.stripe.com/pay/${data.sessionId}`;
      // }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Purchase failed. Please try again.');
    }
  };

  return (
    <>
      <div className="card-interactive group overflow-hidden p-0 animate-fade-up-stagger">
        <div className="relative">
          <Image
            src={beat.coverArt}
            alt={beat.title}
            width={400}
            height={400}
            className="w-full aspect-square object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={handlePlayPreview}>
            <PlayCircle className="h-16 w-16 text-white hover:scale-110 transition-transform duration-200" />
          </div>
          <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {beat.previewDuration}
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-card-title text-display mb-2">{beat.title}</h3>
          <p className="text-neutral-500 mb-2">{beat.artist}</p>
          <p className="text-neutral-500 mb-4">{beat.genre} • {beat.bpm} BPM • {beat.duration}</p>
          
          {/* License Options */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-neutral-400">License Options:</div>
              <button
                onClick={() => setShowLicenseInfo(!showLicenseInfo)}
                className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1"
              >
                <Info className="h-3 w-3" />
                Info
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              {BEAT_LICENSES.map((license) => (
                <div key={license.id} className="bg-neutral-800 px-2 py-1 rounded text-center">
                  <div className="font-medium">{license.name}</div>
                  <div className="text-teal-400">${beat.licenseTypes[license.id as keyof typeof beat.licenseTypes]}</div>
                </div>
              ))}
            </div>
            
            {showLicenseInfo && (
              <div className="mt-3 p-3 bg-neutral-800 rounded text-xs">
                <div className="font-medium mb-2">License Comparison:</div>
                <div className="space-y-1">
                  {BEAT_LICENSES.map((license) => (
                    <div key={license.id} className="flex justify-between">
                      <span className="text-neutral-400">{license.name}:</span>
                      <span className="text-neutral-300">{license.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <button 
              className="btn-primary text-ui flex-1"
              onClick={() => setIsLicenseModalOpen(true)}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Buy License
            </button>
            <button 
              className="btn-secondary text-ui"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      <LicenseSelectModal
        isOpen={isLicenseModalOpen}
        onClose={() => setIsLicenseModalOpen(false)}
        beat={beat}
        licenses={BEAT_LICENSES}
        onPurchase={handlePurchase}
      />
    </>
  );
};

export default BeatCard;