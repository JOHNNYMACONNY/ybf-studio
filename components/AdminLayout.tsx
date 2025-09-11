import React from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { LayoutDashboard, Music, ShoppingCart, FileText, Settings, BarChart3, Monitor, LogOut, Users, Bot } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navLinks = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, implemented: true },
  { name: 'Beats', href: '/admin/beats', icon: Music, implemented: true },
  { name: 'Blog', href: '/admin/blog', icon: FileText, implemented: true },
  { name: 'Blog Automation', href: '/admin/automate-blog', icon: Bot, implemented: true },
  { name: 'Services', href: '/admin/services', icon: Settings, implemented: true },
  { name: 'FAQ', href: '/admin/faq', icon: FileText, implemented: true },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart, implemented: true },
  { name: 'Service Requests', href: '/admin/service-requests', icon: FileText, implemented: true },
  { name: 'Consultations', href: '/admin/consultations', icon: Users, implemented: true },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3, implemented: true },
  { name: 'Settings', href: '/admin/settings', icon: Settings, implemented: true },
  { name: 'Testing', href: '/admin/testing', icon: Monitor, implemented: true },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { session, user, isAdmin, isLoading } = useAuth(true, '/admin/login');

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-900">
        <div className="text-white">Loading admin panel...</div>
      </div>
    );
  }

  if (!session || !isAdmin) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-neutral-900 text-white">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="mb-6 text-neutral-400">You must be an admin to view this page.</p>
        <Link href="/admin/login" className="rounded-md bg-amber px-4 py-2 text-black hover:bg-amber/90">
          Go to Admin Login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-neutral-800 text-neutral-100">
      <aside className="w-64 flex-shrink-0 bg-black p-6">
        <div className="flex items-center gap-2 mb-6">
          <Image
            src="/assets/logo/main-logo.png"
            alt="YBF Studio Logo"
            width={96}
            height={24}
            className="h-6 w-auto"
            priority
          />
          <span className="font-semibold text-white">Admin Panel</span>
        </div>

        <nav className="space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors"
            >
              <link.icon className="h-5 w-5" />
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-neutral-700">
          <div className="flex items-center gap-3 mb-4">
            {user && (user.image as string) && (
              <Image
                src={user.image as string}
                alt="Profile"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {(user?.name as string) || 'Admin User'}
              </p>
              <p className="text-xs text-neutral-400 truncate">
                {(user?.email as string) || ''}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-700 hover:text-white rounded-md transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;