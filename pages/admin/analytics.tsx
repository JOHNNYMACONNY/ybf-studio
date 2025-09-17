import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]';
import AdminLayout from '../../components/AdminLayout';
import SalesChart from '../../components/SalesChart';
import CustomerMetrics from '../../components/ui/CustomerMetrics';
import BeatPerformance from '../../components/ui/BeatPerformance';
import { 
  DollarSign, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Calendar,
  Download,
  Eye,
  BarChart3
} from 'lucide-react';

type UserWithAdmin = {
  isAdmin?: boolean;
  email?: string;
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

interface AnalyticsProps {
  initialData: AnalyticsData;
}

const AnalyticsDashboard: React.FC<AnalyticsProps> = ({ initialData }) => {
  const { data: session, status } = useSession();
  const user = session?.user as UserWithAdmin | undefined;
  const [data, setData] = useState<AnalyticsData>(initialData);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('30'); // 7, 30, 90 days
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Fetch analytics data
  useEffect(() => {
    if (session && user?.isAdmin) {
      const fetchAnalytics = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/admin/analytics?range=${dateRange}`);
          if (response.ok) {
            const newData = await response.json();
            setData(newData);
          } else {
            console.error('Failed to fetch analytics data');
            setData(initialData); // Fallback to initial data
          }
        } catch (error) {
          console.error('Error fetching analytics data:', error);
          setData(initialData); // Fallback to initial data
        } finally {
          setLoading(false);
        }
      };
      
      fetchAnalytics();
    }
  }, [session, user?.isAdmin, dateRange, initialData]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-neutral-400">Loading...</div>
      </div>
    );
  }

  if (!session || !user?.isAdmin) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-100 mb-4">Admin Access Required</h1>
          <p className="text-neutral-400 mb-6">Please sign in with an admin account to access analytics.</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-neutral-100">Analytics Dashboard</h1>
            <p className="text-neutral-400 mt-2">Comprehensive insights into your business performance</p>
          </div>
          
          {/* Date Range Filter */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-neutral-400" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-neutral-100 text-sm"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-black rounded-xl ring-1 ring-neutral-700/60 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-400 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-neutral-100">${data.sales.totalRevenue.toFixed(2)}</p>
                <p className="text-green-400 text-sm flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +12.5%
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-amber-500" />
            </div>
          </div>

          <div className="bg-black rounded-xl ring-1 ring-neutral-700/60 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-400 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-neutral-100">{data.sales.totalOrders}</p>
                <p className="text-green-400 text-sm flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +8.2%
                </p>
              </div>
              <ShoppingCart className="h-8 w-8 text-amber-500" />
            </div>
          </div>

          <div className="bg-black rounded-xl ring-1 ring-neutral-700/60 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-400 text-sm">Total Customers</p>
                <p className="text-2xl font-bold text-neutral-100">{data.customers.totalCustomers}</p>
                <p className="text-green-400 text-sm flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +15.3%
                </p>
              </div>
              <Users className="h-8 w-8 text-amber-500" />
            </div>
          </div>

          <div className="bg-black rounded-xl ring-1 ring-neutral-700/60 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-400 text-sm">Conversion Rate</p>
                <p className="text-2xl font-bold text-neutral-100">{data.sales.conversionRate.toFixed(1)}%</p>
                <p className="text-green-400 text-sm flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +2.1%
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-amber-500" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sales Chart */}
          <div className="bg-black rounded-xl ring-1 ring-neutral-700/60 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-card-title font-semibold">Sales Performance</h3>
              <div className="flex items-center gap-2">
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1 text-neutral-100 text-sm"
                >
                  <option value="revenue">Revenue</option>
                  <option value="orders">Orders</option>
                </select>
              </div>
            </div>
            <div className="h-80">
              <SalesChart data={data.salesData} />
            </div>
          </div>

          {/* Customer Metrics */}
          <div>
            <CustomerMetrics
              totalCustomers={data.customers.totalCustomers}
              newCustomers={data.customers.newCustomers}
              returningCustomers={data.customers.returningCustomers}
              customerRetentionRate={data.customers.customerRetentionRate}
            />
          </div>
        </div>

        {/* Beat Performance & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Beat Performance */}
          <div>
            <BeatPerformance
              topSellingBeats={data.beats.topSellingBeats}
              popularGenres={data.beats.popularGenres}
            />
          </div>

          {/* Recent Orders */}
          <div className="bg-black rounded-xl ring-1 ring-neutral-700/60 p-6">
            <h3 className="text-card-title font-semibold mb-6">Recent Orders</h3>
            <div className="space-y-4">
              {data.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-neutral-900 rounded-lg">
                  <div>
                    <p className="text-neutral-100 font-medium">{order.customer}</p>
                    <p className="text-neutral-400 text-sm">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-neutral-100 font-medium">${order.amount.toFixed(2)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'completed' ? 'bg-green-900 text-green-300' :
                      order.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                      'bg-red-900 text-red-300'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-black rounded-xl ring-1 ring-neutral-700/60 p-6">
          <h3 className="text-card-title font-semibold mb-6">Website Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <p className="text-neutral-400 text-sm">Page Views</p>
              <p className="text-2xl font-bold text-neutral-100">{data.performance.pageViews.toLocaleString()}</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-white" />
              </div>
              <p className="text-neutral-400 text-sm">Unique Visitors</p>
              <p className="text-2xl font-bold text-neutral-100">{data.performance.uniqueVisitors.toLocaleString()}</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <p className="text-neutral-400 text-sm">Bounce Rate</p>
              <p className="text-2xl font-bold text-neutral-100">{data.performance.bounceRate.toFixed(1)}%</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Download className="h-6 w-6 text-white" />
              </div>
              <p className="text-neutral-400 text-sm">Avg. Session</p>
              <p className="text-2xl font-bold text-neutral-100">{Math.round(data.performance.averageSessionDuration)}m</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-neutral-900 p-6 rounded-lg">
              <div className="text-neutral-100">Loading analytics data...</div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AnalyticsDashboard;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  const user = session?.user as UserWithAdmin | undefined;
  const isAdmin = user?.isAdmin;

  if (!isAdmin) {
    return {
      redirect: {
        destination: '/admin',
        permanent: false,
      },
    };
  }

  // Mock data for initial load - will be replaced by API call
  const initialData: AnalyticsData = {
    sales: {
      totalRevenue: 12500.50,
      totalOrders: 89,
      averageOrderValue: 140.45,
      conversionRate: 3.2,
    },
    customers: {
      totalCustomers: 67,
      newCustomers: 23,
      returningCustomers: 44,
      customerRetentionRate: 65.7,
    },
    beats: {
      totalBeats: 24,
      topSellingBeats: [
        { id: '1', title: 'Midnight Dreams', sales: 15, revenue: 2250.00 },
        { id: '2', title: 'Urban Flow', sales: 12, revenue: 1800.00 },
        { id: '3', title: 'Electric Nights', sales: 10, revenue: 1500.00 },
        { id: '4', title: 'Acoustic Soul', sales: 8, revenue: 1200.00 },
      ],
      popularGenres: [
        { genre: 'Trap', sales: 25, revenue: 3750.00 },
        { genre: 'R&B', sales: 18, revenue: 2700.00 },
        { genre: 'Lo-Fi', sales: 15, revenue: 2250.00 },
        { genre: 'Hip Hop', sales: 12, revenue: 1800.00 },
      ],
    },
    performance: {
      pageViews: 15420,
      uniqueVisitors: 8234,
      bounceRate: 42.3,
      averageSessionDuration: 4.2,
    },
    salesData: [
      { date: '2024-01-01', total: 450, orders: 3 },
      { date: '2024-01-02', total: 320, orders: 2 },
      { date: '2024-01-03', total: 680, orders: 5 },
      { date: '2024-01-04', total: 520, orders: 4 },
      { date: '2024-01-05', total: 890, orders: 7 },
      { date: '2024-01-06', total: 750, orders: 6 },
      { date: '2024-01-07', total: 920, orders: 8 },
    ],
    recentOrders: [
      { id: '1', customer: 'john.doe@email.com', amount: 150.00, date: '2024-01-07', status: 'completed' },
      { id: '2', customer: 'sarah.smith@email.com', amount: 200.00, date: '2024-01-06', status: 'pending' },
      { id: '3', customer: 'mike.jones@email.com', amount: 120.00, date: '2024-01-05', status: 'completed' },
      { id: '4', customer: 'lisa.wilson@email.com', amount: 180.00, date: '2024-01-04', status: 'completed' },
    ],
  };

  return {
    props: {
      initialData,
    },
  };
}; 