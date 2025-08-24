import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { supabaseAdmin } from '../../lib/supabaseAdmin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type ApiResponse = { success: boolean; sessionId?: string; url?: string | null; error?: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { service_request_id, service_name, amount, customer_email } = req.body as { 
      service_request_id?: string;
      service_name?: string;
      amount?: number;
      customer_email?: string;
    };
    
    if (!service_request_id || !service_name || !amount || !customer_email) {
      return res.status(400).json({ 
        success: false, 
        error: 'service_request_id, service_name, amount, and customer_email are required' 
      });
    }

    // Verify the service request exists and is pending payment
    const { data: reqRow, error: reqErr } = await supabaseAdmin
      .from('service_requests')
      .select('id, payment_status')
      .eq('id', service_request_id)
      .maybeSingle();

    if (reqErr) {
      return res.status(500).json({ success: false, error: 'Failed to load service request' });
    }
    if (!reqRow) {
      return res.status(404).json({ success: false, error: 'Service request not found' });
    }

    if (reqRow.payment_status && reqRow.payment_status !== 'pending') {
      return res.status(400).json({ success: false, error: 'Request already paid or refunded' });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Service: ${service_name}`,
              description: 'Professional audio mixing and mastering service',
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: customer_email,
      metadata: {
        serviceRequestId: service_request_id,
        serviceName: service_name,
        amount: amount.toString(),
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'}/services`,
    });

    return res.status(200).json({ success: true, sessionId: session.id, url: (session as any).url || null });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Internal server error';
    console.error('Service checkout error:', e);
    return res.status(500).json({ success: false, error: msg });
  }
}


