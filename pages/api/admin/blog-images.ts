import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import fs from 'fs';
import path from 'path';

type UserWithAdmin = { isAdmin?: boolean };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  const isAdmin = Boolean((session?.user as UserWithAdmin)?.isAdmin === true);
  if (!isAdmin) return res.status(403).json({ error: 'Forbidden' });

  try {
    const imagesDir = path.join(process.cwd(), 'public', 'assets', 'blogImages');
    const entries = fs.readdirSync(imagesDir, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile())
      .map((e) => e.name)
      .filter((name) => /\.(png|jpe?g|webp|gif|svg)$/i.test(name));

    const images = files.map((name) => ({
      name,
      url: `/assets/blogImages/${name}`,
    }));

    res.status(200).json({ images });
  } catch (e) {
    res.status(200).json({ images: [] }); // empty is fine
  }
}
