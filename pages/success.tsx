import React, { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import Section from '../components/shared/Section';
import Button from '../components/ui/Button';
import { useCart } from '../components/ui/CartContext';

const CheckoutSuccessPage: React.FC = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="animate-fade-up-stagger animate-delay-1">
      <Section>
        <div className="text-center max-w-2xl mx-auto">
          <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-6" />
          <h1 className="text-display-medium">Thank You for Your Order!</h1>
          <p className="mt-6 text-body text-neutral-300">
            Your payment was successful. You will receive an email shortly with your download links and license agreement.
          </p>
          <div className="mt-10">
            <Link href="/beats" passHref>
              <Button variant="primary">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default CheckoutSuccessPage;