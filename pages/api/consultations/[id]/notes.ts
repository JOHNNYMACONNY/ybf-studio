import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { ConsultationService } from '../../../../lib/consultation';

type MaybeSession = { user?: { email?: string | null; isAdmin?: boolean } } | null;
function isAdminSession(session: MaybeSession): boolean {
	const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
	const userEmail = session?.user?.email;
	const userIsAdminFlag = session?.user?.isAdmin === true;
	return Boolean(userIsAdminFlag || (userEmail && adminEmails.includes(userEmail)));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const session = await getServerSession(req, res, authOptions);
		if (!isAdminSession(session)) {
			return res.status(403).json({ error: 'Forbidden: Admin access required' });
		}

		const { id } = req.query;
		if (!id || typeof id !== 'string') {
			return res.status(400).json({ error: 'Invalid consultation ID' });
		}

		if (req.method === 'GET') {
			// GET: Retrieve consultation with notes
			const consultation = await ConsultationService.getConsultationById(id);
			if (!consultation) {
				return res.status(404).json({ error: 'Consultation not found' });
			}

			return res.status(200).json({
				id: consultation.id,
				notes: consultation.notes,
				admin_notes: consultation.admin_notes,
				status: consultation.status,
				start_at: consultation.start_at,
				end_at: consultation.end_at
			});
		}

		if (req.method === 'POST') {
			// POST: Add or update admin notes
			const { admin_notes } = req.body;

			if (!admin_notes || typeof admin_notes !== 'string') {
				return res.status(400).json({
					error: 'Missing required fields',
					required: ['admin_notes']
				});
			}

			// Validate notes length
			if (admin_notes.length > 5000) {
				return res.status(400).json({
					error: 'Admin notes too long (max 5000 characters)'
				});
			}

			// Check if consultation exists
			const existingConsultation = await ConsultationService.getConsultationById(id);
			if (!existingConsultation) {
				return res.status(404).json({ error: 'Consultation not found' });
			}

			// Update admin notes
			const updatedConsultation = await ConsultationService.addAdminNotes(id, admin_notes);

			return res.status(200).json({
				success: true,
				consultation: updatedConsultation,
				message: 'Admin notes updated successfully'
			});
		}

		return res.status(405).json({ error: 'Method not allowed' });
	} catch (error) {
		console.error('Consultation notes API error:', error);
		return res.status(500).json({
			error: 'Internal server error',
			message: error instanceof Error ? error.message : 'Unknown error'
		});
	}
}
