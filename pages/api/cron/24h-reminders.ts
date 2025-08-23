import { NextApiRequest, NextApiResponse } from 'next';
import { ConsultationService } from '../../../lib/consultation';
import { ConsultationEmailService } from '../../../lib/consultationEmails';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verify this is a legitimate cron request
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.authorization;
  const xCronSecret = (req.headers['x-cron-secret'] as string) || '';
  const querySecret = (req.query.secret as string) || '';

  // Debug logging without leaking secrets
  if (process.env.NODE_ENV !== 'production') {
    console.log('[cron] auth check', {
      hasCronSecretEnv: Boolean(cronSecret),
      hasAuthHeader: Boolean(authHeader),
      hasXCronHeader: Boolean(xCronSecret),
      hasQuerySecret: Boolean(querySecret)
    });
  }

  if (!cronSecret) {
    return res.status(500).json({ error: 'CRON_SECRET not configured' });
  }

  const expectedAuth = `Bearer ${cronSecret}`;
  const isAuthorized =
    authHeader === expectedAuth ||
    xCronSecret === cronSecret ||
    querySecret === cronSecret;

  if (!isAuthorized) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Starting 24-hour reminder cron job...');

    // Get consultations happening in the next 24-25 hours
    const upcomingConsultations = await ConsultationService.getUpcomingConsultations(25);
    
    let emailsSent = 0;
    let errors = 0;

    for (const consultation of upcomingConsultations) {
      try {
        // Check if this consultation is exactly 24 hours away (within a 1-hour window)
        const consultationTime = new Date(consultation.start_at);
        const now = new Date();
        const hoursUntilConsultation = (consultationTime.getTime() - now.getTime()) / (1000 * 60 * 60);

        // Send reminder if consultation is between 23-25 hours away
        if (hoursUntilConsultation >= 23 && hoursUntilConsultation <= 25) {
          // Get full consultation details
          const fullConsultation = await ConsultationService.getConsultationById(consultation.id);
          if (!fullConsultation) {
            console.error(`Consultation ${consultation.id} not found`);
            continue;
          }

          // Send 24-hour reminder email
          const emailResult = await ConsultationEmailService.send24HourReminder({
            consultation: fullConsultation,
            package: fullConsultation.package,
            client: fullConsultation.client
          });

          if (emailResult.success) {
            emailsSent++;
            console.log(`24-hour reminder sent for consultation ${consultation.id} to ${consultation.client_email}`);
          } else {
            errors++;
            console.error(`Failed to send 24-hour reminder for consultation ${consultation.id}:`, emailResult.error);
          }
        }
      } catch (error) {
        errors++;
        console.error(`Error processing consultation ${consultation.id}:`, error);
      }
    }

    console.log(`24-hour reminder cron job completed. Emails sent: ${emailsSent}, Errors: ${errors}`);

    return res.status(200).json({
      success: true,
      message: '24-hour reminder cron job completed',
      emailsSent,
      errors,
      totalProcessed: upcomingConsultations.length
    });

  } catch (error) {
    console.error('24-hour reminder cron job error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
