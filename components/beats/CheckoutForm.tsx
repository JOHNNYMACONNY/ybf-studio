import React, { useState } from 'react';
import Link from 'next/link';
import { CreditCard, Lock, User, Mail, Phone, MapPin, Shield, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../Input';
import { useCart } from '../ui/CartContext';
import { getStripe } from '../../lib/stripe';

interface CheckoutFormProps {
  type?: 'beat' | 'service';
  serviceRequestId?: string;
  serviceName?: string;
  amount?: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  type = 'beat',
  serviceRequestId,
  serviceName,
  amount,
  onSuccess,
  onError
}) => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.customerName.trim()) return 'Name is required';
    if (!formData.customerEmail.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) return 'Valid email is required';

    if (type === 'service') {
      if (!serviceRequestId || !serviceName || !amount) return 'Service information is missing';
    } else {
      if (cartItems.length === 0) return 'Your cart is empty';
    }

    return null;
  };

  const handleBeatCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          customerEmail: formData.customerEmail,
          customerName: formData.customerName
        }),
      });

      if (!response.ok) throw new Error('Failed to create checkout session');

      const { sessionId } = await response.json();
      const stripe = await getStripe();
      await stripe?.redirectToCheckout({ sessionId });

      clearCart();
      onSuccess?.();
    } catch (error) {
      console.error('Checkout failed:', error);
      onError?.(error instanceof Error ? error.message : 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  const handleServiceCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/service-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_request_id: serviceRequestId,
          service_name: serviceName,
          amount,
          customer_email: formData.customerEmail
        }),
      });

      if (!response.ok) throw new Error('Failed to create checkout session');

      const { sessionId } = await response.json();
      const stripe = await getStripe();
      await stripe?.redirectToCheckout({ sessionId });

      onSuccess?.();
    } catch (error) {
      console.error('Service checkout failed:', error);
      onError?.(error instanceof Error ? error.message : 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      onError?.(error);
      return;
    }

    if (type === 'service') {
      await handleServiceCheckout();
    } else {
      await handleBeatCheckout();
    }
  };

  const totalAmount = type === 'service' ? amount : cartTotal;

  return (
    <div className="card-3d-spline rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <CreditCard className="w-6 h-6 text-3d-spline-accent" />
        <h2 className="text-2xl font-bold text-3d-spline-text-primary">
          {type === 'service' ? 'Service Payment' : 'Checkout'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-3d-spline-text-primary flex items-center gap-2">
            <User className="w-5 h-5" />
            Customer Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-3d-spline-text-secondary mb-2">
                Full Name *
              </label>
              <Input
                type="text"
                value={formData.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                placeholder="John Doe"
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-3d-spline-text-secondary mb-2">
                Email Address *
              </label>
              <Input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                placeholder="jmaconny@ybfstudio.com"
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-3d-spline-text-secondary mb-2">
                Phone Number
              </label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-neutral-900/50 rounded-lg p-6 border border-neutral-700">
          <h3 className="text-lg font-semibold text-3d-spline-text-primary mb-4">
            Order Summary
          </h3>

          {type === 'service' ? (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-3d-spline-text-secondary">{serviceName}</span>
                <span className="text-3d-spline-text-primary">${amount?.toFixed(2)}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {cartItems.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-3d-spline-text-secondary">
                    {item.beat.title} ({item.license})
                  </span>
                  <span className="text-3d-spline-text-primary">
                    ${item.beat.licenseTypes?.[item.license]?.toFixed(2) || '0.00'}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-neutral-700 mt-4 pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span className="text-3d-spline-text-primary">Total:</span>
              <span className="text-3d-spline-accent">${totalAmount?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </div>

        {/* Payment Notice */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-blue-400 font-medium mb-1">Secure Payment</h4>
              <p className="text-blue-200/80 text-sm">
                Your payment information is processed securely through Stripe.
                We do not store your credit card details.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="btn-3d-spline text-white font-semibold w-full py-4 rounded-lg disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Processing...
            </>
          ) : (
            <>
              <Lock className="w-5 h-5 mr-2" />
              Pay ${totalAmount?.toFixed(2) || '0.00'}
            </>
          )}
        </Button>

        {/* Footer Notice */}
        <div className="text-center text-xs text-3d-spline-text-muted">
          By completing this purchase, you agree to our{' '}
          <Link href="/terms" className="text-3d-spline-accent hover:underline">Terms of Service</Link>
          {' '}and{' '}
          <Link href="/privacy" className="text-3d-spline-accent hover:underline">Privacy Policy</Link>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;