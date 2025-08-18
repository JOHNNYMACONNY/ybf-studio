import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import Stripe from 'stripe';
import { supabase } from '../lib/supabase';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Disable the default body parser for this route to receive the raw body
export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature']!;

    let event: Stripe.Event;

    try {
      // Verify the event came from Stripe
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error(`❌ Webhook signature verification failed: ${errorMessage}`);
      return res.status(400).send(`Webhook Error: ${errorMessage}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('✅ Checkout session completed!');

      // Fulfill the order...
      const customerEmail = session.customer_details?.email;
      const cartItems = JSON.parse(session.metadata!.cartItems);

      if (!customerEmail) {
        console.error('❌ Customer email not found in session.');
        return res.status(200).json({ received: true }); // Acknowledge receipt
      }

      // 1. Save the order to your database
      const { error } = await supabase.from('orders').insert({
        customer_email: customerEmail,
        stripe_session_id: session.id,
        items: cartItems,
        total: session.amount_total,
      });

      if (error) console.error('❌ Error saving order to database:', error);
      else console.log('📦 Order saved to database for:', customerEmail);

      // 2. Send an email with download links (simulation)
      console.log(`📧 Sending download links to ${customerEmail} for items:`, cartItems);
      // In a real app, you would integrate a service like SendGrid here
      // and generate secure, time-limited download links for each beat.
    }

    if (res && res.status) {
      res.status(200).json({ received: true });
    }
  } else {
    if (res && res.setHeader) {
      res.setHeader('Allow', 'POST');
      res.status(405).end('Method Not Allowed');
    }
  }
};

export default handler;