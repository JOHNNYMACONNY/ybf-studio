import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { PlayCircle, ShoppingCart, Clock, CreditCard, Info } from 'lucide-react';
import type { Beat } from '../types/beat';
import { BEAT_LICENSES } from '../lib/pricing-config';
import LicenseSelectModal from './ui/LicenseSelectModal';
import Badge from './ui/Badge';
import Button from './ui/Button';
import { useInteraction } from './hooks/useInteraction';

interface BeatCardProps {
  beat: Beat;
  onPlayPreview?: (beat: Beat) => void;
  onAddToCart?: (beat: Beat) => void;
  variant?: 'default' | 'glass';
}

const BeatCard: React.FC<BeatCardProps> = ({ beat, onPlayPreview, onAddToCart, variant = 'default' }) => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/44a02008-2149-42a3-b009-7395498eb1e7', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'BeatCard.tsx:17', message: 'BeatCard render', data: { beatId: beat.id, variant }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
  // #endregion
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [showLicenseInfo, setShowLicenseInfo] = useState(false);

  // Fast, consistent interaction feedback for primary CTAs
  const {
    isActive: isBuyActive,
    interactionProps: buyInteractionProps,
  } = useInteraction({ duration: 100 });
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/44a02008-2149-42a3-b009-7395498eb1e7', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'BeatCard.tsx:25', message: 'useInteraction buy hook success', data: { isBuyActive, buyPropsKeys: Object.keys(buyInteractionProps) }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
  // #endregion

  const {
    isActive: isCartActive,
    interactionProps: cartInteractionProps,
  } = useInteraction({ duration: 100 });
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/44a02008-2149-42a3-b009-7395498eb1e7', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'BeatCard.tsx:32', message: 'useInteraction cart hook success', data: { isCartActive, cartPropsKeys: Object.keys(cartInteractionProps) }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'B' }) }).catch(() => { });
  // #endregion

  const handlePlayPreview = () => {
    if (onPlayPreview) {
      onPlayPreview(beat);
    }
  };

  const handleAddToCart = () => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/44a02008-2149-42a3-b009-7395498eb1e7', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'BeatCard.tsx:38', message: 'handleAddToCart called', data: { beatId: beat.id, hasOnAddToCart: !!onAddToCart }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'B' }) }).catch(() => { });
    // #endregion
    if (onAddToCart) {
      onAddToCart(beat);
    }
  };

  // Fallback cover art (randomized if blank/invalid)
  const FALLBACKS = [
    '/assets/beatCovers/beat_cover_1.png',
    '/assets/beatCovers/beat_cover_2.png',
    '/assets/beatCovers/beat_cover_3.png',
    '/assets/beatCovers/beat_cover_4.png',
  ];
  const getRandomFallback = () => FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
  const selectDeterministicFallback = useMemo(() => {
    try {
      const id = beat.id || '';
      let hash = 0;
      for (let i = 0; i < id.length; i++) {
        hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
      }
      return FALLBACKS[hash % FALLBACKS.length];
    } catch {
      return FALLBACKS[0];
    }
  }, [beat.id]);
  const normalizedCover = typeof beat.coverArt === 'string' ? beat.coverArt.trim() : '';
  const initialCover = normalizedCover && normalizedCover.toLowerCase() !== 'null' && normalizedCover.toLowerCase() !== 'undefined' ? normalizedCover : selectDeterministicFallback;

  // Enforce Next.js allowed domains to prevent invalid remote images from breaking
  const ALLOWED_DOMAINS = new Set([
    'localhost',
    'lh3.googleusercontent.com',
    'www.ybfstudio.com',
    'ybfstudio.com',
    'yourcdn',
    'i1.sndcdn.com',
  ]);

  const initialSrc = useMemo(() => {
    try {
      if (initialCover.startsWith('http')) {
        const url = new URL(initialCover);
        if (!ALLOWED_DOMAINS.has(url.hostname)) {
          return getRandomFallback();
        }
      }
      return initialCover;
    } catch {
      return getRandomFallback();
    }
  }, [initialCover]);

  const [imgSrc, setImgSrc] = useState<string>(initialSrc);

  const handlePurchase = async (licenseType: 'mp3' | 'wav' | 'premium' | 'exclusive') => {
    try {
      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [
            {
              beat,
              license: licenseType,
            },
          ],
        }),
      });
      if (!response.ok) throw new Error('Failed to create checkout session');
      const { sessionId } = await response.json();
      const { getStripe } = await import('../lib/stripe');
      const stripe = await getStripe();
      await stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Purchase failed. Please try again.');
    }
  };

  const wrapperClass = variant === 'glass'
    ? 'card-3d-spline rounded-xl p-4 hover:scale-105 transition-transform group overflow-hidden'
    : 'card-interactive group overflow-hidden p-0 animate-fade-up-stagger';

  // Map genres to badge variants for color coding
  const getGenreBadgeVariant = (genre: string): 'primary' | 'success' | 'warning' | 'outline' => {
    if (!genre || typeof genre !== 'string') return 'outline';
    const genreLower = genre.toLowerCase();
    if (genreLower.includes('hip-hop') || genreLower.includes('trap') || genreLower.includes('drill')) {
      return 'primary';
    }
    if (genreLower.includes('r&b') || genreLower.includes('soul') || genreLower.includes('jazz')) {
      return 'success';
    }
    if (genreLower.includes('pop') || genreLower.includes('electronic') || genreLower.includes('edm')) {
      return 'warning';
    }
    return 'outline';
  };

  return (
    <>
      <div className={wrapperClass}>
        <div className="relative">
          <Image
            src={imgSrc}
            alt={`${beat.title} by ${beat.artist || 'Unknown artist'} - ${beat.genre || 'Music'} beat cover art`}
            width={400}
            height={400}
            className="w-full aspect-square object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            onError={() => {
              if (imgSrc !== selectDeterministicFallback) setImgSrc(selectDeterministicFallback);
            }}
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={handlePlayPreview}>
            <PlayCircle className="h-16 w-16 text-white hover:scale-110 transition-transform duration-200" />
          </div>
          {/* Duration Badge - positioned to avoid overlap with status badges */}
          {beat.previewDuration && (
            <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1 z-0">
              <Clock className="h-3 w-3" />
              {beat.previewDuration}
            </div>
          )}
          {/* Genre Badge */}
          {beat.genre && (
            <div className="absolute top-3 left-3 z-10">
              <Badge variant={getGenreBadgeVariant(beat.genre)} size="sm">
                {beat.genre}
              </Badge>
            </div>
          )}
          {/* Status Badges (New/Popular/Featured) - positioned to avoid overlap */}
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(beat as any).featured && (
            <div className="absolute top-12 right-3 z-10">
              <Badge variant="warning" size="sm">
                Featured
              </Badge>
            </div>
          )}
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(beat as any).isNew && !(beat as any).featured && (
            <div className="absolute top-12 right-3 z-10">
              <Badge variant="success" size="sm">
                New
              </Badge>
            </div>
          )}
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(beat as any).popular && !(beat as any).featured && !(beat as any).isNew && (
            <div className="absolute top-12 right-3 z-10">
              <Badge variant="primary" size="sm">
                Popular
              </Badge>
            </div>
          )}
        </div>
        <div className="p-6 space-y-4">
          <h3 className="text-2xl font-bold text-3d-spline-text-primary mb-2 truncate" title={beat.title}>{beat.title}</h3>
          <p className="text-sm text-3d-spline-text-muted mb-2 truncate" title={beat.artist}>{beat.artist}</p>
          <p className="text-sm text-3d-spline-text-muted mb-4">
            {beat.genre || 'Unknown'} • {beat.bpm || 'N/A'} BPM • {beat.duration || 'N/A'}
          </p>

          {/* License Options */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="text-sm font-semibold text-3d-spline-text-primary">License Options</div>
                {(() => {
                  const prices = BEAT_LICENSES.map(license =>
                    beat.licenseTypes?.[license.id as keyof typeof beat.licenseTypes] || license.price
                  ).filter(price => typeof price === 'number' && !isNaN(price) && price > 0);
                  if (prices.length === 0) return null; // Don't show if no valid prices
                  const minPrice = Math.min(...prices);
                  return (
                    <span className="text-xs text-3d-spline-accent font-medium">
                      Starting at ${minPrice}
                    </span>
                  );
                })()}
              </div>
              <button
                onClick={() => setShowLicenseInfo(!showLicenseInfo)}
                className="text-xs text-3d-spline-accent hover:text-3d-spline-primary flex items-center gap-1 transition-colors"
                aria-label="Show license information"
              >
                <Info className="h-3 w-3" />
                Info
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {BEAT_LICENSES.map((license) => {
                const price = beat.licenseTypes?.[license.id as keyof typeof beat.licenseTypes] || license.price;
                return (
                  <div
                    key={license.id}
                    className="card-3d-spline rounded-lg px-4 py-4 text-center transition-all cursor-pointer hover:scale-105 hover:border-3d-spline-accent/50 border border-neutral-700/50 min-h-[80px] flex flex-col justify-center"
                    onClick={() => setIsLicenseModalOpen(true)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsLicenseModalOpen(true);
                      }
                    }}
                    aria-label={`Select ${license.name} license for $${price}`}
                  >
                    <div className="text-xs font-semibold leading-tight text-3d-spline-text-primary mb-2">{license.name}</div>
                    <div className="text-lg sm:text-xl font-bold text-3d-spline-accent">
                      ${price}
                    </div>
                  </div>
                );
              })}
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

          <div className="flex gap-3 mt-6">
            <Button
              variant="spline-primary"
              size="sm"
              onClick={() => {
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/44a02008-2149-42a3-b009-7395498eb1e7', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'BeatCard.tsx:275', message: 'Buy button onClick', data: { beatId: beat.id }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'B' }) }).catch(() => { });
                // #endregion
                setIsLicenseModalOpen(true);
              }}
              className={`btn-3d-spline animate-glow-3d flex-1 ${isBuyActive ? 'scale-[0.97] translate-y-[1px]' : ''
                }`}
              {...buyInteractionProps}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Buy License</span>
              <span className="sm:hidden">Buy</span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleAddToCart}
              aria-label="Add to cart"
              className={`min-h-[44px] min-w-[44px] ${isCartActive ? 'scale-95 translate-y-[1px]' : ''
                }`}
              {...cartInteractionProps}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
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