import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { ConsultationService } from '../../../lib/consultation';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // GET: Public endpoint to get all active consultation packages
      const packages = await ConsultationService.getPackages();
      return res.status(200).json(packages);
    }

    if (req.method === 'POST') {
      // POST: Admin only - create new consultation package
      const session = await getServerSession(req, res, authOptions);
      if (!session || session.user?.role !== 'admin') {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { name, description, duration_minutes, price_cents, features } = req.body;

      // Validate required fields
      if (!name || !duration_minutes || price_cents === undefined) {
        return res.status(400).json({
          error: 'Missing required fields',
          required: ['name', 'duration_minutes', 'price_cents']
        });
      }

      // Validate duration
      if (duration_minutes < 15 || duration_minutes > 480) {
        return res.status(400).json({ error: 'Duration must be between 15 minutes and 8 hours' });
      }

      // Validate price
      if (price_cents < 0) {
        return res.status(400).json({ error: 'Price must be non-negative' });
      }

      // TODO: Implement package creation in ConsultationService
      // For now, return a placeholder response
      return res.status(201).json({
        success: true,
        message: 'Consultation package creation not yet implemented',
        package: {
          name,
          description,
          duration_minutes,
          price_cents,
          features
        }
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Consultation packages API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

