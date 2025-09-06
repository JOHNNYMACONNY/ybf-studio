import type { NextApiRequest, NextApiResponse } from 'next';
import { sendMail } from '../../lib/mailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const to = (req.method === 'POST' ? req.body?.to : req.query.to) as string | undefined;
    const subject = (req.method === 'POST' ? req.body?.subject : req.query.subject) as string | undefined;
    const text = (req.method === 'POST' ? req.body?.text : req.query.text) as string | undefined;
    const html = (req.method === 'POST' ? req.body?.html : req.query.html) as string | undefined;

    const toEmail = to || process.env.FROM_EMAIL || 'jmaconny@ybfstudio.com';

    const info = await sendMail({
      to: toEmail,
      subject: subject || 'Brevo SMTP test',
      text: text || 'If you see this, Brevo SMTP is working.',
      html: html || '<p>If you see this, Brevo SMTP is working.</p>',
    });

    return res.status(200).json({ success: true, messageId: (info as { messageId?: string })?.messageId });
  } catch (error: unknown) {
    const err = error as { message?: string; response?: unknown } | undefined;
    const message = err?.message || 'Unknown error';
    const resp = err?.response;
    return res.status(500).json({ success: false, error: message, response: resp });
  }
}
