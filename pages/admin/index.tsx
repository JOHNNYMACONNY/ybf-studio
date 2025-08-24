import React from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]';
import AdminLayout from '../../components/AdminLayout';
import StatCard from '../../components/ui/StatCard';
import SalesChart from '../../components/SalesChart';
import { DollarSign, Music, Users, ShoppingCart } from 'lucide-react';

type UserWithAdmin = {
  isAdmin?: boolean;
  email?: string;
  [key: string]: unknown;
};

interface AdminDashboardProps {
  stats: {
    totalRevenue: number;
    beatsSold: number;
    totalOrders: number;
  };
  salesData: { date: string; total: number }[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ stats: initialStats, salesData: initialSalesData }) => {
  const { data: session, status } = useSession();
  const user = session?.user as UserWithAdmin | undefined;
  const [stats, setStats] = React.useState(initialStats);
  const [salesData, setSalesData] = React.useState(initialSalesData);
  const [loading, setLoading] = React.useState(false);

  // Fetch data client-side when admin is authenticated
  React.useEffect(() => {
    if (session && user?.isAdmin) {
      setLoading(true);
      Promise.all([
        fetch('/api/stats').then(res => res.ok ? res.json() : initialStats),
        fetch('/api/charts').then(res => res.ok ? res.json() : initialSalesData)
      ])
      .then(([newStats, newSalesData]) => {
        setStats(newStats);
        setSalesData(newSalesData);
      })
      .catch(error => {
        console.error('Error fetching admin data:', error);
      })
      .finally(() => {
        setLoading(false);
      });
    }
  }, [session, user?.isAdmin, initialStats, initialSalesData]);

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
          <p className="text-neutral-400 mb-6">Please sign in with an admin account to access the dashboard.</p>
          <button
            onClick={() => signIn('google')}
            className="bg-amber-500 hover:bg-amber-600 text-black px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Sign In with Google
          </button>
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
            <h1 className="text-3xl font-bold text-neutral-100">Admin Dashboard</h1>
            <p className="text-neutral-400 mt-2">Welcome back, {user.email}</p>
          </div>
          <button
            onClick={() => signOut()}
            className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-4 py-2 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toFixed(2)}`}
            icon={<DollarSign className="h-5 w-5" />}
            variant="success"
          />
          <StatCard
            title="Beats Sold"
            value={stats.beatsSold.toString()}
            icon={<Music className="h-5 w-5" />}
            variant="default"
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders.toString()}
            icon={<ShoppingCart className="h-5 w-5" />}
            variant="info"
          />
          <StatCard
            title="Active Users"
            value="0"
            icon={<Users className="h-5 w-5" />}
            variant="warning"
          />
        </div>

        {/* Sales Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SalesChart data={salesData} />
          
          {/* Quick Actions */}
          <div className="bg-black rounded-xl ring-1 ring-neutral-700/60 p-6">
            <h3 className="text-card-title font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/admin/beats" className="w-full block text-center bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-lg font-medium transition-colors">
                Add New Beat
              </Link>
              <button className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-4 py-2 rounded-lg transition-colors">
                Create Blog Post
              </button>
              <button className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-4 py-2 rounded-lg transition-colors">
                View Orders
              </button>
              <button className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-4 py-2 rounded-lg transition-colors">
                Manage Services
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  const user = session?.user as UserWithAdmin | undefined;

  if (!session || !user?.isAdmin) {
    return {
      props: {
        stats: { totalRevenue: 0, beatsSold: 0, totalOrders: 0 },
        salesData: [],
      },
    };
  }

  // Return empty data - will be fetched client-side
  return {
    props: {
      stats: { totalRevenue: 0, beatsSold: 0, totalOrders: 0 },
      salesData: [],
    },
  };
};

export default AdminDashboard;
