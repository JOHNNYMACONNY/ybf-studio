import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import type { CartItem, LicenseType } from '../../components/ui/CartContext';
import { supabaseAdmin } from '../../lib/supabaseAdmin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-07-30.basil',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const cartItems: CartItem[] = req.body.items;

      if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
      }

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

      // Server-side validation: fetch beats from DB and compute prices from stored licenseTypes
      const beatIds = Array.from(
        new Set(
          cartItems
            .map((item) => item?.beat?.id)
            .filter((id): id is string => typeof id === 'string' && id.length > 0)
        )
      );

      if (beatIds.length === 0) {
        return res.status(400).json({ error: 'Invalid cart items' });
      }

      const { data: beatsFromDb, error: beatsError } = await supabaseAdmin
        .from('beats')
        .select('id, title, genre, bpm, coverArt, licenseTypes, status')
        .in('id', beatIds);

      if (beatsError) {
        return res.status(500).json({ error: 'Failed to validate items' });
      }

      // Build a map for quick lookup
      const idToBeat = new Map<string, {
        id: string;
        title: string;
        genre: string;
        bpm: number;
        coverArt?: string;
        licenseTypes?: Record<string, number>;
        status?: string;
      }>();
      (beatsFromDb || []).forEach((b) => idToBeat.set(b.id, b as {
        id: string;
        title: string;
        genre: string;
        bpm: number;
        coverArt?: string;
        licenseTypes?: Record<string, number>;
        status?: string;
      }));

      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

      for (const item of cartItems) {
        const dbBeat = item?.beat?.id ? idToBeat.get(item.beat.id) : null;
        const license: LicenseType | undefined = item?.license;

        if (!dbBeat || dbBeat.status !== 'published' || !license) {
          return res.status(400).json({ error: 'Invalid beat or license in cart' });
        }

        const priceForLicense = dbBeat.licenseTypes?.[license];
        if (typeof priceForLicense !== 'number' || priceForLicense <= 0) {
          return res.status(400).json({ error: 'Invalid license price' });
        }

        const rawImage: string | undefined = dbBeat.coverArt;
        const imageUrl = rawImage?.startsWith('http') ? rawImage : `${siteUrl}${rawImage || ''}`;

        line_items.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${dbBeat.title} - ${license.toUpperCase()} License`,
              images: imageUrl ? [imageUrl] : undefined,
              description: `Genre: ${dbBeat.genre}, BPM: ${dbBeat.bpm}`,
            },
            unit_amount: Math.round(priceForLicense * 100),
          },
          quantity: 1,
        });
      }

      const cartMetadata = JSON.stringify(
        cartItems.map((item) => ({
          beatId: item?.beat?.id,
          license: item?.license,
        }))
      );

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        metadata: { cartItems: cartMetadata },
        success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/cancel`,
      });

      return res.status(200).json({ sessionId: session.id });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Internal server error';
      return res.status(500).json({ statusCode: 500, message: errorMessage });
    }
  }

  res.setHeader('Allow', 'POST');
  return res.status(405).end('Method Not Allowed');
}


