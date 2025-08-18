import type { NextApiRequest, NextApiResponse } from 'next';
import { sendDownloadEmail, sendTestEmail } from '../../utils/email';

interface SendEmailRequest {
  type: 'download' | 'test';
  customerName?: string;
  customerEmail: string;
  beatTitle?: string;
  artist?: string;
  licenseType?: 'mp3' | 'wav' | 'exclusive';
  downloadUrl?: string;
  expiresAt?: string;
  price?: number;
}

interface SendEmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SendEmailResponse>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
    return;
  }

  try {
    const { 
      type, 
      customerName, 
      customerEmail, 
      beatTitle, 
      artist, 
      licenseType, 
      downloadUrl, 
      expiresAt, 
      price 
    }: SendEmailRequest = req.body;

    // Validate required fields
    if (!customerEmail) {
      return res.status(400).json({
        success: false,
        error: 'Customer email is required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    if (type === 'test') {
      // Send test email
      const result = await sendTestEmail(customerEmail);
      
      if (result.success) {
        res.status(200).json({
          success: true,
          messageId: result.messageId
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error || 'Failed to send test email'
        });
      }
      return;
    }

    if (type === 'download') {
      // Validate required fields for download email
      if (!customerName || !beatTitle || !artist || !licenseType || !downloadUrl || !expiresAt || !price) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields for download email: customerName, beatTitle, artist, licenseType, downloadUrl, expiresAt, price'
        });
      }

      // Validate license type
      if (!['mp3', 'wav', 'exclusive'].includes(licenseType)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid license type. Must be mp3, wav, or exclusive'
        });
      }

      // Parse expiration date
      let parsedExpiresAt: Date;
      try {
        parsedExpiresAt = new Date(expiresAt);
        if (isNaN(parsedExpiresAt.getTime())) {
          throw new Error('Invalid date');
        }
      } catch (error) {
        return res.status(400).json({
          success: false,
          error: 'Invalid expiration date format'
        });
      }

      // Send download confirmation email
      const result = await sendDownloadEmail({
        customerName,
        customerEmail,
        beatTitle,
        artist,
        licenseType,
        downloadUrl,
        expiresAt: parsedExpiresAt,
        price
      });

      if (result.success) {
        res.status(200).json({
          success: true,
          messageId: result.messageId
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error || 'Failed to send download email'
        });
      }
      return;
    }

    // Invalid email type
    res.status(400).json({
      success: false,
      error: 'Invalid email type. Must be "download" or "test"'
    });

  } catch (error) {
    console.error('Email API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during email processing'
    });
  }
} 