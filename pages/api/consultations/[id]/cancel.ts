import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { ConsultationService } from '../../../../lib/consultation';
import { ConsultationEmailService } from '../../../../lib/consultationEmails';

function isAdminSession(session: any): boolean {
	const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
	const userEmail = session?.user?.email as string | undefined;
	const userIsAdminFlag = (session?.user as any)?.isAdmin === true;
	return Boolean(userIsAdminFlag || (userEmail && adminEmails.includes(userEmail)));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		const session = await getServerSession(req, res, authOptions);
		if (!isAdminSession(session)) {
			return res.status(403).json({ error: 'Forbidden: Admin access required' });
		}

		const { id } = req.query;
		if (!id || typeof id !== 'string') {
			return res.status(400).json({ error: 'Invalid consultation ID' });
		}

		const { reason, notes } = req.body;

		// Validate required fields
		if (!reason) {
			return res.status(400).json({
				error: 'Missing required fields',
				required: ['reason']
			});
		}

		// Get current consultation details
		const currentConsultation = await ConsultationService.getConsultationById(id);
		if (!currentConsultation) {
			return res.status(404).json({ error: 'Consultation not found' });
		}

		// Check if consultation can be cancelled
		if (currentConsultation.status === 'cancelled') {
			return res.status(400).json({ error: 'Consultation is already cancelled' });
		}

		if (currentConsultation.status === 'completed') {
			return res.status(400).json({ error: 'Cannot cancel completed consultation' });
		}

		// Cancel consultation
		const cancelledConsultation = await ConsultationService.cancelConsultation(id, {
			reason,
			notes
		});

		// Send cancellation email to client
		try {
			await ConsultationEmailService.sendCancellationEmail({
				consultation: cancelledConsultation,
				package: currentConsultation.package,
				client: currentConsultation.client
			});
		} catch (emailError) {
			console.error('Failed to send cancellation email:', emailError);
			// Don't fail the cancellation if email fails
		}

		// Send admin notification
		try {
			await ConsultationEmailService.sendAdminNotification({
				consultation: cancelledConsultation,
				package: currentConsultation.package,
				client: currentConsultation.client
			}, 'Consultation Cancelled');
		} catch (adminEmailError) {
			console.error('Failed to send admin notification:', adminEmailError);
			// Don't fail the cancellation if admin email fails
		}

		return res.status(200).json({
			success: true,
			consultation: cancelledConsultation,
			message: 'Consultation cancelled successfully'
		});
	} catch (error) {
		console.error('Cancel consultation error:', error);
		return res.status(500).json({
			error: 'Internal server error',
			message: error instanceof Error ? error.message : 'Unknown error'
		});
	}
}
