import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { createClient } from '@supabase/supabase-js';
import sgMail, { MailDataRequired } from '@sendgrid/mail';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import ServiceStatusUpdateEmail from '../../../components/emails/ServiceStatusUpdateEmail';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Initialize SendGrid if available
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

async function ensureAdmin(req: NextApiRequest, res: NextApiResponse<ApiResponse>): Promise<boolean> {
  const session = await getServerSession(req, res, authOptions);
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
  const email = session?.user?.email;
  if (!email || !adminEmails.includes(email)) {
    res.status(403).json({ success: false, error: 'Forbidden: Admin access required' });
    return false;
  }
  return true;
}

const VALID_STATUS = ['pending', 'in_progress', 'review', 'completed', 'cancelled'] as const;
type Status = typeof VALID_STATUS[number];
const VALID_PAYMENT_STATUS = ['pending', 'paid', 'refunded'] as const;
type PaymentStatus = typeof VALID_PAYMENT_STATUS[number];

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  const authorized = await ensureAdmin(req, res);
  if (!authorized) return;

  switch (req.method) {
    case 'GET':
      return handleGet(req, res);
    case 'PUT':
      return handlePut(req, res);
    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, error: 'Missing id' });
  }

  const { data, error } = await supabase
    .from('service_requests')
    .select('*, services:services(name)')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Admin service-requests GET error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch request' });
  }
  if (!data) {
    return res.status(404).json({ success: false, error: 'Not found' });
  }

  return res.status(200).json({ success: true, data });
}

async function handlePut(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, error: 'Missing id' });
  }

  const { status, payment_status, admin_notes } = (req.body || {}) as {
    status?: unknown;
    payment_status?: unknown;
    admin_notes?: unknown;
  };

  const update: Record<string, unknown> = {};
  if (typeof status === 'string') {
    if (!VALID_STATUS.includes(status as Status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }
    update.status = status;
  }
  if (typeof payment_status === 'string') {
    if (!VALID_PAYMENT_STATUS.includes(payment_status as PaymentStatus)) {
      return res.status(400).json({ success: false, error: 'Invalid payment_status' });
    }
    update.payment_status = payment_status;
  }
  if (typeof admin_notes === 'string') {
    const notes = admin_notes.trim().slice(0, 5000);
    update.admin_notes = notes;
  }

  if (Object.keys(update).length === 0) {
    return res.status(400).json({ success: false, error: 'No valid fields to update' });
  }

  const { data, error } = await supabase
    .from('service_requests')
    .update(update)
    .eq('id', id)
    .select('*, services:services(name)')
    .maybeSingle();

  if (error) {
    console.error('Admin service-requests PUT error:', error);
    return res.status(500).json({ success: false, error: 'Failed to update request' });
  }
  if (!data) {
    return res.status(404).json({ success: false, error: 'Not found' });
  }

  // Optionally send customer notification if enabled
  try {
    const shouldNotify = process.env.SEND_STATUS_UPDATE_EMAIL === 'true' && !!process.env.SENDGRID_API_KEY;
    if (shouldNotify && data?.customer_email) {
      const html = renderToStaticMarkup(
        React.createElement(ServiceStatusUpdateEmail, {
          customerName: String(data.customer_name || 'there'),
          serviceType: String((data as { services?: { name?: string | null } }).services?.name || 'Selected Service'),
          orderId: String(data.id),
          newStatus: (String(data.status) as 'pending' | 'in_progress' | 'review' | 'completed' | 'cancelled'),
        })
      );
      const mail: MailDataRequired = {
        to: String(data.customer_email),
        from: (process.env.FROM_EMAIL || 'jmaconny@ybfstudio.com') as string,
        subject: `Your service request status: ${String(data.status).replace('_',' ')}`,
        html,
      };
      await sgMail.send(mail);
    }
  } catch (e) {
    // Log but do not fail the request if email fails
    console.error('Failed to send status update email', e);
  }

  return res.status(200).json({ success: true, data });
}


