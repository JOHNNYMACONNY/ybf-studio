import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check admin access
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get total drafts
    const { count: totalDrafts } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'draft')
      .is('deleted_at', null);

    // Get published today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { count: publishedToday } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')
      .gte('published_at', today.toISOString())
      .lt('published_at', tomorrow.toISOString())
      .is('deleted_at', null);

    // Get last run (most recent draft)
    const { data: lastDraft } = await supabase
      .from('blog_posts')
      .select('created_at')
      .eq('status', 'draft')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const stats = {
      totalDrafts: totalDrafts || 0,
      publishedToday: publishedToday || 0,
      lastRun: lastDraft?.created_at 
        ? new Date(lastDraft.created_at).toLocaleString()
        : 'Never',
      nextScheduled: 'Manual trigger only'
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching automation stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
}
