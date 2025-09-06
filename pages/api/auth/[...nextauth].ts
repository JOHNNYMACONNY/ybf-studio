
import NextAuth, { NextAuthOptions, type Session, type User, type Account, type Profile } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
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
    async signIn({ user, account, profile }: { user: User; account: Account | null; profile?: Profile | undefined }) {
      // Log sign-in attempts for debugging
      console.log('Sign-in attempt:', {
        email: user.email,
        provider: account?.provider,
        isAdminEmail: adminEmails.includes(user.email || ''),
      });
      
      return true;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      // Add user ID from token to session
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

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
    async jwt({ token, user, account }: { token: JWT; user?: User | undefined; account?: Account | null | undefined }) {
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