import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { ConsultationService } from '../../../../lib/consultation';
import { ConsultationEmailService } from '../../../../lib/consultationEmails';

type MaybeSession = { user?: { email?: string | null; isAdmin?: boolean } } | null;
function isAdminSession(session: MaybeSession): boolean {
	const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
	const userEmail = session?.user?.email;
	const userIsAdminFlag = session?.user?.isAdmin === true;
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

		const { start_at, end_at, duration_minutes, notes } = req.body;

		// Validate required fields
		if (!start_at || !end_at) {
			return res.status(400).json({
				error: 'Missing required fields',
				required: ['start_at', 'end_at']
			});
		}

		// Validate date format and logic
		const startDate = new Date(start_at);
		const endDate = new Date(end_at);
		const now = new Date();

		if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
			return res.status(400).json({ error: 'Invalid date format' });
		}

		if (startDate <= now) {
			return res.status(400).json({ error: 'Start time must be in the future' });
		}

		if (endDate <= startDate) {
			return res.status(400).json({ error: 'End time must be after start time' });
		}

		// Validate duration if provided
		if (duration_minutes && (duration_minutes < 15 || duration_minutes > 480)) {
			return res.status(400).json({ error: 'Duration must be between 15 minutes and 8 hours' });
		}

		// Get current consultation details
		const currentConsultation = await ConsultationService.getConsultationById(id);
		if (!currentConsultation) {
			return res.status(404).json({ error: 'Consultation not found' });
		}

		// Reschedule consultation
		const rescheduledConsultation = await ConsultationService.rescheduleConsultation(id, {
			start_at,
			end_at,
			duration_minutes: duration_minutes || currentConsultation.duration_minutes,
			notes
		});

		// Send reschedule email to client
		try {
			await ConsultationEmailService.sendRescheduleEmail({
				consultation: rescheduledConsultation,
				package: currentConsultation.package,
				client: currentConsultation.client
			});
		} catch (emailError) {
			console.error('Failed to send reschedule email:', emailError);
			// Don't fail the reschedule if email fails
		}

		// Send admin notification
		try {
			await ConsultationEmailService.sendAdminNotification({
				consultation: rescheduledConsultation,
				package: currentConsultation.package,
				client: currentConsultation.client
			}, 'Consultation Rescheduled');
		} catch (adminEmailError) {
			console.error('Failed to send admin notification:', adminEmailError);
			// Don't fail the reschedule if admin email fails
		}

		return res.status(200).json({
			success: true,
			consultation: rescheduledConsultation,
			message: 'Consultation rescheduled successfully'
		});
	} catch (error) {
		console.error('Reschedule consultation error:', error);
		return res.status(500).json({
			error: 'Internal server error',
			message: error instanceof Error ? error.message : 'Unknown error'
		});
	}
}
