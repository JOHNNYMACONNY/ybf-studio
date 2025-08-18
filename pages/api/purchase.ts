import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { generateTemporaryDownloadLink } from '../../utils/download-links';
import { sendDownloadEmail } from '../../utils/email';
import type { Beat } from '../../types/beat';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

interface PurchaseRequest {
  beatId: string;
  licenseType: 'mp3' | 'wav' | 'exclusive';
  customerEmail: string;
  customerName?: string;
}

interface PurchaseResponse {
  success: boolean;
  sessionId?: string;
  downloadUrl?: string;
  expiresAt?: Date;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PurchaseResponse>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
    return;
  }

  try {
    const { beatId, licenseType, customerEmail, customerName }: PurchaseRequest = req.body;

    // Validate required fields
    if (!beatId || !licenseType || !customerEmail) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: beatId, licenseType, customerEmail'
      });
    }

    // Validate license type
    if (!['mp3', 'wav', 'exclusive'].includes(licenseType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid license type. Must be mp3, wav, or exclusive'
      });
    }

    // Fetch beat data to get pricing
    const beatsResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/beats`);
    if (!beatsResponse.ok) {
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch beat data'
      });
    }

    const beats: Beat[] = await beatsResponse.json();
    const beat = beats.find(b => b.id === beatId);
    
    if (!beat) {
      return res.status(404).json({
        success: false,
        error: 'Beat not found'
      });
    }

    // Get price for the selected license type
    const price = beat.licenseTypes[licenseType];
    if (!price) {
      return res.status(400).json({
        success: false,
        error: 'Invalid license type for this beat'
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${beat.title} - ${licenseType.toUpperCase()} License`,
              description: `Full track download for ${beat.title} with ${licenseType.toUpperCase()} license`,
              images: [beat.coverArt],
            },
            unit_amount: Math.round(price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/beats`,
      customer_email: customerEmail,
      metadata: {
        beatId,
        licenseType,
        customerName: customerName || '',
        beatTitle: beat.title,
      },
    });

    // For demo purposes, we'll also generate the download link immediately
    // In production, this would be done after successful payment confirmation
    let downloadUrl: string | undefined;
    let expiresAt: Date | undefined;

    try {
      const downloadData = await generateTemporaryDownloadLink(beatId, licenseType);
      downloadUrl = downloadData.url;
      expiresAt = downloadData.expiresAt;

      // Send download confirmation email
      if (downloadUrl && expiresAt) {
        try {
          const emailResult = await sendDownloadEmail({
            customerName: customerName || 'Customer',
            customerEmail,
            beatTitle: beat.title,
            artist: beat.artist,
            licenseType,
            downloadUrl,
            expiresAt,
            price
          });

          if (!emailResult.success) {
            console.error('Failed to send download email:', emailResult.error);
            // Don't fail the purchase if email fails
          }
        } catch (emailError) {
          console.error('Error sending download email:', emailError);
          // Don't fail the purchase if email fails
        }
      }
    } catch (error) {
      console.error('Error generating download link:', error);
      // Don't fail the purchase if download link generation fails
      // It can be generated later when payment is confirmed
    }

    res.status(200).json({
      success: true,
      sessionId: session.id,
      downloadUrl,
      expiresAt,
    });

  } catch (error) {
    console.error('Purchase API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during purchase processing'
    });
  }
} 