// Email utility for sending download confirmation emails
// Uses SendGrid for reliable email delivery

import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

interface DownloadEmailData {
  customerName: string;
  customerEmail: string;
  beatTitle: string;
  artist: string;
  licenseType: 'mp3' | 'wav' | 'exclusive';
  downloadUrl: string;
  expiresAt: Date;
  price: number;
}

interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send download confirmation email to customer
 */
export const sendDownloadEmail = async (data: DownloadEmailData): Promise<EmailResponse> => {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SendGrid API key not configured');
    }

    const { 
      customerName, 
      customerEmail, 
      beatTitle, 
      artist, 
      licenseType, 
      downloadUrl, 
      expiresAt, 
      price 
    } = data;

    const emailHtml = generateDownloadEmailHTML({
      customerName,
      customerEmail,
      beatTitle,
      artist,
      licenseType,
      downloadUrl,
      expiresAt,
      price
    });

    const emailText = generateDownloadEmailText({
      customerName,
      beatTitle,
      artist,
      licenseType,
      downloadUrl,
      expiresAt,
      price
    });

    const msg = {
      to: customerEmail,
      from: process.env.FROM_EMAIL || 'noreply@audioservice.com',
      subject: `Your Download: ${beatTitle} - ${licenseType.toUpperCase()} License`,
      text: emailText,
      html: emailHtml,
    };

    const response = await sgMail.send(msg);
    
    return {
      success: true,
      messageId: response[0]?.headers['x-message-id'] || 'unknown'
    };

  } catch (error) {
    console.error('Error sending download email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

interface BookingConfirmData {
  customerName: string;
  customerEmail: string;
  serviceName: string;
  price: number;
}

export const sendBookingConfirmationEmail = async (data: BookingConfirmData): Promise<EmailResponse> => {
  try {
    if (!process.env.SENDGRID_API_KEY) throw new Error('SendGrid API key not configured');
    const { customerName, customerEmail, serviceName, price } = data;
    const html = `<h2>Thanks for your request!</h2><p>Hi ${customerName},</p><p>We received your booking request for <strong>${serviceName}</strong>.</p><p>Estimated price: <strong>$${price.toFixed(2)}</strong></p><p>We will follow up shortly with next steps.</p>`;
    const msg = {
      to: customerEmail,
      from: process.env.FROM_EMAIL || 'noreply@audioservice.com',
      subject: `We received your request: ${serviceName}`,
      text: `Hi ${customerName}, we received your booking request for ${serviceName}. Estimated price: $${price.toFixed(2)}. We'll follow up shortly.`,
      html,
    } as any;
    const resp = await sgMail.send(msg);
    return { success: true, messageId: resp[0]?.headers['x-message-id'] || 'unknown' };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Unknown error' };
  }
};

export const sendBookingInternalEmail = async (data: BookingConfirmData & { projectName?: string; customerNote?: string }) => {
  try {
    if (!process.env.SENDGRID_API_KEY) throw new Error('SendGrid API key not configured');
    const to = process.env.ADMIN_NOTIFICATIONS_EMAIL || process.env.FROM_EMAIL;
    if (!to) throw new Error('No admin notification email configured');
    const { customerName, customerEmail, serviceName, price, projectName, customerNote } = data;
    const html = `<h2>New Booking Request</h2><ul><li><strong>Customer:</strong> ${customerName} (${customerEmail})</li><li><strong>Service:</strong> ${serviceName}</li><li><strong>Price:</strong> $${price.toFixed(2)}</li>${projectName ? `<li><strong>Project:</strong> ${projectName}</li>` : ''}${customerNote ? `<li><strong>Note:</strong> ${customerNote}</li>` : ''}</ul>`;
    const msg = {
      to,
      from: process.env.FROM_EMAIL || 'noreply@audioservice.com',
      subject: `New booking request: ${serviceName}`,
      text: `New booking request from ${customerName} (${customerEmail}) for ${serviceName}. Price: $${price.toFixed(2)}${projectName ? `, Project: ${projectName}` : ''}${customerNote ? `, Note: ${customerNote}` : ''}`,
      html,
    } as any;
    await sgMail.send(msg);
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Unknown error' };
  }
};

/**
 * Generate HTML version of download confirmation email
 */
const generateDownloadEmailHTML = (data: Omit<DownloadEmailData, 'customerEmail'> & { customerEmail: string }): string => {
  const { 
    customerName, 
    customerEmail,
    beatTitle, 
    artist, 
    licenseType, 
    downloadUrl, 
    expiresAt, 
    price 
  } = data;

  const licenseFeatures = getLicenseFeatures(licenseType);
  const formattedExpiry = expiresAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Beat Download</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f5f5f5;
        }
        .container {
          background: white;
          border-radius: 8px;
          padding: 40px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #f59e0b;
          margin-bottom: 10px;
        }
        .title {
          font-size: 28px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 20px;
        }
        .beat-info {
          background: #f8fafc;
          border-radius: 6px;
          padding: 20px;
          margin: 20px 0;
        }
        .beat-title {
          font-size: 20px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 5px;
        }
        .beat-artist {
          color: #6b7280;
          margin-bottom: 10px;
        }
        .license-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 15px 0;
        }
        .license-type {
          font-weight: bold;
          color: #1f2937;
        }
        .price {
          font-size: 18px;
          font-weight: bold;
          color: #f59e0b;
        }
        .features {
          margin: 20px 0;
        }
        .features h3 {
          color: #1f2937;
          margin-bottom: 10px;
        }
        .features ul {
          list-style: none;
          padding: 0;
        }
        .features li {
          padding: 5px 0;
          color: #4b5563;
        }
        .features li:before {
          content: "✓ ";
          color: #10b981;
          font-weight: bold;
        }
        .download-button {
          display: inline-block;
          background: #f59e0b;
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
          font-size: 16px;
          margin: 20px 0;
          text-align: center;
        }
        .download-button:hover {
          background: #d97706;
        }
        .expiry-notice {
          background: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 6px;
          padding: 15px;
          margin: 20px 0;
          color: #92400e;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🎵 AudioService</div>
          <h1 class="title">Your Beat Download</h1>
        </div>
        
        <p>Hi ${customerName},</p>
        
        <p>Thank you for your purchase! Your beat is ready for download.</p>
        
        <div class="beat-info">
          <div class="beat-title">${beatTitle}</div>
          <div class="beat-artist">by ${artist}</div>
          <div class="license-info">
            <span class="license-type">${licenseType.toUpperCase()} License</span>
            <span class="price">$${price}</span>
          </div>
        </div>
        
        <div class="features">
          <h3>Your License Includes:</h3>
          <ul>
            ${licenseFeatures.map(feature => `<li>${feature}</li>`).join('')}
          </ul>
        </div>
        
        <div style="text-align: center;">
          <a href="${downloadUrl}" class="download-button">
            Download Full Track
          </a>
        </div>
        
        <div class="expiry-notice">
          <strong>⚠️ Important:</strong> This download link expires on ${formattedExpiry}. 
          Please download your file before then.
        </div>
        
        <p>If you have any questions or need support, please don't hesitate to contact us.</p>
        
        <div class="footer">
          <p>© 2025 AudioService. All rights reserved.</p>
          <p>This email was sent to ${customerEmail}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Generate text version of download confirmation email
 */
const generateDownloadEmailText = (data: Omit<DownloadEmailData, 'customerEmail'>): string => {
  const { 
    customerName, 
    beatTitle, 
    artist, 
    licenseType, 
    downloadUrl, 
    expiresAt, 
    price 
  } = data;

  const licenseFeatures = getLicenseFeatures(licenseType);
  const formattedExpiry = expiresAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
Your Beat Download - AudioService

Hi ${customerName},

Thank you for your purchase! Your beat is ready for download.

BEAT DETAILS:
- Title: ${beatTitle}
- Artist: ${artist}
- License: ${licenseType.toUpperCase()}
- Price: $${price}

YOUR LICENSE INCLUDES:
${licenseFeatures.map(feature => `- ${feature}`).join('\n')}

DOWNLOAD LINK:
${downloadUrl}

IMPORTANT: This download link expires on ${formattedExpiry}. Please download your file before then.

If you have any questions or need support, please don't hesitate to contact us.

© 2025 AudioService. All rights reserved.
  `.trim();
};

/**
 * Get license features based on license type
 */
const getLicenseFeatures = (licenseType: 'mp3' | 'wav' | 'exclusive'): string[] => {
  switch (licenseType) {
    case 'mp3':
      return [
        'MP3 format (320kbps)',
        'Commercial use allowed',
        'Up to 10,000 streams/sales',
        'Credit required'
      ];
    case 'wav':
      return [
        'WAV format (uncompressed)',
        'Commercial use allowed',
        'Up to 50,000 streams/sales',
        'Credit required'
      ];
    case 'exclusive':
      return [
        'All formats included',
        'Unlimited commercial use',
        'No stream/sales limits',
        'No credit required',
        'Beat removed from store'
      ];
    default:
      return ['Standard license terms apply'];
  }
};

/**
 * Send test email to verify email system is working
 */
export const sendTestEmail = async (toEmail: string): Promise<EmailResponse> => {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SendGrid API key not configured');
    }

    const msg = {
      to: toEmail,
      from: process.env.FROM_EMAIL || 'noreply@audioservice.com',
      subject: 'AudioService - Email System Test',
      text: 'This is a test email to verify the email system is working correctly.',
      html: '<h1>Email System Test</h1><p>This is a test email to verify the email system is working correctly.</p>',
    };

    const response = await sgMail.send(msg);
    
    return {
      success: true,
      messageId: response[0]?.headers['x-message-id'] || 'unknown'
    };

  } catch (error) {
    console.error('Error sending test email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}; 