import { NextAuthConfig } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? '',
      clientSecret: process.env.GOOGLE_SECRET ?? ''
    })
  ],
  pages: {
    signIn: '/'
  }
} satisfies NextAuthConfig;

export default authConfig;
