import React from 'react';
import Image from 'next/image';
import { ShoppingCart, CreditCard, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../ui/CartContext';
import Button from '../ui/Button';
import { BEAT_LICENSES } from '../../lib/pricing-config';

interface CartProps {
  showCheckout?: boolean;
  compact?: boolean;
}

const Cart: React.FC<CartProps> = ({ showCheckout = true, compact = false }) => {
  const { cartItems, removeFromCart, cartTotal, cartCount, toggleCart } = useCart();

  const getLicenseName = (licenseId: string) => {
    return BEAT_LICENSES.find(license => license.id === licenseId)?.name || licenseId;
  };

  if (cartItems.length === 0) {
    return (
      <div className="card-3d-spline rounded-2xl p-8 text-center">
        <ShoppingCart className="w-16 h-16 text-3d-spline-text-muted mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-3d-spline-text-primary mb-2">
          Your Cart is Empty
        </h3>
        <p className="text-3d-spline-text-secondary mb-6">
          Add some beats to get started with your next project.
        </p>
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="btn-3d-spline text-white font-semibold px-6 py-3 rounded-lg"
        >
          Browse Beats
        </Button>
      </div>
    );
  }

  return (
    <div className="card-3d-spline rounded-2xl p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ShoppingCart className="w-6 h-6 text-3d-spline-accent" />
          <h3 className="text-2xl font-bold text-3d-spline-text-primary">
            Shopping Cart ({cartCount})
          </h3>
        </div>
        <Button
          onClick={toggleCart}
          variant="secondary"
          className="btn-3d-spline-accent text-white font-semibold px-4 py-2 rounded-lg text-sm"
        >
          View Full Cart
        </Button>
      </div>

      <div className={`space-y-4 ${compact ? 'max-h-96 overflow-y-auto' : ''}`}>
        {cartItems.map((item, index) => (
          <div
            key={`${item.beat.id}-${item.license}-${index}`}
            className="flex items-center gap-4 p-4 bg-neutral-900/50 rounded-lg border border-neutral-700"
          >
            <div className="relative w-12 h-12 flex-shrink-0">
              <Image
                src={item.beat.coverArt}
                alt={item.beat.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-3d-spline-text-primary truncate">
                {item.beat.title}
              </h4>
              <p className="text-sm text-3d-spline-text-secondary truncate">
                {item.beat.artist} • {getLicenseName(item.license)}
              </p>
              <p className="text-xs text-3d-spline-text-muted">
                {item.beat.genre} • {item.beat.bpm} BPM
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-lg font-bold text-3d-spline-accent">
                ${item.beat.licenseTypes?.[item.license]?.toFixed(2) || '0.00'}
              </span>
              <Button
                onClick={() => removeFromCart(item.beat.title)}
                variant="ghost"
                size="sm"
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="mt-6 pt-6 border-t border-neutral-700">
        <div className="flex justify-between items-center text-lg font-semibold">
          <span className="text-3d-spline-text-primary">Total:</span>
          <span className="text-3d-spline-accent">${cartTotal.toFixed(2)}</span>
        </div>
      </div>

      {showCheckout && (
        <div className="mt-6 space-y-3">
          <Button
            onClick={toggleCart}
            className="btn-3d-spline text-white font-semibold w-full py-3 rounded-lg"
          >
            <CreditCard className="w-5 h-5 mr-2" />
            Proceed to Checkout
          </Button>
          <Button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            variant="secondary"
            className="btn-3d-spline-accent text-white font-semibold w-full py-3 rounded-lg"
          >
            Continue Shopping
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;