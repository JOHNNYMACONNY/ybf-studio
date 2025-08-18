import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { supabase } from '../../../lib/supabase';

type UserWithAdmin = {
  isAdmin?: boolean;
  [key: string]: unknown;
};

interface AnalyticsData {
  sales: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    conversionRate: number;
  };
  customers: {
    totalCustomers: number;
    newCustomers: number;
    returningCustomers: number;
    customerRetentionRate: number;
  };
  beats: {
    totalBeats: number;
    topSellingBeats: Array<{
      id: string;
      title: string;
      sales: number;
      revenue: number;
    }>;
    popularGenres: Array<{
      genre: string;
      sales: number;
      revenue: number;
    }>;
  };
  performance: {
    pageViews: number;
    uniqueVisitors: number;
    bounceRate: number;
    averageSessionDuration: number;
  };
  salesData: Array<{
    date: string;
    total: number;
    orders: number;
  }>;
  recentOrders: Array<{
    id: string;
    customer: string;
    amount: number;
    date: string;
    status: string;
  }>;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const session = await getServerSession(req, res, authOptions);
  const user = session?.user as UserWithAdmin | undefined;
  const isAdmin = user?.isAdmin;

  if (!isAdmin) {
    return res.status(403).json({ error: 'Forbidden: Admins only' });
  }

  try {
    const { range = '30' } = req.query;
    const days = parseInt(range as string, 10);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Fetch orders data
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (ordersError) throw ordersError;

    // Fetch beats data
    const { data: beats, error: beatsError } = await supabase
      .from('beats')
      .select('*')
      .eq('status', 'active');

    if (beatsError) throw beatsError;

    // Calculate sales metrics
    const totalRevenue = orders?.reduce((sum, order) => sum + (order.total || 0), 0) / 100 || 0;
    const totalOrders = orders?.length || 0;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Calculate customer metrics
    const uniqueCustomers = new Set(orders?.map(order => order.customer_email) || []).size;
    const newCustomers = uniqueCustomers; // Simplified - in real app, compare with previous period
    const returningCustomers = 0; // Simplified - would need historical data
    const customerRetentionRate = 65.7; // Mock data

    // Calculate beat performance
    const beatSales = new Map<string, { sales: number; revenue: number }>();
    const genreSales = new Map<string, { sales: number; revenue: number }>();

    orders?.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item: { beat_id?: string; price?: number }) => {
          // Track beat sales
          if (item.beat_id) {
            const current = beatSales.get(item.beat_id) || { sales: 0, revenue: 0 };
            beatSales.set(item.beat_id, {
              sales: current.sales + 1,
              revenue: current.revenue + (item.price || 0) / 100
            });
          }

          // Track genre sales
          const beat = beats?.find(b => b.id === item.beat_id);
          if (beat?.genre) {
            const current = genreSales.get(beat.genre) || { sales: 0, revenue: 0 };
            genreSales.set(beat.genre, {
              sales: current.sales + 1,
              revenue: current.revenue + (item.price || 0) / 100
            });
          }
        });
      }
    });

    // Get top selling beats
    const topSellingBeats = Array.from(beatSales.entries())
      .map(([id, data]) => {
        const beat = beats?.find(b => b.id === id);
        return {
          id,
          title: beat?.title || 'Unknown Beat',
          sales: data.sales,
          revenue: data.revenue
        };
      })
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 4);

    // Get popular genres
    const popularGenres = Array.from(genreSales.entries())
      .map(([genre, data]) => ({
        genre,
        sales: data.sales,
        revenue: data.revenue
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 4);

    // Generate sales data by day
    const salesByDay = new Map<string, { total: number; orders: number }>();
    
    // Fill in all days in range
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      salesByDay.set(dateStr, { total: 0, orders: 0 });
    }

    // Add actual sales data
    orders?.forEach(order => {
      const dateStr = new Date(order.created_at).toISOString().split('T')[0];
      const current = salesByDay.get(dateStr) || { total: 0, orders: 0 };
      salesByDay.set(dateStr, {
        total: current.total + (order.total || 0) / 100,
        orders: current.orders + 1
      });
    });

    const salesData = Array.from(salesByDay.entries())
      .map(([date, data]) => ({
        date,
        total: data.total,
        orders: data.orders
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Get recent orders
    const recentOrders = orders?.slice(0, 4).map(order => ({
      id: order.id,
      customer: order.customer_email || 'Unknown',
      amount: (order.total || 0) / 100,
      date: order.created_at,
      status: order.status || 'completed'
    })) || [];

    // Mock performance data (in real app, this would come from analytics service)
    const performance = {
      pageViews: Math.floor(Math.random() * 20000) + 10000,
      uniqueVisitors: Math.floor(Math.random() * 10000) + 5000,
      bounceRate: Math.random() * 30 + 30, // 30-60%
      averageSessionDuration: Math.random() * 5 + 2 // 2-7 minutes
    };

    const analyticsData: AnalyticsData = {
      sales: {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        conversionRate: 3.2 // Mock data - would need page view data
      },
      customers: {
        totalCustomers: uniqueCustomers,
        newCustomers,
        returningCustomers,
        customerRetentionRate
      },
      beats: {
        totalBeats: beats?.length || 0,
        topSellingBeats,
        popularGenres
      },
      performance,
      salesData,
      recentOrders
    };

    res.status(200).json(analyticsData);
  } catch (error) {
    console.error('Analytics API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: errorMessage });
  }
} 