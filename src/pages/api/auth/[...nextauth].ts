// pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';
import axios from 'axios';
import { JWT } from 'next-auth/jwt';

// Extend the Session type to include accessToken
declare module 'next-auth' {
  interface Session {
    refreshToken?: string;
    accessToken?: string;
    id?: string;
  }
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number | null;
    id?: string;
  }
}

const scopes = [
  'user-read-email',
  'user-read-private',
  'user-read-recently-played',
  'user-top-read',
].join(' ');

async function refreshAccessToken(token: any) {
  try {
    const url = 'https://accounts.spotify.com/api/token';
    const response = await axios.post(url, null, {
      params: {
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
        client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const refreshedTokens = response.data;

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || '',
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET || '',
      authorization: {
        params: {
          scope: scopes,
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }: { token: JWT; user?: any; account?: any }) {
      // Initial sign in
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = account.expires_at ? account.expires_at * 1000 : Date.now() + 3600 * 1000; // Handle expiry time in milliseconds
        token.id = account.id;
        return token;
      }

      // Return previous token if the access token has not expired yet
      if (typeof token.accessTokenExpires === 'number' && Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.id = token.id as string;
      return session;
    },
  },
});
