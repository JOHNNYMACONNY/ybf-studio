import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { supabaseAdmin } from '../../lib/supabaseAdmin';
import { checkRateLimit } from '../../utils/rate-limiting';
import { sendBookingConfirmationEmail, sendBookingInternalEmail } from '../../utils/email';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Basic rate limiting by IP
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
    const rate = checkRateLimit(`service-requests:${ip}`, { windowMs: 60_000, max: 10 });
    if (!rate.allowed) {
      res.setHeader('Retry-After', String(rate.retryAfter || 60));
      return res.status(429).json({ error: rate.reason || 'Too many requests' });
    }

    // Get session to check for a logged-in user
    const session = await getServerSession(req, res, authOptions);

    const body = req.body || {};
    console.log('Service requests API received body:', body);
    
    const toStr = (v: unknown) => (typeof v === 'string' ? v : typeof v === 'number' ? String(v) : '');
    const toTrimmed = (v: unknown, max: number) => toStr(v).trim().slice(0, max);
    const service_id = toStr(body.service_id);
    const customer_name = toTrimmed(body.customer_name, 120);
    const customer_email = toTrimmed(body.customer_email, 200);
    const project_name = toTrimmed(body.project_name, 200);
    const project_description = toTrimmed(body.project_description, 5000);
    const special_instructions = toTrimmed(body.special_instructions, 2000);
    const price_paid = typeof body.price_paid === 'number' ? body.price_paid : Number(body.price_paid);
    
    console.log('Parsed values:', { service_id, customer_name, customer_email, price_paid });

    // Basic validation + length caps already enforced above
    const errors: string[] = [];
    const isUuid = (v: string) => typeof v === 'string' && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(v);
    const isEmail = (v: string) => typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

    if (!service_id || !isUuid(service_id)) errors.push('service_id is required and must be a valid UUID');
    if (!customer_name || customer_name.length < 2) errors.push('customer_name is required (min 2 chars)');
    if (!customer_email || !isEmail(customer_email)) errors.push('customer_email is required and must be a valid email');
    if (typeof price_paid !== 'number' || Number.isNaN(price_paid) || price_paid < 0) errors.push('price_paid must be a non-negative number');

    console.log('Validation errors:', errors);
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join('; ') });
    }

    // Ensure the service exists and is active
    const { data: svc, error: svcErr } = await supabaseAdmin
      .from('services')
      .select('id')
      .eq('id', service_id)
      .eq('status', 'active')
      .is('deleted_at', null)
      .maybeSingle();

    if (svcErr) {
      return res.status(500).json({ error: 'Failed to verify service' });
    }
    if (!svc?.id) {
      return res.status(400).json({ error: 'Invalid service_id (not active or does not exist)' });
    }

    const userId = session?.user?.id || null;

    const { data, error } = await supabaseAdmin
      .from('service_requests')
      .insert([
        {
          user_id: userId,
          service_id,
          customer_name,
          customer_email,
          project_name,
          project_description,
          special_instructions,
          price_paid,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Fire-and-forget emails; do not block the response. Log failures.
    const serviceName = (await supabaseAdmin.from('services').select('name').eq('id', service_id).maybeSingle()).data?.name || 'Selected Service';
    Promise.allSettled([
      sendBookingConfirmationEmail({
        customerName: customer_name,
        customerEmail: customer_email,
        serviceName,
        price: Number(price_paid || 0),
      }),
      sendBookingInternalEmail({
        customerName: customer_name,
        customerEmail: customer_email,
        serviceName,
        price: Number(price_paid || 0),
        projectName: project_name,
        customerNote: project_description || special_instructions,
      })
    ]).then((results) => {
      results.forEach((r, idx) => {
        const which = idx === 0 ? 'confirmation' : 'internal';
        if (r.status === 'rejected') {
          console.error('Email send failure', { which, error: r.reason });
        }
        if (r.status === 'fulfilled') {
          const val = r.value as { success?: boolean } | undefined;
          if (val && val.success === false) {
            console.error('Email send failure', { which, error: val });
          }
        }
      });
    }).catch((e) => {
      console.error('Email send failure (outer)', e);
    });

    return res.status(201).json({ message: 'Service request created successfully.', request: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
    console.error('API error creating service request:', err);
    return res.status(500).json({ error: message });
  }
}
