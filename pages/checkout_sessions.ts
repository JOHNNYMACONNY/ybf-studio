import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { CartItem } from '../components/ui/CartContext';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const cartItems: CartItem[] = req.body.items;

      if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
      }

      const line_items = cartItems.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${item.beat.title} - ${item.license.toUpperCase()} License`,
            images: [item.beat.coverArt],
            description: `Genre: ${item.beat.genre}, BPM: ${item.beat.bpm}`,
          },
          unit_amount: Math.round(item.beat.price * 100), // Price in cents
        },
        quantity: 1,
      }));

      const cartMetadata = JSON.stringify(cartItems.map(item => ({
        beatId: item.beat.id,
        license: item.license,
      })));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        // Add cart details to metadata for the webhook
        metadata: { cartItems: cartMetadata },
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancel`,
      });

      res.status(200).json({ sessionId: session.id });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Internal server error';
      res.status(500).json({ statusCode: 500, message: errorMessage });
    }
  } else {
    if (res && res.setHeader) {
      res.setHeader('Allow', 'POST');
      res.status(405).end('Method Not Allowed');
    }
  }
}