
import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];

type UserWithAdmin = {
  email?: string;
  isAdmin?: boolean;
  [key: string]: unknown;
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Log sign-in attempts for debugging
      console.log('Sign-in attempt:', {
        email: user.email,
        provider: account?.provider,
        isAdminEmail: adminEmails.includes(user.email || ''),
      });
      
      return true;
    },
    async session({ session, token }) {
      // Add isAdmin property to session
      const user = session?.user as UserWithAdmin | undefined;
      if (user?.email && adminEmails.includes(user.email)) {
        user.isAdmin = true;
        console.log('Admin session created for:', user.email);
      } else if (user) {
        user.isAdmin = false;
        console.log('Regular user session created for:', user.email);
      }
      return session;
    },
    async jwt({ token, user, account }) {
      // Add admin status to JWT token
      if (user?.email && adminEmails.includes(user.email)) {
        token.isAdmin = true;
      }
      return token;
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);