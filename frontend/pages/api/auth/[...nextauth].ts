import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

export default NextAuth({
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const res = await axios.post(
            process.env.AUTH_ENDPOINT || 'http://localhost:3001/login',
            {
              email: credentials?.email,
              password: credentials?.password,
            }
          );

          const user = res.data;
          if (user && user.token) {
            return {
              email: user.email,
              token: user.token,
              idToken: user.idToken,
              refreshToken: user.refreshToken,
            } as any;
          }
          return null;
        } catch (e) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.idToken = (user as any).idToken;
        token.refreshToken = (user as any).refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      (session as any).idToken = token.idToken;
      (session as any).refreshToken = token.refreshToken;
      return session;
    },
  },
});
