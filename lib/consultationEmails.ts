import { Consultation, ConsultationPackage, Client } from './consultation';
import { CalendarService } from './calendar';
import { sendMail } from './mailer';

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface EmailData {
  consultation: Consultation;
  package?: ConsultationPackage;
  client: Client;
  meetingLink?: string;
  rescheduleDate?: string;
  cancellationReason?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export class ConsultationEmailService {
  private static readonly FROM_EMAIL = process.env.FROM_EMAIL || 'jmaconny@ybfstudio.com';
  private static readonly FROM_NAME = process.env.SENDGRID_FROM_NAME || 'Johnny';
  private static readonly ADMIN_EMAIL = process.env.ADMIN_NOTIFICATIONS_EMAIL || 'jmaconny@ybfstudio.com';

  /**
   * Send consultation confirmation email
   */
  static async sendConfirmationEmail(emailData: EmailData): Promise<SendEmailResult> {
    try {
      const template = this.generateConfirmationTemplate(emailData);
      const result = await this.sendEmail(
        emailData.client.email,
        template.subject,
        template.html,
        template.text
      );

      if (result.success) {
        await this.logEmailSent(emailData.consultation.id, 'confirmation', emailData.client.email, template.subject);
      }

      return result;
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Send 24-hour reminder email
   */
  static async send24HourReminder(emailData: EmailData): Promise<SendEmailResult> {
    try {
      const template = this.generate24HourReminderTemplate(emailData);
      const result = await this.sendEmail(
        emailData.client.email,
        template.subject,
        template.html,
        template.text
      );

      if (result.success) {
        await this.logEmailSent(emailData.consultation.id, 'reminder_24h', emailData.client.email, template.subject);
      }

      return result;
    } catch (error) {
      console.error('Failed to send 24-hour reminder email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Send 1-hour reminder email
   */
  static async send1HourReminder(emailData: EmailData): Promise<SendEmailResult> {
    try {
      const template = this.generate1HourReminderTemplate(emailData);
      const result = await this.sendEmail(
        emailData.client.email,
        template.subject,
        template.html,
        template.text
      );

      if (result.success) {
        await this.logEmailSent(emailData.consultation.id, 'reminder_1h', emailData.client.email, template.subject);
      }

      return result;
    } catch (error) {
      console.error('Failed to send 1-hour reminder email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Send reschedule email
   */
  static async sendRescheduleEmail(emailData: EmailData): Promise<SendEmailResult> {
    try {
      const template = this.generateRescheduleTemplate(emailData);
      const result = await this.sendEmail(
        emailData.client.email,
        template.subject,
        template.html,
        template.text
      );

      if (result.success) {
        await this.logEmailSent(emailData.consultation.id, 'reschedule', emailData.client.email, template.subject);
      }

      return result;
    } catch (error) {
      console.error('Failed to send reschedule email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Send cancellation email
   */
  static async sendCancellationEmail(emailData: EmailData): Promise<SendEmailResult> {
    try {
      const template = this.generateCancellationTemplate(emailData);
      const result = await this.sendEmail(
        emailData.client.email,
        template.subject,
        template.html,
        template.text
      );

      if (result.success) {
        await this.logEmailSent(emailData.consultation.id, 'cancellation', emailData.client.email, template.subject);
      }

      return result;
    } catch (error) {
      console.error('Failed to send cancellation email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Send follow-up email
   */
  static async sendFollowUpEmail(emailData: EmailData): Promise<SendEmailResult> {
    try {
      const template = this.generateFollowUpTemplate(emailData);
      const result = await this.sendEmail(
        emailData.client.email,
        template.subject,
        template.html,
        template.text
      );

      if (result.success) {
        await this.logEmailSent(emailData.consultation.id, 'follow_up', emailData.client.email, template.subject);
      }

      return result;
    } catch (error) {
      console.error('Failed to send follow-up email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Send admin notification email
   */
  static async sendAdminNotification(emailData: EmailData, notificationType: string): Promise<SendEmailResult> {
    try {
      const template = this.generateAdminNotificationTemplate(emailData, notificationType);
      const result = await this.sendEmail(
        this.ADMIN_EMAIL,
        template.subject,
        template.html,
        template.text
      );

      return result;
    } catch (error) {
      console.error('Failed to send admin notification email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Generate confirmation email template
   */
  private static generateConfirmationTemplate(emailData: EmailData): EmailTemplate {
    const { consultation, package: packageDetails, client } = emailData;
    const startDate = CalendarService.formatDateForDisplay(consultation.start_at);
    const startTime = CalendarService.formatTimeForDisplay(consultation.start_at);
    const duration = consultation.duration_minutes;

    const subject = `Consultation Confirmed: ${packageDetails?.name || 'Audio Service Consultation'} - ${startDate}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Consultation Confirmed</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
          .cta { text-align: center; margin: 30px 0; }
          .btn { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Consultation Confirmed!</h1>
            <p>Your consultation has been successfully scheduled</p>
          </div>
          
          <div class="content">
            <h2>Hello ${client.first_name},</h2>
            <p>Great news! Your consultation has been confirmed. Here are the details:</p>
            
            <div class="details">
              <h3>📅 Consultation Details</h3>
              <p><strong>Date:</strong> ${startDate}</p>
              <p><strong>Time:</strong> ${startTime}</p>
              <p><strong>Duration:</strong> ${duration} minutes</p>
              ${packageDetails ? `<p><strong>Package:</strong> ${packageDetails.name}</p>` : ''}
              ${consultation.meeting_link ? `<p><strong>Meeting Link:</strong> <a href="${consultation.meeting_link}">${consultation.meeting_link}</a></p>` : ''}
            </div>

            ${packageDetails && packageDetails.features ? `
            <div class="details">
              <h3>✨ What to Expect</h3>
              <ul>
                ${packageDetails.features.map(feature => `<li>${feature}</li>`).join('')}
              </ul>
            </div>
            ` : ''}

            <div class="cta">
              <a href="${CalendarService.generateGoogleCalendarLink(consultation, packageDetails)}" class="btn">📅 Add to Google Calendar</a>
            </div>

            <div class="details">
              <h3>📋 Preparation Tips</h3>
              <ul>
                <li>Ensure you have a stable internet connection</li>
                <li>Find a quiet environment for the consultation</li>
                <li>Have your project details and questions ready</li>
                <li>Test your audio and video equipment</li>
              </ul>
            </div>

            <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
            
            <p>We're looking forward to our consultation!</p>
            
            <p>Best regards,<br>The Audio Service Team</p>
          </div>
          
          <div class="footer">
            <p>This email was sent to ${client.email}</p>
            <p>If you have any questions, please reply to this email or contact our support team.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
Consultation Confirmed: ${packageDetails?.name || 'Audio Service Consultation'}

Hello ${client.first_name},

Great news! Your consultation has been confirmed. Here are the details:

Consultation Details:
- Date: ${startDate}
- Time: ${startTime}
- Duration: ${duration} minutes
${packageDetails ? `- Package: ${packageDetails.name}` : ''}
${consultation.meeting_link ? `- Meeting Link: ${consultation.meeting_link}` : ''}

${packageDetails && packageDetails.features ? `
What to Expect:
${packageDetails.features.map(feature => `- ${feature}`).join('\n')}
` : ''}

Preparation Tips:
- Ensure you have a stable internet connection
- Find a quiet environment for the consultation
- Have your project details and questions ready
- Test your audio and video equipment

If you need to reschedule or cancel, please contact us at least 24 hours in advance.

We're looking forward to our consultation!

Best regards,
The Audio Service Team

This email was sent to ${client.email}
If you have any questions, please reply to this email or contact our support team.
    `;

    return { subject, html, text };
  }

  /**
   * Generate 24-hour reminder email template
   */
  private static generate24HourReminderTemplate(emailData: EmailData): EmailTemplate {
    const { consultation, package: packageDetails, client } = emailData;
    const startDate = CalendarService.formatDateForDisplay(consultation.start_at);
    const startTime = CalendarService.formatTimeForDisplay(consultation.start_at);

    const subject = `Reminder: Your consultation is tomorrow at ${startTime}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Consultation Reminder</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #fbbf24, #f97316); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #fbbf24; }
          .cta { text-align: center; margin: 30px 0; }
          .btn { display: inline-block; background: #fbbf24; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏰ Consultation Reminder</h1>
            <p>Your consultation is tomorrow!</p>
          </div>
          
          <div class="content">
            <h2>Hello ${client.first_name},</h2>
            <p>This is a friendly reminder that your consultation is scheduled for tomorrow:</p>
            
            <div class="details">
              <h3>📅 Consultation Details</h3>
              <p><strong>Date:</strong> ${startDate}</p>
              <p><strong>Time:</strong> ${startTime}</p>
              <p><strong>Duration:</strong> ${consultation.duration_minutes} minutes</p>
              ${packageDetails ? `<p><strong>Package:</strong> ${packageDetails.name}</p>` : ''}
              ${consultation.meeting_link ? `<p><strong>Meeting Link:</strong> <a href="${consultation.meeting_link}">${consultation.meeting_link}</a></p>` : ''}
            </div>

            <div class="cta">
              <a href="${CalendarService.generateGoogleCalendarLink(consultation, packageDetails)}" class="btn">📅 View in Calendar</a>
            </div>

            <div class="details">
              <h3>✅ Final Preparation Checklist</h3>
              <ul>
                <li>✅ Confirm your internet connection is stable</li>
                <li>✅ Find a quiet, distraction-free environment</li>
                <li>✅ Test your microphone and speakers</li>
                <li>✅ Have your project files and questions ready</li>
                <li>✅ Set a reminder for 10 minutes before the call</li>
              </ul>
            </div>

            <p><strong>Need to reschedule?</strong> Please contact us immediately if you need to change your appointment time.</p>
            
            <p>We're excited to meet with you tomorrow!</p>
            
            <p>Best regards,<br>The Audio Service Team</p>
          </div>
          
          <div class="footer">
            <p>This email was sent to ${client.email}</p>
            <p>If you have any questions, please reply to this email or contact our support team.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
Reminder: Your consultation is tomorrow at ${startTime}

Hello ${client.first_name},

This is a friendly reminder that your consultation is scheduled for tomorrow:

Consultation Details:
- Date: ${startDate}
- Time: ${startTime}
- Duration: ${consultation.duration_minutes} minutes
${packageDetails ? `- Package: ${packageDetails.name}` : ''}
${consultation.meeting_link ? `- Meeting Link: ${consultation.meeting_link}` : ''}

Final Preparation Checklist:
- Confirm your internet connection is stable
- Find a quiet, distraction-free environment
- Test your microphone and speakers
- Have your project files and questions ready
- Set a reminder for 10 minutes before the call

Need to reschedule? Please contact us immediately if you need to change your appointment time.

We're excited to meet with you tomorrow!

Best regards,
The Audio Service Team

This email was sent to ${client.email}
If you have any questions, please reply to this email or contact our support team.
    `;

    return { subject, html, text };
  }

  /**
   * Generate 1-hour reminder email template
   */
  private static generate1HourReminderTemplate(emailData: EmailData): EmailTemplate {
    const { consultation, package: packageDetails, client } = emailData;
    const startTime = CalendarService.formatTimeForDisplay(consultation.start_at);

    const subject = `Final Reminder: Your consultation starts in 1 hour at ${startTime}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Final Consultation Reminder</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444; }
          .cta { text-align: center; margin: 30px 0; }
          .btn { display: inline-block; background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 Final Reminder</h1>
            <p>Your consultation starts in 1 hour!</p>
          </div>
          
          <div class="content">
            <h2>Hello ${client.first_name},</h2>
            <p>Your consultation starts in exactly 1 hour. Please make sure you're ready!</p>
            
            <div class="details">
              <h3>⏰ Starting Soon</h3>
              <p><strong>Time:</strong> ${startTime}</p>
              <p><strong>Duration:</strong> ${consultation.duration_minutes} minutes</p>
              ${packageDetails ? `<p><strong>Package:</strong> ${packageDetails.name}</p>` : ''}
              ${consultation.meeting_link ? `<p><strong>Meeting Link:</strong> <a href="${consultation.meeting_link}">${consultation.meeting_link}</a></p>` : ''}
            </div>

            <div class="cta">
              <a href="${consultation.meeting_link || '#'}" class="btn">🚀 Join Meeting Now</a>
            </div>

            <div class="details">
              <h3>⚡ Last-Minute Checklist</h3>
              <ul>
                <li>🔌 Check your internet connection</li>
                <li>🎤 Test your microphone</li>
                <li>🔊 Test your speakers/headphones</li>
                <li>📁 Have your project files ready</li>
                <li>📝 Prepare your questions</li>
                <li>🚪 Find a quiet space</li>
              </ul>
            </div>

            <p><strong>Running late?</strong> Please let us know as soon as possible.</p>
            
            <p>See you soon!</p>
            
            <p>Best regards,<br>The Audio Service Team</p>
          </div>
          
          <div class="footer">
            <p>This email was sent to ${client.email}</p>
            <p>If you have any questions, please reply to this email or contact our support team.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
Final Reminder: Your consultation starts in 1 hour at ${startTime}

Hello ${client.first_name},

Your consultation starts in exactly 1 hour. Please make sure you're ready!

Starting Soon:
- Time: ${startTime}
- Duration: ${consultation.duration_minutes} minutes
${packageDetails ? `- Package: ${packageDetails.name}` : ''}
${consultation.meeting_link ? `- Meeting Link: ${consultation.meeting_link}` : ''}

Last-Minute Checklist:
- Check your internet connection
- Test your microphone
- Test your speakers/headphones
- Have your project files ready
- Prepare your questions
- Find a quiet space

Running late? Please let us know as soon as possible.

See you soon!

Best regards,
The Audio Service Team

This email was sent to ${client.email}
If you have any questions, please reply to this email or contact our support team.
    `;

    return { subject, html, text };
  }

  /**
   * Generate reschedule email template
   */
  private static generateRescheduleTemplate(emailData: EmailData): EmailTemplate {
    const { consultation, package: packageDetails, client } = emailData;
    const newStartDate = CalendarService.formatDateForDisplay(consultation.start_at);
    const newStartTime = CalendarService.formatTimeForDisplay(consultation.start_at);

    const subject = `Consultation Rescheduled: New time ${newStartDate} at ${newStartTime}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Consultation Rescheduled</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8b5cf6; }
          .cta { text-align: center; margin: 30px 0; }
          .btn { display: inline-block; background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔄 Consultation Rescheduled</h1>
            <p>Your consultation time has been updated</p>
          </div>
          
          <div class="content">
            <h2>Hello ${client.first_name},</h2>
            <p>Your consultation has been rescheduled. Here are the new details:</p>
            
            <div class="details">
              <h3>📅 New Consultation Details</h3>
              <p><strong>Date:</strong> ${newStartDate}</p>
              <p><strong>Time:</strong> ${newStartTime}</p>
              <p><strong>Duration:</strong> ${consultation.duration_minutes} minutes</p>
              ${packageDetails ? `<p><strong>Package:</strong> ${packageDetails.name}</p>` : ''}
              ${consultation.meeting_link ? `<p><strong>Meeting Link:</strong> <a href="${consultation.meeting_link}">${consultation.meeting_link}</a></p>` : ''}
            </div>

            <div class="cta">
              <a href="${CalendarService.generateGoogleCalendarLink(consultation, packageDetails)}" class="btn">📅 Update Calendar</a>
            </div>

            <p>If this new time doesn't work for you, please contact us immediately to arrange an alternative.</p>
            
            <p>We apologize for any inconvenience and look forward to our rescheduled consultation!</p>
            
            <p>Best regards,<br>The Audio Service Team</p>
          </div>
          
          <div class="footer">
            <p>This email was sent to ${client.email}</p>
            <p>If you have any questions, please reply to this email or contact our support team.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
Consultation Rescheduled: New time ${newStartDate} at ${newStartTime}

Hello ${client.first_name},

Your consultation has been rescheduled. Here are the new details:

New Consultation Details:
- Date: ${newStartDate}
- Time: ${newStartTime}
- Duration: ${consultation.duration_minutes} minutes
${packageDetails ? `- Package: ${packageDetails.name}` : ''}
${consultation.meeting_link ? `- Meeting Link: ${consultation.meeting_link}` : ''}

If this new time doesn't work for you, please contact us immediately to arrange an alternative.

We apologize for any inconvenience and look forward to our rescheduled consultation!

Best regards,
The Audio Service Team

This email was sent to ${client.email}
If you have any questions, please reply to this email or contact our support team.
    `;

    return { subject, html, text };
  }

  /**
   * Generate cancellation email template
   */
  private static generateCancellationTemplate(emailData: EmailData): EmailTemplate {
    const { consultation, package: packageDetails, client } = emailData;
    const startDate = CalendarService.formatDateForDisplay(consultation.start_at);
    const startTime = CalendarService.formatTimeForDisplay(consultation.start_at);

    const subject = `Consultation Cancelled: ${startDate} at ${startTime}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Consultation Cancelled</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #6b7280, #4b5563); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6b7280; }
          .cta { text-align: center; margin: 30px 0; }
          .btn { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>❌ Consultation Cancelled</h1>
            <p>Your consultation has been cancelled</p>
          </div>
          
          <div class="content">
            <h2>Hello ${client.first_name},</h2>
            <p>Your consultation has been cancelled. Here are the details:</p>
            
            <div class="details">
              <h3>📅 Cancelled Consultation</h3>
              <p><strong>Date:</strong> ${startDate}</p>
              <p><strong>Time:</strong> ${startTime}</p>
              <p><strong>Duration:</strong> ${consultation.duration_minutes} minutes</p>
              ${packageDetails ? `<p><strong>Package:</strong> ${packageDetails.name}</p>` : ''}
              ${consultation.cancellation_reason ? `<p><strong>Reason:</strong> ${consultation.cancellation_reason}</p>` : ''}
            </div>

            <div class="cta">
              <a href="/consultation" class="btn">📅 Book New Consultation</a>
            </div>

            <p>If you'd like to reschedule or have any questions, please don't hesitate to contact us.</p>
            
            <p>We hope to see you for a consultation in the future!</p>
            
            <p>Best regards,<br>The Audio Service Team</p>
          </div>
          
          <div class="footer">
            <p>This email was sent to ${client.email}</p>
            <p>If you have any questions, please reply to this email or contact our support team.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
Consultation Cancelled: ${startDate} at ${startTime}

Hello ${client.first_name},

Your consultation has been cancelled. Here are the details:

Cancelled Consultation:
- Date: ${startDate}
- Time: ${startTime}
- Duration: ${consultation.duration_minutes} minutes
${packageDetails ? `- Package: ${packageDetails.name}` : ''}
${consultation.cancellation_reason ? `- Reason: ${consultation.cancellation_reason}` : ''}

If you'd like to reschedule or have any questions, please don't hesitate to contact us.

We hope to see you for a consultation in the future!

Best regards,
The Audio Service Team

This email was sent to ${client.email}
If you have any questions, please reply to this email or contact our support team.
    `;

    return { subject, html, text };
  }

  /**
   * Generate follow-up email template
   */
  private static generateFollowUpTemplate(emailData: EmailData): EmailTemplate {
    const { consultation, package: packageDetails, client } = emailData;

    const subject = `Follow-up: How was your consultation?`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Consultation Follow-up</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
          .cta { text-align: center; margin: 30px 0; }
          .btn { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💬 Consultation Follow-up</h1>
            <p>We'd love to hear about your experience</p>
          </div>
          
          <div class="content">
            <h2>Hello ${client.first_name},</h2>
            <p>We hope your consultation was helpful and informative! We'd love to hear about your experience.</p>
            
            <div class="details">
              <h3>📅 Your Consultation</h3>
              <p><strong>Date:</strong> ${CalendarService.formatDateForDisplay(consultation.start_at)}</p>
              <p><strong>Time:</strong> ${CalendarService.formatTimeForDisplay(consultation.start_at)}</p>
              ${packageDetails ? `<p><strong>Package:</strong> ${packageDetails.name}</p>` : ''}
            </div>

            <div class="cta">
              <a href="/feedback" class="btn">💬 Share Your Feedback</a>
            </div>

            <p>Your feedback helps us improve our services and provide better experiences for future clients.</p>
            
            <p>If you have any additional questions or need further assistance, please don't hesitate to reach out.</p>
            
            <p>Thank you for choosing our services!</p>
            
            <p>Best regards,<br>The Audio Service Team</p>
          </div>
          
          <div class="footer">
            <p>This email was sent to ${client.email}</p>
            <p>If you have any questions, please reply to this email or contact our support team.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
Follow-up: How was your consultation?

Hello ${client.first_name},

We hope your consultation was helpful and informative! We'd love to hear about your experience.

Your Consultation:
- Date: ${CalendarService.formatDateForDisplay(consultation.start_at)}
- Time: ${CalendarService.formatTimeForDisplay(consultation.start_at)}
${packageDetails ? `- Package: ${packageDetails.name}` : ''}

Your feedback helps us improve our services and provide better experiences for future clients.

If you have any additional questions or need further assistance, please don't hesitate to reach out.

Thank you for choosing our services!

Best regards,
The Audio Service Team

This email was sent to ${client.email}
If you have any questions, please reply to this email or contact our support team.
    `;

    return { subject, html, text };
  }

  /**
   * Generate admin notification template
   */
  private static generateAdminNotificationTemplate(emailData: EmailData, notificationType: string): EmailTemplate {
    const { consultation, package: packageDetails, client } = emailData;
    const startDate = CalendarService.formatDateForDisplay(consultation.start_at);
    const startTime = CalendarService.formatTimeForDisplay(consultation.start_at);

    const subject = `Admin Notification: ${notificationType} - ${client.first_name} ${client.last_name}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Notification</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #6366f1, #4f46e5); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6366f1; }
          .cta { text-align: center; margin: 30px 0; }
          .btn { display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 Admin Notification</h1>
            <p>${notificationType}</p>
          </div>
          
          <div class="content">
            <h2>Admin Notification</h2>
            <p>A new ${notificationType.toLowerCase()} has occurred:</p>
            
            <div class="details">
              <h3>📋 Consultation Details</h3>
              <p><strong>Client:</strong> ${client.first_name} ${client.last_name}</p>
              <p><strong>Email:</strong> ${client.email}</p>
              <p><strong>Date:</strong> ${startDate}</p>
              <p><strong>Time:</strong> ${startTime}</p>
              <p><strong>Status:</strong> ${consultation.status}</p>
              ${packageDetails ? `<p><strong>Package:</strong> ${packageDetails.name}</p>` : ''}
              ${consultation.notes ? `<p><strong>Client Notes:</strong> ${consultation.notes}</p>` : ''}
            </div>

            <div class="cta">
              <a href="/admin/consultations/${consultation.id}" class="btn">👁️ View Details</a>
            </div>

            <p>Please review and take any necessary action.</p>
            
            <p>Best regards,<br>Audio Service App</p>
          </div>
          
          <div class="footer">
            <p>This is an automated admin notification</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
Admin Notification: ${notificationType} - ${client.first_name} ${client.last_name}

Admin Notification

A new ${notificationType.toLowerCase()} has occurred:

Consultation Details:
- Client: ${client.first_name} ${client.last_name}
- Email: ${client.email}
- Date: ${startDate}
- Time: ${startTime}
- Status: ${consultation.status}
${packageDetails ? `- Package: ${packageDetails.name}` : ''}
${consultation.notes ? `- Client Notes: ${consultation.notes}` : ''}

Please review and take any necessary action.

Best regards,
Audio Service App

This is an automated admin notification
    `;

    return { subject, html, text };
  }

  /**
   * Send email using SendGrid
   */
  private static async sendEmail(
    to: string,
    subject: string,
    html: string,
    text: string
  ): Promise<SendEmailResult> {
    try {
      const info = await sendMail({
        to,
        subject,
        html,
        text,
        fromEmail: this.FROM_EMAIL,
        fromName: this.FROM_NAME,
      });

      const maybe = info as { messageId?: string } | undefined;
      return {
        success: true,
        messageId: maybe?.messageId || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
    } catch (error) {
      console.error('Failed to send email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Log email sent to database
   */
  private static async logEmailSent(
    consultationId: string,
    emailType: string,
    recipientEmail: string,
    subject: string
  ): Promise<void> {
    try {
      // Import Supabase client dynamically to avoid SSR issues
      const { supabaseAdmin } = await import('./supabaseAdmin');

      const { error } = await supabaseAdmin
        .from('consultation_emails')
        .insert({
          consultation_id: consultationId,
          email_type: emailType,
          recipient_email: recipientEmail,
          subject: subject,
          sent_at: new Date().toISOString()
        });

      if (error) {
        console.error('Failed to log email to database:', error);
      }
    } catch (error) {
      console.error('Failed to log email:', error);
    }
  }
}
