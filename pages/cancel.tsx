import React from 'react';
import Link from 'next/link';
import { XCircle } from 'lucide-react';
import Section from '../components/shared/Section';
import Button from '../components/ui/Button';

const CheckoutCancelPage: React.FC = () => {
  return (
    <div className="animate-fade-up-stagger animate-delay-1">
      <Section>
        <div className="text-center max-w-2xl mx-auto">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-display-medium">Checkout Canceled</h1>
          <p className="mt-6 text-body text-neutral-300">
            Your checkout session was canceled. Your cart has been saved, and you can complete your purchase at any time.
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

export default CheckoutCancelPage;