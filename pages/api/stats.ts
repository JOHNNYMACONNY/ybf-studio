import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { supabase } from '../../lib/supabase';

interface Order {
  items: unknown[];
  total: number;
}

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
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('items, total');

    if (ordersError) throw ordersError;

    const totalOrders = orders?.length || 0;
    const totalRevenue = (orders?.reduce((sum: number, order: Order) => sum + (order.total || 0), 0) || 0) / 100;
    const beatsSold = orders?.reduce((sum: number, order: Order) => sum + ((order.items as unknown[])?.length || 0), 0) || 0;

    if (res && res.status) {
      return res.status(200).json({
        totalRevenue,
        beatsSold,
        totalOrders,
      });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    if (res && res.status) {
      return res.status(500).json({ error: errorMessage });
    }
  }
}
