import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import Stripe from 'stripe';
import { supabaseAdmin } from '../../lib/supabaseAdmin';
import { generateTemporaryDownloadLink } from '../../utils/download-links';
import { sendDownloadEmail } from '../../utils/email';

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-07-30.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'] as string;

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid signature';
      console.error('Stripe webhook signature verification failed:', message);
      return res.status(400).send(`Webhook Error: ${message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const customerEmail = session.customer_details?.email || undefined;
      const cartItems = session.metadata?.cartItems ? (JSON.parse(session.metadata.cartItems) as Array<{ beatId: string; license: 'mp3' | 'wav' | 'premium' | 'exclusive' }>) : [];

      if (!customerEmail) {
        console.error('Customer email not present in Stripe session');
        return res.status(200).json({ received: true });
      }

      // Fetch beats for email context
      const beatIds = Array.from(new Set(cartItems.map((i) => i.beatId).filter(Boolean)));
      const { data: beats, error: beatsError } = await supabaseAdmin
        .from('beats')
        .select('id, title, artist, licenseTypes')
        .in('id', beatIds);

      if (beatsError) {
        console.error('Failed to fetch beats for order:', beatsError);
      }
      const idToBeat = new Map<string, { id: string; title: string; artist: string; licenseTypes?: Record<string, number> }>();
      (beats || []).forEach((b) => idToBeat.set(b.id, b));

      // Generate download links and persist order
      const enrichedItems: Array<{ beatId: string; license: string; downloadUrl: string; expiresAt: string }> = [];
      for (const item of cartItems) {
        try {
          const { url, expiresAt } = await generateTemporaryDownloadLink(item.beatId, item.license === 'premium' ? 'premium' : item.license);
          enrichedItems.push({ beatId: item.beatId, license: item.license, downloadUrl: url, expiresAt: expiresAt.toISOString() });
        } catch (e) {
          console.error('Error generating link for item', item, e);
        }
      }

      const { error: insertError } = await supabaseAdmin.from('orders').insert({
        customer_email: customerEmail,
        stripe_session_id: session.id,
        items: enrichedItems,
        total: session.amount_total,
        status: 'completed',
      });
      if (insertError) {
        console.error('Error saving order:', insertError);
      }

      // Send one email per item (simple approach)
      for (const item of enrichedItems) {
        const beat = idToBeat.get(item.beatId);
        const licensePrice = typeof beat?.licenseTypes?.[item.license] === 'number' ? beat?.licenseTypes?.[item.license] : 0;
        try {
          await sendDownloadEmail({
            customerName: customerEmail.split('@')[0],
            customerEmail,
            beatTitle: beat?.title || 'Your Beat',
            artist: beat?.artist || 'Unknown Artist',
            licenseType: (item.license === 'premium' ? 'premium' : (item.license as 'mp3' | 'wav' | 'exclusive' | 'premium')),
            downloadUrl: item.downloadUrl,
            expiresAt: new Date(item.expiresAt),
            price: Number(licensePrice || 0),
          } as any);
        } catch (e) {
          console.error('Error sending download email:', e);
        }
      }
    }

    return res.status(200).json({ received: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    console.error('Stripe webhook handler error:', message);
    return res.status(500).json({ error: message });
  }
}


