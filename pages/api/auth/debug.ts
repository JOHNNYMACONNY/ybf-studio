import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    return res.status(200).json({
      session: session ? {
        user: {
          name: session.user?.name,
          email: session.user?.email,
          image: session.user?.image,
          isAdmin: session.user?.isAdmin,
        },
        expires: session.expires,
      } : null,
      environment: {
        hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
        hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
        adminEmails: process.env.ADMIN_EMAILS?.split(','),
        nodeEnv: process.env.NODE_ENV,
      },
    });
  } catch (error) {
    console.error('Auth debug error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
