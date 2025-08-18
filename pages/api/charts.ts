import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { supabase } from '../../lib/supabase';

type UserWithAdmin = {
  isAdmin?: boolean;
  [key: string]: unknown;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    if (res && res.setHeader) {
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
    return;
  }

  const session = await getServerSession(req, res, authOptions);
  const user = session?.user as UserWithAdmin | undefined;
  const isAdmin = user?.isAdmin;

  if (!isAdmin) {
    if (res && res.status) {
      return res.status(403).json({ error: 'Forbidden: Admins only' });
    }
    return;
  }

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: orders, error } = await supabase
      .from('orders')
      .select('created_at, total')
      .gte('created_at', thirtyDaysAgo.toISOString());

    if (error) throw error;

    type OrderRow = { created_at: string; total: number | null };
    const salesByDay = (orders as OrderRow[] | null || []).reduce((acc: Record<string, number>, order: OrderRow) => {
      const date = new Date(order.created_at).toISOString().split('T')[0];
      const total = (order.total || 0) / 100;
      acc[date] = (acc[date] || 0) + total;
      return acc;
    }, {} as Record<string, number>);

    const chartData = Object.keys(salesByDay)
      .map(date => ({ date, total: salesByDay[date] }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (res && res.status) {
      return res.status(200).json(chartData);
    }
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Internal server error';
    if (res && res.status) {
      return res.status(500).json({ error: errorMessage });
    }
  }
}
