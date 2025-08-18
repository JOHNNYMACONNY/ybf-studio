import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

type UserWithAdmin = {
  isAdmin?: boolean;
  [key: string]: unknown;
};

export function useAuth(requireAdmin = false, redirectTo = '/admin/login') {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const user = session?.user as UserWithAdmin | undefined;
  const isAdmin = user?.isAdmin;
  const isLoading = status === 'loading';
  const isAuthenticated = !!session;

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(redirectTo);
      } else if (requireAdmin && !isAdmin) {
        router.push('/admin/login');
      }
    }
  }, [isLoading, isAuthenticated, isAdmin, requireAdmin, router, redirectTo]);

  return {
    session,
    user,
    isAdmin,
    isLoading,
    isAuthenticated,
  };
}
