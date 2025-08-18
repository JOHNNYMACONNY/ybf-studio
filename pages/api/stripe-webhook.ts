import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { supabaseAdmin } from '../../lib/supabaseAdmin';

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }

  const sig = req.headers['stripe-signature'];
  if (!sig) return res.status(400).send('Missing signature');

  // Read raw body
  const chunks: Buffer[] = [];
  await new Promise<void>((resolve) => {
    req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    req.on('end', () => resolve());
  });
  const buf = Buffer.concat(chunks);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig as string, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid signature';
    return res.status(400).send(`Webhook Error: ${message}`);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const requestId = session.metadata?.serviceRequestId;
      if (requestId) {
        await supabaseAdmin
          .from('service_requests')
          .update({ payment_status: 'paid', stripe_payment_intent_id: session.payment_intent as string })
          .eq('id', requestId);
      }
    } else if (event.type === 'charge.refunded') {
      const charge = event.data.object as Stripe.Charge;
      const requestId = (charge.metadata && (charge.metadata as Record<string, string>).serviceRequestId) || undefined;
      if (requestId) {
        await supabaseAdmin
          .from('service_requests')
          .update({ payment_status: 'refunded' })
          .eq('id', requestId);
      }
    }
  } catch (e) {
    console.error('Webhook handling error', e);
    return res.status(500).end('Webhook handler error');
  }

  return res.status(200).json({ received: true });
}


