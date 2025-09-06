import { NextApiRequest, NextApiResponse } from 'next';
import { ConsultationService } from '../../../lib/consultation';
import { ConsultationEmailService } from '../../../lib/consultationEmails';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const {
        client_email,
        client_first_name,
        client_last_name,
        client_phone,
        client_company,
        project_details,
        budget_range,
        timeline,
        referral_source,
        package_id,
        start_at,
        end_at,
        duration_minutes,
        notes
      } = req.body || {};

      // Validate required fields
      const missing: string[] = [];
      if (!client_email) missing.push('client_email');
      if (!client_first_name) missing.push('client_first_name');
      if (!client_last_name) missing.push('client_last_name');
      if (!start_at) missing.push('start_at');
      if (!end_at) missing.push('end_at');
      if (!duration_minutes) missing.push('duration_minutes');
      if (missing.length) {
        return res.status(400).json({ error: 'Missing required fields', required: missing });
      }

      // Validate email
      if (typeof client_email !== 'string' || !client_email.includes('@')) {
        return res.status(400).json({ error: 'Invalid client_email' });
      }

      // Validate dates
      const start = new Date(start_at);
      const end = new Date(end_at);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ error: 'Invalid start_at or end_at' });
      }
      if (end <= start) {
        return res.status(400).json({ error: 'end_at must be after start_at' });
      }

      // Validate duration
      if (typeof duration_minutes !== 'number' || duration_minutes < 15 || duration_minutes > 480) {
        return res.status(400).json({ error: 'duration_minutes must be between 15 and 480' });
      }

      // Create consultation via service (handles client create/update)
      const consultation = await ConsultationService.createConsultation({
        client_email,
        client_first_name,
        client_last_name,
        client_phone,
        client_company,
        project_details,
        budget_range,
        timeline,
        referral_source,
        package_id,
        start_at,
        end_at,
        duration_minutes,
        notes
      });

      // Send confirmation and admin notification (best effort)
      try {
        await ConsultationEmailService.sendConfirmationEmail({
          consultation,
          package: consultation.package,
          client: consultation.client
        });
      } catch (e) {
        // log inside service
      }

      try {
        await ConsultationEmailService.sendAdminNotification({
          consultation,
          package: consultation.package,
          client: consultation.client
        }, 'New Consultation Booked');
      } catch (e) {
        // log inside service
      }

      return res.status(201).json({ success: true, consultation });
    }

    if (req.method === 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Create consultation API error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' });
  }
}


