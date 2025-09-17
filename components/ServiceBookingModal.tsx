import React, { useState, useEffect } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import Toast from './ui/Toast';
import { Service } from '../types/service';
import { useSession } from 'next-auth/react';
import { getStripe } from '../lib/stripe';

interface ServiceBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
}

const ServiceBookingModal: React.FC<ServiceBookingModalProps> = ({ isOpen, onClose, service }) => {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    project_name: '',
    project_description: '',
    special_instructions: '',
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);

  // Debug logging removed for production

  useEffect(() => {
    // Reset form when modal is closed or service changes
    if (!isOpen) {
      setFormData({
        customer_name: '',
        customer_email: '',
        project_name: '',
        project_description: '',
        special_instructions: '',
      });
    } else if (isOpen && session?.user) {
      // Pre-fill form if user is logged in
      setFormData(prev => ({
        ...prev,
        customer_name: session.user.name || prev.customer_name,
        customer_email: session.user.email || prev.customer_email,
      }));
    }
  }, [isOpen, session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;

    setLoading(true);
    setToast(null);

    try {
      // Client-side validation to avoid server 400s
      const trimmedName = formData.customer_name.trim();
      if (trimmedName.length < 2) {
        setToast({ message: 'Full name must be at least 2 characters.', type: 'error' });
        return;
      }

      const requestData = {
        ...formData,
        service_id: service.id,
        price_paid: service.price,
      };
      
      // First create the service request
      const response = await fetch('/api/service-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'An unknown error occurred.');
      }

      // If service request created successfully, redirect to Stripe checkout
      const createdRequestId = (result && (result.id || result.request?.id)) as string | undefined;
      if (createdRequestId) {
        const stripe = await getStripe();
        if (stripe) {
          // Create Stripe checkout session
          const checkoutResponse = await fetch('/api/service-checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              service_request_id: createdRequestId,
              service_name: service.name,
              amount: service.price,
              customer_email: formData.customer_email,
            }),
          });

          const checkoutResult = await checkoutResponse.json();

          if (checkoutResponse.ok && checkoutResult.sessionId) {
            // Redirect to Stripe checkout
            const redirectResult = await stripe.redirectToCheckout({
              sessionId: checkoutResult.sessionId,
            });
            if (redirectResult?.error) {
              console.error('Stripe redirect error:', redirectResult.error.message);
              setToast({ message: redirectResult.error.message ?? 'Stripe redirect failed.', type: 'error' });
            }
            // Fallback: open session URL if provided
            if (checkoutResult.url) {
              window.location.href = checkoutResult.url;
            }
          } else {
            throw new Error(checkoutResult.error || 'Failed to create checkout session.');
          }
        } else {
          throw new Error('Stripe failed to load.');
        }
      } else {
        throw new Error('Failed to create service request (no id returned).');
      }

    } catch (error) {
      console.error('Booking flow error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit booking.';
      setToast({ message: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!service) return null;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={`Book: ${service.name}`} size="lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-neutral-400">
            Complete the form below to book your service. You&apos;ll be redirected to secure payment processing.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              name="customer_name" 
              value={formData.customer_name} 
              onChange={handleChange} 
              placeholder="Your Name" 
              required 
              label="Full Name *" 
            />
            <Input 
              type="email" 
              name="customer_email" 
              value={formData.customer_email} 
              onChange={handleChange} 
              placeholder="jmaconny@ybfstudio.com" 
              required 
              label="Email Address *" 
            />
          </div>

          <Input 
            name="project_name" 
            value={formData.project_name} 
            onChange={handleChange} 
            placeholder="e.g., My New Single" 
            label="Project/Song Title (Optional)" 
          />

          <Textarea 
            name="project_description" 
            value={formData.project_description} 
            onChange={handleChange} 
            rows={3} 
            placeholder="Tell us about your project, its genre, and what you're looking for."
            label="Project Description (Optional)"
          />

          <Textarea 
            name="special_instructions" 
            value={formData.special_instructions} 
            onChange={handleChange} 
            rows={3} 
            placeholder="Any specific requests or details for our engineers?" 
            label="Special Instructions (Optional)" 
          />

          <div className="text-right text-lg font-bold text-white">Total: ${service.price.toFixed(2)}</div>

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-700">
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </Button>
          </div>
        </form>
      </Modal>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
};

export default ServiceBookingModal;
